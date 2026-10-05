import React from "react";
import { Icon, Tooltip } from "@chakra-ui/react";
import { FaApple, FaGamepad, FaPlaystation, FaSteam, FaWindows, FaXbox } from "react-icons/fa";
import { BsNintendoSwitch } from "react-icons/bs";
import { SiEpicgames, SiGogdotcom } from "react-icons/si";
import { IconType } from "react-icons";

const PLATFORM_ICONS: [RegExp, IconType][] = [
  [/steam/i, FaSteam],
  [/xbox/i, FaXbox],
  [/playstation|\bps\d?\b|psn/i, FaPlaystation],
  [/switch|nintendo/i, BsNintendoSwitch],
  [/epic/i, SiEpicgames],
  [/gog/i, SiGogdotcom],
  [/mac|apple/i, FaApple],
  [/\bpc\b|windows/i, FaWindows],
];

export const getPlatformIcon = (name?: string): IconType | undefined =>
  name ? PLATFORM_ICONS.find(([pattern]) => pattern.test(name))?.[1] ?? FaGamepad : undefined;

function PlatformIcon({ name }: { name?: string }) {
  const icon = getPlatformIcon(name);
  if (!icon) return null;

  return (
    <Tooltip label={name}>
      <span>
        <Icon as={icon} w={5} h={5} color="white" display="block" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))" />
      </span>
    </Tooltip>
  );
}

export default PlatformIcon;
