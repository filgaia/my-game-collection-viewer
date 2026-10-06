import { fireEvent, render, waitFor } from "@testing-library/react";
import LoadOwn from "./LoadOwn";

describe("LoadOwn", () => {
  const submitWith = (onLoad: (key: string) => Promise<void>, value: string) => {
    const view = render(<LoadOwn onLoad={onLoad} />);
    fireEvent.change(view.getByLabelText("Share key"), { target: { value } });
    fireEvent.click(view.getByText("Load!"));
    return view;
  };

  it("extracts the key from a pasted Deku Deals URL", async () => {
    const onLoad = vi.fn().mockResolvedValue(undefined);
    submitWith(onLoad, "https://www.dekudeals.com/collection/abc123");
    await waitFor(() => expect(onLoad).toHaveBeenCalledWith("abc123"));
  });

  it("shows an error when loading fails", async () => {
    const view = submitWith(vi.fn().mockRejectedValue(new Error("nope")), "abc123");
    expect(await view.findByText("Could not load that collection.")).toBeInTheDocument();
  });

  it("shows an error and skips loading when the key is empty", () => {
    const onLoad = vi.fn();
    const view = submitWith(onLoad, "   ");
    expect(onLoad).not.toHaveBeenCalled();
    expect(view.getByText("Could not load that collection.")).toBeInTheDocument();
  });
});
