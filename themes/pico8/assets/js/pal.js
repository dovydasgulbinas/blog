// Home portrait: swap the dithered portrait between Ramps, like PICO-8 pal().
const root = document.querySelector("[data-pal]");
if (root) {
  const img = root.querySelector("[data-pal-img]");
  const group = root.querySelector("[data-pal-buttons]");
  const buttons = [...group.querySelectorAll("button")];
  group.hidden = false;
  for (const btn of buttons) {
    btn.addEventListener("click", () => {
      img.src = btn.dataset.src;
      for (const b of buttons) b.setAttribute("aria-pressed", String(b === btn));
    });
  }
}
