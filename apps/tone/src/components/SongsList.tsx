'use client'

import { useState } from 'react'

export interface Song {
  name: string
  filename: string
  listens: number
}

export default function SongList({ songs }: { songs: Song[] }) {
  const [currentSong, setCurrentSong] = useState<string | null>(null)

  const playSong = async (song: Song) => {
    song.listens += 1;
    setCurrentSong(song.name);
    try {
      await fetch('/api/listen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: song.name }),
      })
    } catch (error) {
      console.error('Error updating listen count:', error)
    }
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
              src={song.filename}
              autoPlay
              onEnded={() => setCurrentSong(null)}
            />
          )}
        </li>
      ))}
    </ul>
  )
}
