import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slot } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";


export default function Layout() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const role = await AsyncStorage.getItem("loggedIn"); // manager sau sef
        setLoggedIn(!!role); // true dacă există rol
      } catch (e) {
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!loggedIn) {
    // dacă nu e logat, redirectăm la login

    // Render the Slot so the index/login page can show instead of a blank screen.
    // Previously this returned `null` which causes a blank page in web builds.
    return <Slot />;
  }

  return <Slot />; // afișăm pagina principală pentru user logat
}
