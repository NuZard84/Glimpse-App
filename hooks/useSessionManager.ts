import { useRouter, useSegments } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

interface AuthState {
    isAuthenticated: boolean;
    isVerified: boolean;
    hasUsername: boolean;
    isForgotPassword: boolean;
    inAuthGroup: boolean;
    inTabsGroup: boolean;
}

// Define type for paths used in router.replace
type NavigationPath = '/(auth)/Welcome' | '/(tabs)/Home' | '/(auth)/Username' | '/(auth)/Verify';

const useSessionManager = () => {
    const router = useRouter();
    const segments = useSegments();
    const user = useSelector((state: any) => state.user);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const isMounted = useRef(false);
    const navigationComplete = useRef(false);
    const lastAuthState = useRef<AuthState | null>(null);
    const lastDestination = useRef<NavigationPath | null>(null);
    const navigationLock = useRef(false);

    // Reset navigation state when auth state changes significantly
    // This ensures logout will trigger a new navigation
    useEffect(() => {
        // Check if user went from authenticated to not authenticated (logout)
        if (lastAuthState.current?.isAuthenticated && user && !user.accessToken) {
            console.log("Logout detected, resetting navigation state");
            navigationComplete.current = false;
            navigationLock.current = false;
            lastDestination.current = null;
            setIsInitialized(false);
        }
    }, [user]);

    // Memoize auth state
    const authState = useMemo<AuthState>(() => ({
        isAuthenticated: !!user?.accessToken,
        isVerified: !!user?.isVarified,
        hasUsername: !!user?.profile?.username,
        isForgotPassword: !!user?.isForgotPassword,
        inAuthGroup: segments[0] === '(auth)',
        inTabsGroup: segments[0] === '(tabs)',
    }), [user?.accessToken, user?.isVarified, user?.profile?.username, user?.isForgotPassword, segments]);

    // First effect - mark component as mounted
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    // Navigation handler
    const performNavigation = useCallback(() => {
        if (!isMounted.current || navigationLock.current) return;

        // Lock navigation to prevent multiple calls
        navigationLock.current = true;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { isAuthenticated, isVerified, hasUsername, isForgotPassword, inAuthGroup, inTabsGroup } = authState;

        // Handle logout - always navigate to welcome screen if not authenticated
        if (!isAuthenticated) {
            const destination = '/(auth)/Welcome' as NavigationPath;
            if (lastDestination.current !== destination) {
                console.log("Not authenticated, redirecting to Welcome");
                lastDestination.current = destination;
                router.replace(destination);
            } else {
                console.log("Already redirecting to Welcome, skipping duplicate navigation");
            }
            navigationComplete.current = true;
            setIsNavigating(false);
            setIsInitialized(true);
            setTimeout(() => {
                navigationLock.current = false;
            }, 500);
            return;
        }

        // Only navigate if needed for authenticated users
        let destination: NavigationPath | null = null;

        if (isAuthenticated && isVerified && hasUsername && !isForgotPassword && !inTabsGroup) {
            destination = '/(tabs)/Home';
            console.log("Redirecting to Home");
            router.replace(destination);
        } else if (isAuthenticated && isVerified && !hasUsername && segments[1] !== 'Username') {
            destination = '/(auth)/Username';
            router.replace(destination);
        } else if (isAuthenticated && !isVerified && segments[1] !== 'Verify') {
            destination = '/(auth)/Verify';
            router.replace(destination);
        }

        if (destination) {
            lastDestination.current = destination;
        }

        navigationComplete.current = true;
        setIsNavigating(false);
        setIsInitialized(true);

        // Release navigation lock after a delay
        setTimeout(() => {
            navigationLock.current = false;
        }, 500);
    }, [authState, router, segments]);

    // Handle navigation
    useEffect(() => {
        // Skip if not mounted, no user data, or already initialized (unless auth state changed)
        if (!isMounted.current || user === undefined) return;

        // Always allow navigation on auth state changes, even if initialized
        const shouldNavigate = !isInitialized || JSON.stringify(authState) !== JSON.stringify(lastAuthState.current);

        if (shouldNavigate && !navigationLock.current) {
            lastAuthState.current = { ...authState };

            // Log only when state changes
            console.log("Navigation check with auth state:", authState);

            setIsNavigating(true);

            // Delay navigation to ensure layout is mounted
            setTimeout(() => {
                if (isMounted.current) {
                    performNavigation();
                }
            }, 100);
        }
    }, [authState, user, isInitialized, performNavigation]);

    return { isInitialized, isNavigating };
};

export default useSessionManager;