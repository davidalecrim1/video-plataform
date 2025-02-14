run:
	docker-compose up --build -d

stop:
	docker-compose down

restart:
	make stop
	make run

ping:
	curl -v http://localhost:8095/healthz
	curl -v http://localhost:8095/video/hls/001/the_fascinating_history_of_go_1080_transcoded.m3u8
	curl -v http://localhost:8095/video/dash/001/manifest.mpd

# Create a new frontend project
create-frontend:
	cd frontend
	sudo su
	npm create vite@latest frontend -- --template react-ts
	chown -R davidalecrim frontend

clean:
	rm -rf frontend/node_modules
	yarn cache clean
	yarn install

# Transcode a video to HLS (HTTP Live Streaming) format.
# Usage:
#   make transcode_hls input=your_video.mp4 output=playlist.m3u8
#
# Example:
#   make transcode_hls input=input/001/the_fascinating_history_of_go_1080.mp4 output=output/001/hls/the_fascinating_history_of_go_1080_transcoded.m3u8
# This command transcodes the input to H.264/AAC and splits it into segments for HLS.
# 
# Documentation:
# -hls_time: The segment duration in seconds.
transcode_mp4_to_hls:
	ffmpeg -i $(input) \
	    -c:v libx264 -crf 23 \
	    -c:a aac -b:a 192k \
	    -hls_time 10 \
	    -hls_playlist_type vod \
	    $(output)

# Transcode a video to MPEG-DASH format
# Usage:
#   make transcode_mp4_to_dash input=your_video.mp4 output=manifest.mpd
#
# Example:
#   make transcode_mp4_to_dash input=input/001/the_fascinating_history_of_go_1080.mp4 output=output/dash/001/manifest.mpd
transcode_mp4_to_dash:
	mkdir -p $(dir $(output))
	ffmpeg -i $(input) \
	    -c:v libx264 -crf 23 \
	    -c:a aac -b:a 192k \
	    -f dash \
	    -use_timeline 1 \
	    -use_template 1 \
	    -min_seg_duration 10000 \
	    -seg_duration 10 \
	    $(output)
