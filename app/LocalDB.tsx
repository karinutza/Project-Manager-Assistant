// src/data/LocalDB.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "projects_db";

export type Project = {
  id: number;
  name: string;
  description: string;
  progress?: number;
  deadline?: string;
  color?: string;
};

export const LocalDB = {
  // ✅ Salvează o listă de proiecte local
  async saveProjects(projects: Project[]) {
    try {
      const jsonValue = JSON.stringify(projects);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
      console.log("✅ Projects saved locally!");
    } catch (e) {
      console.error("❌ Error saving projects:", e);
    }
  },

  // ✅ Încarcă proiectele salvate
  async loadProjects(): Promise<Project[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      return jsonValue ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error("❌ Error loading projects:", e);
      return [];
    }
  },

  // ✅ Șterge baza de date locală (opțional)
  async clear() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      console.log("🧹 Local DB cleared!");
    } catch (e) {
      console.error("❌ Error clearing DB:", e);
    }
  },
};

export default LocalDB;
