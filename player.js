document.addEventListener('DOMContentLoaded', async () => {
    // --- DOM Elements & API Config ---
    const API_DETAIL_URL = "https://avdbapi.com/api.php/provide/vod/?ac=detail&ids=";
    const videoTitle = document.getElementById('videoTitle');
    const videoActress = document.getElementById('videoActress');
    const videoPlayerWrapper = document.getElementById('videoPlayerWrapper');
    const videoPlayer = document.getElementById('videoPlayer');

    // --- Main Logic ---
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');

    if (!videoId) {
        // ... (displayError function)
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

        // Logika HLS.js untuk memutar .m3u8
        const playUrlString = video.vod_play_url;
        // Ambil URL dari format 'BD$$$url#HD$$$url'
        const m3u8Url = playUrlString.split('$$$')[1].split('#')[0];

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(m3u8Url);
            hls.attachMedia(videoPlayer);
        } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
            videoPlayer.src = m3u8Url;
        }

    } catch (error) {
        console.error("Player Error:", error);
        // ... (displayError function)
    }
});
