import { render } from "@testing-library/react";
import { FaApple, FaGamepad, FaPlaystation, FaSteam } from "react-icons/fa";
import { BsNintendoSwitch } from "react-icons/bs";
import PlatformIcon, { getPlatformIcon } from "./PlatformIcon";

describe("PlatformIcon", () => {
  it("maps known platform names to their icons", () => {
    expect(getPlatformIcon("Steam")).toBe(FaSteam);
    expect(getPlatformIcon("Nintendo Switch")).toBe(BsNintendoSwitch);
    expect(getPlatformIcon("PlayStation 5")).toBe(FaPlaystation);
    expect(getPlatformIcon("macOS")).toBe(FaApple);
  });

  it("falls back to a generic gamepad for unknown platforms", () => {
    expect(getPlatformIcon("Atari 2600")).toBe(FaGamepad);
  });

  it("renders nothing without a platform name", () => {
    expect(getPlatformIcon(undefined)).toBeUndefined();
    const { container } = render(<PlatformIcon />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders an icon for a platform", () => {
    const { container } = render(<PlatformIcon name="Steam" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
