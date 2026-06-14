const Conversation = require("../src/models/Conversation");
const conversationService = require("../src/services/conversation.service");
const messageService = require("../src/services/message.service");
const { connectTestDb, clearTestDb, disconnectTestDb } = require("./helpers/testDb");
const { createTestProperty, createTestUser } = require("./helpers/factories");

describe("Chat services", () => {
  beforeAll(connectTestDb);
  afterEach(clearTestDb);
  afterAll(disconnectTestDb);

  it("creates a conversation by deriving the seller from the property owner", async () => {
    const seller = await createTestUser({ role: "seller" });
    const buyer = await createTestUser({ role: "user" });
    const property = await createTestProperty(seller._id, { status: "approved" });

    const result = await conversationService.createOrGetConversation(property._id, buyer);
    const participantIds = result.conversation.participants.map((participant) => String(participant._id));

    expect(result.created).toBe(true);
    expect(String(result.conversation.propertyId._id)).toBe(String(property._id));
    expect(participantIds).toEqual(expect.arrayContaining([String(buyer._id), String(seller._id)]));
  });

  it("reuses an existing conversation for the same buyer seller and property", async () => {
    const seller = await createTestUser({ role: "seller" });
    const buyer = await createTestUser({ role: "user" });
    const property = await createTestProperty(seller._id, { status: "approved" });

    const first = await conversationService.createOrGetConversation(property._id, buyer);
    const second = await conversationService.createOrGetConversation(property._id, buyer);

    expect(first.created).toBe(true);
    expect(second.created).toBe(false);
    expect(String(second.conversation._id)).toBe(String(first.conversation._id));
  });

  it("prevents users from starting a conversation with themselves", async () => {
    const seller = await createTestUser({ role: "seller" });
    const property = await createTestProperty(seller._id, { status: "approved" });

    await expect(conversationService.createOrGetConversation(property._id, seller)).rejects.toMatchObject({
      statusCode: 409,
      message: "You cannot start a conversation with yourself"
    });
  });

  it("blocks new conversations for sold or rented properties", async () => {
    const seller = await createTestUser({ role: "seller" });
    const buyer = await createTestUser({ role: "user" });
    const property = await createTestProperty(seller._id, { status: "sold" });

    await expect(conversationService.createOrGetConversation(property._id, buyer)).rejects.toMatchObject({
      statusCode: 409,
      message: "Property is closed for chat"
    });
  });

  it("saves messages from participants and updates lastMessage", async () => {
    const seller = await createTestUser({ role: "seller" });
    const buyer = await createTestUser({ role: "user" });
    const property = await createTestProperty(seller._id, { status: "approved" });
    const { conversation } = await conversationService.createOrGetConversation(property._id, buyer);

    const message = await messageService.createMessage(conversation._id, "Hello, is this still available?", buyer);
    const updatedConversation = await Conversation.findById(conversation._id);

    expect(message.content).toBe("Hello, is this still available?");
    expect(String(message.senderId._id)).toBe(String(buyer._id));
    expect(updatedConversation.lastMessage).toBe("Hello, is this still available?");
  });

  it("prevents non-participants from sending messages", async () => {
    const seller = await createTestUser({ role: "seller" });
    const buyer = await createTestUser({ role: "user" });
    const outsider = await createTestUser({ role: "user" });
    const property = await createTestProperty(seller._id, { status: "approved" });
    const { conversation } = await conversationService.createOrGetConversation(property._id, buyer);

    await expect(
      messageService.createMessage(conversation._id, "I should not be here.", outsider)
    ).rejects.toMatchObject({
      statusCode: 403,
      message: "You are not a participant of this conversation"
    });
  });

  it("blocks new messages when the linked property is closed", async () => {
    const seller = await createTestUser({ role: "seller" });
    const buyer = await createTestUser({ role: "user" });
    const property = await createTestProperty(seller._id, { status: "approved" });
    const { conversation } = await conversationService.createOrGetConversation(property._id, buyer);

    property.status = "rented";
    await property.save();

    await expect(
      messageService.createMessage(conversation._id, "Can I still visit?", buyer)
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "Property is closed for chat"
    });
  });
});
