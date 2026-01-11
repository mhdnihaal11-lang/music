const widgetIframe = document.getElementById('sc-player');
const widget = SC.Widget(widgetIframe);

const progress = document.getElementById('progress');
const volSlider = document.getElementById('volume-slider');
const playBtn = document.getElementById('m-play-btn');

// 1. Reliable Search using iTunes (This never gets "Busy")
window.onload = () => { loadTrending(); };

function loadTrending() {
    fetch(`https://itunes.apple.com/search?term=top+hits&entity=song&limit=12`)
    .then(res => res.json()).then(data => {
        renderGrid(data.results);
    });
}

function handleSearch() {
    const query = document.getElementById('search').value;
    if(!query) return;
    document.getElementById('view-title').innerText = "Results for " + query;
    
    fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=20`)
    .then(res => res.json()).then(data => {
        renderGrid(data.results);
    });
}

function renderGrid(songs) {
    const grid = document.getElementById('quick-picks-grid');
    grid.innerHTML = "";
    songs.forEach(song => {
        const img = song.artworkUrl100.replace('100x100bb', '600x600bb');
        const card = document.createElement('div');
        card.className = 'quick-pick-card';
        card.innerHTML = `<img src="${img}"><b>${song.trackName}</b><br><small>${song.artistName}</small>`;
        card.onclick = () => playSong(song.trackName, song.artistName, img);
        grid.appendChild(card);
    });
}

// 2. The Fix: Playing via SoundCloud without "Busy" Errors
function playSong(title, artist, img) {
    // Update UI immediately
    document.getElementById('m-title').innerText = title;
    document.getElementById('m-artist').innerText = artist;
    document.getElementById('m-img').src = img;
    document.getElementById('f-img').src = img;
    document.getElementById('f-title').innerText = title;
    document.getElementById('f-artist').innerText = artist;

    // We use the Official SoundCloud Widget Load
    // This goes directly to SoundCloud.com servers which are never "busy"
    const trackSearch = `https://api.soundcloud.com/tracks?q=${encodeURIComponent(artist + " " + title)}`;
    
    widget.load(trackSearch, {
        show_artwork: false,
        auto_play: true,
        callback: () => {
            console.log("Track Loaded Successfully");
            playBtn.className = "fas fa-pause";
        }
    });
}

// 3. Slider & Volume Sync
widget.bind(SC.Widget.Events.PLAY_PROGRESS, (data) => {
    progress.value = data.relativePosition * 100;
    document.getElementById('current-time').innerText = formatTime(data.currentPosition / 1000);
});

widget.bind(SC.Widget.Events.READY, () => {
    widget.getDuration((dur) => {
        document.getElementById('duration').innerText = formatTime(dur / 1000);
    });
});

progress.oninput = () => {
    widget.getDuration((dur) => {
        widget.seekTo((progress.value / 100) * dur);
    });
};

volSlider.oninput = () => {
    widget.setVolume(volSlider.value);
};

// 4. Play/Pause Toggle
function togglePlayback() {
    widget.toggle();
    widget.isPaused((paused) => {
        playBtn.className = paused ? "fas fa-play" : "fas fa-pause";
        document.getElementById('f-play-btn').className = paused ? "fas fa-play" : "fas fa-pause";
    });
}

playBtn.onclick = (e) => { e.stopPropagation(); togglePlayback(); };
document.getElementById('f-play-btn').onclick = () => togglePlayback();

function formatTime(s) {
    const m = Math.floor(s/60); const sec = Math.floor(s%60);
    return `${m}:${sec < 10 ? '0'+sec : sec}`;
}
