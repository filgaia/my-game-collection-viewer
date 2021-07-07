import React from "react";
import { render, RenderResult } from "@testing-library/react";
import Header from "./Header";

describe("Header", () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    wrapper = render(<Header />);
  });

  it("renders correctly", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
