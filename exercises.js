// exercises.js — built-in exercise library (loaded before app.js)
// Each entry: type, recommended targets, equipment, howTo, muscles, aliases.
window.EXERCISE_LIBRARY = (function () {
  const lib = [
    {
      name: "Wall Sit",
      aliases: ["wall sit", "wallsit", "wall squat", "wall hold"],
      type: "time",
      rec: { durationSec: 60 },
      muscles: "Quads, glutes",
      equipment: "Just a wall",
      howTo: "Lean your back flat against a wall and slide down until your thighs are parallel to the floor, knees over ankles. Hold. Keep your weight in your heels and breathe steadily.",
    },
    {
      name: "Plank",
      aliases: ["plank", "front plank", "forearm plank"],
      type: "time",
      rec: { durationSec: 60 },
      muscles: "Core",
      equipment: "Mat",
      howTo: "Forearms on the floor under your shoulders, body in a straight line from head to heels. Squeeze your glutes and brace your core. Don't let your hips sag or pike.",
    },
    {
      name: "Goblet Squat",
      aliases: ["goblet squat", "goblet squats", "kettlebell squat", "db squat"],
      type: "weight",
      rec: { sets: 3, reps: 12, weightGuidance: "Hold one dumbbell or kettlebell at chest height; pick a weight you can control for all reps." },
      muscles: "Quads, glutes, core",
      equipment: "Dumbbell or kettlebell",
      howTo: "Hold the weight vertically against your chest. Feet shoulder-width, toes slightly out. Sit down between your hips keeping your chest tall, then drive up through your heels.",
    },
    {
      name: "Step-up",
      aliases: ["step-up", "step up", "step ups", "step-ups", "box step up"],
      type: "reps",
      rec: { sets: 3, reps: 10, perLeg: true, weightGuidance: "Bodyweight to start; add dumbbells once steady." },
      muscles: "Quads, glutes",
      equipment: "Box or bench",
      howTo: "Place one whole foot on a knee-height box. Drive through that heel to stand up fully, then lower under control. Avoid pushing off the trailing foot.",
    },
    {
      name: "Lunges",
      aliases: ["lunge", "lunges", "walking lunge", "reverse lunge", "split squat"],
      type: "reps",
      rec: { sets: 3, reps: 10, perLeg: true, weightGuidance: "Bodyweight, then hold dumbbells." },
      muscles: "Quads, glutes, hamstrings",
      equipment: "Optional dumbbells",
      howTo: "Step forward (or back) and lower until both knees are about 90°, front knee tracking over the foot. Push back to standing. Keep your torso upright.",
    },
    {
      name: "Leg Press",
      aliases: ["leg press", "legpress"],
      type: "weight",
      rec: { sets: 3, reps: 10, weightGuidance: "Moderate-heavy: the last 2 reps should feel hard but clean." },
      muscles: "Quads, glutes, hamstrings",
      equipment: "Leg press machine",
      howTo: "Feet shoulder-width on the platform. Lower until knees reach ~90° without your lower back rounding off the pad, then press out without locking the knees hard.",
    },
    {
      name: "Ski Erg",
      aliases: ["ski erg", "skierg", "ski ergometer"],
      type: "time",
      rec: { durationSec: 90, weightGuidance: "Steady, sustainable pace — you should still be able to keep going at the end." },
      muscles: "Full body, lungs",
      equipment: "Ski erg machine",
      howTo: "Reach tall, then drive down and back through your core and lats like a double-pole ski motion. Use a smooth rhythm rather than yanking.",
    },
    {
      name: "Assault Bike",
      aliases: ["assault bike", "air bike", "fan bike", "echo bike"],
      type: "time",
      rec: { durationSec: 90, weightGuidance: "Hard intervals: push the pace, then recover." },
      muscles: "Legs, lungs",
      equipment: "Air/assault bike",
      howTo: "Drive with arms and legs together. For intervals, push hard for the work period then ease off to recover. Keep your core engaged.",
    },
    {
      name: "Rowing",
      aliases: ["row", "rowing", "rower", "row erg", "concept2"],
      type: "time",
      rec: { durationSec: 120, weightGuidance: "Steady pace; focus on a strong leg drive." },
      muscles: "Full body, lungs",
      equipment: "Rowing machine",
      howTo: "Sequence is legs, then back, then arms on the drive; reverse on the recovery. Most of the power comes from your legs.",
    },
    {
      name: "Walking",
      aliases: ["walk", "walking", "brisk walk", "hike", "hiking"],
      type: "distance",
      rec: { durationMin: 45, weightGuidance: "Brisk enough to raise your breathing; add hills when you can." },
      muscles: "Legs, base endurance",
      equipment: "None",
      howTo: "Keep a brisk, steady pace. Hills and uneven ground build the most ski-relevant endurance.",
    },
    // General gym staples so manual adds get enriched too
    { name: "Back Squat", aliases: ["back squat", "barbell squat", "squat", "squats"], type: "weight", rec: { sets: 4, reps: 8, weightGuidance: "Work up to a heavy but clean set; leave 1–2 reps in reserve." }, muscles: "Quads, glutes, core", equipment: "Barbell + rack", howTo: "Bar on your upper back, brace, sit down and slightly back until thighs are at least parallel, drive up through mid-foot." },
    { name: "Deadlift", aliases: ["deadlift", "deadlifts", "conventional deadlift"], type: "weight", rec: { sets: 3, reps: 5, weightGuidance: "Heavy but with a flat back throughout." }, muscles: "Posterior chain", equipment: "Barbell", howTo: "Hips back, flat back, bar over mid-foot. Push the floor away and stand tall, keeping the bar close to your legs." },
    { name: "Romanian Deadlift", aliases: ["romanian deadlift", "rdl", "stiff leg deadlift"], type: "weight", rec: { sets: 3, reps: 10, weightGuidance: "Moderate; feel the hamstring stretch." }, muscles: "Hamstrings, glutes", equipment: "Barbell or dumbbells", howTo: "Soft knees, push hips back lowering the weight along your legs until you feel a hamstring stretch, then drive hips forward to stand." },
    { name: "Bench Press", aliases: ["bench press", "bench", "barbell bench"], type: "weight", rec: { sets: 3, reps: 8, weightGuidance: "Use a spotter near your limit." }, muscles: "Chest, triceps, shoulders", equipment: "Barbell + bench", howTo: "Lower the bar to mid-chest with elbows ~45°, then press up over your shoulders." },
    { name: "Overhead Press", aliases: ["overhead press", "ohp", "shoulder press", "military press"], type: "weight", rec: { sets: 3, reps: 8, weightGuidance: "Strict; brace your core." }, muscles: "Shoulders, triceps", equipment: "Barbell or dumbbells", howTo: "From shoulder height, press straight overhead, moving your head slightly back then through. Don't arch your lower back." },
    { name: "Pull-up", aliases: ["pull up", "pull-up", "pullup", "pullups", "chin up"], type: "reps", rec: { sets: 3, reps: 8, weightGuidance: "Add band assistance or weight as needed." }, muscles: "Back, biceps", equipment: "Bar", howTo: "Hang with hands just outside shoulders, pull your chest toward the bar, lower under control." },
    { name: "Bent-over Row", aliases: ["bent over row", "barbell row", "row bent", "bent-over row"], type: "weight", rec: { sets: 3, reps: 10, weightGuidance: "Moderate; keep your back flat." }, muscles: "Back, biceps", equipment: "Barbell or dumbbells", howTo: "Hinge to ~45°, flat back, pull the weight to your lower ribs, squeeze, lower slowly." },
    { name: "Calf Raise", aliases: ["calf raise", "calf raises", "standing calf raise"], type: "reps", rec: { sets: 3, reps: 15, weightGuidance: "Full range, pause at the top." }, muscles: "Calves", equipment: "Step optional", howTo: "Rise onto the balls of your feet as high as possible, pause, then lower your heels below the step for a stretch." },
    { name: "Glute Bridge", aliases: ["glute bridge", "hip thrust", "bridge"], type: "reps", rec: { sets: 3, reps: 12, weightGuidance: "Bodyweight or weighted across the hips." }, muscles: "Glutes, hamstrings", equipment: "Optional bench/weight", howTo: "Lying on your back, drive through your heels to lift your hips until your body is straight, squeeze glutes at the top." },
    { name: "Mountain Climbers", aliases: ["mountain climber", "mountain climbers"], type: "time", rec: { durationSec: 40 }, muscles: "Core, lungs", equipment: "Mat", howTo: "From a plank, drive knees toward your chest alternately at a steady quick pace, keeping hips low." },
    { name: "Box Jumps", aliases: ["box jump", "box jumps"], type: "reps", rec: { sets: 3, reps: 8 }, muscles: "Legs, power", equipment: "Box", howTo: "Hinge and swing your arms, jump onto the box landing softly with bent knees, step down (don't jump down)." },
    { name: "Burpees", aliases: ["burpee", "burpees"], type: "reps", rec: { sets: 3, reps: 10 }, muscles: "Full body, lungs", equipment: "None", howTo: "Squat, hands down, jump feet back to a plank, (optional push-up), jump feet in, then jump up." },
    { name: "Bulgarian Split Squat", aliases: ["bulgarian split squat", "rear foot elevated split squat", "bss"], type: "weight", rec: { sets: 3, reps: 10, perLeg: true, weightGuidance: "Bodyweight then dumbbells." }, muscles: "Quads, glutes", equipment: "Bench + optional dumbbells", howTo: "Rear foot on a bench, lower straight down until the front thigh is parallel, drive back up through the front heel." },
    { name: "Leg Extension", aliases: ["leg extension", "leg extensions"], type: "weight", rec: { sets: 3, reps: 12, weightGuidance: "Controlled; squeeze at the top." }, muscles: "Quads", equipment: "Leg extension machine", howTo: "Extend your knees to straighten your legs against the pad, pause, lower slowly." },
    { name: "Hamstring Curl", aliases: ["hamstring curl", "leg curl", "lying leg curl"], type: "weight", rec: { sets: 3, reps: 12, weightGuidance: "Controlled tempo." }, muscles: "Hamstrings", equipment: "Leg curl machine", howTo: "Curl the pad toward your glutes, squeeze, return slowly without letting the stack drop." },
    { name: "Russian Twist", aliases: ["russian twist", "russian twists"], type: "reps", rec: { sets: 3, reps: 20, weightGuidance: "Optional weight; count both sides." }, muscles: "Obliques, core", equipment: "Optional weight", howTo: "Sit leaning back slightly, feet off the floor, rotate your torso side to side under control." },
    { name: "Dead Bug", aliases: ["dead bug", "deadbug"], type: "reps", rec: { sets: 3, reps: 10, perLeg: true }, muscles: "Core", equipment: "Mat", howTo: "On your back, arms up, knees bent at 90°. Lower opposite arm and leg slowly while keeping your lower back pressed down." },
    { name: "Jump Squat", aliases: ["jump squat", "jump squats", "squat jump"], type: "reps", rec: { sets: 3, reps: 12 }, muscles: "Legs, power", equipment: "None", howTo: "Squat down then explode up into a jump, landing softly and absorbing into the next rep." },
    { name: "Cycling", aliases: ["cycle", "cycling", "bike", "stationary bike", "spin"], type: "time", rec: { durationSec: 600, weightGuidance: "Steady aerobic effort." }, muscles: "Legs, lungs", equipment: "Bike", howTo: "Maintain a steady cadence; add resistance or hills to build leg endurance." },
    { name: "Running", aliases: ["run", "running", "jog", "jogging", "treadmill"], type: "time", rec: { durationSec: 1200, weightGuidance: "Conversational pace for base; intervals for fitness." }, muscles: "Legs, lungs", equipment: "None / treadmill", howTo: "Keep a relaxed, upright posture and a steady rhythm. Build distance gradually." },
  ];

  function norm(s) {
    return (s || "").toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
  }
  const index = {};
  lib.forEach((e) => {
    index[norm(e.name)] = e;
    (e.aliases || []).forEach((a) => { index[norm(a)] = e; });
  });

  function match(name) {
    const n = norm(name);
    if (!n) return null;
    if (index[n]) return index[n];
    // try singular/plural and partial contains
    const singular = n.replace(/s$/, "");
    if (index[singular]) return index[singular];
    // contains match: longest alias contained in the name
    let best = null, bestLen = 0;
    Object.keys(index).forEach((k) => {
      if ((n.includes(k) || k.includes(n)) && k.length > bestLen) { best = index[k]; bestLen = k.length; }
    });
    return best;
  }

  return { all: lib, match, norm };
})();
