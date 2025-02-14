import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

interface Props {
    src: string
}

export function HlsPlayer({ src }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const video = videoRef.current

        if (!video) {
            console.error('Video element not found')
        }

        if (video && Hls.isSupported()) {
            const hls = new Hls()

            hls.loadSource(src)
            hls.attachMedia(video)

            return () => {
                hls.destroy()
            }
        } else if (video && video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src
        }

    }, [src])

    return (
        <div className="aspect-w-16 aspect-h-9">
            <video
                ref={videoRef}
                controls
                className="w-full h-full object-contain"
            />
        </div>
    )
}

export default HlsPlayer