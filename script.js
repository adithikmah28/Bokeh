// Tunggu sampai semua HTML selesai dimuat sebelum menjalankan script
document.addEventListener('DOMContentLoaded', () => {
    
    // Tentukan wadah kosong di HTML
    const hijabGrid = document.getElementById('hijab-grid');
    const eksklusifGrid = document.getElementById('eksklusif-grid');

    // Batas jumlah poster yang ditampilkan per kategori di halaman utama
    const limitPerCategory = 10;
    let hijabCount = 0;
    let eksklusifCount = 0;

    // Ambil data dari file 'videos.json'
    fetch('videos.json')
        .then(response => response.json()) // Ubah response menjadi format JSON
        .then(videos => {
            // Loop melalui setiap video dalam data
            for (const video of videos) {
                // Buat elemen HTML untuk poster card
                const posterCardHTML = `
                    <a href="${video.url}" class="poster-card">
                        <img src="${video.thumbnail}" alt="${video.title}">
                        <div class="poster-overlay">
                            <i class="fas fa-play-circle"></i>
                        </div>
                        <div class="poster-title">${video.title}</div>
                    </a>
                `;

                // Cek kategori video dan masukkan ke wadah yang sesuai
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
            // Tampilkan pesan error jika file JSON tidak ditemukan atau salah format
            hijabGrid.innerHTML = "<p>Gagal memuat konten. Silakan coba lagi nanti.</p>";
        });
});
