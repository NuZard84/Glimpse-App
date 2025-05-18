import { useRouter, useSegments } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const useSessionManager = () => {
    const router = useRouter();
    const segments = useSegments();
    const user = useSelector((state: any) => state.user);
    const isFirstRender = useRef(true);

    useEffect(() => {
        // Skip navigation on first render to prevent navigation before layout mount
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const inAuthGroup = segments[0] === '(auth)';
        const inTabsGroup = segments[0] === '(tabs)';

        // Check if we have the required user data
        const isAuthenticated = !!user?.accessToken;
        const isVerified = !!user?.isVarified;
        const hasUsername = !!user?.profile?.username;
        const isForgotPassword = !!user?.isForgotPassword;

        // Use setTimeout to ensure navigation happens after layout mount
        setTimeout(() => {
            // Normal authentication flow
            if (!isAuthenticated && !inAuthGroup) {
                router.replace('/(auth)/Welcome');
            } else if (isAuthenticated && !isVerified && segments[1] !== 'Verify') {
                router.replace('/(auth)/Verify');
            } else if (isAuthenticated && isVerified && !hasUsername && segments[1] !== 'Username') {
                router.replace('/(auth)/Username');
            } else if (isAuthenticated && isVerified && hasUsername && !inTabsGroup && !isForgotPassword) {
                // Only navigate to home if not in forgot password flow
                router.replace('/(tabs)/Home');
            }
        }, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, segments]);

    return null;
};

export default useSessionManager;


