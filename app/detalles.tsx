import { StyleSheet, View, Dimensions, Image, Button, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams } from "expo-router";
import { BottomSheet } from '@rneui/themed';

const { width, height } = Dimensions.get("window");

export default function TeamDetails() {
  const { teamId } = useLocalSearchParams();
  const [teamDetails, setTeamDetails] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [editedTeam, setEditedTeam] = useState({
    name: "",
    description: "",
    goals: 0,
    points: 0,
    image: "",
  });

  const fetchteamDetails = async () => {
    try {
      const response = await fetch(`http://161.35.143.238:8000/ffilardi/${teamId}`);
      const data = await response.json();
      setTeamDetails(data);
      setEditedTeam(data);
    } catch (error) {
      console.error("Error fetching team details:", error);
    }
  };

  const handleUpdatePlanet = async () => {
    try {
      const response = await fetch(`http://161.35.143.238:8000/ffilardi/${teamId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedTeam),
      });
      const updatedTeam = await response.json();
      setTeamDetails(updatedTeam);
      setIsVisible(false);
    } catch (error) {
      console.error("Error updating team:", error);
    }
  };

  useEffect(() => {
    fetchteamDetails();
  }, [teamId]);

  return (
    <ThemedView style={styles.container}>
      {teamDetails && (
        <>
          <ThemedText type="title" style={styles.name}>
            {teamDetails.name}
          </ThemedText>

          <Image source={{ uri: teamDetails.image }} style={styles.teamImage} />

          <ThemedText type="default" style={styles.description}>
            {teamDetails.description}
          </ThemedText>

          {teamDetails.goals > 0 && (
            <>
              <ThemedText type="subtitle" style={styles.goalsTitle}>
                Goals: {teamDetails.goals}
              </ThemedText>

              <ThemedText type="subtitle" style={styles.goalsTitle}>
                Points: {teamDetails.points}
              </ThemedText>
            </>
          )}

          <Button title="Edit Team" onPress={() => setIsVisible(true)} />

          <BottomSheet isVisible={isVisible} onBackdropPress={() => setIsVisible(false)}  containerStyle={{
    height: height * 0.8  
  }} >
            <View style={styles.bottomSheetContent}>
              <TextInput
                style={styles.input}
                value={editedTeam.name}
                onChangeText={(text) => setEditedTeam(prev => ({ ...prev, name: text }))}
                placeholder="Nombre del planeta"
              />
              <TextInput
                style={styles.input}
                value={editedTeam.description}
                onChangeText={(text) => setEditedTeam(prev => ({ ...prev, description: text }))}
                placeholder="Descripción"
                multiline
              />
              <TextInput
                style={styles.input}
                value={String(editedTeam.goals)}
                onChangeText={(text) => setEditedTeam(prev => ({ ...prev, goals: parseInt(text) || 0 }))}
                placeholder="Número de goles"
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                value={editedTeam.image}
                onChangeText={(text) => setEditedTeam(prev => ({ ...prev, image: text }))}
                placeholder="URL de la imagen"
              />
              <Button title="Guardar Cambios" onPress={handleUpdatePlanet} />
            </View>
          </BottomSheet>
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
  },
  name: {
    fontSize: width * 0.08,
    marginBottom: height * 0.02,
    textAlign: "center",
  },
  description: {
    marginBottom: height * 0.03,
  },
  goalsTitle: {
    marginBottom: height * 0.01,
    fontWeight: "bold",
  },
  teamImage: {
    width: width * 0.9,
    height: height * 0.3,
    resizeMode: "cover",
    borderRadius: width * 0.03,
    alignSelf: "center",
    marginVertical: height * 0.02,
  },
  bottomSheetContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: height * 0.7,
    maxHeight: height * 0.7  
},
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  }
});
