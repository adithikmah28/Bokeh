document.addEventListener('DOMContentLoaded', () => {

    // --- DOM ELEMENTS ---
    const videoGrid = document.getElementById('videoGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    // ... elemen lainnya sama

    let currentVideos = [];

    // --- FUNCTIONS ---

    // PERUBAHAN DI SINI: Fungsi ini sekarang menambahkan prefix 'data/'
    async function loadVideos(jsonFilename) {
        const filePath = `data/${jsonFilename}`; // Tambahkan path folder di sini
        videoGrid.innerHTML = '<p class="no-results">Loading videos...</p>';
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`Cannot load ${filePath}`);
            const videos = await response.json();
            currentVideos = videos;
            displayVideos(currentVideos);
        } catch (error) {
            console.error(error);
            videoGrid.innerHTML = '<p class="no-results">Failed to load videos.</p>';
        }
    }

    function displayVideos(videoArray) {
        videoGrid.innerHTML = '';
        if (!videoArray || videoArray.length === 0) {
            videoGrid.innerHTML = '<p class="no-results">No videos found.</p>';
            return;
        }

        videoArray.forEach(video => {
            const videoCard = document.createElement('div');
            videoCard.className = 'video-card';
            // ... isi innerHTML sama seperti sebelumnya
            videoCard.innerHTML = `
                <div class="card-banner">
                    <img src="${video.poster}" alt="${video.title} Poster" loading="lazy">
                </div>
                <div class="card-content">
                    <h3>${video.title}</h3>
                    <p>${video.actress}</p>
                </div>
            `;
            
            videoCard.addEventListener('click', () => {
                const videoDetailContent = `
                    <div class="modal-poster">
                        <img src="${video.poster}" alt="${video.title}">
                    </div>
                    <h2>${video.title}</h2>
                    <h3>Starring: ${video.actress}</h3>
                    <a href="player.html?id=${video.id}" target="_blank" class="btn btn-primary play-btn"><i class="fas fa-play"></i> Watch Now</a>
                `;
                openModal(videoDetailContent);
            });

            videoGrid.appendChild(videoCard);
        });
    }

    // ... sisa fungsi (openModal, closeModal) dan event listener lainnya sama ...
    // ... TIDAK ADA PERUBAHAN DI SINI ...
    const searchInput = document.getElementById('searchInput');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    const closeModalBtn = document.getElementById('closeModalBtn');
    
    function openModal(content) {
        modalBody.innerHTML = content;
        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const jsonFile = button.dataset.file;
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            loadVideos(jsonFile); // Tidak perlu ubah di sini, fungsi loadVideos sudah handle
        });
    });
    
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // --- INITIAL LOAD ---
    // Panggil dengan nama file saja, fungsi loadVideos akan menambahkan path 'data/'
    loadVideos('censored.json'); 
});
