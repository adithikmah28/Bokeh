document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DOM ELEMENTS ---
    const videoGrid = document.getElementById('videoGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const desktopSearchInput = document.getElementById('desktopSearchInput');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // --- 2. STATE VARIABLE ---
    let currentVideos = [];

    // --- 3. FUNCTIONS ---

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
            videoCard.dataset.id = video.id; 
            videoCard.innerHTML = `
                <div class="card-banner">
                    <img src="${video.poster}" alt="${video.title} Poster" loading="lazy">
                </div>
                <div class="card-content">
                    <h3 class="card-title">${video.title}</h3>
                    <p class="card-actors">${video.actors.join(', ')}</p>
                </div>`;
            videoGrid.appendChild(videoCard);
        });
    }

    function openDetailModal(video) {
        const createSearchableTag = (type, value) => `<a href="#" class="tag-item searchable" data-type="${type}" data-value="${value}">${value}</a>`;
        const videoDetailContent = `
            <h2 class="modal-main-title">${video.title}</h2>
            <div class="modal-poster"><img src="${video.poster}" alt="${video.title} Poster"></div>
            <a href="player.html?id=${video.id}" target="_blank" class="btn btn-watch-online">Watch Online</a>
            <div class="modal-info-section"><span class="info-label">ID Code:</span><div class="tag-group">${createSearchableTag('id', video.id)}</div></div>
            <div class="modal-info-section"><span class="info-label">Categories:</span><div class="tag-group">${video.categories.map(cat => createSearchableTag('category', cat)).join('')}</div></div>
            <div class="modal-info-section"><span class="info-label">Actor:</span><div class="tag-group">${video.actors.map(actor => createSearchableTag('actor', actor)).join('')}</div></div>
            <div class="meta-list">
                <div><span class="info-label">Year:</span> <span class="meta-value">${video.year}</span></div>
                <div><span class="info-label">Country:</span> <span class="meta-value">${video.country}</span></div>
                <div><span class="info-label">Director:</span> <span class="meta-value">${video.director}</span></div>
                <div><span class="info-label">Writer:</span> <span class="meta-value">${video.writer}</span></div>
                <div><span class="info-label">Duration:</span> <span class="meta-value">${video.duration}</span></div>
                <div><span class="info-label">Release:</span> <span class="meta-value">${video.release_date}</span></div>
            </div>
        `;
        modal.querySelector('.modal-content').classList.add('detail-modal-content');
        modalBody.innerHTML = videoDetailContent;
        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.querySelector('.modal-content').classList.remove('detail-modal-content');
    }

    function performSearch(type, value) {
        let searchResult = [];
        switch (type) {
            case 'id': searchResult = currentVideos.filter(video => video.id === value); break;
            case 'category': searchResult = currentVideos.filter(video => video.categories.includes(value)); break;
            case 'actor': searchResult = currentVideos.filter(video => video.actors.includes(value)); break;
        }
        displayVideos(searchResult);
        desktopSearchInput.value = value;
        mobileSearchInput.value = value;
    }

    function handleSearchInput(e) {
        const searchTerm = e.target.value.toLowerCase();
        if (e.target.id === 'desktopSearchInput') {
            mobileSearchInput.value = e.target.value;
        } else {
            desktopSearchInput.value = e.target.value;
        }
        const searchedVideos = currentVideos.filter(video => 
            video.title.toLowerCase().includes(searchTerm) || 
            video.actors.some(actor => actor.toLowerCase().includes(searchTerm)) ||
            video.id.toLowerCase().includes(searchTerm)
        );
        displayVideos(searchedVideos);
    }

    // --- 4. EVENT LISTENERS ---
    
    videoGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.video-card');
        if (card) {
            const videoId = card.dataset.id;
            const video = currentVideos.find(v => v.id === videoId);
            if (video) {
                openDetailModal(video);
            }
        }
    });

    desktopSearchInput.addEventListener('input', handleSearchInput);
    mobileSearchInput.addEventListener('input', handleSearchInput);

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const jsonFile = button.dataset.file;
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            loadVideos(jsonFile);
        });
    });

    modalBody.addEventListener('click', (e) => {
        const searchableTag = e.target.closest('.searchable');
        if (searchableTag) {
            e.preventDefault();
            const type = searchableTag.dataset.type;
            const value = searchableTag.dataset.value;
            performSearch(type, value);
            closeModal();
        }
    });

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // --- 5. INITIAL LOAD ---
    loadVideos('censored.json');
});
