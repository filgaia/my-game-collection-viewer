import { render } from "@testing-library/react";
import Unlocks from "./Unlocks";

vi.mock("@xyflow/react", () => ({
  ReactFlow: ({ nodes, edges }: { nodes: unknown[]; edges: unknown[] }) => (
    <div data-testid="flow" data-nodes={nodes.length} data-edges={edges.length} />
  ),
  Background: () => null,
  Controls: () => null,
  Panel: () => null,
  Handle: () => null,
  useViewport: () => ({ zoom: 1 }),
  Position: { Left: "left", Right: "right" },
  MarkerType: { ArrowClosed: "arrowclosed" },
}));
vi.mock("@xyflow/react/dist/style.css", () => ({}));
vi.mock("../GameCard/GameCard", () => ({ default: () => null }));

describe("Unlocks", () => {
  it("shows an empty message when no game has an Unlocks note", () => {
    const view = render(
      <Unlocks collection={[{ id: 1, name: "A", description_short: "plain" }]} wishlist={[]} platforms={[]} />
    );
    expect(view.getByText(/No games with an "Unlocks" note/)).toBeInTheDocument();
  });

  it("builds a graph from Unlocks notes", () => {
    const view = render(
      <Unlocks
        collection={[{ id: 1, name: "A", description_short: "Unlocks: B" }]}
        wishlist={[]}
        platforms={[]}
      />
    );
    const flow = view.getByTestId("flow");
    expect(Number(flow.dataset.nodes)).toBeGreaterThanOrEqual(2);
    expect(Number(flow.dataset.edges)).toBeGreaterThanOrEqual(1);
  });
});
