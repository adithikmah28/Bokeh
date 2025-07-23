document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Konfigurasi API ---
    const API_URL = 'https://avdbapi.com/api.php/provide/vod';
    let allApiVideos = []; // Untuk menyimpan semua data video dari API

    // --- 2. DOM ELEMENTS ---
    const videoGrid = document.getElementById('videoGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchContainer = document.querySelector('.search-container');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const loginBtn = document.getElementById('loginBtn');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // --- 3. FUNCTIONS ---

    /** Mengambil dan menampilkan video dari API */
    async function fetchAndRenderVideos() {
        videoGrid.innerHTML = '<p class="no-results">Loading videos...</p>';
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            allApiVideos = data.list; // Simpan data asli
            displayVideos(allApiVideos); // Tampilkan semua video saat pertama kali load
        } catch (error) {
            console.error("Could not fetch videos:", error);
            videoGrid.innerHTML = '<p class="no-results">Failed to load videos. Please try again later.</p>';
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
            videoCard.dataset.id = video.vod_id; // Gunakan vod_id dari API
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

    const openModal = (content) => {
        modalBody.innerHTML = content;
        modal.classList.add('active');
    };

    const closeModal = () => {
        modal.classList.remove('active');
        modalBody.innerHTML = '';
    };

    // --- 4. EVENT LISTENERS ---

    // Filter (sekarang memfilter data yang sudah disimpan)
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Logika filter saat ini tidak bisa bekerja langsung dengan API ini
            // karena API tidak menyediakan kategori seperti yang kita buat.
            // Untuk sementara, kita buat tombol filter hanya mengubah style saja.
            // Atau, bisa diimplementasikan jika Anda tahu parameter filter di API-nya.
            console.warn("Filtering logic needs API parameter support.");
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // Search (sekarang mencari dari data yang sudah disimpan)
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const searchedVideos = allApiVideos.filter(video => 
            video.vod_name.toLowerCase().includes(searchTerm) || 
            (video.vod_actor && video.vod_actor.toLowerCase().includes(searchTerm))
        );
        displayVideos(searchedVideos);
    });
    
    // Open video detail modal
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
                <div class="tags">
                    <span>${video.type_name}</span>
                </div>
                <button data-videoid="${video.vod_id}" class="btn btn-primary play-btn"><i class="fas fa-play"></i> Watch Now</button>
            `;
            openModal(videoDetailContent);
        }
    });

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

    // Sisa event listener lainnya (Login, Hamburger, dll.)
    loginBtn.addEventListener('click', () => { /* ... Logika login modal ... */ });
    searchBtn.addEventListener('click', (e) => { e.preventDefault(); searchContainer.classList.toggle('active'); searchInput.focus(); });
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    hamburger.addEventListener('click', () => { hamburger.classList.toggle('active'); navMenu.classList.toggle('active'); });

    // --- 5. INITIAL FETCH ---
    fetchAndRenderVideos();
});
