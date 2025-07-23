document.addEventListener('DOMContentLoaded', async () => {

    // ... DOM Elements sama ...
    const playerContainer = document.querySelector('.player-container');
    const videoTitle = document.getElementById('videoTitle');
    const videoActress = document.getElementById('videoActress');
    const iframePlayer = document.getElementById('videoPlayerIframe');

    // PERUBAHAN DI SINI: Tambahkan path 'data/' ke nama file
    const dataFiles = ['data/censored.json', 'data/uncensored.json'];

    function displayError(message) {
        // ... fungsi displayError sama persis, tidak perlu diubah ...
        if (playerContainer) {
            playerContainer.innerHTML = `
                <div class="player-header">
                    <a href="index.html" class="back-btn"><i class="fas fa-arrow-left"></i> Back to Gallery</a>
                </div>
                <div class="error-message-container">
                    <h1><i class="fas fa-exclamation-triangle"></i> Playback Error</h1>
                    <p>${message}</p>
                </div>
            `;
        }
    }

    async function findVideoById(id) {
        // Tidak ada perubahan di sini, karena 'dataFiles' sudah berisi path yang benar
        for (const file of dataFiles) {
            try {
                const response = await fetch(file);
                if (!response.ok) continue;
                const videos = await response.json();
                const foundVideo = videos.find(video => video.id === id);
                if (foundVideo) return foundVideo;
            } catch (error) {
                console.error(`Error processing ${file}:`, error);
                continue;
            }
        }
        return null;
    }

    // ... Main Logic sama persis, tidak perlu diubah ...
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const videoId = urlParams.get('id'); 

        if (!videoId) {
            throw new Error("Video ID was not provided in the URL.");
        }

        const video = await findVideoById(videoId);

        if (!video) {
            throw new Error(`Video with ID "${videoId}" could not be found.`);
        }

        document.title = `${video.title} | MiyabiFlix`;
        videoTitle.textContent = video.title;
        videoActress.textContent = video.actress;
        iframePlayer.src = video.iframe_url;

    } catch (error) {
        console.error("Player Initialization Error:", error);
        displayError(error.message);
    }
});
