document.addEventListener('DOMContentLoaded', () => {
    // Konfigurasi dan DOM Elements...
    const API_BASE_URL = "https://avdbapi.com/api.php/provide/vod/";
    const videoGrid = document.getElementById('videoGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const currentPageSpan = document.getElementById('currentPageSpan');
    let currentPage = 1, currentFilterType = 'latest', currentFilterValue = '', totalPages = 1;

    async function fetchVideos(page = 1) {
        videoGrid.innerHTML = '<div class="loading-spinner"></div>';
        let url = `${API_BASE_URL}?ac=detail&pg=${page}`;
        if (currentFilterType === 'category') url = `${API_BASE_URL}?ac=detail&t=${currentFilterValue}&pg=${page}`;
        else if (currentFilterType === 'search') url = `${API_BASE_URL}?ac=detail&wd=${currentFilterValue}&pg=${page}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Network response was not ok.");
            const data = await response.json();
            if (data && data.list && data.list.length > 0) {
                totalPages = data.pagecount;
                displayVideos(data.list);
                updatePagination(data.page, data.pagecount);
            } else {
                displayVideos([]);
                updatePagination(1, 1);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            videoGrid.innerHTML = `<p class="no-results">Failed to load videos.</p>`;
        }
    }

    // === FUNGSI INI DIPERBAIKI DENGAN LOGIKA YANG LEBIH LONGGAR ===
    function displayVideos(videoArray) {
        videoGrid.innerHTML = '';
        if (videoArray.length === 0) {
            videoGrid.innerHTML = `<p class="no-results">No videos found for this query.</p>`;
            return;
        }
        videoArray.forEach(video => {
            // SOLUSI: Filter dilonggarkan. Cukup pastikan video itu ada dan punya ID.
            // Judul dan gambar bisa kosong, tapi kartu tetap ditampilkan.
            if (!video || !video.vod_id) {
                return; // Lewati hanya jika data benar-benar tidak bisa digunakan.
            }

            const card = document.createElement('div');
            card.className = 'video-card';
            card.dataset.id = video.vod_id;
            
            // Logika yang aman untuk gambar.
            const posterUrl = (video.vod_pic || 'https://placehold.co/300x450/111/fff?text=No+Image').replace(/^http:\/\//i, 'https://');
            
            // Logika yang aman untuk judul dan aktor.
            const title = video.vod_name || 'No Title Available';
            const actors = video.vod_actor || 'N/A';

            card.innerHTML = `
                <div class="card-banner">
                    <img src="${posterUrl}" alt="${title}" loading="lazy" onerror="this.src='https://placehold.co/300x450/111/fff?text=Error'">
                </div>
                <div class="card-content">
                    <h3 class="card-title">${title}</h3>
                    <p class="card-actors">${actors}</p>
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

    // Event Listeners ... (Sama seperti sebelumnya)
    videoGrid.addEventListener('click', e => {
        const card = e.target.closest('.video-card');
        if (card && card.dataset.id) window.open(`player.html?id=${card.dataset.id}`, '_blank');
    });
    searchBtn.addEventListener('click', () => {
        const keyword = searchInput.value.trim();
        if (keyword) { currentFilterType = 'search'; currentFilterValue = encodeURIComponent(keyword); currentPage = 1; fetchVideos(currentPage); }
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
    nextPageBtn.addEventListener('click', () => { if (currentPage < totalPages) fetchVideos(currentPage + 1); });
    prevPageBtn.addEventListener('click', () => { if (currentPage > 1) fetchVideos(currentPage - 1); });

    // Initial Load
    fetchVideos();
});
