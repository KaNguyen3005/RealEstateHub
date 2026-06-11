const { Server } = require("socket.io");
const User = require("../models/User");
const { verifyAccessToken } = require("../utils/token");
const { getConversationById } = require("../services/conversation.service");
const messageService = require("../services/message.service");
const { createHttpError } = require("../utils/httpError");

let ioInstance = null;

function getConversationRoomName(conversationId) {
  return `conversation:${conversationId}`;
}

function emitSocketError(socket, ack, message) {
  const payload = {
    success: false,
    message,
  };

  if (typeof ack === "function") {
    ack(payload);
    return;
  }

  socket.emit("error", payload);
}

async function authenticateSocket(socket, next) {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.userId).select("-passwordHash -refreshToken");

    if (!user || user.status === "blocked") {
      return next(new Error("Unauthorized"));
    }

    socket.user = {
      userId: user._id.toString(),
      role: user.role,
    };

    next();
  } catch (_error) {
    next(new Error("Unauthorized"));
  }
}

function initializeSocket(server) {
  if (ioInstance) {
    return ioInstance;
  }

  ioInstance = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  ioInstance.use(authenticateSocket);

  ioInstance.on("connection", (socket) => {
    socket.on("join_conversation", async (payload = {}, ack) => {
      try {
        const conversationId = String(payload?.conversationId || "").trim();

        if (!conversationId) {
          throw createHttpError(400, "conversationId is required");
        }

        const conversation = await getConversationById(conversationId);
        const participantIds = (conversation.participants || []).map((participant) =>
          String(participant?._id || participant)
        );

        if (!participantIds.includes(String(socket.user.userId))) {
          throw createHttpError(403, "You are not a participant of this conversation");
        }

        const roomName = getConversationRoomName(conversation._id.toString());
        socket.join(roomName);

        const successPayload = {
          success: true,
          message: "Joined conversation successfully",
          data: {
            conversationId: conversation._id.toString(),
            room: roomName,
          },
        };

        if (typeof ack === "function") {
          ack(successPayload);
          return;
        }

        socket.emit("conversation_joined", successPayload);
      } catch (error) {
        emitSocketError(socket, ack, error.message || "Failed to join conversation");
      }
    });

    socket.on("send_message", async (payload = {}, ack) => {
      try {
        const conversationId = String(payload?.conversationId || "").trim();

        if (!conversationId) {
          throw createHttpError(400, "conversationId is required");
        }

        const message = await messageService.createMessage(conversationId, payload?.content, socket.user);
        const roomName = getConversationRoomName(conversationId);
        const messagePayload = message.toJSON();

        ioInstance.to(roomName).emit("receive_message", messagePayload);

        const successPayload = {
          success: true,
          message: "Message sent successfully",
          data: messagePayload,
        };

        if (typeof ack === "function") {
          ack(successPayload);
        }
      } catch (error) {
        emitSocketError(socket, ack, error.message || "Failed to send message");
      }
    });

    socket.emit("connected", {
      success: true,
      message: "Socket.io connected",
    });
  });

  return ioInstance;
}

function getIO() {
  if (!ioInstance) {
    throw new Error("Socket.io has not been initialized");
  }

  return ioInstance;
}

module.exports = {
  initializeSocket,
  getIO,
};
