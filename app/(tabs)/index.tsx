import { StyleSheet, ScrollView, Dimensions, View, Text, SafeAreaView, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const [teams, setTeams] = useState([]);
  const router = useRouter();

  const handleFetchFeed = async () => {
    try {
      const teamsFetch = await fetch("http://161.35.143.238:8000/ffilardi");
      const teams = await teamsFetch.json();
      return teams;
    } catch (error) {
      console.error("Error fetching planets:", error);
      return [];
    }
  };

  const handleDeleteTeam = async (id: any) => {
    try {
      const response = await fetch(`http://161.35.143.238:8000/ffilardi/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTeams(teams.filter((team) => team.id !== id));
        alert("Team deleted successfully!");
      } else {
        alert("Failed to delete team.");
      }
    } catch (error) {
      console.error("Error deleting team:", error);
      alert("An error occurred while deleting the team.");
    }
  };


  useEffect(() => {
    handleFetchFeed().then((teams) => {
      setTeams(teams);
    });
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      <SafeAreaView>
        <ThemedView style={styles.container}>
          {/* Header del título */}
          <View style={styles.header}>
            <Text style={styles.title}>Eliminatorias Sudamericanas</Text>
          </View>

          {/* Lista de planetas */}
          {teams.map((team: any) => (
            <ThemedView key={team.id} style={styles.card}>
              <Pressable
                onPress={() => {
                  router.push({
                    pathname: "./../detalles",
                    params: { teamId: team.id },
                  });
                }}
                style={({ pressed }) => [
                  styles.button,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <View style={styles.cardContent}>
                  {/* Imagen del planeta */}
                  <Image source={{ uri: team.image }} />

                  {/* Nombre del planeta */}
                  <ThemedText type="subtitle">{team.name}</ThemedText>
                  <Pressable
                    onPress={() => handleDeleteTeam(team.id)}
                    style={({ pressed }) => [
                      styles.deleteButton,
                      { opacity: pressed ? 0.7 : 1 },
                    ]}
                  >
                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                  </Pressable>
                </View>
              </Pressable>
            </ThemedView>
          ))}

        </ThemedView>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    width: "100%",
    alignItems: "center",
  },

  image: {
    width: width * 0.9,
    height: height * 0.3,
    resizeMode: "cover",
    borderRadius: width * 0.03,
  },
  scrollContainer: {
    flexGrow: 1,
    minHeight: height,
  },
  container: {
    padding: width * 0.05,
    gap: width * 0.05,
    width: width,
    minHeight: height,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "#1D3D47",
    textAlign: "center",
  },
  card: {
    padding: width * 0.05,
    borderRadius: width * 0.03,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: height * 0.02,
    width: width * 0.92,
    alignSelf: "center",
  },
  cardContent: {
    flexDirection: "row", // Alinea la imagen y el texto horizontalmente
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  }
});
