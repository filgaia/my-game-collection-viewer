import React from "react";
import { render, RenderResult } from "@testing-library/react";
import Main from "./Main";

describe("Main", () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    wrapper = render(<Main />);
  });

  it("renders correctly", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
