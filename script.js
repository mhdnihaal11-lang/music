// A list of reliable free public servers
const instances = [
    "https://inv.tux.rs",
    "https://invidious.sethforprivacy.com",
    "https://yewtu.be",
    "https://iv.melmac.space",
    "https://invidious.snopyta.org"
];

let currentInstanceIndex = 0;

async function searchMusic() {
    const query = document.getElementById('main-search').value;
    if (!query) return;

    const grid = document.getElementById('music-grid');
    const title = document.getElementById('view-title');
    
    title.innerText = "Searching across servers...";
    grid.innerHTML = '<div class="loader"></div>'; // Optional: add a CSS spinner

    try {
        // Try the current server
        const response = await fetch(`${instances[currentInstanceIndex]}/api/v1/search?q=${encodeURIComponent(query)}&type=video`);
        
        if (!response.ok) throw new Error("Server busy");

        const results = await response.json();
        displayResults(results);
    } catch (error) {
        console.log(`Server ${instances[currentInstanceIndex]} failed. Trying next...`);
        
        // Move to the next server in the list
        currentInstanceIndex = (currentInstanceIndex + 1) % instances.length;
        
        // Automatically try again with the new server
        searchMusic();
    }
}

function displayResults(songs) {
    const grid = document.getElementById('music-grid');
    grid.innerHTML = ''; 
    document.getElementById('view-title').innerText = "Listen Now";

    songs.forEach(song => {
        const card = document.createElement('div');
        card.className = 'album-card';
        
        // Fallback for thumbnails
        const thumb = song.videoThumbnails ? song.videoThumbnails[0].url : https://img.youtube.com/vi/${song.videoId}/hqdefault.jpg;

        card.innerHTML = `
            <img src="${thumb}" onerror="this.src='https://via.placeholder.com/200'">
            <p class="album-title">${song.title.substring(0, 40)}</p>
            <p class="album-artist">${song.author}</p>
        `;
        
        card.onclick = () => playSong(song.videoId, song.title, song.author, thumb);
        grid.appendChild(card);
    });
}

function playSong(id, title, artist, art) {
    document.getElementById('current-title').innerText = title;
    document.getElementById('current-artist').innerText = artist;
    document.getElementById('current-art').src = art;

    // Use a clean YouTube Embed for the audio
    const playerArea = document.getElementById('youtube-audio-player');
    playerArea.innerHTML = `
        <iframe width="0" height="0" 
        src="https://www.youtube.com/embed/${id}?autoplay=1" 
        frameborder="0" allow="autoplay"></iframe>`;
}

// Event listener for the Enter key
document.getElementById('main-search').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchMusic();
});
