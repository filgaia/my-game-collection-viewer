import React from "react";
import { render } from "@testing-library/react";
import Main from "./Main";
import useGames from "../../hooks/useGames";

function Harness() {
  const games = useGames();
  return <Main games={games} />;
}

describe("Main", () => {
  it("renders the catalog and wishlist tabs", () => {
    const { getByText } = render(<Harness />);

    expect(getByText("Catalog")).toBeInTheDocument();
    expect(getByText("Wishlist")).toBeInTheDocument();
  });
});