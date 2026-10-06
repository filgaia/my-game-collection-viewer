import React from "react";
import { Flex, Heading, Icon, IconButton, Tooltip, useColorMode } from "@chakra-ui/react";
import { MdDarkMode, MdGames, MdLightMode, MdSortByAlpha } from "react-icons/md";

interface HeaderProps {
  onSort?: () => void;
}

function Header({ onSort }: HeaderProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Flex
      as="header"
      w="100%"
      h="56px"
      px={4}
      align="center"
      bg="#1976d2"
      color="white"
      boxShadow="0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12)"
    >
      <Icon as={MdGames} w={6} h={6} />
      <Heading as="h1" flexGrow={1} fontSize="xl" fontWeight={500} textAlign="center">
        My Game Collection Viewer
      </Heading>
      <Tooltip label="Order list">
        <IconButton
          aria-label="Order list"
          icon={<Icon as={MdSortByAlpha} w={6} h={6} />}
          variant="ghost"
          color="inherit"
          _hover={{ bg: "whiteAlpha.200" }}
          onClick={onSort}
        />
      </Tooltip>
      <Tooltip label={isDark ? "Light mode" : "Dark mode"}>
        <IconButton
          aria-label="Toggle color mode"
          icon={<Icon as={isDark ? MdLightMode : MdDarkMode} w={6} h={6} />}
          variant="ghost"
          color="inherit"
          _hover={{ bg: "whiteAlpha.200" }}
          onClick={toggleColorMode}
        />
      </Tooltip>
    </Flex>
  );
}

export default Header;