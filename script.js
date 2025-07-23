document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DATA PUBLIK: Metadata untuk ditampilkan di galeri ---
    const videos = [
        { id: 1, title: 'Secret Office Affair', actress: 'Yua Mikami', poster: 'https://placehold.co/300x450/111/fff?text=MIAA-123', duration: '24:15', categories: ['new', 'milf'] },
        { id: 2, title: 'Private Tutor\'s Lesson', actress: 'Eimi Fukada', poster: 'https://placehold.co/300x450/111/fff?text=SSIS-021', duration: '31:02', categories: ['new', 'school', 'uncensored'] },
        { id: 3, title: 'Lost in Translation', actress: 'Ria Sakura', poster: 'https://placehold.co/300x450/111/fff?text=IPX-456', duration: '28:44', categories: ['cosplay'] },
        { id: 4, title: 'After School Special', actress: 'Kana Momonogi', poster: 'https://placehold.co/300x450/111/fff?text=JUFE-111', duration: '22:50', categories: ['school'] },
        { id: 5, title: 'My Wife\'s Sister', actress: 'Yui Hatano', poster: 'https://placehold.co/300x450/111/fff?text=MIDE-789', duration: '35:12', categories: ['milf', 'uncensored'] },
        { id: 6, title: 'Cosplay Cafe Dream', actress: 'Rin Azuma', poster: 'https://placehold.co/300x450/111/fff?text=CAWD-007', duration: '19:30', categories: ['cosplay', 'new'] },
    ];
    
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

    const renderVideos = (videoArray) => {
        videoGrid.innerHTML = '';
        if (videoArray.length === 0) {
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
                    <div class="card-overlay">
                        <span class="card-tag quality">HD</span>
                        <span class="card-tag duration">${video.duration}</span>
                    </div>
                </div>
                <div class="card-content">
                    <h3>${video.title}</h3>
                    <p>${video.actress}</p>
                </div>
            `;
            videoGrid.appendChild(videoCard);
        });
    };

    const openModal = (content) => {
        modalBody.innerHTML = content;
        modal.classList.add('active');
    };

    const closeModal = () => {
        modal.classList.remove('active');
        modalBody.innerHTML = '';
    };

    // --- 4. EVENT LISTENERS ---

    // Filter videos
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.dataset.filter;
            const filteredVideos = filter === 'all' 
                ? videos 
                : videos.filter(video => video.categories.includes(filter));
            renderVideos(filteredVideos);
        });
    });

    // Search videos
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const searchedVideos = videos.filter(video => 
            video.title.toLowerCase().includes(searchTerm) || 
            video.actress.toLowerCase().includes(searchTerm)
        );
        renderVideos(searchedVideos);
    });
    
    // Toggle Search Bar
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        searchContainer.classList.toggle('active');
        searchInput.focus();
    });

    // Open video detail modal
    videoGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.video-card');
        if (!card) return;
        const videoId = parseInt(card.dataset.id);
        const video = videos.find(v => v.id === videoId);
        if (video) {
            const videoDetailContent = `
                <div class="modal-poster">
                    <img src="${video.poster}" alt="${video.title}">
                </div>
                <h2>${video.title}</h2>
                <h3>Starring: ${video.actress}</h3>
                <p>Duration: ${video.duration}</p>
                <div class="tags">
                    ${video.categories.map(cat => `<span>${cat}</span>`).join('')}
                </div>
                <!-- PERUBAHAN DI SINI: Menggunakan <button> dengan data-videoid -->
                <button data-videoid="${video.id}" class="btn btn-primary play-btn"><i class="fas fa-play"></i> Watch Now</button>
            `;
            openModal(videoDetailContent);
        }
    });

    // Open login modal
    loginBtn.addEventListener('click', () => {
        const loginFormContent = `
            <form class="login-form">
                <h2>Member Login</h2>
                <div class="form-group"><label for="username">Username</label><input type="text" id="username" required></div>
                <div class="form-group"><label for="password">Password</label><input type="password" id="password" required></div>
                <button type="submit" class="btn btn-primary">Login</button>
            </form>
        `;
        openModal(loginFormContent);
    });

    // === INI ADALAH BAGIAN BARU YANG MEMPERBAIKI MASALAH ===
    // Event listener untuk menangani klik di dalam modal
    modalBody.addEventListener('click', (e) => {
        // Cek apakah yang diklik adalah tombol "Watch Now"
        const playButton = e.target.closest('.play-btn');
        if (playButton) {
            const videoId = playButton.dataset.videoid;
            if (videoId) {
                // Buka player.html di tab baru
                window.open(`player.html?id=${videoId}`, '_blank');
                closeModal(); // Otomatis tutup modal setelah klik
            }
        }
    });
    // =======================================================

    // Close modal listeners
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    
    // Hamburger menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // --- 5. INITIAL RENDER ---
    renderVideos(videos);
});
