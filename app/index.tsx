import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{
        backgroundColor: "lightblue",
      }}>
      <Text style={{
        fontSize : 20, 
         color: "white",}}
        >105841104222</Text>
      <Text style={{
        color : "blue",
        fontWeight: "bold",
      }}>ALIEF RYANTO RAHMAN</Text>
        </View>
       <View style={{
        width: 20,
        height: 20,
        backgroundColor: "lightgreen",
        borderRadius: 10,
      }}>
      </View>
    </View>
  );
}
