document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const videoGrid = document.getElementById('videoGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const desktopSearchInput = document.getElementById('desktopSearchInput');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    let currentVideos = [];

    // Functions
    async function loadVideos(jsonFilename) {
        const filePath = `data/${jsonFilename}`;
        videoGrid.innerHTML = `<p class="no-results">Loading...</p>`;
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`HTTP 404: ${filePath} not found.`);
            currentVideos = await response.json();
            displayVideos(currentVideos);
        } catch (error) {
            console.error(error);
            videoGrid.innerHTML = `<p class="no-results">Failed to load videos. Check console.</p>`;
        }
    }

    function displayVideos(videoArray) {
        videoGrid.innerHTML = '';
        if (!videoArray || videoArray.length === 0) {
            videoGrid.innerHTML = `<p class="no-results">No videos found.</p>`;
            return;
        }
        videoArray.forEach(video => {
            const card = document.createElement('div');
            card.className = 'video-card';
            card.dataset.id = video.id;
            card.innerHTML = `
                <div class="card-banner">
                    <img src="${video.poster}" alt="${video.title}" loading="lazy">
                </div>
                <div class="card-content">
                    <h3 class="card-title">${video.title}</h3>
                    <p class="card-actors">${video.actors.join(', ')}</p>
                </div>
            `;
            videoGrid.appendChild(card);
        });
    }

    function openDetailModal(video) {
        // ... (Fungsi ini sama seperti sebelumnya, tidak perlu diubah)
        const createSearchableTag = (type, value) => `<a href="#" class="tag-item searchable" data-type="${type}" data-value="${value}">${value}</a>`;
        modalBody.innerHTML = `<h2 class="modal-main-title">${video.title}</h2><div class="modal-poster"><img src="${video.poster}" alt="${video.title}"></div><a href="player.html?id=${video.id}" target="_blank" class="btn-watch-online">Watch Online</a><div class="modal-info-section"><span class="info-label">ID Code:</span><div class="tag-group">${createSearchableTag('id', video.id)}</div></div><div class="modal-info-section"><span class="info-label">Categories:</span><div class="tag-group">${video.categories.map(cat => createSearchableTag('category', cat)).join('')}</div></div><div class="modal-info-section"><span class="info-label">Actor:</span><div class="tag-group">${video.actors.map(actor => createSearchableTag('actor', actor)).join('')}</div></div><div class="meta-list"><div><span class="info-label">Year:</span> <span class="meta-value">${video.year}</span></div></div>`;
        modal.classList.add('active');
    }

    function closeModal() { modal.classList.remove('active'); }

    function performSearch(query) {
        const searchResult = currentVideos.filter(v => v.actors.includes(query) || v.categories.includes(query) || v.id === query);
        displayVideos(searchResult);
    }
    
    function handleSearchInput(e) {
        const query = e.target.value.toLowerCase();
        desktopSearchInput.value = query;
        mobileSearchInput.value = query;
        const result = currentVideos.filter(v => v.title.toLowerCase().includes(query) || v.id.toLowerCase().includes(query) || v.actors.some(a => a.toLowerCase().includes(query)));
        displayVideos(result);
    }

    // Event Listeners
    videoGrid.addEventListener('click', e => {
        const card = e.target.closest('.video-card');
        if (card) {
            const video = currentVideos.find(v => v.id === card.dataset.id);
            if (video) openDetailModal(video);
        }
    });
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    modalBody.addEventListener('click', e => {
        const tag = e.target.closest('.searchable');
        if (tag) {
            e.preventDefault();
            performSearch(tag.dataset.value);
            closeModal();
        }
    });

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    desktopSearchInput.addEventListener('input', handleSearchInput);
    mobileSearchInput.addEventListener('input', handleSearchInput);
    filterButtons.forEach(btn => btn.addEventListener('click', e => {
        filterButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        loadVideos(e.target.dataset.file);
    }));

    // Initial Load
    loadVideos('censored.json');
});
