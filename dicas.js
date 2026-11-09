(() => {
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
