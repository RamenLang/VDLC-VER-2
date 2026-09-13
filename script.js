const galleries = {
  recent: [
    { title: "GetRekt", description: "", duration: "00:15", src: "Assets/get-rekt.mp4" },
    { title: "The Descent", description: "", duration: "00:13", src: "Assets/descent.mp4" },
    { title: "Leaves", description: "", duration: "00:37", src: "Assets/leaves.mp4" }
  ],

  "own-motion": [
    { title: "Leaves", description: "Motion Graphics for Ben&Ben", duration: "0:37", src: "Assets/leaves.mp4" },
    { title: "Lifetime", description: "Motion Graphics for Ben&Ben", duration: "0:21", src: "Assets/lifetime.mp4" }
  ],
  "own-film": [
    { title: "Hear Me Out", description: "PRIMA Productions", duration: "00:30", src: "Assets/hear-me-out.mp4" },
    { title: "Harana", description: "PRIMA Productions", duration: "00:09", src: "Assets/harana-teaser.mp4" },
    { title: "Prima Logo", description: "PRIMA Productions", duration: "00:06", src: "Assets/prima-logo.mp4" }
  ],
  "own-landscape": [
    { title: "SITE in Borderland", description: "Teaser for SITE", duration: "00:51", src: "Assets/csits-trailers.mp4" },
    { title: "The Descent", description: "", duration: "00:13", src: "Assets/descent.mp4" },
    { title: "RamenStyle", description: "", duration: "00:21", src: "Assets/valorant.mp4" },
    { title: "It's me Ramen", description: "", duration: "00:32", src: "Assets/uts.mp4" },
    { title: "PomSITE", description: "", duration: "00:34", src: "Assets/pom-dance.mp4" },
    { title: "Parallel Souls", description: "SITE Short Film", duration: "03:00", src: "Assets/parallel-souls.mp4" }
  ],
  "own-reels": [
    { title: "Surfin' USA", description: "", duration: "00:25", src: "Assets/sample-edit1.mp4" },
    { title: "Harana", description: "PRIMA Productions", duration: "00:09", src: "Assets/harana-teaser.mp4" }
  ],

  "paid-motion": [
    { title: "GetRekt", description: "SaaS Demo", duration: "00:15", src: "Assets/get-rekt.mp4" }
  ],
  "paid-film": [
  ],
  "paid-landscape": [
    { title: "ZT6", description: "Finished Video", duration: "00:30", src: "Assets/zt6.mp4" },
    { title: "Stickman", description: "Paid Sample", duration: "01:27", src: "Assets/stickman.mp4" },
    { title: "Zeep", description: "Paid Sample", duration: "00:43", src: "Assets/zeep.mp4" }
  ],
  "paid-reels": [
    { title: "Hit", description: "BabyKhase9 Finished Video", duration: "01:34", src: "Assets/hit-reel.mp4" },
    { title: "It's Over", description: "BabyKhase9 Finished Video", duration: "01:48", src: "Assets/its-over.mp4" },
    { title: "Looks maxxing", description: "Paid Sample", duration: "00:10", src: "Assets/sample-edit2.mp4" },
    { title: "Game Promotion", description: "Paid Sample", duration: "00:41", src: "Assets/sample-edit3.mp4" }
  ]
};

function createVideoCard(video) {
  return `
    <article class="video-card" data-video-src="${video.src}">
      <div class="video-frame">
        <video muted loop playsinline preload="metadata" src="${video.src}"></video>
        <div class="video-overlay"></div>
        <button class="play-button" type="button" aria-label="Play video">▶</button>
        <span class="video-duration">${video.duration}</span>
        <span class="fullscreen-hint">Double-tap for fullscreen</span>
      </div>
      <div class="video-info">
        <h3>${video.title}</h3>
        <p>${video.description}</p>
      </div>
    </article>
  `;
}

function emptyGalleryMessage() {
  return `<p class="gallery-empty">No videos in this category yet — check back soon.</p>`;
}

document.querySelectorAll("[data-gallery]").forEach((grid) => {
  const key = grid.dataset.gallery;
  const videos = galleries[key] || [];
  grid.innerHTML = videos.length
    ? videos.map(createVideoCard).join("")
    : emptyGalleryMessage();
});

(function () {
  const wraps = document.querySelectorAll(".carousel-wrap");
  if (!wraps.length) return;

  wraps.forEach((wrap) => {
    const track = wrap.querySelector(".carousel-track");
    const prevBtn = wrap.querySelector(".carousel-arrow-prev");
    const nextBtn = wrap.querySelector(".carousel-arrow-next");
    if (!track || !prevBtn || !nextBtn) return;

    function stepSize() {
      const firstCard = track.querySelector(".video-card");
      if (!firstCard) return track.clientWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 22);
      return firstCard.getBoundingClientRect().width + gap;
    }

    function updateArrowState() {
      const maxScroll = track.scrollWidth - track.clientWidth - 2;
      prevBtn.disabled = track.scrollLeft <= 2;
      nextBtn.disabled = track.scrollLeft >= maxScroll;
    }

    prevBtn.addEventListener("click", () => {
      track.scrollBy({ left: -stepSize(), behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
      track.scrollBy({ left: stepSize(), behavior: "smooth" });
    });

    track.addEventListener("scroll", updateArrowState, { passive: true });
    window.addEventListener("resize", updateArrowState);

    requestAnimationFrame(updateArrowState);
  });
})();

(function () {
  const layers = [
    { el: document.getElementById("wheatBack"), speed: 0.015 },
    { el: document.getElementById("wheatFront"), speed: 0.03 }
  ].filter((l) => l.el);

  if (!layers.length) return;

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  let ticking = false;

  function applyParallax() {
    const y = window.scrollY;
    layers.forEach((layer) => {
      layer.el.style.transform = `translateY(${-(y * layer.speed)}px)`;
    });
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(applyParallax);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  applyParallax();
})();

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

let savedScrollY = 0;
let activeFullscreenFrame = null;

function openFullscreenFrame(frame) {
  savedScrollY = window.scrollY;
  frame.classList.add("is-fullscreen");
  document.body.classList.add("fullscreen-lock");
  activeFullscreenFrame = frame;
}

function closeFullscreenFrame(frame) {
  frame.classList.remove("is-fullscreen");
  document.body.classList.remove("fullscreen-lock");
  activeFullscreenFrame = null;
  window.scrollTo(0, savedScrollY);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && activeFullscreenFrame) {
    closeFullscreenFrame(activeFullscreenFrame);
  }
});

document.querySelectorAll(".video-card").forEach((card) => {
  const video = card.querySelector("video");
  const button = card.querySelector(".play-button");
  if (!video || !button) return;

  video.addEventListener("loadeddata", () => {
    card.classList.add("is-ready");
  });
  video.addEventListener("error", () => {
    card.classList.add("has-error");
    console.error(`Failed to load video: ${video.src}`);
  });

  function togglePlay() {
    if (video.paused) {
      document.querySelectorAll(".video-card video").forEach((otherVideo) => {
        if (otherVideo !== video && !otherVideo.paused) {
          otherVideo.pause();
          otherVideo.muted = true;
          const otherButton = otherVideo.closest(".video-card").querySelector(".play-button");
          if (otherButton) otherButton.textContent = "▶";
        }
      });

      video.muted = false;
      video.play();
      button.textContent = "❚❚";
    } else {
      video.pause();
      button.textContent = "▶";
    }
  }

  button.addEventListener("click", togglePlay);

  let clickTimer = null;
  video.addEventListener("click", () => {
    if (clickTimer) {
      clearTimeout(clickTimer);
      clickTimer = null;
      return;
    }
    clickTimer = setTimeout(() => {
      clickTimer = null;
      togglePlay();
    }, 250);
  });

  video.addEventListener("dblclick", () => {
    video.muted = false;
    const frame = card.querySelector(".video-frame");
    if (!frame.classList.contains("is-fullscreen")) {
      openFullscreenFrame(frame);
    } else {
      closeFullscreenFrame(frame);
    }
  });

  video.addEventListener("ended", () => {
    video.currentTime = 0;
    button.textContent = "▶";
  });

  video.addEventListener("play", () => {
    card.classList.add("is-playing");
  });

  video.addEventListener("pause", () => {
    card.classList.remove("is-playing");
  });

  const offscreenObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && !video.paused) {
          video.pause();
        }
      });
    },
    { threshold: 0.1 }
  );
  offscreenObserver.observe(video);
});

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const button = this.querySelector("button");
    const label = button.textContent;
    button.textContent = "Message sent";
    button.disabled = true;
    setTimeout(() => {
      button.textContent = label;
      button.disabled = false;
      contactForm.reset();
    }, 1800);
  });
}

const inquireModal = document.getElementById("inquireModal");
const inquireOpenBtn = document.getElementById("inquireOpenBtn");
const inquireCloseBtn = document.getElementById("inquireCloseBtn");
const inquireBackdrop = document.getElementById("inquireBackdrop");
const inquireForm = document.getElementById("inquireForm");
const inquireStatus = document.getElementById("inquireStatus");

function openInquire() {
  inquireModal.classList.add("is-open");
  inquireModal.setAttribute("aria-hidden", "false");
}
function closeInquire() {
  inquireModal.classList.remove("is-open");
  inquireModal.setAttribute("aria-hidden", "true");
}

if (inquireOpenBtn) inquireOpenBtn.addEventListener("click", openInquire);
if (inquireCloseBtn) inquireCloseBtn.addEventListener("click", closeInquire);
if (inquireBackdrop) inquireBackdrop.addEventListener("click", closeInquire);

if (inquireForm) {
  inquireForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    inquireStatus.textContent = "Sending...";
    try {
      const res = await fetch(inquireForm.action, {
        method: "POST",
        body: new FormData(inquireForm),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        inquireStatus.textContent = "Message sent — thank you!";
        inquireForm.reset();
      } else {
        inquireStatus.textContent = "Something went wrong. Try again.";
      }
    } catch {
      inquireStatus.textContent = "Something went wrong. Try again.";
    }
  });
}

const revealTargets = document.querySelectorAll(".video-card, .section-heading, .split-heading, .hub-card");

if ("IntersectionObserver" in window) {
  revealTargets.forEach((el) => el.classList.add("pre-reveal"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("pre-reveal");
          entry.target.classList.add("is-revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));
}

(function () {
  const board = document.getElementById("gameBoard");
  const track = document.getElementById("cupTrack");
  const startBtn = document.getElementById("gameStartBtn");
  const statusEl = document.getElementById("gameStatus");
  const winsEl = document.getElementById("scoreWins");
  const lossesEl = document.getElementById("scoreLosses");

  if (!board || !track || !startBtn) return;

  const bowls = Array.from(track.querySelectorAll(".bowl"));
  const SLOT_LEFT = ["18%", "50%", "82%"];

  let slotOfBowl = [0, 1, 2];
  let coinBowl = null;
  let roundActive = false;
  let wins = 0;
  let losses = 0;

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function placeBowls(instant) {
    bowls.forEach((bowl, i) => {
      if (instant) bowl.style.transition = "none";
      bowl.style.left = SLOT_LEFT[slotOfBowl[i]];
      if (instant) {
        void bowl.offsetWidth;
        bowl.style.transition = "";
      }
    });
  }

  function setBowlsClickable(clickable) {
    bowls.forEach((bowl) => {
      bowl.style.pointerEvents = clickable ? "auto" : "none";
    });
  }

  function swapRandomPair() {
    const i = Math.floor(Math.random() * 3);
    let j = Math.floor(Math.random() * 2);
    if (j >= i) j += 1;
    const tmp = slotOfBowl[i];
    slotOfBowl[i] = slotOfBowl[j];
    slotOfBowl[j] = tmp;
    placeBowls(false);
  }

  async function playRound() {
    if (roundActive) return;
    roundActive = true;
    startBtn.disabled = true;
    setBowlsClickable(false);
    bowls.forEach((b) => b.classList.remove("lifted", "correct", "has-coin"));

    statusEl.textContent = "Watch closely...";
    coinBowl = Math.floor(Math.random() * 3);
    bowls[coinBowl].classList.add("has-coin", "lifted");

    await wait(850);

    bowls.forEach((b) => b.classList.remove("lifted"));
    await wait(420);

    statusEl.textContent = "Shuffling...";
    const shuffles = 9 + Math.floor(Math.random() * 3);
    for (let k = 0; k < shuffles; k++) {
      swapRandomPair();
      await wait(380);
    }

    statusEl.textContent = "Pick a bowl!";
    setBowlsClickable(true);
    startBtn.disabled = false;
    startBtn.textContent = "Restart";
    roundActive = false;
  }

  function onBowlPick(bowl) {
    if (roundActive) return;
    const pickedIndex = Number(bowl.dataset.bowl);
    setBowlsClickable(false);
    startBtn.disabled = true;

    const win = pickedIndex === coinBowl;
    bowl.classList.add("lifted");
    if (win) {
      bowl.classList.add("correct");
      wins += 1;
      if (winsEl) winsEl.textContent = wins;
      statusEl.textContent = "Sharp eyes — the coin was right there.";
    } else {
      bowls[coinBowl].classList.add("lifted", "correct");
      losses += 1;
      if (lossesEl) lossesEl.textContent = losses;
      statusEl.textContent = "Not quite — the coin was hiding under another bowl.";

      if (losses % 5 === 0 && typeof openInquire === "function") {
        statusEl.textContent = "Not quite — maybe hire someone who's better at this?";
        setTimeout(openInquire, 900);
      }
    }

    startBtn.disabled = false;
    startBtn.textContent = "Play again";
  }

  bowls.forEach((bowl) => {
    bowl.addEventListener("click", () => onBowlPick(bowl));
  });

  startBtn.addEventListener("click", playRound);

  placeBowls(true);
  setBowlsClickable(false);
})();