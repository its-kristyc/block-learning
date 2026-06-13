import { useState, useEffect, useRef, useMemo, useCallback } from "react";

// ============================================================
// BASI BLOCK SYSTEM — STUDY PROTOTYPE
// Seed data is illustrative; replace with your real BASI data.
// ============================================================

const BLOCKS = [
  "Warm Up", "Foot Work", "Abdominal Work", "Hip Work",
  "Spinal Articulation", "Stretches", "Full Body Integration I",
  "Arm Work", "Leg Work", "Full Body Integration II",
  "Lateral Flexion & Rotation", "Back Extension",
];

const C = {
  red: "#A83722", redDeep: "#7E2817", redSoft: "#F6E7E2", wheel: "#AB2B2B",
  paper: "#FBF7F1", card: "#FFFFFF", ink: "#33291F", muted: "#8A7F73",
  line: "#E7DFD3", lineSoft: "#F2ECE3", gold: "#B98A2F", goldSoft: "#F7EFDE",
};

const SUP = { name: "Supine Series", kind: "series" };
const FWC = { name: "Foot Work Series", kind: "series" };
const HIP = { name: "Hip Work Series", kind: "series" };
const ARM = { name: "Arms Supine Series", kind: "series" };
const LSG = { name: "Long Stretch Group", kind: "group" };

const ex = (id, name, block, apparatus, collection, level, d) => ({
  id, name, block, apparatus, collection, level,
  setup: d.setup, resistance: d.res || null,
  exhale: d.ex || null, inhale: d.inh || null,
  muscleFocus: d.mf || [], objectives: d.obj || [], cues: d.cues || [],
});

const EXERCISES = [
  // 1 · Warm Up
  ex("wu1", "Pelvic Curl", 1, "Mat", null, "Fundamental", {
    setup: "Supine, knees bent, feet hip-width, arms long by sides.",
    ex: "Articulate spine off the mat into bridge", inh: "Hold at top, then roll down on next exhale",
    mf: ["Abdominals", "Hamstrings"], obj: ["Pelvic lumbar stabilization", "Spinal articulation", "Hamstring control"],
    cues: ["Initiate from a posterior pelvic tilt", "Peel one vertebra at a time", "Keep weight even across both feet"] }),
  ex("wu2", "Spine Twist Supine", 1, "Mat", null, "Fundamental", {
    setup: "Supine, legs in tabletop, arms in T position.",
    ex: "Return legs to center", inh: "Rotate legs to one side, keeping shoulders anchored",
    mf: ["Obliques", "Abdominals"], obj: ["Trunk rotation control", "Oblique strength"],
    cues: ["Move both knees as one unit", "Keep opposite shoulder heavy", "Rotation comes from the waist"] }),
  ex("wu3", "Chest Lift", 1, "Mat", null, "Fundamental", {
    setup: "Supine, knees bent, hands interlaced behind head.",
    ex: "Flex trunk, lifting head and chest", inh: "Hold, then lower with control",
    mf: ["Abdominals"], obj: ["Abdominal strength", "Head and neck alignment"],
    cues: ["Lead with the sternum, not the chin", "Keep the pelvis neutral", "Eyes on your knees"] }),
  ex("wu4", "Chest Lift with Rotation", 1, "Mat", null, "Fundamental", {
    setup: "Supine in chest lift position, hands behind head.",
    ex: "Rotate the lifted trunk to one side", inh: "Return through center",
    mf: ["Obliques", "Abdominals"], obj: ["Oblique strength", "Rotation without losing flexion"],
    cues: ["Rotate from the ribcage", "Keep elbows wide", "Maintain the height of the lift"] }),

  // 2 · Foot Work — Reformer Supine Series
  ex("fw1", "Parallel Heels", 2, "Reformer", SUP, "Fundamental", {
    setup: "Lying supine in neutral spine, legs parallel, heels on footbar, feet hip-width apart.",
    res: "Medium to heavy",
    ex: "Straighten legs", inh: "Bend legs, return to start position",
    mf: ["Hip extensors", "Knee extensors"],
    obj: ["Hip extensor control", "Knee extensor strength", "Ankle and foot control", "Pelvic lumbar stabilization"],
    cues: ["Initiate movement with hip extensors", "Keep feet dorsiflexed and stable as if standing on floor", "Straighten legs completely, avoiding hyperextension", "Maintain pelvic lumbar stabilization"] }),
  ex("fw2", "Parallel Toes", 2, "Reformer", SUP, "Fundamental", {
    setup: "Supine, legs parallel, toes on footbar with heels lifted and still.",
    res: "Medium to heavy",
    ex: "Straighten legs", inh: "Bend legs, return to start",
    mf: ["Hip extensors", "Knee extensors", "Ankle plantar flexors"],
    obj: ["Knee extensor strength", "Ankle stability"],
    cues: ["Keep heels at one constant height", "Press evenly through all five toes", "No movement in the ankle during the press"] }),
  ex("fw3", "V Position Toes", 2, "Reformer", SUP, "Fundamental", {
    setup: "Supine, heels together toes apart in small V, toes on footbar.",
    res: "Medium to heavy",
    ex: "Straighten legs", inh: "Bend legs, return to start",
    mf: ["Hip extensors", "Knee extensors", "Hip adductors"],
    obj: ["Leg alignment in rotation", "Adductor engagement"],
    cues: ["Rotation comes from the hips, not the feet", "Keep heels glued together", "Knees track over the second toe"] }),
  ex("fw4", "Open V Heels", 2, "Reformer", SUP, "Fundamental", {
    setup: "Supine, legs in wide V, heels on the footbar.",
    res: "Medium to heavy",
    ex: "Straighten legs", inh: "Bend legs, return to start",
    mf: ["Hip extensors", "Knee extensors", "Hip adductors"],
    obj: ["Control in hip abduction", "Pelvic stability with a wide base"],
    cues: ["Keep the pelvis quiet as legs press", "Track knees over toes", "Feel inner thighs gather on the return"] }),
  ex("fw5", "Open V Toes", 2, "Reformer", SUP, "Fundamental", {
    setup: "Supine, legs in wide V, toes on the footbar, heels lifted.",
    res: "Medium to heavy",
    ex: "Straighten legs", inh: "Bend legs, return to start",
    mf: ["Hip extensors", "Knee extensors", "Ankle plantar flexors"],
    obj: ["Ankle control in rotation", "Even leg work in a wide stance"],
    cues: ["Heels stay still and level", "Press from the back of the legs", "Avoid gripping the toes"] }),
  ex("fw6", "Calf Raises", 2, "Reformer", SUP, "Fundamental", {
    setup: "Supine, legs straight, toes on footbar, heels under the bar.",
    res: "Medium to heavy",
    ex: "Press heels under the bar (lower)", inh: "Lift heels, rising onto the toes",
    mf: ["Ankle plantar flexors", "Knee extensors"],
    obj: ["Calf strength", "Full ankle range with a stable knee"],
    cues: ["Keep knees straight but not locked", "Lower heels as far as they go", "Move only at the ankle"] }),
  ex("fw7", "Prances", 2, "Reformer", SUP, "Fundamental", {
    setup: "Supine, legs straight, toes on footbar; alternate bending one knee as the other heel presses down.",
    res: "Medium to heavy",
    ex: "Change legs", inh: "Change legs",
    mf: ["Ankle plantar flexors", "Knee extensors"],
    obj: ["Coordination", "Articulation through the foot"],
    cues: ["Keep the carriage still as legs alternate", "Roll through the foot like walking", "Even rhythm side to side"] }),

  // 2 · Foot Work — Wunda Chair
  ex("fw8", "Parallel Heels (Chair)", 2, "Wunda Chair", FWC, "Fundamental", {
    setup: "Seated tall on the chair, heels on the pedal, legs parallel.",
    res: "Medium",
    ex: "Press the pedal down", inh: "Return with control",
    mf: ["Hip extensors", "Knee extensors"],
    obj: ["Trunk stability in sitting", "Leg strength against resistance"],
    cues: ["Sit tall out of the hips", "Press without rocking the trunk", "Control the pedal up — don't let it throw you"] }),
  ex("fw9", "Parallel Toes (Chair)", 2, "Wunda Chair", FWC, "Fundamental", {
    setup: "Seated tall, toes on the pedal, heels lifted, legs parallel.",
    res: "Medium",
    ex: "Press the pedal down", inh: "Return with control",
    mf: ["Knee extensors", "Ankle plantar flexors"],
    obj: ["Ankle stability", "Upright posture under load"],
    cues: ["Heels stay at one height", "Grow taller as you press", "Even weight through both feet"] }),

  // 3 · Abdominal Work
  ex("ab1", "Hundred Prep", 3, "Reformer", null, "Fundamental", {
    setup: "Supine, legs in tabletop, hands in straps, arms reaching to the ceiling.",
    res: "Light",
    ex: "Lift into chest lift as arms press down", inh: "Lower with control",
    mf: ["Abdominals"], obj: ["Abdominal strength", "Coordinating arms with trunk flexion"],
    cues: ["Reach the arms long as you curl", "Keep tabletop still", "Soften the neck — the work is in the trunk"] }),
  ex("ab2", "Hundred", 3, "Reformer", null, "Intermediate", {
    setup: "Supine in chest lift, legs extended on a high diagonal, arms long in straps.",
    res: "Light",
    ex: "Pump arms for five counts", inh: "Pump arms for five counts",
    mf: ["Abdominals", "Hip flexors"], obj: ["Abdominal endurance", "Breath control"],
    cues: ["Pump from the shoulder, arms straight", "Keep the lift constant — don't bounce", "Legs reach away from you"] }),
  ex("ab3", "Coordination", 3, "Reformer", null, "Intermediate", {
    setup: "Supine in chest lift, elbows bent by ribs, hands in straps, legs in tabletop.",
    res: "Light",
    ex: "Press arms and legs out, open-close legs", inh: "Bend knees in, then return arms",
    mf: ["Abdominals", "Hip adductors"], obj: ["Coordination", "Maintaining flexion through a sequence"],
    cues: ["The trunk lift never changes", "Sharp open-close from the hips", "Sequence: arms-legs out, legs in, arms in"] }),
  ex("ab4", "Mini Roll-Up", 3, "Cadillac", null, "Fundamental", {
    setup: "Supine, hands on the roll-down bar, knees bent, feet flat.",
    res: "Light to medium",
    ex: "Curl head and chest up, rolling toward the thighs", inh: "Roll down with control",
    mf: ["Abdominals"], obj: ["Sequential trunk flexion", "Using spring assistance to learn the roll-up"],
    cues: ["Let the bar assist, not lead", "Round over an imaginary ball", "Lower one vertebra at a time"] }),

  // 4 · Hip Work — Reformer
  ex("hp1", "Frog", 4, "Reformer", HIP, "Fundamental", {
    setup: "Supine, feet in straps, knees bent and open, heels together.",
    res: "Light to medium",
    ex: "Straighten legs on a low diagonal", inh: "Bend knees, returning to start",
    mf: ["Hip extensors", "Hip adductors"], obj: ["Hip control in rotation", "Pelvic stability with legs in straps"],
    cues: ["Press out through the heels", "Keep the pelvis anchored", "Resist the straps on the return"] }),
  ex("hp2", "Down Circles", 4, "Reformer", HIP, "Fundamental", {
    setup: "Supine, feet in straps, legs straight on a diagonal.",
    res: "Light to medium",
    ex: "Circle legs down and around", inh: "Close legs together at the bottom",
    mf: ["Hip adductors", "Hip extensors"], obj: ["Smooth circular motion from the hip", "Adductor strength"],
    cues: ["Equal-sized circles each rep", "The pelvis never rocks", "Squeeze midline to finish each circle"] }),
  ex("hp3", "Up Circles", 4, "Reformer", HIP, "Fundamental", {
    setup: "Supine, feet in straps, legs straight and together.",
    res: "Light to medium",
    ex: "Open and circle legs up", inh: "Close at the top of the circle",
    mf: ["Hip adductors", "Hip flexors"], obj: ["Reverse hip circle control", "Hamstring length"],
    cues: ["Initiate the opening from the hip", "Keep tailbone heavy", "Same tempo in both directions"] }),
  ex("hp4", "Openings", 4, "Reformer", HIP, "Fundamental", {
    setup: "Supine, feet in straps, legs straight on a diagonal, in external rotation.",
    res: "Light to medium",
    ex: "Open legs out to the sides", inh: "Draw legs together",
    mf: ["Hip adductors", "Hip abductors"], obj: ["Adductor strength", "Control through full abduction range"],
    cues: ["Open only as far as the pelvis stays still", "Resist on the way out", "Power the closing from the inner thighs"] }),

  // 5 · Spinal Articulation
  ex("sa1", "Bottom Lift", 5, "Reformer", null, "Fundamental", {
    setup: "Supine, feet on footbar in parallel, knees bent.",
    res: "Medium",
    ex: "Articulate the spine up into a bridge", inh: "Hold; exhale to roll down",
    mf: ["Hamstrings", "Abdominals", "Hip extensors"], obj: ["Spinal articulation under load", "Hamstring control"],
    cues: ["Keep the carriage absolutely still", "Peel and re-place each vertebra", "Knees reach over the toes at the top"] }),
  ex("sa2", "Bottom Lift with Extension", 5, "Reformer", null, "Intermediate", {
    setup: "In bottom lift bridge position, feet on the footbar.",
    res: "Medium",
    ex: "Press the carriage out, holding the bridge", inh: "Return the carriage",
    mf: ["Hamstrings", "Hip extensors"], obj: ["Hip extensor endurance", "Pelvic control with moving legs"],
    cues: ["The pelvis height never changes", "Press out only as far as you can hold", "Hamstrings drag the carriage home"] }),
  ex("sa3", "Short Spine Massage", 5, "Reformer", null, "Intermediate", {
    setup: "Supine, feet in straps, headrest down.",
    res: "Light to medium",
    ex: "Fold legs over and roll the spine up", inh: "Bend knees toward shoulders, then roll down",
    mf: ["Abdominals", "Hamstrings"], obj: ["Sequential spinal articulation", "Hamstring flexibility"],
    cues: ["Roll up with the carriage still", "Knees frame the shoulders on the descent", "Lengthen the spine down the mat"] }),

  // 6 · Stretches
  ex("st1", "Standing Lunge", 6, "Reformer", null, "Fundamental", {
    setup: "One foot against the shoulder rest, other foot on the floor, hands on the footbar.",
    res: "Light",
    ex: "Press the carriage out, sinking into the lunge", inh: "Hold and breathe into the stretch",
    mf: ["Hip flexors", "Hamstrings"], obj: ["Hip flexor length", "Stable stretch position"],
    cues: ["Square the pelvis forward", "Sink down, not just back", "Keep the front knee over the ankle"] }),
  ex("st2", "Hamstring Stretch", 6, "Ladder Barrel", null, "Fundamental", {
    setup: "One leg resting on the barrel, standing leg vertical, hands on the ladder.",
    ex: "Hinge forward over the lifted leg", inh: "Lengthen the spine before each fold",
    mf: ["Hamstrings"], obj: ["Hamstring flexibility", "Maintaining a long spine in a stretch"],
    cues: ["Fold from the hip, not the waist", "Keep both hips facing the barrel", "Soften the knee if the back rounds"] }),
  ex("st3", "Kneeling Lunge", 6, "Reformer", null, "Intermediate", {
    setup: "Back knee on the carriage, front foot on the floor or frame, hands on the footbar.",
    res: "Light",
    ex: "Press the carriage back, deepening the lunge", inh: "Hold and breathe",
    mf: ["Hip flexors"], obj: ["Deep hip flexor stretch", "Balance and control in kneeling"],
    cues: ["Tuck the pelvis slightly to find the stretch", "Grow tall through the crown", "Control the carriage at all times"] }),

  // 7 · Full Body Integration I
  ex("f1a", "Scooter", 7, "Reformer", null, "Fundamental", {
    setup: "Standing beside the reformer, one foot on the carriage against the shoulder rest, hands on the footbar.",
    res: "Medium",
    ex: "Press the carriage back with the standing-leg hip stable", inh: "Return with control",
    mf: ["Hip extensors", "Abdominals"], obj: ["Single-leg hip extensor strength", "Trunk stability over a moving base"],
    cues: ["The trunk stays still — only the leg moves", "Press from the hip, not the knee", "Standing leg stays softly bent"] }),
  ex("f1b", "Long Stretch", 7, "Reformer", LSG, "Intermediate", {
    setup: "Plank position, hands on footbar, feet against shoulder rests.",
    res: "Medium",
    ex: "Press the carriage out, holding the plank", inh: "Return the carriage",
    mf: ["Abdominals", "Shoulder flexors"], obj: ["Plank integrity over a moving carriage", "Shoulder control"],
    cues: ["One long line from head to heels", "Move from the shoulders only", "Don't let the hips pike or sag"] }),
  ex("f1c", "Down Stretch", 7, "Reformer", LSG, "Intermediate", {
    setup: "Kneeling, feet against shoulder rests, hands on footbar, chest lifted in extension.",
    res: "Medium",
    ex: "Press the carriage back", inh: "Return, sweeping the chest forward and up",
    mf: ["Back extensors", "Hip extensors"], obj: ["Back extension with moving support", "Front-body opening"],
    cues: ["Lift the chest through the arms", "Press the hips forward", "Lead the return with the sternum"] }),
  ex("f1d", "Up Stretch", 7, "Reformer", LSG, "Intermediate", {
    setup: "Pike position, hands on footbar, feet against shoulder rests, hips high.",
    res: "Medium",
    ex: "Press the carriage out, lowering toward plank", inh: "Lift the hips, returning to pike",
    mf: ["Abdominals", "Shoulder flexors"], obj: ["Moving between pike and plank with control", "Abdominal strength"],
    cues: ["Initiate the return from the abdominals", "Keep the shoulders over the wrists in plank", "Heels stay anchored on the rests"] }),
  ex("f1e", "Elephant", 7, "Reformer", LSG, "Fundamental", {
    setup: "Standing on the carriage in a pike, heels down, hands on footbar.",
    res: "Medium",
    ex: "Press the carriage back with straight legs", inh: "Draw the carriage in from the abdominals",
    mf: ["Hamstrings", "Abdominals"], obj: ["Hamstring length in a closed chain", "Abdominal initiation"],
    cues: ["Keep the trunk completely still", "Drag the carriage in — don't kick it", "Weight even through hands and feet"] }),
  ex("f1f", "Teaser Prep", 7, "Mat", null, "Intermediate", {
    setup: "Supine, knees bent in tabletop, arms reaching back overhead.",
    ex: "Roll up to balance behind the sit bones, legs in tabletop", inh: "Hold, then roll down with control",
    mf: ["Abdominals", "Hip flexors"], obj: ["Finding the teaser balance point", "Sequential roll-up strength"],
    cues: ["Reach the arms toward the knees as you rise", "Balance just behind the sit bones", "Roll down one vertebra at a time"] }),

  // 8 · Arm Work — Reformer Arms Supine Series
  ex("ar1", "Extension", 8, "Reformer", ARM, "Fundamental", {
    setup: "Supine, legs in tabletop, hands in straps, arms reaching to the ceiling.",
    res: "Light",
    ex: "Press the arms down to the carriage", inh: "Return the arms to vertical",
    mf: ["Shoulder extensors", "Abdominals"], obj: ["Shoulder extensor strength", "Trunk stability with arm load"],
    cues: ["Arms straight but not locked", "Keep the ribcage anchored", "Resist the straps on the way up"] }),
  ex("ar2", "Adduction", 8, "Reformer", ARM, "Fundamental", {
    setup: "Supine, legs in tabletop, arms open to the sides in the straps.",
    res: "Light",
    ex: "Draw the arms together above the chest", inh: "Open with control",
    mf: ["Shoulder adductors", "Pectorals"], obj: ["Chest and shoulder control", "Stable trunk under asymmetric load"],
    cues: ["Hug an imaginary barrel", "Shoulders stay wide on the mat", "Same path out and in"] }),
  ex("ar3", "Circles Up", 8, "Reformer", ARM, "Fundamental", {
    setup: "Supine, legs in tabletop, arms long by the sides in straps.",
    res: "Light",
    ex: "Circle the arms out and up overhead", inh: "Press back down through the sides",
    mf: ["Shoulder flexors", "Shoulder extensors"], obj: ["Full shoulder range with a quiet trunk"],
    cues: ["Keep ribs knitted as arms travel", "Even, round circles", "Reverse direction without losing tension"] }),
  ex("ar4", "Triceps", 8, "Reformer", ARM, "Fundamental", {
    setup: "Supine, elbows bent and anchored by the ribs, hands in straps.",
    res: "Light",
    ex: "Straighten the arms along the body", inh: "Bend the elbows, keeping them still",
    mf: ["Triceps"], obj: ["Elbow extensor strength", "Isolating the forearm movement"],
    cues: ["Elbows glued to the ribs", "Move only from the elbow", "Reach long through the fingertips"] }),

  // 9 · Leg Work
  ex("lg1", "Leg Press Standing", 9, "Wunda Chair", null, "Fundamental", {
    setup: "Standing tall on the chair facing forward, one foot on the pedal.",
    res: "Medium",
    ex: "Press the pedal down", inh: "Return with control",
    mf: ["Hip extensors", "Knee extensors"], obj: ["Single-leg strength", "Standing balance and alignment"],
    cues: ["Stand tall over the standing leg", "Press without leaning", "Knee tracks over the toes"] }),
  ex("lg2", "Hamstring Curl", 9, "Wunda Chair", null, "Fundamental", {
    setup: "Prone over the chair, hands on the frame, one or both feet on the pedal.",
    res: "Light to medium",
    ex: "Curl the heels toward the seat", inh: "Lengthen the legs with control",
    mf: ["Hamstrings"], obj: ["Hamstring strength", "Pelvic stability in prone"],
    cues: ["Keep the pelvis pressed down", "Curl from the back of the thigh", "Slow on the return"] }),

  // 10 · Full Body Integration II
  ex("f2a", "Teaser 1", 10, "Mat", null, "Advanced", {
    setup: "Supine, legs extended on a high diagonal, arms reaching overhead.",
    ex: "Roll up to a V position, arms parallel to the legs", inh: "Hold; exhale to roll down",
    mf: ["Abdominals", "Hip flexors"], obj: ["Full teaser strength and balance", "Articulated roll-up with extended legs"],
    cues: ["Legs stay at one constant angle", "Float the arms up with the trunk", "Resist gravity on every vertebra down"] }),
  ex("f2b", "Teaser 2", 10, "Mat", null, "Advanced", {
    setup: "Balanced in the teaser V position, arms reaching forward.",
    ex: "Lower and lift the legs, holding the trunk still", inh: "Prepare at the top",
    mf: ["Hip flexors", "Abdominals"], obj: ["Hip flexor control with a stable trunk", "Balance under moving load"],
    cues: ["Only the legs move", "Keep the chest lifted and open", "Small range, total control"] }),
  ex("f2c", "Star", 10, "Reformer", null, "Advanced", {
    setup: "Side plank with one hand on the footbar, feet on the carriage.",
    res: "Medium",
    ex: "Press the carriage out in the side plank", inh: "Return with control",
    mf: ["Obliques", "Shoulder stabilizers", "Hip abductors"], obj: ["Lateral full-body integration", "Shoulder stability under load"],
    cues: ["Lift away from the supporting shoulder", "One straight line, top to bottom", "Reach the top arm to the sky"] }),

  // 11 · Lateral Flexion & Rotation
  ex("lf1", "Mermaid", 11, "Reformer", null, "Fundamental", {
    setup: "Side-sitting on the carriage, inside hand on the footbar.",
    res: "Light",
    ex: "Press the carriage out, side-bending over the bar", inh: "Return, lifting through the waist",
    mf: ["Obliques", "Back extensors"], obj: ["Lateral flexion range", "Side-body length and control"],
    cues: ["Lift up and over an imaginary fence", "Keep both sit bones grounded", "Open the top ribs to the ceiling"] }),
  ex("lf2", "Saw", 11, "Mat", null, "Intermediate", {
    setup: "Sitting tall, legs apart, arms in T position.",
    ex: "Rotate and reach past the little toe", inh: "Restack the spine to vertical",
    mf: ["Obliques", "Back extensors"], obj: ["Rotation with flexion", "Hamstring and spine flexibility"],
    cues: ["Rotate first, then reach", "Keep both hips anchored", "Saw past the toe three times"] }),
  ex("lf3", "Side Stretch", 11, "Wunda Chair", null, "Intermediate", {
    setup: "Side-sitting on the chair, outside hand on the pedal.",
    res: "Light",
    ex: "Press the pedal down, side-bending over it", inh: "Lift back to vertical",
    mf: ["Obliques"], obj: ["Lateral flexion against resistance", "Control in both directions"],
    cues: ["Bend sideways on one plane", "Press and lift with equal control", "Keep the hips stacked"] }),

  // 12 · Back Extension
  ex("be1", "Breast Stroke Prep", 12, "Mat", null, "Fundamental", {
    setup: "Prone, forehead down, hands by the shoulders, legs together.",
    ex: "Lift the head and chest into a small extension", inh: "Lower with length",
    mf: ["Back extensors"], obj: ["Thoracic extension strength", "Extension without compressing the low back"],
    cues: ["Reach the crown forward as you lift", "Press gently through the hands", "Keep the feet on the mat"] }),
  ex("be2", "Swan Basic", 12, "Wunda Chair", null, "Intermediate", {
    setup: "Prone over the chair, hands on the pedal, legs long.",
    res: "Light to medium",
    ex: "Lift the chest as the pedal rises", inh: "Lengthen back down",
    mf: ["Back extensors", "Shoulder extensors"], obj: ["Supported back extension through range", "Sequencing extension from upper to lower spine"],
    cues: ["Lead with the chest, not the chin", "Let the pedal assist the lift", "Lengthen — don't crunch — the low back"] }),
  ex("be3", "Pulling Straps I", 12, "Reformer", null, "Intermediate", {
    setup: "Prone on the long box, chest just off the edge, hands holding the straps.",
    res: "Light",
    ex: "Pull the straps back, lifting the chest into extension", inh: "Return the arms with control",
    mf: ["Back extensors", "Shoulder extensors", "Latissimus dorsi"], obj: ["Back extension with arm work", "Scapular control"],
    cues: ["Slide the shoulder blades down as you pull", "Lift the chest as the arms travel", "Keep the legs reaching long behind you"] }),
];

const APPARATUSES = [...new Set(EXERCISES.map(e => e.apparatus))].sort();
const LEVELS = ["Fundamental", "Intermediate", "Advanced"];
const MUSCLES = [...new Set(EXERCISES.flatMap(e => e.muscleFocus))].sort();
const byId = Object.fromEntries(EXERCISES.map(e => [e.id, e]));

// ---------------- storage abstraction ----------------
const KEY = "basi-user-data-v1";
const emptyUser = { notes: {}, favorites: [], programs: [] };
const store = {
  async load() {
    try { const r = await window.storage.get(KEY); return r?.value ? JSON.parse(r.value) : null; }
    catch { return null; }
  },
  async save(data) {
    try { await window.storage.set(KEY, JSON.stringify(data)); } catch (e) { console.error("save failed", e); }
  },
};

// ---------------- small helpers ----------------
const lvlColor = { Fundamental: "#2F7D5B", Intermediate: "#B98A2F", Advanced: "#D14747" };
const lvlBg = { Fundamental: "#E7F2EC", Intermediate: "#F7EFDE", Advanced: "#FBEAEA" };
const uid = () => Math.random().toString(36).slice(2, 9);
const fonts = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;

function useViewport() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const f = () => setW(window.innerWidth);
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  return { isMobile: w < 768, w };
}

// ---------------- the wheel ----------------
function polar(cx, cy, r, deg) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}
function wedgePath(cx, cy, r1, r2, a1, a2) {
  const [x1, y1] = polar(cx, cy, r2, a1), [x2, y2] = polar(cx, cy, r2, a2);
  const [x3, y3] = polar(cx, cy, r1, a2), [x4, y4] = polar(cx, cy, r1, a1);
  return `M ${x1} ${y1} A ${r2} ${r2} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${r1} ${r1} 0 0 0 ${x4} ${y4} Z`;
}
function Wheel({ selected, onSelect, size }) {
  const cx = 250, cy = 250;
  return (
    <svg viewBox="0 0 500 500" width={size} height={size} style={{ display: "block", flexShrink: 0, transition: "width .35s ease, height .35s ease" }}>
      {BLOCKS.map((name, i) => {
        const n = i + 1;
        const center = n === 12 ? 0 : n * 30;
        const a1 = center - 13.6, a2 = center + 13.6;
        const sel = selected === n;
        const [lx, ly] = polar(cx, cy, 178, center);
        const [nx, ny] = polar(cx, cy, 112, center);
        const words = name.split(" ");
        const lines = words.length <= 2 ? words : name === "Lateral Flexion & Rotation" ? ["Lateral", "Flexion &", "Rotation"] : [words.slice(0, 3).join(" "), words.slice(3).join(" ")].filter(Boolean);
        return (
          <g key={n} onClick={() => onSelect(sel ? null : n)} style={{ cursor: "pointer" }} className="wedge">
            <path d={wedgePath(cx, cy, 92, 238, a1, a2)} fill={sel ? C.redDeep : C.wheel} style={{ transition: "fill .2s" }} />
            <text x={lx} y={ly - (lines.length - 1) * 5.5} textAnchor="middle" fill="#fff" fontFamily={fonts} fontWeight="800" fontSize="11" letterSpacing="0.3" style={{ textTransform: "uppercase", pointerEvents: "none" }}>
              {lines.map((ln, j) => <tspan key={j} x={lx} dy={j === 0 ? 0 : 12}>{ln.toUpperCase()}</tspan>)}
            </text>
            {sel && <circle cx={nx} cy={ny} r="17" fill="#fff" style={{ pointerEvents: "none" }} />}
            <text x={nx} y={ny + 7} textAnchor="middle" fill={sel ? C.redDeep : "#fff"} fontFamily={fonts} fontWeight="800" fontSize="21" style={{ pointerEvents: "none" }}>{n}</text>
          </g>
        );
      })}
      <g onClick={() => selected && onSelect(null)} style={{ cursor: selected ? "pointer" : "default" }}>
        <circle cx={cx} cy={cy} r="90" fill={C.paper} />
        {selected ? (
          <>
            <text x={cx} y={cy - 4} textAnchor="middle" fill={C.redDeep} fontFamily={fonts} fontWeight="800" fontSize="13" letterSpacing="1">CLEAR</text>
            <text x={cx} y={cy + 14} textAnchor="middle" fill={C.muted} fontFamily={fonts} fontWeight="700" fontSize="11" letterSpacing="0.5">show all</text>
          </>
        ) : (
          <>
            <text x={cx} y={cy - 4} textAnchor="middle" fill={C.muted} fontFamily={fonts} fontWeight="800" fontSize="13" letterSpacing="2">BLOCK</text>
            <text x={cx} y={cy + 14} textAnchor="middle" fill={C.muted} fontFamily={fonts} fontWeight="800" fontSize="13" letterSpacing="2">SYSTEM</text>
          </>
        )}
      </g>
    </svg>
  );
}

// ---------------- shared UI bits ----------------
function LevelPill({ level, small }) {
  return <span style={{ fontSize: small ? 11 : 12, fontWeight: 500, color: lvlColor[level], background: lvlBg[level], borderRadius: 99, padding: small ? "1px 8px" : "3px 10px", whiteSpace: "nowrap" }}>{level}</span>;
}
function KindBadge({ kind }) {
  return <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: 0.6, textTransform: "uppercase", color: kind === "series" ? C.redDeep : C.gold, background: kind === "series" ? C.redSoft : C.goldSoft, borderRadius: 4, padding: "1px 5px" }}>{kind}</span>;
}
function Heart({ on, onClick, size = 18 }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); onClick(); }} aria-label={on ? "Remove favorite" : "Add favorite"}
      style={{ background: "none", border: "none", cursor: "pointer", padding: 4, lineHeight: 0, color: on ? C.red : "#C9BFB4", fontSize: size }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill={on ? C.red : "none"} stroke="currentColor" strokeWidth="2"><path d="M19 14c1.5-1.5 3-3.3 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3.4 1-4.5 2.5C10.9 4 9.3 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.2 1.5 4 3 5.5l7 7Z"/></svg>
    </button>
  );
}
function Select({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const active = !!value;
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen((o) => !o)}
        style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontFamily: fonts, fontWeight: active ? 600 : 400, color: active ? C.redDeep : C.muted, background: active ? C.redSoft : "#fff", border: `1px solid ${active ? C.red : C.line}`, borderRadius: 99, padding: "5px 10px", maxWidth: 170, cursor: "pointer", outline: "none" }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value || placeholder}</span>
        {active
          ? <span onClick={(e) => { e.stopPropagation(); onChange(""); setOpen(false); }} aria-label={`Clear ${placeholder} filter`}
              style={{ display: "inline-flex", color: C.redDeep, cursor: "pointer" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </span>
          : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}><path d="M6 9l6 6 6-6"/></svg>}
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          <div style={{ position: "absolute", top: 34, left: 0, zIndex: 41, background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, boxShadow: "0 6px 24px rgba(0,0,0,.12)", padding: 4, minWidth: 150, maxHeight: 260, overflowY: "auto" }}>
            {options.map((o) => (
              <button key={o} onClick={() => { onChange(o); setOpen(false); }}
                style={{ display: "block", width: "100%", textAlign: "left", fontFamily: fonts, fontSize: 12.5, fontWeight: o === value ? 700 : 500, color: o === value ? C.redDeep : C.ink, background: o === value ? C.redSoft : "none", border: "none", borderRadius: 7, padding: "8px 12px", cursor: "pointer", whiteSpace: "nowrap" }}>{o}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ExerciseCard({ exo, fav, onFav, onOpen, draggable, onDragStart, compact }) {
  return (
    <div onClick={onOpen} draggable={draggable} onDragStart={onDragStart}
      style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, padding: compact ? "10px 12px" : "12px 14px", display: "flex", alignItems: "center", gap: 8, cursor: draggable ? "grab" : "pointer" }}
      className="exCard">
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 600, fontSize: compact ? 13 : 14.5, color: C.ink }}>{exo.name}</span>
          {!compact && <LevelPill level={exo.level} small />}
        </div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 6, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          {exo.collection && <><span>{exo.collection.name}</span><KindBadge kind={exo.collection.kind} /><span>·</span></>}
          <span>{exo.apparatus}</span>
          {compact && <><span>·</span><span>{exo.level}</span></>}
        </div>
      </div>
      {onFav && <Heart on={fav} onClick={onFav} />}
    </div>
  );
}

// ---------------- filters ----------------
const noFilters = { apparatus: "", level: "", muscle: "", collection: "" };
function applyFilters(list, f) {
  return list.filter((e) =>
    (!f.apparatus || e.apparatus === f.apparatus) &&
    (!f.level || e.level === f.level) &&
    (!f.muscle || e.muscleFocus.includes(f.muscle)) &&
    (!f.collection || e.collection?.name === f.collection));
}
function FilterRow({ filters, setFilters, scope, hideApparatus }) {
  const colls = useMemo(() => {
    const pool = filters.apparatus ? scope.filter((e) => e.apparatus === filters.apparatus) : scope;
    return [...new Set(pool.filter((e) => e.collection).map((e) => e.collection.name))].sort();
  }, [filters.apparatus, scope]);
  const active = (hideApparatus ? [filters.level, filters.muscle, filters.collection] : Object.values(filters)).some(Boolean);
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
      {!hideApparatus && <Select value={filters.apparatus} onChange={(v) => setFilters({ ...filters, apparatus: v, collection: "" })} options={[...new Set(scope.map((e) => e.apparatus))].sort()} placeholder="Apparatus" />}
      <Select value={filters.level} onChange={(v) => setFilters({ ...filters, level: v })} options={LEVELS} placeholder="Level" />
      <Select value={filters.muscle} onChange={(v) => setFilters({ ...filters, muscle: v })} options={[...new Set(scope.flatMap((e) => e.muscleFocus))].sort()} placeholder="Muscle focus" />
      <Select value={filters.collection} onChange={(v) => setFilters({ ...filters, collection: v })} options={colls} placeholder="Series / group" />
      {active && <button onClick={() => setFilters(noFilters)} style={{ fontSize: 12, color: C.muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Clear</button>}
    </div>
  );
}

// ---------------- exercise detail drawer ----------------
function Drawer({ ctx, setCtx, user, toggleFav, setNote, isMobile }) {
  const open = !!ctx;
  const exo = ctx ? byId[ctx.list[ctx.index]] : null;
  useEffect(() => {
    const f = (e) => { if (e.key === "Escape") setCtx(null); };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [setCtx]);
  if (!open || !exo) return null;
  const sheet = isMobile
    ? { position: "fixed", left: 0, right: 0, bottom: 0, height: "88%", borderRadius: "16px 16px 0 0", animation: "slideUp .25s ease" }
    : { position: "fixed", top: 0, right: 0, bottom: 0, width: "min(58%, 640px)", animation: "slideIn .25s ease" };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50 }}>
      <div onClick={() => setCtx(null)} style={{ position: "absolute", inset: 0, background: "rgba(34,24,18,.42)", animation: "fadeIn .25s ease" }} />
      <div style={{ ...sheet, background: C.card, boxShadow: "-8px 0 32px rgba(0,0,0,.18)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "14px 18px 10px", borderBottom: `1px solid ${C.line}`, background: C.card }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <h2 style={{ margin: 0, flex: 1, fontSize: 22, fontWeight: 800, color: C.ink, textTransform: "uppercase", letterSpacing: 0.4, display: "flex", alignItems: "center", gap: 8 }}>
              {exo.name}
              <Heart on={user.favorites.includes(exo.id)} onClick={() => toggleFav(exo.id)} size={20} />
            </h2>
            <button onClick={() => setCtx(null)} aria-label="Close" style={{ ...navBtn(false), fontSize: 18, flexShrink: 0 }}>✕</button>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginTop: 10 }}>
            <span style={chip}>Block {exo.block} · {BLOCKS[exo.block - 1]}</span>
            {exo.collection && <span style={{ ...chip, display: "inline-flex", gap: 5, alignItems: "center" }}>{exo.collection.name} <KindBadge kind={exo.collection.kind} /></span>}
            <span style={chip}>{exo.apparatus}</span>
            <LevelPill level={exo.level} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px 24px" }}>
          <div style={{ width: "100%", aspectRatio: "16 / 5", background: C.lineSoft, border: `1px dashed ${C.line}`, borderRadius: 10, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "#B9AFA3", fontSize: 12, textAlign: "center", padding: "0 16px", boxSizing: "border-box" }}>
            Exercise photo — one wide image showing the movement sequence
          </div>
          <Section label="Description">
            <p style={p}>{exo.setup}</p>
            {exo.resistance && <p style={{ ...p, fontStyle: "italic", color: C.muted }}>Resistance: {exo.resistance}</p>}
          </Section>
          {(exo.exhale || exo.inhale) && (
            <Section label="Movement">
              {exo.exhale && <p style={p}><b style={{ color: C.redDeep }}>Exhale:</b> {exo.exhale}</p>}
              {exo.inhale && <p style={p}><b style={{ color: C.redDeep }}>Inhale:</b> {exo.inhale}</p>}
            </Section>
          )}
          <Section label="Muscle focus">
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {exo.muscleFocus.map((m) => <span key={m} style={{ ...chip, background: C.redSoft, borderColor: "transparent", color: C.redDeep, fontWeight: 600 }}>{m}</span>)}
            </div>
          </Section>
          <Section label="Objectives">
            <ul style={ul}>{exo.objectives.map((o) => <li key={o} style={li}><span style={{ color: C.muted }}>—</span><span>{o}</span></li>)}</ul>
          </Section>
          <Section label="Cues">
            <ul style={ul}>{exo.cues.map((c) => <li key={c} style={li}><span style={{ color: C.muted }}>—</span><span>{c}</span></li>)}</ul>
          </Section>
          <Section label="My notes">
            <textarea value={user.notes[exo.id] || ""} onChange={(e) => setNote(exo.id, e.target.value)}
              placeholder="Spring settings, corrections from class, what to feel…"
              style={{ width: "100%", minHeight: 96, boxSizing: "border-box", fontFamily: fonts, fontSize: 14, lineHeight: 1.5, color: C.ink, background: C.paper, border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", resize: "vertical", outline: "none" }} />
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Saved automatically</div>
          </Section>
        </div>
      </div>
    </div>
  );
}
const chip = { fontSize: 12, color: C.ink, background: C.card, border: `1px solid ${C.line}`, borderRadius: 99, padding: "3px 10px" };
const p = { margin: "0 0 6px", fontSize: 14, lineHeight: 1.55, color: C.ink };
const ul = { margin: 0, padding: 0, listStyle: "none" };
const li = { fontSize: 14, lineHeight: 1.6, color: C.ink, display: "flex", gap: 8 };
const navBtn = (off) => ({ width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.line}`, background: C.card, color: off ? "#D5CCC1" : C.ink, fontSize: 16, cursor: off ? "default" : "pointer", lineHeight: 1 });
function Section({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: C.muted, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

// ---------------- grouped list (browse all / search) ----------------
function Empty({ msg }) {
  return <div style={{ padding: "40px 16px", textAlign: "center", color: C.muted, fontSize: 14 }}>{msg}</div>;
}

// ---------------- explore ----------------
const APPARATUS_ORDER = ["Mat", "Reformer", "Cadillac", "Wunda Chair", "Spine Corrector", "Ladder Barrel"];
function apparatusRank(a) { const i = APPARATUS_ORDER.indexOf(a); return i === -1 ? APPARATUS_ORDER.length : i; }

function SeriesGroupedList({ list, user, toggleFav, openFrom }) {
  if (!list.length) return <Empty msg="No exercises match these filters." />;
  // Group consecutive items by collection (series OR group); both get a bordered container.
  const allIds = list.map((x) => x.id);
  const segments = [];
  list.forEach((e) => {
    const collKey = e.collection ? e.collection.name + "|" + e.apparatus : null;
    const last = segments[segments.length - 1];
    if (collKey && last && last.collKey === collKey) {
      last.items.push(e);
    } else if (collKey) {
      segments.push({ collKey, collection: e.collection, items: [e] });
    } else {
      segments.push({ collKey: null, items: [e] });
    }
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {segments.map((seg, si) =>
        seg.collKey ? (
          <div key={si} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{seg.collection.name}</span>
              <span style={{ fontSize: 12, color: C.muted }}>{seg.items.length} {seg.items.length === 1 ? "exercise" : "exercises"}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {seg.items.map((m) => (
                <ExerciseCard key={m.id} exo={m} compact fav={user.favorites.includes(m.id)} onFav={() => toggleFav(m.id)}
                  onOpen={() => openFrom(allIds, m.id)} />
              ))}
            </div>
          </div>
        ) : (
          <div key={si} style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {seg.items.map((e) => (
              <ExerciseCard key={e.id} exo={e} fav={user.favorites.includes(e.id)} onFav={() => toggleFav(e.id)} onOpen={() => openFrom(allIds, e.id)} />
            ))}
          </div>
        )
      )}
    </div>
  );
}

function ApparatusGroupedList({ list, user, toggleFav, openFrom }) {
  const present = [...new Set(list.map((e) => e.apparatus))].sort((a, b) => apparatusRank(a) - apparatusRank(b));
  const groups = present.map((ap) => [ap, list.filter((e) => e.apparatus === ap)]).filter(([, a]) => a.length);
  const flat = groups.flatMap(([, a]) => a.map((e) => e.id));
  if (!list.length) return <Empty msg="No exercises match." />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {groups.map(([ap, exs]) => (
        <div key={ap}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 13.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.8, color: C.ink }}>{ap}</span>
            <span style={{ fontSize: 12, color: C.muted }}>{exs.length}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {exs.map((e) => (
              <ExerciseCard key={e.id} exo={e} fav={user.favorites.includes(e.id)} onFav={() => toggleFav(e.id)} onOpen={() => openFrom(flat, e.id)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Explore({ user, toggleFav, openFrom, isMobile }) {
  const [block, setBlock] = useState(null);       // selected wedge, or null = All
  const [coll, setColl] = useState("all");        // all | favorites
  const [apparatusTab, setApparatusTab] = useState(null); // selected apparatus in All view
  const [filters, setFilters] = useState(noFilters);
  const [searchTab, setSearchTab] = useState("exercises");
  const [query, setQuery] = useState("");

  useEffect(() => { setFilters(noFilters); }, [block, coll]);

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;

  // base scope: favorites or everything; block filter applied when a wedge is selected
  const baseScope = coll === "favorites" ? EXERCISES.filter((e) => user.favorites.includes(e.id)) : EXERCISES;
  const blockScope = block ? baseScope.filter((e) => e.block === block) : baseScope;

  // apparatus tabs apply only in the All view (no block, not searching)
  const allView = !block && !searching;
  // only show apparatus tabs that still have matches under the current (non-apparatus) filters
  const apparatusesInScope = useMemo(() => {
    const filtered = applyFilters(baseScope, { ...filters, apparatus: "" });
    return [...new Set(filtered.map((e) => e.apparatus))].sort((a, b) => apparatusRank(a) - apparatusRank(b));
  }, [baseScope, filters]);
  const activeAppTab = allView ? (apparatusesInScope.includes(apparatusTab) ? apparatusTab : apparatusesInScope[0]) : null;

  // in All view, scope to the active apparatus tab; apparatus filter is replaced by the tab there
  const tabScope = allView && activeAppTab ? blockScope.filter((e) => e.apparatus === activeAppTab) : blockScope;
  const visible = applyFilters(tabScope, allView ? { ...filters, apparatus: "" } : filters);

  // ---- panel contents ----
  let panelBody;
  if (searching) {
    const pool = applyFilters(baseScope.filter((e) => block ? e.block === block : true), filters);
    const exMatches = pool.filter((e) => e.name.toLowerCase().includes(q));
    const collMap = {};
    pool.forEach((e) => {
      if (e.collection && e.collection.name.toLowerCase().includes(q)) {
        const key = e.collection.name + "|" + e.apparatus;
        (collMap[key] = collMap[key] || { ...e.collection, apparatus: e.apparatus, members: [] }).members.push(e);
      }
    });
    const collMatches = Object.values(collMap);
    panelBody = (
      <>
        <div style={{ display: "flex", gap: 4, margin: "4px 0 14px", borderBottom: `1px solid ${C.line}` }}>
          {[["exercises", `Exercises (${exMatches.length})`], ["collections", `Series & groups (${collMatches.length})`]].map(([k, label]) => (
            <button key={k} onClick={() => setSearchTab(k)}
              style={{ fontFamily: fonts, fontSize: 13, fontWeight: 600, padding: "7px 12px", background: "none", border: "none", cursor: "pointer", color: searchTab === k ? C.red : C.muted, borderBottom: searchTab === k ? `2px solid ${C.red}` : "2px solid transparent", marginBottom: -1 }}>{label}</button>
          ))}
        </div>
        {searchTab === "exercises"
          ? <ApparatusGroupedList list={exMatches} user={user} toggleFav={toggleFav} openFrom={openFrom} />
          : collMatches.length
            ? <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {collMatches.map((cm) => (
                  <div key={cm.name + cm.apparatus} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, fontSize: 14.5 }}>{cm.name}</span>
                      <KindBadge kind={cm.kind} />
                      <span style={{ fontSize: 12, color: C.muted }}>{cm.apparatus} · {cm.members.length} exercises</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {cm.members.map((m) => (
                        <ExerciseCard key={m.id} exo={m} compact fav={user.favorites.includes(m.id)} onFav={() => toggleFav(m.id)}
                          onOpen={() => openFrom(cm.members.map((x) => x.id), m.id)} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            : <Empty msg="No series or groups match." />}
      </>
    );
  } else if (coll === "favorites" && baseScope.length === 0) {
    panelBody = <Empty msg="No favorites yet. Tap the heart on any exercise to keep it here." />;
  } else if (block) {
    panelBody = <SeriesGroupedList list={visible} user={user} toggleFav={toggleFav} openFrom={openFrom} />;
  } else {
    // All view — scoped to active apparatus tab
    panelBody = <SeriesGroupedList list={visible} user={user} toggleFav={toggleFav} openFrom={openFrom} />;
  }

  // ---- panel header (title row) ----
  const panelTitle = block ? (
    <div>
      <button onClick={() => setBlock(null)} style={{ ...linkBtn, padding: "2px 0" }}>← All</button>
      <div style={{ fontSize: 11.5, fontWeight: 800, color: C.red, marginTop: 10 }}>BLOCK {block}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <h2 style={{ ...h2, fontSize: 17, margin: "1px 0 0" }}>{BLOCKS[block - 1]}</h2>
        <span style={{ fontSize: 12, color: C.muted, whiteSpace: "nowrap" }}>{visible.length} {visible.length === 1 ? "exercise" : "exercises"}</span>
      </div>
    </div>
  ) : null;

  const panel = (
    <div style={isMobile
      ? { padding: "10px 14px 90px" }
      : { width: "clamp(400px, 48%, 600px)", flexShrink: 0, borderLeft: `1px solid ${C.line}`, background: C.card, display: "flex", flexDirection: "column", minHeight: 0 }}>
      <div style={{ padding: isMobile ? "0 0 12px" : "16px 18px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", background: C.lineSoft, borderRadius: 99, padding: 3, width: "fit-content" }}>
          {[["all", "All"], ["favorites", `♥ Favorites${user.favorites.length ? " " + user.favorites.length : ""}`]].map(([k, label]) => (
            <button key={k} onClick={() => setColl(k)}
              style={{ fontFamily: fonts, fontSize: 12.5, fontWeight: 700, padding: "5px 14px", borderRadius: 99, border: "none", cursor: "pointer", background: coll === k ? C.card : "transparent", color: coll === k ? C.redDeep : C.muted, boxShadow: coll === k ? "0 1px 2px rgba(0,0,0,.08)" : "none" }}>{label}</button>
          ))}
        </div>
        {searchBar(query, setQuery)}
        <FilterRow filters={filters} setFilters={setFilters} scope={block ? baseScope.filter((e) => e.block === block) : baseScope} hideApparatus={allView} />
      </div>
      <div style={{ flex: isMobile ? "none" : 1, overflowY: isMobile ? "visible" : "auto", borderTop: isMobile ? "none" : `1px solid ${C.line}` }}>
        {allView && apparatusesInScope.length > 0 && (
          <div style={{ display: "flex", gap: 2, overflowX: "auto", overflowY: "hidden", whiteSpace: "nowrap", padding: isMobile ? "10px 0 0" : "0 18px", position: isMobile ? "static" : "sticky", top: 0, background: C.card, zIndex: 2 }}>
            {apparatusesInScope.map((ap) => {
              const n = applyFilters(baseScope.filter((e) => e.apparatus === ap), { ...filters, apparatus: "" }).length;
              const on = ap === activeAppTab;
              return (
                <button key={ap} onClick={() => setApparatusTab(ap)}
                  style={{ fontFamily: fonts, fontSize: 12.5, fontWeight: 600, padding: "9px 9px", background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, color: on ? C.red : C.muted, borderBottom: on ? `2px solid ${C.red}` : "2px solid transparent", marginBottom: -1 }}>
                  {ap} <span style={{ fontSize: 11, opacity: 0.7 }}>{n}</span>
                </button>
              );
            })}
          </div>
        )}
        <div style={{ padding: isMobile ? "12px 0 0" : "12px 18px 24px" }}>
          {block && !searching && (
            <div style={{ marginBottom: 12 }}>
              {panelTitle}
            </div>
          )}
          {panelBody}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", height: isMobile ? "auto" : "100%", overflow: isMobile ? "visible" : "hidden" }}>
      <div style={{ flex: isMobile ? "none" : 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: isMobile ? "16px 0 4px" : 24 }}>
        <Wheel selected={block} onSelect={(n) => setBlock(n)} size={isMobile ? Math.min(360, window.innerWidth - 28) : 460} />
        <div style={{ marginTop: 10, fontSize: 12.5, color: C.muted, height: 18 }}>
          {block ? `Showing ${BLOCKS[block - 1]} — click center or ← All to clear` : "Click a block to explore exercises"}
        </div>
      </div>
      {panel}
    </div>
  );
}

function searchBar(query, setQuery) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search exercises, series, groups…"
        style={{ ...searchInput, paddingLeft: 36 }} />
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"
        style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      {query && <button onClick={() => setQuery("")} aria-label="Clear search" style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 17, lineHeight: 1 }}>✕</button>}
    </div>
  );
}

const h2 = { margin: 0, fontSize: 19, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, color: C.ink };
const linkBtn = { fontFamily: fonts, fontSize: 13, fontWeight: 600, color: C.redDeep, background: "none", border: "none", cursor: "pointer", padding: 4 };

// ---------------- programs ----------------
const iconBtn = { width: 32, height: 32, display: "inline-flex", alignItems: "center", justifyContent: "center", background: C.card, border: `1px solid ${C.line}`, borderRadius: 8, cursor: "pointer", color: C.muted, padding: 0, flexShrink: 0 };
const menuPop = { position: "absolute", right: 0, top: 36, zIndex: 31, background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, boxShadow: "0 6px 24px rgba(0,0,0,.12)", padding: 4, display: "flex", flexDirection: "column", minWidth: 130 };
const menuItem = { fontFamily: fonts, fontSize: 13, fontWeight: 600, color: C.ink, background: "none", border: "none", borderRadius: 7, padding: "8px 12px", textAlign: "left", cursor: "pointer" };
const PencilIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>;
const TrashIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6"/></svg>;
const DotsIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>;

function ConfirmDialog({ title, body, confirmLabel, onConfirm, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(34,24,18,.45)", animation: "fadeIn .2s ease" }} />
      <div style={{ position: "relative", background: C.card, borderRadius: 14, padding: "20px 22px", width: "min(360px, 88vw)", boxSizing: "border-box", boxShadow: "0 10px 40px rgba(0,0,0,.25)", animation: "slideUp .2s ease" }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.5, marginBottom: 16 }}>{body}</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={ghostBtn}>Cancel</button>
          <button onClick={onConfirm} style={{ ...primaryBtn, background: C.redDeep }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

function Programs({ user, setUser, toggleFav, openFrom, isMobile, leaveGuard }) {
  const [viewId, setViewId] = useState(null);   // board shown in class flow
  const [draft, setDraft] = useState(null);     // local copy while editing
  const [menuId, setMenuId] = useState(null);   // board id with open ... menu
  const [toDelete, setToDelete] = useState(null);
  const [discardPrompt, setDiscardPrompt] = useState(null); // holds pending nav action
  const draftRef = useRef(null);

  const isDirty = () => draftRef.current && JSON.stringify(draftRef.current.draft) !== draftRef.current.original;

  // Register a guard so App-level navigation (tabs, search, favorites) is intercepted while a draft is dirty.
  useEffect(() => {
    leaveGuard.current = (pendingFn) => {
      if (!isDirty()) return true;
      setDiscardPrompt({ run: pendingFn || null }); // capture intended destination
      return false;
    };
    return () => { leaveGuard.current = null; };
  }, [leaveGuard]);

  const openDraft = (b, original) => { draftRef.current = { draft: b, original }; setDraft(b); };
  const updateDraft = (b) => { draftRef.current = { ...draftRef.current, draft: b }; setDraft(b); };
  const closeDraft = () => { draftRef.current = null; setDraft(null); };

  const startNew = () => { const b = { id: uid(), name: "Untitled program", blocks: {} }; openDraft(b, JSON.stringify(b)); };
  const startEdit = (b) => { const copy = JSON.parse(JSON.stringify(b)); openDraft(copy, JSON.stringify(copy)); };
  const saveDraft = () => {
    const exists = user.programs.some((b) => b.id === draft.id);
    setUser({ ...user, programs: exists ? user.programs.map((b) => (b.id === draft.id ? draft : b)) : [...user.programs, draft] });
    setViewId(draft.id);
    closeDraft();
  };
  const cancelEdit = () => {
    if (isDirty()) { setDiscardPrompt({ run: () => { setViewId(user.programs.some((b) => b.id === draft.id) ? draft.id : null); closeDraft(); } }); return; }
    setViewId(user.programs.some((b) => b.id === draft.id) ? draft.id : null);
    closeDraft();
  };
  const confirmDiscard = () => {
    const action = discardPrompt?.run;
    closeDraft();
    setDiscardPrompt(null);
    if (action) action();
  };
  const confirmDelete = () => {
    setUser({ ...user, programs: user.programs.filter((b) => b.id !== toDelete.id) });
    if (viewId === toDelete.id) setViewId(null);
    setToDelete(null);
  };
  const dupBoard = (b) => setUser({ ...user, programs: [...user.programs, { ...b, id: uid(), name: b.name + " (copy)", blocks: JSON.parse(JSON.stringify(b.blocks)) }] });

  let content;
  const viewBoard = user.programs.find((b) => b.id === viewId);
  if (draft) {
    content = <Editor draft={draft} setDraft={updateDraft} onSave={saveDraft} onCancel={cancelEdit} openFrom={openFrom} isMobile={isMobile} />;
  } else if (viewBoard) {
    content = <FlowView board={viewBoard} back={() => setViewId(null)} onEdit={() => startEdit(viewBoard)} onDelete={() => setToDelete(viewBoard)} user={user} openFrom={openFrom} isMobile={isMobile} />;
  } else {
    content = (
      <div style={{ padding: isMobile ? "16px 14px 90px" : "24px 28px", maxWidth: 760, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          <h2 style={h2}>My programs</h2>
          <div style={{ flex: 1 }} />
          <button onClick={startNew} style={primaryBtn}>+ New program</button>
        </div>
        {user.programs.length === 0 && (
          <Empty msg="No programs yet. Create one and build a class by placing exercises into the twelve blocks — your tools, your judgment." />
        )}
        <div>
          {user.programs.map((b) => {
            const count = Object.values(b.blocks).reduce((s, a) => s + a.length, 0);
            return (
              <div key={b.id} onClick={() => setViewId(b.id)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10, padding: "15px 10px", borderBottom: `1px solid ${C.line}` }} className="progRow">
                <div style={{ flex: 1, minWidth: 120 }}>
                  <div style={{ fontWeight: 700, fontSize: 15.5 }}>{b.name}</div>
                  <div style={{ fontSize: 12.5, color: C.muted, marginTop: 3 }}>{count} {count === 1 ? "exercise" : "exercises"}</div>
                </div>
                <div style={{ position: "relative" }}>
                  <button onClick={(e) => { e.stopPropagation(); setMenuId(menuId === b.id ? null : b.id); }} title="More" aria-label="More actions"
                    style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 6, display: "inline-flex", borderRadius: 6 }} className="menuDots"><DotsIcon /></button>
                  {menuId === b.id && (
                    <>
                      <div onClick={(e) => { e.stopPropagation(); setMenuId(null); }} style={{ position: "fixed", inset: 0, zIndex: 30 }} />
                      <div style={menuPop} onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => { startEdit(b); setMenuId(null); }} style={menuItem}>Edit</button>
                        <button onClick={() => { dupBoard(b); setMenuId(null); }} style={menuItem}>Duplicate</button>
                        <button onClick={() => { setToDelete(b); setMenuId(null); }} style={{ ...menuItem, color: C.redDeep }}>Delete</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <>
      {content}
      {toDelete && (
        <ConfirmDialog title="Delete this program?" body={`"${toDelete.name}" will be permanently removed. Exercises and notes are not affected.`}
          confirmLabel="Delete" onConfirm={confirmDelete} onClose={() => setToDelete(null)} />
      )}
      {discardPrompt && (
        <ConfirmDialog title="Discard unsaved changes?" body="This program has changes that haven't been saved. Leaving now will lose them."
          confirmLabel="Discard" onConfirm={confirmDiscard} onClose={() => setDiscardPrompt(null)} />
      )}
    </>
  );
}
const primaryBtn = { fontFamily: fonts, fontSize: 12.5, fontWeight: 700, color: "#fff", background: C.red, border: "none", borderRadius: 8, padding: "7px 13px", cursor: "pointer" };
const ghostBtn = { fontFamily: fonts, fontSize: 12.5, fontWeight: 600, color: C.muted, background: "none", border: `1px solid ${C.line}`, borderRadius: 8, padding: "6px 10px", cursor: "pointer" };

// ---- class flow (view mode) ----
function FlowView({ board, back, onEdit, onDelete, user, openFrom, isMobile }) {
  const blocksWith = BLOCKS.map((name, i) => [i + 1, name, board.blocks[i + 1] || []]);
  const total = blocksWith.reduce((s, [, , a]) => s + a.length, 0);
  return (
    <div style={{ height: "100%", overflowY: "auto", paddingBottom: isMobile ? 90 : 30 }}>
      <div style={{ maxWidth: 680, margin: "0 auto", width: "100%", boxSizing: "border-box", padding: isMobile ? "12px 14px 8px" : "16px 18px 10px" }}>
        <button onClick={back} style={{ ...linkBtn, padding: "4px 0" }}>← Back</button>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <h2 style={{ ...h2, flex: 1, minWidth: 120 }}>{board.name}</h2>
          <button onClick={onEdit} title="Edit" aria-label="Edit program" style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 6, display: "inline-flex", borderRadius: 6 }} className="menuDots"><PencilIcon /></button>
          <button onClick={onDelete} title="Delete" aria-label="Delete program" style={{ background: "none", border: "none", cursor: "pointer", color: C.redDeep, padding: 6, display: "inline-flex", borderRadius: 6 }} className="menuDots"><TrashIcon /></button>
        </div>
      </div>
      <div style={{ maxWidth: 680, margin: "0 auto", width: "100%", boxSizing: "border-box", padding: "8px 18px" }}>
        {total === 0 && (
          <div style={{ textAlign: "center", padding: "40px 16px" }}>
            <div style={{ color: C.muted, fontSize: 14, marginBottom: 14 }}>This program is empty.</div>
            <button onClick={onEdit} style={primaryBtn}>Build it</button>
          </div>
        )}
        {blocksWith.map(([n, name, ids]) => ids.length > 0 && (
          <div key={n} style={{ marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.redSoft, borderRadius: 8, padding: "6px 11px", marginBottom: 10 }}>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: C.redDeep }}>{n}</span>
              <span style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.6, color: C.redDeep }}>{name}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {ids.map((id) => {
                const e = byId[id];
                if (!e) return null;
                return (
                  <ExerciseCard key={id} exo={e} onOpen={() => openFrom(ids, id)} />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- editor (build mode — drafts, committed on Save) ----
function MobileBlockRows({ ids, blockN, onReorder, onRemove, onOpen }) {
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const dragIdxRef = useRef(null);
  const overIdxRef = useRef(null);
  const holdTimer = useRef(null);
  const startY = useRef(0);
  const rowRefs = useRef({});
  const movedRef = useRef(false);

  const cancelHold = () => { clearTimeout(holdTimer.current); holdTimer.current = null; };
  const setDrag = (v) => { dragIdxRef.current = v; setDragIdx(v); };
  const setOver = (v) => { overIdxRef.current = v; setOverIdx(v); };

  const findTarget = (y) => {
    let target = dragIdxRef.current;
    for (const k of Object.keys(rowRefs.current)) {
      const el = rowRefs.current[k];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (y >= r.top && y <= r.bottom) { target = Number(k); break; }
      if (y < r.top) target = Math.min(target, Number(k));
      if (y > r.bottom) target = Math.max(target, Number(k));
    }
    return target;
  };

  const onPointerDown = (idx, e) => {
    if (e.button === 2) return;
    startY.current = e.clientY;
    movedRef.current = false;
    const move = (ev) => {
      const y = ev.clientY;
      if (dragIdxRef.current === null) {
        if (Math.abs(y - startY.current) > 8) cancelHold();
        return;
      }
      ev.preventDefault();
      movedRef.current = true;
      setOver(findTarget(y));
    };
    const up = () => {
      cancelHold();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      const d = dragIdxRef.current, o = overIdxRef.current;
      if (d !== null && o !== null && o !== d) {
        const next = [...ids];
        const [moved] = next.splice(d, 1);
        next.splice(o, 0, moved);
        onReorder(next);
      } else if (d === null && !movedRef.current) {
        onOpen(ids[idx]);
      }
      setDrag(null); setOver(null);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    holdTimer.current = setTimeout(() => {
      setDrag(idx); setOver(idx);
      if (navigator.vibrate) navigator.vibrate(15);
    }, 350);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {ids.map((id, idx) => {
        const e = byId[id];
        if (!e) return null;
        const dragging = dragIdx === idx;
        const showLineBefore = dragIdx !== null && overIdx === idx && overIdx < dragIdx;
        const showLineAfter = dragIdx !== null && overIdx === idx && overIdx > dragIdx;
        return (
          <div key={id} ref={(el) => (rowRefs.current[idx] = el)}>
            {showLineBefore && <div style={{ height: 2, background: C.red, borderRadius: 2, marginBottom: 5 }} />}
            <div
              onPointerDown={(ev) => onPointerDown(idx, ev)}
              style={{ background: C.card, border: `1px solid ${dragging ? C.red : C.line}`, borderRadius: 8, padding: "9px 10px", display: "flex", alignItems: "center", gap: 8, opacity: dragging ? 0.92 : 1, boxShadow: dragging ? "0 6px 18px rgba(0,0,0,.16)" : "none", transform: dragging ? "scale(1.02)" : "none", transition: dragging ? "none" : "box-shadow .15s", touchAction: "pan-y", cursor: "grab", userSelect: "none" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill={C.muted} style={{ flexShrink: 0, opacity: 0.5 }}><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5, lineHeight: 1.3 }}>{e.name}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2, display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap" }}>
                  <span>{e.apparatus}</span>
                  {e.collection && <><span>·</span><span>{e.collection.name}</span><KindBadge kind={e.collection.kind} /></>}
                </div>
              </div>
              <button onPointerDown={(ev) => ev.stopPropagation()} onClick={() => onRemove(id)} aria-label="Remove" style={{ border: "none", background: "none", color: C.redDeep, fontSize: 16, padding: "4px 6px", flexShrink: 0 }}>✕</button>
            </div>
            {showLineAfter && <div style={{ height: 2, background: C.red, borderRadius: 2, marginTop: 5 }} />}
          </div>
        );
      })}
    </div>
  );
}

function Editor({ draft, setDraft, onSave, onCancel, openFrom, isMobile }) {
  const [pickerBlock, setPickerBlock] = useState(null);
  const [pickQ, setPickQ] = useState("");
  const [libTab, setLibTab] = useState(null);
  const drag = useRef(null);          // { exId, fromBlock|null }  (null fromBlock = from library)
  const [dropHint, setDropHint] = useState(null); // { block, idx } insertion indicator

  const add = (blockN, exId) => {
    const arr = draft.blocks[blockN] || [];
    if (arr.includes(exId)) return;
    setDraft({ ...draft, blocks: { ...draft.blocks, [blockN]: [...arr, exId] } });
  };
  const remove = (blockN, exId) => setDraft({ ...draft, blocks: { ...draft.blocks, [blockN]: (draft.blocks[blockN] || []).filter((i) => i !== exId) } });
  const move = (blockN, idx, dir) => {
    const arr = [...(draft.blocks[blockN] || [])];
    const j = idx + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[idx], arr[j]] = [arr[j], arr[idx]];
    setDraft({ ...draft, blocks: { ...draft.blocks, [blockN]: arr } });
  };

  // unified drop: insert dragged exercise into target block at target index
  const handleDrop = (toBlock, toIdx) => {
    const d = drag.current;
    drag.current = null;
    setDropHint(null);
    if (!d) return;
    const blocks = JSON.parse(JSON.stringify(draft.blocks));
    // remove from origin if it came from a block
    if (d.fromBlock != null) {
      blocks[d.fromBlock] = (blocks[d.fromBlock] || []).filter((i) => i !== d.exId);
    }
    const target = (blocks[toBlock] || []).filter((i) => i !== d.exId);
    const at = toIdx == null ? target.length : Math.max(0, Math.min(toIdx, target.length));
    if (d.fromBlock == null && (draft.blocks[toBlock] || []).includes(d.exId)) return; // no dup from library
    target.splice(at, 0, d.exId);
    blocks[toBlock] = target;
    setDraft({ ...draft, blocks });
  };

  const header = (
    <div style={{ padding: isMobile ? "12px 14px 8px" : "16px 18px 10px" }}>
      <button onClick={onCancel} style={{ ...linkBtn, padding: "4px 0" }}>← Back</button>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
        <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          style={{ fontFamily: fonts, fontSize: 17, fontWeight: 800, color: C.ink, background: "transparent", border: "none", borderBottom: `1px dashed ${C.line}`, outline: "none", flex: 1, minWidth: 140, padding: "4px 2px" }} />
        <button onClick={onSave} style={primaryBtn}>Save</button>
      </div>
    </div>
  );

  const searchingLib = pickQ.trim().length > 0;
  const libApparatuses = useMemo(() => [...new Set(EXERCISES.map((e) => e.apparatus))].sort((a, b) => apparatusRank(a) - apparatusRank(b)), []);
  const activeLibTab = libApparatuses.includes(libTab) ? libTab : libApparatuses[0];
  const pickerList = searchingLib
    ? EXERCISES.filter((e) => e.name.toLowerCase().includes(pickQ.toLowerCase()))
    : EXERCISES.filter((e) => e.apparatus === activeLibTab);

  if (isMobile) {
    return (
      <div style={{ paddingBottom: 90 }}>
        {header}
        <div style={{ padding: "4px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
          {BLOCKS.map((name, i) => {
            const n = i + 1, ids = draft.blocks[n] || [];
            return (
              <div key={n} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: "10px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: ids.length ? 8 : 0 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: C.red }}>{n}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, flex: 1 }}>{name}</span>
                  <button onClick={() => { setPickerBlock(n); setPickQ(""); }} style={{ ...ghostBtn, fontSize: 11.5, padding: "4px 9px", color: C.redDeep, borderColor: C.line }}>+ Add</button>
                </div>
                <MobileBlockRows ids={ids} blockN={n}
                  onReorder={(newIds) => setDraft({ ...draft, blocks: { ...draft.blocks, [n]: newIds } })}
                  onRemove={(id) => remove(n, id)} onOpen={(id) => openFrom(ids, id)} />
              </div>
            );
          })}
        </div>
        {pickerBlock && (
          <div style={{ position: "fixed", inset: 0, zIndex: 60 }}>
            <div onClick={() => setPickerBlock(null)} style={{ position: "absolute", inset: 0, background: "rgba(34,24,18,.42)" }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "75%", background: C.paper, borderRadius: "16px 16px 0 0", padding: "14px 14px 20px", display: "flex", flexDirection: "column", animation: "slideUp .25s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontWeight: 800, fontSize: 14, textTransform: "uppercase" }}>Add to {BLOCKS[pickerBlock - 1]}</span>
                <div style={{ flex: 1 }} />
                <button onClick={() => setPickerBlock(null)} style={{ ...navBtn(false), fontSize: 16 }}>✕</button>
              </div>
              {librarySearch(pickQ, setPickQ)}
              {!searchingLib && (
                <div style={{ display: "flex", gap: 2, overflowX: "auto", overflowY: "hidden", whiteSpace: "nowrap", marginTop: 8 }}>
                  {libApparatuses.map((ap) => {
                    const on = ap === activeLibTab;
                    return (
                      <button key={ap} onClick={() => setLibTab(ap)}
                        style={{ fontFamily: fonts, fontSize: 11.5, fontWeight: 600, padding: "6px 8px", background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, color: on ? C.red : C.muted, borderBottom: on ? `2px solid ${C.red}` : "2px solid transparent", marginBottom: -1 }}>{ap}</button>
                    );
                  })}
                </div>
              )}
              <div style={{ flex: 1, overflowY: "auto", marginTop: 10, paddingRight: 6, display: "flex", flexDirection: "column", gap: 6 }}>
                {pickerList.map((e) => (
                  <div key={e.id} onClick={() => { add(pickerBlock, e.id); setPickerBlock(null); }}
                    style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 8, padding: "9px 12px", cursor: "pointer" }}>
                    <span style={{ fontWeight: 600, fontSize: 13.5 }}>{e.name}</span>
                    <span style={{ fontSize: 11.5, color: C.muted, marginLeft: 8 }}>{e.apparatus} · Block {e.block} · {e.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {header}
      <div style={{ flex: 1, display: "flex", minHeight: 0, margin: "0 18px 18px", border: `1px solid ${C.line}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ width: 270, borderRight: `1px solid ${C.line}`, display: "flex", flexDirection: "column", padding: "10px 12px", background: C.card }}>
          {librarySearch(pickQ, setPickQ)}
          {!searchingLib && (
            <div style={{ display: "flex", gap: 2, overflowX: "auto", overflowY: "hidden", whiteSpace: "nowrap", marginTop: 8 }}>
              {libApparatuses.map((ap) => {
                const on = ap === activeLibTab;
                return (
                  <button key={ap} onClick={() => setLibTab(ap)}
                    style={{ fontFamily: fonts, fontSize: 11.5, fontWeight: 600, padding: "6px 7px", background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, color: on ? C.red : C.muted, borderBottom: on ? `2px solid ${C.red}` : "2px solid transparent", marginBottom: -1 }}>{ap}</button>
                );
              })}
            </div>
          )}
          <div style={{ flex: 1, overflowY: "auto", marginTop: 10, paddingRight: 6, display: "flex", flexDirection: "column", gap: 6 }}>
            {pickerList.map((e) => (
              <ExerciseCard key={e.id} exo={e} compact draggable onDragStart={(ev) => { drag.current = { exId: e.id, fromBlock: null }; ev.dataTransfer.effectAllowed = "copyMove"; }}
                onOpen={() => openFrom(pickerList.map((x) => x.id), e.id)} />
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflowX: "auto", overflowY: "hidden", display: "flex", gap: 10, padding: "12px 14px 18px", alignItems: "stretch" }}>
          {BLOCKS.map((name, i) => {
            const n = i + 1, ids = draft.blocks[n] || [];
            const hintHere = dropHint && dropHint.block === n ? dropHint.idx : null;
            return (
              <div key={n}
                onDragOver={(e) => { e.preventDefault(); if (drag.current && ids.length === 0) setDropHint({ block: n, idx: 0 }); }}
                onDrop={(e) => { e.preventDefault(); handleDrop(n, hintHere); }}
                style={{ width: 215, flexShrink: 0, background: C.lineSoft, borderRadius: 12, padding: "10px 10px 12px", display: "flex", flexDirection: "column", border: `1px dashed ${ids.length ? "transparent" : C.line}` }}>
                <div style={{ display: "flex", gap: 6, alignItems: "baseline", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: C.red }}>{n}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.4, lineHeight: 1.25 }}>{name}</span>
                </div>
                <div style={{ flex: 1, overflowY: "auto", paddingRight: 4, display: "flex", flexDirection: "column", gap: 0 }}>
                  {ids.length === 0 && hintHere === 0 && <div style={{ height: 2, background: C.red, borderRadius: 2, margin: "8px 2px" }} />}
                  {ids.map((id, idx) => (
                    <div key={id}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (!drag.current) return;
                        const r = e.currentTarget.getBoundingClientRect();
                        const after = e.clientY > r.top + r.height / 2;
                        setDropHint({ block: n, idx: after ? idx + 1 : idx });
                      }}
                      style={{ paddingTop: 6 }}>
                      {hintHere === idx && <div style={{ height: 2, background: C.red, borderRadius: 2, margin: "0 2px 4px" }} />}
                      <div draggable
                        onDragStart={(ev) => { drag.current = { exId: id, fromBlock: n }; ev.dataTransfer.effectAllowed = "move"; }}
                        onDragEnd={() => { drag.current = null; setDropHint(null); }}>
                        {boardRow(byId[id], idx, ids.length, () => remove(n, id), (d) => move(n, idx, d), () => openFrom(ids, id))}
                      </div>
                      {hintHere === idx + 1 && idx === ids.length - 1 && <div style={{ height: 2, background: C.red, borderRadius: 2, margin: "4px 2px 0" }} />}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
function boardRow(e, idx, len, onRemove, onMove, onOpen, showArrows) {
  if (!e) return null;
  return (
    <div key={e.id} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 8, padding: "7px 8px", cursor: showArrows ? "default" : "grab" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        {!showArrows && <svg width="11" height="11" viewBox="0 0 24 24" fill={C.muted} style={{ flexShrink: 0, opacity: 0.55 }}><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg>}
        <div onClick={onOpen} style={{ fontWeight: 600, fontSize: 12.5, cursor: "pointer", flex: 1, lineHeight: 1.3 }}>{e.name}</div>
        <button onClick={onRemove} aria-label="Remove" style={{ ...tinyBtn(false), border: "none", background: "none", color: C.redDeep }}>✕</button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3, marginLeft: showArrows ? 0 : 16, flexWrap: "wrap" }}>
        <span style={{ fontSize: 10.5, color: C.muted }}>{e.apparatus}</span>
        {e.collection && <>
          <span style={{ fontSize: 10.5, color: C.muted }}>·</span>
          <span style={{ fontSize: 10.5, color: C.muted }}>{e.collection.name}</span>
          <KindBadge kind={e.collection.kind} />
        </>}
        <span style={{ flex: 1 }} />
        {showArrows && <>
          <button onClick={() => onMove(-1)} disabled={idx === 0} style={tinyBtn(idx === 0)}>↑</button>
          <button onClick={() => onMove(1)} disabled={idx === len - 1} style={tinyBtn(idx === len - 1)}>↓</button>
        </>}
      </div>
    </div>
  );
}
const tinyBtn = (off) => ({ fontSize: 11, width: 20, height: 20, lineHeight: 1, border: `1px solid ${C.line}`, background: "#fff", borderRadius: 5, cursor: off ? "default" : "pointer", color: off ? "#D9D1C6" : C.muted, padding: 0, flexShrink: 0 });
const searchInput = { fontFamily: fonts, fontSize: 13.5, padding: "9px 12px", border: `1px solid ${C.line}`, borderRadius: 10, outline: "none", background: "#fff", width: "100%", boxSizing: "border-box" };
function librarySearch(q, setQ) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search exercises…"
        style={{ fontFamily: fonts, fontSize: 13, padding: "6px 10px 6px 30px", border: `1px solid ${C.line}`, borderRadius: 8, outline: "none", background: "#fff", width: "100%", boxSizing: "border-box" }} />
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"
        style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)" }}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      {q && <button onClick={() => setQ("")} aria-label="Clear search" style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 15, lineHeight: 1 }}>✕</button>}
    </div>
  );
}

// ---------------- practice ----------------
function Practice({ isMobile, openFrom }) {
  const [deck, setDeck] = useState(null);
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);

  const start = () => {
    const shuffled = [...EXERCISES].sort(() => Math.random() - 0.5).slice(0, 15);
    setDeck(shuffled); setI(0); setRevealed(false); setDone(false);
  };
  const go = (d) => { const j = i + d; if (j >= 0 && j < deck.length) { setI(j); setRevealed(false); } };

  if (!deck) {
    return (
      <Center>
        <div style={{ fontSize: 44 }}>🃏</div>
        <h2 style={{ ...h2, fontSize: 24, marginTop: 8 }}>Practice session</h2>
        <p style={{ ...p, color: C.muted, textAlign: "center", maxWidth: 380, margin: "10px 0 18px" }}>
          15 exercises, shuffled. Each card shows the name, series or group, and apparatus — perform it on your own, then reveal to check yourself.
        </p>
        <button onClick={start} style={{ ...primaryBtn, fontSize: 14, padding: "10px 22px" }}>Start — 15 cards</button>
      </Center>
    );
  }
  if (done) {
    return (
      <Center>
        <div style={{ fontSize: 44 }}>🎉</div>
        <h2 style={{ ...h2, fontSize: 24, marginTop: 8 }}>Session complete</h2>
        <p style={{ ...p, color: C.muted, margin: "8px 0 18px" }}>15 of 15 — nicely done.</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={start} style={primaryBtn}>New session</button>
          <button onClick={() => { setDeck(null); setDone(false); }} style={ghostBtn}>Done</button>
        </div>
      </Center>
    );
  }
  const e = deck[i];
  const atEnd = i === deck.length - 1;

  const card = (
    <div style={{ width: isMobile ? "100%" : "min(420px, 78vw)", background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: isMobile ? "20px 16px" : "24px 24px", textAlign: "center", boxShadow: "0 2px 12px rgba(60,40,20,.06)", boxSizing: "border-box" }}>
      <div style={{ fontSize: isMobile ? 10.5 : 11.5, fontWeight: 800, letterSpacing: 1.2, color: C.red, marginBottom: 8 }}>BLOCK {e.block} · {BLOCKS[e.block - 1].toUpperCase()}</div>
      <div style={{ fontSize: isMobile ? 19 : 25, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.4, color: C.ink, lineHeight: 1.2 }}>{e.name}</div>
      <div style={{ fontSize: isMobile ? 12 : 13.5, color: C.muted, marginTop: 9, display: "flex", justifyContent: "center", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
        {e.collection && <><span>{e.collection.name}</span><KindBadge kind={e.collection.kind} /><span>·</span></>}
        <span>{e.apparatus}</span>
        <span>·</span>
        <LevelPill level={e.level} small />
      </div>
      {revealed && (
        <div style={{ textAlign: "left", marginTop: 16, borderTop: `1px solid ${C.lineSoft}`, paddingTop: 16 }}>
          <p style={{ ...p, fontSize: isMobile ? 13.5 : 14, marginBottom: 12 }}>{e.setup}</p>
          <div style={{ textAlign: "center" }}>
            <button onClick={() => openFrom(deck.map((x) => x.id), e.id)}
              style={{ fontFamily: fonts, fontSize: 12.5, fontWeight: 700, color: C.red, background: "none", border: "none", cursor: "pointer", padding: 4 }}>View full details →</button>
          </div>
        </div>
      )}
    </div>
  );

  const circleBtn = (onClick, disabled, label, glyph, primary) => (
    <button onClick={onClick} disabled={disabled} aria-label={label}
      style={{ width: 40, height: 40, flexShrink: 0, borderRadius: 99, border: primary ? "none" : `1px solid ${C.line}`, background: primary ? C.red : C.card, color: primary ? "#fff" : (disabled ? "#D5CCC1" : C.ink), fontSize: 17, cursor: disabled ? "default" : "pointer", lineHeight: 1 }}>{glyph}</button>
  );
  const revealBtn = (
    <button onClick={() => setRevealed(!revealed)}
      style={{ fontFamily: fonts, fontSize: 12.5, fontWeight: 700, color: C.muted, background: C.lineSoft, border: "none", cursor: "pointer", padding: "10px 20px", borderRadius: 8 }}>{revealed ? "Hide" : "Reveal"}</button>
  );

  if (isMobile) {
    return (
      <Center>
        {card}
        <div style={{ marginTop: 16 }}>{revealBtn}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, width: "100%", maxWidth: 320, marginTop: 16 }}>
          {circleBtn(() => go(-1), i === 0, "Previous", "←", false)}
          <span style={{ fontSize: 12, color: C.muted }}>{i + 1} / 15</span>
          {circleBtn(() => atEnd ? setDone(true) : go(1), false, atEnd ? "Finish" : "Next", atEnd ? "✓" : "→", true)}
        </div>
      </Center>
    );
  }

  return (
    <Center>
      <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 14, letterSpacing: 1 }}>{i + 1} OF 15</div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {circleBtn(() => go(-1), i === 0, "Previous", "←", false)}
        {card}
        {circleBtn(() => atEnd ? setDone(true) : go(1), false, atEnd ? "Finish" : "Next", atEnd ? "✓" : "→", true)}
      </div>
      <div style={{ marginTop: 18 }}>{revealBtn}</div>
    </Center>
  );
}
function Center({ children }) {
  return <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "30px 16px 90px", boxSizing: "border-box" }}>{children}</div>;
}

// ---------------- app shell ----------------
const TABS = [
  ["explore", "Explore", "M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20ZM16 8l-2.5 6.5L8 16l2.5-6.5L16 8Z"],
  ["programs", "Programs", "M4 4h5v16H4zM10 4h5v10h-5zM16 4h5v7h-5z"],
  ["practice", "Practice", "M6 3h9l3 3v15H6zM6 8h12"],
];
function NavIcon({ d }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d={d} /></svg>;
}

export default function App() {
  const { isMobile } = useViewport();
  const [tab, setTab] = useState("explore");
  const [user, setUserState] = useState(emptyUser);
  const [loaded, setLoaded] = useState(false);
  const [drawer, setDrawer] = useState(null);
  const fileRef = useRef(null);
  const saveTimer = useRef(null);
  const leaveGuard = useRef(null); // Programs registers a fn returning true if OK to leave

  // wrap any navigation so an unsaved draft can intercept it
  const guardedNav = useCallback((fn) => {
    if (leaveGuard.current) {
      const ok = leaveGuard.current(fn); // guard may defer fn behind a discard prompt
      if (!ok) return;
    }
    fn();
  }, []);

  useEffect(() => {
    store.load().then((d) => { if (d) setUserState({ ...emptyUser, ...d }); setLoaded(true); });
  }, []);
  const setUser = useCallback((u) => {
    setUserState(u);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => store.save(u), 600);
  }, []);

  const toggleFav = (id) => setUser({ ...user, favorites: user.favorites.includes(id) ? user.favorites.filter((f) => f !== id) : [...user.favorites, id] });
  const setNote = (id, text) => setUser({ ...user, notes: { ...user.notes, [id]: text } });
  const openFrom = (list, id) => setDrawer({ list, index: list.indexOf(id) });

  const doExport = () => {
    const blob = new Blob([JSON.stringify(user, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "basi-study-backup.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const doImport = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const d = JSON.parse(r.result);
        if (d && typeof d === "object") setUser({ ...emptyUser, ...d });
      } catch { alert("That file couldn't be read as a backup."); }
    };
    r.readAsText(f);
    e.target.value = "";
  };

  const navItems = TABS.map(([k, label, d]) => {
    const on = tab === k;
    return (
      <button key={k} onClick={() => guardedNav(() => setTab(k))}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: isMobile ? "8px 16px" : "10px 6px", background: on && !isMobile ? C.redSoft : "none", border: "none", borderRadius: 10, cursor: "pointer", color: on ? C.redDeep : C.muted, width: isMobile ? "auto" : 64 }}>
        <NavIcon d={d} />
        <span style={{ fontSize: 10.5, fontWeight: 700, fontFamily: fonts }}>{label}</span>
      </button>
    );
  });

  return (
    <div style={{ fontFamily: fonts, color: C.ink, background: C.paper, height: "100vh", display: "flex", flexDirection: isMobile ? "column" : "row", overflow: "hidden" }}>
      <style>{`
        @keyframes slideIn { from { transform: translateX(40px); opacity: 0 } to { transform: none; opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(60px); opacity: 0 } to { transform: none; opacity: 1 } }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        .exCard:hover { background: #F7F5F5 !important; }
        .progRow:hover { background: ${C.redSoft}; }
        .menuDots:hover { background: ${C.line}; color: ${C.ink} !important; }
        .menuDots { min-width: 32px; min-height: 32px; align-items: center; justify-content: center; }
        .menuDots svg { width: 16px; height: 16px; }
        @media (max-width: 767px) {
          .menuDots { min-width: 40px; min-height: 40px; padding: 8px !important; }
          .menuDots svg { width: 20px; height: 20px; }
        }
        .saveInfo:hover .saveTip, .saveInfo:focus .saveTip { opacity: 1 !important; visibility: visible !important; }
        .wedge:hover path { fill: ${C.redDeep}; }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important } }
        ::-webkit-scrollbar { width: 12px; height: 12px }
        ::-webkit-scrollbar-thumb { background: #DDD4C8; border-radius: 99px; border: 3px solid transparent; background-clip: padding-box }
        ::-webkit-scrollbar-thumb:hover { background: #CFC4B6; background-clip: padding-box; border: 3px solid transparent }
        * { scrollbar-width: thin; scrollbar-color: #DDD4C8 transparent }
      `}</style>

      {!isMobile && (
        <nav style={{ width: 76, flexShrink: 0, borderRight: `1px solid ${C.line}`, background: C.card, display: "flex", flexDirection: "column", alignItems: "center", padding: "14px 6px", gap: 6 }}>
          {navItems}
          <div style={{ flex: 1 }} />
          <button onClick={doExport} title="Export my data" style={{ ...ghostBtn, padding: "5px 8px", fontSize: 11 }}>⤓</button>
          <button onClick={() => fileRef.current?.click()} title="Import a backup" style={{ ...ghostBtn, padding: "5px 8px", fontSize: 11 }}>⤒</button>
        </nav>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}>
        <header style={{ display: "flex", alignItems: "center", gap: 10, padding: isMobile ? "10px 14px" : "10px 22px", borderBottom: `1px solid ${C.line}`, background: C.card, flexShrink: 0 }}>
          <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: 0.3, color: C.ink }}>BASI Block System</span>
          <div style={{ flex: 1 }} />
          {isMobile && <>
            <button onClick={doExport} style={{ ...ghostBtn, padding: "6px 9px" }}>⤓</button>
            <button onClick={() => fileRef.current?.click()} style={{ ...ghostBtn, padding: "6px 9px" }}>⤒</button>
          </>}
          <span className="saveInfo" style={{ position: "relative", display: "inline-flex", alignItems: "center", color: C.muted, cursor: "help" }} tabIndex={0} aria-label="How your data is saved">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 11v5" strokeLinecap="round"/><circle cx="12" cy="7.5" r="0.6" fill="currentColor" stroke="none"/></svg>
            <span className="saveTip" style={{ position: "absolute", top: 28, right: 0, width: 230, background: C.ink, color: "#fff", fontSize: 11.5, lineHeight: 1.45, borderRadius: 8, padding: "9px 11px", boxShadow: "0 6px 24px rgba(0,0,0,.22)", zIndex: 60, opacity: 0, visibility: "hidden", transition: "opacity .15s", pointerEvents: "none", fontWeight: 400 }}>
              Your notes, favorites, and programs are saved in this browser on this device. They aren't synced or sent anywhere. Use the export button to back them up or move them to another device.
            </span>
          </span>
        </header>

        <main style={{ flex: 1, minHeight: 0, overflowY: isMobile ? "auto" : "hidden" }}>
          {tab === "explore" && <Explore user={user} toggleFav={toggleFav} openFrom={openFrom} isMobile={isMobile} />}
          {tab === "programs" && <Programs user={user} setUser={setUser} toggleFav={toggleFav} openFrom={openFrom} isMobile={isMobile} leaveGuard={leaveGuard} />}
          {tab === "practice" && <Practice isMobile={isMobile} openFrom={openFrom} />}
        </main>
      </div>

      {isMobile && (
        <nav style={{ position: "fixed", left: 0, right: 0, bottom: 0, background: C.card, borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "space-around", padding: "4px 0 8px", zIndex: 40 }}>
          {navItems}
        </nav>
      )}

      <Drawer ctx={drawer} setCtx={setDrawer} user={user} toggleFav={toggleFav} setNote={setNote} isMobile={isMobile} />
      <input ref={fileRef} type="file" accept="application/json" onChange={doImport} style={{ display: "none" }} />
    </div>
  );
}
