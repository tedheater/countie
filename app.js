const STORAGE_KEY = "tap-counter-v1";

const fallbackColors = ["#0a84ff", "#30d158", "#ff9f0a", "#ff375f", "#64d2ff", "#bf5af2", "#ffd60a"];
const fallbackIcons = ["👆", "👖", "🩳", "👔", "🎒", "☕", "📍"];

const counterGrid = document.getElementById("counter-grid");
const totalCountEl = document.getElementById("total-count");
const settingsDialog = document.getElementById("settings-dialog");
const openSettingsBtn = document.getElementById("open-settings");
const closeSettingsBtn = document.getElementById("close-settings");
const categoryListEl = document.getElementById("category-list");
const addCategoryBtn = document.getElementById("add-category");
const resetCountsBtn = document.getElementById("reset-counts");
const exportCsvBtn = document.getElementById("export-csv");
const installAppBtn = document.getElementById("install-app");
const installHintEl = document.getElementById("install-hint");
const itemTemplate = document.getElementById("category-item-template");

let deferredInstallPrompt = null;
let state = loadState();

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeColor(value, fallback) {
  const validHex = /^#[0-9a-fA-F]{6}$/;
  return validHex.test(value || "") ? value.toLowerCase() : fallback;
}

function normalizeIcon(value, fallback) {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  return Array.from(trimmed).slice(0, 2).join("");
}

function normalizeName(value) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed.slice(0, 24) || "Untitled";
}

function createCategory(index, name) {
  return {
    id: createId(),
    name: normalizeName(name || `Category ${index + 1}`),
    count: 0,
    color: fallbackColors[index % fallbackColors.length],
    icon: fallbackIcons[index % fallbackIcons.length],
  };
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (parsed && Array.isArray(parsed.items) && parsed.items.length) {
      const items = parsed
        .items
        .filter((item) => typeof item?.name === "string")
        .map((item, index) => ({
          id: item.id || createId(),
          name: normalizeName(item.name),
          count: Number.isFinite(item.count) && item.count > 0 ? Math.floor(item.count) : 0,
          color: normalizeColor(item.color, fallbackColors[index % fallbackColors.length]),
          icon: normalizeIcon(item.icon, fallbackIcons[index % fallbackIcons.length]),
        }));
      if (items.length) return { items };
    }
  } catch {
    // Ignore invalid local storage.
  }

  return {
    items: [createCategory(0, "Tap")],
  };
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage write errors.
  }
}

function getGridColumns(total) {
  if (total <= 1) return 1;
  if (total <= 4) return 2;
  return 3;
}

function renderCounters() {
  counterGrid.innerHTML = "";
  const total = state.items.length;
  const cols = getGridColumns(total);
  const rows = Math.ceil(total / cols);
  counterGrid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
  counterGrid.style.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`;

  for (const item of state.items) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "count-btn";
    btn.dataset.id = item.id;
    btn.style.borderColor = `${item.color}7d`;
    btn.style.backgroundImage = `linear-gradient(160deg, ${item.color}59, rgba(255, 255, 255, 0.02))`;
    btn.innerHTML = `
      <span class="count-icon">${escapeHtml(item.icon)}</span>
      <span class="count-label">${escapeHtml(item.name)}</span>
      <strong class="count-value">${item.count}</strong>
    `;
    counterGrid.appendChild(btn);
  }

  updateTotal();
}

function renderSettingsList() {
  categoryListEl.innerHTML = "";

  for (const item of state.items) {
    const fragment = itemTemplate.content.cloneNode(true);
    const row = fragment.querySelector(".category-item");
    const nameInput = fragment.querySelector(".category-input");
    const iconInput = fragment.querySelector(".icon-input");
    const colorInput = fragment.querySelector(".color-input");
    const removeBtn = fragment.querySelector(".remove-btn");

    row.dataset.id = item.id;
    nameInput.value = item.name;
    iconInput.value = item.icon;
    colorInput.value = item.color;

    nameInput.addEventListener("input", (event) => {
      const targetItem = state.items.find((entry) => entry.id === item.id);
      if (!targetItem) return;
      targetItem.name = normalizeName(event.target.value);
      saveState();
      renderCounters();
    });

    const commitIcon = () => {
      const targetItem = state.items.find((entry) => entry.id === item.id);
      if (!targetItem) return;
      targetItem.icon = normalizeIcon(iconInput.value, targetItem.icon);
      iconInput.value = targetItem.icon;
      saveState();
      renderCounters();
    };
    iconInput.addEventListener("change", commitIcon);
    iconInput.addEventListener("blur", commitIcon);

    colorInput.addEventListener("input", (event) => {
      const targetItem = state.items.find((entry) => entry.id === item.id);
      if (!targetItem) return;
      targetItem.color = normalizeColor(event.target.value, targetItem.color);
      saveState();
      renderCounters();
    });

    removeBtn.addEventListener("click", () => {
      if (state.items.length <= 1) return;
      state.items = state.items.filter((entry) => entry.id !== item.id);
      saveState();
      renderCounters();
      renderSettingsList();
    });
    removeBtn.disabled = state.items.length <= 1;

    categoryListEl.appendChild(fragment);
  }
}

function incrementCounter(id) {
  const target = state.items.find((item) => item.id === id);
  if (!target) return;
  target.count += 1;
  saveState();
  const valueEl = counterGrid.querySelector(`.count-btn[data-id="${id}"] .count-value`);
  if (valueEl) valueEl.textContent = String(target.count);
  updateTotal();
}

function resetCounts() {
  state.items = state.items.map((item) => ({ ...item, count: 0 }));
  saveState();
  renderCounters();
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function updateTotal() {
  totalCountEl.textContent = String(state.items.reduce((sum, item) => sum + item.count, 0));
}

function openSettings() {
  renderSettingsList();
  updateInstallUI();
  if (typeof settingsDialog.showModal === "function") settingsDialog.showModal();
  else settingsDialog.setAttribute("open", "");
}

function closeSettings() {
  if (typeof settingsDialog.close === "function") settingsDialog.close();
  else settingsDialog.removeAttribute("open");
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/["\n,]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

function exportCsv() {
  const exportedAt = new Date();
  const total = state.items.reduce((sum, item) => sum + item.count, 0);

  const rows = [
    ["Exported At", exportedAt.toISOString()],
    ["Total", total],
    [],
    ["Category", "Count", "Color", "Icon"],
    ...state.items.map((item) => [item.name, item.count, item.color, item.icon]),
  ];

  const csv = `${rows.map((row) => row.map(csvEscape).join(",")).join("\n")}\n`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const stamp = exportedAt.toISOString().replaceAll(":", "-").replaceAll(".", "-");
  link.href = url;
  link.download = `tap-counter-${stamp}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent || "");
}

function isStandaloneApp() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function updateInstallUI() {
  if (isStandaloneApp()) {
    installAppBtn.hidden = true;
    installHintEl.textContent = "Installed on Home Screen.";
    return;
  }

  if (deferredInstallPrompt) {
    installAppBtn.hidden = false;
    installHintEl.textContent = "Tap Install App for full-screen app mode.";
    return;
  }

  installAppBtn.hidden = true;
  installHintEl.textContent = isIos()
    ? "iPhone: Share menu -> Add to Home Screen"
    : "Use your browser menu to install this app.";
}

counterGrid.addEventListener("click", (event) => {
  const btn = event.target.closest(".count-btn");
  if (!btn) return;
  btn.classList.add("is-pressed");
  setTimeout(() => btn.classList.remove("is-pressed"), 110);
  incrementCounter(btn.dataset.id);
});

openSettingsBtn.addEventListener("click", openSettings);
closeSettingsBtn.addEventListener("click", closeSettings);

addCategoryBtn.addEventListener("click", () => {
  state.items.push(createCategory(state.items.length));
  saveState();
  renderCounters();
  renderSettingsList();
});

resetCountsBtn.addEventListener("click", () => {
  const shouldReset = window.confirm("Reset all counts to zero?");
  if (!shouldReset) return;
  resetCounts();
});

exportCsvBtn.addEventListener("click", exportCsv);

installAppBtn.addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  try {
    await deferredInstallPrompt.userChoice;
  } catch {
    // Ignore choice errors.
  }
  deferredInstallPrompt = null;
  updateInstallUI();
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  updateInstallUI();
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  updateInstallUI();
});

settingsDialog.addEventListener("click", (event) => {
  const box = document.querySelector(".settings-sheet");
  if (!box.contains(event.target)) closeSettings();
});

settingsDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeSettings();
});

if ("serviceWorker" in navigator && window.isSecureContext && window.location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // Ignore service worker registration failures.
    });
  });
}

updateInstallUI();
renderCounters();
