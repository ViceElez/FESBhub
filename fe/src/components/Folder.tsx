import { useEffect, useState } from 'react';

type FileItem = {
    id: string | number;
    name: string;
    url: string;
};
type FolderType = {
    id: string | number;
    name: string;
    subfolders?: FolderType[];
};
interface FolderProps {
    folder: FolderType;
    depth?: number;
    defaultExpanded?: boolean;
}

const FILE_FOLDERS = ['Video', 'Skripta', 'Ostalo'];

function Folder({ folder, depth = 0, defaultExpanded = false }: FolderProps) {
    const [expanded, setExpanded] = useState<boolean>(defaultExpanded);
    const [files, setFiles] = useState<FileItem[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const isFileFolder = FILE_FOLDERS.includes(folder.name);
    const fetchFiles = async () => {
        if (files !== null) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`http://localhost:3000/mats/folders/${folder.id}/files`);
            if (!res.ok) 
                throw new Error(`${res.status} ${res.statusText}`);
            const fileData = (await res.json()) as FileItem[];
            setFiles(fileData);
        } catch (err: any) {
            console.error(`Failed to load files for folder ${folder.id}:`, err);
            setFiles([]);
            setError(err?.message ?? 'Failed to load files');
        } finally {
            setLoading(false);
        }
    };


    const toggleFolder = async () => {
        if (!expanded && isFileFolder) {
            await fetchFiles();
        }
        setExpanded(prev => !prev);
    };


    useEffect(() => {
        if (expanded && isFileFolder) {
            void fetchFiles();
        }
    }, [expanded]);

    return (
        <div>
            <div onClick={toggleFolder} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                {folder.name}
            </div>

            {expanded && (
                <div style={{ marginLeft: `${depth * 20}px` }}>
                    {folder.subfolders && folder.subfolders.map(subfolder => (
                        <Folder key={subfolder.id} folder={subfolder} depth={depth + 1} />
                    ))}

                    {isFileFolder && (
                        <>
                            {loading && <div>Loading files...</div>}
                            {error && <div style={{ color: 'red' }}>{error}</div>}

                            {files && files.map(file => {
                                let fileType = '';
                                if (file.name.includes('.')) {
                                    const ext = file.name.split('.').pop();
                                    fileType = ext ? ext.toUpperCase() : '';
                                }

                                return (
                                    <div
                                        key={file.id}
                                        style={{
                                            marginLeft: '5px',
                                            cursor: 'pointer',
                                            textDecoration: 'underline',
                                        }}
                                        onClick={() => window.open(file.url, '_blank', 'noopener,noreferrer')}
                                    >
                                        📄 {file.name}{fileType && ` (${fileType})`}
                                    </div>
                                );
                            })}

                            {files && files.length === 0 && !loading && <div>(No files)</div>}
                        </>
                    )}
                </div>
            )}
        </div>
    );

}

export default Folder;
