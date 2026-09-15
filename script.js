/* ===================================================================
   THE SHAPE OF MY HEART — QUEEN OF HEARTS EDITION ✨♠️♥️♦️♣️
   Interactive 3D Cards, Synced Lyrics, Audio & Golden Altar
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const curtainOverlay = document.getElementById('curtainOverlay');
  const enterSiteBtn = document.getElementById('enterSiteBtn');
  const bgMusic = document.getElementById('bgMusic');
  const vinylGold = document.getElementById('vinylGold');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicBtnIcon = document.getElementById('musicBtnIcon');
  const currentLyricText = document.getElementById('currentLyricText');
  const syncedLyricDisplay = document.getElementById('syncedLyricDisplay');

  // Ambient Canvas Setup
  setupAmbientGoldenCanvas();

  // Web Audio Context for synthesized sound FX
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function playSynthWindBlow() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const bufferSize = audioCtx.sampleRate * 0.45;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.2));
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.4);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.42);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start();
  }

  function playRoyalChime() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    // Luxurious pentatonic royal chord: D4, F#4, A4, D5, F#5
    const freqs = [293.66, 369.99, 440.00, 587.33, 739.99];
    freqs.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.09);

      gain.gain.setValueAtTime(0.16, audioCtx.currentTime + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.09 + 0.5);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + idx * 0.09);
      osc.stop(audioCtx.currentTime + idx * 0.09 + 0.52);
    });
  }

  // Golden Confetti helper
  function fireGoldenConfetti(options = {}) {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#dfb15b', '#ffd700', '#f5c2cb', '#ffffff', '#e63946'],
        ...options
      });
    }
  }

  function fireRoyalGrandFireworks() {
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 35, spread: 360, ticks: 70, zIndex: 9999 };

    function rand(min, max) { return Math.random() * (max - min) + min; }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const count = 45 * (timeLeft / duration);
      if (typeof confetti === 'function') {
        confetti(Object.assign({}, defaults, {
          particleCount: count,
          origin: { x: rand(0.15, 0.4), y: Math.random() - 0.2 },
          colors: ['#dfb15b', '#ffd700', '#e63946', '#ffffff']
        }));
        confetti(Object.assign({}, defaults, {
          particleCount: count,
          origin: { x: rand(0.6, 0.85), y: Math.random() - 0.2 },
          colors: ['#dfb15b', '#ffd700', '#e63946', '#ffffff']
        }));
      }
    }, 280);
  }

  // ==============================================================
  // Music & Synced Lyrics (Sting - Shape of My Heart)
  // ==============================================================
  let isPlaying = false;

  const lyricTimeline = [
    { time: 0, text: "“He deals the cards as a meditation...”" },
    { time: 18, text: "“And those he plays never suspect...”" },
    { time: 33, text: "“He doesn't play for the money he wins... He don't play for respect.”" },
    { time: 51, text: "“He deals the cards to find the answer... The sacred geometry of chance.”" },
    { time: 70, text: "“I know that the spades are the swords of a soldier...”" },
    { time: 88, text: "“I know that the clubs are weapons of war...”" },
    { time: 106, text: "“I know that diamonds mean money for this art...”" },
    { time: 125, text: "“But that's not the shape of my heart...”" },
    { time: 145, text: "“And if I told you that I loved you, you'd maybe think there's something wrong...”" },
    { time: 175, text: "“I'm not a man of too many faces, the mask I wear is one.”" },
    { time: 200, text: "“That's not the shape... the shape of my heart.”" },
    { time: 235, text: "“For you, Salma, is the only shape of my heart ✨”" }
  ];

  async function startMusic() {
    try {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      await bgMusic.play();
      isPlaying = true;
      vinylGold.classList.add('rotating');
      musicBtnIcon.textContent = '❚❚';
    } catch (err) {
      console.warn('Playback policy prevented autoplay:', err);
      isPlaying = false;
      vinylGold.classList.remove('rotating');
      musicBtnIcon.textContent = '▶';
    }
  }

  function pauseMusic() {
    bgMusic.pause();
    isPlaying = false;
    vinylGold.classList.remove('rotating');
    musicBtnIcon.textContent = '▶';
  }

  musicToggleBtn.addEventListener('click', () => {
    if (isPlaying) pauseMusic();
    else startMusic();
  });

  bgMusic.addEventListener('timeupdate', () => {
    const cur = bgMusic.currentTime;
    for (let i = lyricTimeline.length - 1; i >= 0; i--) {
      if (cur >= lyricTimeline[i].time) {
        currentLyricText.textContent = lyricTimeline[i].text;
        break;
      }
    }
  });

  // Entrance Curtain Click
  enterSiteBtn.addEventListener('click', () => {
    curtainOverlay.classList.add('curtain-vanished');
    startMusic();
    fireGoldenConfetti({ particleCount: 110, spread: 90 });
    playRoyalChime();
  });

  // Quick Action Buttons
  document.getElementById('btnQuickConfetti').addEventListener('click', (e) => {
    fireGoldenConfetti({ particleCount: 80, spread: 80 });
    playRoyalChime();
    spawnFloatingSuit(e.clientX, e.clientY);
  });

  document.getElementById('btnQuickLantern').addEventListener('click', () => {
    document.getElementById('lanternSection').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('btnBackTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==============================================================
  // 3D Deck of Destiny (Cards Stage)
  // ==============================================================
  const cardsStage = document.getElementById('cardsStage');
  const btnFanCards = document.getElementById('btnFanCards');
  const btnFlipAll = document.getElementById('btnFlipAll');
  const btnDrawRandom = document.getElementById('btnDrawRandom');
  const deckUploadInput = document.getElementById('deckUploadInput');

  let allCardsFlipped = false;
  let isFanned = false;

  function getCardWrappers() {
    return Array.from(cardsStage.querySelectorAll('.tarot-card-wrapper'));
  }

  // Toggle Fan out perspective
  btnFanCards.addEventListener('click', () => {
    isFanned = !isFanned;
    const wrappers = getCardWrappers();
    wrappers.forEach((w, idx) => {
      if (isFanned) {
        const mid = (wrappers.length - 1) / 2;
        const offset = (idx - mid) * 4;
        const rot = (idx - mid) * 2.5;
        w.style.transform = `rotate(${rot}deg) translateY(${Math.abs(idx - mid) * 6}px)`;
      } else {
        w.style.transform = '';
      }
    });
    btnFanCards.querySelector('span').textContent = isFanned ? 'Ratakan Kartu' : 'Mekarkan Kartu (Fan Out)';
    playRoyalChime();
  });

  // Flip All Cards
  btnFlipAll.addEventListener('click', () => {
    allCardsFlipped = !allCardsFlipped;
    const cards = cardsStage.querySelectorAll('.tarot-card');
    cards.forEach((card, idx) => {
      setTimeout(() => {
        if (allCardsFlipped) card.classList.add('flipped');
        else card.classList.remove('flipped');
      }, idx * 100);
    });
    btnFlipAll.querySelector('span').textContent = allCardsFlipped ? 'Tutup Semua Kartu' : 'Balik Semua Kartu';
    playRoyalChime();
  });

  // Draw Random Card
  btnDrawRandom.addEventListener('click', () => {
    const wrappers = getCardWrappers();
    if (!wrappers.length) return;
    const randomIndex = Math.floor(Math.random() * wrappers.length);
    const chosen = wrappers[randomIndex];
    const innerCard = chosen.querySelector('.tarot-card');

    chosen.scrollIntoView({ behavior: 'smooth', block: 'center' });
    innerCard.classList.add('flipped');
    fireGoldenConfetti({ particleCount: 50, spread: 60 });
    playRoyalChime();

    setTimeout(() => {
      openCardModal(randomIndex);
    }, 600);
  });

  // Card click: flip card & open detail modal
  function attachCardEvents(wrapper, index) {
    wrapper.addEventListener('click', () => {
      const inner = wrapper.querySelector('.tarot-card');
      inner.classList.toggle('flipped');
      setTimeout(() => {
        openCardModal(index);
      }, 350);
    });
  }

  getCardWrappers().forEach((w, i) => attachCardEvents(w, i));

  // Dynamic Photo Card Upload
  deckUploadInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const newWrapper = document.createElement('div');
        newWrapper.className = 'tarot-card-wrapper';
        const newIndex = getCardWrappers().length;
        newWrapper.dataset.index = newIndex;
        newWrapper.innerHTML = `
          <div class="tarot-card">
            <div class="card-face card-back-side">
              <div class="filigree-border">
                <div class="center-seal">
                  <span class="seal-suit">♥</span>
                  <span class="seal-title">NEW MEMORY</span>
                  <span class="seal-tag">SALMA AULIA</span>
                </div>
              </div>
            </div>
            <div class="card-face card-front-side">
              <div class="card-header-bar">
                <span class="card-corner-val">★ ♥</span>
                <span class="card-name-val">Special Moment</span>
                <span class="card-corner-val">♥ ★</span>
              </div>
              <div class="card-photo-box">
                <img src="${event.target.result}" alt="Foto Baru Salma">
              </div>
              <div class="card-meta">
                <h4>Kenangan Tambahan</h4>
                <p>Momen manis yang baru saja diabadikan ✨</p>
              </div>
            </div>
          </div>
        `;
        cardsStage.appendChild(newWrapper);
        attachCardEvents(newWrapper, newIndex);
        fireGoldenConfetti({ particleCount: 40, spread: 50 });
      };
      reader.readAsDataURL(file);
    });
  });

  // ==============================================================
  // Card Modal / Lightbox Details
  // ==============================================================
  const cardModal = document.getElementById('cardModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalPrevBtn = document.getElementById('modalPrevBtn');
  const modalNextBtn = document.getElementById('modalNextBtn');

  let currentModalIndex = 0;

  function openCardModal(idx) {
    const wrappers = getCardWrappers();
    if (!wrappers[idx]) return;
    currentModalIndex = idx;

    const w = wrappers[currentModalIndex];
    const img = w.querySelector('.card-photo-box img');
    const title = w.querySelector('.card-meta h4')?.textContent || 'Salma Aulia';
    const desc = w.querySelector('.card-meta p')?.textContent || 'Momen yang begitu berharga.';

    modalImg.src = img.src;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;

    cardModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCardModal() {
    cardModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navCardModal(step) {
    const wrappers = getCardWrappers();
    currentModalIndex = (currentModalIndex + step + wrappers.length) % wrappers.length;
    openCardModal(currentModalIndex);
  }

  modalCloseBtn.addEventListener('click', closeCardModal);
  modalBackdrop.addEventListener('click', closeCardModal);
  modalPrevBtn.addEventListener('click', () => navCardModal(-1));
  modalNextBtn.addEventListener('click', () => navCardModal(1));

  document.addEventListener('keydown', (e) => {
    if (!cardModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeCardModal();
    if (e.key === 'ArrowLeft') navCardModal(-1);
    if (e.key === 'ArrowRight') navCardModal(1);
  });

  // ==============================================================
  // The Golden Flame Lantern / Make a Wish
  // ==============================================================
  const goldFlames = document.querySelectorAll('.gold-flame');
  const smokeTrails = document.querySelectorAll('.smoke-trail');
  const btnExtinguish = document.getElementById('btnExtinguish');
  const btnRelight = document.getElementById('btnRelight');
  const altarStatusText = document.getElementById('altarStatusText');
  const wishRevealScroll = document.getElementById('wishRevealScroll');
  let isExtinguished = false;

  function extinguishGoldenFlames() {
    if (isExtinguished) return;
    isExtinguished = true;

    playSynthWindBlow();

    goldFlames.forEach(f => f.classList.add('extinguished'));
    smokeTrails.forEach(s => {
      s.classList.remove('active');
      void s.offsetWidth;
      s.classList.add('active');
    });

    setTimeout(() => {
      playRoyalChime();
      fireRoyalGrandFireworks();

      altarStatusText.textContent = "✨ Harapan emasmu telah terangkat ke langit semesta!";
      btnExtinguish.classList.add('hidden');
      btnRelight.classList.remove('hidden');
      wishRevealScroll.classList.remove('hidden');
    }, 450);
  }

  function relightGoldenFlames() {
    isExtinguished = false;
    goldFlames.forEach(f => f.classList.remove('extinguished'));
    smokeTrails.forEach(s => s.classList.remove('active'));

    altarStatusText.textContent = "Tiga lilin emas menyala abadi. Siapkan harapanmu...";
    btnExtinguish.classList.remove('hidden');
    btnRelight.classList.add('hidden');
    wishRevealScroll.classList.add('hidden');
    playRoyalChime();
  }

  btnExtinguish.addEventListener('click', extinguishGoldenFlames);
  btnRelight.addEventListener('click', relightGoldenFlames);

  document.querySelectorAll('.pillar-candle').forEach(c => {
    c.addEventListener('click', () => {
      if (!isExtinguished) extinguishGoldenFlames();
    });
  });

  // ==============================================================
  // The Royal Wax-Sealed Letter
  // ==============================================================
  const royalEnvelope = document.getElementById('royalEnvelope');
  const waxSealGold = document.getElementById('waxSealGold');
  const btnToggleEnvelope = document.getElementById('btnToggleEnvelope');
  const envButtonLabel = document.getElementById('envButtonLabel');

  function toggleRoyalLetter() {
    const isUnsealed = royalEnvelope.classList.toggle('unsealed');
    if (isUnsealed) {
      envButtonLabel.textContent = "Lipat Kembali Surat";
      fireGoldenConfetti({ particleCount: 45, spread: 60 });
      playRoyalChime();
    } else {
      envButtonLabel.textContent = "Buka Segel & Baca Surat";
    }
  }

  waxSealGold.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleRoyalLetter();
  });

  btnToggleEnvelope.addEventListener('click', toggleRoyalLetter);

  // ==============================================================
  // Constellation Wishes Board
  // ==============================================================
  const constellationForm = document.getElementById('constellationForm');
  const senderNameInput = document.getElementById('senderName');
  const wishTextInput = document.getElementById('wishText');
  const wishesStreamList = document.getElementById('wishesStreamList');
  const wishCountVal = document.getElementById('wishCountVal');

  const defaultConstellationWishes = [
    {
      sender: "Hamdi",
      message: "Selamat bertambah usia, Salma Aulia! Di antara semua bait lagu Shape of My Heart, semoga hatimu selalu menemukan ketenangan, kebahagiaan, dan kehangatan yang tak pernah usai. Terima kasih selalu hadir dengan caramu yang begitu istimewa. 🤍",
      suit: "♥",
      time: "Hari ini"
    },
    {
      sender: "Sahabat Sejati",
      message: "Happy Birthday Salma! Semoga di lembaran usia baru ini makin gemilang, selalu ceria, sehat dan segala cita-citamu dilancarkan semesta.",
      suit: "♦",
      time: "Hari ini"
    },
    {
      sender: "Lingkaran Hangat",
      message: "Barakallah fii umrik Queen of Hearts Salma! Teruslah bersinar dan menjadi inspirasi bagi orang-orang di sekitarmu.",
      suit: "👑",
      time: "Hari ini"
    }
  ];

  function loadConstellationWishes() {
    const stored = localStorage.getItem('salma_shape_of_heart_wishes');
    let list = stored ? JSON.parse(stored) : defaultConstellationWishes;
    renderConstellationList(list);
  }

  function saveAndRenderConstellation(newWish) {
    const stored = localStorage.getItem('salma_shape_of_heart_wishes');
    let list = stored ? JSON.parse(stored) : defaultConstellationWishes;
    list.unshift(newWish);
    localStorage.setItem('salma_shape_of_heart_wishes', JSON.stringify(list));
    renderConstellationList(list);
  }

  function renderConstellationList(list) {
    wishCountVal.textContent = list.length;
    wishesStreamList.innerHTML = list.map(item => `
      <div class="constellation-wish-card">
        <div class="wish-avatar-badge">${escapeHtml(item.suit || '♥')}</div>
        <div class="wish-core">
          <div class="wish-row-top">
            <span class="wish-author-name">${escapeHtml(item.sender)}</span>
            <span class="wish-timestamp">${item.time}</span>
          </div>
          <p class="wish-message-body">${escapeHtml(item.message)}</p>
        </div>
      </div>
    `).join('');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  constellationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const sender = senderNameInput.value.trim();
    const message = wishTextInput.value.trim();
    const chosenSuit = document.querySelector('input[name="wishSuit"]:checked')?.value || '♥';

    if (!sender || !message) return;

    saveAndRenderConstellation({
      sender,
      message,
      suit: chosenSuit,
      time: 'Baru saja'
    });

    constellationForm.reset();
    fireGoldenConfetti({ particleCount: 65, spread: 75 });
    playRoyalChime();
  });

  loadConstellationWishes();

  // Floating suit effect
  function spawnFloatingSuit(x, y) {
    const suit = document.createElement('div');
    suit.style.position = 'fixed';
    suit.style.pointerEvents = 'none';
    suit.style.zIndex = '99999';
    suit.style.fontFamily = 'var(--font-serif)';
    suit.style.fontSize = '26px';
    suit.style.color = '#ffd700';
    suit.style.left = `${x || window.innerWidth / 2}px`;
    suit.style.top = `${y || window.innerHeight / 2}px`;

    const suits = ['♥', '♦', '♠', '♣', '👑'];
    suit.textContent = suits[Math.floor(Math.random() * suits.length)];

    suit.animate([
      { opacity: 1, transform: 'translate(0, 0) scale(0.6)' },
      { opacity: 0.9, transform: `translate(${(Math.random() - 0.5) * 80}px, -70px) scale(1.3)` },
      { opacity: 0, transform: `translate(${(Math.random() - 0.5) * 120}px, -140px) scale(1.6)` }
    ], {
      duration: 1200,
      easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
    });

    document.body.appendChild(suit);
    setTimeout(() => suit.remove(), 1200);
  }

  // ==============================================================
  // Ambient Canvas: Golden Stardust & Subtle Drifting Suits
  // ==============================================================
  function setupAmbientGoldenCanvas() {
    const canvas = document.getElementById('ambientCanvas');
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.6,
      speedY: Math.random() * 0.3 + 0.08,
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.5 + 0.2,
      isSuit: Math.random() > 0.85,
      suitChar: ['♠', '♥', '♦', '♣'][Math.floor(Math.random() * 4)]
    }));

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.y -= p.speedY;
        p.x += p.speedX;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        if (p.isSuit) {
          ctx.font = '12px Cinzel, serif';
          ctx.fillStyle = `rgba(223, 177, 91, ${p.opacity * 0.6})`;
          ctx.fillText(p.suitChar, p.x, p.y);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245, 215, 140, ${p.opacity})`;
          ctx.shadowBlur = p.size * 2.5;
          ctx.shadowColor = '#dfb15b';
          ctx.fill();
        }
      });

      requestAnimationFrame(renderCanvas);
    }

    renderCanvas();
  }
});
