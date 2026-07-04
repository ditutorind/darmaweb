// ==============================================
// TEACHNWRITE - Frontend JavaScript (app.js)
// Versi: 1.0.0
// Koneksi ke Google Apps Script API
// ==============================================

// ==============================================
// KONFIGURASI - GANTI DENGAN URL DEPLOY LO!
// ==============================================
const CONFIG = {
    // 🔥 GANTI URL INI dengan Web App URL dari Google Apps Script!
    API_URL: 'https://script.google.com/macros/s/AKfycbyM4sm7wgX0IYn2WNYYgY6qWcrqF_4egquQZ5u0NaTl03fRWQaNP69p5eKjuAjlQ44e/exec',
    
    // Atau pake mode development (pake data dummy)
    USE_DUMMY: false, // Set false kalo udah pake API beneran
};

// ==============================================
// DATA DUMMY BUAT TESTING (Kalo API belum siap)
// ==============================================
const DUMMY_DATA = {
    articles: [
        {
            id: 1,
            title: "Pembelajaran Interaktif di Era Digital",
            content: "Pendidikan di era digital menuntut guru untuk lebih kreatif dalam menyampaikan materi. Penggunaan teknologi seperti AI dan gamifikasi dapat meningkatkan minat belajar siswa. Artikel ini membahas strategi-strategi efektif yang bisa diterapkan di kelas.",
            author: "Budi Santoso",
            date: "2026-07-04",
            image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
            status: "published"
        },
        {
            id: 2,
            title: "Menulis Kreatif untuk Anak Usia Dini",
            content: "Menulis bukan hanya tentang teknis, tapi juga tentang mengekspresikan diri. Untuk anak usia dini, pendekatan yang menyenangkan sangat penting. Gunakan media gambar, cerita bergambar, dan permainan kata untuk merangsang kreativitas mereka.",
            author: "Siti Rahayu",
            date: "2026-07-03",
            image_url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
            status: "published"
        },
        {
            id: 3,
            title: "Metode Belajar Aktif untuk Siswa Modern",
            content: "Metode belajar aktif seperti problem-based learning dan project-based learning terbukti efektif meningkatkan pemahaman siswa. Artikel ini membahas implementasi metode-metode tersebut di kelas dengan studi kasus nyata.",
            author: "Dr. Ahmad Fauzi",
            date: "2026-07-02",
            image_url: "https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=800&q=80",
            status: "published"
        }
    ],
    profile: {
        id: 1,
        name: "Dr. Ahmad Fauzi, M.Pd.",
        bio: "Guru dan penulis dengan pengalaman lebih dari 15 tahun di bidang pendidikan. Berkomitmen untuk menciptakan metode pembelajaran yang inovatif dan menyenangkan bagi siswa. Aktif sebagai pembicara di berbagai seminar pendidikan nasional dan internasional.",
        photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
        expertise: "Pendidikan Dasar, Inovasi Pembelajaran, Pengembangan Kurikulum",
        social_links: {
            instagram: "@ahmadfauzi",
            linkedin: "ahmad-fauzi",
            youtube: "TeachNwrite"
        }
    }
};

// ==============================================
// FUNGSI NAVIGASI
// ==============================================
function showSection(sectionName) {
    // Sembunyikan semua section
    document.querySelectorAll('.hidden-section').forEach(el => {
        el.classList.add('hidden-section');
        el.classList.remove('animate-fade');
    });
    
    // Tampilkan section yang dipilih
    const section = document.getElementById(sectionName);
    if (section) {
        section.classList.remove('hidden-section');
        section.classList.add('animate-fade');
        
        // Trigger animasi ulang
        section.style.animation = 'none';
        setTimeout(() => {
            section.style.animation = 'fadeIn 0.5s ease-in-out';
        }, 10);
    }
    
    // Update active state navbar desktop
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('nav-active');
    });
    const navBtn = document.getElementById(`nav-${sectionName}`);
    if (navBtn) navBtn.classList.add('nav-active');
    
    // Update active state navbar mobile
    document.querySelectorAll('.mob-inactive, .mob-active').forEach(link => {
        link.classList.remove('mob-active');
        link.classList.add('mob-inactive');
    });
    const mobBtn = document.getElementById(`mob-${sectionName}`);
    if (mobBtn) {
        mobBtn.classList.remove('mob-inactive');
        mobBtn.classList.add('mob-active');
    }
}

// ==============================================
// AMBIL DATA DARI API / DUMMY
// ==============================================
async function fetchData() {
    try {
        if (CONFIG.USE_DUMMY) {
            console.log('📦 Menggunakan data dummy...');
            return DUMMY_DATA;
        }
        
        console.log('🌐 Fetching data dari API...');
        const response = await fetch(CONFIG.API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('✅ Data berhasil diambil:', result);
        
        if (result.status === 'success') {
            return result.data;
        } else {
            throw new Error(result.message || 'Gagal mengambil data');
        }
        
    } catch (error) {
        console.error('❌ Error fetchData:', error);
        
        // Fallback ke dummy data kalo error
        console.log('⚠️ Fallback ke data dummy...');
        return DUMMY_DATA;
    }
}

// ==============================================
// RENDER ARTIKEL
// ==============================================
function renderArticles(articles) {
    const container = document.getElementById('articles-container');
    
    if (!articles || articles.length === 0) {
        container.innerHTML = `
            <div class="text-center text-gray-500 col-span-3 py-10">
                <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
                </svg>
                <p class="text-lg">Belum ada artikel</p>
                <p class="text-sm">Pantau terus untuk artikel terbaru!</p>
            </div>
        `;
        return;
    }
    
    // Filter hanya yang statusnya published
    const publishedArticles = articles.filter(a => 
        a.status && a.status.toLowerCase() === 'published'
    );
    
    if (publishedArticles.length === 0) {
        container.innerHTML = `
            <div class="text-center text-gray-500 col-span-3 py-10">
                <p class="text-lg">Belum ada artikel yang dipublikasikan</p>
            </div>
        `;
        return;
    }
    
    // Render artikel
    let html = '';
    publishedArticles.forEach(article => {
        // Truncate content
        const maxLength = 150;
        let content = article.content || '';
        if (content.length > maxLength) {
            content = content.substring(0, maxLength) + '...';
        }
        
        // Format date
        let date = article.date || '';
        if (date) {
            try {
                const d = new Date(date);
                date = d.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            } catch (e) {
                // Biarin aja kalo error
            }
        }
        
        html += `
            <div class="glass-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <img src="${article.image_url || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80'}" 
                     alt="${article.title}" 
                     class="w-full h-48 object-cover"
                     onerror="this.src='https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80'">
                <div class="p-6">
                    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                        <span>${article.author || 'Anonymous'}</span>
                        <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <span>${date || 'Tanggal tidak tersedia'}</span>
                    </div>
                    <h3 class="text-xl font-bold text-dark-purple mb-2 line-clamp-2">${article.title}</h3>
                    <p class="text-gray-600 text-sm line-clamp-3 mb-4">${content}</p>
                    <button onclick="showArticleDetail(${article.id})" 
                            class="text-emerald-600 font-semibold hover:text-emerald-700 transition flex items-center gap-1">
                        Baca Selengkapnya
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ==============================================
// RENDER PROFIL
// ==============================================
function renderProfile(profile) {
    const container = document.getElementById('profile-container');
    
    if (!profile || Object.keys(profile).length === 0) {
        container.innerHTML = `
            <div class="text-center text-gray-500 py-10 w-full">
                <p class="text-lg">Profil belum tersedia</p>
            </div>
        `;
        return;
    }
    
    // Parse social links
    let socialLinks = profile.social_links;
    if (typeof socialLinks === 'string') {
        try {
            socialLinks = JSON.parse(socialLinks);
        } catch (e) {
            socialLinks = {};
        }
    }
    
    const html = `
        <div class="flex-shrink-0">
            <img src="${profile.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'}" 
                 alt="${profile.name}" 
                 class="w-40 h-40 md:w-56 md:h-56 rounded-full object-cover border-4 border-emerald-400 shadow-xl"
                 onerror="this.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'">
        </div>
        <div class="flex-1 text-center md:text-left">
            <h3 class="text-2xl md:text-3xl font-bold text-dark-purple mb-2">${profile.name}</h3>
            ${profile.expertise ? `
                <div class="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
                    ${profile.expertise.split(',').map(skill => `
                        <span class="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full">${skill.trim()}</span>
                    `).join('')}
                </div>
            ` : ''}
            <p class="text-gray-600 leading-relaxed">${profile.bio || 'Tidak ada bio'}</p>
            ${socialLinks && Object.keys(socialLinks).length > 0 ? `
                <div class="flex gap-4 mt-4 justify-center md:justify-start">
                    ${socialLinks.instagram ? `
                        <a href="https://instagram.com/${socialLinks.instagram.replace('@', '')}" 
                           target="_blank" 
                           class="text-pink-600 hover:text-pink-800 transition">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                            </svg>
                        </a>
                    ` : ''}
                    ${socialLinks.linkedin ? `
                        <a href="https://linkedin.com/in/${socialLinks.linkedin}" 
                           target="_blank" 
                           class="text-blue-700 hover:text-blue-900 transition">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                    ` : ''}
                    ${socialLinks.youtube ? `
                        <a href="https://youtube.com/${socialLinks.youtube}" 
                           target="_blank" 
                           class="text-red-600 hover:text-red-800 transition">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                        </a>
                    ` : ''}
                </div>
            ` : ''}
        </div>
    `;
    
    container.innerHTML = html;
}

// ==============================================
// SHOW ARTICLE DETAIL (Popup/Modal)
// ==============================================
function showArticleDetail(articleId) {
    // Ambil data dari DOM atau re-fetch
    const container = document.getElementById('articles-container');
    const articles = DUMMY_DATA.articles; // Sementara pake dummy dulu
    
    const article = articles.find(a => a.id === articleId);
    if (!article) {
        alert('Artikel tidak ditemukan!');
        return;
    }
    
    // Buat modal sederhana
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm';
    modal.id = 'article-modal';
    modal.onclick = function(e) {
        if (e.target === this) this.remove();
    };
    
    modal.innerHTML = `
        <div class="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-3xl relative animate-fade">
            <button onclick="document.getElementById('article-modal').remove()" 
                    class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
            <img src="${article.image_url || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80'}" 
                 alt="${article.title}" 
                 class="w-full h-56 object-cover rounded-2xl mb-4"
                 onerror="this.src='https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80'">
            <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <span>✍️ ${article.author || 'Anonymous'}</span>
                <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>📅 ${article.date || 'Tanggal tidak tersedia'}</span>
            </div>
            <h2 class="text-2xl md:text-3xl font-bold text-dark-purple mb-4">${article.title}</h2>
            <p class="text-gray-700 leading-relaxed whitespace-pre-line">${article.content}</p>
            <div class="mt-6 flex justify-end">
                <span class="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full">${article.status || 'draft'}</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// ==============================================
// INIT - LOAD DATA SAAT HALAMAN DIMUAT
// ==============================================
async function init() {
    console.log('🚀 TeachNwrite CMS - Loading...');
    
    // Tampilkan loading
    document.getElementById('articles-container').innerHTML = `
        <div class="text-center text-gray-500 col-span-3 py-10">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-4"></div>
            <p>Memuat artikel...</p>
        </div>
    `;
    
    document.getElementById('profile-container').innerHTML = `
        <div class="text-center text-gray-500 py-10 w-full">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-4"></div>
            <p>Memuat profil...</p>
        </div>
    `;
    
    // Ambil data
    const data = await fetchData();
    
    // Render
    if (data.articles) {
        renderArticles(data.articles);
    }
    
    if (data.profile) {
        renderProfile(data.profile);
    }
    
    // Set default active
    showSection('home');
    
    console.log('✅ TeachNwrite siap!');
}

// ==============================================
// EVENT LISTENERS
// ==============================================
document.addEventListener('DOMContentLoaded', init);

// ==============================================
// EXPOSE FUNCTIONS KE GLOBAL
// ==============================================
window.showSection = showSection;
window.showArticleDetail = showArticleDetail;

console.log('📝 TeachNwrite app.js loaded!');