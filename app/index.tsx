// PerfectImageGrid.tsx

import React, { useState, FC, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

// 1) DATA & TYPES

type ImagePair = {
  id: string;
  primaryUri: string;
  alternateUri: string;
};

type CellState = {
  showAlt: boolean;
  scale: number;
};

// 9 pasang gambar utama + alternatif
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

// 2) KOMPONEN GRID ITEM

interface GridItemProps {
  pair: ImagePair;
  state: CellState;
  size: number;
  onPress: (id: string) => void;
}

const GridItem: FC<GridItemProps> = ({ pair, state, size, onPress }) => {
  const atMax = state.scale >= 2;
  return (
    <Pressable
      onPress={() => onPress(pair.id)}
      disabled={atMax}
      style={[styles.cell, { width: size, height: size }]}
      accessibilityRole="imagebutton"
      accessibilityLabel={`Gambar nomor ${pair.id}`}
    >
      <Image
        source={{ uri: state.showAlt ? pair.alternateUri : pair.primaryUri }}
        style={[
          styles.image,
          { transform: [{ scale: state.scale }] },
          atMax && styles.maxBorder,
        ]}
        resizeMode="cover"
      />
    </Pressable>
  );
};

// 3) MAIN GRID

export default function PerfectImageGrid() {
  // bangun state awal dari data
  const [cellStates, setCellStates] = useState<Record<string, CellState>>(
    () =>
      IMAGE_PAIRS.reduce((acc, p) => {
        acc[p.id] = { showAlt: false, scale: 1 };
        return acc;
      }, {} as Record<string, CellState>)
  );

  // hitung ulang ukuran sel ketika lebar berubah
  const { width } = useWindowDimensions();
  const PADDING = 16;
  const GAP = 12;
  const COLS = 3;
  const totalGap = PADDING * 2 + GAP * (COLS - 1);
  const cellSize = (width - totalGap) / COLS;

  // handler tap
  const handleTap = useCallback((id: string) => {
    setCellStates((prev) => {
      const next: Record<string, CellState> = {};
      Object.keys(prev).forEach((key) => {
        if (key === id) {
          // naikkan 1.2×, cap 2×
          const newScale = Math.min(prev[key].scale * 1.2, 2);
          next[key] = { showAlt: true, scale: newScale };
        } else {
          // reset sisanya
          next[key] = { showAlt: false, scale: 1 };
        }
      });
      return next;
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Grid 3×3 — Tap to Swap & Scale</Text>
      <FlatList
        data={IMAGE_PAIRS}
        keyExtractor={(i) => i.id}
        numColumns={COLS}
        scrollEnabled={false}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: GAP }}
        renderItem={({ item }) => (
          <GridItem
            pair={item}
            state={cellStates[item.id]}
            size={cellSize}
            onPress={handleTap}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: PADDING }}
      />
    </View>
  );
}

// 4) STYLES

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    paddingTop: 24,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  cell: {
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  maxBorder: {
    borderWidth: 2,
    borderColor: "#FF0000",
  },
});
