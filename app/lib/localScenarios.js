const SCENARIOS_KEY = "freedom-banking-dashboard:scenarios";
const LAST_SESSION_KEY = "freedom-banking-dashboard:lastSession";

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export function readScenarioList() {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(SCENARIOS_KEY);
  if (!raw) return [];
  const data = safeParse(raw, null);
  if (!data || !Array.isArray(data.scenarios)) return [];
  return data.scenarios;
}

export function writeScenarioList(scenarios) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SCENARIOS_KEY, JSON.stringify({ scenarios }));
}

export function appendScenario(name, formSnapshot) {
  const list = readScenarioList();
  const id = `s-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const entry = {
    id,
    name: (name || "").trim() || "Untitled",
    savedAt: new Date().toISOString(),
    form: JSON.parse(JSON.stringify(formSnapshot))
  };
  list.push(entry);
  writeScenarioList(list);
  return list;
}

export function deleteScenarioById(id) {
  const list = readScenarioList().filter((s) => s.id !== id);
  writeScenarioList(list);
  return list;
}

export function readLastSession() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(LAST_SESSION_KEY);
  if (!raw) return null;
  const data = safeParse(raw, null);
  return data && typeof data === "object" ? data : null;
}

export function writeLastSession(formSnapshot) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    LAST_SESSION_KEY,
    JSON.stringify(JSON.parse(JSON.stringify(formSnapshot)))
  );
}
