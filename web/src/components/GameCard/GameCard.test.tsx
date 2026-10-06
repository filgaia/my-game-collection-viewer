import { fireEvent, render } from "@testing-library/react";
import GameCard from "./GameCard";

vi.mock("../GameCover/GameCover", () => ({ default: () => <div data-testid="cover" /> }));

describe("GameCard", () => {
  const game = {
    id: 1,
    name: "Game",
    link: "https://www.dekudeals.com/items/game",
    description_short: "A note",
    labels: [{ id: 3, name: "Playing", background_color: 0x64b5f6 }],
  };

  it("renders the cover, name and an external link", () => {
    const view = render(<GameCard game={game} onLabelClick={vi.fn()} />);
    expect(view.getByTestId("cover")).toBeInTheDocument();
    expect(view.getByText("Game")).toBeInTheDocument();
    const link = view.getByLabelText("Open Game");
    expect(link).toHaveAttribute("href", game.link);
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("calls onLabelClick with the label id", () => {
    const onLabelClick = vi.fn();
    const view = render(<GameCard game={game} onLabelClick={onLabelClick} />);
    fireEvent.click(view.getByText("Playing"));
    expect(onLabelClick).toHaveBeenCalledWith(3);
  });

  it("omits the link button when the game has no link", () => {
    const view = render(<GameCard game={{ ...game, link: undefined }} onLabelClick={vi.fn()} />);
    expect(view.queryByLabelText("Open Game")).not.toBeInTheDocument();
  });
});
