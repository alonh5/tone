import { useEffect, useState } from "react";
import { Header } from './Header/Header';
import { useAccount } from '@starknet-react/core';
import UploadForm, { Song } from "./UploadSong";
import SongList from "./SongsList";

export const ToneApp = () => {
  const starknetWallet = useAccount();
  const [activeScreen, setActiveScreen] = useState('songs-screen');
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    const request = indexedDB.open("SongDatabase", 2);

    request.onerror = (event) => {
      console.error("IndexedDB error:", request.error);
    };

    request.onsuccess = function () {
      const db = request.result;
      const transaction = db.transaction("songs", "readwrite");
      const store = transaction.objectStore("songs");

      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = (event) => {
        const songs = (event.target as IDBRequest).result;
        setSongs(songs);
      };

      getAllRequest.onerror = (event) => {
        console.error("Error fetching songs:", getAllRequest.error);
      };

      transaction.onerror = (event) => {
        console.error("Transaction error:", transaction.error);
      };
    };
  }, []);

  const onConnectWallet = async () => {
    // TODO: maybe do something here.
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/music_image.webp')" }}
    >
      <Header wallet={starknetWallet} onConnectWallet={onConnectWallet} />
      <main className="container mx-auto p-6 backdrop-blur-md">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold" style={{ color: "#a5a5ff" }}>
            {activeScreen === "songs-screen" ? "My Songs" : "Upload Music"}
          </h1>
          <button
            onClick={() =>
              setActiveScreen(
                activeScreen === "songs-screen" ? "upload-screen" : "songs-screen"
              )
            }
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
          >
            {activeScreen === "songs-screen" ? "Upload Songs" : "View Songs"}
          </button>
        </header>
        <section className="bg-gray-900 shadow-lg rounded-lg p-6">
          {activeScreen === "songs-screen" ? (
            <SongList songs={songs} />
          ) : (
            <UploadForm />
          )}
        </section>
      </main>
    </div>
  );
};
