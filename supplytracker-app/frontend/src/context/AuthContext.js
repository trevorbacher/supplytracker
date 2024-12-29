'use client'

import { createContext, useState, useContext, useEffect } from 'react';
import '../app/globals.css'

// Create the AuthContext with an empty object as the default value
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Effect to check login status when the component mounts
    useEffect(() => {
        checkLoginStatus();
    }, []); // Empty dependency array means this runs once on mount

    const checkLoginStatus = async () => {
        try {
            const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
            // Make a GET request to the backend to check if the user is logged in
            const response = await fetch(`${backendURL}/api/loggedin`, {
                method: 'GET',
                credentials: 'include' // Include cookies in the request
            });

            setIsAuthenticated(response.data); // Update authentication state based on response
        } catch (error) {
            console.error('Error checking login status:', error); // Log the error for debugging
            setIsAuthenticated(false); // Set to false if there's an error
        } finally {
            setLoading(false); // Set loading to false after the check is complete
        }
    };

    // Provide the authentication state and updater function to the context
    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, loading }}>
            {loading ? <div className='loader'></div> : children} {/* Show loading state while checking */}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext); // Return the context value for use in components 