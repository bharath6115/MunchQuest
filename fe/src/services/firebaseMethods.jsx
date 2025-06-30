import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [uid, setUid] = useState(null);
    const [loading, setLoading] = useState(true); //for loading screen
    const [isAdmin,setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            const currID = user ? user.uid : null;
            setUid(currID);
            setLoading(false);
            setIsAdmin(currID == "3YAqeFigfYXG1lwN8IgUMlWxyN83")
        });

        return () => unsubscribe();
    }, []);
    

    return (
        <AuthContext.Provider value={{ uid, isLoggedIn: !!uid, isAdmin, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
