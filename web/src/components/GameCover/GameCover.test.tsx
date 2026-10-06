import { fireEvent, render, waitFor } from "@testing-library/react";
import GameCover from "./GameCover";
import { fetchGameImage } from "../../utilities/dekudeals";

vi.mock("../../utilities/dekudeals", () => ({ fetchGameImage: vi.fn() }));

describe("GameCover", () => {
  beforeEach(() => {
    vi.mocked(fetchGameImage).mockReset();
  });

  it("uses the provided image without looking it up", () => {
    const view = render(<GameCover name="Game" imageUrl="https://img/a.jpg" />);
    expect(view.getByAltText("Game")).toHaveAttribute("src", "https://img/a.jpg");
    expect(fetchGameImage).not.toHaveBeenCalled();
  });

  it("looks the cover up by link and name", async () => {
    vi.mocked(fetchGameImage).mockResolvedValue("https://cdn.dekudeals.com/c.jpg");
    const view = render(<GameCover name="Game" link="https://www.dekudeals.com/items/game" />);
    await waitFor(() =>
      expect(view.getByAltText("Game")).toHaveAttribute("src", "https://cdn.dekudeals.com/c.jpg")
    );
    expect(fetchGameImage).toHaveBeenCalledWith("https://www.dekudeals.com/items/game", "Game");
  });

  it("shows a retry button when the lookup fails and retries on click", async () => {
    vi.mocked(fetchGameImage).mockRejectedValueOnce(new Error("proxy")).mockResolvedValue(null);
    const view = render(<GameCover name="Game" />);
    const retry = await view.findByLabelText("Retry loading the cover of Game");
    fireEvent.click(retry);
    await waitFor(() => expect(fetchGameImage).toHaveBeenCalledTimes(2));
    await waitFor(() =>
      expect(view.queryByLabelText("Retry loading the cover of Game")).not.toBeInTheDocument()
    );
  });
});
