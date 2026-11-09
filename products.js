// Produtos NOVOS (editável). Sem preço: o valor é combinado no Direct.
// "armaz" = armazenamentos oferecidos por modelo. "versao": "Brasil" (Anatel, com chip) ou "EUA" (americano, só chip virtual).
// "img" vazio = cartão padrão com o nome do modelo, até a foto ser adicionada em img/.
// Estrutura do estoque: marca (LINHAS) > categoria (tipos) > novos | semi novos. Para criar marca ou categoria, edite aqui.
window.LINHAS = [
  { id: "apple", nome: "Apple", tipos: [
    { id: "iphone", nome: "iPhone" }, { id: "macbook", nome: "Mac" }, { id: "ipad", nome: "iPad" },
    { id: "watch", nome: "Apple Watch" }, { id: "airpods", nome: "AirPods" }, { id: "acessorios", nome: "Acessórios" } ] },
  { id: "samsung", nome: "Samsung", tipos: [
    { id: "galaxy", nome: "Galaxy" }, { id: "galaxy-watch", nome: "Galaxy Watch" }, { id: "galaxy-buds", nome: "Galaxy Buds" } ] },
  { id: "garmin", nome: "Garmin", tipos: [ { id: "relogios", nome: "Relógios" } ] },
  { id: "dji", nome: "DJI", tipos: [ { id: "drones", nome: "Drones" }, { id: "osmo", nome: "Osmo" } ] }
];

// Cores usadas nos cartões (nome em português + cor aproximada do ponto).
const COR = {
  "Preto": "#1A1A1C", "Branco": "#E9EAEC", "Azul": "#3F6FB5", "Verde": "#7FA88A", "Rosa": "#EDB4C4",
  "Roxo": "#9C88C4", "Amarelo": "#F2D86B", "Gold": "#D9C08A", "Laranja": "#E8742A", "Natural": "#A8A399",
  "Desert": "#C4A484", "Bordô": "#7A2335",
  "Midnight": "#1F2128", "Starlight": "#E6DFD3", "Silver": "#D5D7DA", "Sky Blue": "#A9C8E4", "Citrus": "#E8D44D",
  "Índigo": "#4B5FA8", "Blush": "#EFB9C6", "Rose Gold": "#E6B8A8", "Jet Black": "#0E0E10", "Space Gray": "#6B6D70", "Space Black": "#2A2A2C"
};
const cores = (...n) => n.map(x => Array.isArray(x) ? x : [x, COR[x]]);
const BR = (nome, ...armaz) => ({ nome, versao: "Brasil", armaz });
const US = (nome, ...armaz) => ({ nome, versao: "EUA", armaz });
const M = (nome, ...armaz) => ({ nome, armaz });
const item = (id, tipo, nome, modelos, cs, img = "", bg = "#05080F") =>
  ({ id, linha: "apple", tipo, nome, img, bg, modelos, cores: cs });
const iph = (id, nome, modelos, cs, img = "", bg = "#05080F") =>
  ({ id, linha: "apple", tipo: "iphone", nome, img, bg, modelos, cores: cs });

window.NOVOS = [
  {
    id: "duo", linha: "apple", tipo: "iphone", nome: "iPhone Duo", img: "img/duo.jpg", bg: "#8E0F22",
    modelos: [{ nome: "iPhone Duo", armaz: ["256 GB", "512 GB"] }],
    cores: [["Star White", "#EEF0F2"], ["Night Sky", "#1C2740"]]
  },
  iph("17pro", "iPhone 17 Pro e Pro Max",
    [US("iPhone 17 Pro", "256 GB", "512 GB"), US("iPhone 17 Pro Max", "256 GB", "512 GB", "1 TB", "2 TB")],
    cores(["Laranja", "#E8742A"], ["Azul", "#1F2A4D"], ["Branco", "#D5D7DA"]), "img/17pro.jpg", "#000"),
  iph("18pro", "iPhone 18 Pro e Pro Max",
    [BR("iPhone 18 Pro", "256 GB"), US("iPhone 18 Pro", "512 GB"), US("iPhone 18 Pro Max", "256 GB"), BR("iPhone 18 Pro Max", "512 GB")],
    cores(["Azul", "#9FBBE0"], "Bordô", ["Branco", "#E3E4E6"], ["Preto", "#1A1A1C"]), "img/18pro.jpg", "#8E0F22"),
  iph("17", "iPhone 17", [US("iPhone 17", "256 GB")], cores("Azul", "Verde", "Preto", "Roxo", "Branco"), "img/17.jpg", "#FAFAFA"),
  iph("17air", "iPhone 17 Air", [US("iPhone 17 Air", "256 GB")], cores("Azul", "Branco", "Gold", "Preto"), "img/17air.jpg", "#FAFAFA"),
  iph("17e", "iPhone 17e", [BR("iPhone 17e", "256 GB")], cores("Preto", "Branco", "Rosa"), "img/17e.jpg", "#FAFAFA"),
  iph("16pro", "iPhone 16 Pro e Pro Max", [BR("iPhone 16 Pro", "128 GB"), BR("iPhone 16 Pro Max", "256 GB")], cores("Natural", "Preto", "Desert"), "img/16pro.jpg", "#000"),
  iph("16", "iPhone 16", [BR("iPhone 16", "128 GB", "256 GB")], cores("Rosa", "Branco", "Azul", "Verde", "Preto"), "img/16.jpg", "#FAFAFA"),
  iph("16e", "iPhone 16e", [BR("iPhone 16e", "128 GB", "256 GB")], cores("Branco", "Preto"), "img/16e.jpg", "#FAFAFA"),
  iph("15pro", "iPhone 15 Pro e Pro Max", [BR("iPhone 15 Pro", "256 GB"), BR("iPhone 15 Pro Max", "256 GB")], cores("Azul", "Preto", "Natural", "Branco"), "img/15pro.jpg", "#FAFAFA"),
  iph("15", "iPhone 15", [BR("iPhone 15", "128 GB", "256 GB")], cores("Preto", "Azul"), "img/15.jpg", "#FAFAFA"),
  iph("14promax", "iPhone 14 Pro Max", [BR("iPhone 14 Pro Max", "128 GB")], cores("Roxo", "Preto", "Gold"), "img/14promax.jpg", "#FAFAFA"),
  iph("14", "iPhone 14", [BR("iPhone 14", "128 GB")], cores("Roxo", "Azul"), "img/14.jpg", "#FAFAFA"),
  iph("13pro", "iPhone 13 Pro e Pro Max", [BR("iPhone 13 Pro", "128 GB"), BR("iPhone 13 Pro Max", "128 GB")], cores("Branco", "Preto"), "img/13pro.jpg", "#FAFAFA"),
  iph("13", "iPhone 13", [BR("iPhone 13", "128 GB", "256 GB")], cores("Preto", "Branco"), "img/13.jpg", "#FAFAFA")  ,
  // iPad (sem foto ainda: cartão padrão com o nome)
  item("ipad10", "ipad", "iPad 10", [M("iPad 10", "256 GB")], cores("Rosa"), "img/ipad10.jpg", "#FAFAFA"),
  item("ipad11", "ipad", "iPad 11 (2024)", [M("iPad 11", "128 GB", "256 GB")], cores("Rosa", "Azul", "Branco"), "img/ipad11.jpg", "#FFFFFF"),
  item("ipadair11m3", "ipad", "iPad Air 11\" M3", [M("iPad Air 11\" M3", "128 GB")], cores("Roxo"), "img/ipadair11m3.jpg", "#AADBEC"),
  item("ipadair11m4", "ipad", "iPad Air 11\" M4", [M("iPad Air 11\" M4", "128 GB", "256 GB")], cores("Azul", "Roxo", "Starlight"), "img/ipadair11m4.jpg", "#F5F5F7"),
  item("ipadair13m4", "ipad", "iPad Air 13\" M4", [M("iPad Air 13\" M4", "128 GB", "256 GB")], cores("Azul", "Roxo", "Preto"), "img/ipadair13m4.jpg", "#F5F5F7"),
  item("ipadpro", "ipad", "iPad Pro M5", [M("iPad Pro 11\" M5", "256 GB"), M("iPad Pro 13\" M5", "256 GB")], cores("Preto", "Branco"), "img/ipadpro.png", "#F5F5F7"),
  // Mac
  item("macmini", "macbook", "Mac mini M6", [M("Mac mini M6", "16 GB / 256 GB")], cores("Silver"), "img/macmini.jpg", "#FAFAFC"),
  item("macneo", "macbook", "Mac Neo 13,3\"", [M("Mac Neo 13,3\"", "8 GB / 256 GB", "8 GB / 512 GB")], cores("Citrus", "Silver", "Índigo", "Blush"), "img/macneo.jpg", "#FAFAFC"),
  item("macair", "macbook", "MacBook Air M5", [M("MacBook Air M5 13,6\"", "16 GB / 512 GB"), M("MacBook Air M5 15\"", "16 GB / 512 GB")], cores("Midnight", "Silver", "Sky Blue", "Starlight"), "img/macair.jpg", "#FAFAFC"),
  item("macpro14", "macbook", "MacBook Pro 14\" M5", [M("MacBook Pro 14\" M5", "16 GB / 1 TB"), M("MacBook Pro 14\" M5 Pro", "24 GB / 1 TB")], cores("Silver", "Space Black"), "img/macpro14.png", "#F5F5F7"),
  item("imac", "macbook", "iMac 24\" M4", [M("iMac 24\" M4", "16 GB / 256 GB")], cores("Silver"), "img/imac.jpg", "#FAFAFA"),
  // Apple Watch
  item("watchse2", "watch", "Apple Watch SE 2", [M("Apple Watch SE 2", "44 mm")], cores("Midnight"), "img/watchse2.jpg", "#FAFAFA"),
  item("watchse3", "watch", "Apple Watch SE 3", [M("Apple Watch SE 3", "40 mm", "44 mm")], cores("Midnight", "Starlight"), "img/watchse3.jpg", "#FAFAFA"),
  item("watch10", "watch", "Apple Watch Series 10", [M("Apple Watch Series 10", "46 mm")], cores("Rose Gold"), "img/watch10.jpg", "#FAFAFA"),
  item("watch11", "watch", "Apple Watch Series 11", [M("Apple Watch Series 11", "42 mm", "46 mm")], cores("Rose Gold", "Jet Black", "Space Gray", "Silver"), "img/watch11.jpg", "#FAFAFA"),
  item("ultra3", "watch", "Apple Watch Ultra 3", [M("Apple Watch Ultra 3", "49 mm")], cores("Preto"), "img/ultra3.jpg", "#F5F5F7"),
  item("ultra4", "watch", "Apple Watch Ultra 4", [M("Apple Watch Ultra 4", "49 mm")], cores("Preto"), "img/ultra4.png", "#F5F5F7"),
  // AirPods e acessórios
  item("airpodsmax2", "airpods", "AirPods Max 2", [M("AirPods Max 2", "2026")], cores("Branco", "Preto"), "img/airpodsmax2.jpg", "#FFFFFF"),
  item("airpodspro3", "airpods", "AirPods Pro 3", [M("AirPods Pro 3", "USB-C")], cores("Branco"), "img/airpodspro3.jpg", "#FAFAFA"),
  item("fonte20", "acessorios", "Fonte USB-C 20W", [M("Fonte USB-C 20W", "20 W")], cores("Branco"), "img/fonte20.png", "#8E0F22")
];


// Estoque Guerra pendente de confirmação. Não reutilizar a lista real da AM Tech.
window.SEMI_LISTA = [];

// Catálogo e preços informados pela Guerra Store em 08/11/2026.
// `preco: null` significa que o valor deve ser consultado. `aPartir` preserva a condição comercial recebida.
COR.Space = "#2A2A2C";
COR["Star White"] = "#EEF0F2";
COR["Night Sky"] = "#1C2740";
const OPT = (nome, preco, nomesCores, aPartir = false, precosCor = null) => ({
  nome, preco, aPartir, precosCor, cores: cores(...nomesCores)
});
const SKU = (nome, versao, ...armaz) => ({ nome, ...(versao ? { versao } : {}), armaz });
const ATUALIZACOES = [
  { id: "duo", modelos: [SKU("iPhone Duo", "", OPT("256 GB", 17999, ["Star White", "Night Sky"]), OPT("512 GB", 18999, ["Star White", "Night Sky"]), OPT("1 TB", null, ["Star White", "Night Sky"]), OPT("2 TB", null, ["Star White", "Night Sky"]))] },
  { id: "17pro", modelos: [
    SKU("iPhone 17 Pro", "EUA", OPT("256 GB", 7499, ["Laranja", "Azul", "Branco"], true), OPT("512 GB", 8799, ["Laranja", "Azul", "Branco"], true), OPT("1 TB", null, ["Laranja", "Azul", "Branco"]), OPT("2 TB", null, ["Laranja", "Azul", "Branco"])),
    SKU("iPhone 17 Pro Max", "EUA", OPT("256 GB", 7999, ["Laranja", "Azul", "Branco"], true), OPT("512 GB", 9499, ["Laranja", "Azul", "Branco"], true), OPT("1 TB", null, ["Laranja", "Azul", "Branco"]), OPT("2 TB", null, ["Laranja", "Azul", "Branco"]))
  ] },
  { id: "18pro", modelos: [
    SKU("iPhone 18 Pro", "Brasil", OPT("256 GB", 8499, ["Azul", "Bordô", "Branco", "Preto"]), OPT("512 GB", 9999, ["Azul", "Bordô", "Branco", "Preto"]), OPT("1 TB", null, ["Azul", "Bordô", "Branco", "Preto"]), OPT("2 TB", null, ["Azul", "Bordô", "Branco", "Preto"])),
    SKU("iPhone 18 Pro Max", "Brasil", OPT("256 GB", 9499, ["Azul", "Bordô", "Branco", "Preto"], true), OPT("512 GB", 11499, ["Azul", "Bordô", "Branco", "Preto"], true), OPT("1 TB", null, ["Azul", "Bordô", "Branco", "Preto"]), OPT("2 TB", null, ["Azul", "Bordô", "Branco", "Preto"]))
  ] },
  { id: "17", modelos: [SKU("iPhone 17", "EUA", OPT("256 GB", 5799, ["Azul", "Verde", "Preto", "Roxo", "Branco"]))] },
  { id: "17air", modelos: [SKU("iPhone 17 Air", "EUA", OPT("256 GB", 5999, ["Azul", "Branco", "Gold", "Preto"]))] },
  { id: "17e", modelos: [SKU("iPhone 17e", "Brasil", OPT("256 GB", 4499, ["Preto", "Branco", "Rosa"]))] },
  { id: "16pro", modelos: [SKU("iPhone 16 Pro", "Brasil", OPT("128 GB", 5499, ["Natural", "Preto", "Desert"]))] },
  { id: "16", modelos: [SKU("iPhone 16", "Brasil", OPT("128 GB", 4499, ["Rosa", "Branco", "Azul", "Verde"]), OPT("256 GB", 4999, ["Branco", "Preto"]))] },
  { id: "15pro", modelos: [
    SKU("iPhone 15 Pro CPO", "Brasil", OPT("256 GB", 5299, ["Branco", "Azul", "Preto"])),
    SKU("iPhone 15 Pro Max", "Brasil", OPT("256 GB", 5999, ["Preto", "Natural", "Branco", "Azul"]))
  ] },
  { id: "15", modelos: [
    SKU("iPhone 15", "Brasil", OPT("128 GB", 4299, ["Preto", "Azul"])),
    SKU("iPhone 15 CPO", "Brasil", OPT("256 GB", 4499, ["Verde", "Azul", "Preto"]))
  ] },
  { id: "14promax", modelos: [SKU("iPhone 14 Pro Max", "Brasil", OPT("128 GB", 4499, ["Roxo", "Preto", "Gold"]), OPT("256 GB", 4999, ["Roxo", "Preto"]))] },
  { id: "14", modelos: [SKU("iPhone 14", "Brasil", OPT("128 GB", 3999, ["Roxo", "Azul", "Preto", "Branco"]))] },
  { id: "13", modelos: [SKU("iPhone 13", "Brasil", OPT("128 GB", 3499, ["Preto", "Branco"]))] },
  { id: "ipad10", modelos: [SKU("iPad 10", "", OPT("256 GB", 3499, ["Rosa"]))] },
  { id: "ipad11", modelos: [SKU("iPad 11 (2024)", "", OPT("128 GB", 3299, ["Rosa", "Azul", "Branco"]), OPT("256 GB", 3999, ["Azul", "Rosa", "Branco"]))] },
  { id: "ipadair11m3", modelos: [SKU("iPad Air 11\" M3 (2025)", "", OPT("128 GB", 4999, ["Starlight", "Azul", "Roxo"]))] },
  { id: "ipadair11m4", modelos: [SKU("iPad Air 11\" M4 (2025)", "", OPT("128 GB", 5499, ["Azul", "Roxo", "Preto", "Starlight"]), OPT("256 GB", 6999, ["Roxo", "Azul", "Preto", "Starlight"]))] },
  { id: "ipadair13m4", modelos: [SKU("iPad Air 13\" M4 (2025)", "", OPT("128 GB", 6999, ["Azul", "Roxo"]), OPT("256 GB", 7999, ["Azul", "Starlight", "Preto"]))] },
  { id: "ipadpro", modelos: [SKU("iPad Pro 11\" M5 (2025)", "", OPT("256 GB", 8499, ["Branco", "Preto"])), SKU("iPad Pro 13\" M5 (2025)", "", OPT("256 GB", 9499, ["Preto", "Branco"]))] },
  { id: "macmini", modelos: [SKU("Mac mini M6", "", OPT("16 GB / 256 GB", 7999, ["Silver"], true))] },
  { id: "macneo", modelos: [SKU("Mac Neo 13,3\"", "", OPT("8 GB / 256 GB", 5499, ["Citrus", "Silver", "Índigo", "Blush"], true), OPT("8 GB / 512 GB", 6499, ["Citrus", "Silver", "Índigo", "Blush"], true))] },
  { id: "macair", modelos: [SKU("MacBook Air M5 13,6\"", "", OPT("16 GB / 512 GB", 8999, ["Midnight", "Silver", "Sky Blue", "Starlight"])), SKU("MacBook Air M5 15\"", "", OPT("16 GB / 512 GB", 10999, ["Midnight", "Sky Blue", "Starlight", "Silver"]))] },
  { id: "macpro14", modelos: [
    SKU("MacBook Pro 14\" M5", "", OPT("16 GB / 1 TB", 13999, ["Silver", "Midnight"])),
    SKU("MacBook Pro 14\" M5 Pro", "", OPT("24 GB / 1 TB", null, ["Space", "Silver"], false, { Space: 15999, Silver: 17999 }))
  ] },
  { id: "imac", modelos: [SKU("iMac 24\" M4", "", OPT("16 GB / 256 GB", 14499, ["Silver"]))] },
  { id: "watchse2", modelos: [SKU("Apple Watch SE 2ª Geração", "", OPT("44 mm", 1799, ["Midnight"]))] },
  { id: "watchse3", modelos: [SKU("Apple Watch SE 3ª Geração", "", OPT("40 mm", 1999, ["Midnight"]), OPT("44 mm", 2199, ["Midnight", "Starlight"]))] },
  { id: "watch10", modelos: [SKU("Apple Watch Series 10", "", OPT("46 mm", 2499, ["Rose Gold"]))] },
  { id: "watch11", modelos: [SKU("Apple Watch Series 11", "", OPT("42 mm", 2699, ["Rose Gold", "Jet Black", "Space Gray", "Silver"]), OPT("46 mm", 2999, ["Rose Gold", "Jet Black", "Space Gray", "Silver"]))] },
  { id: "ultra3", modelos: [SKU("Apple Watch Ultra 3", "", OPT("49 mm", 4999, ["Preto"]))] },
  { id: "ultra4", modelos: [SKU("Apple Watch Ultra 4", "", OPT("49 mm", 6999, ["Preto"]))] },
  { id: "airpodsmax2", modelos: [SKU("AirPods Max 2 (2026)", "", OPT("USB-C", 4299, ["Branco", "Preto"]))] },
  { id: "airpodspro3", modelos: [SKU("AirPods Pro 3", "", OPT("USB-C", 1799, ["Branco"]))] },
  { id: "fonte20", modelos: [SKU("Fonte USB-C 20W", "", OPT("20 W", 199, ["Branco"]))] }
];
ATUALIZACOES.forEach(atualizacao => {
  const produto = window.NOVOS.find(p => p.id === atualizacao.id);
  if (!produto) return;
  produto.modelos = atualizacao.modelos;
  if (produto.modelos.length === 1) produto.nome = produto.modelos[0].nome;
  const mapa = new Map();
  produto.modelos.forEach(modelo => modelo.armaz.forEach(opcao => (opcao.cores || []).forEach(cor => mapa.set(cor[0], cor))));
  if (mapa.size) produto.cores = [...mapa.values()];
});

// Ofertas de Black Friday exibidas na página inicial e refletidas no catálogo.
[
  ["17pro", "iPhone 17 Pro", "256 GB", 7299, 7499],
  ["17pro", "iPhone 17 Pro Max", "256 GB", 7699, 7999],
  ["18pro", "iPhone 18 Pro", "256 GB", 8299, 8499],
  ["18pro", "iPhone 18 Pro Max", "256 GB", 9399, 9499],
  ["duo", "iPhone Duo", "256 GB", 17999, 18999],
  ["duo", "iPhone Duo", "512 GB", 18999, 21999]
].forEach(([id, modelo, capacidade, preco, precoAnterior]) => {
  const produto = window.NOVOS.find(p => p.id === id);
  const sku = produto?.modelos.find(m => m.nome === modelo);
  const opcao = sku?.armaz.find(a => typeof a === "object" && a.nome === capacidade);
  if (opcao) Object.assign(opcao, { preco, precoAnterior, blackFriday: true, aPartir: false });
});

window.NOVOS.forEach(p => {
  p.bg = "#16080c";
  p.preview = !p.modelos.some(m => m.armaz.some(a => typeof a === "object" && (a.preco != null || a.precosCor)));
});
