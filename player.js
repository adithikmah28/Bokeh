document.addEventListener('DOMContentLoaded', async () => {
    // --- DOM Elements & API Config ---
    const API_DETAIL_URL = "https://avdbapi.com/api.php/provide/vod/?ac=detail&ids=";
    const playerContainer = document.querySelector('.player-container');
    const videoTitle = document.getElementById('videoTitle');
    const videoActress = document.getElementById('videoActress');
    const videoPlayer = document.getElementById('videoPlayer');

    function displayError(message) {
        if (playerContainer) {
            playerContainer.innerHTML = `
                <div class="player-header"><a href="index.html" class="back-btn"><i class="fas fa-arrow-left"></i> Back to Gallery</a></div>
                <div class="error-message-container"><h1><i class="fas fa-exclamation-triangle"></i> Playback Error</h1><p>${message}</p></div>
            `;
        }
    }

    // --- Main Logic ---
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');

    if (!videoId) {
        displayError("Video ID not found in URL.");
        return;
    }

    try {
        const response = await fetch(`${API_DETAIL_URL}${videoId}`);
        const data = await response.json();
        if (!data.list || data.list.length === 0) throw new Error("Video not found.");

        const video = data.list[0];
        document.title = `${video.vod_name} | MiyabiFlix`;
        videoTitle.textContent = video.vod_name;
        videoActress.textContent = video.vod_actor || 'N/A';

        const playUrlString = video.vod_play_url;
        let m3u8Url = playUrlString.split('$$$')[1].split('#')[0];

        // === SOLUSI UNTUK STREAMING KOSONG ===
        // Ganti http:// menjadi https:// pada URL video
        m3u8Url = m3u8Url.replace(/^http:\/\//i, 'https://');

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(m3u8Url);
            hls.attachMedia(videoPlayer);
            hls.on(Hls.Events.ERROR, function (event, data) {
                if (data.fatal) {
                    console.error('HLS Fatal Error:', data);
                    displayError('Cannot play this video stream. The source might be unavailable.');
                }
            });
        } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
            videoPlayer.src = m3u8Url;
            videoPlayer.addEventListener('error', function() {
                displayError('Cannot play this video stream. The source might be unavailable.');
            });
        } else {
            displayError('Your browser does not support HLS video playback.');
        }

    } catch (error) {
        console.error("Player Error:", error);
        displayError(error.message);
    }
});
