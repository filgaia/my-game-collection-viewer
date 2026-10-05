import React from "react";
import { render, RenderResult } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer", () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    wrapper = render(<Footer />);
  });

  it("renders correctly", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
