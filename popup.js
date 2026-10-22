// Ads Launcher popup: search, open, add and remove ad-account links.
// Saved in chrome.storage.sync: links (added by the user) and hidden (preset URLs the user removed).
// Starting accounts come from my-links.js (private, not in the repo); without it the list starts empty.
const $ = (id) => document.getElementById(id);
const PRESET_LINKS = self.MY_LINKS || [];
let links = [], sel = 0, shown = [];

function platform(url) {
  if (/facebook\.com/.test(url)) return ["meta", "M"];
  if (/ads\.google\.com/.test(url)) return ["google", "G"];
  if (/tiktok\.com/.test(url)) return ["tiktok", "T"];
  return ["other", "•"];
}

// keep only what identifies the account, so a saved link never pins an old date range
function clean(raw) {
  try {
    const u = new URL(raw);
    if (/facebook\.com$/.test(u.hostname) && u.pathname.startsWith("/adsmanager")) {
      const keep = new URL(u.origin + u.pathname);
      for (const k of ["act", "business_id", "global_scope_id"]) if (u.searchParams.get(k)) keep.searchParams.set(k, u.searchParams.get(k));
      return keep.toString();
    }
    return raw;
  } catch { return raw; }
}

async function load() {
  const s = await chrome.storage.sync.get({ links: [], hidden: [] });
  const urls = new Set(s.links.map((l) => l.url));
  links = [...s.links, ...PRESET_LINKS.filter((p) => !urls.has(p.url) && !s.hidden.includes(p.url))];
  render();
}

function render() {
  const q = $("q").value.trim().toLowerCase();
  shown = links.filter((l) => (l.name + " " + (l.group || "")).toLowerCase().includes(q))
    .sort((a, b) => (a.group || "").localeCompare(b.group || "") || a.name.localeCompare(b.name));
  sel = Math.min(sel, Math.max(shown.length - 1, 0));
  const list = $("list"); list.innerHTML = "";
  let lastGroup = null;
  shown.forEach((l, i) => {
    if ((l.group || "") !== lastGroup && shown.some((x) => x.group)) {
      lastGroup = l.group || "";
      const h = document.createElement("h6"); h.textContent = lastGroup || "Other"; list.append(h);
    }
    const [cls, letter] = platform(l.url);
    const li = document.createElement("li");
    li.className = i === sel ? "sel" : "";
    li.title = l.url;
    li.innerHTML = `<span class="tag ${cls}">${letter}</span><span class="name"></span><button class="del" title="Remove">×</button>`;
    li.querySelector(".name").textContent = l.name;
    li.onclick = (e) => open(l, e.metaKey || e.ctrlKey);
    li.querySelector(".del").onclick = (e) => { e.stopPropagation(); remove(l); };
    list.append(li);
  });
  $("empty").hidden = links.length > 0;
}

// a plain click opens and focuses the tab; Cmd/Ctrl-click opens it in the background and keeps the list open
function open(l, background) {
  chrome.tabs.create({ url: l.url, active: !background });
  if (!background) window.close();
}

async function remove(l) {
  const s = await chrome.storage.sync.get({ links: [], hidden: [] });
  s.links = s.links.filter((x) => x.url !== l.url);
  if (PRESET_LINKS.some((p) => p.url === l.url)) s.hidden.push(l.url);
  await chrome.storage.sync.set(s);
  load();
}

$("q").addEventListener("input", () => { sel = 0; render(); });
$("q").addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") { sel = Math.min(sel + 1, shown.length - 1); render(); e.preventDefault(); }
  if (e.key === "ArrowUp") { sel = Math.max(sel - 1, 0); render(); e.preventDefault(); }
  if (e.key === "Enter" && shown[sel]) open(shown[sel], e.metaKey || e.ctrlKey);
});

$("editBtn").onclick = () => {
  document.body.classList.toggle("editing");
  $("editBtn").textContent = document.body.classList.contains("editing") ? "Done" : "Edit";
};

let pendingUrl = null;
$("addBtn").onclick = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url || !/^https?:/.test(tab.url)) return;
  pendingUrl = clean(tab.url);
  const act = new URL(pendingUrl).searchParams.get("act");
  $("addName").value = act ? "" : (tab.title || "");
  $("addName").placeholder = act ? `Account name (act ${act})` : "Account name";
  $("add").hidden = false; $("addName").focus();
};
$("addCancel").onclick = () => { $("add").hidden = true; $("q").focus(); };
$("add").onsubmit = async (e) => {
  e.preventDefault();
  const s = await chrome.storage.sync.get({ links: [], hidden: [] });
  s.links = s.links.filter((x) => x.url !== pendingUrl);
  s.links.push({ name: $("addName").value.trim(), url: pendingUrl, group: $("addGroup").value.trim() || undefined });
  s.hidden = s.hidden.filter((u) => u !== pendingUrl);
  await chrome.storage.sync.set(s);
  $("add").hidden = true; $("addGroup").value = "";
  load();
};

load();
