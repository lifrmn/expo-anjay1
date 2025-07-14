import React, { useCallback, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ListRenderItemInfo,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";

// 1) Hitung lebar layar agar 3 gambar muat pas
const screenWidth = Dimensions.get("window").width;
const IMAGE_SIZE = (screenWidth - 60) / 3; // 20px padding + 10px margin per sisi

// 2) Tipe data & state per gambar
type ImageData = { id: string; main: string; alt: string };
type ImageState = { isAlt: boolean; scale: number };

// 3) Sembilan gambar utama + alternatif
const DATA: ImageData[] = [
  { id: "1", main: "https://…/atraksi.jpg",   alt: "https://…/coto.jpg" },
  { id: "2", main: "https://…/Makassar.webp", alt: "https://…/sop.jpg" },
  { id: "3", main: "https://…/majene.jpg",    alt: "https://…/774e2f30.jpg" },
  { id: "4", main: "https://…/WA0030.jpg",    alt: "https://…/pallu.jpg" },
  { id: "5", main: "https://…/Bandung.webp",  alt: "https://…/kuliner.jpg" },
  { id: "6", main: "https://…/62dec6809a479.jpg", alt: "https://…/jalangkote.jpg" },
  { id: "7", main: "https://…/46f.webp",      alt: "https://…/gogos.jpg" },
  { id: "8", main: "https://…/Busway_HI.jpg", alt: "https://…/2c6f4666.jpg" },
  { id: "9", main: "https://…/5206338.jpg",   alt: "https://…/pisangepe.jpg" },
];

// 4) Komponen untuk satu gambar
interface ItemProps {
  item: ImageData;
  state: ImageState;
  onPress: (id: string) => void;
}
const Item: React.FC<ItemProps> = ({ item, state, onPress }) => (
  <Pressable onPress={() => onPress(item.id)}>
    <Image
      source={{ uri: state.isAlt ? item.alt : item.main }}
      style={[styles.image, { transform: [{ scale: state.scale }] }]}
      resizeMode="cover"
    />
  </Pressable>
);

// 5) Grid 3×3 dengan FlatList
const ImprovedGrid: React.FC = () => {
  // Inisialisasi semua state ke { isAlt: false, scale: 1 }
  const init: Record<string, ImageState> = {};
  DATA.forEach((i) => (init[i.id] = { isAlt: false, scale: 1 }));
  const [states, setStates] = useState<Record<string, ImageState>>(init);

  // Handler klik: jika scale < 2, scale *= 1.2 (cap di 2), set isAlt=true; reset yang lain
  const onPress = useCallback((id: string) => {
    setStates((prev) => {
      const next: Record<string, ImageState> = {};
      for (const key in prev) {
        if (key === id && prev[key].scale < 2) {
          const newScale = Math.min(prev[key].scale * 1.2, 2);
          next[key] = { isAlt: true, scale: newScale };
        } else {
          next[key] = { isAlt: false, scale: 1 };
        }
      }
      return next;
    });
  }, []);

  const renderItem = ({ item }: ListRenderItemInfo<ImageData>) => (
    <Item item={item} state={states[item.id]} onPress={onPress} />
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Klik gambar untuk ganti & scale (max 2×)</Text>
      <FlatList
        data={DATA}
        numColumns={3}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        columnWrapperStyle={styles.row}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

export default ImprovedGrid;

// 6) Styling
const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },
  row: {
    justifyContent: "space-between",
    width: screenWidth - 20,
    marginBottom: 12,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 8,
  },
});
