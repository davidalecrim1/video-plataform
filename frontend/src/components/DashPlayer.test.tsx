import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import DashPlayer from './DashPlayer'

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

describe('DashPlayer', () => {
    it('should render without crashing', () => {
        const { getByTestId } = render(<DashPlayer src="http://example.com/stream.mpd" />)
        const videoElement = getByTestId('video-element')
        expect(videoElement).toBeInTheDocument()
    })
})