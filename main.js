
const audio = document.getElementById("audio");
const imageAudio = document.querySelector(".photo__img");
const titleAudio = document.querySelector(".music__title");
const artistAudio = document.querySelector(".music__artist");
const inputRange = document.querySelector(".music__progress");
const currentTime = document.querySelector(".current__time");
const totalTime = document.querySelector(".total__time");
const prevButton = document.querySelector(".prev__btn");
const playButton = document.querySelector(".play__btn");
const nextButton = document.querySelector(".next__btn");
const volumeAudio = document.querySelector(".volume__range");

const playlist = [

  {
    id: 1,
    title: "Janam raft 2",
    artist: "Sorena & Bahram",
    image: "./assets/img/bs.jpg",
    src: "./assets/music/janm.mp3",
  },
  {
    id: 2,
    title: "Ghorsaye Abi",
    artist: "Remix",
    image: "./assets/img/back.jpg",
    src: "./assets/music/GhorsayeAbi2.mp3",
  },
];

let currentTrackIndex = 0;
let isPlaying = false;

function updatePlayIcon() {
  const icon = playButton.firstElementChild;

  if (!icon) return;

  icon.classList.toggle("fa-play", !isPlaying);
  icon.classList.toggle("fa-pause", isPlaying);
}

function formatTime(time) {
  if (!Number.isFinite(time)) return "0:00";

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Load track
function loadTrack() {
  const track = playlist[currentTrackIndex];

  audio.pause();
  isPlaying = false;

  audio.src = track.src;
  audio.load();

  imageAudio.src = track.image;
  titleAudio.textContent = track.title;
  artistAudio.textContent = track.artist;

  inputRange.value = 0;
  currentTime.textContent = "0:00";
  totalTime.textContent = "0:00";

  updatePlayIcon();
}

// Play track
async function playTrack() {
  try {
    await audio.play();
    isPlaying = true;
    updatePlayIcon();
  } catch (error) {
    isPlaying = false;
    updatePlayIcon();
    console.error("Playback error:", error);
  }
}

// Pause track
function pauseTrack() {
  audio.pause();
  isPlaying = false;
  updatePlayIcon();
}

// Play / Pause button
playButton.addEventListener("click", () => {
  if (audio.paused) {
    playTrack();
  } else {
    pauseTrack();
  }
});

// Next track
function nextTrack() {
  currentTrackIndex++;

  if (currentTrackIndex >= playlist.length) {
    currentTrackIndex = 0;
  }

  loadTrack();
  playTrack();
}

nextButton.addEventListener("click", nextTrack);

// Previous track
prevButton.addEventListener("click", () => {
  currentTrackIndex--;

  if (currentTrackIndex < 0) {
    currentTrackIndex = playlist.length - 1;
  }

  loadTrack();
  playTrack();
});

// Update progress
audio.addEventListener("timeupdate", () => {
  if (!Number.isFinite(audio.duration)) return;

  const percentage =
    (audio.currentTime / audio.duration) * 100;

  inputRange.value = percentage;

  currentTime.textContent = formatTime(audio.currentTime);
  totalTime.textContent = formatTime(audio.duration);
});

// Load duration
audio.addEventListener("loadedmetadata", () => {
  totalTime.textContent = formatTime(audio.duration);
});

// Seek music
inputRange.addEventListener("input", () => {
  if (Number.isFinite(audio.duration)) {
    audio.currentTime =
      audio.duration * (inputRange.value / 100);
  }
});

// Volume
volumeAudio.addEventListener("input", (e) => {
  audio.volume = Number(e.target.value);
});

// Sync actual playback state
audio.addEventListener("play", () => {
  isPlaying = true;
  updatePlayIcon();
});

audio.addEventListener("pause", () => {
  isPlaying = false;
  updatePlayIcon();
});

// Automatically play next song
audio.addEventListener("ended", nextTrack);

// Handle errors
audio.addEventListener("error", () => {
  console.error("Audio loading error:", audio.error);
});

// Initial volume
audio.volume = Number(volumeAudio.value);

// Initial track
loadTrack();
