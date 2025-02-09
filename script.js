let arr = [];
let currentSongIndex;
let audioPlayer = new Audio();
const folderPicker = document.getElementById("folderPicker");
let songList = document.querySelector(".songList");
let menuList = document.querySelector('.menuList');
let SongNameApear = document.querySelector('.SongList');
let songs = [];
let masterPlay = document.querySelector(".playIcon");
let change = document.querySelector('#decrease');

let NAME = document.querySelector('#Playlist');
// Desktop: Folder Selection
folderPicker.addEventListener("click", async () => {
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
let arrow = document.querySelector('.arrow')

arrow.addEventListener('click', () => {
  folderPicker.style.display = 'block';
})

folderPicker.addEventListener('click', () => {
  folderPicker.style.display = 'none';
})
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
      let listItem = document.createElement("li");
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
      songDetail.className = 'songDetail';
      songDetail1.className = 'songDetail1';
      nameList.textContent = entry.name;
      nameList1.textContent = entry.name;
      image.src = 'music.webp';
      image1.src = 'music.webp';
      // songList.appendChild(listItem);
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
}

async function playSong(index, item) {
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
    masterPlay.classList.add("fa-circle-pause");
    masterPlay.classList.remove("fa-circle-play");
    console.log(currentSongIndex);
    SongNameApear.innerText = songs[currentSongIndex].name;
  }
}

let master = () => {
  masterPlay.addEventListener("click", (e) => {
    if (!currentSongIndex && currentSongIndex != 0) {
      console.log(currentSongIndex);
      return alert("Click on < >");
    }
    if (audioPlayer.paused || audioPlayer.currentTime <= 0) {
      audioPlayer.play();
      masterPlay.classList.add("fa-circle-pause");
      masterPlay.classList.remove("fa-circle-play");
      // gif.style.width = "70px"
      // gif.style.height = "35px";
      console.log(currentSongIndex);
      // smallimg.src = songs[currentSongIndex].imagePath;
    }
    else {
      audioPlayer.pause();
      masterPlay.classList.add("fa-circle-play");
      masterPlay.classList.remove("fa-circle-pause");

      // gif.style.width = "0px";
      // gif.style.height = "0px";
    }

  });
  return 'start';
}
console.log(master());
let Progress = document.querySelector(".progress");
audioPlayer.addEventListener('timeupdate', () => {
  let progress = audioPlayer.currentTime / audioPlayer.duration * 100;
  Progress.value = progress;
  //   console.log(progress);
  let songduration = document.querySelector(".songduration");
  let songcurrentTime = document.querySelector(".songcurrentTime");
  let songCurrent = Math.ceil(audioPlayer.currentTime);
  let songDuration = Math.ceil(audioPlayer.duration);
  let minite = Math.floor(songDuration / 60);
  let second = songDuration % 60
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
Progress.addEventListener("click", () => {
  Progress.style.cursor = 'pointer';
  audioPlayer.currentTime = Progress.value * audioPlayer.duration / 100;
});

Progress.addEventListener("touchend", () => {
  Progress.style.cursor = 'pointer';
  audioPlayer.currentTime = Progress.value * audioPlayer.duration / 100;
});

let previusButton = document.querySelector("#previous");
previusButton.addEventListener("click", () => {
  console.log('hi');
  if (currentSongIndex < 2) {
    currentSongIndex = songs.length - 1;
  }
  else {
    currentSongIndex -= 1;
  }
  console.log(currentSongIndex);
  playSong(currentSongIndex);
});

let nextButton = document.querySelector("#next");
nextButton.addEventListener("click", () => {
  console.log('hi');
  if (currentSongIndex >= songs.length - 1) {
    currentSongIndex = 0;
  }
  else {
    currentSongIndex += 1;
  }
  console.log(currentSongIndex);
  playSong(currentSongIndex);

})


// menu toggle
let menuContainer = document.querySelector('.menuContainer');
let openmenu = document.querySelector('.openmenu');
let closemenu = document.querySelector('.closemenu');
openmenu.addEventListener('click', () => {
  menuContainer.classList.add('unhide');
  menuContainer.classList.remove('hide');
});
closemenu.addEventListener('click', () => {
  menuContainer.classList.add('hide');
  menuContainer.classList.remove('unhide');
});

let playdate = document.querySelectorAll(".play");
playdate.forEach((p) => {
  p.addEventListener('click', () => {
    alert('404 songs not found');
  })
});
let Mute = document.querySelector(".Mute");
let mute = 0;
Mute.addEventListener("click", () => {
  if (mute == 1) {
    mute = 0;
    Mute.classList.add("fa-volume-high");
    Mute.classList.remove("fa-volume-off");
  }
  else {
    mute = 1;
    Mute.classList.add("fa-volume-off");
    Mute.classList.remove("fa-volume-high");
  }
  audioPlayer.muted = !audioPlayer.muted;
});

let inc = document.querySelector('#increase');
let increase = 'on'
change.addEventListener('click', () => {
  if (increase == 'on') {
    increase = 'of';
    inc.style.display = 'block';
  }
  else {
    increase = 'on';
    inc.style.display = 'none';
  }

})
inc.addEventListener('change', () => {
  audioPlayer.volume = inc.value / 100;
  let val = inc.value / 100;
  console.log(val);
  if (val == 0) {
    change.classList.remove('fa-volume-low');
    change.classList.remove('fa-volume-high')
    change.classList.add('fa-volume-xmark');
  }
  else if (val > 0 && val <= 0.50) {
    change.classList.remove('fa-volume-high')
    change.classList.remove('fa-volume-xmark');
    change.classList.add('fa-volume-low');
  }
  else if (val > 0.51 && val <= 1) {
    change.classList.remove('fa-volume-off');
    change.classList.remove('fa-volume-xmark');
    change.classList.add('fa-volume-high')
  }
});
