import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { Category, Product } from "../../src/entities";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import AllProviders from "../AllProviders";
import { db, getProductsByCategory } from "../mocks/db";
import { simulateDelay, simulateError } from "../utils";

describe("BrowseProducts", () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2, 3, 4].forEach((i) => {
      const category = db.category.create({ name: "Category " + i });
      categories.push(category);
      [1, 2, 3].forEach((j) => {
        products.push(
          db.product.create({
            name: "Product " + i + j,
            categoryId: category.id,
          })
        );
      });
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((category) => category.id);
    const productIds = products.map((product) => product.id);

    db.category.deleteMany({ where: { id: { in: categoryIds } } });
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

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

  it("should filter products by category", async () => {
    const { selectCategory, expectProductsToBeInTheDocument } =
      renderComponent();

    const selectedCategory = categories[0];
    await selectCategory(new RegExp(selectedCategory.name, "i"));

    const products = getProductsByCategory(selectedCategory.id);
    expectProductsToBeInTheDocument(products);
  });

  it("should render all products if All category is selected", async () => {
    const { selectCategory, expectProductsToBeInTheDocument } =
      renderComponent();

    await selectCategory(/all/i);

    const products = db.product.getAll();
    expectProductsToBeInTheDocument(products);
  });

  const renderComponent = () => {
    const user = userEvent.setup();

    const getCategoriesSkeleton = () =>
      screen.getByRole("progressbar", { name: /categories/i });

    const getCategoryCombobox = () => screen.queryByRole("combobox");

    const getProductsSkeleton = () =>
      screen.getByRole("progressbar", { name: /products/i });

    const selectCategory = async (name: RegExp) => {
      await waitForElementToBeRemoved(getCategoriesSkeleton);
      const combobox = getCategoryCombobox();
      await user.click(combobox!);
      const option = screen.getByRole("option", { name });
      await user.click(option);
    };

    const expectProductsToBeInTheDocument = (products: Product[]) => {
      products.forEach((product) => {
        expect(
          screen.getByText(new RegExp(product.name, "i"))
        ).toBeInTheDocument();
      });
    };

    render(
      <AllProviders>
        <BrowseProducts />
      </AllProviders>
    );

    return {
      user,
      getProductsSkeleton,
      getCategoriesSkeleton,
      getCategoryCombobox,
      selectCategory,
      expectProductsToBeInTheDocument,
    };
  };
});
