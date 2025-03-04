import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './App'

// Seems like the dash.js library doesn't work 
// with Jest because of the virtual DOM
// so it needs to be mocked
jest.mock('dashjs', () => ({
    MediaPlayer: () => ({
        create: () => ({
            initialize: jest.fn(),
            destroy: jest.fn(),
        }),
    }),
}))

describe('App', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders the form and initial UI correctly', () => {
        render(<App />)
        expect(screen.getByText('Video Platform Client')).toBeInTheDocument()
        expect(screen.getByLabelText('HLS')).toBeInTheDocument()
        expect(screen.getByLabelText('MPEG-DASH')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('http://localhost:8095/video/hls/001/the_fascinating_history_of_go_1080_transcoded.m3u8')).toBeInTheDocument()
        expect(screen.getByText('Load Video')).toBeInTheDocument()
    })

    it('updates the video type and URL input placeholder correctly', () => {
        render(<App />)
        fireEvent.click(screen.getByLabelText('MPEG-DASH'))
        expect(screen.getByPlaceholderText('http://localhost:8095/video/dash/001/manifest.mpd')).toBeInTheDocument()
    })

    it('displays an error message for an invalid URL', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                statusText: 'Not Found',
            })
        ) as jest.Mock

        render(<App />)
        fireEvent.change(screen.getByPlaceholderText('http://localhost:8095/video/hls/001/the_fascinating_history_of_go_1080_transcoded.m3u8'), { target: { value: 'http://invalid-url.com' } })
        fireEvent.click(screen.getByText('Load Video'))

        await waitFor(() => {
            expect(screen.getByText('Failed to load video: Not Found')).toBeInTheDocument()
        })
    })

    it('displays an error message for an invalid content type', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                headers: {
                    get: () => 'text/html',
                },
            })
        ) as jest.Mock

        render(<App />)
        fireEvent.change(screen.getByPlaceholderText('http://localhost:8095/video/hls/001/the_fascinating_history_of_go_1080_transcoded.m3u8'), { target: { value: 'http://invalid-content-type.com' } })
        fireEvent.click(screen.getByText('Load Video'))

        await waitFor(() => {
            expect(screen.getByText('Invalid URL for HLS video')).toBeInTheDocument()
        })
    })

    it('renders the HlsPlayer component when a valid HLS URL is provided', async () => {
        const hlsSampleUrl = "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                headers: {
                    get: () => 'application/vnd.apple.mpegurl',
                },
            })
        ) as jest.Mock

        render(<App />)
        fireEvent.change(screen.getByPlaceholderText('http://localhost:8095/video/hls/001/the_fascinating_history_of_go_1080_transcoded.m3u8'), { target: { value: hlsSampleUrl } })
        fireEvent.click(screen.getByText('Load Video'))

        await waitFor(() => {
            expect(screen.getByTestId('hls-player')).toBeInTheDocument()
        })
    })

    it('renders the DashPlayer component when a valid DASH URL is provided', async () => {
        const dashSampleUrl = "https://dash.akamaized.net/dash264/TestCasesUHD/2b/11/MultiRate.mpd"

        // mock api call because the dash.js doesn't work with Jest.
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                headers: {
                    get: () => 'application/dash+xml',
                },
            })
        ) as jest.Mock

        render(<App />)
        fireEvent.click(screen.getByLabelText('MPEG-DASH'))
        fireEvent.change(screen.getByPlaceholderText('http://localhost:8095/video/dash/001/manifest.mpd'), { target: { value: dashSampleUrl } })
        fireEvent.click(screen.getByText('Load Video'))

        await waitFor(() => {
            expect(screen.getByTestId('dash-player')).toBeInTheDocument()
        })
    })
})