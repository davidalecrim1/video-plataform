import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import HlsPlayer from './HlsPlayer'
import Hls from 'hls.js'

describe("HlsPlayer", () => {
    const hlsSampleUrl = "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"

    it('should render without crashing', () => {
        render(<HlsPlayer src={hlsSampleUrl} />)
    })

    it('should contain a video element', () => {
        render(<HlsPlayer src={hlsSampleUrl} />)
        const videoElement = screen.getByTestId('video-element')
        expect(videoElement).toBeInTheDocument()
    })

    it('should use the Hls.js when supported', () => {
        Hls.isSupported = jest.fn().mockReturnValue(true)
        render(<HlsPlayer src={hlsSampleUrl} />)
        expect(Hls.isSupported).toHaveBeenCalled()
    })
})