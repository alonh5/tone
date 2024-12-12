import { useAccount } from "@starknet-react/core";
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { CallData } from "starknet";

export interface Song {
    name: string;
    file: File;
    listens: number;
}

const SongsContext = createContext<Song[] | undefined>(undefined);

// ... rest of your existing context code remains the same

export default function UploadForm() {
    const [dragActive, setDragActive] = useState(false);
    const [songs, setSongs] = useState<Song[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const starknetWallet = useAccount();

    const saveToIndexedDB = (song: Song) => {
        if (!starknetWallet.account) {
            alert("You must connect a wallet first");
            return;
        }
        const request = indexedDB.open("SongDatabase", 2);

        request.onupgradeneeded = (event) => {
            const db = request.result;
            if (!db.objectStoreNames.contains("songs")) {
                db.createObjectStore("songs", { keyPath: "name" });
            }
        };

        request.onerror = (event) => {
            console.error("IndexedDB error:", request.error);
        };

        request.onsuccess = function () {
            //@ts-expect-error SOME ERROR
            starknetWallet.account.execute([{
                contractAddress: '0x057185459c594a0716ad6e44c04cdf9cbfb8510e7d34f23d6c50ee584fcb930f',
                entrypoint: 'add_song',
                calldata: CallData.compile({
                    song_name: song.name,
                })
            }]).then(() => {
                const db = request.result;
                const transaction = db.transaction("songs", "readwrite");
                const store = transaction.objectStore("songs");
                store.add({ ...song });


                transaction.oncomplete = () => {
                    console.log("Song added successfully");
                };

                transaction.onerror = (event) => {
                    console.error("Transaction error:", transaction.error);
                };
            });
        };
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        handleFiles(files);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            handleFiles(files);
        }
    };

    const handleFiles = (files: FileList) => {
        const file = files[0];
        if (!file) return;

        if (file.type !== "audio/mpeg") {
            alert("Please upload an MP3 file");
            return;
        }

        const newSong: Song = {
            name: file.name.substring(0, file.name.lastIndexOf(".")),
            file: file,
            listens: 0,
        };

        setSongs((prevSongs) => ([...prevSongs, newSong]));
        saveToIndexedDB(newSong);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div
            className={`flex flex-col items-center justify-center w-full max-w-lg mx-auto p-10 rounded-lg shadow-lg transition-colors ${dragActive ? "border-blue-500 bg-blue-900" : "border-gray-700 bg-gray-800"
                } border-2 border-dashed`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".mp3"
                className="hidden"
            />
            <p className="text-gray-300 text-lg font-medium">
                Drag and drop your <span className="text-blue-400 font-semibold">MP3</span> file here
            </p>
            <p className="text-sm text-gray-500 mt-2">or click to select a file</p>
            <ul className="mt-6 w-full text-gray-300">
            </ul>
        </div>
    );
}
