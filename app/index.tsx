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
  View,
} from "react-native";

// Hitung lebar layar agar 3 gambar muat pas
const screenWidth = Dimensions.get("window").width;
const IMAGE_SIZE = (screenWidth - 60) / 3; // 20px padding + 10px margin antar gambar

// Tipe data gambar & state
type ImageData = { id: string; main: string; alt: string };
type ImageState = { clicked: boolean; scale: number; clicks: number };

// 9 gambar utama + alternatif
const DATA: ImageData[] = [
  {
    id: "1",
    main:
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiTOBzEKG0_JjvSbPN-GaCBUc74JuAK-kYsyABV0E7P-j163eGv9CiHcJkRaNf9z3UtVUAmOsIeObNgxR30f1fx6x2lDp2f8rR9h-3EayKgpEwKdpOvze7LAeTFgTAsByK2rHKSWHwK-yUD/s1600/catat-nih-5-atraksi-eksotik-di-polewali-mandar_103238_1140.jpg",
    alt:
      "https://awsimages.detik.net.id/community/media/visual/2021/11/26/coto-makassar-1_169.jpeg?w=620",
  },
  {
    id: "2",
    main:
      "https://www.imigrasikendari.com/wp-content/uploads/2024/07/Makassar.webp",
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

// Komponen satu gambar
interface ImageItemProps {
  item: ImageData;
  state: ImageState;
  onPress: (id: string) => void;
}
const ImageItem: React.FC<ImageItemProps> = ({ item, state, onPress }) => (
  <Pressable onPress={() => onPress(item.id)}>
    <Image
      source={{ uri: state.clicked ? item.alt : item.main }}
      style={[styles.image, { transform: [{ scale: state.scale }] }]}
      resizeMode="cover"
    />
  </Pressable>
);

// Komponen grid 3×3
const ALIFVariant: React.FC = () => {
  // Inisialisasi state (clicked/scale/clicks) untuk setiap id
  const initial: Record<string, ImageState> = {};
  DATA.forEach((img) => {
    initial[img.id] = { clicked: false, scale: 1, clicks: 0 };
  });
  const [states, setStates] = useState<Record<string, ImageState>>(initial);

  // Handler klik: ubah hanya gambar itu, tambah scale x1.2 hingga max 2x, reset sisanya
  const handleImagePress = useCallback((id: string) => {
    setStates((prev) => {
      const next: Record<string, ImageState> = {};
      for (const key in prev) {
        if (key === id && prev[key].clicks < 2) {
          const newScale = Math.min(prev[key].scale * 1.2, 2);
          next[key] = {
            clicked: true,
            scale: newScale,
            clicks: prev[key].clicks + 1,
          };
        } else {
          // reset semua gambar lain
          next[key] = { clicked: false, scale: 1, clicks: 0 };
        }
      }
      return next;
    });
  }, []);

  // Render dengan FlatList 3 kolom
  const renderItem = ({ item }: ListRenderItemInfo<ImageData>) => (
    <ImageItem item={item} state={states[item.id]} onPress={handleImagePress} />
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Grid 3×3: Klik untuk ganti & scale</Text>
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

export default ALIFVariant;

// Styling
const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
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
