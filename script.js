const colorThief = new ColorThief();

// 1. Initialize Deezer Player
DZ.init({
    appId: '524322', // Standard Public App ID
    channelUrl: window.location.href,
    player: { onload: () => console.log('Deezer Player Ready') }
});

// 2. Search Deezer
function handleSearch() {
    const query = document.getElementById('search').value;
    DZ.api('/search?q=' + encodeURIComponent(query), (res) => {
        const grid = document.getElementById('quick-picks-grid');
        grid.innerHTML = "";
        res.data.forEach(track => {
            const card = document.createElement('div');
            card.className = 'quick-pick-card';
            card.innerHTML = `<img src="${track.album.cover_big}"><b>${track.title}</b>`;
            card.onclick = () => playSong(track);
            grid.appendChild(card);
        });
    });
}

// 3. Playback & Dynamic Background
function playSong(track) {
    const fImg = document.getElementById('f-img');
    fImg.src = track.album.cover_big;
    
    // Update Meta
    document.getElementById('m-title').innerText = track.title;
    document.getElementById('m-img').src = track.album.cover_medium;
    document.getElementById('f-title').innerText = track.title;
    document.getElementById('f-artist').innerText = track.artist.name;

    // Color Extraction for Dynamic Background
    fImg.addEventListener('load', function() {
        const color = colorThief.getColor(fImg);
        const rgb = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        document.getElementById('dynamic-bg').style.background = `linear-gradient(to bottom, ${rgb}, #000)`;
    });

    DZ.player.playTracks([track.id]);
    updateIcons(false);
}

// UI Controls
document.getElementById('mini-player').onclick = (e) => {
    if (e.target.id !== 'm-play-btn') document.getElementById('full-player').classList.add('active');
};
document.getElementById('close-player').onclick = () => document.getElementById('full-player').classList.remove('active');

function updateIcons(isPaused) {
    const icon = isPaused ? "fas fa-play" : "fas fa-pause";
    document.getElementById('m-play-btn').className = icon;
    document.getElementById('f-play-btn').className = icon;
}

// Sync Scrubber with Deezer
DZ.Event.subscribe('player_position', (arg) => {
    document.getElementById('progress').value = (arg[0] / arg[1]) * 100;
});
