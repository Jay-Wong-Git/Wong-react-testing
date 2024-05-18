import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";
import { Category, Product } from "../../src/entities";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { CartProvider } from "../../src/providers/CartProvider";
import { db } from "../mocks/db";
import { simulateDelay, simulateError } from "../utils";

describe("BrowseProducts", () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2, 3, 4].forEach((item) => {
      categories.push(db.category.create({ name: "Category " + item }));
      products.push(db.product.create({ name: "Product " + item }));
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((category) => category.id);
    const productIds = products.map((product) => product.id);

    db.category.deleteMany({ where: { id: { in: categoryIds } } });
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  const renderComponent = () => {
    render(
      <Theme>
        <CartProvider>
          <BrowseProducts />
        </CartProvider>
      </Theme>
    );
    return {
      user: userEvent.setup(),
      getProductsSkeleton: () =>
        screen.getByRole("progressbar", { name: /products/i }),
      getCategoriesSkeleton: () =>
        screen.getByRole("progressbar", { name: /categories/i }),
      getCategoryCombobox: () => screen.queryByRole("combobox"),
    };
  };

  it("should render a loading skeleton while fetching categories", () => {
    simulateDelay("/categories");

    renderComponent();

    // screen.debug();
    expect(
      screen.getByRole("progressbar", { name: /categories/i })
    ).toBeInTheDocument();
  });

  it("should hide the loading skeleton when categories are fetched", async () => {
    const { getCategoriesSkeleton } = renderComponent();
    await waitForElementToBeRemoved(getCategoriesSkeleton);
  });

  it("should render a loading skeleton while fetching products", () => {
    simulateDelay("/products");

    renderComponent();

    expect(
      screen.getByRole("progressbar", { name: /products/i })
    ).toBeInTheDocument();
  });

  it("should hide the loading skeleton when products are fetched", async () => {
    const { getProductsSkeleton } = renderComponent();
    await waitForElementToBeRemoved(getProductsSkeleton);
  });

  it("should not render an error if categories cannot be fetched", async () => {
    simulateError("/categories");

    const { getCategoriesSkeleton, getCategoryCombobox } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(getCategoryCombobox()).not.toBeInTheDocument();
  });

  it("should render an error if products cannot be fetched", async () => {
    simulateError("/products");

    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);

    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  it("should render a list of category", async () => {
    const { user, getCategoriesSkeleton, getCategoryCombobox } =
      renderComponent();
    await waitForElementToBeRemoved(getCategoriesSkeleton);

    await user.click(getCategoryCombobox()!);

    expect(screen.getByRole("option", { name: /all/i })).toBeInTheDocument();

    categories.forEach((category) => {
      expect(
        screen.getByRole("option", { name: category.name })
      ).toBeInTheDocument();
    });
  });

  it("should render a list of product", async () => {
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });
});
