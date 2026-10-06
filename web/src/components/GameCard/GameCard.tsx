import React from "react";
import { Box, Button, Flex, Icon, ScaleFade, Tag, Text, Tooltip } from "@chakra-ui/react";
import { MdStickyNote2 } from "react-icons/md";
import { tagCodeToColor } from "../../utilities/index";
import GameCover from "../GameCover/GameCover";
import PlatformIcon from "../PlatformIcon/PlatformIcon";
import { IGame } from "../../models/gamesModel";

interface GameCardProps {
  game: IGame;
  platformName?: string;
  idLabelFilter?: number | null;
  onLabelClick: (idLabel: number) => void;
}

function GameCard({ game, platformName, idLabelFilter, onLabelClick }: GameCardProps) {
  const titleRef = React.useRef<HTMLParagraphElement>(null);
  const [truncated, setTruncated] = React.useState(false);

  // Re-checked on resize so the tooltip only exists while the title is cut off
  React.useLayoutEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const check = () => setTruncated(el.scrollWidth > el.clientWidth);
    check();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [game.name]);

  return (
    <ScaleFade initialScale={0.9} in style={{ height: "100%" }}>
      <Box
        display="flex"
        flexDirection="column"
        h="100%"
        bg="white"
        _dark={{ bg: "gray.700" }}
        borderRadius="4px"
        overflow="hidden"
        boxShadow="0 2px 1px -1px rgba(0,0,0,0.2), 0 1px 1px 0 rgba(0,0,0,0.14), 0 1px 3px 0 rgba(0,0,0,0.12)"
      >
        <Box position="relative">
          <GameCover name={game.name} imageUrl={game.image_url_medium} link={game.link} />
          <Flex position="absolute" top={2} right={2} gap={1} maxW="calc(100% - 16px)" flexWrap="wrap" justify="flex-end">
            {game.labels?.map((label) => {
              const selected = idLabelFilter === label.id;
              return (
                <Tag
                  key={label.id}
                  as="button"
                  size="sm"
                  borderRadius="full"
                  color="black"
                  fontWeight={selected ? "bold" : "normal"}
                  px={3}
                  cursor="pointer"
                  boxShadow="0 1px 3px rgba(0,0,0,0.4)"
                  style={{
                    backgroundColor: tagCodeToColor(label.background_color, selected ? 1 : 0.9),
                  }}
                  _hover={{ fontWeight: "bold" }}
                  onClick={() => onLabelClick(label.id)}
                >
                  {label.name}
                </Tag>
              );
            })}
          </Flex>
          <Box position="absolute" bottom={2} left={2}>
            <PlatformIcon name={platformName} />
          </Box>
        </Box>
        <Box p={4}>
          <Tooltip label={game.name} isDisabled={!truncated} hasArrow placement="top-start">
            <Text ref={titleRef} fontSize="xl" lineHeight="1.334" isTruncated color="rgba(0,0,0,0.87)" _dark={{ color: "whiteAlpha.900" }}>
              {game.name}
            </Text>
          </Tooltip>
        </Box>
        <Flex px={2} pb={2} mt="auto" align="center" justify="space-between">
          <Box>
            {game.link && (
              <Button
                as="a"
                href={game.link}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                variant="ghost"
                color="#1976d2"
                _dark={{ color: "blue.200" }}
                textTransform="uppercase"
                fontWeight="500"
              >
                View
              </Button>
            )}
          </Box>
          {game.description_short && (
            <Tooltip label={game.description_short} hasArrow placement="top" whiteSpace="pre-line">
              <span>
                <Icon as={MdStickyNote2} w={5} h={5} mr={2} color="rgba(0,0,0,0.54)" _dark={{ color: "whiteAlpha.700" }} display="block" />
              </span>
            </Tooltip>
          )}
        </Flex>
      </Box>
    </ScaleFade>
  );
}

export default GameCard;


















