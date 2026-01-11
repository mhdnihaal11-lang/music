:root {
    --apple-red: #fa243c;
    --bg-black: #000;
    --card-bg: #1c1c1e;
    --text-gray: #8e8e93;
    --glass: rgba(28, 28, 30, 0.95);
}

body {
    margin: 0; background: var(--bg-black); color: white;
    font-family: -apple-system, system-ui, sans-serif;
    display: flex; height: 100vh; overflow: hidden;
}

.sidebar { width: 250px; background: #000; padding: 30px 20px; border-right: 1px solid #2c2c2e; }
.brand { color: var(--apple-red); font-size: 28px; margin-bottom: 40px; }
.nav-item { color: white; margin-bottom: 25px; cursor: pointer; display: flex; align-items: center; gap: 15px; }
.nav-item.active { color: var(--apple-red); font-weight: 700; }

.main-view { flex: 1; overflow-y: auto; padding-bottom: 120px; }
.header-search { padding: 20px; position: sticky; top: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(20px); z-index: 100; }
.search-bar { background: #1c1c1e; display: flex; align-items: center; padding: 12px 15px; border-radius: 12px; max-width: 500px; }
.search-bar input { background: transparent; border: none; color: white; width: 100%; margin-left: 10px; outline: none; }

.section { padding: 20px; }
.horizontal-scroll { display: flex; overflow-x: auto; gap: 15px; padding-bottom: 10px; }
.horizontal-scroll::-webkit-scrollbar { display: none; }
.quick-pick-card { min-width: 200px; background: var(--card-bg); border-radius: 12px; padding: 10px; cursor: pointer; }
.quick-pick-card img { width: 100%; border-radius: 8px; }

.mini-player { position: fixed; bottom: 20px; left: 15px; right: 15px; height: 64px; background: var(--glass); backdrop-filter: blur(30px); border-radius: 12px; display: flex; align-items: center; padding: 0 15px; z-index: 500; cursor: pointer; }
.mini-player img { width: 44px; height: 44px; border-radius: 6px; margin-right: 12px; }
.mini-info { flex: 1; overflow: hidden; }
.mini-info b { display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

#full-player { position: fixed; top: 100%; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, #444, #000); z-index: 2000; transition: top 0.4s cubic-bezier(0.25, 1, 0.5, 1); display: flex; flex-direction: column; align-items: center; padding-top: 60px; }
#full-player.active { top: 0; }
.full-art { width: 85%; max-width: 350px; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); margin-bottom: 30px; }
.full-meta { width: 85%; }
.title-row { display: flex; justify-content: space-between; align-items: center; }
.badge { display: inline-block; background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; font-size: 10px; margin: 10px 5px 0 0; }
.download-btn { background: var(--apple-red); border: none; color: white; padding: 10px 15px; border-radius: 20px; margin-top: 15px; cursor: pointer; font-weight: bold; }

.progress-container { width: 85%; margin-top: 25px; }
.progress-container input { width: 100%; accent-color: white; cursor: pointer; }
.time-stamps { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-gray); margin-top: 5px; }
.player-controls-large { width: 85%; margin-top: 40px; display: flex; justify-content: space-around; font-size: 30px; }
.close-player { position: absolute; top: 20px; left: 20px; font-size: 24px; opacity: 0.5; cursor: pointer; }

@media (max-width: 768px) { .sidebar { display: none; } }
