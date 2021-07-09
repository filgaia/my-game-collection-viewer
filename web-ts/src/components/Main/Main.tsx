import React from "react";
import { Box } from "@chakra-ui/react";
import Catalog from "../Catalog/Catalog";

function Main() {
  return (
    <Box w="100%" boxShadow="base" p={2}>
      <Catalog></Catalog>
    </Box>
  );
}

export default Main;
