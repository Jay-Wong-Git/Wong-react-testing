/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";
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
    const { waitForFormToLoad } = renderComponent();

    const { nameInput, priceInput, categoryInput } = await waitForFormToLoad();

    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(categoryInput).toBeInTheDocument();
  });

  it("should populate form fields when editing a product", async () => {
    const { waitForFormToLoad } = renderComponent(product);

    const { nameInput, priceInput, categoryInput } = await waitForFormToLoad();

    expect(nameInput).toHaveValue(product.name);
    expect(priceInput).toHaveValue(product.price.toString());
    expect(categoryInput).toHaveTextContent(category.name);
  });

  it("should put focus on the name field by default", async () => {
    const { waitForFormToLoad } = renderComponent();

    const { nameInput } = await waitForFormToLoad();

    expect(nameInput).toHaveFocus();
  });

  it.each([
    { scenario: "missing", errorMessage: /required/i },
    {
      scenario: "longer than 255 characters",
      name: "a".repeat(256),
      errorMessage: /255 character/i,
    },
  ])(
    "should render an error if name is $scenario",
    async ({ name, errorMessage }) => {
      const { waitForFormToLoad, expectErrorToBeInTheDocument } =
        renderComponent();

      const { fillOutForm, validData } = await waitForFormToLoad();

      await fillOutForm({ ...validData, name });

      expectErrorToBeInTheDocument(errorMessage);
    }
  );

  it.each([
    { scenario: "missing", errorMessage: /required/i },
    { scenario: "not a number", errorMessage: /required/i },
    { scenario: "0", price: 0, errorMessage: /1/i },
    { scenario: "negative", price: -1, errorMessage: /1/i },
    { scenario: "greater than 1000", price: 1001, errorMessage: /1000/i },
  ])(
    "should render an error if price is $scenario",
    async ({ price, errorMessage }) => {
      const { waitForFormToLoad, expectErrorToBeInTheDocument } =
        renderComponent();

      const { fillOutForm, validData } = await waitForFormToLoad();

      await fillOutForm({ ...validData, price });

      expectErrorToBeInTheDocument(errorMessage);
    }
  );

  it("should call submit with the correct data", async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();

    const { fillOutForm, validData } = await waitForFormToLoad();

    await fillOutForm(validData);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...formData } = validData;
    expect(onSubmit).toHaveBeenCalledWith(formData);
  });

  it("should display a toast if submission failed ", async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();
    onSubmit.mockRejectedValue({});

    const { fillOutForm, validData } = await waitForFormToLoad();

    await fillOutForm(validData);

    const toast = await screen.findByRole("status");
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent(/unexpected error/i);
  });

  const renderComponent = (product?: Product) => {
    const onSubmit = vi.fn();

    render(
      <>
        <ProductForm product={product} onSubmit={onSubmit} />
        <Toaster />
      </>,
      {
        wrapper: AllProviders,
      }
    );

    const user = userEvent.setup();

    const waitForFormToLoad = async () => {
      await screen.findByRole("form");

      const nameInput = screen.getByPlaceholderText(/name/i);
      const priceInput = screen.getByPlaceholderText(/price/i);
      const categoryInput = screen.getByRole("combobox", { name: /category/i });
      const submitButton = screen.getByRole("button", { name: /submit/i });

      const validData = {
        id: 1,
        categoryId: category.id,
        name: "a",
        price: 10,
      };

      type FormData = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [K in keyof Product]: any;
      };
      const fillOutForm = async (product: FormData) => {
        if (product.name !== undefined)
          await user.type(nameInput, product.name);
        if (product.price != undefined)
          await user.type(priceInput, product.price.toString());
        // await user.tab();
        await user.click(categoryInput);
        const options = screen.getAllByRole("option");
        await user.click(options[0]);
        await user.click(submitButton);
      };

      return {
        nameInput,
        priceInput,
        categoryInput,
        submitButton,
        fillOutForm,
        validData,
      };
    };

    const expectErrorToBeInTheDocument = (errorMessage: RegExp) => {
      const error = screen.getByRole("alert");
      expect(error).toHaveTextContent(errorMessage);
    };

    return {
      user,
      onSubmit,
      waitForFormToLoad,
      expectErrorToBeInTheDocument,
    };
  };
});
