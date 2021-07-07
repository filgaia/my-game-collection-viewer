import React from "react";
import { Box, Heading, Icon } from "@chakra-ui/react";
import { MdGames } from "react-icons/md";

function Header() {
  return (
    <Box w="100%" bg="blue.600" boxShadow="base">
      <Icon as={MdGames} float="left" w={8} h={8} color="white" m={2} />
      <Heading as="h4" size="md" color="white" p={3}>
        My Game collection Viewer!
      </Heading>
    </Box>
  );
}

export default Header;
