import { useState } from "react";
import { Header } from './Header/Header';
import { useAccount } from '@starknet-react/core';
import UploadForm from "./UploadSong";
import SongList from "./SongsList";
import { Song } from "./SongsList";
import { listFiles } from "./s3";

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

export const ToneApp = async () => {
  const starknetWallet = useAccount();
  const [activeScreen, setActiveScreen] = useState('songs-screen');

  const onConnectWallet = async () => {
    // TODO: maybe do something here.

  };
  //const mysongs = (await listFiles('tone-sw')) ?? [];
  const mysongs = new Array(2).fill(song1);
  console.log("1111", mysongs);
  const songsObjs: Song[] = [];
  // iterate over the list
  for (const song of mysongs) {
    console.log(song);
    const temp_song: Song = {
      name: song.fileKey as string, // assuming song has a name property
      filename: song.presignedUrl, // assuming song has a filename property
      listens: 0,
    };
    songsObjs.push(temp_song);
  }
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
            <SongList songs={songsObjs} />
          ) : (
            <UploadForm />
          )}
        </section>
      </main>
    </div>
  );
};
