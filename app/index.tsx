// PerfectImageGrid.tsx

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

// ------------------------------------------------------------------
// 1) DATA & TYPES
// ------------------------------------------------------------------

/** Sepasang URL: utama + alternatif */
type ImagePair = {
  id: string;
  primaryUri: string;
  alternateUri: string;
};

/** State per gambar: apakah tampil versi alternatif & faktor skala */
type ImageState = {
  showingAlternate: boolean;
  scale: number;
};

/** Daftar 9 pasang gambar */
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

/** Buat state awal map[id] → { showingAlternate:false, scale:1 } */
const buildInitialState = (): Record<string, ImageState> => {
  const m: Record<string, ImageState> = {};
  IMAGE_PAIRS.forEach((p) => {
    m[p.id] = { showingAlternate: false, scale: 1 };
  });
  return m;
};

// ------------------------------------------------------------------
// 2) REDUCER & ACTION
// ------------------------------------------------------------------

type Action = { type: "TOGGLE"; id: string };

/** 
 * Saat action.type === "TOGGLE": 
 * - untuk id itu: scale×1.2 (max 2) + showingAlternate=true 
 * - semua id lain direset ke scale=1 + showingAlternate=false
 */
function reducer(
  state: Record<string, ImageState>,
  action: Action
): Record<string, ImageState> {
  if (action.type !== "TOGGLE") return state;
  const next: Record<string, ImageState> = {};
  for (const key in state) {
    if (key === action.id) {
      const prev = state[key];
      next[key] = {
        showingAlternate: true,
        scale: Math.min(prev.scale * 1.2, 2),
      };
    } else {
      next[key] = { showingAlternate: false, scale: 1 };
    }
  }
  return next;
}

// ------------------------------------------------------------------
// 3) GRID CELL COMPONENT
// ------------------------------------------------------------------

interface CellProps {
  pair: ImagePair;
  state: ImageState;
  size: number;
  onPress: (id: string) => void;
}

const GridCell: FC<CellProps> = ({ pair, state, size, onPress }) => {
  const maxReached = state.scale >= 2;
  return (
    <Pressable
      onPress={() => onPress(pair.id)}
      disabled={maxReached}
      accessibilityRole={"imagebutton" as AccessibilityRole}
      accessibilityLabel={`Gambar ${pair.id}`}
      style={[styles.cellContainer, { width: size, height: size }]}
    >
      <Image
        source={{
          uri: state.showingAlternate ? pair.alternateUri : pair.primaryUri,
        }}
        style={[
          styles.image,
          { transform: [{ scale: state.scale }] },
          maxReached && styles.maxBorder,
        ]}
        resizeMode="cover"
      />
    </Pressable>
  );
};

// ------------------------------------------------------------------
// 4) MAIN GRID COMPONENT
// ------------------------------------------------------------------

const PerfectImageGrid: FC = () => {
  const [mapState, dispatch] = useReducer(
    reducer,
    {},
    buildInitialState
  );

  const { width: screenW } = useWindowDimensions();
  const H_PAD = 16;
  const GAP = 12;
  const COLS = 3;
  const totalGaps = H_PAD * 2 + GAP * (COLS - 1);
  const itemSize = (screenW - totalGaps) / COLS;

  const onToggle = useCallback(
    (id: string) => dispatch({ type: "TOGGLE", id }),
    []
  );

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Perfect 3×3 Image Grid</Text>
      <FlatList
        data={IMAGE_PAIRS}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <GridCell
            pair={item}
            state={mapState[item.id]}
            size={itemSize}
            onPress={onToggle}
          />
        )}
        numColumns={COLS}
        scrollEnabled={false}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default PerfectImageGrid;

// ------------------------------------------------------------------
// 5) STYLES
// ------------------------------------------------------------------

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  list: {
    alignItems: "center",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cellContainer: {
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  maxBorder: {
    borderWidth: 3,
    borderColor: "#FF0000",
  },
});
