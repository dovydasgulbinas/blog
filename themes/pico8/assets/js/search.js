// Blog search: filters every Post (not just this page) from the JSON index Hugo writes to /search.json.
const list = document.querySelector("[data-post-list]");
const box = document.querySelector("[data-search]");
const input = document.querySelector("[data-search-input]");
const empty = document.querySelector("[data-empty]");
const pager = document.querySelector(".pager")?.closest("nav");

if (list && box && input && list.dataset.searchUrl) {
  box.hidden = false;
  const original = list.innerHTML;
  const sprite = list.querySelector(".row__meta img")?.getAttribute("src") ?? "";
  const placeholder = list.dataset.placeholder ?? "";
  let index;

  const load = async () => {
    index ??= fetch(list.dataset.searchUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`search index: ${r.status}`);
        return r.json();
      })
      .catch((err) => {
        index = undefined;
        throw err;
      });
    return index;
  };

  const esc = (s) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const row = (p) => `
    <li><a class="row" href="${esc(p.u)}" data-c="${esc(p.k)}">
      <img class="pixel" src="${esc(p.i || placeholder)}" alt="" width="64" height="64">
      <span class="row__body">
        <span class="row__meta"><img class="pixel" src="${esc(sprite)}" alt="" width="16" height="16">${esc(p.c)} · <time datetime="${esc(p.dt)}">${esc(p.d)}</time></span>
        <span class="row__title">${esc(p.t)}</span>
        <span class="row__excerpt">${esc(p.x)}</span>
      </span>
    </a></li>`;

  const run = async () => {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      list.innerHTML = original;
      empty.hidden = true;
      if (pager) pager.hidden = false;
      return;
    }
    const words = q.split(/\s+/);
    let all;
    try {
      all = await load();
    } catch {
      return; // keep the server-rendered list; the next keystroke retries
    }
    if (input.value.trim().toLowerCase() !== q) return; // a newer keystroke won
    const hits = all.filter((p) => words.every((w) => p.s.includes(w)));
    list.innerHTML = hits.map(row).join("");
    empty.hidden = hits.length > 0;
    if (pager) pager.hidden = true;
  };

  input.addEventListener("focus", load, { once: true });
  input.addEventListener("input", run);
}
