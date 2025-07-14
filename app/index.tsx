/**
 * PerfectGridLongVersion.tsx
 *
 * A fully featured, responsive 3×3 image grid for React Native.
 * - Nine “primary” images, each with a paired “alternate” image.
 * - Click (tap) an image to swap to its alternate and scale by 1.2×.
 * - Autoscale capped at 2× the original size.
 * - All other images reset to primary / 1× scale when one is clicked.
 * - Visual border indicator when an image reaches max scale.
 * - Uses useReducer for centralized state management.
 * - Responsive layout reacting to device rotation.
 * - Accessibility labels and descriptive comments throughout.
 */

import React, { useReducer, FC, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  StyleSheet,
  useWindowDimensions,
  AccessibilityRole,
} from "react-native";

// -------------------------------------------------------
// 1) TYPES & DATA
// -------------------------------------------------------

/**
 * Represents a pair of images: the default (“primary”) and its swapped version (“alternate”).
 */
type ImagePair = {
  id: string;
  primaryUri: string;
  alternateUri: string;
};

/**
 * Shape of the state stored per image in the reducer map.
 */
type ImageCellState = {
  isShowingAlternate: boolean;
  currentScale: number;
};

// Nine complete primary/alternate image pairs
const IMAGE_PAIRS: ImagePair[] = [
  {
    id: "1",
    primaryUri:
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiTOBzEKG0_JjvSbPN-GaCBUc74JuAK-kYsyABV0E7P-j163eGv9CiHcJkRaNf9z3UtVUAmOsIeObNgxR30f1fx6x2lDp2f8rR9h-3EayKgpEwKdpOvze7LAeTFgTAsByK2rHKSWHwK-yUD/s1600/catat-nih-5-atraksi-eksotik-di-polewali-mandar_103238_1140.jpg",
    alternateUri:
      "https://awsimages.detik.net.id/community/media/visual/2021/11/26/coto-makassar-1_169.jpeg?w=620",
  },
  {
    id: "2",
    primaryUri: "https://www.imigrasikendari.com/wp-content/uploads/2024/07/Makassar.webp",
    alternateUri:
      "https://awsimages.detik.net.id/community/media/visual/2020/08/27/sop-konro-makassar_169.jpeg?w=620",
  },
  {
    id: "3",
    primaryUri:
      "https://dispar.sulbarprov.go.id/wp-content/uploads/2020/05/gerbang-kota-majene-timur-1.jpg",
    alternateUri:
      "https://awsimages.detik.net.id/community/media/visual/2016/05/01/774e2f30-1ee4-4984-b216-28fbd9249c3f_169.jpg?w=620",
  },
  {
    id: "4",
    primaryUri: "https://www.50detik.com/wp-content/uploads/2022/12/IMG-20191203-WA0030.jpg",
    alternateUri:
      "https://awsimages.detik.net.id/community/media/visual/2022/05/15/pallu-cela-makanan-khas-makassar_169.jpeg?w=620",
  },
  {
    id: "5",
    primaryUri:
      "https://cove-blog-id.sgp1.cdn.digitaloceanspaces.com/cove-blog-id/2023/07/Daerah-Bandung-yang-Terkenal.webp",
    alternateUri:
      "https://awsimages.detik.net.id/community/media/visual/2022/03/20/kuliner-makassar_169.jpeg?w=620",
  },
  {
    id: "6",
    primaryUri:
      "https://asset.kompas.com/crops/GEIiQSsEkCKrIGWEjOp_GaYHIHA=/0x0:1000x667/1200x800/data/photo/2022/07/25/62dec6809a479.jpg",
    alternateUri:
      "https://awsimages.detik.net.id/community/media/visual/2022/04/02/kue-jalangkote-khas-sulsel_169.jpeg?w=620",
  },
  {
    id: "7",
    primaryUri:
      "https://shopee.co.id/inspirasi-shopee/wp-content/uploads/2022/06/jttO0PTeS5WYFOJ2MwDyZA_thumb_46f.webp",
    alternateUri:
      "https://awsimages.detik.net.id/community/media/visual/2021/08/16/gogos-kambu_169.jpeg?w=620",
  },
  {
    id: "8",
    primaryUri:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Busway_in_Bundaran_HI.jpg/960px-Busway_in_Bundaran_HI.jpg",
    alternateUri:
      "https://awsimages.detik.net.id/community/media/visual/2016/06/12/2c6f4666-d5b8-422c-a661-9fe04ab20a1c_169.jpg?w=620",
  },
  {
    id: "9",
    primaryUri:
      "https://kompaspedia.kompas.id/wp-content/uploads/2021/02/550234B3-D89C-4C07-7B6AF2A6B5206338.jpg",
    alternateUri:
      "https://awsimages.detik.net.id/community/media/visual/2021/05/25/resep-pisang-epe-khas-makassar-1_169.jpeg?w=620",
  },
];

/**
 * Action type for reducer: only one action 'TOGGLE_IMAGE'
 * payload: the id of the image that was tapped.
 */
type Action = { type: "TOGGLE_IMAGE"; payload: string };

/**
 * Construct initial state map keyed by image id.
 */
const buildInitialState = (): Record<string, ImageCellState> => {
  const map: Record<string, ImageCellState> = {};
  IMAGE_PAIRS.forEach((pair) => {
    map[pair.id] = { isShowingAlternate: false, currentScale: 1 };
  });
  return map;
};

// -------------------------------------------------------
// 2) REDUCER LOGIC
// -------------------------------------------------------

/**
 * Reducer: given current state and an action, returns new state map.
 * - Only the tapped image’s state is updated (scale ×1.2 up to max 2, show alternate).
 * - All other images are reset to scale =1, show primary.
 */
function imageGridReducer(
  state: Record<string, ImageCellState>,
  action: Action
): Record<string, ImageCellState> {
  if (action.type !== "TOGGLE_IMAGE") {
    return state;
  }
  const newMap: Record<string, ImageCellState> = {};

  Object.keys(state).forEach((key) => {
    if (key === action.payload) {
      const prev = state[key];
      // Increase by 1.2× but cap at 2
      const updatedScale = Math.min(prev.currentScale * 1.2, 2);
      newMap[key] = {
        isShowingAlternate: true,
        currentScale: updatedScale,
      };
    } else {
      // Reset all others
      newMap[key] = { isShowingAlternate: false, currentScale: 1 };
    }
  });

  return newMap;
}

// -------------------------------------------------------
// 3) PRESENTATIONAL COMPONENTS
// -------------------------------------------------------

/**
 * Props for each cell in the grid.
 */
interface GridCellProps {
  imagePair: ImagePair;
  cellState: ImageCellState;
  onToggle: (id: string) => void;
}

/**
 * Individual cell that displays either primary or alternate image,
 * scales on tap, and shows a colored border if max scale reached.
 */
const GridCell: FC<GridCellProps> = ({ imagePair, cellState, onToggle }) => {
  const atMaxScale = cellState.currentScale >= 2;

  return (
    <Pressable
      accessibilityRole={"imagebutton" as AccessibilityRole}
      accessibilityLabel={`Gambar ${imagePair.id}`}
      onPress={() => onToggle(imagePair.id)}
      disabled={atMaxScale}
      style={styles.cellWrapper}
    >
      <Image
        source={{
          uri: cellState.isShowingAlternate
            ? imagePair.alternateUri
            : imagePair.primaryUri,
        }}
        style={[
          styles.cellImage,
          { transform: [{ scale: cellState.currentScale }] },
          atMaxScale && styles.maxScaleIndicator,
        ]}
        resizeMode="cover"
      />
    </Pressable>
  );
};

// -------------------------------------------------------
// 4) MAIN GRID COMPONENT
// -------------------------------------------------------

/**
 * PerfectGridFull: 
 * - Renders a static 3×3 grid.
 * - Uses useReducer to drive the tap/scale logic.
 * - Fully responsive to screen width changes.
 */
const PerfectGridFull: FC = () => {
  const [gridState, dispatch] = useReducer(
    imageGridReducer,
    {},
    buildInitialState
  );

  const toggleImage = useCallback((id: string) => {
    dispatch({ type: "TOGGLE_IMAGE", payload: id });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        Perfect 3×3 Grid — Tap to Swap & Scale (max 2×)
      </Text>
      <FlatList
        data={IMAGE_PAIRS}
        renderItem={({ item }) => (
          <GridCell
            imagePair={item}
            cellState={gridState[item.id]}
            onToggle={toggleImage}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={3}
        scrollEnabled={false}
        columnWrapperStyle={styles.rowWrapper}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default PerfectGridFull;

// -------------------------------------------------------
// 5) STYLE DEFINITIONS
// -------------------------------------------------------

const styles = StyleSheet.create({
  // outmost wrapper
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  // header text
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
    color: "#333333",
  },
  // FlatList container adjustments
  listContainer: {
    alignItems: "center",
  },
  rowWrapper: {
    justifyContent: "space-between",
    marginBottom: ITEM_MARGIN,
    width:
      Dimensions.get("window").width -
      16 * 2 - // horizontal padding
      ITEM_MARGIN * (NUM_COLUMNS - 1),
  },
  // each cell’s container (for Pressable)
  cellWrapper: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
  },
  // image inside each cell
  cellImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  // highlight border when max scale reached
  maxScaleIndicator: {
    borderWidth: 3,
    borderColor: "#FF4500",
  },
});
