import { render, screen } from "@testing-library/react";

import ProductDetail from "../../src/components/ProductDetail";
import { products } from "../mocks/data";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";

describe("ProductDetail", () => {
  const renderComponent = (productId: number) => {
    render(<ProductDetail productId={productId} />);
  };

  it("should render the product detail if the given id is valid", async () => {
    renderComponent(products[0].id);
    expect(
      await screen.findByText(new RegExp(products[0].name, "i"))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(products[0].price.toString(), "i"))
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
});
