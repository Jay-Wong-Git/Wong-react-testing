import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import QuantitySelector from "../../src/components/QuantitySelector";
import { Product } from "../../src/entities";
import { CartProvider } from "../../src/providers/CartProvider";
import { db } from "../mocks/db";

describe("QuantitySelector", () => {
  let product: Product;
  beforeAll(() => {
    product = db.product.create();
  });
  afterAll(() => {
    db.product.delete({ where: { id: { equals: product.id } } });
  });

  const renderComponent = () => {
    render(<QuantitySelector product={product} />, { wrapper: CartProvider });

    const user = userEvent.setup();
    const getAddToCartButton = () =>
      screen.queryByRole("button", {
        name: /add to cart/i,
      });
    const getQuantityControls = () => ({
      quantity: screen.queryByRole("status"),
      incrementButton: screen.queryByRole("button", { name: /\+/i }),
      decrementButton: screen.queryByRole("button", { name: /-/i }),
    });

    return {
      user,
      getAddToCartButton,
      getQuantityControls,
    };
  };

  it("should render the Add to Cart button", () => {
    const { getAddToCartButton } = renderComponent();
    expect(getAddToCartButton()).toBeInTheDocument();
  });

  it("should add the product to the cart", async () => {
    const { user, getAddToCartButton, getQuantityControls } = renderComponent();

    await user.click(getAddToCartButton()!);

    const { quantity, incrementButton, decrementButton } =
      getQuantityControls();

    expect(quantity).toHaveTextContent("1");
    expect(incrementButton).toBeInTheDocument();
    expect(decrementButton).toBeInTheDocument();
    expect(getAddToCartButton()).not.toBeInTheDocument();
  });

  it("should increase the quantity", async () => {
    const { user, getAddToCartButton, getQuantityControls } = renderComponent();

    await user.click(getAddToCartButton()!);
    const { incrementButton, quantity } = getQuantityControls();
    await user.click(incrementButton!);

    expect(quantity).toHaveTextContent("2");
  });

  it("should decrease the quantity", async () => {
    const { user, getAddToCartButton, getQuantityControls } = renderComponent();

    await user.click(getAddToCartButton()!);
    const { incrementButton, quantity, decrementButton } =
      getQuantityControls();
    await user.click(incrementButton!);
    expect(quantity).toHaveTextContent("2");

    await user.click(decrementButton!);
    expect(quantity).toHaveTextContent("1");
  });

  it("should remove the product from the cart", async () => {
    const { user, getAddToCartButton, getQuantityControls } = renderComponent();

    await user.click(getAddToCartButton()!);
    const { quantity, decrementButton, incrementButton } =
      getQuantityControls();
    await user.click(decrementButton!);

    expect(decrementButton).not.toBeInTheDocument();
    expect(incrementButton).not.toBeInTheDocument();
    expect(quantity).not.toBeInTheDocument();
    expect(getAddToCartButton()).toBeInTheDocument();
  });
});
