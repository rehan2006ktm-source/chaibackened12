import { useSelector } from "react-redux";

/**
 * Convenience hook to access auth state from the Redux store.
 * Returns { user, isAuthenticated }
 */
export const useAuth = () => {
    const { status, userData } = useSelector((state) => state.auth);
    return { user: userData, isAuthenticated: status };
};
