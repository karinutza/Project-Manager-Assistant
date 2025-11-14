import { birthdays, meetings } from "./company-data";

/* -----------------------------------------------------
 * 1.   INTENT ENGINE - mai inteligent, cu similaritate
 * --------------------------------------------------- */

function similarity(a: string, b: string): number {
  a = a.toLowerCase(); b = b.toLowerCase();
  let hits = 0;
  for (const word of a.split(" ")) {
    if (b.includes(word)) hits++;
  }
  return hits / Math.max(a.split(" ").length, 1);
}

function detectIntent(q: string) {
  const intents = [
    { key: "greeting", ex: ["hei", "salut", "buna", "hey", "hello"] },
    { key: "birthday_person", ex: ["ziua lui", "cand e ziua", "birthday of"] },
    { key: "birthday_today", ex: ["azi e ziua", "today birthday"] },
    { key: "meeting_today", ex: ["meeting azi", "întâlniri azi"] },
    { key: "meeting_date", ex: ["meeting pe", "întâlnire pe"] },
    { key: "schedule", ex: ["program", "orar", "la cat lucrez"] },
    { key: "smalltalk", ex: ["ce faci", "cum esti", "esti ok", "esti acolo"] },
  ];

  let best = { intent: "unknown", score: 0 };

  for (const i of intents) {
    for (const ex of i.ex) {
      const s = similarity(q, ex);
      if (s > best.score) best = { intent: i.key, score: s };
    }
  }

  return best.intent;
}


/* -----------------------------------------------------
 * 2. Extractors (nume, data)
 * --------------------------------------------------- */

function extractName(q: string): string | null {
  const patterns = [
    /lui\s+([a-zA-Z ]+)/,
    /despre\s+([a-zA-Z ]+)/,
    /a cui\s+([a-zA-Z ]+)/,
  ];

  for (const p of patterns) {
    const m = q.match(p);
    if (m) return m[1].trim();
  }
  return null;
}

function extractDate(q: string): string | null {
  const day = q.match(/(\d{1,2})/);
  const month = q.match(/ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie/);

  if (!day || !month) return null;

  const months: any = {
    ianuarie: 1, februarie: 2, martie: 3, aprilie: 4, mai: 5, iunie: 6,
    iulie: 7, august: 8, septembrie: 9, octombrie: 10, noiembrie: 11, decembrie: 12,
  };

  return `2025-${String(months[month[0]]).padStart(2,"0")}-${String(day[1]).padStart(2,"0")}`;
}


/* -----------------------------------------------------
 * 3. Natural Response Generator (AICI e “magia”)
 * --------------------------------------------------- */

function respond(intent: string, q: string) {
  // 1. SALUTĂ NATURAL
  if (intent === "greeting")
    return [
      "Hei! Ce pot face pentru tine azi? 😄",
      "Salut! Sunt aici dacă ai nevoie de ceva legat de job.",
      "Bună! Cum te pot ajuta? 😊"
    ][Math.floor(Math.random() * 3)];

  // 2. SMALLTALK
  if (intent === "smalltalk")
    return [
      "Sunt pe aici, pregătit să te ajut cu orice despre muncă 🙂",
      "Totul bine! Tu cum ești? Dacă ai o întrebare legată de firmă, spune-mi!",
      "Super! Hai să vedem ce pot face pentru tine 🤖"
    ][Math.floor(Math.random() * 3)];

  // 3. ZIUA CUVA
  if (intent === "birthday_person") {
    const name = extractName(q);
    if (!name) return "Despre cine vrei să afli? 😊";

    const person = birthdays.find(p => p.name.toLowerCase().includes(name.toLowerCase()));
    if (!person) return `Nu am găsit pe nimeni pe nume **${name}**.`;

    return `🎂 Ziua lui **${person.name}** este pe **${person.date}**!`;
  }

  // 4. ZILE DE NASTERE AZI
  if (intent === "birthday_today") {
    const today = new Date().toISOString().slice(0, 10);
    const list = birthdays.filter(b => b.date === today);

    if (!list.length) return "Astăzi nu are nimeni ziua 🎉";

    return "Astăzi își serbează ziua:\n" +
      list.map(b => `• ${b.name}`).join("\n");
  }

  // 5. MEETINGURI AZI
  if (intent === "meeting_today") {
    const today = new Date().toISOString().slice(0, 10);
    const list = meetings.filter(m => m.date === today);

    if (!list.length) return "Nu ai meetinguri astăzi ✅";

    return "Meetingurile tale de azi:\n" +
      list.map(m => `• ${m.title} la ${m.time}`).join("\n");
  }

  // 6. MEETINGURI PE DATA
  if (intent === "meeting_date") {
    const date = extractDate(q);
    if (!date) return "Ce dată vrei să verific? 😊";

    const list = meetings.filter(m => m.date === date);
    if (!list.length) return `Nu ai meetinguri pe **${date}**.`;

    return `📅 Meetinguri pe ${date}:\n` +
      list.map(m => `• ${m.title} la ${m.time}`).join("\n");
  }

  // 7. PROGRAMUL
  if (intent === "schedule") {
    return `
🕒 **Programul tău de lucru**
─────────────────────────────  
Luni – Vineri  
⏰ 09:00 – 17:00  
📍 La birou / hybrid

Dacă vrei, pot genera și un UI frumos pentru pagina de program — doar spune:  
**"Fa-mi UI pentru program"** ✨
`.trim();
  }

  // 8. ALTE INTREBĂRI DESPRE FIRMĂ (fallback inteligent)
  if (q.includes("meeting") || q.includes("ziua") || q.includes("departament") || q.includes("angajat")) {
    return "Pot verifica! Poți întreba: „ce meeting am azi?” sau „când e ziua lui X?” 😊";
  }

  // 9. COMPLET ÎN AFARA FIRMEI → răspuns prietenos
  return [
    "Interesant! Dar eu sunt specializat pe informațiile din companie 😊",
    "Pot discuta cu tine, dar cel mai bine mă pricep la datele interne ale jobului.",
    "Sună bine! Dacă ai și întrebări legate de muncă, sunt aici 😄"
  ][Math.floor(Math.random() * 3)];
}


/* -----------------------------------------------------
 * 4. Funcția Principală — ChatGPT-ul local
 * --------------------------------------------------- */

export function askAI(question: string): string {
  const q = question.toLowerCase().trim();

  const intent = detectIntent(q);
  return respond(intent, q);
}
