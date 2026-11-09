(() => {
  document.querySelectorAll("[data-tip-carousel]").forEach(carousel => {
    const track = carousel.querySelector(".tip-track");
    const slides = [...track.querySelectorAll(".tip-slide")];
    const previous = carousel.querySelector(".tip-prev");
    const next = carousel.querySelector(".tip-next");
    const dots = [...carousel.querySelectorAll("[data-tip-index]")];
    const counter = carousel.querySelector(".tip-counter");
    let index = 0, frame = 0;
    function mark() {
      index = Math.min(slides.length - 1, Math.max(0, Math.round(track.scrollLeft / track.clientWidth)));
      previous.disabled = index === 0;
      next.disabled = index === slides.length - 1;
      counter.textContent = (index + 1) + " de " + slides.length;
      dots.forEach((dot, i) => dot.setAttribute("aria-current", String(i === index)));
      slides.forEach((slide, i) => slide.setAttribute("aria-hidden", String(i !== index)));
    }
    function go(target) {
      target = Math.min(slides.length - 1, Math.max(0, target));
      track.scrollTo({ left: track.clientWidth * target,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
    previous.addEventListener("click", () => go(index - 1));
    next.addEventListener("click", () => go(index + 1));
    dots.forEach(dot => dot.addEventListener("click", () => go(Number(dot.dataset.tipIndex))));
    track.addEventListener("scroll", () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(mark);
    }, { passive: true });
    track.addEventListener("keydown", event => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        go(index + (event.key === "ArrowRight" ? 1 : -1));
      }
    });
    new ResizeObserver(mark).observe(track);
    mark();
  });
  const input = document.getElementById("help-search");
  const buttons = [...document.querySelectorAll("[data-help-filter]")];
  const guides = [...document.querySelectorAll(".help-guide")];
  const groups = [...document.querySelectorAll("[data-help-group]")];
  const count = document.getElementById("help-count");
  const empty = document.getElementById("help-empty");
  let category = "todos";
  const normalize = text => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
  const searchTexts = new Map(guides.map(guide => [guide, normalize(guide.textContent)]));
  function filter() {
    const words = normalize(input.value.trim()).split(/\s+/).filter(Boolean);
    let visible = 0;
    guides.forEach(guide => {
      guide.hidden = !(category === "todos" || guide.dataset.helpCategory === category) ||
        !words.every(word => searchTexts.get(guide).includes(word));
      if (!guide.hidden) visible++;
    });
    groups.forEach(group => { group.hidden = ![...group.querySelectorAll(".help-guide")].some(guide => !guide.hidden); });
    count.textContent = visible + (visible === 1 ? " guia encontrado" : " guias encontrados");
    empty.hidden = visible !== 0;
  }
  function reset() {
    input.value = "";
    category = "todos";
    buttons.forEach(button => button.setAttribute("aria-pressed", button.dataset.helpFilter === category));
    filter();
  }
  buttons.forEach(button => button.addEventListener("click", () => {
    category = button.dataset.helpFilter;
    buttons.forEach(other => other.setAttribute("aria-pressed", other === button));
    filter();
  }));
  input.addEventListener("input", filter);
  document.getElementById("help-reset").addEventListener("click", () => { reset(); input.focus(); });
  function openLinkedGuide() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const guide = document.getElementById(id);
    if (!guide?.classList.contains("help-guide")) return;
    reset();
    guide.open = true;
    guide.scrollIntoView({ block: "start", behavior: "instant" });
  }
  addEventListener("hashchange", openLinkedGuide);
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener("click", () => {
    if (link.hash === location.hash) openLinkedGuide();
  }));
  openLinkedGuide();
})();
