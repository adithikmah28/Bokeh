document.addEventListener('DOMContentLoaded', () => {
    const categoryTitle = document.getElementById('category-title');
    const categoryGrid = document.getElementById('category-grid');
    const paginationContainer = document.getElementById('pagination-container');
    const itemsPerPage = 15;
    let currentPage = 1;
    const params = new URLSearchParams(window.location.search);
    const categoryName = params.get('cat');

    if (!categoryName) {
        categoryTitle.textContent = 'Kategori Tidak Ditemukan';
        return;
    }

    const pageTitle = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    categoryTitle.textContent = pageTitle;
    document.title = `Kategori ${pageTitle} - BokehFlix`;

    fetch('videos.json')
        .then(response => response.json())
        .then(allVideos => {
            const filteredVideos = allVideos.filter(video => video.category === categoryName);
            if (filteredVideos.length === 0) {
                categoryGrid.innerHTML = "<p>Tidak ada video dalam kategori ini.</p>";
                return;
            }

            function displayPage(page) {
                currentPage = page;
                categoryGrid.innerHTML = '';
                const start = (page - 1) * itemsPerPage;
                const end = start + itemsPerPage;
                const paginatedItems = filteredVideos.slice(start, end);

                for (const video of paginatedItems) {
                    categoryGrid.innerHTML += `
                        <a href="nonton.html?id=${video.id}" class="poster-card">
                            <img src="${video.thumbnail}" alt="${video.title}"><div class="poster-overlay"><i class="fas fa-play-circle"></i></div><div class="poster-title">${video.title}</div>
                        </a>`;
                }
            }

            function setupPagination() {
                paginationContainer.innerHTML = '';
                const pageCount = Math.ceil(filteredVideos.length / itemsPerPage);
                for (let i = 1; i <= pageCount; i++) {
                    const btn = document.createElement('a');
                    btn.href = '#';
                    btn.innerText = i;
                    if (i === currentPage) btn.classList.add('active');
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        displayPage(i);
                        document.querySelector('.pagination a.active').classList.remove('active');
                        e.target.classList.add('active');
                    });
                    paginationContainer.appendChild(btn);
                }
            }
            displayPage(1);
            setupPagination();
        });
});
