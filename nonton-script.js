// File: nonton-script.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Ambil ID dari URL
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('id');

    if (!videoId) {
        document.querySelector('.main-content').innerHTML = "<h1>Video tidak ditemukan.</h1><p>Pastikan URL yang Anda masukkan benar.</p>";
        return;
    }

    // 2. Ambil semua data video
    fetch('videos.json')
        .then(response => response.json())
        .then(videos => {
            // 3. Cari video yang cocok dengan ID
            const videoData = videos.find(v => v.id == videoId);

            if (!videoData) {
                document.querySelector('.main-content').innerHTML = "<h1>Video tidak ditemukan.</h1><p>ID video tidak valid.</p>";
                return;
            }

            // 4. Isi "template" HTML dengan data yang ditemukan
            // Mengisi judul halaman dan video
            document.title = `Nonton ${videoData.title} - BokehFlix`;
            document.getElementById('video-title').textContent = videoData.title;

            // Mengisi player video
            const playerHTML = `<iframe src="${videoData.iframe_url}" title="Video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            document.getElementById('video-player').innerHTML = playerHTML;

            // Mengisi deskripsi
            document.getElementById('video-description').textContent = videoData.description;

            // Mengisi tags
            const tagsContainer = document.getElementById('video-tags');
            tagsContainer.innerHTML = videoData.tags.map(tag => `<a href="#">#${tag}</a>`).join('');

            // 5. (BONUS) Isi sidebar dengan video lain
            const sidebarContainer = document.getElementById('sidebar-list');
            const otherVideos = videos.filter(v => v.id != videoId); // Ambil semua video KECUALI yang sedang diputar

            sidebarContainer.innerHTML = otherVideos.slice(0, 5).map(v => `
                <a href="nonton.html?id=${v.id}" class="sidebar-video-item">
                    <img src="${v.thumbnail}" alt="${v.title}">
                    <div class="sidebar-video-info">
                        <h4>${v.title}</h4>
                        <span>Kategori ${v.category}</span>
                    </div>
                </a>
            `).join('');

        })
        .catch(error => console.error('Error fetching video data:', error));
});
