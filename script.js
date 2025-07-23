document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DATA: Store all video information here ---
    const videos = [
        { id: 1, title: 'Secret Office Affair', actress: 'Yua Mikami', poster: 'https://placehold.co/300x450/111/fff?text=MIAA-123', duration: '24:15', categories: ['new', 'milf'] },
        { id: 2, title: 'Private Tutor\'s Lesson', actress: 'Eimi Fukada', poster: 'https://placehold.co/300x450/111/fff?text=SSIS-021', duration: '31:02', categories: ['new', 'school', 'uncensored'] },
        { id: 3, title: 'Lost in Translation', actress: 'Ria Sakura', poster: 'https://placehold.co/300x450/111/fff?text=IPX-456', duration: '28:44', categories: ['cosplay'] },
        { id: 4, title: 'After School Special', actress: 'Kana Momonogi', poster: 'https://placehold.co/300x450/111/fff?text=JUFE-111', duration: '22:50', categories: ['school'] },
        { id: 5, title: 'My Wife\'s Sister', actress: 'Yui Hatano', poster: 'https://placehold.co/300x450/111/fff?text=MIDE-789', duration: '35:12', categories: ['milf', 'uncensored'] },
        { id: 6, title: 'Cosplay Cafe Dream', actress: 'Rin Azuma', poster: 'https://placehold.co/300x450/111/fff?text=CAWD-007', duration: '19:30', categories: ['cosplay', 'new'] },
        { id: 7, title: 'Idol\'s Secret', actress: 'Aika Yumeno', poster: 'https://placehold.co/300x450/111/fff?text=STARS-001', duration: '26:18', categories: ['uncensored'] },
        { id: 8, title: 'Neighborhood MILF', actress: 'Julia', poster: 'https://placehold.co/300x450/111/fff?text=FSDSS-100', duration: '29:55', categories: ['milf'] },
        { id: 9, title: 'The New Teacher', actress: 'Anri Okita', poster: 'https://placehold.co/300x450/111/fff?text=MIMK-052', duration: '27:40', categories: ['school', 'milf', 'new'] },
        { id: 10, title: 'Maid for a Day', actress: 'Shoko Takahashi', poster: 'https://placehold.co/300x450/111/fff?text=IPZ-999', duration: '23:10', categories: ['cosplay'] },
        { id: 11, title: 'Uncensored Getaway', actress: 'Minami Aizawa', poster: 'https://placehold.co/300x450/111/fff?text=SSNI-777', duration: '45:00', categories: ['uncensored', 'new'] },
        { id: 12, title: 'School Festival Fun', actress: 'Tsubasa Amami', poster: 'https://placehold.co/300x450/111/fff?text=TEK-098', duration: '21:05', categories: ['school'] },
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

    /** Renders videos to the grid */
    const renderVideos = (videoArray) => {
        videoGrid.innerHTML = ''; // Clear existing grid
        if (videoArray.length === 0) {
            videoGrid.innerHTML = '<p class="no-results">No videos found.</p>';
            return;
        }

        videoArray.forEach(video => {
            const videoCard = document.createElement('div');
            videoCard.className = 'video-card';
            videoCard.dataset.id = video.id; // Set data-id to find video details later
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

    /** Opens the modal with specific content */
    const openModal = (content) => {
        modalBody.innerHTML = content;
        modal.classList.add('active');
    };

    /** Closes the modal */
    const closeModal = () => {
        modal.classList.remove('active');
        modalBody.innerHTML = '';
    };

    // --- 4. EVENT LISTENERS ---

    // Filter videos by category
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

    // Search videos by title or actress
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const searchedVideos = videos.filter(video => 
            video.title.toLowerCase().includes(searchTerm) || 
            video.actress.toLowerCase().includes(searchTerm)
        );
        renderVideos(searchedVideos);
    });

    // Toggle search bar visibility
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        searchContainer.classList.toggle('active');
        searchInput.focus();
    });

    // Open video detail modal when a card is clicked
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
                <a href="#" class="btn btn-primary play-btn"><i class="fas fa-play"></i> Watch Now</a>
            `;
            openModal(videoDetailContent);
        }
    });

    // Open login modal
    loginBtn.addEventListener('click', () => {
        const loginFormContent = `
            <form class="login-form">
                <h2>Member Login</h2>
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" required>
                </div>
                <button type="submit" class="btn btn-primary">Login</button>
            </form>
        `;
        openModal(loginFormContent);
    });

    // Close modal listeners
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) { // Close if clicking on the background overlay
            closeModal();
        }
    });

    // Hamburger menu for mobile
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // --- 5. INITIAL RENDER ---
    renderVideos(videos);
});
