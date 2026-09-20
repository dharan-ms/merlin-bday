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
