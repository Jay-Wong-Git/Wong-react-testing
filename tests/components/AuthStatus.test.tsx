import { render, screen } from "@testing-library/react";
import AuthStatus from "../../src/components/AuthStatus";
import { mockAuthState } from "../utils";

describe("AuthStatus", () => {
  const renderComponent = () => {
    render(<AuthStatus />);
  };

  it("should render a loading message while fetching auth status", () => {
    mockAuthState({ isLoading: true, isAuthenticated: false, user: undefined });

    renderComponent();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should render a login button if the user is not authenticated", () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: false,
      user: undefined,
    });

    renderComponent();

    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /log out/i })
    ).not.toBeInTheDocument();
  });

  it("should render a logout button if the user is authenticated", () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: true,
      user: { name: "Andy" },
    });

    renderComponent();

    // screen.debug();
    expect(screen.getByText(/andy/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /log out/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /log in/i })
    ).not.toBeInTheDocument();
  });
});
