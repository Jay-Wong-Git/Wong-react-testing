import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import routes from "../src/routes";

describe("Router", () => {
  const renderComponent = (entry: string) => {
    const router = createMemoryRouter(routes, { initialEntries: [entry] });
    render(<RouterProvider router={router} />);
  };

  it("should render the home page for '/'", () => {
    renderComponent("/");

    expect(screen.getByRole("heading", { name: /home/i })).toBeInTheDocument();
  });

  it("should render the products page for '/products'", () => {
    renderComponent("/products");
    // screen.debug();
    expect(
      screen.getByRole("heading", { name: /products/i })
    ).toBeInTheDocument();
  });
});
