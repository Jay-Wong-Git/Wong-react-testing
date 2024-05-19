import { render, screen } from "@testing-library/react";

import ProductForm from "../../src/components/ProductForm";
import { Category, Product } from "../../src/entities";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";

describe("ProductForm", () => {
  let product: Product;
  let category: Category;
  beforeAll(() => {
    category = db.category.create();
    product = db.product.create({ categoryId: category.id });
  });
  afterAll(() => {
    db.product.delete({ where: { id: { equals: product.id } } });
    db.category.delete({ where: { id: { equals: category.id } } });
  });

  it("should render form fields", async () => {
    const { waitForFormToLoad, getInputs } = renderComponent();

    await waitForFormToLoad();
    const { nameInput, priceInput, categoryInput } = getInputs();

    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(categoryInput).toBeInTheDocument();
  });

  it("should populate form fields when editing a product", async () => {
    const { waitForFormToLoad, getInputs } = renderComponent(product);

    await waitForFormToLoad();
    const { nameInput, priceInput, categoryInput } = getInputs();

    expect(nameInput).toHaveValue(product.name);
    expect(priceInput).toHaveValue(product.price.toString());
    expect(categoryInput).toHaveTextContent(category.name);
  });

  const renderComponent = (product?: Product) => {
    render(<ProductForm product={product} onSubmit={vi.fn()} />, {
      wrapper: AllProviders,
    });
    return {
      waitForFormToLoad: () => screen.findByRole("form"),
      getInputs: () => {
        return {
          nameInput: screen.getByPlaceholderText(/name/i),
          priceInput: screen.getByPlaceholderText(/price/i),
          categoryInput: screen.getByRole("combobox", { name: /category/i }),
        };
      },
    };
  };
});
