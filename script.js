document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DATA SOURCE: List of Video IDs ---
    // INI BAGIAN PALING PENTING. Tambahkan atau kurangi ID video di sini
    // untuk mengontrol video apa saja yang muncul di galeri.
    const videoIds = [
        471140, // Ini ID dari API yang kamu berikan
        471139,
        471138,
        471137,
        471136,
        471135,
        471134,
        471133,
        471132,
        471131,
        471130,
        471129
    ];

    const API_DETAIL_URL_BASE = 'https://avdbapi.com/api.php/provide/vod?ac=detail&ids=';
    let allApiVideos = []; // Untuk menyimpan semua data video yang berhasil diambil
    let isGridListenerAttached = false;

    // --- 2. DOM ELEMENTS ---
    const videoGrid = document.getElementById('videoGrid');
    const searchInput = document.getElementById('searchInput');
    const searchContainer = document.querySelector('.search-container');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    const closeModalBtn = document.getElementById('closeModalBtn');
    // ... sisa DOM elements lainnya sama
    const searchBtn = document.getElementById('searchBtn');
    const loginBtn = document.getElementById('loginBtn');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // --- 3. FUNCTIONS ---

    /** Fungsi utama baru: Membangun galeri dari list ID */
    async function buildGalleryFromIds() {
        videoGrid.innerHTML = '<p class="no-results">Building gallery, please wait...</p>';
        
        try {
            // Buat array of promises, satu untuk setiap ID
            const fetchPromises = videoIds.map(id => 
                fetch(`${API_DETAIL_URL_BASE}${id}`).then(response => {
                    if (!response.ok) {
                        console.error(`Failed to fetch ID ${id}: ${response.statusText}`);
                        return null; // Kembalikan null jika fetch gagal
                    }
                    return response.json();
                })
            );

            // Jalankan semua fetch secara paralel dan tunggu semuanya selesai
            const results = await Promise.all(fetchPromises);

            // Proses hasilnya: ambil 'list[0]' dari setiap hasil yang valid
            allApiVideos = results
                .filter(result => result && result.list && result.list.length > 0) // Filter hasil yang tidak valid atau kosong
                .map(result => result.list[0]); // Ambil objek video dari dalam 'list'

            if (allApiVideos.length === 0) {
                throw new Error("No valid video data could be fetched.");
            }

            displayVideos(allApiVideos); // Tampilkan video ke grid

            // Pasang listener HANYA SETELAH data siap dan grid ditampilkan
            if (!isGridListenerAttached) {
                attachGridClickListener();
                isGridListenerAttached = true;
            }

        } catch (error) {
            console.error("Could not build gallery:", error);
            videoGrid.innerHTML = '<p class="no-results">Failed to build gallery. Check console for details.</p>';
        }
    }

    /** Menampilkan video ke grid */
    function displayVideos(videoArray) {
        videoGrid.innerHTML = '';
        if (!videoArray || videoArray.length === 0) {
            videoGrid.innerHTML = '<p class="no-results">No videos found.</p>';
            return;
        }
        videoArray.forEach(video => {
            const videoCard = document.createElement('div');
            videoCard.className = 'video-card';
            videoCard.dataset.id = video.vod_id;
            videoCard.innerHTML = `
                <div class="card-banner">
                    <img src="${video.vod_pic}" alt="${video.vod_name} Poster" loading="lazy">
                    <div class="card-overlay">
                        <span class="card-tag quality">${video.vod_quality || 'HD'}</span>
                        <span class="card-tag duration">${video.vod_duration || 'N/A'}</span>
                    </div>
                </div>
                <div class="card-content">
                    <h3>${video.vod_name}</h3>
                    <p>${video.vod_actor || 'Unknown Actress'}</p>
                </div>
            `;
            videoGrid.appendChild(videoCard);
        });
    }
    
    /** Fungsi untuk memasang listener klik pada grid */
    function attachGridClickListener() {
        videoGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.video-card');
            if (!card) return;
            const videoId = parseInt(card.dataset.id);
            const video = allApiVideos.find(v => v.vod_id === videoId);
            if (video) {
                const videoDetailContent = `
                    <div class="modal-poster">
                        <img src="${video.vod_pic}" alt="${video.vod_name}">
                    </div>
                    <h2>${video.vod_name}</h2>
                    <h3>Starring: ${video.vod_actor || 'Unknown'}</h3>
                    <p>Duration: ${video.vod_duration || 'N/A'}</p>
                    <div class="tags"><span>${video.type_name}</span></div>
                    <button data-videoid="${video.vod_id}" class="btn btn-primary play-btn"><i class="fas fa-play"></i> Watch Now</button>
                `;
                openModal(videoDetailContent);
            }
        });
    }

    const openModal = (content) => {
        modalBody.innerHTML = content;
        modal.classList.add('active');
    };

    const closeModal = () => {
        modal.classList.remove('active');
        modalBody.innerHTML = '';
    };

    // --- 4. EVENT LISTENERS ---

    // Event listener untuk tombol 'Watch Now' di dalam modal
    modalBody.addEventListener('click', (e) => {
        const playButton = e.target.closest('.play-btn');
        if (playButton) {
            const videoId = playButton.dataset.videoid;
            if (videoId) {
                window.open(`player.html?id=${videoId}`, '_blank');
                closeModal();
            }
        }
    });

    // Search
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const searchedVideos = allApiVideos.filter(video => 
            video.vod_name.toLowerCase().includes(searchTerm) || 
            (video.vod_actor && video.vod_actor.toLowerCase().includes(searchTerm))
        );
        displayVideos(searchedVideos);
    });
    
    // Sisa event listener lainnya tidak berubah
    searchBtn.addEventListener('click', (e) => { e.preventDefault(); searchContainer.classList.toggle('active'); searchInput.focus(); });
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    hamburger.addEventListener('click', () => { hamburger.classList.toggle('active'); navMenu.classList.toggle('active'); });
    // Dll...

    // --- 5. INITIAL ACTION ---
    buildGalleryFromIds(); // Jalankan fungsi utama untuk memulai proses
});
