import React from "react";
import { render } from "@testing-library/react";
import Header from "./Header";

describe("Header", () => {
  it("renders the title and sort button", () => {
    const onSort = vi.fn();
    const { getByText, getByLabelText } = render(<Header onSort={onSort} />);

    expect(getByText("My Game Collection Viewer")).toBeInTheDocument();
    getByLabelText("Order list").click();
    expect(onSort).toHaveBeenCalled();
  });
});