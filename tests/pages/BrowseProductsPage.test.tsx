import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { server } from "../mocks/server";
import { delay, http, HttpResponse } from "msw";
import { Theme } from "@radix-ui/themes";

describe("BrowseProducts", () => {
  const renderComponent = () => {
    render(<BrowseProducts />, { wrapper: Theme });
  };

  it("should render a loading skeleton while fetching categories", () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderComponent();

    // screen.debug();
    expect(
      screen.getByRole("progressbar", { name: /categories/i })
    ).toBeInTheDocument();
  });

  it("should hide the loading skeleton when categories are fetched", async () => {
    renderComponent();
    await waitForElementToBeRemoved(() =>
      screen.getByRole("progressbar", { name: /categories/i })
    );
  });

  it("should render a loading skeleton while fetching products", () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderComponent();

    expect(
      screen.getByRole("progressbar", { name: /products/i })
    ).toBeInTheDocument();
  });

  it("should hide the loading skeleton when products are fetched", async () => {
    renderComponent();
    await waitForElementToBeRemoved(() =>
      screen.getByRole("progressbar", { name: /products/i })
    );
  });
});
