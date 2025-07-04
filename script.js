document.addEventListener('DOMContentLoaded', () => {
    const hijabGrid = document.getElementById('hijab-grid');
    const eksklusifGrid = document.getElementById('eksklusif-grid');
    const limitPerCategory = 10;
    let hijabCount = 0;
    let eksklusifCount = 0;

    fetch('videos.json')
        .then(response => response.json())
        .then(videos => {
            for (const video of videos) {
                const posterCardHTML = `
                    <a href="nonton.html?id=${video.id}" class="poster-card">
                        <img src="${video.thumbnail}" alt="${video.title}">
                        <div class="poster-overlay"><i class="fas fa-play-circle"></i></div>
                        <div class="poster-title">${video.title}</div>
                    </a>
                `;
                if (video.category === 'hijab' && hijabCount < limitPerCategory) {
                    hijabGrid.innerHTML += posterCardHTML;
                    hijabCount++;
                } else if (video.category === 'eksklusif' && eksklusifCount < limitPerCategory) {
                    eksklusifGrid.innerHTML += posterCardHTML;
                    eksklusifCount++;
                }
            }
        })
        .catch(error => {
            console.error('Gagal memuat data video:', error);
            hijabGrid.innerHTML = "<p>Gagal memuat konten.</p>";
        });
});
