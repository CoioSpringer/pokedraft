/* PokeDraft: a browser-only Pokémon story-team draft simulator. */

const POKE_API = "https://pokeapi.co/api/v2";
const ART_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

const REGIONS = [
  { id: "kanto", name: "Kanto", games: "FireRed / LeafGreen", dexes: ["kanto"], starters: ["bulbasaur", "charmander", "squirtle"], note: "Pokédex de Kanto com exclusividades de FireRed e LeafGreen." },
  { id: "johto", name: "Johto", games: "HeartGold / SoulSilver", dexes: ["updated-johto"], starters: ["chikorita", "cyndaquil", "totodile"], note: "Pokédex expandida de Johto usada em HeartGold e SoulSilver." },
  { id: "hoenn", name: "Hoenn", games: "Emerald / ORAS", dexes: ["hoenn"], starters: ["treecko", "torchic", "mudkip"], note: "Aventura em Hoenn com as espécies da Pokédex regional." },
  { id: "sinnoh", name: "Sinnoh", games: "Platinum", dexes: ["extended-sinnoh"], starters: ["turtwig", "chimchar", "piplup"], note: "Pokédex expandida de Platinum, incluindo os encontros extras da versão." },
  { id: "unova", name: "Unova", games: "Black / White / B2W2", dexes: ["updated-unova"], starters: ["snivy", "tepig", "oshawott"], note: "Pokédex atualizada de Unova, reunindo as quatro versões." },
  { id: "kalos", name: "Kalos", games: "X / Y", dexes: ["kalos-central", "kalos-coastal", "kalos-mountain"], starters: ["chespin", "fennekin", "froakie"], note: "As três Pokédex de Kalos: Central, Costa e Montanha." },
  { id: "alola", name: "Alola", games: "Sun / Moon / USUM", dexes: ["updated-alola", "updated-melemele", "updated-akala", "updated-ulaula", "updated-poni"], starters: ["rowlet", "litten", "popplio"], note: "Pokédex de Alola e das quatro ilhas para as versões Sun, Moon e Ultra." },
  { id: "galar", name: "Galar", games: "Sword / Shield", dexes: ["galar"], starters: ["grookey", "scorbunny", "sobble"], note: "Pokédex regional de Galar, com exclusividades de Sword e Shield." },
  { id: "paldea", name: "Paldea", games: "Scarlet / Violet", dexes: ["paldea"], starters: ["sprigatito", "fuecoco", "quaxly"], note: "Pokédex de Paldea, reunindo Scarlet e Violet." },
];

const KANTO_STARTER_LINE = new Set(["bulbasaur", "ivysaur", "venusaur", "charmander", "charmeleon", "charizard", "squirtle", "wartortle", "blastoise"]);
const KANTO_STARTER_FINALS = [
  { id: 3, name: "venusaur" },
  { id: 6, name: "charizard" },
  { id: 9, name: "blastoise" },
];
const STARTER_LINE_POKEMON = new Set(`
bulbasaur ivysaur venusaur charmander charmeleon charizard squirtle wartortle blastoise
chikorita bayleef meganium cyndaquil quilava typhlosion totodile croconaw feraligatr
treecko grovyle sceptile torchic combusken blaziken mudkip marshtomp swampert
turtwig grotle torterra chimchar monferno infernape piplup prinplup empoleon
snivy servine serperior tepig pignite emboar oshawott dewott samurott
chespin quilladin chesnaught fennekin braixen delphox froakie frogadier greninja
rowlet dartrix decidueye litten torracat incineroar popplio brionne primarina
grookey thwackey rillaboom scorbunny raboot cinderace sobble drizzile inteleon
sprigatito floragato meowscarada fuecoco crocalor skeledirge quaxly quaxwell quaquaval
`.trim().split(/\s+/));

const STARTER_TO_FINAL = {
  bulbasaur: "venusaur", charmander: "charizard", squirtle: "blastoise",
  chikorita: "meganium", cyndaquil: "typhlosion", totodile: "feraligatr",
  treecko: "sceptile", torchic: "blaziken", mudkip: "swampert",
  turtwig: "torterra", chimchar: "infernape", piplup: "empoleon",
  snivy: "serperior", tepig: "emboar", oshawott: "samurott",
  chespin: "chesnaught", fennekin: "delphox", froakie: "greninja",
  rowlet: "decidueye", litten: "incineroar", popplio: "primarina",
  grookey: "rillaboom", scorbunny: "cinderace", sobble: "inteleon",
  sprigatito: "meowscarada", fuecoco: "skeledirge", quaxly: "quaquaval",
};

const SPECIAL_POKEMON = new Set(`articuno zapdos moltres mewtwo mew raikou entei suicune lugia ho-oh celebi
regirock regice registeel latias latios kyogre groudon rayquaza jirachi deoxys
uxie mesprit azelf dialga palkia heatran regigigas giratina cresselia phione manaphy darkrai shaymin arceus
victini cobalion terrakion virizion tornadus thundurus reshiram zekrom landorus kyurem keldeo meloetta genesect
xerneas yveltal zygarde diancie hoopa volcanion type-null silvally tapu-koko tapu-lele tapu-bulu tapu-fini cosmog cosmoem solgaleo lunala
nihilego buzzwole pheromosa xurkitree celesteela kartana guzzlord necrozma magearna marshadow poipole naganadel stakataka blacephalon zeraora meltan melmetal
zacian zamazenta eternatus kubfu urshifu zarude regieleki regidrago glastrier spectrier calyrex enamorus
wo-chien chien-pao ting-lu chi-yu roaring-moon iron-valiant koraidon miraidon walking-wake iron-leaves okidogi munkidori fezandipiti ogerpon terapagos pecharunt`.split(/\s+/));

const TYPE_COLORS = {
  normal: "#9aa4ae", fire: "#f1765d", water: "#5eabed", electric: "#e1be40", grass: "#5bbf79", ice: "#77cfe0",
  fighting: "#d96f68", poison: "#b67dcc", ground: "#c89f6c", flying: "#90a9e7", psychic: "#df779e", bug: "#9bad4e",
  rock: "#a99163", ghost: "#806cae", dragon: "#7769cf", dark: "#746b6c", steel: "#91a9b1", fairy: "#d995b3"
};

const FALLBACK_DEX = {
  kanto: "bulbasaur ivysaur venusaur charmander charmeleon charizard squirtle wartortle blastoise caterpie weedle pidgey rattata spearow pikachu sandshrew nidoran-f nidoran-m clefairy vulpix jigglypuff zubat oddish paras venonat diglett meowth psyduck mankey growlithe poliwag abra machop bellsprout tentacool geodude ponyta magnemite farfetchd doduo seel grimer shellder gastly drowzee krabby exeggcute cubone hitmonlee lickitung koffing rhyhorn chansey tangela kangaskhan horsea goldeen staryu scyther pinsir eevee porygon omanyte kabuto dratini".split(" "),
  johto: "chikorita bayleef meganium cyndaquil quilava typhlosion totodile croconaw feraligatr sentret hoothoot ledyba spinarak pichu cleffa igglybuff togepi natu mareep hoppip sunkern yanma wooper murkrow misdreavus girafarig pineco dunsparce gligar snubbull qwilfish shuckle heracross sneasel teddiursa slugma swinub corsola remoraid delibird mantine skarmory houndour phanpy stantler smoochum elekid magby miltank larvitar".split(" "),
  hoenn: "treecko grovyle sceptile torchic combusken blaziken mudkip marshtomp swampert poochyena zigzagoon wurmple lotad seedot taillow wingull ralts surskit shroomish slakoth nincada whismur makuhita azurill nosepass skitty sableye mawile aron meditite electrike plusle minun volbeat illumise budew gulpin carvanha wailmer numel torkoal spoink trapinch cacnea swablu zangoose seviper lunatone solrock barboach corphish baltoy lileep anorith feebas castform kecleon shuppet duskull tropius chimecho absol snorunt spheal bagon beldum".split(" "),
  sinnoh: "turtwig grotle torterra chimchar monferno infernape piplup prinplup empoleon starly bidoof kricketot shinx budew cranidos shieldon burmy combee pachirisu buizel cherubi shellos drifloon buneary glameow stunky bronzor chatot gible riolu hippopotas skorupi croagunk carnivine finneon snover rotom gliscor mamoswine porygon-z gallade probopass dusknoir froslass".split(" "),
  unova: "snivy servine serperior tepig pignite emboar oshawott dewott samurott patrat lillipup purrloin pansage pansear panpour munna pidove blitzle roggenrola woobat drilbur audino timburr tympole sewaddle venipede cottonee petilil basculin sandile darumaka maractus dwebble scraggy sigilyph yamask tirtouga archen trubbish zorua minccino gothita solosis ducklett vanillite deerling emolga karrablast foongus frillish joltik ferroseed klink tynamo elgyem litwick axew cubchoo cryogonal shelmet mienfoo druddigon golett pawniard rufflet vullaby deino larvesta".split(" "),
  kalos: "chespin quilladin chesnaught fennekin braixen delphox froakie frogadier greninja bunnelby fletchling scatterbug litleo flabebe skiddo pancham furfrou espurr honedge spritzee swirlix inkay binacle skrelp clauncher helioptile tyrunt amaura hawlucha dedenne carbink goomy klefki phantump pumpkaboo bergmite noibat".split(" "),
  alola: "rowlet dartrix decidueye litten torracat incineroar popplio brionne primarina pikipek yungoos grubbin crabrawler oricorio cutiefly rockruff wishiwashi mareanie mudbray dewpider fomantis morelull salandit stufful bounsweet comfey oranguru passimian wimpod sandygast pyukumuku type-null minior komala turtonator togedemaru mimikyu bruxish drampa dhelmise jangmo-o".split(" "),
  galar: "grookey thwackey rillaboom scorbunny raboot cinderace sobble drizzile inteleon skwovet rookidee blipbug nickit gossifleur wooloo chewtle yamper rolycoly applin silicobra cramorant arrokuda toxel sizzlipede clobbopus sinistea hatenna impidimp milcery pincurchin snom eiscue indeedee morpeko cufant dreepy".split(" "),
  paldea: "sprigatito floragato meowscarada fuecoco crocalor skeledirge quaxly quaxwell quaquaval lechonk tarountula nymble pawmi smoliv nacli charcadet tadbulb wattrel maschiff shroodle fidough squawkabilly naclstack capsakid rellor flittle tinkatink wiglett bombirdier varoom cyclizar orthworm glimmet greavard flamigo cetoddle veluza dondozo tatsugiri frigibax gimmighoul".split(" ")
};

const STAGES = [
  { id: "pick-1", kind: "pick", label: "Draft 1", sub: "Escolha um Pokémon para o seu time.", number: 2 },
  { id: "roll-early", kind: "roll", label: "Encontro 1", sub: "Um encontro fácil no começo da jornada.", tier: "early", number: 3 },
  { id: "pick-2", kind: "pick", label: "Draft 2", sub: "Agora é sua vez de escolher de novo.", number: 4 },
  { id: "roll-mid", kind: "roll", label: "Encontro 2", sub: "Um encontro um pouco mais raro na rota.", tier: "mid", number: 5 },
  { id: "pick-3", kind: "pick", label: "Draft 3", sub: "A última escolha fecha o time de seis.", number: 6 },
];

const state = {
  selectedRegion: "kanto",
  teams: [],
  dex: [],
  cache: new Map(),
  stageIndex: -1,
  playerIndex: 0,
  turnOrder: [],
  turnPos: 0,
  candidate: null,
  seenCandidates: new Set(),
  replacement: null,
  loading: false,
  cryQueue: [],
  cryAudio: null,
  cryVolume: 0.46,
  draftStarted: false,
};

const net = {
  mode: "local",
  role: "local",
  peer: null,
  connections: new Map(),
  roomId: null,
  seatIndex: null,
  connectedPeers: 0,
  seats: {},
  status: "idle",
  error: null,
  hostConn: null,
  guestDecidedSeat: false,
};

const el = {
  setup: document.querySelector("#setup-screen"),
  draft: document.querySelector("#draft-screen"),
  regionGrid: document.querySelector("#region-grid"),
  gameLabel: document.querySelector("#selected-game-label"),
  gameDescription: document.querySelector("#game-description"),
  playerCount: document.querySelector("#player-count"),
  nicknameFields: document.querySelector("#nickname-fields"),
  start: document.querySelector("#start-draft"),
  newDraft: document.querySelector("#new-draft"),
  backToMenu: document.querySelector("#back-to-menu"),
  gameContext: document.querySelector("#game-context"),
  draftOverline: document.querySelector("#draft-overline"),
  draftTitle: document.querySelector("#draft-title"),
  draftDescription: document.querySelector("#draft-description"),
  draftProgress: document.querySelector("#draft-progress"),
  teamsList: document.querySelector("#teams-list"),
  teamTotal: document.querySelector("#team-total"),
  action: document.querySelector("#action-content"),
  cardTemplate: document.querySelector("#pokemon-card-template"),
  cryVolume: document.querySelector("#cry-volume"),
  cryVolumeValue: document.querySelector("#cry-volume-value"),
  netStatus: document.querySelector("#net-status"),
  mpHostPanel: document.querySelector("#mp-host-panel"),
  mpGuestPanel: document.querySelector("#mp-guest-panel"),
  mpRoomShare: document.querySelector("#mp-room-share"),
  roomCodeInput: document.querySelector("#room-code-input"),
  joinRoom: document.querySelector("#join-room"),
  joinError: document.querySelector("#join-error"),
  roomCodeDisplay: document.querySelector("#room-code-display"),
  roomLinkDisplay: document.querySelector("#room-link-display"),
  copyRoomLink: document.querySelector("#copy-room-link"),
  copyFeedback: document.querySelector("#copy-feedback"),
  seatPicker: document.querySelector("#seat-picker"),
  seatList: document.querySelector("#seat-list"),
  spectateBtn: document.querySelector("#spectate-btn"),
  regionCard: document.querySelector(".region-card"),
  playersCard: document.querySelector(".players-card"),
};

function currentRegion() { return REGIONS.find((region) => region.id === state.selectedRegion); }
function cap(value) { return value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function randomFrom(items) { return items[Math.floor(Math.random() * items.length)]; }
function shuffleInPlace(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}
function beginStageTurns(kind = stage()?.kind) {
  if (kind === "pick") state.turnOrder = shuffleInPlace(state.teams.map((_, index) => index));
  else state.turnOrder = state.teams.map((_, index) => index);
  state.turnPos = 0;
  state.playerIndex = state.turnOrder[0] ?? 0;
}
function artFor(id) { return `${ART_URL}/${id}.png`; }
function cryFor(id) { return `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`; }
function isTaken(name) { return state.teams.some((team) => team.pokemon.some((pokemon) => pokemon.name === name)); }
function player() { return state.teams[state.playerIndex]; }
function stage() { return STAGES[state.stageIndex]; }
function isRestrictedStarter(name) {
  return STARTER_LINE_POKEMON.has(name) && !(currentRegion().id === "kalos" && KANTO_STARTER_LINE.has(name));
}

function includeKalosGuestStarters(dex, region) {
  if (region.id !== "kalos") return dex;
  const found = new Set(dex.map((pokemon) => pokemon.name));
  const insertionPoint = Math.max(1, Math.round(dex.length * 0.52));
  const guests = KANTO_STARTER_FINALS
    .filter((pokemon) => !found.has(pokemon.name))
    .map((pokemon, index) => ({ ...pokemon, entry: insertionPoint + index }));
  return [...dex, ...guests].sort((a, b) => a.entry - b.entry || a.id - b.id);
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await mapper(items[index]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function finalDexCacheKey(region, dex) {
  return `pokedraft:final-dex:v1:${region.id}:${dex.map((pokemon) => pokemon.id).join(",")}`;
}

async function finalEvolutionDex(dex, region) {
  const cacheKey = finalDexCacheKey(region, dex);
  try {
    const cachedIds = JSON.parse(localStorage.getItem(cacheKey));
    if (Array.isArray(cachedIds) && cachedIds.length) {
      const cachedIdSet = new Set(cachedIds);
      const cachedDex = dex.filter((pokemon) => cachedIdSet.has(pokemon.id));
      if (cachedDex.length === cachedIds.length) return cachedDex;
    }
  } catch (_) {}

  const species = await mapWithConcurrency(dex, 18, async (pokemon) => {
    const response = await fetch(`${POKE_API}/pokemon-species/${pokemon.id}`);
    if (!response.ok) throw new Error(`Não foi possível confirmar a evolução de ${pokemon.name}`);
    return response.json();
  });
  const hasFurtherEvolution = new Set(species.map((pokemon) => pokemon.evolves_from_species?.name).filter(Boolean));
  const finalDex = dex.filter((pokemon) => !hasFurtherEvolution.has(pokemon.name));
  if (finalDex.length < 6) throw new Error("Pokédex final incompleta");
  try { localStorage.setItem(cacheKey, JSON.stringify(finalDex.map((pokemon) => pokemon.id))); } catch (_) {}
  return finalDex;
}

function queueCry(pokemon) {
  const source = pokemon.cry || cryFor(pokemon.id);
  if (!source || !pokemon.id) return;
  state.cryQueue.push(source);
  playNextCry();
}

function cryVolumeLevel() {
  return Math.max(0, Math.min(1, Number(state.cryVolume) || 0));
}

function setCryVolume(rawValue) {
  const percent = Math.max(0, Math.min(100, Number(rawValue)));
  state.cryVolume = percent / 100;
  if (el.cryVolume) el.cryVolume.value = String(Math.round(percent));
  if (el.cryVolumeValue) el.cryVolumeValue.textContent = `${Math.round(percent)}%`;
  if (state.cryAudio) state.cryAudio.volume = cryVolumeLevel();
  try { localStorage.setItem("pokedraft:cry-volume", String(Math.round(percent))); } catch (_) {}
}

function playNextCry() {
  if (state.cryAudio || !state.cryQueue.length) return;
  const source = state.cryQueue.shift();
  const audio = new Audio(source);
  audio.volume = cryVolumeLevel();
  state.cryAudio = audio;
  const finish = () => {
    if (state.cryAudio !== audio) return;
    state.cryAudio = null;
    playNextCry();
  };
  audio.addEventListener("ended", finish, { once: true });
  audio.addEventListener("error", finish, { once: true });
  audio.play().catch(finish);
}

function stopCries() {
  state.cryQueue = [];
  if (state.cryAudio) state.cryAudio.pause();
  state.cryAudio = null;
}

/* ——— Multiplayer helpers ——— */

function randomRoomCode(length = 6) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < length; i += 1) code += alphabet[Math.floor(Math.random() * alphabet.length)];
  return code;
}

function peerIdFromRoom(code) {
  return `pokedraft-${String(code).trim().toUpperCase()}`;
}

function roomCodeFromPeerId(peerId) {
  const match = String(peerId || "").match(/^pokedraft-(.+)$/i);
  return match ? match[1].toUpperCase() : String(peerId || "").toUpperCase();
}

function roomLink(code) {
  const url = new URL(window.location.href);
  url.hash = "";
  url.search = "";
  url.searchParams.set("room", code);
  return url.toString();
}

function serializePokemon(pokemon) {
  if (!pokemon) return null;
  return {
    id: pokemon.id,
    name: pokemon.name,
    entry: pokemon.entry,
    types: [...(pokemon.types || [])],
    image: pokemon.image || artFor(pokemon.id),
    cry: pokemon.cry || cryFor(pokemon.id),
    source: pokemon.source,
    tier: pokemon.tier,
  };
}

function serializeSnapshot() {
  return {
    selectedRegion: state.selectedRegion,
    teams: state.teams.map((team) => ({
      id: team.id,
      name: team.name,
      pokemon: team.pokemon.map(serializePokemon),
    })),
    dex: state.dex.map((p) => ({ id: p.id, name: p.name, entry: p.entry })),
    stageIndex: state.stageIndex,
    playerIndex: state.playerIndex,
    turnOrder: [...state.turnOrder],
    turnPos: state.turnPos,
    candidate: serializePokemon(state.candidate),
    replacement: state.replacement
      ? {
          ...state.replacement,
          resume: state.replacement.resume ? { ...state.replacement.resume } : null,
        }
      : null,
    seenCandidates: [...state.seenCandidates],
    loading: state.loading,
    draftStarted: state.draftStarted,
    seats: { ...net.seats },
  };
}

function applySnapshot(snapshot) {
  if (!snapshot) return;
  const prevCandidateName = state.candidate?.name;
  state.selectedRegion = snapshot.selectedRegion;
  state.teams = (snapshot.teams || []).map((team) => ({
    id: team.id,
    name: team.name,
    pokemon: (team.pokemon || []).map((p) => ({ ...p })),
  }));
  state.dex = (snapshot.dex || []).map((p) => ({ ...p }));
  state.stageIndex = snapshot.stageIndex;
  state.playerIndex = snapshot.playerIndex;
  state.turnOrder = [...(snapshot.turnOrder || [])];
  state.turnPos = snapshot.turnPos;
  state.candidate = snapshot.candidate ? { ...snapshot.candidate } : null;
  state.replacement = snapshot.replacement
    ? { ...snapshot.replacement, resume: snapshot.replacement.resume ? { ...snapshot.replacement.resume } : null }
    : null;
  state.seenCandidates = new Set(snapshot.seenCandidates || []);
  state.loading = Boolean(snapshot.loading);
  state.draftStarted = Boolean(snapshot.draftStarted);
  net.seats = { ...(snapshot.seats || {}) };

  state.teams.forEach((team) => {
    team.pokemon.forEach((p) => { if (p?.name) state.cache.set(p.name, p); });
  });
  if (state.candidate?.name) state.cache.set(state.candidate.name, state.candidate);

  if (state.draftStarted) {
    el.setup.hidden = true;
    el.draft.hidden = false;
    el.newDraft.hidden = false;
    const region = currentRegion();
    if (region) el.gameContext.textContent = `${region.name} · ${region.games}`;
  }

  if (net.role === "guest" && state.candidate?.name && state.candidate.name !== prevCandidateName) {
    queueCry(state.candidate);
  }

  // Keep local seatIndex in sync with seats map for this peer
  if (net.role === "guest" && net.peer?.id) {
    const mapped = net.seats[net.peer.id];
    if (mapped != null) {
      net.seatIndex = mapped;
      net.guestDecidedSeat = true;
    } else if (net.guestDecidedSeat && net.seatIndex != null && !(net.peer.id in net.seats)) {
      // Host cleared our seat
      net.seatIndex = null;
    }
  }

  updateNetStatus();
  updateSeatPicker();
  if (state.draftStarted) renderDraft();
}

function broadcastState() {
  if (net.role !== "host") return;
  const message = { type: "state", snapshot: serializeSnapshot() };
  net.connections.forEach((conn) => {
    if (conn.open) {
      try { conn.send(message); } catch (_) {}
    }
  });
}

function notifyStateChanged() {
  broadcastState();
}

function updateNetStatus() {
  if (!el.netStatus) return;
  el.netStatus.classList.remove("is-host", "is-guest", "is-error", "is-connecting");
  if (net.status === "error") {
    el.netStatus.textContent = net.error || "Erro de conexão";
    el.netStatus.classList.add("is-error");
    return;
  }
  if (net.status === "connecting") {
    el.netStatus.textContent = "Conectando…";
    el.netStatus.classList.add("is-connecting");
    return;
  }
  if (net.role === "host" && net.roomId) {
    const peers = net.connectedPeers;
    el.netStatus.textContent = `Sala ${net.roomId} · Host${peers ? ` · ${peers} conectado${peers === 1 ? "" : "s"}` : ""}`;
    el.netStatus.classList.add("is-host");
    return;
  }
  if (net.role === "guest" && net.roomId) {
    const seat = net.seatIndex != null && state.teams[net.seatIndex]
      ? ` · ${state.teams[net.seatIndex].name}`
      : net.guestDecidedSeat ? " · Espectador" : "";
    el.netStatus.textContent = `Sala ${net.roomId} · Conectado como Guest${seat}`;
    el.netStatus.classList.add("is-guest");
    return;
  }
  el.netStatus.textContent = "Local";
}

function showRoomShare(code) {
  if (!el.mpRoomShare) return;
  el.mpRoomShare.hidden = false;
  el.roomCodeDisplay.textContent = code;
  el.roomLinkDisplay.textContent = roomLink(code);
}

function hideRoomShare() {
  if (el.mpRoomShare) el.mpRoomShare.hidden = true;
}

function destroyPeer() {
  net.connections.forEach((conn) => { try { conn.close(); } catch (_) {} });
  net.connections.clear();
  if (net.hostConn) {
    try { net.hostConn.close(); } catch (_) {}
    net.hostConn = null;
  }
  if (net.peer) {
    try { net.peer.destroy(); } catch (_) {}
    net.peer = null;
  }
  net.connectedPeers = 0;
  net.roomId = null;
  net.seats = {};
  net.seatIndex = null;
  net.guestDecidedSeat = false;
  net.status = "idle";
  net.error = null;
  hideRoomShare();
  updateNetStatus();
}

function activeTurnPlayerIndex() {
  if (state.replacement) return state.replacement.playerIndex;
  return state.playerIndex;
}

function seatOwnerPeerId(teamIndex) {
  return Object.keys(net.seats).find((peerId) => net.seats[peerId] === teamIndex) || null;
}

function canControlSeat(teamIndex) {
  if (net.role === "local") return true;
  if (net.role === "host") return true;
  if (net.role === "guest") return net.seatIndex === teamIndex;
  return false;
}

function isInteractiveClient() {
  return net.role === "local" || net.role === "host" || (net.role === "guest" && canControlSeat(activeTurnPlayerIndex()));
}

function sendGuestAction(action, payload = {}) {
  if (net.role !== "guest" || !net.hostConn || !net.hostConn.open) {
    showJoinError("Sem conexão com o anfitrião. Tente entrar novamente.");
    return;
  }
  try {
    net.hostConn.send({ type: "action", action, payload });
  } catch (error) {
    showJoinError("Falha ao enviar ação. Verifique a conexão.");
  }
}

function showJoinError(message) {
  if (!el.joinError) return;
  el.joinError.hidden = !message;
  el.joinError.textContent = message || "";
}

function setMpMode(mode) {
  net.mode = mode;
  document.querySelectorAll(".mp-mode-option").forEach((btn) => {
    btn.ariaChecked = String(btn.dataset.mode === mode);
  });
  if (el.mpHostPanel) el.mpHostPanel.hidden = mode !== "host";
  if (el.mpGuestPanel) el.mpGuestPanel.hidden = mode !== "guest";
  const hideSetupForms = mode === "guest";
  if (el.regionCard) el.regionCard.hidden = hideSetupForms;
  if (el.playersCard) el.playersCard.hidden = hideSetupForms;
  if (el.start) el.start.hidden = hideSetupForms;
  showJoinError("");
}

function wireHostConnection(conn) {
  net.connections.set(conn.peer, conn);
  net.connectedPeers = net.connections.size;
  updateNetStatus();

  const sendSnap = () => {
    try {
      conn.send({ type: "state", snapshot: serializeSnapshot() });
    } catch (_) {}
    updateNetStatus();
  };
  conn.on("open", sendSnap);
  if (conn.open) sendSnap();

  conn.on("data", (data) => {
    if (!data || typeof data !== "object") return;
    if (data.type === "action") handleHostAction(conn.peer, data.action, data.payload || {});
  });

  conn.on("close", () => {
    net.connections.delete(conn.peer);
    if (net.seats[conn.peer] != null) delete net.seats[conn.peer];
    net.connectedPeers = net.connections.size;
    updateNetStatus();
    notifyStateChanged();
    if (state.draftStarted) renderDraft();
  });

  conn.on("error", () => {
    net.connections.delete(conn.peer);
    net.connectedPeers = net.connections.size;
    updateNetStatus();
  });
}

function createHostRoom() {
  return new Promise((resolve, reject) => {
    if (typeof Peer === "undefined") {
      reject(new Error("PeerJS não carregou. Verifique sua conexão e tente novamente."));
      return;
    }
    const code = randomRoomCode(6);
    const peerId = peerIdFromRoom(code);
    // Preserve role while resetting peer sockets
    const keepRole = "host";
    net.connections.forEach((c) => { try { c.close(); } catch (_) {} });
    net.connections.clear();
    if (net.hostConn) { try { net.hostConn.close(); } catch (_) {} net.hostConn = null; }
    if (net.peer) { try { net.peer.destroy(); } catch (_) {} net.peer = null; }
    net.connectedPeers = 0;
    net.seats = {};
    net.seatIndex = null;
    net.guestDecidedSeat = false;
    net.error = null;

    net.status = "connecting";
    net.role = keepRole;
    net.roomId = code;
    updateNetStatus();

    let settled = false;
    const peer = new Peer(peerId, { debug: 0 });
    net.peer = peer;

    const fail = (err) => {
      if (settled) return;
      settled = true;
      net.status = "error";
      net.error = err?.message || "Falha ao criar a sala PeerJS.";
      updateNetStatus();
      try { peer.destroy(); } catch (_) {}
      net.peer = null;
      reject(new Error(net.error + " Você ainda pode jogar localmente."));
    };

    peer.on("open", (id) => {
      if (settled) return;
      settled = true;
      net.roomId = roomCodeFromPeerId(id);
      net.status = "connected";
      net.role = "host";
      showRoomShare(net.roomId);
      updateNetStatus();
      resolve(net.roomId);
    });

    peer.on("connection", (conn) => {
      wireHostConnection(conn);
    });

    peer.on("error", (err) => {
      const msg = err?.type === "unavailable-id"
        ? "Código de sala indisponível. Tente novamente."
        : (err?.message || "Erro no PeerJS.");
      fail(new Error(msg));
    });

    setTimeout(() => {
      if (!settled) fail(new Error("Tempo esgotado ao conectar ao broker PeerJS."));
    }, 15000);
  });
}

function joinHostRoom(code) {
  return new Promise((resolve, reject) => {
    if (typeof Peer === "undefined") {
      reject(new Error("PeerJS não carregou. Verifique sua conexão e tente novamente."));
      return;
    }
    const clean = String(code || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (clean.length < 4) {
      reject(new Error("Informe um código de sala válido."));
      return;
    }
    net.connections.forEach((c) => { try { c.close(); } catch (_) {} });
    net.connections.clear();
    if (net.hostConn) { try { net.hostConn.close(); } catch (_) {} net.hostConn = null; }
    if (net.peer) { try { net.peer.destroy(); } catch (_) {} net.peer = null; }
    net.connectedPeers = 0;
    net.seats = {};
    net.error = null;

    net.status = "connecting";
    net.role = "guest";
    net.roomId = clean;
    net.guestDecidedSeat = false;
    net.seatIndex = null;
    updateNetStatus();
    showJoinError("");

    let settled = false;
    const peer = new Peer(undefined, { debug: 0 });
    net.peer = peer;

    const fail = (err) => {
      if (settled) return;
      settled = true;
      net.status = "error";
      net.error = err?.message || "Não foi possível entrar na sala.";
      updateNetStatus();
      showJoinError(net.error + " Confira o código e se o anfitrião está online.");
      try { peer.destroy(); } catch (_) {}
      net.peer = null;
      reject(new Error(net.error));
    };

    peer.on("open", () => {
      const conn = peer.connect(peerIdFromRoom(clean), { reliable: true });
      net.hostConn = conn;

      const openTimer = setTimeout(() => {
        fail(new Error("Não foi possível conectar ao anfitrião."));
      }, 15000);

      conn.on("open", () => {
        clearTimeout(openTimer);
        if (settled) return;
        settled = true;
        net.status = "connected";
        net.role = "guest";
        updateNetStatus();
        resolve(clean);
      });

      conn.on("data", (data) => {
        if (!data || typeof data !== "object") return;
        if (data.type === "state") applySnapshot(data.snapshot);
        if (data.type === "error" && data.message) showJoinError(data.message);
      });

      conn.on("close", () => {
        if (net.role === "guest") {
          net.status = "error";
          net.error = "Conexão com o anfitrião encerrada.";
          updateNetStatus();
          showJoinError("O anfitrião desconectou ou fechou a página.");
        }
      });

      conn.on("error", () => {
        fail(new Error("Erro na conexão com o anfitrião."));
      });
    });

    peer.on("error", (err) => {
      fail(new Error(err?.message || "Erro no PeerJS ao entrar na sala."));
    });
  });
}

function canGuestActOnSeat(peerId, teamIndex) {
  const owner = seatOwnerPeerId(teamIndex);
  if (owner) return owner === peerId;
  return false;
}

async function handleHostAction(peerId, action, payload) {
  if (net.role !== "host") return;

  if (action === "claimSeat") {
    const teamIndex = Number(payload.teamIndex);
    if (!Number.isInteger(teamIndex) || teamIndex < 0 || teamIndex >= state.teams.length) return;
    const takenByOther = Object.entries(net.seats).some(([id, idx]) => idx === teamIndex && id !== peerId);
    if (takenByOther) {
      const conn = net.connections.get(peerId);
      if (conn?.open) conn.send({ type: "error", message: "Este assento já foi reivindicado." });
      return;
    }
    delete net.seats[peerId];
    net.seats[peerId] = teamIndex;
    notifyStateChanged();
    renderDraft();
    return;
  }

  if (action === "spectate") {
    delete net.seats[peerId];
    notifyStateChanged();
    renderDraft();
    return;
  }

  const turnIndex = activeTurnPlayerIndex();

  if (action === "choosePokemon") {
    if (!canGuestActOnSeat(peerId, turnIndex)) return;
    const name = payload.name;
    if (!name) return;
    const base = state.dex.find((p) => p.name === name) || state.cache.get(name) || { name };
    const active = state.replacement || { ...stage(), playerIndex: state.playerIndex };
    await choosePokemonLocal(base, active);
    return;
  }

  if (action === "keepRoll") {
    if (!canGuestActOnSeat(peerId, turnIndex)) return;
    if (!state.candidate) return;
    const active = state.replacement || { ...stage(), playerIndex: state.playerIndex };
    await choosePokemonLocal(state.candidate, active);
    return;
  }

  if (action === "reroll") {
    if (!canGuestActOnSeat(peerId, turnIndex)) return;
    const active = state.replacement || { ...stage(), playerIndex: state.playerIndex };
    const activeTeam = state.teams[active.playerIndex];
    state.candidate = null;
    await rollCandidate(active, activeTeam);
    return;
  }

  if (action === "removePokemon") {
    const teamIndex = Number(payload.teamIndex);
    const slotIndex = Number(payload.slotIndex);
    if (!canGuestActOnSeat(peerId, teamIndex)) return;
    removePokemonLocal(teamIndex, slotIndex);
  }
}

function updateSeatPicker() {
  if (!el.seatPicker) return;
  const show = net.role === "guest" && state.draftStarted && !net.guestDecidedSeat;
  el.seatPicker.hidden = !show;
  if (!show) return;

  el.seatList.innerHTML = "";
  state.teams.forEach((team, index) => {
    const owner = seatOwnerPeerId(index);
    const mine = net.seatIndex === index;
    const taken = owner && owner !== net.peer?.id;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `seat-option${mine ? " is-mine" : ""}`;
    btn.disabled = Boolean(taken);
    btn.innerHTML = `<span>${escapeHTML(team.name)}</span><span class="seat-option-meta">${taken ? "Ocupado" : mine ? "Seu assento" : `${team.pokemon.length}/6`}</span>`;
    btn.addEventListener("click", () => {
      net.seatIndex = index;
      net.guestDecidedSeat = true;
      sendGuestAction("claimSeat", { teamIndex: index });
      updateSeatPicker();
      updateNetStatus();
      renderDraft();
    });
    el.seatList.append(btn);
  });
}

function claimSpectate() {
  net.seatIndex = null;
  net.guestDecidedSeat = true;
  sendGuestAction("spectate");
  updateSeatPicker();
  updateNetStatus();
  renderDraft();
}

function lockedNoteMarkup() {
  if (isInteractiveClient() || net.role === "local") return "";
  const name = state.teams[activeTurnPlayerIndex()]?.name || "outro treinador";
  if (net.role === "guest" && !net.guestDecidedSeat) {
    return `<p class="action-locked-note">Escolha um assento acima para jogar, ou assista ao draft.</p>`;
  }
  if (net.role === "guest" && net.seatIndex == null) {
    return `<p class="action-locked-note">Você está assistindo. Aguardando a jogada de <strong>${escapeHTML(name)}</strong>.</p>`;
  }
  return `<p class="action-locked-note">Aguardando a jogada de <strong>${escapeHTML(name)}</strong>.</p>`;
}

function renderRegions() {
  el.regionGrid.innerHTML = "";
  REGIONS.forEach((region, index) => {
    const button = document.createElement("button");
    button.className = "region-option";
    button.type = "button";
    button.role = "radio";
    button.ariaChecked = String(region.id === state.selectedRegion);
    button.innerHTML = `<span class="region-index">${String(index + 1).padStart(2, "0")}</span><span class="region-name">${region.name}</span><span class="region-game">${region.games}</span>`;
    button.addEventListener("click", () => { state.selectedRegion = region.id; renderRegions(); });
    el.regionGrid.append(button);
  });
  const region = currentRegion();
  el.gameLabel.textContent = region.name;
  el.gameDescription.textContent = region.note;
}

function renderNicknameFields() {
  const count = Number(el.playerCount.value);
  const previous = [...el.nicknameFields.querySelectorAll("input")].map((input) => input.value);
  el.nicknameFields.innerHTML = "";
  for (let number = 1; number <= count; number += 1) {
    const field = document.createElement("label");
    field.className = "nickname-field";
    field.innerHTML = `<span class="nickname-number">${String(number).padStart(2, "0")}</span><input class="nickname-input" maxlength="18" placeholder="Treinador ${number}" value="${previous[number - 1] || ""}" aria-label="Apelido do treinador ${number}" />`;
    el.nicknameFields.append(field);
  }
}

async function fetchDex(region) {
  const dexResults = await Promise.all(region.dexes.map(async (dexName) => {
    const response = await fetch(`${POKE_API}/pokedex/${dexName}`);
    if (!response.ok) throw new Error(`Pokédex ${dexName} indisponível`);
    return response.json();
  }));
  const found = new Map();
  let regionalOrder = 1;
  dexResults.forEach((dex) => dex.pokemon_entries.forEach((entry) => {
    const match = entry.pokemon_species.url.match(/\/(\d+)\/$/);
    const id = Number(match?.[1]);
    const name = entry.pokemon_species.name;
    if (id && !SPECIAL_POKEMON.has(name) && !found.has(name)) {
      found.set(name, { id, name, entry: regionalOrder });
      regionalOrder += 1;
    }
  }));
  return [...found.values()].sort((a, b) => a.entry - b.entry);
}

function fallbackDex(region) {
  return (FALLBACK_DEX[region.id] || FALLBACK_DEX.kanto).map((name, index) => ({ id: index + 1, name, entry: index + 1 }));
}

async function hydratePokemon(base) {
  const key = base.name || base;
  if (state.cache.has(key)) return state.cache.get(key);
  const fallback = typeof base === "string" ? state.dex.find((item) => item.name === base) : base;
  try {
    const response = await fetch(`${POKE_API}/pokemon/${key}`);
    if (!response.ok) throw new Error("Pokémon não encontrado");
    const raw = await response.json();
    const value = {
      id: raw.id,
      name: raw.name,
      entry: fallback?.entry || raw.id,
      types: raw.types.sort((a, b) => a.slot - b.slot).map((item) => item.type.name),
      image: raw.sprites.other?.["official-artwork"]?.front_default || raw.sprites.front_default || artFor(raw.id),
      cry: raw.cries?.latest || raw.cries?.legacy || cryFor(raw.id),
    };
    state.cache.set(key, value);
    return value;
  } catch (error) {
    const value = { id: fallback?.id || 0, name: key, entry: fallback?.entry || 0, types: [], image: artFor(fallback?.id || 0), cry: cryFor(fallback?.id || 0) };
    state.cache.set(key, value);
    return value;
  }
}

async function hydrateBatch(items) {
  await Promise.all(items.map((item) => hydratePokemon(item)));
}

function freshStart() {
  const names = [...el.nicknameFields.querySelectorAll("input")].map((input, index) => input.value.trim() || `Treinador ${index + 1}`);
  state.teams = names.map((name, index) => ({ id: index, name, pokemon: [] }));
  state.dex = [];
  state.cache.clear();
  state.stageIndex = -1;
  state.playerIndex = 0;
  state.turnOrder = [];
  state.turnPos = 0;
  state.candidate = null;
  state.replacement = null;
  state.seenCandidates.clear();
  state.draftStarted = false;
  state.loading = false;
  stopCries();
}

async function startDraft() {
  if (net.mode === "guest") return;

  freshStart();
  const region = currentRegion();
  el.start.disabled = true;
  el.start.textContent = "Preparando Pokédex…";
  el.setup.hidden = true;
  el.draft.hidden = false;
  el.newDraft.hidden = false;
  el.gameContext.textContent = `${region.name} · ${region.games}`;
  el.draftOverline.textContent = "CARREGANDO POKÉDEX";
  el.draftTitle.textContent = `Abrindo ${region.name}…`;
  el.draftDescription.textContent = "A lista de espécies está sendo preparada para o seu draft.";
  renderProgress();
  renderTeams();
  el.action.innerHTML = loadingMarkup("Separando encontros e escolhas disponíveis…");

  if (net.mode === "host") {
    try {
      el.draftDescription.textContent = "Criando sala online…";
      await createHostRoom();
    } catch (error) {
      el.draftTitle.textContent = "Não foi possível criar a sala.";
      el.draftDescription.textContent = error.message || "Falha no PeerJS. Tente novamente ou jogue localmente.";
      el.action.innerHTML = `<div class="empty-pool">${escapeHTML(error.message || "Erro PeerJS")}</div>`;
      el.start.disabled = false;
      el.start.innerHTML = "Iniciar PokeDraft <span aria-hidden=\"true\">→</span>";
      return;
    }
  } else {
    net.role = "local";
    destroyPeer();
    net.role = "local";
    updateNetStatus();
  }

  try {
    state.dex = includeKalosGuestStarters(await fetchDex(region), region);
    if (state.dex.length < 10) throw new Error("Pokédex incompleta");
  } catch (error) {
    state.dex = includeKalosGuestStarters(fallbackDex(region), region);
    el.draftDescription.textContent = "A Pokédex de reserva foi ativada. Você ainda pode iniciar seu draft normalmente.";
  }
  el.draftOverline.textContent = "FILTRANDO EVOLUÇÕES";
  el.draftTitle.textContent = "Mantendo apenas formas finais…";
  el.draftDescription.textContent = "Retirando formas base e intermediárias da Pokédex do draft.";
  try {
    state.dex = await finalEvolutionDex(state.dex, region);
  } catch (error) {
    el.draftTitle.textContent = "Não foi possível validar as evoluções.";
    el.draftDescription.textContent = "Verifique sua conexão e inicie novamente para montar a Pokédex final.";
    el.action.innerHTML = `<div class="empty-pool">A validação das evoluções depende da PokéAPI. Tente iniciar o draft novamente.</div>`;
    el.start.disabled = false;
    el.start.innerHTML = "Iniciar PokeDraft <span aria-hidden=\"true\">→</span>";
    return;
  }
  await assignStarters();
  state.stageIndex = 0;
  beginStageTurns("pick");
  state.draftStarted = true;
  renderDraft();
  notifyStateChanged();
  el.start.disabled = false;
  el.start.innerHTML = "Iniciar PokeDraft <span aria-hidden=\"true\">→</span>";
}

async function assignStarters() {
  const region = currentRegion();
  const starters = await Promise.all(region.starters.map((name) => {
    const finalName = STARTER_TO_FINAL[name] || name;
    return hydratePokemon(state.dex.find((item) => item.name === finalName) || { name: finalName });
  }));
  state.teams.forEach((team) => {
    const selected = randomFrom(starters);
    const starter = { ...selected, source: "starter", tier: "starter" };
    team.pokemon.push(starter);
    queueCry(starter);
  });
}

function renderProgress() {
  el.draftProgress.innerHTML = "";
  for (let number = 1; number <= 6; number += 1) {
    const node = document.createElement("span");
    node.className = "progress-node";
    const currentNumber = state.replacement ? state.replacement.number : (stage()?.number || 1);
    if (number < currentNumber) node.classList.add("is-complete");
    if (number === currentNumber && state.stageIndex < STAGES.length) node.classList.add("is-current");
    node.setAttribute("aria-label", `Slot ${number}`);
    el.draftProgress.append(node);
  }
}

function renderTeams() {
  el.teamsList.innerHTML = "";
  const activePlayer = state.replacement ? state.replacement.playerIndex : state.playerIndex;
  state.teams.forEach((team, index) => {
    const row = document.createElement("section");
    const finished = team.pokemon.length === 6;
    const owner = seatOwnerPeerId(index);
    const isMine = net.role === "guest" && net.seatIndex === index;
    const seatBadge = isMine ? `<span class="seat-badge">Você</span>` : (owner && net.role === "host" ? `<span class="seat-badge">Online</span>` : "");
    row.innerHTML = `<div class="trainer-heading"><span class="trainer-name">${escapeHTML(team.name)}${seatBadge}</span><span class="trainer-state">${team.pokemon.length}/6 ${finished ? "· pronto" : ""}</span></div><div class="team-slots"></div>`;
    const slots = row.querySelector(".team-slots");
    for (let slot = 0; slot < 6; slot += 1) {
      const pokemon = team.pokemon[slot];
      const node = document.createElement("div");
      node.className = "team-slot";
      if (pokemon) {
        node.classList.add("has-pokemon");
        const canRemove = canControlSeat(index);
        node.innerHTML = `<img src="${pokemon.image}" alt="${cap(pokemon.name)}" /><span class="team-slot-name">${cap(pokemon.name)}</span>${canRemove ? `<button class="remove-pokemon" type="button" aria-label="Remover ${cap(pokemon.name)}">×</button>` : ""}`;
        const removeBtn = node.querySelector("button");
        if (removeBtn) {
          removeBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            requestRemovePokemon(index, slot);
          });
        }
      } else if (index === activePlayer && !finished) {
        node.classList.add("is-active");
      }
      slots.append(node);
    }
    el.teamsList.append(row);
  });
  const total = state.teams.reduce((sum, team) => sum + team.pokemon.length, 0);
  el.teamTotal.textContent = `${total} / ${state.teams.length * 6}`;
}

function escapeHTML(value) { return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" })[char]); }
function loadingMarkup(message) { return `<div class="encounter-loading"><div><div class="loading-orb" aria-hidden="true"></div><p>${message}</p></div></div>`; }

function renderDraft() {
  updateSeatPicker();
  renderProgress();
  renderTeams();
  if (state.stageIndex >= STAGES.length && !state.replacement) return renderFinish();
  const active = state.replacement || { ...stage(), playerIndex: state.playerIndex };
  const activeTeam = state.teams[active.playerIndex];
  if (!activeTeam) return;
  const isReplacement = Boolean(state.replacement);
  el.draftOverline.textContent = isReplacement ? "REPOSIÇÃO DE TIME" : `${String(active.number).padStart(2, "0")} · ${active.kind === "pick" ? "ESCOLHA" : "ENCONTRO"}`;
  el.draftTitle.textContent = isReplacement ? `${activeTeam.name}, complete sua vaga` : `${active.label} · ${activeTeam.name}`;
  el.draftDescription.textContent = isReplacement ? "Você removeu um Pokémon. Faça uma reposição para manter o time com seis." : active.sub;
  if (active.kind === "pick") renderPick(active, activeTeam, isReplacement);
  else renderRoll(active, activeTeam, isReplacement);
}

function eligiblePickPool() {
  return state.dex.filter((pokemon) => !isTaken(pokemon.name) && !SPECIAL_POKEMON.has(pokemon.name) && !isRestrictedStarter(pokemon.name));
}

function renderPick(active, activeTeam, isReplacement) {
  const pool = eligiblePickPool();
  const defaultVisible = pool.slice(0, 24);
  const interactive = canControlSeat(active.playerIndex);
  el.action.innerHTML = `
    ${lockedNoteMarkup()}
    <div class="turn-title">
      <div><p class="eyebrow">${isReplacement ? "ESCOLHA DE REPOSIÇÃO" : "DRAFT MANUAL"}</p><h2 id="action-title">Escolha com intenção.</h2></div>
      <div class="turn-status">Vez de <strong>${escapeHTML(activeTeam.name)}</strong><br />${pool.length} Pokémon elegíveis</div>
    </div>
    <div class="draft-controls">
      <label class="search-label"><span>Pesquisar na Pokédex</span><input id="pokemon-search" class="search-input" type="search" placeholder="Ex.: Growlithe, água, elétrico" autocomplete="off" ${interactive ? "" : "disabled"} /></label>
      <p class="pool-note">Sem lendários · Pokémon já escolhidos ficam bloqueados</p>
    </div>
    <div id="pokemon-pool" class="pokemon-grid" aria-label="Pokémon disponíveis"></div>`;
  const input = document.querySelector("#pokemon-search");
  const poolNode = document.querySelector("#pokemon-pool");
  const draw = async () => {
    const query = (input?.value || "").trim().toLowerCase();
    const candidates = query
      ? pool.filter((pokemon) => pokemon.name.includes(query) || (state.cache.get(pokemon.name)?.types || []).some((type) => type.includes(query))).slice(0, 32)
      : defaultVisible;
    poolNode.innerHTML = "";
    if (!candidates.length) {
      poolNode.innerHTML = `<div class="empty-pool">Nenhum Pokémon encontrado nesta Pokédex.</div>`;
      return;
    }
    candidates.forEach((pokemon) => {
      const card = createPokemonCard(pokemon, () => {
        if (!interactive) return;
        requestChoosePokemon(pokemon, active);
      });
      if (!interactive) {
        card.classList.add("is-locked");
        card.disabled = true;
      }
      poolNode.append(card);
    });
    if (net.role !== "guest") {
      await hydrateBatch(candidates);
      candidates.forEach((pokemon) => updatePokemonCard(poolNode.querySelector(`[data-pokemon="${pokemon.name}"]`), state.cache.get(pokemon.name)));
    } else {
      candidates.forEach((pokemon) => {
        const cached = state.cache.get(pokemon.name);
        if (cached) updatePokemonCard(poolNode.querySelector(`[data-pokemon="${pokemon.name}"]`), cached);
      });
    }
  };
  if (input) input.addEventListener("input", draw);
  draw();
}

function createPokemonCard(pokemon, onSelect) {
  const fragment = el.cardTemplate.content.cloneNode(true);
  const card = fragment.querySelector("button");
  card.dataset.pokemon = pokemon.name;
  card.querySelector("img").src = artFor(pokemon.id);
  card.querySelector("img").alt = cap(pokemon.name);
  card.querySelector(".pokemon-number").textContent = `#${String(pokemon.entry).padStart(3, "0")}`;
  card.querySelector(".pokemon-name").textContent = cap(pokemon.name);
  card.addEventListener("click", () => onSelect());
  return card;
}

function updatePokemonCard(card, pokemon) {
  if (!card || !pokemon) return;
  card.querySelector("img").src = pokemon.image;
  const types = card.querySelector(".pokemon-types");
  types.innerHTML = pokemon.types.map(typeBadge).join("");
}

function typeBadge(type) { return `<span class="type-badge" style="--type-color:${TYPE_COLORS[type] || "#526070"}">${type}</span>`; }

function requestChoosePokemon(base, active) {
  if (!canControlSeat(active.playerIndex)) return;
  if (net.role === "guest") {
    sendGuestAction("choosePokemon", { name: base.name || base });
    return;
  }
  choosePokemonLocal(base, active);
}

async function choosePokemonLocal(base, active) {
  const info = await hydratePokemon(base);
  addPokemon(active.playerIndex, info, active.kind === "roll" ? "roll" : "pick", active.tier);
  continueAfterChoice();
}

function teamTypeSet(team) { return new Set(team.pokemon.flatMap((pokemon) => pokemon.types || [])); }
function progressionCandidates(tier) {
  const pool = eligiblePickPool();
  const total = Math.max(1, state.dex.length);
  let scoped = pool.filter((pokemon) => {
    const progress = pokemon.entry / total;
    return tier === "early" ? progress <= 0.37 : progress > 0.22 && progress <= 0.78;
  });
  if (scoped.length < 10) scoped = pool;
  return scoped;
}

async function rollCandidate(active, activeTeam) {
  if (net.role === "guest") return;
  state.loading = true;
  state.candidate = null;
  renderRoll(active, activeTeam, Boolean(state.replacement));
  notifyStateChanged();
  const typeSet = teamTypeSet(activeTeam);
  const choices = shuffle(progressionCandidates(active.tier || "early")).filter((pokemon) => !state.seenCandidates.has(pokemon.name));
  let fallback = null;
  for (const base of choices.slice(0, 45)) {
    const info = await hydratePokemon(base);
    if (!fallback) fallback = info;
    if (!info.types.some((type) => typeSet.has(type))) {
      state.candidate = info;
      break;
    }
  }
  state.candidate = state.candidate || fallback || await hydratePokemon(randomFrom(eligiblePickPool()));
  state.seenCandidates.add(state.candidate.name);
  state.candidate.cryQueued = true;
  queueCry(state.candidate);
  state.loading = false;
  renderRoll(active, activeTeam, Boolean(state.replacement));
  notifyStateChanged();
}

function shuffle(items) { return [...items].sort(() => Math.random() - 0.5); }

function renderRoll(active, activeTeam, isReplacement) {
  const interactive = canControlSeat(active.playerIndex);
  if (state.loading) {
    el.action.innerHTML = `${lockedNoteMarkup()}${loadingMarkup("Procurando um encontro que combine com o seu time…")}`;
    return;
  }
  if (!state.candidate) {
    if (net.role === "guest") {
      el.action.innerHTML = `${lockedNoteMarkup()}${loadingMarkup("Aguardando o anfitrião sortear o encontro…")}`;
      return;
    }
    rollCandidate(active, activeTeam);
    return;
  }
  const candidate = state.candidate;
  const currentTypes = teamTypeSet(activeTeam);
  const typesAvoided = candidate.types.length && !candidate.types.some((type) => currentTypes.has(type));
  const tierName = active.tier === "mid" ? "ENCONTRO INTERMEDIÁRIO" : active.tier === "starter" ? "NOVO STARTER" : "ENCONTRO INICIAL";
  el.action.innerHTML = `
    ${lockedNoteMarkup()}
    <div class="turn-title">
      <div><p class="eyebrow">${isReplacement ? "REPOSIÇÃO ALEATÓRIA" : tierName}</p><h2 id="action-title">O que surgiu na rota?</h2></div>
      <div class="turn-status">Vez de <strong>${escapeHTML(activeTeam.name)}</strong><br />${typesAvoided ? "Tipo novo para este time" : "Alternativa disponível"}</div>
    </div>
    <div class="encounter-wrap">
      <span class="encounter-tier">${tierName}</span>
      <div class="encounter-card">
        <img src="${candidate.image}" alt="${cap(candidate.name)}" />
        <h3>${cap(candidate.name)}</h3>
        <div class="pokemon-types">${candidate.types.map(typeBadge).join("")}</div>
        <p>${typesAvoided ? "Evita repetir os tipos que já estão no seu time." : "Não há mais combinações sem repetir tipo neste estágio."}</p>
      </div>
      <div class="encounter-actions">
        <button id="reroll" class="secondary-button" type="button" ${interactive ? "" : "disabled"}>Sortear novamente</button>
        <button id="keep-roll" class="primary-button" type="button" ${interactive ? "" : "disabled"}>Adicionar ao time <span aria-hidden="true">→</span></button>
      </div>
    </div>`;
  const rerollBtn = document.querySelector("#reroll");
  const keepBtn = document.querySelector("#keep-roll");
  if (rerollBtn) {
    rerollBtn.addEventListener("click", () => {
      if (!interactive) return;
      if (net.role === "guest") {
        sendGuestAction("reroll");
        return;
      }
      state.candidate = null;
      rollCandidate(active, activeTeam);
    });
  }
  if (keepBtn) {
    keepBtn.addEventListener("click", () => {
      if (!interactive) return;
      if (net.role === "guest") {
        sendGuestAction("keepRoll");
        return;
      }
      choosePokemonLocal(candidate, active);
    });
  }
}

function addPokemon(teamIndex, pokemon, source, tier) {
  const record = { ...pokemon, source, tier };
  if (!record.cryQueued) queueCry(record);
  state.teams[teamIndex].pokemon.push(record);
  state.candidate = null;
  state.seenCandidates.clear();
}

function continueAfterChoice() {
  if (state.replacement) {
    const saved = state.replacement.resume;
    state.replacement = null;
    state.stageIndex = saved.stageIndex;
    state.playerIndex = saved.playerIndex;
    state.turnPos = Math.max(0, state.turnOrder.indexOf(saved.playerIndex));
    renderDraft();
    notifyStateChanged();
    return;
  }
  if (state.turnPos < state.turnOrder.length - 1) {
    state.turnPos += 1;
    state.playerIndex = state.turnOrder[state.turnPos];
  } else {
    state.stageIndex += 1;
    if (state.stageIndex < STAGES.length) beginStageTurns(STAGES[state.stageIndex].kind);
  }
  renderDraft();
  notifyStateChanged();
}

function requestRemovePokemon(teamIndex, slotIndex) {
  if (!canControlSeat(teamIndex)) return;
  if (net.role === "guest") {
    sendGuestAction("removePokemon", { teamIndex, slotIndex });
    return;
  }
  removePokemonLocal(teamIndex, slotIndex);
}

function removePokemonLocal(teamIndex, slotIndex) {
  const removed = state.teams[teamIndex].pokemon.splice(slotIndex, 1)[0];
  if (!removed) return;
  const resume = { stageIndex: state.stageIndex, playerIndex: state.playerIndex };
  const kind = removed.source === "pick" ? "pick" : "roll";
  state.replacement = { playerIndex: teamIndex, kind, tier: removed.tier === "starter" ? "starter" : removed.tier, number: slotIndex + 1, resume, label: "Reposição" };
  state.candidate = null;
  state.seenCandidates.clear();
  renderDraft();
  notifyStateChanged();
}

function renderFinish() {
  el.draftOverline.textContent = "DRAFT CONCLUÍDO";
  el.draftTitle.textContent = "Todos os times estão prontos.";
  el.draftDescription.textContent = "Cada treinador terminou sua jornada com seis Pokémon.";
  const region = currentRegion();
  const teamCards = state.teams.map((team) => `
    <section class="finish-team" aria-label="Time de ${escapeHTML(team.name)}">
      <div class="finish-team-header">
        <span class="finish-team-name">${escapeHTML(team.name)}</span>
        <span class="finish-team-meta">${escapeHTML(region.name)} · 6 / 6</span>
      </div>
      <div class="finish-team-grid">
        ${team.pokemon.map((pokemon, index) => `
          <article class="finish-pokemon">
            <span class="finish-pokemon-index">#${String(index + 1).padStart(2, "0")}</span>
            <img src="${pokemon.image}" alt="${cap(pokemon.name)}" loading="lazy" />
            <strong class="finish-pokemon-name">${cap(pokemon.name)}</strong>
            <div class="finish-pokemon-types">${pokemon.types.map((type) => `<span class="type-chip" style="background:${TYPE_COLORS[type] || "#526070"}">${type}</span>`).join("")}</div>
          </article>
        `).join("")}
      </div>
    </section>`).join("");
  el.action.innerHTML = `<div class="finish-wrap"><div class="finish-symbol" aria-hidden="true">✓</div><h3>Draft finalizado!</h3><p>Confira o time completo de cada treinador. Você ainda pode remover qualquer Pokémon na barra lateral para fazer uma reposição, ou começar outra aventura.</p><div class="finish-teams">${teamCards}</div><button id="finish-new" class="primary-button" type="button">Começar novo draft <span aria-hidden="true">→</span></button></div>`;
  document.querySelector("#finish-new").addEventListener("click", returnToSetup);
}

function returnToSetup() {
  destroyPeer();
  net.mode = "local";
  net.role = "local";
  setMpMode("local");
  state.draftStarted = false;
  if (el.seatPicker) el.seatPicker.hidden = true;
  el.draft.hidden = true;
  el.setup.hidden = false;
  el.newDraft.hidden = true;
  el.gameContext.textContent = "Preparar um novo draft";
  updateNetStatus();
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has("room")) {
      url.searchParams.delete("room");
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    }
  } catch (_) {}
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function handleJoinClick() {
  const code = el.roomCodeInput?.value || "";
  el.joinRoom.disabled = true;
  el.joinRoom.textContent = "Conectando…";
  showJoinError("");
  try {
    await joinHostRoom(code);
    el.setup.hidden = true;
    el.draft.hidden = false;
    el.newDraft.hidden = false;
    el.draftOverline.textContent = "SALA ONLINE";
    el.draftTitle.textContent = "Conectado — aguardando estado…";
    el.draftDescription.textContent = "Sincronizando o draft com o anfitrião.";
    el.action.innerHTML = loadingMarkup("Recebendo o estado da sala…");
  } catch (error) {
    showJoinError(error.message || "Falha ao entrar na sala.");
  } finally {
    el.joinRoom.disabled = false;
    el.joinRoom.textContent = "Entrar na sala";
  }
}

async function copyRoomLink() {
  if (!net.roomId) return;
  const link = roomLink(net.roomId);
  try {
    await navigator.clipboard.writeText(link);
  } catch (_) {
    const ta = document.createElement("textarea");
    ta.value = link;
    document.body.append(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (_) {}
    ta.remove();
  }
  if (el.copyFeedback) {
    el.copyFeedback.hidden = false;
    setTimeout(() => { el.copyFeedback.hidden = true; }, 2000);
  }
}

function readRoomFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("room");
  } catch (_) {
    return null;
  }
}

el.playerCount.addEventListener("change", renderNicknameFields);
el.start.addEventListener("click", startDraft);
el.newDraft.addEventListener("click", returnToSetup);
el.backToMenu.addEventListener("click", returnToSetup);

document.querySelectorAll(".mp-mode-option").forEach((btn) => {
  btn.addEventListener("click", () => setMpMode(btn.dataset.mode));
});
if (el.joinRoom) el.joinRoom.addEventListener("click", handleJoinClick);
if (el.roomCodeInput) {
  el.roomCodeInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") handleJoinClick();
  });
}
if (el.copyRoomLink) el.copyRoomLink.addEventListener("click", copyRoomLink);
if (el.spectateBtn) el.spectateBtn.addEventListener("click", claimSpectate);

if (el.cryVolume) {
  let savedVolume = 46;
  try {
    const stored = localStorage.getItem("pokedraft:cry-volume");
    if (stored != null && stored !== "") savedVolume = Number(stored);
  } catch (_) {}
  setCryVolume(Number.isFinite(savedVolume) ? savedVolume : 46);
  el.cryVolume.addEventListener("input", (event) => setCryVolume(event.target.value));
}

renderRegions();
renderNicknameFields();
setMpMode("local");
updateNetStatus();

const autoRoom = readRoomFromUrl();
if (autoRoom) {
  setMpMode("guest");
  if (el.roomCodeInput) el.roomCodeInput.value = String(autoRoom).trim().toUpperCase();
  setTimeout(() => { handleJoinClick(); }, 200);
}
