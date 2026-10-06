import React from "react";
import { AspectRatio, Box, Center, Image, Spinner } from "@chakra-ui/react";
import { ERROR_IMAGE } from "../../constants/index";
import { fetchGameImage } from "../../utilities/dekudeals";

interface GameCoverProps {
  name: string;
  imageUrl?: string;
  link?: string;
}

// 16:9 cover with a loading spinner and the placeholder when the image is missing or broken
function GameCover({ name, imageUrl, link }: GameCoverProps) {
  const [gridImage, setGridImage] = React.useState<string | null>(null);
  const [lookingUp, setLookingUp] = React.useState(!imageUrl);
  const [loaded, setLoaded] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    if (imageUrl) return;
    let active = true;
    setLookingUp(true);
    fetchGameImage(link, name).then((url) => {
      if (!active) return;
      setGridImage(url);
      setLookingUp(false);
    });
    return () => {
      active = false;
    };
  }, [link, name, imageUrl]);

  const src = imageUrl || gridImage || undefined;
  const showSpinner = lookingUp || (!!src && !failed && !loaded);

  React.useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  return (
    <AspectRatio ratio={16 / 9}>
      <Box position="relative" w="100%" h="100%">
        <Image
          src={src && !failed ? src : ERROR_IMAGE}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          alt={name}
          w="100%"
          h="100%"
          objectFit="cover"
        />
        {showSpinner && (
          <Center position="absolute" inset={0} bg="rgba(255,255,255,0.7)" _dark={{ bg: "rgba(26,32,44,0.7)" }}>
            <Spinner color="#1976d2" />
          </Center>
        )}
      </Box>
    </AspectRatio>
  );
}

export default GameCover;
