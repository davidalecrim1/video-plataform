import { useEffect, useRef } from 'react'
import * as dashjs from 'dashjs'

interface Props {
    src: string
}

export function DashPlayer({ src }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const video = videoRef.current
        if (!video) {
            console.error('Video element not found')
            return
        }

        const player = dashjs.MediaPlayer().create()
        player.initialize(video, src, true)

        return () => {
            player.destroy()
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

export default DashPlayer 