import { screen } from "@testing-library/react";
import { expect } from "vitest";
import { db } from "./mocks/db";
import { navigateTo } from "./utils";

describe("Router", () => {
  it("should render the home page for '/'", () => {
    navigateTo("/");

    expect(screen.getByRole("heading", { name: /home/i })).toBeInTheDocument();
  });

  it("should render the products page for '/products'", () => {
    navigateTo("/products");
    // screen.debug();
    expect(
      screen.getByRole("heading", { name: /products/i })
    ).toBeInTheDocument();
  });

  it("should render the product detail page for '/products/:id'", async () => {
    const product = db.product.create();
    navigateTo(`/products/${product.id}`);

    expect(
      await screen.findByRole("heading", { name: product.name })
    ).toBeInTheDocument();

    db.product.delete({ where: { id: { equals: product.id } } });
  });

  it("should render the not found page for invalid routes", async () => {
    navigateTo("/invalid-route");

    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });

  it("should render the admin page for '/admin'", () => {
    navigateTo("/admin");

    expect(screen.getByRole("heading", { name: /admin/i })).toBeInTheDocument();
  });
});
