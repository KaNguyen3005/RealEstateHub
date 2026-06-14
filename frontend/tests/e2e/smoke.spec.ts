import { expect, test } from "@playwright/test";

test("guest can browse properties, filter, view detail, and submit contact request", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /An tâm tìm kiếm/i })).toBeVisible();
  await expect(page.getByText("Căn hộ trung tâm Quận 1").first()).toBeVisible();

  await page.goto("/properties");
  await expect(page).toHaveURL(/\/properties/);
  await expect(page.getByRole("heading", { name: /Danh sách đã kiểm duyệt/i })).toBeVisible();
  await expect(page.getByText("Tìm thấy 2 bất động sản")).toBeVisible();

  await page.getByLabel("Tỉnh / Thành phố").fill("Ho Chi Minh");
  await page.getByLabel("Loại bất động sản").selectOption("apartment");
  await page.getByRole("button", { name: /Áp dụng bộ lọc/i }).click();

  await expect(page).toHaveURL(/city=Ho\+Chi\+Minh/);
  await expect(page.getByText("Căn hộ trung tâm Quận 1").first()).toBeVisible();

  await page.getByRole("link", { name: "Xem chi tiết" }).first().click();
  await expect(page).toHaveURL(/\/properties\/property-1/);
  await expect(page.getByRole("heading", { name: "Căn hộ trung tâm Quận 1" })).toBeVisible();
  await expect(page.getByText("Nguyen Seller")).toBeVisible();

  await page.getByLabel("Họ và tên").fill("Interested Buyer");
  await page.getByLabel("Email").fill("buyer@example.com");
  await page.getByLabel("Số điện thoại").fill("0901234567");
  await page.getByLabel("Lời nhắn").fill("I would like to schedule a viewing this week.");
  await page.getByRole("button", { name: "Gửi yêu cầu" }).click();

  await expect(page.getByText("Contact request submitted successfully")).toBeVisible();
});

test("compare page loads selected property details from persisted compare state", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "realestatehub-compare-store",
      JSON.stringify({
        state: {
          propertyIds: ["property-1", "property-2"],
        },
        version: 0,
      })
    );
  });

  await page.goto("/compare");

  await expect(page.getByRole("heading", { name: /So sánh tối đa 3 bất động sản/i })).toBeVisible();
  await expect(page.getByText("Căn hộ trung tâm Quận 1")).toBeVisible();
  await expect(page.getByText("Nhà phố yên tĩnh tại Thảo Điền")).toBeVisible();
  await expect(page.getByText("Diện tích", { exact: true })).toBeVisible();
});

test("buyer can log in with mocked backend response", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("Email").fill("buyer@example.com");
  await page.getByLabel("Mật khẩu").fill("Password123");
  await page.getByRole("button", { name: "Đăng nhập" }).click();

  await expect(page.getByText("Login successful")).toBeVisible();
  await expect(page.getByText("Test Buyer").first()).toBeVisible();
});
