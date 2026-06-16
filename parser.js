// parser.js — turn pasted free-form AI text into a structured plan.
// Heuristic + library-enriched. Output is always editable afterward.
window.parsePlanFromText = (function () {
  const LIB = window.EXERCISE_LIBRARY;

  let idc = 0;
  const uid = (p) => `${p}_${Date.now().toString(36)}_${(idc++).toString(36)}`;

  function stripMarkers(line) {
    return line.replace(/^[\s>#*\-•·–—\d.)]+/, "").trim();
  }
  function titleCase(s) {
    return s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1)).trim();
  }

  function extractMetrics(text) {
    const m = { raw: text };
    let s = " " + text + " ";

    // sets x reps  (3x12, 3 x 12)
    let r = s.match(/(\d+)\s*[x×]\s*(\d+)/i);
    if (r) { m.sets = +r[1]; m.reps = +r[2]; }

    // explicit reps
    if (m.reps == null) {
      r = s.match(/(\d+)\s*reps?\b/i);
      if (r) m.reps = +r[1];
      else {
        r = s.match(/\bx\s*(\d+)\b/i);
        if (r) m.reps = +r[1];
      }
    }

    // per leg / each side (must reference a limb — a bare "each" like "each week" doesn't count)
    if (/\b(each|per)\s*(leg|side|arm)s?\b/i.test(s)) m.perLeg = true;

    // duration: minutes
    r = s.match(/(\d+(?:\.\d+)?)\s*(min|mins|minute|minutes|m)\b/i);
    if (r) m.durationSec = Math.round(parseFloat(r[1]) * 60);
    // seconds (override if present and no minutes)
    r = s.match(/(\d+(?:\.\d+)?)\s*(sec|secs|second|seconds|s)\b/i);
    if (r && m.durationSec == null) m.durationSec = Math.round(parseFloat(r[1]));

    // weight
    r = s.match(/(\d+(?:\.\d+)?)\s*(kg|kgs|kilos?|lb|lbs|pounds?)\b/i);
    if (r) { m.weight = parseFloat(r[1]); m.weightUnit = /lb|pound/i.test(r[2]) ? "lb" : "kg"; }

    // distance
    r = s.match(/(\d+(?:\.\d+)?)\s*(miles?|mi|km|k)\b/i);
    if (r) { m.distance = parseFloat(r[1]); m.distanceUnit = /km|^k$/i.test(r[2]) ? "km" : "mi"; }

    return m;
  }

  function cleanName(text) {
    // remove metric fragments to leave the exercise name
    let n = text
      .replace(/\d+\s*[x×]\s*\d+/gi, " ")
      .replace(/\b\d+(?:\.\d+)?\s*(reps?|sec|secs|seconds?|min|mins|minutes?|kg|kgs|kilos?|lb|lbs|pounds?|miles?|mi|km)\b/gi, " ")
      .replace(/\bx\s*\d+\b/gi, " ")
      .replace(/\b(each|per)\s*(leg|side|arm)\b/gi, " ")
      .replace(/[:\-–—]+\s*$/g, " ")
      .replace(/^\s*[:\-–—]+/g, " ")
      .replace(/\(\s*\)/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
    // trim trailing connective words
    n = n.replace(/\b(for|of|at|to|in)\s*$/i, "").trim();
    return n;
  }

  function makeActivity(rawLine) {
    const text = stripMarkers(rawLine);
    const metrics = extractMetrics(text);
    let name = cleanName(text);
    if (!name || name.length < 2) name = text;
    const libEx = LIB.match(name);
    if (libEx) name = libEx.name;

    const a = {
      id: uid("act"),
      name: titleCase(name),
      type: libEx ? libEx.type : guessType(metrics),
      sets: metrics.sets ?? (libEx && libEx.rec.sets) ?? null,
      reps: metrics.reps ?? (libEx && libEx.rec.reps) ?? null,
      durationSec: metrics.durationSec ?? (libEx && libEx.rec.durationSec) ?? null,
      weight: metrics.weight ?? null,
      weightUnit: metrics.weightUnit || "kg",
      perLeg: metrics.perLeg ?? (libEx && libEx.rec.perLeg) ?? false,
      distance: metrics.distance ?? null,
      distanceUnit: metrics.distanceUnit || "mi",
      howTo: libEx ? libEx.howTo : "",
      equipment: libEx ? libEx.equipment : "",
      muscles: libEx ? libEx.muscles : "",
      weightGuidance: libEx && libEx.rec.weightGuidance ? libEx.rec.weightGuidance : "",
      fromLibrary: !!libEx,
    };
    if (a.type === "weight" && a.reps == null) a.reps = 10;
    if (a.type === "reps" && a.reps == null) a.reps = 12;
    if (a.type === "time" && a.durationSec == null) a.durationSec = 60;
    return a;
  }

  function guessType(m) {
    if (m.weight != null) return "weight";
    if (m.durationSec != null) return "time";
    if (m.distance != null) return "distance";
    return "reps";
  }

  function newPhase(name) {
    return { id: uid("ph"), name: name || "Main", description: "", durationWeeks: null, startDate: null, endDate: null, routines: [], targets: [] };
  }
  function newRoutine(name) {
    return { id: uid("rt"), name: name || "Workout", description: "", activities: [] };
  }

  // Heading detectors
  function phaseMatch(s) {
    let r = s.match(/^phase\s*(\d+)\s*[:\-–—]?\s*(.*)$/i);
    if (r) return { num: r[1], label: r[2].trim() };
    return null;
  }
  function routineHeading(s) {
    if (/^(session|workout|routine|circuit|day|option|block|finisher|warm[\s-]?up|cool[\s-]?down|round)\b/i.test(s)) return true;
    return false;
  }
  function sectionHeading(s) {
    return /^(frequency|progression|goal|targets?|what matters|your weekly|weekly schedule|month\s*\d|notes?)\b/i.test(s)
      || /by end of phase/i.test(s) || /targets? by/i.test(s);
  }
  function isLikelyActivity(rawLine) {
    const text = stripMarkers(rawLine);
    if (!text) return false;
    if (/\d/.test(text) && /[x×]|rep|sec|min|kg|lb|mile|km|second|minute|each|per/i.test(text)) return true;
    if (LIB.match(cleanName(text))) return true;
    // short bullet that names a thing
    const wasBullet = /^[\s>#*\-•·–—]/.test(rawLine) || /^\d+[.)]/.test(rawLine.trim());
    if (wasBullet && text.split(/\s+/).length <= 6 && !/[.!?]$/.test(text)) return true;
    return false;
  }

  function parse(text) {
    const lines = text.split(/\r?\n/);
    const plan = { id: uid("plan"), name: "", description: "", createdAt: new Date().toISOString(), startDate: new Date().toISOString().slice(0, 10), phases: [] };

    let currentPhase = null;
    let currentRoutine = null;
    let collectingTargets = false;
    let suppress = false; // inside a non-exercise section (Frequency/Goal/Progression/Notes…)

    const ensurePhase = () => { if (!currentPhase) { currentPhase = newPhase("Main"); plan.phases.push(currentPhase); } };
    const ensureRoutine = () => { ensurePhase(); if (!currentRoutine) { currentRoutine = newRoutine("Workout"); currentPhase.routines.push(currentRoutine); } };

    // plan name: first meaningful line that isn't a phase/section/activity
    for (let i = 0; i < lines.length; i++) {
      const t = stripMarkers(lines[i]);
      if (!t) continue;
      if (phaseMatch(t) || routineHeading(t) || sectionHeading(t) || isLikelyActivity(lines[i])) break;
      plan.name = t.replace(/[:.]$/, "").slice(0, 80);
      break;
    }

    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      const line = stripMarkers(raw);
      if (!line) continue;

      const ph = phaseMatch(line);
      if (ph) {
        const label = ph.label || `Phase ${ph.num}`;
        currentPhase = newPhase(label.replace(/\(.*?\)/g, "").trim() || `Phase ${ph.num}`);
        // weeks?
        const w = line.match(/(\d+)\s*weeks?/i);
        if (w) currentPhase.durationWeeks = +w[1];
        // month range as description
        const range = line.match(/([A-Z][a-z]+)\s*(?:→|->|-|–|to)\s*([A-Za-z ]+)/);
        if (range) currentPhase.description = `${range[1]} → ${range[2].trim()}`;
        plan.phases.push(currentPhase);
        currentRoutine = null;
        collectingTargets = false;
        suppress = false;
        continue;
      }

      if (/^(targets?\b|.*by end of phase|.*targets? by)/i.test(line)) { collectingTargets = true; suppress = false; ensurePhase(); continue; }

      if (sectionHeading(line) && !routineHeading(line)) {
        const isTargets = /targets?/i.test(line) || /by end of phase/i.test(line);
        collectingTargets = isTargets;
        suppress = !isTargets; // Frequency / Goal / Progression / Notes etc. -> ignore their lines as exercises
        continue;
      }

      if (routineHeading(line)) {
        ensurePhase();
        currentRoutine = newRoutine(titleCase(line.replace(/[:.]$/, "")));
        currentPhase.routines.push(currentRoutine);
        collectingTargets = false;
        suppress = false;
        continue;
      }

      if (collectingTargets) {
        ensurePhase();
        const m = extractMetrics(line);
        currentPhase.targets.push({ id: uid("tg"), label: cleanName(line) || line, durationSec: m.durationSec ?? null, reps: m.reps ?? null, raw: line });
        continue;
      }

      // inside a non-exercise section: keep prose as a phase note, never make exercises
      if (suppress) {
        const bulletish = /^[\s>#*\-•·–—]/.test(raw) || /^\d+[.)]/.test(raw.trim());
        if (!bulletish && currentPhase) currentPhase.description = (currentPhase.description ? currentPhase.description + " " : "") + line;
        continue;
      }

      if (isLikelyActivity(raw)) {
        ensureRoutine();
        currentRoutine.activities.push(makeActivity(raw));
        continue;
      }

      // otherwise: descriptive prose -> attach to current context
      if (currentRoutine) {
        currentRoutine.description = (currentRoutine.description ? currentRoutine.description + " " : "") + line;
      } else if (currentPhase) {
        currentPhase.description = (currentPhase.description ? currentPhase.description + " " : "") + line;
      } else if (!plan.description) {
        plan.description = line;
      }
    }

    // cleanups
    if (!plan.name) plan.name = "Imported Plan";
    // drop empty phases/routines
    plan.phases.forEach((p) => { p.routines = p.routines.filter((r) => r.activities.length || r.description); });
    plan.phases = plan.phases.filter((p) => p.routines.length || p.targets.length || p.description);
    if (!plan.phases.length) { const p = newPhase("Main"); plan.phases.push(p); }

    return plan;
  }

  return parse;
})();

// window.normalizeAIPlan — takes the raw JSON returned by the /api/parse-plan
// Cloudflare Function (no ids yet) and turns it into the exact shape the app
// expects, generating ids and filling any still-missing fields from the
// local exercise library as a final safety net.
window.normalizeAIPlan = (function () {
  const LIB = window.EXERCISE_LIBRARY;
  let idc = 0;
  const uid = (p) => `ai_${p}_${Date.now().toString(36)}_${(idc++).toString(36)}`;

  function activity(raw) {
    const libEx = LIB.match(raw.name || "");
    const type = raw.type || (libEx ? libEx.type : "reps");
    return {
      id: uid("act"),
      name: raw.name || "Exercise",
      type,
      sets: Number.isFinite(raw.sets) ? raw.sets : (libEx && libEx.rec.sets) || (type === "weight" ? 3 : null),
      reps: Number.isFinite(raw.reps) ? raw.reps : (libEx && libEx.rec.reps) || (type === "weight" || type === "reps" ? 10 : null),
      durationSec: Number.isFinite(raw.durationSec) ? raw.durationSec : (libEx && libEx.rec.durationSec) || (type === "time" ? 60 : null),
      weight: Number.isFinite(raw.weight) ? raw.weight : null,
      weightUnit: raw.weightUnit === "lb" ? "lb" : "kg",
      perLeg: !!raw.perLeg,
      distance: Number.isFinite(raw.distance) ? raw.distance : null,
      distanceUnit: raw.distanceUnit === "km" ? "km" : "mi",
      howTo: raw.howTo || (libEx ? libEx.howTo : ""),
      equipment: raw.equipment || (libEx ? libEx.equipment : ""),
      muscles: raw.muscles || (libEx ? libEx.muscles : ""),
      weightGuidance: raw.weightGuidance || (libEx ? libEx.rec.weightGuidance || "" : ""),
      fromLibrary: !!libEx,
    };
  }
  function routine(raw) {
    return { id: uid("rt"), name: raw.name || "Workout", description: raw.description || "", activities: (raw.activities || []).map(activity) };
  }
  function phase(raw) {
    return {
      id: uid("ph"),
      name: raw.name || "Main",
      description: raw.description || "",
      durationWeeks: Number.isFinite(raw.durationWeeks) ? raw.durationWeeks : null,
      startDate: null,
      endDate: null,
      routines: (raw.routines || []).map(routine),
      targets: (raw.targets || []).map((t) => ({ id: uid("tg"), label: t.label || "", durationSec: Number.isFinite(t.durationSec) ? t.durationSec : null, reps: Number.isFinite(t.reps) ? t.reps : null, raw: t.label || "" })),
    };
  }
  return function normalizeAIPlan(raw) {
    const plan = {
      id: uid("plan"),
      name: (raw && raw.name) || "Imported Plan",
      description: (raw && raw.description) || "",
      createdAt: new Date().toISOString(),
      startDate: new Date().toISOString().slice(0, 10),
      phases: ((raw && raw.phases) || []).map(phase),
    };
    if (!plan.phases.length) plan.phases.push(phase({ name: "Main", routines: [] }));
    return plan;
  };
})();
