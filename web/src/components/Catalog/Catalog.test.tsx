import React from "react";
import { render, RenderResult } from "@testing-library/react";
import Catalog from "./Catalog";

vi.mock("react-lazyload", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("Catalog", () => {
  let wrapper: RenderResult;
  const onLabelClick = vi.fn();

  beforeEach(() => {
    wrapper = render(
      <Catalog
        games={[
          {
            id: 1,
            name: "Game",
            description_short: "Description",
            platform_id: 1,
            labels: [{ id: 7, name: "PS3", background_color: -16529089 }],
          },
        ]}
        platforms={[{ id: 1, name: "Playstation 3" }]}
        hasMoreItems={false}
        loading={false}
        loadMore={() => undefined}
        onLabelClick={onLabelClick}
      />
    );
  });

  it("renders the game card", () => {
    expect(wrapper.getByText("Game")).toBeInTheDocument();
    expect(wrapper.container.querySelector("svg")).toBeInTheDocument();
    expect(wrapper.queryByText("Description")).not.toBeInTheDocument(); // note only shows on hover
    expect(wrapper.getByText("PS3")).toBeInTheDocument();
  });

  it("filters by label when clicking its tag", () => {
    wrapper.getByText("PS3").click();
    expect(onLabelClick).toHaveBeenCalledWith(7);
  });
});
