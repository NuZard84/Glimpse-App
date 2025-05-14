import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

export type ThemeType = "light" | "dark";

export interface ThemeColors {
  bg_offwhite: string;
  bg_gray: string;
  bg_light_brand: string;
  font_dark: string;
  font_placeholder: string;
  font_brand: string;
}

export const lightTheme: ThemeColors = {
  bg_offwhite: "#F8F8F5",
  bg_gray: "#D9D9D9",
  bg_light_brand: "#D1C7F3",
  font_dark: "#1E1E1E",
  font_placeholder: "#0000004D",
  font_brand: "#6141C9",
};

export const darkTheme: ThemeColors = {
  bg_offwhite: "#121212",
  bg_gray: "#333333",
  bg_light_brand: "#4A3B87",
  font_dark: "#FFFFFF",
  font_placeholder: "#FFFFFF4D",
  font_brand: "#BB86FC",
};

// export const lightTheme: ThemeColors = {
//     bg_offwhite: "#F8F8F5",
//     bg_gray: "#D9D9D9",
//     bg_light_brand: "#FCC253",
//     font_dark: "#1E1E1E",
//     font_placeholder: "#0000004D",
//     font_brand: "#B07500",
//   };

//   export const darkTheme: ThemeColors = {
//     bg_offwhite: "#121212",
//     bg_gray: "#2A2A2A",
//     bg_light_brand: "#7A5000",
//     font_dark: "#F5F5F5",
//     font_placeholder: "#FFFFFF4D",
//     font_brand: "#FFC875",
//   };

interface ThemeContextType {
  theme: ThemeType;
  colors: ThemeColors;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  colors: lightTheme,
  setTheme: () => {},
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const deviceTheme = useColorScheme() as ThemeType;
  const [theme, setTheme] = useState<ThemeType>("light");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("@theme");
        if (storedTheme) {
          setTheme(storedTheme as ThemeType);
        } else {
          setTheme(deviceTheme || "light");
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadTheme();
  }, [deviceTheme]);

  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem("@theme", theme).catch((error) => {
        console.error("Failed to save theme preference:", error);
      });
    }
  }, [theme, isLoaded]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const colors = theme === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
