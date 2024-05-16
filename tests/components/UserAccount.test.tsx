import { render, screen } from "@testing-library/react";
import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

describe("UserAccount", () => {
  it("should render the user name", () => {
    const user: User = { id: 1, name: "Andy", isAdmin: true };
    render(<UserAccount user={user} />);
    expect(
      screen.getByText(new RegExp(`${user.name}`, "i"))
    ).toBeInTheDocument();
  });

  it("should render the edit button if the user is admin", () => {
    render(<UserAccount user={{ id: 1, name: "Andy", isAdmin: true }} />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/edit/i);
  });

  it("should not render the edit button if the user is not admin", () => {
    render(<UserAccount user={{ id: 1, name: "Andy" }} />);
    const button = screen.queryByRole("button");
    expect(button).not.toBeInTheDocument();
  });
});
