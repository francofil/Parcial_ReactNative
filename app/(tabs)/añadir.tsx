import { StyleSheet, TextInput, Button, Dimensions, ScrollView, SafeAreaView } from "react-native";
import { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const { width, height } = Dimensions.get("window");

export default function AddPlanetScreen() {
  const [lastId, setLastId] = useState(10);
  const [newTeam, setnewTeam] = useState({
    id: lastId,
    name: "",
    description: "",
    goals: "",
    points:"",
    image: "",
  });

  const handleAddTeam = async () => {
    try {
      const nextId = lastId + 1;
      const response = await fetch("http://161.35.143.238:8000/ffilardi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...newTeam,
          id: nextId.toString(), 
        }),
      });
  
      if (response.ok) {
        setLastId(nextId); 
        setnewTeam({
          id: (nextId + 2).toString(),
          name: "",
          description: "",
          goals: "",
          points: "",
          image: "",
        });
        alert("Team added successfully!");
      }
    } catch (error) {
      console.error("Full error details:", error);
      alert("Error adding team");
    }
  };




  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      <SafeAreaView>
        <ThemedView style={styles.container}>
          <ThemedText style={styles.mainTitle}>
            Agrega un nuevo equipo al
          </ThemedText>
          <ThemedText style={styles.mainTitle}>
            campeonato
          </ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={newTeam.name}
            onChangeText={(text) => setnewTeam({ ...newTeam, name: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Description"
            multiline
            value={newTeam.description}
            onChangeText={(text) =>
              setnewTeam({ ...newTeam, description: text })
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Number of goals"
            keyboardType="numeric"
            value={newTeam.goals}
            onChangeText={(text) => setnewTeam({ ...newTeam, goals: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Points"
            value={newTeam.points}
            onChangeText={(text) =>
              setnewTeam({
                ...newTeam,
                points: text
              })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Image URL"
            value={newTeam.image}
            onChangeText={(text) => setnewTeam({ ...newTeam, image: text })}
          />
          <Button title="Add Team" onPress={handleAddTeam} />
        </ThemedView>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: width * 0.05,
    gap: width * 0.05,
    width: width,
    minHeight: height,
    marginTop: 50, 
  },
  mainTitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#1D3D47",
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "white",
  },
  scrollContainer: {
    flexGrow: 1,
    minHeight: height,
  }
});
