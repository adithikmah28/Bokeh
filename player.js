document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Konfigurasi ---
    const API_DETAIL_URL = 'https://avdbapi.com/api.php/provide/vod?ac=detail&ids=';

    // --- 2. DOM Elements ---
    const videoTitle = document.getElementById('videoTitle');
    const videoActress = document.getElementById('videoActress');
    const videoPlayerWrapper = document.getElementById('videoPlayerWrapper');
    const videoPlayer = document.getElementById('videoPlayer');

    // --- 3. Fungsi Player Utama ---
    async function initPlayer() {
        // 1. Dapatkan ID dari URL
        const urlParams = new URLSearchParams(window.location.search);
        const videoId = urlParams.get('id');

        if (!videoId) {
            displayError("Video ID not found in URL.");
            return;
        }

        try {
            // 2. Ambil data detail video dari API
            const response = await fetch(`${API_DETAIL_URL}${videoId}`);
            if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
            
            const data = await response.json();
            if (!data.list || data.list.length === 0) throw new Error("Video not found in API response.");
            
            const videoDetails = data.list[0];

            // 3. Tampilkan informasi
            videoTitle.textContent = videoDetails.vod_name;
            videoActress.textContent = videoDetails.vod_actor || 'Unknown';
            document.title = `${videoDetails.vod_name} | MiyabiFlix`;

            // 4. Proses link video .m3u8
            // Contoh format: "BD$$$https://.../index.m3u8#HD$$$..."
            const playUrlString = videoDetails.vod_play_url;
            const urlParts = playUrlString.split('$$$');
            const m3u8Url = urlParts.length > 1 ? urlParts[1].split('#')[0] : null;

            if (!m3u8Url) throw new Error("Could not parse M3U8 URL from API response.");

            // 5. Inisialisasi HLS.js
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(m3u8Url);
                hls.attachMedia(videoPlayer);
                hls.on(Hls.Events.MANIFEST_PARSED, function () {
                    videoPlayer.play();
                });
            } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
                // Untuk browser native support seperti Safari
                videoPlayer.src = m3u8Url;
                videoPlayer.addEventListener('loadedmetadata', function () {
                    videoPlayer.play();
                });
            } else {
                displayError("Your browser does not support HLS video playback.");
            }

        } catch (error) {
            console.error("Failed to initialize player:", error);
            displayError(error.message);
        }
    }

    const displayError = (message) => {
        videoPlayerWrapper.innerHTML = `<p style="text-align:center; padding: 20px; font-size:1.2rem; color: #ff5555;">Error: ${message}</p>`;
        videoTitle.textContent = "Playback Error";
    };

    // --- Jalankan player saat halaman dimuat ---
    initPlayer();
});
