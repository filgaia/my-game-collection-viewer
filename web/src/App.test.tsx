import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders header, tabs and footer", () => {
    const { getByText } = render(<App />);

    expect(getByText("My Game Collection Viewer")).toBeInTheDocument();
    expect(getByText("Catalog")).toBeInTheDocument();
    expect(getByText("Wishlist")).toBeInTheDocument();
    expect(getByText("By Filgaia")).toBeInTheDocument();
  });
});