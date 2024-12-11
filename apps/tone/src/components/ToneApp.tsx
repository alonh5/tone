import { useState } from "react";
import { Header } from './Header/Header';
import { useAccount } from '@starknet-react/core';
import UploadForm from "./UploadSong";
import SongList from "./SongsList";
import { Song } from "./SongsList";

const song1: Song = {
  name: "Song 1",
  filename: "./music/song1.mp3",
  listens: 0,
};

const song2: Song = {
  name: "Song 2",
  filename: "./music/song2.mp3",
  listens: 0,
};

export const ToneApp = () => {
  const starknetWallet = useAccount();
  const [activeScreen, setActiveScreen] = useState('songs-screen');

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
            <SongList songs={[song1, song2]} />
          ) : (
            <UploadForm />
          )}
        </section>
      </main>
    </div>
  );
};
