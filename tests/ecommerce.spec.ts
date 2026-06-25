import { expect, test } from "@playwright/test";

const image =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f8fafc'/%3E%3Ccircle cx='100' cy='100' r='54' fill='%2394a3b8'/%3E%3C/svg%3E";

const products = [
  {
    id: 1,
    title: "Fjallraven Backpack",
    price: 109.95,
    description: "A durable backpack for daily carry.",
    category: "men's clothing",
    image,
    rating: { rate: 3.9, count: 120 },
  },
  {
    id: 2,
    title: "Mens Casual Premium Slim Fit T-Shirts",
    price: 22.3,
    description: "Slim fit cotton t-shirt.",
    category: "men's clothing",
    image,
    rating: { rate: 4.1, count: 259 },
  },
  {
    id: 3,
    title: "Mens Cotton Jacket",
    price: 55.99,
    description: "Lightweight cotton jacket.",
    category: "men's clothing",
    image,
    rating: { rate: 4.7, count: 500 },
  },
  {
    id: 4,
    title: "Silver Dragon Station Chain Bracelet",
    price: 695,
    description: "Bracelet inspired by classic chain silhouettes.",
    category: "jewelery",
    image,
    rating: { rate: 4.6, count: 400 },
  },
  {
    id: 5,
    title: "Solid Gold Petite Micropave",
    price: 168,
    description: "Gold ring with subtle detailing.",
    category: "jewelery",
    image,
    rating: { rate: 3.9, count: 70 },
  },
  {
    id: 6,
    title: "White Gold Plated Princess",
    price: 9.99,
    description: "Classic jewelry for special occasions.",
    category: "jewelery",
    image,
    rating: { rate: 3, count: 400 },
  },
  {
    id: 7,
    title: "WD 2TB Elements Portable External Hard Drive",
    price: 64,
    description: "Portable external storage for media and backups.",
    category: "electronics",
    image,
    rating: { rate: 3.3, count: 203 },
  },
  {
    id: 8,
    title: "SanDisk SSD PLUS 1TB Internal SSD",
    price: 109,
    description: "Fast storage for laptops and desktops.",
    category: "electronics",
    image,
    rating: { rate: 2.9, count: 470 },
  },
  {
    id: 9,
    title: "BIYLACLESEN Women's Snowboard Jacket",
    price: 56.99,
    description: "Warm technical jacket for winter days.",
    category: "women's clothing",
    image,
    rating: { rate: 2.6, count: 235 },
  },
  {
    id: 10,
    title: "Lock and Love Women's Removable Hooded Jacket",
    price: 29.95,
    description: "Casual hooded jacket with a removable hood.",
    category: "women's clothing",
    image,
    rating: { rate: 2.9, count: 340 },
  },
];

const transparentPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64"
);

test.describe("Premium Shop end-to-end", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("https://fakestoreapi.com/products", async (route) => {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(products),
      });
    });

    await page.route("https://api.qrserver.com/**", async (route) => {
      await route.fulfill({
        contentType: "image/png",
        body: transparentPng,
      });
    });

    await page.addInitScript(() => {
      localStorage.clear();
    });
  });

  test("loads the catalog, navigation, theme toggle, and pagination", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("PREMIUM SHOP").first()).toBeVisible();
    await expect(page.locator('input[placeholder="Search by product name..."]:visible')).toBeVisible();
    await expect(page.getByTitle(/Mode/)).toBeVisible();
    await expect(page.getByTitle("Sign In")).toBeVisible();
    await expect(page.getByTitle("Open Bag")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Fjallraven Backpack" })).toBeVisible();
    await expect(page.locator("article")).toHaveCount(8);

    await page.getByRole("button", { name: "Next >" }).click();
    await expect(page.getByRole("heading", { name: /Women's Snowboard Jacket/ })).toBeVisible();

    const html = page.locator("html");
    const startedDark = (await html.getAttribute("class"))?.includes("dark") ?? false;
    await page.getByTitle(/Mode/).click();
    await expect
      .poll(async () => (await html.getAttribute("class"))?.includes("dark") ?? false)
      .toBe(!startedDark);
  });

  test("filters products by search query and category", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Fjallraven Backpack" })).toBeVisible();

    const search = page.locator('input[placeholder="Search by product name..."]:visible');
    await search.click();
    await search.pressSequentially("backpack");
    await expect(search).toHaveValue("backpack");
    await search.press("Enter");
    await expect(page).toHaveURL(/search=backpack/);
    await expect(page.locator("article")).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Fjallraven Backpack" })).toBeVisible();

    await search.press(process.platform === "darwin" ? "Meta+A" : "Control+A");
    await search.press("Backspace");
    await expect(page).toHaveURL(/search=/);

    await page.locator("main").getByRole("button", { name: /Jewelry/ }).click();
    await expect(page.locator("article")).toHaveCount(3);
    await expect(page.getByRole("heading", { name: "Silver Dragon Station Chain Bracelet" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "WD 2TB Elements Portable External Hard Drive" })).toBeHidden();
  });

  test("registers a customer and persists the session", async ({ page }) => {
    await page.goto("/login");

    await page.getByRole("button", { name: /Create one/ }).click();
    await page.getByPlaceholder("John Doe").fill("Jane Doe");
    await page.getByPlaceholder("name@example.com").fill("jane.doe@example.com");
    await page.locator('input[type="password"]').fill("securepass123");
    await page.getByRole("button", { name: "Register & Login" }).click();

    await page.waitForURL("/");
    await expect(page.getByText(/Hi, Jane Doe/)).toBeVisible();
    await expect
      .poll(async () => page.evaluate(() => localStorage.getItem("activeUser")))
      .toContain("jane.doe@example.com");
  });

  test("opens product details, changes quantity, and adds items to the bag", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /View details for Fjallraven Backpack/ }).click();
    await expect(page.getByRole("heading", { level: 2, name: "Fjallraven Backpack" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Description" })).toBeVisible();

    await page.getByRole("button", { name: "Increase quantity" }).click();
    await page.getByRole("button", { name: "Add to Bag" }).click();

    await expect(page.getByText("Added 2 items to your bag")).toBeVisible();
    await expect(page.getByTitle("Open Bag").locator("span")).toHaveText("2");

    await page.getByRole("button", { name: "Close product details" }).click();
    await expect(page.getByRole("button", { name: "Add to Bag" })).toBeHidden();
  });

  test("starts checkout and verifies every payment channel", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /Buy Fjallraven Backpack now/ }).click();
    await page.waitForURL(/\/cart\?checkout=true/);

    await expect(page.getByText(/Premium Secure Payment/)).toBeVisible();
    await expect(page.getByRole("button", { name: /Cards/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /UAE Apps/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /GPay \/ UPI/ })).toBeVisible();

    await page.getByPlaceholder("John Smith").fill("Jane Doe");
    await expect(page.getByText("JANE DOE")).toBeVisible();

    await page.getByRole("button", { name: /UAE Apps/ }).click();
    await expect(page.getByText("Total Payable in AED")).toBeVisible();
    await expect(page.getByAltText("UAE Wallet QR Code")).toBeVisible();

    await page.getByRole("button", { name: /GPay \/ UPI/ }).click();
    await expect(page.getByText("Total Payable in INR")).toBeVisible();
    await expect(page.getByAltText("UPI QR Code")).toBeVisible();
  });
});
