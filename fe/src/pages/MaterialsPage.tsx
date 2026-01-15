import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks';
import { useNavigate } from 'react-router-dom';
import {
    getAllMaterialsApi,
    updateToken,
    getFilesInCurrentFolderApi,
} from '../services';
import '../index.css'

type FileItem = {
    id: number;
    name: string;
    url: string;
};

type FolderNode = {
    id: number;
    name: string;
    subfolders?: FolderNode[];
};

const FILE_FOLDERS = ['Video', 'Skripta', 'Ostalo'];

export const MaterialsPage: React.FC = () => {
    const [currentFolder, setCurrentFolder] = useState<FolderNode | null>(null);
    const [stack, setStack] = useState<FolderNode[]>([]);
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(false);

    let { token, login, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMaterials = async () => {
            token = await updateToken(token!, login, logout, navigate, []);
            const res = await getAllMaterialsApi(token);

            if (res?.status === 200) {
                setCurrentFolder(res.data);
            } else {
                alert('Error fetching materials');
            }
        };

        void fetchMaterials();
    }, []);

    useEffect(() => {
        if (!currentFolder) return;

        if (FILE_FOLDERS.includes(currentFolder.name)) {
            setLoading(true);

            const fetchFiles = async () => {
                token = await updateToken(token!, login, logout, navigate, []);
                const res = await getFilesInCurrentFolderApi(currentFolder.id, token);

                if (res?.status === 200) {
                    setFiles(res.data);
                } else {
                    alert('Error fetching files');
                    setFiles([]);
                }

                setLoading(false);
            };

            void fetchFiles();
        } else {
            setFiles([]);
        }
    }, [currentFolder]);

    const goIntoFolder = (folder: FolderNode) => {
        setStack(prev => [...prev, currentFolder!]);
        setCurrentFolder(folder);
    };

    const goBack = () => {
        const prev = stack[stack.length - 1];
        setStack(stack.slice(0, -1));
        setCurrentFolder(prev);
    };

    if (!currentFolder) return null;

    return (
        <div className="materials-page">
            <div className="materials-container">
                <header className="materials-header">
                    {stack.length > 0 && (
                        <button className="back-button" onClick={goBack}>
                            ← Back
                        </button>
                    )}
                    <h2 className="materials-title">{currentFolder.name}</h2>
                </header>

                <div className="materials-grid">
                    {currentFolder.subfolders?.map(folder => (
                        <div
                            key={folder.id}
                            className="material-card"
                            onClick={() => goIntoFolder(folder)}
                        >
                            <span className="material-icon">📁</span>
                            <span className="material-name">{folder.name}</span>
                        </div>
                    ))}

                    {loading && <div className="materials-empty">Loading files…</div>}

                    {files.map(file => (
                        <div
                            key={file.id}
                            className="material-card"
                            onClick={() =>
                                window.open(file.url, '_blank', 'noopener,noreferrer')
                            }
                        >
                            <span className="material-icon">📄</span>
                            <span className="material-name">{file.name}</span>
                        </div>
                    ))}

                    {!loading &&
                        currentFolder.subfolders?.length === 0 &&
                        files.length === 0 && (
                            <div className="materials-empty">This folder is empty.</div>
                        )}
                </div>
            </div>
        </div>
    );
};
