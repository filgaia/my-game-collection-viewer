import { Box, Flex, Icon, IconButton, ScaleFade, Tag, Text, Tooltip } from "@chakra-ui/react";
import { MdOpenInNew, MdStickyNote2 } from "react-icons/md";
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
        <Box position="relative" overflow="hidden" role="group">
          <GameCover name={game.name} imageUrl={game.image_url_medium} link={game.link} />
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            px={3}
            py={2}
            bg="blackAlpha.800"
            color="white"
            transform="translateY(-100%)"
            transition="transform 0.25s ease"
            _groupHover={{ transform: "translateY(0)" }}
            _groupFocusWithin={{ transform: "translateY(0)" }}
            pointerEvents="none"
            zIndex={1}
          >
            <Text fontSize="md" fontWeight="500" lineHeight="1.3" noOfLines={2}>
              {game.name}
            </Text>
          </Box>
          <Flex position="absolute" top={2} right={2} zIndex={2} gap={1} maxW="calc(100% - 16px)" flexWrap="wrap" justify="flex-end">
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
          <Flex position="absolute" bottom={2} right={2} gap={2} align="center">
            {game.description_short && (
              <Tooltip label={game.description_short} hasArrow placement="top" whiteSpace="pre-line">
                <Flex align="center" justify="center" w={8} h={8} borderRadius="full" color="white" bg="blackAlpha.700" _hover={{ bg: "blackAlpha.900" }}>
                  <Icon as={MdStickyNote2} w={5} h={5} />
                </Flex>
              </Tooltip>
            )}
            {game.link && (
              <Tooltip label="Open link" hasArrow placement="top">
                <IconButton
                  as="a"
                  href={game.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${game.name}`}
                  icon={<Icon as={MdOpenInNew} w={5} h={5} />}
                  size="sm"
                  isRound
                  color="white"
                  bg="blackAlpha.700"
                  _hover={{ bg: "blackAlpha.900" }}
                />
              </Tooltip>
            )}
          </Flex>
        </Box>      </Box>
    </ScaleFade>
  );
}

export default GameCard;


















