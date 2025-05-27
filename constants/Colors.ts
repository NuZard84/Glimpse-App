import { useTheme } from "@/context/ThemeContext";


export interface ThemeColors {
    bg_offwhite: string;
    bg_gray: string;
    bg_light_brand: string;
    bg_error: string;
    bg_warn: string;
    bg_info: string;
    bg_success: string;
    font_info: string;
    font_success: string;
    font_dark: string;
    font_placeholder: string;
    font_brand: string;
    font_error: string;
    font_warn: string;
    icon_brand: string;
}

export const lightTheme: ThemeColors = {
    bg_offwhite: "#F8F8F5",
    bg_gray: "#D9D9D9",
    bg_light_brand: "#D1C7F3",
    bg_error: "#FFEBEE",
    bg_warn: "#FFF4DB",
    bg_info: "#D9E1FF",
    bg_success: "#D9FFDF",


    font_warn: "#FFD067",
    font_dark: "#1E1E1E",
    font_placeholder: "#0000004D",
    font_brand: "#6141C9",
    font_error: "#FF4757",
    font_info: "#7F9AFF",
    font_success: "#3ACF55",
    icon_brand: "#7D73EA",
};

export const darkTheme: ThemeColors = {
    bg_offwhite: "#121212",
    bg_gray: "#333333",
    bg_light_brand: "#4A3B87",
    bg_error: "#432020",
    bg_warn: "#433020",
    bg_info: "#202643",
    bg_success: "#204320",

    font_dark: "#FFFFFF",
    font_placeholder: "#FFFFFF4D",
    font_brand: "#6444CF",
    font_error: "#FF6B78",
    font_warn: "#FFE096",
    font_info: "#A8BDFF",
    font_success: "#6AE280",
    icon_brand: "#7D73EA",
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

// This function allows components to get theme colors
export const useAppColors = () => {
    const { colors } = useTheme();
    return colors;
};




