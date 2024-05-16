import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TermsAndConditions from "../../src/components/TermsAndConditions";

describe("TermsAndConditions", () => {
  it("should render correct text and initial status", () => {
    render(<TermsAndConditions />);
    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/terms/i);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    // const button = screen.getByRole("button", { name: /submit/i });
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it("should enable the button when the checkbox is checked", async () => {
    // render
    render(<TermsAndConditions />);

    // act
    const checkbox = screen.getByRole("checkbox");
    const user = userEvent.setup();
    await user.click(checkbox);

    // assert
    expect(checkbox).toBeChecked();
    expect(screen.getByRole("button")).toBeEnabled();
  });
});
