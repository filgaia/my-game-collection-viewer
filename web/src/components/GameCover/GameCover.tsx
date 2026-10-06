import React from "react";
import { AspectRatio, Box, Center, IconButton, Image, Spinner } from "@chakra-ui/react";
import { MdRefresh } from "react-icons/md";
import { ERROR_IMAGE } from "../../constants/index";
import { fetchGameImage } from "../../utilities/dekudeals";

interface GameCoverProps {
  name: string;
  imageUrl?: string;
  link?: string;
}

// 16:9 cover with a loading spinner, a retry button when the lookup fails, and the placeholder when there is no image
function GameCover({ name, imageUrl, link }: GameCoverProps) {
  const [gridImage, setGridImage] = React.useState<string | null>(null);
  const [lookingUp, setLookingUp] = React.useState(!imageUrl);
  const [lookupFailed, setLookupFailed] = React.useState(false);
  const [attempt, setAttempt] = React.useState(0);
  const [loaded, setLoaded] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    if (imageUrl) return;
    let active = true;
    setLookingUp(true);
    setLookupFailed(false);
    fetchGameImage(link, name)
      .then((url) => active && setGridImage(url))
      .catch(() => active && setLookupFailed(true))
      .finally(() => active && setLookingUp(false));
    return () => {
      active = false;
    };
  }, [link, name, imageUrl, attempt]);

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
        {lookupFailed && !lookingUp && (
          <Center position="absolute" inset={0} bg="rgba(255,255,255,0.7)" _dark={{ bg: "rgba(26,32,44,0.7)" }}>
            <IconButton
              aria-label={`Retry loading the cover of ${name}`}
              title="Couldn't load the cover. Retry"
              icon={<MdRefresh size={24} />}
              size="sm"
              isRound
              colorScheme="blue"
              onClick={() => setAttempt((n) => n + 1)}
            />
          </Center>
        )}
      </Box>
    </AspectRatio>
  );
}

export default GameCover;
