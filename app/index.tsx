import React, { useReducer, useCallback, FC } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";

// — Hitung lebar layar dan ukuran sel agar selalu 3 kolom pas
const { width: SCREEN_W } = Dimensions.get("window");
const GAP = 12;
const COLS = 3;
const CELL_SIZE = (SCREEN_W - GAP * (COLS + 1)) / COLS;

// — Data: 9 gambar utama + alternatif
type ImagePair = {
  id: string;
  main: string;
  alt: string;
};
const IMAGES: ImagePair[] = [
  {
    id: "1",
    main:
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiTOBzEKG0_JjvSbPN-GaCBUc74JuAK-kYsyABV0E7P-j163eGv9CiHcJkRaNf9z3UtVUAmOsIeObNgxR30f1fx6x2lDp2f8rR9h-3EayKgpEwKdpOvze7LAeTFgTAsByK2rHKSWHwK-yUD/s1600/catat-nih-5-atraksi-eksotik-di-polewali-mandar_103238_1140.jpg",
    alt:
      "https://awsimages.detik.net.id/community/media/visual/2021/11/26/coto-makassar-1_169.jpeg?w=620",
  },
  {
    id: "2",
    main: "https://www.imigrasikendari.com/wp-content/uploads/2024/07/Makassar.webp",
    alt:
      "https://awsimages.detik.net.id/community/media/visual/2020/08/27/sop-konro-makassar_169.jpeg?w=620",
  },
  {
    id: "3",
    main:
      "https://dispar.sulbarprov.go.id/wp-content/uploads/2020/05/gerbang-kota-majene-timur-1.jpg",
    alt:
      "https://awsimages.detik.net.id/community/media/visual/2016/05/01/774e2f30-1ee4-4984-b216-28fbd9249c3f_169.jpg?w=620",
  },
  {
    id: "4",
    main:
      "https://www.50detik.com/wp-content/uploads/2022/12/IMG-20191203-WA0030.jpg",
    alt:
      "https://awsimages.detik.net.id/community/media/visual/2022/05/15/pallu-cela-makanan-khas-makassar_169.jpeg?w=620",
  },
  {
    id: "5",
    main:
      "https://cove-blog-id.sgp1.cdn.digitaloceanspaces.com/cove-blog-id/2023/07/Daerah-Bandung-yang-Terkenal.webp",
    alt:
      "https://awsimages.detik.net.id/community/media/visual/2022/03/20/kuliner-makassar_169.jpeg?w=620",
  },
  {
    id: "6",
    main:
      "https://asset.kompas.com/crops/GEIiQSsEkCKrIGWEjOp_GaYHIHA=/0x0:1000x667/1200x800/data/photo/2022/07/25/62dec6809a479.jpg",
    alt:
      "https://awsimages.detik.net.id/community/media/visual/2022/04/02/kue-jalangkote-khas-sulsel_169.jpeg?w=620",
  },
  {
    id: "7",
    main:
      "https://shopee.co.id/inspirasi-shopee/wp-content/uploads/2022/06/jttO0PTeS5WYFOJ2MwDyZA_thumb_46f.webp",
    alt:
      "https://awsimages.detik.net.id/community/media/visual/2021/08/16/gogos-kambu_169.jpeg?w=620",
  },
  {
    id: "8",
    main:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Busway_in_Bundaran_HI.jpg/960px-Busway_in_Bundaran_HI.jpg",
    alt:
      "https://awsimages.detik.net.id/community/media/visual/2016/06/12/2c6f4666-d5b8-422c-a661-9fe04ab20a1c_169.jpg?w=620",
  },
  {
    id: "9",
    main:
      "https://kompaspedia.kompas.id/wp-content/uploads/2021/02/550234B3-D89C-4C07-7B6AF2A6B5206338.jpg",
    alt:
      "https://awsimages.detik.net.id/community/media/visual/2021/05/25/resep-pisang-epe-khas-makassar-1_169.jpeg?w=620",
  },
];

// — Tipe state per sel
type CellState = {
  id: string;
  active: boolean;
  scale: number;
};

// — Buat initial state untuk useReducer
const initialCells: CellState[] = IMAGES.map((img) => ({
  id: img.id,
  active: false,
  scale: 1,
}));

// — Action untuk reducer
type Action = { type: "PRESS"; payload: string };

// — Reducer: tekan sel → hanya sel itu yang scale×1.2 (cap 2×) dan active, sisanya reset
function cellsReducer(state: CellState[], action: Action): CellState[] {
  if (action.type !== "PRESS") return state;
  return state.map((cell) => {
    if (cell.id === action.payload) {
      if (cell.scale >= 2) return cell; // sudah cap
      const nextScale = Math.min(cell.scale * 1.2, 2);
      return { ...cell, active: true, scale: nextScale };
    }
    return { ...cell, active: false, scale: 1 };
  });
}

// — Komponen grid cell
const GridCell: FC<{
  img: ImagePair;
  cell: CellState;
  dispatch: React.Dispatch<Action>;
}> = ({ img, cell, dispatch }) => (
  <Pressable
    onPress={() => dispatch({ type: "PRESS", payload: img.id })}
    disabled={cell.scale >= 2}
    style={styles.cellWrapper}
  >
    <Image
      source={{ uri: cell.active ? img.alt : img.main }}
      style={[styles.cellImage, { transform: [{ scale: cell.scale }] }]}
      resizeMode="cover"
    />
  </Pressable>
);

// — Komponen utama
export default function CompleteGrid() {
  const [cells, dispatch] = useReducer(cellsReducer, initialCells);

  const renderItem = useCallback(
    ({ item }: { item: ImagePair }) => {
      const cell = cells.find((c) => c.id === item.id)!;
      return <GridCell img={item} cell={cell} dispatch={dispatch} />;
    },
    [cells]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete 3×3 Grid — Max Scale 2×</Text>
      <FlatList
        data={IMAGES}
        renderItem={renderItem}
        keyExtractor={(i) => i.id}
        numColumns={COLS}
        columnWrapperStyle={styles.row}
        scrollEnabled={false}
      />
    </View>
  );
}

// — Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#fafafa",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 16,
  },
  row: {
    justifyContent: "space-between",
    width: SCREEN_W - GAP * 2,
    marginBottom: GAP,
  },
  cellWrapper: {
    width: CELL_SIZE,
    height: CELL_SIZE,
  },
  cellImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
});
