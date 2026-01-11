// Global Variables
const widgetIframe = document.getElementById('sc-player');
const widget = SC.Widget(widgetIframe);

const miniPlayer = document.getElementById('mini-player');
const fullPlayer = document.getElementById('full-player');
const playBtn = document.getElementById('m-play-btn');
const progress = document.getElementById('progress');

// 1. OPEN FULL PLAYER WHEN CLICKING BOTTOM BAR
// This fixes the "nothing happens" issue
miniPlayer.addEventListener('click', (e) => {
    // Only open if you didn't click the tiny play button itself
    if (e.target.id !== 'm-play-btn') {
        fullPlayer.classList.add('active');
        console.log("Opening full player...");
    }
});

// Close player logic
document.getElementById('close-player').onclick = () => {
    fullPlayer.classList.remove('active');
};

// 2. Play Music via SoundCloud
function playSong(title, artist, img) {
    // Update UI
    document.getElementById('m-title').innerText = title;
    document.getElementById('m-artist').innerText = artist;
    document.getElementById('m-img').src = img;
    document.getElementById('f-img').src = img;
    document.getElementById('f-title').innerText = title;
    document.getElementById('f-artist').innerText = artist;

    // Direct Search and Load
    const query = `${artist} ${title}`;
    console.log("Searching SoundCloud for: " + query);
    
    // Using the official load method
    widget.load(`https://api.soundcloud.com/tracks?q=${encodeURIComponent(query)}`, {
        auto_play: true,
        show_artwork: false,
        callback: () => {
            console.log("Music loaded successfully!");
            playBtn.className = "fas fa-pause";
        }
    });
}

// 3. Sync Music Slider
widget.bind(SC.Widget.Events.PLAY_PROGRESS, (data) => {
    // Update slider position
    progress.value = data.relativePosition * 100;
    
    // Update timestamps
    const cur = Math.floor(data.currentPosition / 1000);
    document.getElementById('current-time').innerText = formatTime(cur);
});

// Sync duration when ready
widget.bind(SC.Widget.Events.READY, () => {
    widget.getDuration((dur) => {
        document.getElementById('duration').innerText = "-" + formatTime(dur / 1000);
    });
});

// Seek when dragging slider
progress.oninput = () => {
    widget.getDuration((dur) => {
        widget.seekTo((progress.value / 100) * dur);
    });
};

// 4. Play/Pause Button Logic
playBtn.onclick = (e) => {
    e.stopPropagation(); // Stop from opening the full player
    widget.toggle();
    widget.isPaused((paused) => {
        playBtn.className = paused ? "fas fa-play" : "fas fa-pause";
    });
};

// 5. Search & Trending (Standard iTunes API)
function handleSearch() {
    const query = document.getElementById('search').value;
    if(!query) return;
    
    fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=15`)
    .then(res => res.json()).then(data => {
        const grid = document.getElementById('quick-picks-grid');
        grid.innerHTML = "";
        data.results.forEach(song => {
            const img = song.artworkUrl100.replace('100x100bb', '600x600bb');
            const card = document.createElement('div');
            card.className = 'quick-pick-card';
            card.innerHTML = `<img src="${img}"><b>${song.trackName}</b>`;
            card.onclick = () => playSong(song.trackName, song.artistName, img);
            grid.appendChild(card);
        });
    });
}

function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' + sec : sec}`;
}
