// Select all required tags or elements
const wrapper = document.querySelector(".wrapper"),
    musicImg = wrapper.querySelector(".img-area img"),
    musicName = wrapper.querySelector(".song-details .name"),
    musicArtist = wrapper.querySelector(".song-details .artist"),
    musicAudio = wrapper.querySelector("#main-audio"),
    playPauseBtn = wrapper.querySelector(".play-pause"),
    prevBtn = wrapper.querySelector("#prev"),
    nextBtn = wrapper.querySelector("#next"),
    progressBar = wrapper.querySelector(".progress-bar"),
    progressArea = wrapper.querySelector(".progress-area"),
    moreMusicOp = wrapper.querySelector("#more-music"),
    closeMusicList = wrapper.querySelector("#close");

let musicIndex = 1;
let i = false;

window.addEventListener("load", () => {
    loadMusic(musicIndex); // Calling load music function once window loaded
    playNow();
});

// prev Music function
prevMusic = () => {
    musicIndex--;
    if (musicIndex < 1)
        musicIndex = allMusic.length;
    loadMusic(musicIndex);
    playMusic();
}

// next Music function
function nextMusic() {
    musicIndex++;
    if (musicIndex > allMusic.length)
        musicIndex = 1;
    loadMusic(musicIndex);
    playMusic();
}

// Load Music Function
loadMusic = (indexNum) => {
    musicName.innerText = allMusic[indexNum - 1].name;
    musicArtist.innerText = allMusic[indexNum - 1].artist;
    musicImg.src = `IMG/${allMusic[indexNum-1].img}.jfif`;
    musicAudio.src = `MUSIC/${allMusic[indexNum-1].src}.mp3`;
}

// play music function
playMusic = () => {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    musicAudio.play();
}

// pause music function
pauseMusic = () => {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    musicAudio.pause();
}

// play or pause music button event
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
});

// if press space bar, play or pause the music
document.addEventListener('keypress', (event) => {
    var name = event.key;
    // Alert the key name and key code on keydown
    if (name == " " && !i) {
        playMusic();
        i = true;
    } else {
        pauseMusic();
        i = false;
    }

}, false);

// if press j or l, prev music or next music play
document.addEventListener('keypress', (event) => {
    var name = event.key;
    if (name == "l") {
        nextMusic();
    } else if (name == "j") {
        prevMusic();
    }
}, false);

// change into next song
nextBtn.addEventListener("click", () => {
    nextMusic();
});

// change into previous song
prevBtn.addEventListener("click", () => {
    prevMusic();
});

// update progress bar with the according to the music's current time
musicAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime; // getting the current time of the song
    const duration = e.target.duration; // getting the duration of the song
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
        musicDuration = wrapper.querySelector(".duration");
    musicAudio.addEventListener("loadeddata", () => {

        // updating total duration of song
        let audioDuation = musicAudio.duration;
        let totalMin = Math.floor(audioDuation / 60)
        let totalSec = Math.floor(audioDuation % 60);
        if (totalSec < 10)
            totalSec = `0${totalSec}`
        musicDuration.innerText = `${totalMin}:${totalSec}`;

    });
    // updating playing song of current time
    let currentMin = Math.floor(currentTime / 60)
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10)
        currentSec = `0${currentSec}`
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// update playing song current time according to the progress bar width
progressArea.addEventListener("click", (e) => {
    let progressWidthVal = progressArea.clientWidth; // getting width of progress bar
    let clickedOfSetX = e.offsetX; // getting offset x value
    let songDuration = musicAudio.duration; // getting total duration of the song

    musicAudio.currentTime = (clickedOfSetX / progressWidthVal) * songDuration;
    playMusic();
});

// lets's work on repeat, shuffle song according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffle");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }
});

// work on what to do after the song ended
musicAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            musicAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while (musicIndex == randIndex);
            musicIndex = randIndex;
            loadMusic(musicIndex);
            playMusic();
            break;
    }
});

let moreMusiList = wrapper.querySelector(".music-list");

// work on more music list
moreMusicOp.addEventListener("click", () => {
    moreMusiList.classList.toggle("show");
});

// close the music list
closeMusicList.addEventListener("click", () => {
    moreMusicOp.click();
});

// lets create li according to the array length
const ulTag = wrapper.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i+1}">
                    <div class="row">
                        <span>${allMusic[i].name}.</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="MUSIC/${allMusic[i].src}.mp3" ></audio>
                    <span id="${allMusic[i].src}" class="audio-duration"></span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", () => {
        // updating total duration of song
        let audioDuation = liAudioTag.duration;
        let totalMin = Math.floor(audioDuation / 60)
        let totalSec = Math.floor(audioDuation % 60);
        if (totalSec < 10)
            totalSec = `0${totalSec}`
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}

// let's work on play particular song on click
const allLiTags = ulTag.querySelectorAll("li");

playNow = () => {
    for(let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            let videoDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = videoDuration;
        }

        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}

// let work on playing the song clicked on list
clicked = (element) => {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playNow();
}