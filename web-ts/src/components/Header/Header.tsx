import React from "react";
import { Box, Heading, Icon } from "@chakra-ui/react";
import { MdGames } from "react-icons/md";

function Header() {
  return (
    <Box w="100%" bg="#2B6CB0">
      <Icon
        as={MdGames}
        float="left"
        w={24}
        h={24}
        color="white"
        mt={16}
        ml={16}
      />
      <Heading as="h4" size="md" color="white">
        My Game collection Viewer!
      </Heading>
    </Box>
  );
}

export default Header;
