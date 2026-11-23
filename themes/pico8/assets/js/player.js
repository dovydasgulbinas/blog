// Music player skin over the native <audio> element. Without JS the native controls show.
for (const root of document.querySelectorAll("[data-player]")) {
  const audio = root.querySelector("audio");
  const play = root.querySelector("[data-play]");
  const seek = root.querySelector("[data-seek]");
  const segs = [...seek.children];
  const time = root.querySelector("[data-time]");
  const duration = root.querySelector("[data-duration]");
  const label = play.getAttribute("aria-label").replace(/^Play /, "");
  root.classList.add("is-enhanced");

  const fmt = (s) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "–:––");
  const draw = () => {
    const pct = audio.duration ? audio.currentTime / audio.duration : 0;
    const on = Math.floor(pct * segs.length);
    segs.forEach((s, i) => {
      s.className = i < on ? "on" : i === on && audio.currentTime > 0 ? "head" : "";
    });
    time.textContent = fmt(audio.currentTime);
    seek.setAttribute("aria-valuenow", String(Math.round(pct * 100)));
    seek.setAttribute("aria-valuetext", `${fmt(audio.currentTime)} of ${fmt(audio.duration)}`);
  };
  const state = () => {
    const playing = !audio.paused;
    root.classList.toggle("is-playing", playing);
    play.textContent = playing ? "❚❚" : "▶";
    play.setAttribute("aria-label", `${playing ? "Pause" : "Play"} ${label}`);
  };

  play.addEventListener("click", () => (audio.paused ? audio.play() : audio.pause()));
  seek.addEventListener("click", (e) => {
    if (!audio.duration) return;
    const r = seek.getBoundingClientRect();
    audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
  });
  seek.addEventListener("keydown", (e) => {
    if (!audio.duration) return;
    const step = { ArrowRight: 5, ArrowUp: 5, ArrowLeft: -5, ArrowDown: -5, PageUp: 30, PageDown: -30 }[e.key];
    if (step) audio.currentTime = Math.min(audio.duration, Math.max(0, audio.currentTime + step));
    else if (e.key === "Home") audio.currentTime = 0;
    else if (e.key === "End") audio.currentTime = audio.duration;
    else return;
    e.preventDefault();
    draw();
  });
  audio.addEventListener("loadedmetadata", () => (duration.textContent = fmt(audio.duration)));
  audio.addEventListener("timeupdate", draw);
  audio.addEventListener("play", state);
  audio.addEventListener("pause", state);
  audio.addEventListener("ended", state);
  if (audio.readyState >= 1) duration.textContent = fmt(audio.duration);
}
