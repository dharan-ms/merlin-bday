const SECRET = "2209";
let entered = "";

const lockScreen = document.getElementById("lockScreen");
const birthdayScreen = document.getElementById("birthdayScreen");
const pinMessage = document.getElementById("pinMessage");
const pinDots = [...document.querySelectorAll("#pinDisplay span")];

function updateDots() {
  pinDots.forEach((dot, i) => dot.classList.toggle("filled", i < entered.length));
}

function pressKey(key) {
  if (key === "clear") entered = "";
  else if (key === "back") entered = entered.slice(0, -1);
  else if (entered.length < 4) entered += key;
  updateDots();
  pinMessage.textContent = "Hint: the birthday is written on the calendar. ✨";
}

document.querySelectorAll(".keypad button").forEach(btn => {
  btn.addEventListener("click", () => pressKey(btn.dataset.key));
});

document.addEventListener("keydown", e => {
  if (lockScreen.classList.contains("hidden")) return;
  if (/^[0-9]$/.test(e.key)) pressKey(e.key);
  if (e.key === "Backspace") pressKey("back");
  if (e.key === "Escape") pressKey("clear");
  if (e.key === "Enter") unlock();
});

document.getElementById("enterBtn").addEventListener("click", unlock);

function unlock() {
  if (entered === SECRET) {
    pinMessage.textContent = "Unlocked! Your little surprise is ready. 💗";
    lockScreen.animate(
      [{opacity:1, transform:"scale(1)"},{opacity:0, transform:"scale(1.03)"}],
      {duration:650, easing:"ease", fill:"forwards"}
    );
    setTimeout(() => {
      lockScreen.classList.add("hidden");
      birthdayScreen.classList.remove("hidden");
      window.scrollTo(0,0);
      burst(80);
      startBirthdayMusic();
    }, 620);
  } else {
    pinMessage.textContent = "Almost! Try the birthday date: 22-09 ✨";
    pinMessage.animate(
      [{transform:"translateX(0)"},{transform:"translateX(-7px)"},{transform:"translateX(7px)"},{transform:"translateX(0)"}],
      {duration:260}
    );
  }
}

document.querySelectorAll(".open-modal").forEach(btn => {
  btn.addEventListener("click", () => openModal(btn.dataset.modal));
});

function openModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeAllModals() {
  document.querySelectorAll(".modal.open").forEach(m => m.classList.remove("open"));
  document.body.style.overflow = "";
}

document.querySelectorAll(".close-modal").forEach(btn => btn.addEventListener("click", closeAllModals));
document.querySelectorAll(".modal").forEach(modal => {
  modal.addEventListener("click", e => { if (e.target === modal) closeAllModals(); });
});
document.addEventListener("keydown", e => { if (e.key === "Escape") closeAllModals(); });

document.querySelectorAll(".scroll-to").forEach(btn => {
  btn.addEventListener("click", () => document.getElementById(btn.dataset.target).scrollIntoView({behavior:"smooth"}));
});

const wishes = [
  "May your inbox be light, your weekends long, and your coffee always the right temperature. ☕",
  "May this year bring you tiny wins that turn into big smiles. 🌷",
  "More laughter, more good food, more adventures — and fewer 9 AM meetings. ✨",
  "May you meet kind people, get exciting opportunities, and have plenty of peaceful days. 🌈",
  "Wishing you a year that feels like a collection of very good days. 💗",
  "May your hard work come back to you as happiness, growth and well-deserved breaks. 🥂"
];
let wishIndex = 0;

document.getElementById("anotherWish").addEventListener("click", () => {
  wishIndex = (wishIndex + 1) % wishes.length;
  const box = document.getElementById("wishText");
  box.animate([{opacity:0, transform:"translateY(8px)"},{opacity:1, transform:"translateY(0)"}], {duration:300});
  box.textContent = wishes[wishIndex];
});

document.getElementById("surpriseBtn").addEventListener("click", () => {
  burst(130);
  showToast("Birthday magic: officially sprinkled ✨");
});

document.getElementById("sparkleBtn").addEventListener("click", () => {
  burst(65);
  showToast("A little extra sparkle, just because 💫");
});

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

function burst(count) {
  const root = document.getElementById("confetti");
  root.innerHTML = "";
  const symbols = ["✦","♥","✧","•"];
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "confetto";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = `${Math.random() * 100}%`;
    el.style.fontSize = `${10 + Math.random() * 16}px`;
    el.style.animationDelay = `${Math.random() * .45}s`;
    el.style.color = ["#ff4f91","#f7b2ce","#f6c56d","#9c7af4","#5bc7b2"][Math.floor(Math.random()*5)];
    root.appendChild(el);
  }
  setTimeout(() => root.innerHTML = "", 3300);
}

// ── Birthday Music ──────────────────────────────────────────
const birthdayAudio = new Audio("assets/happy-birthday.mp3");
birthdayAudio.loop = true;
birthdayAudio.volume = 0.55;

let musicPlaying = false;

function startBirthdayMusic() {
  birthdayAudio.currentTime = 0;
  birthdayAudio.play().then(() => {
    musicPlaying = true;
    updateMusicBtn();
  }).catch(() => {
    // autoplay blocked — user must click the button manually
  });
}

function updateMusicBtn() {
  const btn = document.getElementById("musicBtn");
  if (!btn) return;
  if (musicPlaying) {
    btn.classList.add("playing");
    btn.querySelector(".music-label").textContent = "pause music";
  } else {
    btn.classList.remove("playing");
    btn.querySelector(".music-label").textContent = "play music";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const musicBtn = document.getElementById("musicBtn");
  if (musicBtn) {
    musicBtn.addEventListener("click", () => {
      if (musicPlaying) {
        birthdayAudio.pause();
        musicPlaying = false;
      } else {
        birthdayAudio.play();
        musicPlaying = true;
      }
      updateMusicBtn();
    });
  }
});

// ── Cracker Particle Animation ────────────────────────────────
(function() {
  const canvas = document.getElementById("crackerCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [];
  let animFrame = null;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const COLORS = [
    "#ff4f91","#f21c78","#ff9fca","#f6c56d",
    "#9c7af4","#5bc7b2","#fff","#ffec6e","#ff6b6b","#a8edea"
  ];

  function createParticles(x, y) {
    for (let i = 0; i < 130; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 11;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (4 + Math.random() * 6),
        alpha: 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 5 + Math.random() * 8,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.28,
        gravity: 0.26 + Math.random() * 0.16,
        shape: Math.random() < 0.5 ? "circle" : "rect",
        decay: 0.011 + Math.random() * 0.012
      });
    }
  }

  function drawParticle(p) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle   = p.color;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    if (p.shape === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    }
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.alpha > 0.02);
    particles.forEach(p => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.985;
      p.alpha    -= p.decay;
      p.rotation += p.rotSpeed;
      drawParticle(p);
    });
    animFrame = particles.length > 0 ? requestAnimationFrame(animate) : null;
  }

  function popCracker(btn) {
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width  / 2;
    const y = rect.top  + rect.height / 2;

    btn.classList.remove("popped");
    void btn.offsetWidth;
    btn.classList.add("popped");
    setTimeout(() => btn.classList.remove("popped"), 460);

    createParticles(x, y);
    if (!animFrame) animFrame = requestAnimationFrame(animate);
    showToast("🎉 Pop! Happy Birthday Merlin!");
  }

  document.getElementById("crackerLeft") .addEventListener("click", function() { popCracker(this); });
  document.getElementById("crackerRight").addEventListener("click", function() { popCracker(this); });
})();
