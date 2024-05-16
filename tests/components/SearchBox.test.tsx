import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SearchBox from "../../src/components/SearchBox";

describe("SearchBox", () => {
  const renderComponent = () => {
    const onChange = vi.fn();
    render(<SearchBox onChange={onChange} />);
    return {
      input: screen.getByPlaceholderText(/search/i),
      onChange,
      user: userEvent.setup(),
    };
  };

  it("should render an input field ", () => {
    const { input } = renderComponent();
    expect(input).toBeInTheDocument();
  });

  it("should not call onChange when input field is empty", async () => {
    const { input, onChange, user } = renderComponent();

    const searchTerm = "";
    await user.type(input, searchTerm + "{enter}");

    expect(onChange).not.toHaveBeenCalled();
  });

  it("should call onChange when Enter is pressed", async () => {
    const { input, onChange, user } = renderComponent();

    const searchTerm = "SearchTerm";
    await user.type(input, searchTerm + "{enter}");

    expect(onChange).toHaveBeenCalledWith(searchTerm);
  });
});
