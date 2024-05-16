// import { it, expect, describe } from "vitest";
// import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import Greet from "../../src/components/Greet";

describe("Greet", () => {
  it("should render hello with the name when name is provided", () => {
    render(<Greet name="Andy" />);
    // screen.debug();
    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/hello andy/i);
  });

  it("should render login button when name is not provided", () => {
    render(<Greet />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/login/i);
  });
});
