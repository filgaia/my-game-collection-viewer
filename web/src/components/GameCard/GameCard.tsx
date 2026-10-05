import React from "react";
import { Box, Button, ScaleFade, Tag, Text } from "@chakra-ui/react";
import { CARD_OPACITY } from "../../constants/index";
import { tagCodeToColor } from "../../utilities/index";
import GameCover from "../GameCover/GameCover";
import { IGame } from "../../models/gamesModel";

interface GameCardProps {
  game: IGame;
  platformName?: string;
  idLabelFilter?: number | null;
  onLabelClick: (idLabel: number) => void;
}

function GameCard({ game, platformName, idLabelFilter, onLabelClick }: GameCardProps) {
  return (
    <ScaleFade initialScale={0.9} in>
      <Box
        display="flex"
        flexDirection="column"
        h="100%"
        bg="white"
        borderRadius="4px"
        overflow="hidden"
        boxShadow="0 2px 1px -1px rgba(0,0,0,0.2), 0 1px 1px 0 rgba(0,0,0,0.14), 0 1px 3px 0 rgba(0,0,0,0.12)"
      >
        <GameCover name={game.name} imageUrl={game.image_url_medium} />
        <Box p={4}>
          <Text fontSize="xl" lineHeight="1.334" color="rgba(0,0,0,0.87)">
            {game.name}
          </Text>
          <Text fontSize="sm" color="rgba(0,0,0,0.6)">
            {platformName}
          </Text>
        </Box>
        <Box px={4} pb={4} flexGrow={1}>
          <Text fontSize="sm" isTruncated>
            {game.description_short}
          </Text>
        </Box>
        <Box px={4} pb={2} textAlign="left" minH="30px">
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
                mr={2}
                px={3}
                cursor="pointer"
                style={{
                  backgroundColor: tagCodeToColor(
                    label.background_color,
                    selected ? 1 : CARD_OPACITY
                  ),
                }}
                _hover={{
                  fontWeight: "bold",
                  boxShadow: "2px 2px 1px 0px rgba(0,0,0,0.5)",
                }}
                onClick={() => onLabelClick(label.id)}
              >
                {label.name}
              </Tag>
            );
          })}
        </Box>
        <Box px={2} pb={2} textAlign="left">
          <Button
            as={game.link ? "a" : undefined}
            href={game.link}
            target="_blank"
            rel="noopener noreferrer"
            size="sm" variant="ghost" color="#1976d2" textTransform="uppercase" fontWeight="500">
            View
          </Button>
        </Box>
      </Box>
    </ScaleFade>
  );
}

export default GameCard;





