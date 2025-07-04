document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('id');

    if (!videoId) {
        document.querySelector('.main-content').innerHTML = "<h1>Video tidak ditemukan.</h1><p>Pastikan URL yang Anda masukkan benar.</p>";
        return;
    }

    fetch('videos.json')
        .then(response => response.json())
        .then(videos => {
            const videoData = videos.find(v => v.id == videoId);
            if (!videoData) {
                document.querySelector('.main-content').innerHTML = "<h1>Video tidak ditemukan.</h1><p>ID video tidak valid.</p>";
                return;
            }

            document.title = `Nonton ${videoData.title} - BokehFlix`;
            document.getElementById('video-title').textContent = videoData.title;
            document.getElementById('video-player').innerHTML = `<iframe src="${videoData.iframe_url}" title="Video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            document.getElementById('video-description').textContent = videoData.description;
            document.getElementById('video-tags').innerHTML = videoData.tags.map(tag => `<a href="#">#${tag}</a>`).join('');

            const sidebarContainer = document.getElementById('sidebar-list');
            const otherVideos = videos.filter(v => v.id != videoId);
            sidebarContainer.innerHTML = otherVideos.slice(0, 5).map(v => `
                <a href="nonton.html?id=${v.id}" class="sidebar-video-item">
                    <img src="${v.thumbnail}" alt="${v.title}">
                    <div class="sidebar-video-info"><h4>${v.title}</h4><span>Kategori ${v.category}</span></div>
                </a>
            `).join('');
        })
        .catch(error => console.error('Error fetching video data:', error));
});
