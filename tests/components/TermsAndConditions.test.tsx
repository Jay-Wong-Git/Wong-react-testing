import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TermsAndConditions from "../../src/components/TermsAndConditions";

describe("TermsAndConditions", () => {
  const renderComponent = () => {
    render(<TermsAndConditions />);
    return {
      heading: screen.getByRole("heading"),
      checkbox: screen.getByRole("checkbox"),
      button: screen.getByRole("button"),
    };
  };

  it("should render correct text and initial status", () => {
    const { heading, checkbox, button } = renderComponent();

    expect(heading).toHaveTextContent(/terms/i);
    expect(checkbox).not.toBeChecked();
    expect(button).toBeDisabled();
  });

  it("should enable the button when the checkbox is checked", async () => {
    // render
    const { checkbox, button } = renderComponent();

    // act
    const user = userEvent.setup();
    await user.click(checkbox);

    // assert
    expect(checkbox).toBeChecked();
    expect(button).toBeEnabled();
  });
});
