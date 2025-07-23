document.addEventListener('DOMContentLoaded', async () => {

    // --- DOM Elements ---
    const playerContainer = document.querySelector('.player-container');
    const videoTitle = document.getElementById('videoTitle');
    const videoActress = document.getElementById('videoActress');
    const iframePlayer = document.getElementById('videoPlayerIframe');

    // --- Data Files ---
    const dataFiles = ['censored.json', 'uncensored.json'];

    // === INI FUNGSI ERROR YANG SUDAH DISEMPURNAKAN ===
    /**
     * Menampilkan pesan error dengan mengganti seluruh isi container.
     * Metode ini anti-gagal karena tidak bergantung pada elemen lain.
     */
    function displayError(message) {
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
        } else {
            // Fallback jika container utama pun tidak ditemukan
            document.body.innerHTML = `<div style="color:white; text-align:center; padding-top: 50px;"><h1>Fatal Error</h1><p>${message}</p><a href="index.html">Go Back</a></div>`;
        }
    }

    async function findVideoById(id) {
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

    // --- Main Logic ---
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const videoId = parseInt(urlParams.get('id'));

        if (!videoId || isNaN(videoId)) {
            // Jika ID tidak ada atau bukan angka, langsung tampilkan error.
            throw new Error("A valid Video ID was not provided in the URL.");
        }

        const video = await findVideoById(videoId);

        if (!video) {
            // Jika video tidak ditemukan setelah mencari di semua file.
            throw new Error(`Video with ID "${videoId}" could not be found.`);
        }

        // Jika semua berhasil, lanjutkan seperti biasa
        document.title = `${video.title} | MiyabiFlix`;
        videoTitle.textContent = video.title;
        videoActress.textContent = video.actress;
        iframePlayer.src = video.iframe_url;

    } catch (error) {
        console.error("Player Initialization Error:", error);
        displayError(error.message); // Panggil fungsi error yang sudah bulletproof
    }
});
