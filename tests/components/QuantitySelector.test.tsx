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

    const addToCart = async () => {
      await user.click(getAddToCartButton()!);
    };

    const increment = async () => {
      const { incrementButton } = getQuantityControls();
      await user.click(incrementButton!);
    };

    const decrement = async () => {
      const { decrementButton } = getQuantityControls();
      await user.click(decrementButton!);
    };

    return {
      user,
      getAddToCartButton,
      getQuantityControls,
      addToCart,
      increment,
      decrement,
    };
  };

  it("should render the Add to Cart button", () => {
    const { getAddToCartButton } = renderComponent();
    expect(getAddToCartButton()).toBeInTheDocument();
  });

  it("should add the product to the cart", async () => {
    const { getAddToCartButton, getQuantityControls, addToCart } =
      renderComponent();

    await addToCart();

    const { quantity, incrementButton, decrementButton } =
      getQuantityControls();

    expect(quantity).toHaveTextContent("1");
    expect(incrementButton).toBeInTheDocument();
    expect(decrementButton).toBeInTheDocument();
    expect(getAddToCartButton()).not.toBeInTheDocument();
  });

  it("should increase the quantity", async () => {
    const { addToCart, increment, getQuantityControls } = renderComponent();

    await addToCart();
    await increment();

    const { quantity } = getQuantityControls();
    expect(quantity).toHaveTextContent("2");
  });

  it("should decrease the quantity", async () => {
    const { getQuantityControls, addToCart, increment, decrement } =
      renderComponent();

    await addToCart();

    await increment();

    const { quantity } = getQuantityControls();
    expect(quantity).toHaveTextContent("2");

    await decrement();

    expect(quantity).toHaveTextContent("1");
  });

  it("should remove the product from the cart", async () => {
    const { getAddToCartButton, getQuantityControls, addToCart, decrement } =
      renderComponent();

    await addToCart();

    await decrement();

    const { quantity, decrementButton, incrementButton } =
      getQuantityControls();
    expect(decrementButton).not.toBeInTheDocument();
    expect(incrementButton).not.toBeInTheDocument();
    expect(quantity).not.toBeInTheDocument();
    expect(getAddToCartButton()).toBeInTheDocument();
  });
});
