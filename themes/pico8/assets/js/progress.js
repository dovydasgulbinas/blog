// Reading progress as a 20-segment XP bar.
const bar = document.querySelector("[data-xp]");
const article = document.querySelector(".article");
if (bar && article) {
  const segs = [...bar.children];
  bar.hidden = false;
  let queued = false;
  const update = () => {
    queued = false;
    const rect = article.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const pct = total <= 0 ? 100 : Math.min(100, Math.max(0, (-rect.top / total) * 100));
    const on = Math.round((pct / 100) * segs.length);
    segs.forEach((s, i) => {
      s.classList.toggle("on", i < on);
      s.classList.toggle("edge", i === on);
    });
    bar.setAttribute("aria-valuenow", String(Math.round(pct)));
  };
  const schedule = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule);
  update();
}
