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

    // --- 3. State Management ---
    let currentPage = 1;
    let currentFilterType = 'latest';
    let currentFilterValue = '';
    let totalPages = 1;

    // --- 4. Fungsi Inti ---

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
            // Periksa jika data.list ada sebelum mengakses properti lain
            if (data && data.list) {
                totalPages = data.pagecount;
                displayVideos(data.list);
                updatePagination(data.page, data.pagecount);
            } else {
                displayVideos([]); // Tampilkan grid kosong jika tidak ada data list
                updatePagination(1, 1);
            }

        } catch (error) {
            console.error("Fetch Error:", error);
            videoGrid.innerHTML = `<p class="no-results">Failed to load videos.</p>`;
        }
    }

    // === FUNGSI INI DIPERBAIKI DENGAN PENGECEKAN KEAMANAN ===
    function displayVideos(videoArray) {
        videoGrid.innerHTML = '';
        if (!videoArray || videoArray.length === 0) {
            videoGrid.innerHTML = `<p class="no-results">No videos found.</p>`;
            return;
        }
        videoArray.forEach(video => {
            const card = document.createElement('div');
            card.className = 'video-card';
            card.dataset.id = video.vod_id;
            
            let securePosterUrl = 'https://placehold.co/300x450/111/fff?text=No+Image'; // Gambar default

            // SOLUSI: Cek dulu apakah video.vod_pic ada dan tidak kosong
            if (video.vod_pic && typeof video.vod_pic === 'string') {
                securePosterUrl = video.vod_pic.replace(/^http:\/\//i, 'https://');
            }

            card.innerHTML = `
                <div class="card-banner">
                    <img src="${securePosterUrl}" alt="${video.vod_name}" loading="lazy" onerror="this.src='https://placehold.co/300x450/111/fff?text=Error'">
                </div>
                <div class="card-content">
                    <h3 class="card-title">${video.vod_name || 'No Title'}</h3>
                    <p class="card-actors">${video.vod_actor || 'N/A'}</p>
                </div>
            `;
            videoGrid.appendChild(card);
        });
    }

    function updatePagination(page, pagecount) {
        currentPage = parseInt(page) || 1;
        totalPages = parseInt(pagecount) || 1;
        currentPageSpan.textContent = `Page ${currentPage}`;
        prevPageBtn.disabled = currentPage <= 1;
        nextPageBtn.disabled = currentPage >= totalPages;
    }

    // --- 5. Event Listeners ---
    videoGrid.addEventListener('click', e => {
        const card = e.target.closest('.video-card');
        if (card && card.dataset.id) {
            window.open(`player.html?id=${card.dataset.id}`, '_blank');
        }
    });

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

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages) { fetchVideos(currentPage + 1); }
    });
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) { fetchVideos(currentPage - 1); }
    });

    // --- 6. Initial Load ---
    fetchVideos();
});
