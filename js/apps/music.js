window.pandaOS = window.pandaOS || {};

window.pandaOS.music = {
  title: "Music Player",
  width: 550,
  height: 520,
  getContent: () => `
    <div class="music-player">
      <div class="now-playing">
        <img id="album-art" class="album-art" alt="album art">
        <div class="song-info">
          <div id="current-title" class="current-title">No song selected</div>
          <div id="current-artist" class="current-artist"></div>
        </div>
      </div>
      <div class="music-progress">
        <span id="current-time">0:00</span>
        <input type="range" id="seek-bar" min="0" max="100" value="0" class="seek-bar">
        <span id="duration-time">0:00</span>
      </div>
      <div class="music-playlist">
        <h4>Playlist</h4>
        <ul id="playlist"></ul>
      </div>
      <div class="music-controls">
        <audio id="audio-player"></audio>
        <div class="player-buttons">
          <button id="prev" title="Previous">&lt;&lt;</button>
          <button id="play-pause" title="Play/Pause">▶</button>
          <button id="next" title="Next">&gt;&gt;</button>
        </div>
      </div>
    </div>
  `,
  init: function () {
    const checkExist = setInterval(() => {
      const audio = document.getElementById("audio-player");
      if (audio) {
        clearInterval(checkExist);
        this.attachEvents();
      }
    }, 100);
  },
  attachEvents: function () {
    const songs = [
      {
        title: "AIZO",
        artist: "King Gnu",
        url: "assets/music/aizo.mp3",
        cover: "assets/music/aizo.jpeg",
      },
      {
        title: "Afterlife",
        artist: "Evanescence",
        url: "assets/music/afterlife.mp3",
        cover: "assets/music/afterlife.jpeg",
      },
      {
        title: "Bling-Bang-Bang-Born",
        artist: "Creepy Nuts",
        url: "assets/music/bling-bang-bang-born.mp3",
        cover: "assets/music/bling-bang-bang-born.jpeg",
      },
      {
        title: "End of Beginning",
        artist: "DJO",
        url: "assets/music/endofbeginning.mp3",
        cover: "assets/music/endofbeginning.jpeg",
      },
      {
        title: "Notion",
        artist: "The Rare Occasions",
        url: "assets/music/notion.mp3",
        cover: "assets/music/notion.jpeg",
      },
    ];

    let currentIndex = 0;
    const audio = document.getElementById("audio-player");
    const playlistEl = document.getElementById("playlist");
    const playPauseBtn = document.getElementById("play-pause");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");
    const currentTitle = document.getElementById("current-title");
    const currentArtist = document.getElementById("current-artist");
    const albumArt = document.getElementById("album-art");
    const seekBar = document.getElementById("seek-bar");
    const currentTimeSpan = document.getElementById("current-time");
    const durationTimeSpan = document.getElementById("duration-time");

    // Volume sync: listen to dock slider directly
    const dockVolume = document.getElementById("volume-slider");
    if (dockVolume) {
      const updateAudioVolume = () => {
        audio.volume = dockVolume.value / 100;
      };
      updateAudioVolume();
      dockVolume.addEventListener("input", updateAudioVolume);
    } else if (window.pandaOS.masterVolume !== undefined) {
      audio.volume = window.pandaOS.masterVolume;
    }

    function formatTime(seconds) {
      if (isNaN(seconds)) return "0:00";
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }

    function updateSeekBar() {
      if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        seekBar.value = percent;
        currentTimeSpan.textContent = formatTime(audio.currentTime);
        durationTimeSpan.textContent = formatTime(audio.duration);
      }
    }

    function seekTo(value) {
      if (audio.duration) {
        const newTime = (value / 100) * audio.duration;
        audio.currentTime = newTime;
        updateSeekBar();
      }
    }

    function renderPlaylist() {
      playlistEl.innerHTML = "";
      songs.forEach((song, idx) => {
        const li = document.createElement("li");
        li.textContent = `${song.title} – ${song.artist}`;
        li.dataset.index = idx;
        if (idx === currentIndex) li.classList.add("active");
        li.addEventListener("click", () => {
          currentIndex = idx;
          playSong(currentIndex);
        });
        playlistEl.appendChild(li);
      });
    }

    function updateActivePlaylist() {
      const items = playlistEl.querySelectorAll("li");
      items.forEach((item, idx) => {
        if (idx === currentIndex) item.classList.add("active");
        else item.classList.remove("active");
      });
    }

    function playSong(index) {
      const song = songs[index];
      if (!song) return;
      audio.src = song.url;
      audio.load();
      audio.play().catch((e) => console.log("Autoplay prevented:", e));
      currentTitle.textContent = song.title;
      currentArtist.textContent = song.artist;
      if (song.cover && albumArt) {
        albumArt.src = song.cover;
        albumArt.style.display = "";
      } else {
        albumArt.style.display = "none";
      }
      albumArt.onerror = () => {
        albumArt.style.display = "none";
      };
      playPauseBtn.innerHTML = "⏸";
      updateActivePlaylist();
    }

    function togglePlayPause() {
      if (audio.paused) {
        audio.play();
        playPauseBtn.innerHTML = "⏸";
      } else {
        audio.pause();
        playPauseBtn.innerHTML = "▶";
      }
    }

    function nextSong() {
      currentIndex = (currentIndex + 1) % songs.length;
      playSong(currentIndex);
    }

    function prevSong() {
      currentIndex = (currentIndex - 1 + songs.length) % songs.length;
      playSong(currentIndex);
    }

    audio.addEventListener("timeupdate", updateSeekBar);
    audio.addEventListener("loadedmetadata", () => {
      durationTimeSpan.textContent = formatTime(audio.duration);
      seekBar.value = 0;
      currentTimeSpan.textContent = "0:00";
    });
    audio.addEventListener("ended", nextSong);
    seekBar.addEventListener("input", (e) => {
      seekTo(e.target.value);
    });

    playPauseBtn.addEventListener("click", togglePlayPause);
    prevBtn.addEventListener("click", prevSong);
    nextBtn.addEventListener("click", nextSong);

    renderPlaylist();
    currentIndex = 0;
    const firstSong = songs[0];
    currentTitle.textContent = firstSong.title;
    currentArtist.textContent = firstSong.artist;
    if (firstSong.cover && albumArt) {
      albumArt.src = firstSong.cover;
      albumArt.style.display = "";
    } else {
      albumArt.style.display = "none";
    }
    audio.src = firstSong.url;
  },
};
