import AsyncStorage from "@react-native-async-storage/async-storage";

// Cheia principală pentru stocarea datelor
const STORAGE_KEY = "APP_DATA";

// Funcție pentru inițializare (dacă nu există date)
export const initData = async () => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  if (!data) {
    const initialData = {
      users: [
        { username: "manager", password: "manager", role: "manager" },
        { username: "departmentMec", password:"departmentMec", role: "bossDesignMecanic" },
        { username: "manager", password: "manager", role: "BossDesignTehnic" },
        { username: "worker", password: "worker", role: "workerDesignMecanic" },
        { username: "worker", password: "worker", role: "workerDesignTehnic" },
      ],
      projects: [],
      tasks: [],
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(data);
};

// Funcție pentru citirea datelor
export const getData = async () => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : await initData();
};

// Funcție pentru salvarea datelor
export const saveData = async (newData) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
};

// Funcții utile pentru update
export const addProject = async (project) => {
  const data = await getData();
  data.projects.push(project);
  await saveData(data);
};

export const addTask = async (task) => {
  const data = await getData();
  data.tasks.push(task);
  await saveData(data);
};
