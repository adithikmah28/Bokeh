// File: nonton-script.js (REVISI TOTAL)

document.addEventListener('DOMContentLoaded', () => {
    // 1. Ambil semua elemen yang kita butuhkan
    const videoPlayerContainer = document.getElementById('video-player');
    const adModal = document.getElementById('ad-modal');
    const adLinkButton = document.getElementById('ad-link-button');
    
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('id');
    
    let realVideoUrl = null; // Variabel untuk menyimpan URL iframe asli

    if (!videoId) {
        document.querySelector('.main-content').innerHTML = "<h1>Video tidak ditemukan.</h1>";
        return;
    }

    // 2. Ambil data video seperti biasa
    fetch('videos.json')
        .then(response => response.json())
        .then(videos => {
            const videoData = videos.find(v => v.id == videoId);
            if (!videoData) {
                document.querySelector('.main-content').innerHTML = "<h1>ID video tidak valid.</h1>";
                return;
            }

            // SIMPAN URL ASLI DI VARIABEL
            realVideoUrl = videoData.iframe_url;

            // 3. TAMPILKAN PLACEHOLDER (BUKAN VIDEO ASLI)
            // Ini membuat halaman sangat ringan saat pertama kali dibuka
            const placeholderHTML = `
                <div class="video-placeholder" id="play-placeholder">
                    <img src="${videoData.thumbnail}" alt="Video thumbnail" class="thumbnail">
                    <i class="fas fa-play-circle play-icon"></i>
                </div>
            `;
            videoPlayerContainer.innerHTML = placeholderHTML;
            
            // Isi detail video lainnya seperti biasa
            document.title = `Nonton ${videoData.title} - BokehFlix`;
            document.getElementById('video-title').textContent = videoData.title;
            document.getElementById('video-description').textContent = videoData.description;
            document.getElementById('video-tags').innerHTML = videoData.tags.map(tag => `<a href="#">#${tag}</a>`).join('');

            // Isi sidebar juga
            const sidebarContainer = document.getElementById('sidebar-list');
            const otherVideos = videos.filter(v => v.id != videoId);
            sidebarContainer.innerHTML = otherVideos.slice(0, 5).map(v => `<a href="nonton.html?id=${v.id}" class="sidebar-video-item"><img src="${v.thumbnail}" alt="${v.title}"><div class="sidebar-video-info"><h4>${v.title}</h4><span>Kategori ${v.category}</span></div></a>`).join('');

            // 4. Tambahkan event listener ke placeholder
            document.getElementById('play-placeholder').addEventListener('click', () => {
                // Saat placeholder di-klik, TAMPILKAN MODAL IKLAN
                adModal.style.display = 'flex';
            });
        })
        .catch(error => console.error('Error fetching video data:', error));

    // 5. Tambahkan event listener ke tombol iklan di dalam modal
    adLinkButton.addEventListener('click', () => {
        // BUKA LINK IKLAN DI TAB BARU
        // GANTI LINK DI BAWAH INI DENGAN DIRECT LINK LO!
        window.open('https://link-iklan-directlink-lo.com', '_blank');

        // SEMBUNYIKAN MODAL IKLAN
        adModal.style.display = 'none';

        // GANTI PLACEHOLDER DENGAN VIDEO PLAYER ASLI
        if (realVideoUrl) {
            const playerHTML = `<iframe src="${realVideoUrl}" title="Video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
            videoPlayerContainer.innerHTML = playerHTML;
        }
    });
});
