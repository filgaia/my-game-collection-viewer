import React from "react";
import { Box, Tag, Text, useColorMode } from "@chakra-ui/react";
import {
  Background,
  Controls,
  Edge,
  Handle,
  MarkerType,
  Node,
  NodeProps,
  Panel,
  Position,
  ReactFlow,
  useViewport,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import GameCard from "../GameCard/GameCard";
import { buildUnlockGroups } from "../../utilities/unlocks";
import { IGame, ILabel, IPlatform } from "../../models/gamesModel";

interface UnlocksProps {
  collection: IGame[];
  wishlist: IGame[];
  platforms: IPlatform[];
}

interface GameNodeData extends Record<string, unknown> {
  game: IGame;
  platformName?: string;
}

const noop = () => undefined;

// Ownership pills use ids far from the Deku Deals status labels
const OWNED_LABEL: ILabel = { id: 9001, name: "Owned", background_color: 0x81c784 };
const WISHLIST_LABEL: ILabel = { id: 9002, name: "Wishlist", background_color: 0xf06292 };

const NODE_WIDTH = 240;
const NODE_HEIGHT = 230; // GameCard height: 16:9 cover + title + footer
const COLUMN_GAP = 140;
const ROW_GAP = 30;
const GROUP_GAP = 60;
const GROUP_WIDTH = NODE_WIDTH * 2 + COLUMN_GAP;
const GROUP_COLUMN_GAP = 120;

const groupHeight = (targets: number) => targets * NODE_HEIGHT + (targets - 1) * ROW_GAP;

function GameNode({ data }: NodeProps<Node<GameNodeData>>) {
  return (
    <Box w={`${NODE_WIDTH}px`} className="nopan nowheel" pointerEvents="all">
      <Handle type="target" position={Position.Left} />
      <GameCard game={data.game} platformName={data.platformName} onLabelClick={noop} />
      <Handle type="source" position={Position.Right} />
    </Box>
  );
}

const nodeTypes = { game: GameNode };

function ZoomLevel() {
  const { zoom } = useViewport();
  return (
    <Panel position="top-right">
      <Tag>{`Zoom ${Math.round(zoom * 100)}% (${zoom.toFixed(2)})`}</Tag>
    </Panel>
  );
}

// 1 column below 1440px, 2 up to Full HD, 3 above it
const getColumns = (width: number) => (width < 1440 ? 1 : width > 1920 ? 3 : 2);

function useColumns() {
  const [columns, setColumns] = React.useState(() => getColumns(window.innerWidth));

  React.useEffect(() => {
    const update = () => setColumns(getColumns(window.innerWidth));
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return columns;
}

// Height left between the graph top and the footer, so the page itself does not scroll
function useAvailableHeight(ref: React.RefObject<HTMLElement>) {
  const [height, setHeight] = React.useState(500);

  React.useLayoutEffect(() => {
    const update = () => {
      const top = ref.current?.getBoundingClientRect().top ?? 0;
      const footer = document.querySelector("footer")?.getBoundingClientRect().height ?? 0;
      const panelPadding = 12; // bottom padding of the tab panel
      setHeight(Math.max(300, window.innerHeight - top - footer - panelPadding));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [ref]);

  return height;
}

function Unlocks({ collection, wishlist, platforms }: UnlocksProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { colorMode } = useColorMode();
  const height = useAvailableHeight(containerRef);
  const columns = useColumns();
  const { nodes, edges, extent } = React.useMemo(() => {
    const groups = buildUnlockGroups(collection, wishlist);
    const byName = new Map<string, IGame>();
    [...wishlist, ...collection].forEach((g) => byName.set(g.name.toLowerCase(), g));
    const owned = new Set(collection.map((g) => g.name.toLowerCase()));
    const wished = new Set(wishlist.map((g) => g.name.toLowerCase()));

    const nodes: Node<GameNodeData>[] = [];
    const edges: Edge[] = [];
    // Groups fill the grid row by row; each row is as tall as its tallest group
    const rowTops: number[] = [];
    let top = 0;
    for (let r = 0; r * columns < groups.length; r++) {
      rowTops.push(top);
      const row = groups.slice(r * columns, (r + 1) * columns);
      top += Math.max(...row.map((grp) => groupHeight(grp.targets.length))) + GROUP_GAP;
    }

    groups.forEach(({ game, inWishlist, targets }, g) => {
      const id = `src-${g}`;
      const height = groupHeight(targets.length);
      const x = (g % columns) * (GROUP_WIDTH + GROUP_COLUMN_GAP);
      const y = rowTops[Math.floor(g / columns)];
      nodes.push({
        id,
        type: "game",
        position: { x, y: y + (height - NODE_HEIGHT) / 2 },
        data: {
          game: inWishlist ? { ...game, labels: [...(game.labels ?? []), WISHLIST_LABEL] } : game,
          platformName: platforms.find((p) => p.id === game.platform_id)?.name,
        },
      });

      targets.forEach((target, t) => {
        const key = target.name.toLowerCase();
        const known = byName.get(key);
        const targetId = `${id}-${t}`;
        nodes.push({
          id: targetId,
          type: "game",
          position: { x: x + NODE_WIDTH + COLUMN_GAP, y: y + t * (NODE_HEIGHT + ROW_GAP) },
          data: {
            game: {
              id: -1,
              name: target.name,
              image_url_medium: known?.image_url_medium,
              link: known?.link,
              labels: owned.has(key) ? [OWNED_LABEL] : wished.has(key) ? [WISHLIST_LABEL] : [],
            },
            platformName: target.platform,
          },
        });
        edges.push({
          id: `e-${targetId}`,
          source: id,
          target: targetId,
          markerEnd: { type: MarkerType.ArrowClosed, color: "#607d8b" },
          style: { stroke: "#607d8b", strokeWidth: 2 },
        });
      });
    });

    // Limit panning to the area that actually contains nodes
    const padding = 40;
    const extent: [[number, number], [number, number]] = [
      [-padding, -padding],
      [
        Math.max(...nodes.map((n) => n.position.x)) + NODE_WIDTH + padding,
        Math.max(...nodes.map((n) => n.position.y)) + NODE_HEIGHT + padding,
      ],
    ];

    return { nodes, edges, extent };
  }, [collection, wishlist, platforms, columns]);

  if (nodes.length === 0) {
    return (
      <Text textAlign="center" color="rgba(0,0,0,0.6)" _dark={{ color: "whiteAlpha.700" }}>
        No games with an "Unlocks" note were found.
      </Text>
    );
  }

  return (
    <Box ref={containerRef} h={`${height}px`} bg="white" _dark={{ bg: "gray.700" }} borderRadius="4px">
      <ReactFlow
        colorMode={colorMode}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        nodesConnectable={false}
        nodesDraggable={false}
        elementsSelectable={false}
        defaultViewport={{ x: 20, y: 20, zoom: 1 }}
        panOnScroll
        minZoom={0.1}
        translateExtent={extent}
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls showInteractive={false} />
        <ZoomLevel />
      </ReactFlow>
    </Box>
  );
}

export default Unlocks;










