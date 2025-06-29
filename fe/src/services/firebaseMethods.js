import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [uid, setUid] = useState(null);
    const [loading, setLoading] = useState(true); //for loading screen

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUid(user ? user.uid : null);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ uid, isLoggedIn: !!uid, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
