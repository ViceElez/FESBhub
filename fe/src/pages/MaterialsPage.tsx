import { Link } from "react-router-dom";
import { routes } from "../constants/routes.ts";
import React, { useEffect, useState } from 'react';
import Folder from '../components/Folder.tsx';

interface FolderNode {
    id: number;
    name: string;
    subfolders?: FolderNode[];
}

export const MaterialsPage: React.FC = () => {
    const [rootFolder, setRootFolder] = useState<FolderNode | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchFolderTree = async () => {
            setLoading(true);
            try {
                // MaterialsPage.tsx
                const response = await fetch("http://localhost:3000/mats/folders");


                if (!response.ok) {
                    throw new Error(`Error fetching folder tree: ${response.statusText}`);
                }
                const data: FolderNode = await response.json();
                setRootFolder(data);
            } catch (err: any) {
                console.error("Failed to load folder tree:", err);
                setError(err.message || "Failed to load folders.");
            } finally {
                setLoading(false);
            }
        };
        fetchFolderTree();
    }, []);


    if (loading) {
        return <div className="app-container">Loading folders...</div>;
    }
    if (error) {
        return <div className="app-container error">Error: {error}</div>;
    }
    if (!rootFolder) {
        return <div className="app-container">No folders available.</div>;
    }


    return (
        <div className="app-container">
            <h2 className="app-title">{rootFolder.name}</h2>
            <Folder folder={rootFolder} depth={0} defaultExpanded={true} />
        </div>
    );
};