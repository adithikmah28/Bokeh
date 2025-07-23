document.addEventListener('DOMContentLoaded', async () => {
    // === PERUBAHAN KUNCI: Gunakan URL Maccms untuk detail ===
    const API_DETAIL_URL = "https://avdbapi.com/api.php/provide1/vod/?ac=detail&ids=";

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

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const videoId = urlParams.get('id');
        if (!videoId) throw new Error("Video ID not found in URL.");

        const response = await fetch(`${API_DETAIL_URL}${videoId}`);
        if (!response.ok) throw new Error(`API request failed with status ${response.status}.`);
        
        const data = await response.json();
        if (!data.list || data.list.length === 0) throw new Error("Video not found via API. The ID might be incorrect or the content removed.");

        const video = data.list[0];
        document.title = `${video.vod_name} | MiyabiFlix`;
        videoTitle.textContent = video.vod_name;
        videoActress.textContent = video.vod_actor || 'N/A';

        // Logika untuk mem-parsing dan mengamankan URL video
        const playUrlString = video.vod_play_url;
        if (!playUrlString || typeof playUrlString !== 'string') throw new Error("Video stream URL is missing or invalid.");
        
        // Parsing yang lebih aman
        const urlParts = playUrlString.split('$$$');
        let m3u8Url = urlParts.length > 1 ? urlParts[1].split('#')[0] : null;

        if (!m3u8Url) throw new Error("Could not parse a valid M3U8 URL from the API response.");
        
        // Amankan protokol
        m3u8Url = m3u8Url.replace(/^http:\/\//i, 'https://');

        // Logika HLS.js
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(m3u8Url);
            hls.attachMedia(videoPlayer);
            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    console.error('HLS Fatal Error:', data);
                    displayError('Cannot play this video stream. The source might be unavailable or blocked.');
                }
            });
        } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
            videoPlayer.src = m3u8Url;
            videoPlayer.addEventListener('error', () => displayError('Cannot play this video stream. The source might be unavailable.'));
        } else {
            displayError('Your browser does not support HLS video playback.');
        }

    } catch (error) {
        console.error("Player Error:", error);
        displayError(error.message);
    }
});
