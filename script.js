// Initialize SoundCloud Widget
const widgetIframe = document.getElementById('sc-player');
const widget = SC.Widget(widgetIframe);

const progress = document.getElementById('progress');
const volSlider = document.getElementById('volume-slider');
const miniPlayer = document.getElementById('mini-player');
const fullPlayer = document.getElementById('full-player');
const playBtn = document.getElementById('m-play-btn');

// 1. Load Trending (Quick Picks) on Start
window.onload = () => {
    fetch(`https://itunes.apple.com/search?term=trending&entity=song&limit=12`)
    .then(res => res.json()).then(data => {
        const grid = document.getElementById('quick-picks-grid');
        grid.innerHTML = "";
        data.results.forEach(song => {
            const img = song.artworkUrl100.replace('100x100bb', '600x600bb');
            const card = document.createElement('div');
            card.className = 'quick-pick-card';
            card.innerHTML = `<img src="${img}"><b>${song.trackName}</b><br><small>${song.artistName}</small>`;
            card.onclick = () => playSong(song.trackName, song.artistName, img);
            grid.appendChild(card);
        });
    });
};

// 2. Search Logic
function handleSearch() {
    const query = document.getElementById('search').value;
    const grid = document.getElementById('quick-picks-grid');
    if(!query) return;

    grid.innerHTML = "<div style='color:white;'>Searching SoundCloud...</div>";
    fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=20`)
    .then(res => res.json()).then(data => {
        grid.innerHTML = "";
        data.results.forEach(song => {
            const img = song.artworkUrl100.replace('100x100bb', '600x600bb');
            const card = document.createElement('div');
            card.className = 'quick-pick-card';
            card.innerHTML = `<img src="${img}"><b>${song.trackName}</b><br><small>${song.artistName}</small>`;
            card.onclick = () => playSong(song.trackName, song.artistName, img);
            grid.appendChild(card);
        });
    });
}

// 3. Play via SoundCloud
function playSong(title, artist, img) {
    document.getElementById('m-title').innerText = title;
    document.getElementById('m-artist').innerText = artist;
    document.getElementById('m-img').src = img;
    document.getElementById('f-img').src = img;
    document.getElementById('f-title').innerText = title;
    document.getElementById('f-artist').innerText = artist;

    const searchQuery = `${artist} ${title}`;
    
    // Loads the full song from SoundCloud
    widget.load(`https://api.soundcloud.com/tracks?q=${encodeURIComponent(searchQuery)}`, {
        auto_play: true,
        show_artwork: false
    });

    playBtn.className = "fas fa-pause";
}

// 4. Progress & Volume Logic
widget.bind(SC.Widget.Events.PLAY_PROGRESS, (data) => {
    progress.value = data.relativePosition * 100;
    document.getElementById('current-time').innerText = formatTime(data.currentPosition / 1000);
});

// Sync Duration
widget.bind(SC.Widget.Events.READY, () => {
    widget.getDuration((dur) => {
        document.getElementById('duration').innerText = formatTime(dur / 1000);
    });
});

// Seek Function
progress.oninput = () => {
    widget.getDuration((dur) => {
        widget.seekTo((progress.value / 100) * dur);
    });
};

// VOLUME CONTROL Logic
volSlider.oninput = () => {
    // SoundCloud uses a 0-100 scale
    widget.setVolume(volSlider.value);
};

// 5. Controls
playBtn.onclick = (e) => {
    e.stopPropagation();
    widget.toggle();
    widget.isPaused((paused) => {
        playBtn.className = paused ? "fas fa-play" : "fas fa-pause";
    });
};

miniPlayer.onclick = (e) => {
    if(e.target.id !== 'm-play-btn') fullPlayer.classList.add('active');
};
document.getElementById('close-player').onclick = () => fullPlayer.classList.remove('active');

function formatTime(s) {
    const m = Math.floor(s/60); const sec = Math.floor(s%60);
    return `${m}:${sec < 10 ? '0'+sec : sec}`;
}
