document.addEventListener('DOMContentLoaded', () => {

    // --- DATA PUBLIK (Dibutuhkan untuk menampilkan info seperti judul/aktris) ---
    const videos = [
        { id: 1, title: 'Secret Office Affair', actress: 'Yua Mikami', poster: 'https://placehold.co/300x450/111/fff?text=MIAA-123', duration: '24:15', categories: ['new', 'milf'] },
        { id: 2, title: 'Private Tutor\'s Lesson', actress: 'Eimi Fukada', poster: 'https://placehold.co/300x450/111/fff?text=SSIS-021', duration: '31:02', categories: ['new', 'school', 'uncensored'] },
        { id: 3, title: 'Lost in Translation', actress: 'Ria Sakura', poster: 'https://placehold.co/300x450/111/fff?text=IPX-456', duration: '28:44', categories: ['cosplay'] },
        { id: 4, title: 'After School Special', actress: 'Kana Momonogi', poster: 'https://placehold.co/300x450/111/fff?text=JUFE-111', duration: '22:50', categories: ['school'] },
        { id: 5, title: 'My Wife\'s Sister', actress: 'Yui Hatano', poster: 'https://placehold.co/300x450/111/fff?text=MIDE-789', duration: '35:12', categories: ['milf', 'uncensored'] },
        { id: 6, title: 'Cosplay Cafe Dream', actress: 'Rin Azuma', poster: 'https://placehold.co/300x450/111/fff?text=CAWD-007', duration: '19:30', categories: ['cosplay', 'new'] },
    ];
    
    // --- DATA PRIVAT (Hanya berisi link video. Ini yang dipisahkan) ---
    const videoSources = [
        // Ganti URL ini dengan link video .mp4 kamu yang sebenarnya
        { id: 1, src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
        { id: 2, src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
        { id: 3, src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
        { id: 4, src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
        { id: 5, src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
        { id: 6, src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
    ];
    
    // --- FUNGSI PLAYER ---
    const initPlayer = () => {
        // 1. Dapatkan ID dari URL (misal: player.html?id=5)
        const urlParams = new URLSearchParams(window.location.search);
        const videoId = parseInt(urlParams.get('id'));

        if (!videoId) {
            displayError("Video ID not found.");
            return;
        }

        // 2. Cari data video berdasarkan ID
        const videoDetails = videos.find(v => v.id === videoId);
        const videoData = videoSources.find(vs => vs.id === videoId);

        if (!videoDetails || !videoData) {
            displayError("Video not found in database.");
            return;
        }
        
        // 3. Tampilkan informasi dan video player
        document.getElementById('videoTitle').textContent = videoDetails.title;
        document.getElementById('videoActress').textContent = videoDetails.actress;
        
        const videoPlayerWrapper = document.getElementById('videoPlayerWrapper');
        videoPlayerWrapper.innerHTML = `
            <video controls autoplay playsinline>
                <source src="${videoData.src}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        `;
    };

    const displayError = (message) => {
        document.getElementById('videoPlayerWrapper').innerHTML = `<p style="text-align:center; padding: 20px; font-size:1.2rem;">${message}</p>`;
        document.getElementById('videoTitle').textContent = "Error";
    };

    // --- Jalankan player saat halaman dimuat ---
    initPlayer();
});
