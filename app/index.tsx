import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
  StyleSheet,
} from "react-native";

const screenWidth = Dimensions.get("window").width;
const imageSize = screenWidth / 3 - 20;
const INITIAL_SCALE = 1;
const MAX_SCALE = 2;
const SCALE_INCREMENT = 0.2;

const mainImages = [
  "https://placekitten.com/200/201",
  "https://placekitten.com/200/202",
  "https://placekitten.com/200/203",
  "https://placekitten.com/200/204",
  "https://placekitten.com/200/205",
  "https://placekitten.com/200/206",
  "https://placekitten.com/200/207",
  "https://placekitten.com/200/208",
  "https://placekitten.com/200/209",
];

const altImages = [
  "https://placebear.com/200/201",
  "https://placebear.com/200/202",
  "https://placebear.com/200/203",
  "https://placebear.com/200/204",
  "https://placebear.com/200/205",
  "https://placebear.com/200/206",
  "https://placebear.com/200/207",
  "https://placebear.com/200/208",
  "https://placebear.com/200/209",
];

export default function Index() {
  const [imageStates, setImageStates] = useState(
    mainImages.map(() => ({
      isAlt: false,
      scale: new Animated.Value(INITIAL_SCALE),
    }))
  );

  const handlePress = (index: number) => {
    const updatedStates = [...imageStates];
    updatedStates[index].isAlt = !updatedStates[index].isAlt;

    console.log(
      Gambar index ${index} ditekan, sekarang: ${updatedStates[index].isAlt ? "cadangan" : "utama"}
    );

    updatedStates[index].scale.stopAnimation((currentScale: number) => {
      const newScale =
        currentScale + SCALE_INCREMENT <= MAX_SCALE
          ? currentScale + SCALE_INCREMENT
          : MAX_SCALE;

      Animated.timing(updatedStates[index].scale, {
        toValue: newScale,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    setImageStates(updatedStates);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 40,
          gap: 30,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Segitiga di bagian atas */}
        <View
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: 30,
            borderRightWidth: 30,
            borderBottomWidth: 60,
            borderStyle: "solid",
            backgroundColor: "transparent",
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderBottomColor: "orange",
          }}
        />

        {/* Bentuk Pil (Oval Horizontal) */}
        <View
          style={{
            backgroundColor: "blue",
            paddingHorizontal: 30,
            paddingVertical: 15,
            borderRadius: 50,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Text style={{ fontSize: 18, color: "white", fontWeight: "bold" }}>
            105841105522
          </Text>
        </View>

        {/* Persegi Panjang (Nama) */}
        <View
          style={{
            backgroundColor: "green",
            width: 220,
            paddingVertical: 20,
            alignItems: "center",
            borderRadius: 15,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
            M. Fikri Haikal Ayatullah
          </Text>
        </View>

        {/* Lingkaran Dekoratif */}
        <View
          style={{
            width: 30,
            height: 30,
            backgroundColor: "blue",
            borderRadius: 15,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3,
          }}
        />

        {/* Container untuk kedua gambar berdampingan */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            paddingHorizontal: 20,
            gap: 10,
          }}
        >
          {/* Gambar Profil */}
          <View
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4.65,
              elevation: 8,
            }}
          >
            <Image
              style={{
                width: 150,
                height: 150,
                borderRadius: 75,
                borderWidth: 3,
                borderColor: "white",
              }}
              source={{
                uri: "https://simak.unismuh.ac.id/upload/mahasiswa/105841105522_.jpg",
              }}
            />
          </View>

          {/* Gambar Tambahan */}
          <View
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4.65,
              elevation: 8,
            }}
          >
            <Image
              style={{
                width: 150,
                height: 150,
                borderRadius: 75,
                borderWidth: 3,
                borderColor: "white",
              }}
              source={{
                uri: "https://tse2.mm.bing.net/th/id/OIP.N9gK5s6MwPBr2lCKz0EpFwAAAA?pid=Api&P=0&h=220",
              }}
            />
          </View>
        </View>

        {/* Grid 3x3 Gambar Interaktif */}
        <View style={styles.grid}>
          {mainImages.map((img, index) => {
            const current = imageStates[index];
            const source = { uri: current.isAlt ? altImages[index] : mainImages[index] };

            return (
              <Pressable key={index} onPress={() => handlePress(index)}>
                <Animated.Image
                  source={source}
                  style={[
                    styles.image,
                    {
                      transform: [{ scale: current.scale }],
                    },
                  ]}
                />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  image: {
    width: imageSize,
    height: imageSize,
    margin: 5,
    borderRadius: 10,
  },
});
