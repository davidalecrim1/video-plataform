import { useState } from 'react'
import HlsPlayer from './components/HlsPlayer'
import DashPlayer from './components/DashPlayer'
import React from 'react'

type VideoType = 'hls' | 'dash'

function App() {
  const [url, setUrl] = useState('')
  const [showPlayer, setShowPlayer] = useState(false)
  const [videoType, setVideoType] = useState<VideoType>('hls')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setShowPlayer(false)
    setIsLoading(true)

    try {
      const response = await fetch(url)
      if (!response.ok) {
        console.log(response)
        throw new Error(`Failed to load video: ${response.statusText}`)
      }

      const contentType = response.headers.get('content-type')
      const isValidContent = videoType === 'hls'
        ? contentType?.includes('application/vnd.apple.mpegurl') || contentType?.includes('application/x-mpegurl')
        : contentType?.includes('application/dash+xml')

      if (!isValidContent) {
        throw new Error(`Invalid URL for ${videoType.toUpperCase()} video`)
      }

      setShowPlayer(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load video')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoType(e.target.value as VideoType)
    setShowPlayer(false)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">
          Video Platform Client
        </h1>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-indigo-600 focus:ring-indigo-500"
                    name="videoType"
                    value="hls"
                    checked={videoType === 'hls'}
                    onChange={handleOnChange}
                  />
                  <span className="ml-2 text-gray-300">HLS</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-indigo-600 focus:ring-indigo-500"
                    name="videoType"
                    value="dash"
                    checked={videoType === 'dash'}
                    onChange={handleOnChange}
                  />
                  <span className="ml-2 text-gray-300">MPEG-DASH</span>
                </label>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-300"
                >
                  Video URL ({videoType.toUpperCase()}):
                </label>
                <div className="flex gap-3">
                  <input
                    id="url"
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={
                      videoType === 'hls'
                        ? "http://localhost:8095/video/hls/001/the_fascinating_history_of_go_1080_transcoded.m3u8"
                        : "http://localhost:8095/video/dash/001/manifest.mpd"
                    }
                    className="flex-1 min-w-0 rounded-md bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !url}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Loading...' : 'Load Video'}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-md">
              <p className="text-red-200">{error}</p>
            </div>
          )}
        </div>

        {showPlayer && url && !error && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">
              {videoType.toUpperCase()} Player
            </h2>
            <div className="aspect-w-16 aspect-h-9">
              {videoType === 'hls' ? (
                <HlsPlayer
                  src={url} />
              ) : (
                <DashPlayer
                  src={url} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
