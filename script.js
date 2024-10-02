const audioPlayer = document.getElementById("audioPlayer");
const playButton = document.getElementById("playButton");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
const audioProgress = document.getElementById("audioProgress");
const currentTimeDisplay = document.getElementById("currentTime");
const totalDurationDisplay = document.getElementById("totalDuration");
const rightContainer = document.getElementById("right-container");
const buttons = document.querySelectorAll(".menu-button");

//////////////////Left Container///////////////////
playButton.addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playIcon.style.display = "none";
    pauseIcon.style.display = "block";

    // Right Container Display
    rightContainer.style.display = "block";
  } else {
    audioPlayer.pause();
    playIcon.style.display = "block";
    pauseIcon.style.display = "none";
  }
});

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
}

audioPlayer.addEventListener("loadedmetadata", () => {
  totalDurationDisplay.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener("timeupdate", () => {
  currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
  audioProgress.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  audioProgress.style.background = `linear-gradient(to right, #56255c ${audioProgress.value}%, #ffffff80 ${audioProgress.value}%)`;
});

audioProgress.addEventListener("input", () => {
  const value = audioProgress.value;
  const duration = audioPlayer.duration;
  audioPlayer.currentTime = (value / 100) * duration;
  audioProgress.style.background = `linear-gradient(to right, #56255c ${value}%, #ffffff80 ${value}%)`;
});

// Menu Button
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  });
});

//////////////////Right Container///////////////////

// Event Listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  const buttons = {
    lyrics: document.getElementById("button-lyrics"),
    albums: document.getElementById("button-albums"),
    artists: document.getElementById("button-artists"),
  };

  const contents = {
    lyrics: document.querySelector(".lyrics"),
    albums: document.querySelector(".other-albums"),
    artists: document.querySelector(".related-artists"),
  };

  function showContent(selectedKey) {
    Object.values(contents).forEach(
      (content) => (content.style.display = "none")
    );
    contents[selectedKey].style.display = "block";
  }

  Object.keys(buttons).forEach((key) => {
    buttons[key].addEventListener("click", () => {
      Object.keys(buttons).forEach((k) =>
        buttons[k].classList.remove("active")
      );
      buttons[key].classList.add("active");
      showContent(key);
    });
  });

  showContent("lyrics");
});

// Lyrics Fetch API Section
const urlLyrics =
  "https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/?id=2396871";
const optionsLyrics = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "971db6bb98msh4f459aac0462b7bp16f6a9jsn9339cff15cca",
    "x-rapidapi-host": "genius-song-lyrics1.p.rapidapi.com",
  },
};

async function fetchLyrics() {
  try {
    const response = await fetch(urlLyrics, optionsLyrics);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    const lyricsHtml = result.lyrics.lyrics.body.html;
    const cleanedLyricsHtml = lyricsHtml.replace(/\[.*?\]<br\s*\/?>/g, "");
    document.querySelector(".lyrics").innerHTML = cleanedLyricsHtml;
  } catch (error) {
    console.error("Error fetching lyrics:", error);
  }
}

fetchLyrics();

//Atists and Album Fetch API Section
const url =
  "https://spotify23.p.rapidapi.com/albums/?ids=3IBcauSj5M2A6lTeffJzdv";
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "8ee8c0accfmshe7d3d7a3e7ed81ep1e2e81jsna6eefcbe3f9e",
    "x-rapidapi-host": "spotify23.p.rapidapi.com",
  },
};

// Fetch Album

async function fetchAlbum() {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();

    // Album Image
    const albumImageHtml = result.albums[0].images[1].url;
    const albumLinkHtml = result.albums[0].uri;
    const imgAlbumDiv = document.querySelector(".img-album");

    imgAlbumDiv.innerHTML = `<a href="${albumLinkHtml}" target="_blank">
        <img src="${albumImageHtml}" alt="Album">
      </a>`;

    // Album Title
    const albumTitleHtml = result.albums[0].name;
    document.querySelector(
      ".album-title"
    ).innerHTML = `<p>${albumTitleHtml}</p>`;

    // Album Artists
    const albumArtistHtml = result.albums[0].artists[0].name;
    document.querySelector(
      ".album-artist"
    ).innerHTML = `<p>(${albumArtistHtml})</p>`;

    //Album Date
    const albumDateHtml = result.albums[0].release_date.substring(0, 4);
    document.querySelector(
      ".album-date"
    ).innerHTML = `<p><i>${albumDateHtml}</i></p>`;
  } catch (error) {
    console.error("Error fetching Album:", error);
  }
}

// Fetch Artists

async function fetchArtist() {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();

    // Album Image
    const albumImageHtml = result.albums[0].images[1].url;
    const albumLinkHtml = result.albums[0].artists[0].uri;
    const imgAlbumDiv = document.querySelector(".img-artist");

    imgAlbumDiv.innerHTML = `<a href="${albumLinkHtml}" target="_blank">
        <img src="${albumImageHtml}" alt="Artists">
      </a>`;

    // Album Artists
    const albumArtistHtml = result.albums[0].artists[0].name;
    document.querySelector(".artist").innerHTML = `<p>${albumArtistHtml}</p>`;
  } catch (error) {
    console.error("Error fetching Album:", error);
  }
}

fetchAlbum();
fetchArtist();
