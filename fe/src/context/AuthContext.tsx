import React,{type ReactNode,useState,createContext,useEffect} from 'react';
import {newAccessToken} from "../services";

interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    loading?: boolean;
    updateAccessToken?: (token: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const login = (newToken:string) => {
        setToken(newToken);
    };

    const logout = () => {
        setToken(null);
    };

    const updateAccessToken = (newToken:string) => {
        setToken(newToken);
    }

    useEffect(() => {
        setLoading(true);
        (async () => {
            try {
                const response = await newAccessToken();
                if (response?.status === 201) {
                    setToken(response.data);
                } else {
                    setToken(null);
                }
            } catch {
                setToken(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <AuthContext.Provider value={{token, login, logout,loading,updateAccessToken}}>
            {children}
        </AuthContext.Provider>
    );
}