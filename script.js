document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const videoGrid = document.getElementById('videoGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    const closeModalBtn = document.getElementById('closeModalBtn');
    
    let currentVideos = [];

    // --- FUNCTIONS ---

    async function loadVideos(jsonFilename) {
        const filePath = `data/${jsonFilename}`;
        videoGrid.innerHTML = '<p class="no-results">Loading videos...</p>';
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`Cannot load ${filePath}`);
            const videos = await response.json();
            currentVideos = videos;
            displayVideos(currentVideos);
        } catch (error) {
            console.error(error);
            videoGrid.innerHTML = `<p class="no-results">Failed to load videos. Make sure you are using a Live Server.</p>`;
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
            videoCard.innerHTML = `
                <div class="card-banner">
                    <img src="${video.poster}" alt="${video.title} Poster" loading="lazy">
                </div>
                <div class="card-content">
                    <h3>${video.id.toUpperCase()}</h3>
                    <p>${video.title}</p>
                </div>`;
            
            // Pasang listener langsung di setiap kartu
            videoCard.addEventListener('click', () => {
                openDetailModal(video);
            });
            videoGrid.appendChild(videoCard);
        });
    }

    // === INI FUNGSI BARU YANG DIBUAT ULANG ===
    function openDetailModal(video) {
        const videoDetailContent = `
            <h2 class="modal-main-title">${video.title}</h2>
            <a href="player.html?id=${video.id}" target="_blank" class="btn btn-watch-online">Watch Online</a>
            
            <div class="modal-info-section">
                <span class="info-label">ID Code:</span>
                <div class="tag-group">
                    <span class="tag-item">${video.id}</span>
                </div>
            </div>

            <div class="modal-info-section">
                <span class="info-label">Categories:</span>
                <div class="tag-group">
                    ${video.categories.map(cat => `<span class="tag-item">${cat}</span>`).join('')}
                </div>
            </div>

            <div class="modal-info-section">
                <span class="info-label">Actor:</span>
                <div class="tag-group">
                    ${video.actors.map(actor => `<span class="tag-item">${actor}</span>`).join('')}
                </div>
            </div>

            <div class="meta-list">
                <div><span class="info-label">Year:</span> <span class="meta-value">${video.year}</span></div>
                <div><span class="info-label">Country:</span> <span class="meta-value">${video.country}</span></div>
                <div><span class="info-label">Director:</span> <span class="meta-value">${video.director}</span></div>
                <div><span class="info-label">Writer:</span> <span class="meta-value">${video.writer}</span></div>
                <div><span class="info-label">Duration:</span> <span class="meta-value">${video.duration}</span></div>
                <div><span class="info-label">Release:</span> <span class="meta-value">${video.release_date}</span></div>
            </div>
        `;
        
        // Tambahkan class khusus ke modal content untuk styling
        modal.querySelector('.modal-content').classList.add('detail-modal-content');
        modalBody.innerHTML = videoDetailContent;
        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
        // Hapus class khusus saat modal ditutup
        modal.querySelector('.modal-content').classList.remove('detail-modal-content');
    }

    // --- EVENT LISTENERS ---
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const jsonFile = button.dataset.file;
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            loadVideos(jsonFile);
        });
    });

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // --- INITIAL LOAD ---
    loadVideos('censored.json');
});
