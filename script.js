const widgetIframe = document.getElementById('sc-player');
const widget = SC.Widget(widgetIframe);
const progress = document.getElementById('progress');
const miniPlayer = document.getElementById('mini-player');
const fullPlayer = document.getElementById('full-player');

// 1. Search Logic (Reliable Search)
function handleSearch() {
    const query = document.getElementById('search').value;
    const grid = document.getElementById('quick-picks-grid');
    if(!query) return;

    grid.innerHTML = "<div style='color:white; padding:20px;'>Searching SoundCloud...</div>";

    // We use iTunes to find the clean "Official" metadata first
    fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=15`)
    .then(res => res.json()).then(data => {
        grid.innerHTML = "";
        data.results.forEach(song => {
            const img = song.artworkUrl100.replace('100x100bb', '600x600bb');
            const card = document.createElement('div');
            card.className = 'quick-pick-card';
            card.innerHTML = `<img src="${img}"><b>${song.trackName}</b><br><small>${song.artistName}</small>`;
            
            // When clicked, we tell SoundCloud to find and play this song
            card.onclick = () => playOnSoundCloud(song.trackName, song.artistName, img);
            grid.appendChild(card);
        });
    });
}

// 2. SoundCloud Playback Logic
function playOnSoundCloud(title, artist, img) {
    // Update UI elements
    document.getElementById('m-title').innerText = title;
    document.getElementById('m-artist').innerText = artist;
    document.getElementById('m-img').src = img;
    document.getElementById('f-img').src = img;
    document.getElementById('f-title').innerText = title;
    document.getElementById('f-artist').innerText = artist;

    // Use SoundCloud's "Search and Play" 
    // We search for the song title and artist on SoundCloud
    const searchQuery = `${artist} - ${title}`;
    
    // This part tells the hidden SoundCloud player to find the track
    // Since SC doesn't have a direct "search-to-play" URL, we use a proxy or fallback
    // For a 100% free solution, we use the SoundCloud widget 'load' command
    widget.load(`https://api.soundcloud.com/tracks?q=${encodeURIComponent(searchQuery)}`, {
        auto_play: true,
        show_artwork: false
    });

    document.getElementById('m-play-btn').className = "fas fa-pause";
}

// 3. Music Slider & Progress (SoundCloud API)
widget.bind(SC.Widget.Events.PLAY_PROGRESS, (data) => {
    const total = data.relativePosition * 100;
    progress.value = total;
    
    // Calculate and show time
    const currentSeconds = data.currentPosition / 1000;
    document.getElementById('current-time').innerText = formatTime(currentSeconds);
});

// Seek Functionality
progress.oninput = () => {
    widget.getDuration((duration) => {
        const seekTo = (progress.value / 100) * duration;
        widget.seekTo(seekTo);
    });
};

// 4. Interface Controls
miniPlayer.onclick = (e) => { 
    if(e.target.id !== 'm-play-btn') fullPlayer.classList.add('active'); 
};
document.getElementById('close-player').onclick = () => fullPlayer.classList.remove('active');

function formatTime(s) {
    const m = Math.floor(s/60); const sec = Math.floor(s%60);
    return `${m}:${sec < 10 ? '0'+sec : sec}`;
}
