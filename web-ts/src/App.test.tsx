import React from "react";
import { render, RenderResult } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    wrapper = render(<App />);
  });

  it("renders correctly", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
