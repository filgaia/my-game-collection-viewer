import React from "react";
import { render, RenderResult } from "@testing-library/react";
import Catalog from "./Catalog";

describe("Catalog", () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    wrapper = render(<Catalog />);
  });

  it("renders correctly", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
