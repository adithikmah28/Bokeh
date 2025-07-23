document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Konfigurasi API ---
    const API_BASE_URL = "https://avdbapi.com/api.php/provide/vod/";

    // --- 2. DOM Elements ---
    const videoGrid = document.getElementById('videoGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const currentPageSpan = document.getElementById('currentPageSpan');
    // ... sisa elemen modal

    // --- 3. State Management ---
    let currentPage = 1;
    let currentFilterType = 'latest';
    let currentFilterValue = '';
    let totalPages = 1;

    // --- 4. Fungsi Inti ---

    /** Fungsi utama untuk mengambil data dari API */
    async function fetchVideos(page = 1) {
        videoGrid.innerHTML = '<div class="loading-spinner"></div>';
        
        let url = `${API_BASE_URL}?ac=detail&pg=${page}`;

        if (currentFilterType === 'category') {
            url = `${API_BASE_URL}?ac=detail&t=${currentFilterValue}&pg=${page}`;
        } else if (currentFilterType === 'search') {
            url = `${API_BASE_URL}?ac=detail&wd=${currentFilterValue}&pg=${page}`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Network response was not ok.");
            
            const data = await response.json();
            totalPages = data.pagecount;
            displayVideos(data.list);
            updatePagination(data.page, data.pagecount);

        } catch (error) {
            console.error("Fetch Error:", error);
            videoGrid.innerHTML = `<p class="no-results">Failed to load videos.</p>`;
        }
    }

    /** Fungsi untuk menampilkan video ke grid */
    function displayVideos(videoArray) {
        videoGrid.innerHTML = '';
        if (!videoArray || videoArray.length === 0) {
            videoGrid.innerHTML = `<p class="no-results">No videos found.</p>`;
            return;
        }
        videoArray.forEach(video => {
            const card = document.createElement('div');
            card.className = 'video-card';
            card.dataset.id = video.vod_id; // Simpan ID untuk modal
            card.innerHTML = `
                <div class="card-banner">
                    <img src="${video.vod_pic}" alt="${video.vod_name}" loading="lazy">
                </div>
                <div class="card-content">
                    <h3 class="card-title">${video.vod_name}</h3>
                    <p class="card-actors">${video.vod_actor || 'N/A'}</p>
                </div>
            `;
            videoGrid.appendChild(card);
        });
    }

    /** Fungsi untuk memperbarui tombol paginasi */
    function updatePagination(page, pagecount) {
        currentPage = parseInt(page);
        totalPages = parseInt(pagecount);
        currentPageSpan.textContent = `Page ${currentPage}`;
        prevPageBtn.disabled = currentPage <= 1;
        nextPageBtn.disabled = currentPage >= totalPages;
    }

    // --- 5. Event Listeners ---

    // Klik pada kartu video
    videoGrid.addEventListener('click', e => {
        const card = e.target.closest('.video-card');
        if (card) {
            window.open(`player.html?id=${card.dataset.id}`, '_blank');
        }
    });

    // Filter kategori
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentFilterType = btn.dataset.type;
            currentFilterValue = btn.dataset.id;
            currentPage = 1;
            fetchVideos(currentPage);
        });
    });

    // Pencarian
    searchBtn.addEventListener('click', () => {
        const keyword = searchInput.value.trim();
        if (keyword) {
            currentFilterType = 'search';
            currentFilterValue = encodeURIComponent(keyword);
            currentPage = 1;
            fetchVideos(currentPage);
        }
    });
    searchInput.addEventListener('keyup', e => { if (e.key === 'Enter') searchBtn.click(); });
    
    // Paginasi
    nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            fetchVideos(currentPage + 1);
        }
    });

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            fetchVideos(currentPage - 1);
        }
    });

    // --- 6. Initial Load ---
    fetchVideos();
});
