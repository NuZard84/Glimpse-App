import { useRouter, useSegments } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'react-native';

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
    const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const appState = useRef(AppState.currentState);

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

    // First effect - mark component as mounted and handle app state changes
    useEffect(() => {
        isMounted.current = true;
        
        // Listen for app state changes to handle resuming from background
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                // App has come to the foreground, reset navigation lock if it was stuck
                navigationLock.current = false;
            }
            appState.current = nextAppState;
        });
        
        return () => {
            isMounted.current = false;
            subscription.remove();
            // Clear any pending navigation timers
            if (navigationTimer.current) {
                clearTimeout(navigationTimer.current);
            }
        };
    }, []);

    // Navigation handler with improved locking mechanism
    const performNavigation = useCallback(() => {
        // Clear any existing navigation timer
        if (navigationTimer.current) {
            clearTimeout(navigationTimer.current);
            navigationTimer.current = null;
        }
        
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
                // Still need to update state even if skipping navigation
                navigationComplete.current = true;
                setIsNavigating(false);
                setIsInitialized(true);
                navigationTimer.current = setTimeout(() => {
                    navigationLock.current = false;
                    navigationTimer.current = null;
                }, 800);
                return;
            }
            navigationComplete.current = true;
            setIsNavigating(false);
            setIsInitialized(true);
            navigationTimer.current = setTimeout(() => {
                navigationLock.current = false;
                navigationTimer.current = null;
            }, 800);
            return;
        }

        // Only navigate if needed for authenticated users
        let destination: NavigationPath | null = null;
        let shouldNavigate = false;

        if (isAuthenticated && isVerified && hasUsername && !isForgotPassword && !inTabsGroup) {
            destination = '/(tabs)/Home';
            shouldNavigate = true;
        } else if (isAuthenticated && isVerified && !hasUsername && segments[1] !== 'Username') {
            destination = '/(auth)/Username';
            shouldNavigate = true;
        } else if (isAuthenticated && !isVerified && segments[1] !== 'Verify') {
            destination = '/(auth)/Verify';
            shouldNavigate = true;
        }

        if (destination && shouldNavigate) {
            // Only navigate if destination changed
            if (lastDestination.current !== destination) {
                console.log(`Redirecting to ${destination.split('/').pop()}`);
                lastDestination.current = destination;
                router.replace(destination);
            } else {
                console.log(`Already navigating to ${destination.split('/').pop()}, skipping duplicate`);
            }
        }

        navigationComplete.current = true;
        setIsNavigating(false);
        setIsInitialized(true);

        // Release navigation lock after a delay
        navigationTimer.current = setTimeout(() => {
            navigationLock.current = false;
            navigationTimer.current = null;
        }, 800);
    }, [authState, router, segments]);

    // Handle navigation with debounce
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

            // Clear any existing navigation timer
            if (navigationTimer.current) {
                clearTimeout(navigationTimer.current);
                navigationTimer.current = null;
            }

            // Debounce navigation to prevent rapid consecutive navigations
            navigationTimer.current = setTimeout(() => {
                if (isMounted.current) {
                    performNavigation();
                }
                navigationTimer.current = null;
            }, 200);
        }
    }, [authState, user, isInitialized, performNavigation]);

    return { isInitialized, isNavigating };
};

export default useSessionManager;