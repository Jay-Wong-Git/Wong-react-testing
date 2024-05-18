import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import ProductDetail_v1 from "../../src/components/ProductDetail_v1";
import { server } from "../mocks/server";
import { db } from "../mocks/db";

describe("ProductDetail", () => {
  const renderComponent = (productId: number) => {
    render(<ProductDetail_v1 productId={productId} />);
  };

  let productId: number;
  beforeAll(() => {
    const product = db.product.create();
    productId = product.id;
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: productId } } });
  });

  it("should render the product detail if the given id is valid", async () => {
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });

    renderComponent(productId);

    expect(
      await screen.findByText(new RegExp(product!.name, "i"))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(product!.price.toString(), "i"))
    ).toBeInTheDocument();
  });

  it("should render the given product was not found if the given id is not existed", async () => {
    server.use(http.get("/products/1", () => HttpResponse.json(null)));

    renderComponent(1);

    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });

  it("should render an error if the given id is invalid", async () => {
    renderComponent(0);

    expect(await screen.findByText(/error:/i)).toBeInTheDocument();
  });

  it("should render an error if there is an error", async () => {
    server.use(http.get(`/products/${productId}`, () => HttpResponse.error()));

    renderComponent(productId);

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
