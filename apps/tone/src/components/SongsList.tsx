'use client'

import { useState } from 'react'
import { Song } from './UploadSong';
import { useAccount } from '@starknet-react/core';
import { CallData } from 'starknet';

export default function SongList({ songs }: { songs: Song[] }) {
  const [currentSong, setCurrentSong] = useState<string | null>(null)
  const starknetWallet = useAccount();

  const playSong = async (song: Song) => {
    if (!starknetWallet.account) {
      alert("You must connect a wallet first");
      return;
    }
    starknetWallet.account.execute([
      {
        contractAddress: "0x0291508da540a23dd68edb3672590ca2c18f45e7998537f30e8e7701bb679f97",
        entrypoint: "play_song",
        calldata: CallData.compile({
          song_name: song.name,
        }),
      },
    ]).then(() => {
      song.listens += 1;
      setCurrentSong(song.name);
    });
  }

  const pauseSong = async (song: Song) => {
    setCurrentSong(null);
  }

  return (
    <ul className="space-y-4 w-full max-w-5xl mx-auto bg-gray-900 shadow-lg p-6 rounded-lg">
      {songs.map((song) => (
        <li key={song.name} className="flex items-center justify-between bg-gray-800 shadow-md p-4 rounded-lg">
          <div>
            <p className="text-lg font-medium" style={{ color: "#a5a5ff" }}>{song.name}</p>
            <p className="text-sm" style={{ color: "#d1c4ff" }}>Listens: {song.listens}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              id="play-button"
              onClick={() => playSong(song)}
              className={`px-4 py-2 rounded text-white transition-colors ${currentSong === song.name
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-blue-500 hover:bg-blue-600'
                }`}
              disabled={currentSong === song.name}
            >
              <img src={currentSong === song.name ? "/playing.ico" : "/play.ico"} alt="Icon" width="20px" height="20px" />
            </button>
            <button
              id="pause-button"
              onClick={() => pauseSong(song)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={currentSong !== song.name}
            >
              <img src="/pause.ico" alt="Icon" width="20px" height="20px" />
            </button>
          </div>

          {currentSong === song.name && (
            <audio
              src={URL.createObjectURL(song.file)}
              autoPlay
              onEnded={() => setCurrentSong(null)}
            />
          )}
        </li>
      ))}
    </ul>
  )
}
