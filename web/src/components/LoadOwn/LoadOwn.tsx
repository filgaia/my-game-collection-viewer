import React from "react";
import { Button, Flex, Input, Text } from "@chakra-ui/react";

// Accepts a bare share key or a pasted Deku Deals collection/wishlist URL
const extractKey = (value: string) =>
  value.trim().match(/([A-Za-z0-9]+)(?:\.json)?\/?$/)?.[1] ?? "";

function LoadOwn({ onLoad }: { onLoad: (key: string) => Promise<void> }) {
  const [value, setValue] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const key = extractKey(value);
    if (!key) return setFailed(true);
    setBusy(true);
    setFailed(false);
    try {
      await onLoad(key);
    } catch {
      setFailed(true);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <Flex align="center" gap={2} wrap="wrap">
        <Text fontWeight={500} whiteSpace="nowrap">
          Load your own collection:
        </Text>
        <Input
          size="sm"
          w="200px"
          placeholder="Share key"
          aria-label="Share key"
          value={value}
          isInvalid={failed}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button type="submit" size="sm" colorScheme="blue" isLoading={busy}>
          Load!
        </Button>
        {failed && (
          <Text color="red.500" fontSize="sm">
            Could not load that collection.
          </Text>
        )}
      </Flex>
    </form>
  );
}

export default LoadOwn;
