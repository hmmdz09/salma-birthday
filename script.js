/* ===================================================
   MODERN BIRTHDAY EXPERIENCE - SALMA AULIA ✨🎂
   Interactive Logic, Audio, Confetti, & Animations
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const curtainOverlay = document.getElementById('curtainOverlay');
  const enterSiteBtn = document.getElementById('enterSiteBtn');
  const bgMusic = document.getElementById('bgMusic');
  const musicWidget = document.getElementById('musicWidget');
  const vinylDisc = document.getElementById('vinylDisc');
  const musicStatus = document.getElementById('musicStatus');
  const musicWaves = document.getElementById('musicWaves');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');

  // Ambient Canvas Setup
  setupAmbientCanvas();

  // Web Audio Context for synthesized sound FX
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function playSynthBlow() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const bufferSize = audioCtx.sampleRate * 0.4;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.15));
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.35);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.38);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start();
  }

  function playChimeArpeggio() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, index) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + index * 0.08);

      gain.gain.setValueAtTime(0.18, audioCtx.currentTime + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + index * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + index * 0.08);
      osc.stop(audioCtx.currentTime + index * 0.08 + 0.42);
    });
  }

  function playHeartPop() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.13);
  }

  // Confetti helper (with fallback)
  function fireConfetti(options = {}) {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff5e97', '#ffd166', '#ff85b3', '#ffffff', '#06d6a0'],
        ...options
      });
    }
  }

  function fireCelebrationFireworks() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 40 * (timeLeft / duration);
      if (typeof confetti === 'function') {
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.15, 0.4), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.6, 0.85), y: Math.random() - 0.2 } }));
      }
    }, 250);
  }

  // ==========================================
  // Music Player Management
  // ==========================================
  let isMusicPlaying = false;

  async function playMusic() {
    try {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      await bgMusic.play();
      isMusicPlaying = true;
      vinylDisc.classList.add('spinning');
      musicWaves.classList.add('playing');
      musicStatus.textContent = 'Now Playing ♫';
      playIcon.classList.add('hidden');
      pauseIcon.classList.remove('hidden');
    } catch (err) {
      console.warn('Autoplay prevented:', err);
      musicStatus.textContent = 'Klik untuk play';
      isMusicPlaying = false;
      vinylDisc.classList.remove('spinning');
      musicWaves.classList.remove('playing');
      playIcon.classList.remove('hidden');
      pauseIcon.classList.add('hidden');
    }
  }

  function pauseMusic() {
    bgMusic.pause();
    isMusicPlaying = false;
    vinylDisc.classList.remove('spinning');
    musicWaves.classList.remove('playing');
    musicStatus.textContent = 'Paused';
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
  }

  musicToggleBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  });

  // Entrance Curtain
  enterSiteBtn.addEventListener('click', () => {
    curtainOverlay.classList.add('hidden-curtain');
    playMusic();
    fireConfetti({ particleCount: 120, spread: 100 });
    playChimeArpeggio();
  });

  // Top Nav quick action buttons
  document.getElementById('btnConfettiBoom').addEventListener('click', (e) => {
    fireConfetti({ particleCount: 90, spread: 80 });
    playChimeArpeggio();
    createFloatingHeart(e.clientX, e.clientY);
  });

  document.getElementById('btnScrollCake').addEventListener('click', () => {
    document.getElementById('cakeSection').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('btnScrollTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==========================================
  // Interactive Birthday Cake & Candles
  // ==========================================
  const flames = document.querySelectorAll('.flame');
  const smokes = document.querySelectorAll('.smoke');
  const blowCandleBtn = document.getElementById('blowCandleBtn');
  const relightCandleBtn = document.getElementById('relightCandleBtn');
  const wishBanner = document.getElementById('wishBanner');
  const wishIcon = document.getElementById('wishIcon');
  const wishMessage = document.getElementById('wishMessage');
  const wishRevealBox = document.getElementById('wishRevealBox');
  let candlesExtinguished = false;

  function extinguishCandles() {
    if (candlesExtinguished) return;
    candlesExtinguished = true;

    playSynthBlow();

    flames.forEach(f => f.classList.add('extinguished'));
    smokes.forEach(s => {
      s.classList.remove('active');
      void s.offsetWidth; // re-trigger animation
      s.classList.add('active');
    });

    setTimeout(() => {
      playChimeArpeggio();
      fireCelebrationFireworks();

      wishIcon.textContent = '✨';
      wishMessage.textContent = 'Lilin berhasil ditiup! Harapanmu melesat ke angkasa 🎉';
      wishBanner.style.borderColor = 'var(--primary)';
      wishBanner.style.background = 'rgba(255, 94, 151, 0.2)';

      blowCandleBtn.classList.add('hidden');
      relightCandleBtn.classList.remove('hidden');
      wishRevealBox.classList.remove('hidden');
    }, 400);
  }

  function relightCandles() {
    candlesExtinguished = false;
    flames.forEach(f => f.classList.remove('extinguished'));
    smokes.forEach(s => s.classList.remove('active'));

    wishIcon.textContent = '🕯️';
    wishMessage.textContent = 'Lilin kembali menyala. Siapkan keinginanmu dan tiup!';
    wishBanner.style.borderColor = 'rgba(255, 209, 102, 0.3)';
    wishBanner.style.background = 'rgba(255, 209, 102, 0.12)';

    blowCandleBtn.classList.remove('hidden');
    relightCandleBtn.classList.add('hidden');
    wishRevealBox.classList.add('hidden');
    playChimeArpeggio();
  }

  blowCandleBtn.addEventListener('click', extinguishCandles);
  relightCandleBtn.addEventListener('click', relightCandles);

  document.querySelectorAll('.candle').forEach(c => {
    c.addEventListener('click', () => {
      if (!candlesExtinguished) extinguishCandles();
    });
  });

  // ==========================================
  // Special Envelope & Heartfelt Letter
  // ==========================================
  const envelope = document.getElementById('envelope');
  const waxSeal = document.getElementById('waxSeal');
  const btnToggleLetter = document.getElementById('btnToggleLetter');
  const toggleLetterText = document.getElementById('toggleLetterText');

  function toggleEnvelope() {
    const isOpened = envelope.classList.toggle('opened');
    if (isOpened) {
      toggleLetterText.textContent = 'Tutup Amplop Surat';
      fireConfetti({ particleCount: 50, spread: 60 });
      playChimeArpeggio();
    } else {
      toggleLetterText.textContent = 'Buka Surat Spesial';
    }
  }

  waxSeal.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleEnvelope();
  });

  btnToggleLetter.addEventListener('click', toggleEnvelope);

  // ==========================================
  // 3D Tilt Effect on Polaroid Cards
  // ==========================================
  const polaroids = document.querySelectorAll('.polaroid-card');

  function initTilt(card) {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotX = -(y / (rect.height / 2)) * 8;
      const rotY = (x / (rect.width / 2)) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  }

  polaroids.forEach(initTilt);

  // ==========================================
  // Lightbox Modal for Gallery Photos
  // ==========================================
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCaption = document.getElementById('lightboxCaption');

  let currentPhotoIndex = 0;
  let galleryItems = [];

  function updateGalleryList() {
    galleryItems = [];
    document.querySelectorAll('.polaroid-card').forEach((card, idx) => {
      const img = card.querySelector('img');
      const title = card.querySelector('.caption-title')?.textContent || 'Salma Aulia';
      const caption = card.querySelector('.caption-date')?.textContent || 'Momen Berharga';
      galleryItems.push({
        src: img.src,
        title: title,
        caption: caption
      });

      card.onclick = () => openLightbox(idx);
    });
  }

  function openLightbox(index) {
    currentPhotoIndex = index;
    const item = galleryItems[currentPhotoIndex];
    if (!item) return;

    lightboxImg.src = item.src;
    lightboxTitle.textContent = item.title;
    lightboxCaption.textContent = item.caption;
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navLightbox(delta) {
    currentPhotoIndex = (currentPhotoIndex + delta + galleryItems.length) % galleryItems.length;
    openLightbox(currentPhotoIndex);
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => navLightbox(-1));
  lightboxNext.addEventListener('click', () => navLightbox(1));

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navLightbox(-1);
    if (e.key === 'ArrowRight') navLightbox(1);
  });

  updateGalleryList();

  // Photo Upload Handler (Local Dynamic Addition)
  const photoUploadInput = document.getElementById('photoUploadInput');
  const polaroidGrid = document.getElementById('polaroidGrid');

  photoUploadInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const newCard = document.createElement('div');
        newCard.className = 'polaroid-card';
        newCard.innerHTML = `
          <div class="tape-corner"></div>
          <div class="polaroid-img-box">
            <img src="${event.target.result}" alt="Foto Baru Salma" loading="lazy">
          </div>
          <div class="polaroid-caption">
            <p class="caption-title">Momen Spesial Baru</p>
            <p class="caption-date">Kenangan yang ditambahkan ✨</p>
          </div>
        `;
        polaroidGrid.appendChild(newCard);
        initTilt(newCard);
        updateGalleryList();
        fireConfetti({ particleCount: 30, spread: 50 });
      };
      reader.readAsDataURL(file);
    });
  });

  // ==========================================
  // Interactive Birthday Wishes Board
  // ==========================================
  const wishForm = document.getElementById('wishForm');
  const senderNameInput = document.getElementById('senderName');
  const wishMessageInput = document.getElementById('wishMessageInput');
  const wishesList = document.getElementById('wishesList');
  const wishesCount = document.getElementById('wishesCount');

  const defaultWishes = [
    {
      sender: "Hamdi",
      message: "Selamat ulang tahun, Salma! Semoga di lembaran usia yang baru ini, setiap langkahmu dipenuhi keberkahan, kemudahan dalam segala urusan, dan senantiasa dikelilingi bahagia. Terima kasih selalu hadir dengan caramu yang istimewa. 🤍",
      emoji: "🎂",
      time: "Hari ini"
    },
    {
      sender: "Sahabat Sejati",
      message: "Happy birthday Salma Aulia! Semoga makin sukses belajarnya, karirnya, dan selalu jadi Salma yang ceria serta menginspirasi semua orang!",
      emoji: "✨",
      time: "Hari ini"
    },
    {
      sender: "Lingkaran Hangat",
      message: "Barakallah fii umrik Salma! Sehat terus, rezekinya lancar, dan semua doa-doa terbaik lekas dikabulkan oleh Yang Maha Kuasa.",
      emoji: "🌸",
      time: "Hari ini"
    }
  ];

  function loadWishes() {
    const stored = localStorage.getItem('salma_birthday_wishes');
    let wishes = stored ? JSON.parse(stored) : defaultWishes;
    renderWishes(wishes);
  }

  function saveAndRenderWish(newWish) {
    const stored = localStorage.getItem('salma_birthday_wishes');
    let wishes = stored ? JSON.parse(stored) : defaultWishes;
    wishes.unshift(newWish);
    localStorage.setItem('salma_birthday_wishes', JSON.stringify(wishes));
    renderWishes(wishes);
  }

  function renderWishes(wishes) {
    wishesCount.textContent = wishes.length;
    wishesList.innerHTML = wishes.map(w => `
      <div class="wish-item-card">
        <div class="wish-avatar">${w.emoji || '🎂'}</div>
        <div class="wish-body">
          <div class="wish-author-row">
            <span class="wish-author">${escapeHtml(w.sender)}</span>
            <span class="wish-time">${w.time}</span>
          </div>
          <p class="wish-text">${escapeHtml(w.message)}</p>
        </div>
      </div>
    `).join('');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  wishForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const sender = senderNameInput.value.trim();
    const message = wishMessageInput.value.trim();
    const selectedEmoji = document.querySelector('input[name="wishEmoji"]:checked')?.value || '🎂';

    if (!sender || !message) return;

    const newWish = {
      sender,
      message,
      emoji: selectedEmoji,
      time: 'Baru saja'
    };

    saveAndRenderWish(newWish);
    wishForm.reset();
    fireConfetti({ particleCount: 60, spread: 70 });
    playChimeArpeggio();
  });

  loadWishes();

  // ==========================================
  // Birthday Love & Appreciation Meter
  // ==========================================
  const bigHeartBtn = document.getElementById('bigHeartBtn');
  const loveProgressFill = document.getElementById('loveProgressFill');
  const lovePercentage = document.getElementById('lovePercentage');
  const loveStatusText = document.getElementById('loveStatusText');
  let currentLove = 0;

  const loveMilestones = [
    { at: 20, text: 'Doa terbaik mulai terkirim dengan indah 🌸' },
    { at: 40, text: 'Energi positif semakin bertambah hangat ✨' },
    { at: 60, text: 'Senyuman Salma membuat hari jadi jauh lebih cerah 🌷' },
    { at: 80, text: 'Semua harapan indah hampir meluap! 💖' },
    { at: 100, text: '100% Penuh! Rasa sayang & doa terbaik tak terhingga untuk Salma Aulia! 🎉' }
  ];

  bigHeartBtn.addEventListener('click', (e) => {
    currentLove = Math.min(100, currentLove + 10);
    loveProgressFill.style.width = `${currentLove}%`;
    lovePercentage.textContent = `${currentLove}%`;

    playHeartPop();
    createFloatingHeart(e.clientX, e.clientY);

    const match = [...loveMilestones].reverse().find(m => currentLove >= m.at);
    if (match) {
      loveStatusText.textContent = match.text;
    }

    if (currentLove === 100) {
      fireCelebrationFireworks();
      playChimeArpeggio();
    }
  });

  function createFloatingHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart-fx';
    const emojis = ['💖', '🤍', '🌸', '✨', '🎂', '🌷'];
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.left = `${x || window.innerWidth / 2}px`;
    heart.style.top = `${y || window.innerHeight / 2}px`;
    heart.style.setProperty('--dx', `${(Math.random() - 0.5) * 120}px`);
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 1200);
  }

  // ==========================================
  // Ambient Starfield Canvas Effect
  // ==========================================
  function setupAmbientCanvas() {
    const canvas = document.getElementById('ambientCanvas');
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.8 + 0.8,
      speedY: Math.random() * 0.35 + 0.1,
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.4 ? 'rgba(255, 140, 180,' : 'rgba(255, 215, 120,'
    }));

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.y -= p.speedY;
        p.x += p.speedX;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${p.opacity})`;
        ctx.shadowBlur = p.size * 3;
        ctx.shadowColor = p.color === 'rgba(255, 140, 180,' ? '#ff5e97' : '#ffd166';
        ctx.fill();
      });

      requestAnimationFrame(renderParticles);
    }

    renderParticles();
  }
});
