// =========================================
// 1. CANVAS BACKGROUND (Partikel Jaringan Futuristik)
// =========================================
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

// Mengatur ukuran canvas agar selalu memenuhi layar
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Definisi Partikel
let particlesArray = [];
const numberOfParticles = 100; // Jumlah titik

// Warna neon
const colors = ['#00f3ff', '#ff00c8', '#b300ff'];

// Membuat partikel dengan posisi acak
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1; // Ukuran antara 1-3
        this.speedX = (Math.random() - 0.5) * 0.5; // Gerakan lambat
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    // Update posisi partikel
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Memantul dari tepi
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    // Gambar partikel
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        // Efek glow kecil
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset untuk menghindari overload
    }
}

// Inisialisasi partikel
function initParticles() {
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}
initParticles();

// Menggambar garis di antara partikel yang berdekatan
function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x;
            const dy = particlesArray[a].y - particlesArray[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) { // Jika jarak kurang dari 120px
                // Opacity berdasarkan jarak
                const opacity = 1 - (distance / 120);
                ctx.strokeStyle = `rgba(0, 243, 255, ${opacity * 0.3})`; // Warna cyan transparan
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Animasi loop
function animate() {
    // Bersihkan canvas dengan efek trail (sedikit transparan)
    ctx.fillStyle = 'rgba(10, 10, 15, 0.1)'; // Alpha rendah untuk efek jejak
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update dan gambar partikel
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }

    // Gambar koneksi antar partikel
    connectParticles();

    requestAnimationFrame(animate);
}
animate();


// =========================================
// 2. ANIMASI ANGKA (STAT COUNTER)
// =========================================
const statNumbers = document.querySelectorAll('.stat-number');

// Fungsi untuk memeriksa apakah elemen terlihat di viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Fungsi untuk menjalankan counter
function startCounterIfVisible() {
    statNumbers.forEach(stat => {
        if (isElementInViewport(stat) && !stat.classList.contains('counted')) {
            stat.classList.add('counted'); // Mencegah loop tak terbatas
            const target = parseInt(stat.getAttribute('data-target'));
            let current = 0;
            const increment = target / 50; // Kecepatan counter

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.innerText = target + '+'; // Tambah tanda plus
                }
            };
            updateCounter();
        }
    });
}

// Jalankan saat scroll dan saat halaman dimuat
window.addEventListener('scroll', startCounterIfVisible);
window.addEventListener('load', startCounterIfVisible);


// =========================================
// 3. HIGHLIGHT MENU BERDASARKAN SCROLL
// =========================================
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100; // Offset untuk navbar
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});


// =========================================
// 4. EFEK HALUS PADA CURSOR (OPSIONAL)
// =========================================
// Membuat elemen kursor kustom (sederhana)
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

// Style untuk kursor (bisa ditambahkan di CSS juga)
const style = document.createElement('style');
style.innerHTML = `
    .custom-cursor {
        width: 20px;
        height: 20px;
        border: 2px solid var(--neon-cyan);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.2s ease;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 15px var(--neon-cyan);
    }
`;
document.head.appendChild(style);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Sembunyikan kursor default di area tertentu
document.body.style.cursor = 'none';
// Tampilkan kembali di area link/button
document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursor.style.borderColor = 'var(--neon-magenta)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.borderColor = 'var(--neon-cyan)';
    });
});

// Catatan: kursor kustom bisa dimatikan di perangkat layar sentuh
if ('ontouchstart' in window) {
    cursor.style.display = 'none';
    document.body.style.cursor = 'auto';
          }
