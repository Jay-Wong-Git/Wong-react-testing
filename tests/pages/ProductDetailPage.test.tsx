import { screen } from "@testing-library/react";
import { Product } from "../../src/entities";
import { db } from "../mocks/db";
import { navigateTo } from "../utils";

describe("ProductDetailPage", () => {
  let product: Product;

  beforeAll(() => {
    product = db.product.create();
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: product.id } } });
  });

  it("should render the product detail page for '/products/:id'", async () => {
    navigateTo(`/products/${product.id}`);

    expect(await screen.findByRole("heading", { name: product.name }));
    screen.debug();
    expect(screen.getByText("$" + product.price)).toBeInTheDocument();
  });
});
