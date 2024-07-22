# REST APIs for Video Files

Welcome to the **Video Files REST API** project! This project provides a comprehensive backend solution for handling video files, including upload, trimming, merging, and link sharing functionalities.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [npm](https://www.npmjs.com/) (version 6.x or higher)

### Installation

1. **Clone the repository**:

    ```sh
    git clone https://github.com/harshpanchal04/video_api.git
    cd vide_api
    ```

2. **Install dependencies**:

    ```sh
    npm install
    ```

### Running the Server

To start the API server, run:

```sh
npm start
```

### Running Jest Test Suite

To start the Test Suite, run:

```sh
npm test
```

Note : You can also use your own file for testing by replacing it with tests/test_video.mp4 and renaming it as test_video.mp4 and can also alter trimming by modifying startTime and endTime in tests/video.test.js file. 


## API End Points

### For upload : /video/upload
file -> video.mp4
duration -> 8 (duration of video)

### For trim : /video/trim
```sh
body -> {
    "videoId" : "id",
    "startTime" : "0",
    "endTime" : "4"
}
```

### For merge : /video/merge
```sh
body -> {
    "videoIds" : [ id1, id2, id3 ]
}
```

### For downloading : /video/download/:id

