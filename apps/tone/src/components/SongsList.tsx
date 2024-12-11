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
    <ul className="space-y-4">
      {songs.map((song) => (
        <li key={song.name} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
          <span>{song.name}</span>
          <div className="flex items-center space-x-4">
            <button
              id="play-button"
              onClick={() => playSong(song)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {currentSong === song.name ? 'Playing...' : 'Play'}
            </button>
            <button
              id="pause-button"
              onClick={() => pauseSong(song)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Pause
            </button>
            <span>Listens: {song.listens}</span>
          </div>

          {currentSong === song.name && (
            <audio
              src={song.filename}
              controls
              autoPlay
              onEnded={() => setCurrentSong(null)}
            />
          )}
        </li>
      ))}
    </ul>
  )
}
