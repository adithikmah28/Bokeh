document.addEventListener('DOMContentLoaded', async () => {

    // --- DOM Elements ---
    const videoTitle = document.getElementById('videoTitle');
    const videoActress = document.getElementById('videoActress');
    const iframePlayer = document.getElementById('videoPlayerIframe');
    const videoInfo = document.querySelector('.video-info');

    // --- Data Files ---
    // Daftar semua file JSON yang mungkin berisi video
    const dataFiles = ['censored.json', 'uncensored.json'];

    /** Fungsi untuk mencari video di semua file JSON */
    async function findVideoById(id) {
        for (const file of dataFiles) {
            try {
                const response = await fetch(file);
                if (!response.ok) continue; // Lanjut ke file berikutnya jika gagal
                const videos = await response.json();
                const foundVideo = videos.find(video => video.id === id);
                if (foundVideo) {
                    return foundVideo; // Kembalikan video jika ditemukan
                }
            } catch (error) {
                console.error(`Error loading or parsing ${file}:`, error);
                continue;
            }
        }
        return null; // Kembalikan null jika tidak ditemukan di semua file
    }

    /** Fungsi untuk menampilkan error */
    function displayError(message) {
        videoTitle.textContent = "Error";
        videoActress.textContent = "N/A";
        iframePlayer.parentElement.innerHTML = `<p style="text-align:center; padding: 20px; font-size:1.2rem;">${message}</p>`;
    }

    // --- Main Logic ---
    try {
        // 1. Dapatkan ID dari URL
        const urlParams = new URLSearchParams(window.location.search);
        const videoId = parseInt(urlParams.get('id'));

        if (!videoId) {
            throw new Error("Video ID not found in URL.");
        }

        // 2. Cari data video berdasarkan ID
        const video = await findVideoById(videoId);

        if (!video) {
            throw new Error("Video with this ID could not be found.");
        }

        // 3. Tampilkan informasi dan iframe
        document.title = `${video.title} | MiyabiFlix`;
        videoTitle.textContent = video.title;
        videoActress.textContent = video.actress;
        iframePlayer.src = video.iframe_url;

    } catch (error) {
        console.error("Player Error:", error);
        displayError(error.message);
    }
});
