import React, { useEffect, useState } from 'react';

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
    const [rootFolder, setRootFolder] = useState<FolderNode | null>(null);
    const [currentFolder, setCurrentFolder] = useState<FolderNode | null>(null);
    const [stack, setStack] = useState<FolderNode[]>([]);
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('http://localhost:3000/mats/folders')
            .then(res => res.json())
            .then(data => {
                setRootFolder(data);
                setCurrentFolder(data);
            });
    }, []);

    useEffect(() => {
        if (!currentFolder) return;

        if (FILE_FOLDERS.includes(currentFolder.name)) {
            setLoading(true);
            fetch(`http://localhost:3000/mats/folders/${currentFolder.id}/files`)
                .then(res => res.json())
                .then(data => setFiles(data))
                .finally(() => setLoading(false));
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
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div style={containerStyle}>

                <div style={headerStyle}>
                    {stack.length > 0 && (
                        <button onClick={goBack} style={backButtonStyle}>
                            ← Back
                        </button>
                    )}
                    <h2 style={titleStyle}>{currentFolder.name}</h2>
                </div>

                <div style={gridStyle}>
                    {currentFolder.subfolders?.map(folder => (
                        <div
                            key={folder.id}
                            style={cardStyle}
                            onClick={() => goIntoFolder(folder)}
                        >
                            <div style={iconStyle}>📁</div>
                            <div>{folder.name}</div>
                        </div>
                    ))}

                    {loading && <div>Loading files…</div>}

                    {files.map(file => (
                        <div
                            key={file.id}
                            style={cardStyle}
                            onClick={() =>
                                window.open(file.url, '_blank', 'noopener,noreferrer')
                            }
                        >
                            <div style={iconStyle}>📄</div>
                            <div>{file.name}</div>
                        </div>
                    ))}

                    {!loading &&
                        currentFolder.subfolders?.length === 0 &&
                        files.length === 0 && (
                            <div style={{ opacity: 0.6 }}>This folder is empty.</div>
                        )}
                </div>
            </div>
        </div>
    );

};
const containerStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 'auto',          // ⬅ stop forcing height
  maxWidth: 1400,             // ⬅ wider

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',

  padding: '32px 48px',
  borderRadius: 40,           // ⬅ oval edges
  background: '#e5e7eb',      // light gray (matches dark UI contrast)
};



const headerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column', 
  alignItems: 'center',
  gap: 12,
  marginBottom: 24,
};


const titleStyle: React.CSSProperties = {
    fontSize: '2rem',
    fontWeight: 700,
};

const backButtonStyle: React.CSSProperties = {
    padding: '10px 20px',
    borderRadius: 12,
    border: 'none',
    background: '#2563eb',
    color: '#fff',
    cursor: 'pointer',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: 24,
  width: '100%',
  maxWidth: 1200, // ⬅ controls how wide the grid can grow
  justifyItems: 'center',
};


const cardStyle: React.CSSProperties = {
  width: 220,
  height: 150,                // ⬅ flatter
  padding: '20px 16px',

  borderRadius: 36,           // ⬅ oval / pill shape
  background: '#1e293b',      // dark slate (matches FESBHub)
  color: '#e5e7eb',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 10,

  cursor: 'pointer',
  fontWeight: 600,
  textAlign: 'center',

  transition: 'transform 0.15s ease, background 0.15s ease',
};


const iconStyle: React.CSSProperties = {
  fontSize: '2.5rem',
  marginBottom: 6,
};

export default MaterialsPage;