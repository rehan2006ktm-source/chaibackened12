import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    const response = await api.get('/users/current-user');
                    if (response.data && response.data.data) {
                        setUser(response.data.data);
                    } else {
                        throw new Error("Invalid user data");
                    }
                }
            } catch (error) {
                console.error("Auth verification failed", error);
                logout(false); // Don't call API if verification fails locally
            } finally {
                setLoading(false);
            }
        };

        verifyUser();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/users/login', { email, password });
            const { user, accessToken, refreshToken } = response.data.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            setUser(user);
            return user;
        } catch (error) {
            console.error("Login error", error);
            throw error;
        }
    };

    const register = async (formData) => {
        try {
            // formData should be FormData object for file uploads
            const response = await api.post('/users/register', formData);
            return response.data;
        } catch (error) {
            console.error("Register error", error);
            throw error;
        }
    };

    const logout = async (callApi = true) => {
        if (callApi && user) {
            try {
                await api.post('/users/logout');
            } catch (error) {
                console.error("Logout API error", error);
            }
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
