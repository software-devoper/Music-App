let arr = [];
let arrow = document.querySelector('.arrow');
let currentSongIndex;
let audioPlayer = new Audio();
let clickAudio = new Audio();
let PLAY = document.querySelector('#play');
const folderPicker = document.getElementById("folderPicker");
let songList = document.querySelector(".songList");
let menuList = document.querySelector('.menuList');
let SongNameApear = document.querySelector('.SongList');
let songs = [];
let masterPlay = document.querySelector(".playIcon");
let change = document.querySelector('#decrease');
let zoom = document.querySelector('.circular-image-wrapper');
let heart = document.querySelector('#heart');
let NAME = document.querySelector('#Playlist');
let search = document.querySelector('#search');
let plus = document.querySelector('#add');
let songInforMation = document.querySelector('.menuContainer');
let close=document.querySelector('#close');
let icon = 1;

// Heart icon click event
heart.addEventListener('click', () => {
  if (icon == 1) {
    icon = 2;
    heart.classList.add('fa-solid');
    heart.classList.remove('fa-regular');
    heart.style.color = 'red';
    alert('Thank you for liking it');
  } else {
    icon = 1;
    heart.classList.remove('fa-solid');
    heart.classList.add('fa-regular');
    heart.style.color = '#405956';
  }
  console.log(icon);
});

// Desktop: Folder Selection
arrow.addEventListener("click", async () => {
  clickAudio.src = 'ui-click-43196.mp3';
  clickAudio.play();
  if (!window.showDirectoryPicker) {
    alert("Your browser does not support folder access.");
    return;
  }
  try {
    const dirHandle = await window.showDirectoryPicker();
    loadSongsFromFolder(dirHandle);
  } catch (error) {
    console.error("Error accessing folder: ", error);
  }
});

// Search functionality
search.addEventListener('click', () => {
  search.style.display = 'none';
  let searchbar = document.createElement('input');
  searchbar.className = 'Find';
  searchbar.type = 'search';
  searchbar.placeholder = 'Search Songs';
  plus.prepend(searchbar);

  searchbar.addEventListener('input', () => {
    let query = searchbar.value.toLowerCase();
    document.querySelectorAll('.songDetail1').forEach((songDetail) => {
      let songName = songDetail.querySelector('.songName').textContent.toLowerCase();
      if (songName.includes(query)) {
        songDetail.style.display = 'flex';
      } else {
        songDetail.style.display = 'none';
      }
    });
  });
  close.addEventListener('click',()=>{
    searchbar.style.display='none';
    search.style.display='block';
  })
});

async function loadSongsFromFolder(dirHandle) {
  songs = [];
  songList.innerHTML = "";
  for await (const entry of dirHandle.values()) {
    if (entry.kind === "file" && (entry.name.toLowerCase().endsWith(".mp3") ||
      entry.name.toLowerCase().endsWith(".m4a") ||
      entry.name.toLowerCase().endsWith(".wav") ||
      entry.name.toLowerCase().endsWith(".flac"))) {
      let index = songs.length;
      songs.push(entry);
      let songDetail = document.createElement("div");
      let songDetail1 = document.createElement('div');
      let image = document.createElement("img");
      let image1 = document.createElement('img');
      let nameList = document.createElement("span");
      let nameList1 = document.createElement("span");
      image.className = 'im';
      image1.className = 'im';
      nameList.className = 'songName';
      nameList1.className = 'songName';
      nameList1.id = 'music';
      songDetail.className = 'songDetail';
      songDetail1.className = 'songDetail1';

      nameList.textContent = entry.name;
      nameList1.textContent = entry.name;
      image.src = 'music.webp';
      image1.src = 'music.webp';
      songList.prepend(songDetail);
      menuList.prepend(songDetail1);
      songDetail.prepend(nameList);
      songDetail1.prepend(nameList1);
      songDetail.prepend(image);
      songDetail1.prepend(image1);
      nameList.onclick = () => playSong(index);
      nameList1.onclick = () => playSong(index);
    }
  }
  if (songs.length > 0) {
    playSong(0);
  }

  // Print all song names in the console
  console.log("Songs fetched from folder:");
  songs.forEach((song, index) => {
    console.log(`${index + 1}. ${song.name}`);
  });
}

async function playSong(index) {
  currentSongIndex = index;
  const file = songs[index];
  console.log(file);
  if (file) {
    if (file.getFile) {
      const fileData = await file.getFile();
      audioPlayer.src = URL.createObjectURL(fileData);
    } else {
      audioPlayer.src = URL.createObjectURL(file);
    }
    audioPlayer.play();
    zoom.classList.remove('out');
    PLAY.classList.add("fa-pause");
    PLAY.classList.remove("fa-play");
    PLAY.style.margin = '0';
    console.log(currentSongIndex);
    SongNameApear.innerText = songs[currentSongIndex].name;
  }
}

// Master play button functionality
masterPlay.addEventListener("click", () => {
  clickAudio.src = 'ui-click-43196.mp3';
  clickAudio.play();
  if (!currentSongIndex && currentSongIndex != 0) {
    console.log(currentSongIndex);
    return alert("Click on < >");
  }
  if (audioPlayer.paused || audioPlayer.currentTime <= 0) {
    audioPlayer.play();
    PLAY.classList.add("fa-pause");
    PLAY.classList.remove("fa-play");
    PLAY.style.margin = '0';
    zoom.classList.remove('out');
  } else {
    audioPlayer.pause();
    PLAY.classList.add("fa-play");
    PLAY.classList.remove("fa-pause");
    PLAY.style.marginLeft = '8%';
    zoom.classList.add('out');
  }
});

// Update progress bar
let Progress = document.querySelector(".progress");
audioPlayer.addEventListener('timeupdate', () => {
  let progress = audioPlayer.currentTime / audioPlayer.duration * 100;
  Progress.value = progress;
  let songduration = document.querySelector(".songduration");
  let songcurrentTime = document.querySelector(".songcurrentTime");
  let songCurrent = Math.ceil(audioPlayer.currentTime);
  let songDuration = Math.ceil(audioPlayer.duration);
  let minite = Math.floor(songDuration / 60);
  let second = songDuration % 60;
  let cMinite = Math.floor(songCurrent / 60);
  let cSecond = songCurrent % 60;
  let lMinite = minite - cMinite;
  let lSecond = second - cSecond;
  songcurrentTime.innerText = `${String(cMinite).padStart(2, '0')}:${String(cSecond).padStart(2, '0')}`;
  songduration.innerText = `${String(lMinite).padStart(2, '0')}:${String(lSecond).padStart(2, '0')}`;

  if (audioPlayer.ended) {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(currentSongIndex);
  }
});
const ZoomOut = () => { zoom.classList.add('zoom'); zoom.classList.remove('minus'); setInterval(() => { zoom.classList.remove('.minus'); zoom.classList.add('minus'); }, 100); }
// Progress bar click event
Progress.addEventListener("click", () => {
  Progress.style.cursor = 'pointer';
  audioPlayer.currentTime = Progress.value * audioPlayer.duration / 100;
});

Progress.addEventListener("touchend", () => {
  Progress.style.cursor = 'pointer';
  audioPlayer.currentTime = Progress.value * audioPlayer.duration / 100;
});

// Previous button functionality
let previusButton = document.querySelector("#previous");
previusButton.addEventListener("click", () => {
  ZoomOut();
  clickAudio.src = 'ui-click-43196.mp3';
  clickAudio.play();
  if (currentSongIndex < 2) {
    currentSongIndex = songs.length - 1;
  } else {
    currentSongIndex -= 1;
  }
  playSong(currentSongIndex);
});

// Next button functionality
let nextButton = document.querySelector("#next");
nextButton.addEventListener("click", () => {
  ZoomOut();
  clickAudio.src = 'ui-click-43196.mp3';
  clickAudio.play();
  if (currentSongIndex >= songs.length - 1) {
    currentSongIndex = 0;
  } else {
    currentSongIndex += 1;
  }
  playSong(currentSongIndex);
});

// Menu toggle functionality
let menuContainer = document.querySelector('.menuContainer');
let openmenu = document.querySelector('.openmenu');
let closemenu = document.querySelector('.closemenu');
openmenu.addEventListener('click', () => {
  clickAudio.src = 'ui-click-43196.mp3';
  clickAudio.play();
  menuContainer.classList.add('unhide');
  menuContainer.classList.remove('hide');
});
closemenu.addEventListener('click', () => {
  menuContainer.classList.add('hide');
  menuContainer.classList.remove('unhide');
});

// Play button functionality
let playdate = document.querySelectorAll(".play");
playdate.forEach((p) => {
  p.addEventListener('click', () => {
    alert('404 songs not found');
  });
});

// Mute button functionality
let Mute = document.querySelector(".Mute");
let mute = 0;
Mute.addEventListener("click", () => {
  if (mute == 1) {
    mute = 0;
    Mute.classList.add("fa-volume-high");
    Mute.classList.remove("fa-volume-off");
  } else {
    mute = 1;
    Mute.classList.add("fa-volume-off");
    Mute.classList.remove("fa-volume-high");
  }
  audioPlayer.muted = !audioPlayer.muted;
});

// Volume control functionality
let inc = document.querySelector('#increase');
let increase = 'on';
change.addEventListener('click', () => {
  if (increase == 'on') {
    increase = 'off';
    inc.style.display = 'block';
  } else {
    increase = 'on';
    inc.style.display = 'none';
  }
});
inc.addEventListener('change', () => {
  audioPlayer.volume = inc.value / 100;
  let val = inc.value / 100;
  if (val == 0) {
    change.classList.remove('fa-volume-low');
    change.classList.remove('fa-volume-high');
    change.classList.add('fa-volume-xmark');
  } else if (val > 0 && val <= 0.50) {
    change.classList.remove('fa-volume-high');
    change.classList.remove('fa-volume-xmark');
    change.classList.add('fa-volume-low');
  } else if (val > 0.51 && val <= 1) {
    change.classList.remove('fa-volume-off');
    change.classList.remove('fa-volume-xmark');
    change.classList.add('fa-volume-high');
  }
});

// Change profile picture functionality
let pic = document.querySelector("#small");
pic.addEventListener("click", async () => {
  try {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: "Image Files",
          accept: {
            "image/*": [".png", ".gif", ".jpeg", ".jpg", ".webp"]
          }
        }
      ],
      multiple: false
    });
    const file = await fileHandle.getFile();
    const url = URL.createObjectURL(file);
    pic.src = url;
  } catch (error) {
    console.error("Error selecting file: ", error);
  }
});
