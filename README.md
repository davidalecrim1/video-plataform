# Video Platform

This project is a comprehensive solution for video processing and streaming, featuring a React frontend and a Go (Golang) backend.

## Table of Contents

- [Video Platform](#video-platform)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Technologies](#technologies)
  - [Setup](#setup)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Usage](#usage)
    - [Running the Application](#running-the-application)
    - [Sample URLs for Tests](#sample-urls-for-tests)
  - [License](#license)

## Introduction

The Video Platform project aims to provide a seamless experience for video processing and streaming. It includes a frontend built with React and TypeScript, and a backend server written in Go (Golang). The platform supports video transcoding and streaming in HLS and DASH formats.

## Technologies

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Go (Golang), HTTP
- **Containerization**: Docker, Docker Compose

## Setup

### Prerequisites

- Docker
- Docker Compose
- Node.js
- npm or yarn

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/video-platform.git
    cd video-platform
    ```

2. Build and run the Docker containers:
    ```sh
    make run
    ```

3. Install frontend dependencies:
    ```sh
    cd frontend
    npm install
    ```

## Usage

### Running the Application

To start the application, run:
```bash
make run
```
To stop the application, run:
```bash
make stop
```

To restart the application, run:
```bash
make restart
```

Transcoding Videos
```bash
make transcode_hls input=path/to/your_video.mp4 output=path/to/output_playlist.m3u8
```
### Sample URLs for Tests
[Tears of Steel](https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8)
[Bip Bop](https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8)

Source: [ottverse.com](https:///free-hls-m3u8-test-urls/)

## License
This project is licensed under the MIT License. See the LICENSE file for details.