const audio = new Audio();
const progress = document.getElementById('progress');
const miniPlayer = document.getElementById('mini-player');
const fullPlayer = document.getElementById('full-player');
let currentDownloadUrl = "";

// 1. Load Trending (Quick Picks)
window.onload = () => {
    fetch(`https://itunes.apple.com/search?term=trending&entity=song&limit=10`)
    .then(res => res.json()).then(data => {
        const grid = document.getElementById('quick-picks-grid');
        data.results.forEach(song => {
            const img = song.artworkUrl100.replace('100x100bb', '600x600bb');
            const card = document.createElement('div');
            card.className = 'quick-pick-card';
            card.innerHTML = `<img src="${img}"><b>${song.trackName}</b>`;
            card.onclick = () => getFullSong(song.trackName + " " + song.artistName, img);
            grid.appendChild(card);
        });
    });
};

// 2. Search & Play Full Song
async function getFullSong(query, img) {
    document.getElementById('m-title').innerText = "Loading Full Track...";
    try {
        const res = await fetch(`https://inv.tux.rs/api/v1/search?q=${encodeURIComponent(query)}`);
        const results = await res.json();
        const videoId = results[0].videoId;
        currentDownloadUrl = `https://inv.tux.rs/latest_version?id=${videoId}&itag=140`;
        
        updateUI(results[0].title, results[0].author, img, currentDownloadUrl);
    } catch(e) { console.error("Server busy"); }
}

function updateUI(t, a, i, u) {
    document.getElementById('m-title').innerText = t;
    document.getElementById('m-artist').innerText = a;
    document.getElementById('m-img').src = i;
    document.getElementById('f-img').src = i;
    document.getElementById('f-title').innerText = t;
    document.getElementById('f-artist').innerText = a;
    audio.src = u;
    audio.play();
}

// 3. Slider Control
audio.ontimeupdate = () => {
    if(audio.duration) {
        progress.value = (audio.currentTime / audio.duration) * 100;
        document.getElementById('current-time').innerText = formatTime(audio.currentTime);
        document.getElementById('duration').innerText = "-" + formatTime(audio.duration - audio.currentTime);
    }
};

progress.oninput = () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
};

// 4. Download & Player Animation
document.getElementById('dl-btn').onclick = () => window.open(currentDownloadUrl, '_blank');
miniPlayer.onclick = (e) => { if(e.target.id !== 'm-play-btn') fullPlayer.classList.add('active'); };
document.getElementById('close-player').onclick = () => fullPlayer.classList.remove('active');

function formatTime(s) {
    const m = Math.floor(s/60); const sec = Math.floor(s%60);
    return `${m}:${sec < 10 ? '0'+sec : sec}`;
}
