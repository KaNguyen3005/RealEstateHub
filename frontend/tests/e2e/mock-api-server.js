const http = require("http");

const seller = {
  _id: "seller-1",
  fullName: "Nguyen Seller",
  email: "seller@example.com",
  role: "seller",
  avatar: "",
};

const user = {
  _id: "user-1",
  fullName: "Test Buyer",
  email: "buyer@example.com",
  role: "user",
  status: "active",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const properties = [
  {
    _id: "property-1",
    title: "Căn hộ trung tâm Quận 1",
    description: "Căn hộ sáng thoáng, đầy đủ tiện ích, phù hợp gia đình trẻ muốn ở gần trung tâm.",
    type: "apartment",
    purpose: "sale",
    price: 3200000000,
    area: 82,
    bedrooms: 2,
    bathrooms: 2,
    address: "123 Nguyen Hue",
    city: "Ho Chi Minh",
    district: "District 1",
    ward: "Ben Nghe",
    latitude: 10.7769,
    longitude: 106.7009,
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"],
    amenities: ["Balcony", "Parking", "Pool"],
    ownerId: seller,
    status: "approved",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    _id: "property-2",
    title: "Nhà phố yên tĩnh tại Thảo Điền",
    description: "Nhà phố nhiều ánh sáng, khu dân cư yên tĩnh, kết nối nhanh tới trung tâm.",
    type: "house",
    purpose: "rent",
    price: 25000000,
    area: 120,
    bedrooms: 3,
    bathrooms: 3,
    address: "45 Quoc Huong",
    city: "Ho Chi Minh",
    district: "Thu Duc",
    ward: "Thao Dien",
    latitude: 10.8023,
    longitude: 106.7321,
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80"],
    amenities: ["Garden", "Garage"],
    ownerId: seller,
    status: "approved",
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
];

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://127.0.0.1:3000",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function filterProperties(searchParams) {
  const keyword = String(searchParams.get("keyword") || "").toLowerCase();
  const city = String(searchParams.get("city") || "").toLowerCase();
  const type = searchParams.get("type");
  const purpose = searchParams.get("purpose");

  return properties.filter((property) => {
    if (keyword && !`${property.title} ${property.description} ${property.address}`.toLowerCase().includes(keyword)) {
      return false;
    }

    if (city && !property.city.toLowerCase().includes(city)) {
      return false;
    }

    if (type && property.type !== type) {
      return false;
    }

    if (purpose && property.purpose !== purpose) {
      return false;
    }

    return true;
  });
}

function createMockApiServer(port = 5010) {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || "/", `http://127.0.0.1:${port}`);

    if (req.method === "OPTIONS") {
      sendJson(res, 204, {});
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/properties") {
      const items = filterProperties(url.searchParams);
      sendJson(res, 200, {
        success: true,
        message: "Properties retrieved successfully",
        data: {
          items,
          page: 1,
          limit: Number(url.searchParams.get("limit") || 10),
          totalItems: items.length,
          totalPages: 1,
        },
      });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/properties/compare") {
      const ids = String(url.searchParams.get("ids") || "").split(",").filter(Boolean);
      sendJson(res, 200, {
        success: true,
        message: "Compare properties retrieved successfully",
        data: {
          items: properties.filter((property) => ids.includes(property._id)),
        },
      });
      return;
    }

    if (req.method === "GET" && url.pathname.startsWith("/api/properties/")) {
      const id = url.pathname.split("/").pop();
      const property = properties.find((item) => item._id === id);

      if (!property) {
        sendJson(res, 404, {
          success: false,
          message: "Property not found",
        });
        return;
      }

      sendJson(res, 200, {
        success: true,
        message: "Property retrieved successfully",
        data: {
          item: property,
        },
      });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/auth/refresh") {
      sendJson(res, 401, {
        success: false,
        message: "Refresh token is required",
      });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/auth/me") {
      const authorization = req.headers.authorization || "";

      if (!authorization.startsWith("Bearer ")) {
        sendJson(res, 401, {
          success: false,
          message: "Access token is required",
        });
        return;
      }

      sendJson(res, 200, {
        success: true,
        message: "Current user fetched successfully",
        data: {
          user,
        },
      });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/auth/login") {
      const body = await readBody(req);

      if (!body.email || !body.password) {
        sendJson(res, 400, {
          success: false,
          message: "Email and password are required",
        });
        return;
      }

      sendJson(res, 200, {
        success: true,
        message: "Login successful",
        data: {
          user,
          accessToken: "e2e-access-token",
        },
      });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/contact-requests") {
      sendJson(res, 201, {
        success: true,
        message: "Contact request submitted successfully",
        data: {
          _id: "contact-request-1",
          status: "new",
        },
      });
      return;
    }

    sendJson(res, 404, {
      success: false,
      message: `No mock route for ${req.method} ${url.pathname}`,
    });
  });

  return {
    start() {
      return new Promise((resolve) => {
        server.listen(port, "127.0.0.1", resolve);
      });
    },
    stop() {
      return new Promise((resolve) => {
        server.closeAllConnections?.();
        server.closeIdleConnections?.();
        server.close(() => resolve());
      });
    },
  };
}

module.exports = {
  createMockApiServer,
};
