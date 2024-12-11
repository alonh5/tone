import { useState } from "react";
import UploadForm from "./UploadSong";
import SongList from "./SongsList";
import { Song } from "./SongsList";

const SongsList = () => <div>songs screen</div>
const UploadSong = () => <div>upload screen</div>

const song: Song = {
  name: "Imagine",
  listens: 12345,
};


export const ToneApp = () => {
  const [activeScreen, setActiveScreen] = useState('songs-screen');

  if (activeScreen === 'songs-screen') {
    return (
      <main className="container mx-auto p-4">
        <div>
          <button onClick={() => setActiveScreen('upload-screen')}>listen to songs</button>
          <h1 className="text-2xl font-bold mb-4">Upload Music</h1>
          <UploadForm />
        </div>
      </main>
    );
  }
  return (
    <div>
      <button onClick={() => setActiveScreen('songs-screen')}>upload songs</button>
      <h1 className="text-2xl font-bold mb-4">Your Songs</h1>
      <SongList songs={[song]} />
    </div>
  );
};
