import { useFonts } from 'expo-font';

export const useFontLoader = () => {
    const [fontsLoaded, error] = useFonts({
        'CalSans': require('../assets/fonts/CalSans-Regular.ttf'),
    });

    return { fontsLoaded, error };
}; 