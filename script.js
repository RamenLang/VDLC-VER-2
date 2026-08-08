const recentVideos = [
  {
    title: "Flixk",
    description: "",
    duration: "00:46",
    src: "Assets/hit-reel.mp4"
  },
  {
    title: "It's Over",
    description: "",
    duration: "00:56",
    src: "Assets/its-over.mp4"
  },
  {
    title: "Lifetime",
    description: "",
    duration: "00:21",
    src: "Assets/lifetime.mp4"
  }
];
const allVideos = [
  {
    title: "ZT6",
    description: "",
    duration: "00:30",
    src: "Assets/zt6.mp4"
  },
  {
    title: "ValoCowboy",
    description: "",
    duration: "00:21",
    src: "Assets/valorant.mp4"
  },
  {
    title: "Hear Me Out",
    description: "",
    duration: "0:30",
    src: "Assets/hear-me-out.mp4"
  },
  {
    title: "SITE in borderland",
    description: "",
    duration: "00:51",
    src: "Assets/csits-trailers.mp4"
  },
  {
    title: "Surfin' USA",
    description: "",
    duration: "00:25",
    src: "Assets/sample-edit1.mp4"
  },
  {
    title: "Parallel Souls",
    description: "",
    duration: "03:00",
    src: "Assets/parallel-souls.mp4"
  },
  {
    title: "Stickman",
    description: "",
    duration: "01:27",
    src: "Assets/stickman.mp4"
  },
  {
    title: "Me, Myself, and I",
    description: "",
    duration: "00:32",
    src: "Assets/uts.mp4"
  },
    {
    title: "Pom Dance",
    description: "",
    duration: "00:34",
    src: "Assets/pom-dance.mp4"
  },
];

function createVideoCard(video) {
  return `
    <article class="video-card" data-video-src="${video.src}">
      <div class="video-frame">
        <video muted loop playsinline preload="metadata" src="${video.src}"></video>
        <div class="video-overlay"></div>
        <button class="play-button" type="button" aria-label="Play video">▶</button>
        <span class="video-duration">${video.duration}</span>
      </div>
      <div class="video-info">
        <h3>${video.title}</h3>
        <p>${video.description}</p>
      </div>
    </article>
  `;
}

const recentGrid = document.getElementById("recentVideosGrid");
const allGrid = document.getElementById("allVideosGrid");
if (recentGrid) {
  recentGrid.innerHTML = recentVideos.map(createVideoCard).join("");
}
if (allGrid) {
  allGrid.innerHTML = allVideos.map(createVideoCard).join("");
}

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

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

  video.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    video.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
  });

  button.addEventListener("click", () => {
  if (video.paused) {
    // pause every other video before playing this one
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
});

  video.addEventListener("ended", () => {
    video.currentTime = 0;
    button.textContent = "▶";
  });
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