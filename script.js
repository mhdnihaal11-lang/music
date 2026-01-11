const audio = new Audio();
const progress = document.getElementById('progress');
const miniPlayer = document.getElementById('mini-player');
const fullPlayer = document.getElementById('full-player');
let currentDownloadUrl = "";

// 1. Load Trending (Quick Picks) - Using iTunes for reliability
window.onload = () => {
    fetch(`https://itunes.apple.com/search?term=trending&entity=song&limit=12`)
    .then(res => res.json()).then(data => {
        const grid = document.getElementById('quick-picks-grid');
        grid.innerHTML = ""; // Clear loader
        data.results.forEach(song => {
            const img = song.artworkUrl100.replace('100x100bb', '600x600bb');
            const card = document.createElement('div');
            card.className = 'quick-pick-card';
            card.innerHTML = `<img src="${img}"><b>${song.trackName}</b><br><small>${song.artistName}</small>`;
            card.onclick = () => getFullSong(song.trackName + " " + song.artistName, img);
            grid.appendChild(card);
        });
    }).catch(err => {
        document.getElementById('quick-picks-grid').innerText = "Check internet connection.";
    });
};

// 2. Search Function
function handleSearch() {
    const query = document.getElementById('search').value;
    const grid = document.getElementById('quick-picks-grid');
    if(!query) return;

    document.getElementById('view-title').innerText = "Results for " + query;
    grid.innerHTML = "<div>Searching...</div>";

    fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=20`)
    .then(res => res.json()).then(data => {
        grid.innerHTML = "";
        data.results.forEach(song => {
            const img = song.artworkUrl100.replace('100x100bb', '600x600bb');
            const card = document.createElement('div');
            card.className = 'quick-pick-card';
            card.innerHTML = `<img src="${img}"><b>${song.trackName}</b><br><small>${song.artistName}</small>`;
            card.onclick = () => getFullSong(song.trackName + " " + song.artistName, img);
            grid.appendChild(card);
        });
    });
}

// 3. Play Full Song Logic (Switching to a more stable Streamer)
async function getFullSong(query, img) {
    document.getElementById('m-title').innerText = "Loading Full Track...";
    
    // We use a search proxy that converts the title to a YouTube Audio Stream
    // If inv.tux.rs is down, we use yewtu.be as a backup
    const instances = ["https://inv.tux.rs", "https://yewtu.be", "https://invidious.snopyta.org"];
    let success = false;

    for (let instance of instances) {
        if (success) break;
        try {
            const res = await fetch(`${instance}/api/v1/search?q=${encodeURIComponent(query)}`);
            const results = await res.json();
            if (results && results[0]) {
                const videoId = results[0].videoId;
                currentDownloadUrl = `${instance}/latest_version?id=${videoId}&itag=140`;
                updateUI(results[0].title, results[0].author, img, currentDownloadUrl);
                success = true;
            }
        } catch(e) {
            console.log("Instance failed, trying next...");
        }
    }
    
    if (!success) {
        alert("Music servers are busy. Please try again in a moment.");
        document.getElementById('m-title').innerText = "Error Loading Song";
    }
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
    document.getElementById('m-play-btn').className = "fas fa-pause";
}

// 4. Slider Control
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

// 5. General Controls
document.getElementById('dl-btn').onclick = () => window.open(currentDownloadUrl, '_blank');
miniPlayer.onclick = (e) => { 
    if(e.target.id !== 'm-play-btn' && e.target.id !== 'm-play-icon') {
        fullPlayer.classList.add('active'); 
    }
};
document.getElementById('close-player').onclick = () => fullPlayer.classList.remove('active');

function formatTime(s) {
    const m = Math.floor(s/60); const sec = Math.floor(s%60);
    return `${m}:${sec < 10 ? '0'+sec : sec}`;
}
