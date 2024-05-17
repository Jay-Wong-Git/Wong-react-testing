import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import ProductList from "../../src/components/ProductList";
import { server } from "../mocks/server";

describe("ProductList", () => {
  const renderComponent = () => {
    render(<ProductList />);
  };

  it("should render the list of products", async () => {
    renderComponent();

    const items = await screen.findAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });

  it("should rend No products available if no product is found", async () => {
    server.use(http.get("products", () => HttpResponse.json([])));
    renderComponent();

    const message = await screen.findByText(/no products/i);
    expect(message).toBeInTheDocument();
  });
});
