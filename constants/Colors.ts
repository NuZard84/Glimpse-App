import { useTheme } from "@/context/ThemeContext";

// This function allows components to get theme colors
export const useAppColors = () => {
    const { colors } = useTheme();
    return colors;
};

// For backward compatibility (use useAppColors instead where possible)
// export const colors = {
//     bg_offwhite: "#F8F8F5",
//     bg_gray: "#D9D9D9",
//     bg_light_brand: "#D1C7F3",
//     font_dark: "#1E1E1E",
//     font_placeholder: "#0000004D",
//     font_brand: "#6141C9"
// };


