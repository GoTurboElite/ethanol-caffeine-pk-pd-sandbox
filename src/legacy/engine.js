var PKCore=(()=>{
const Vv = "0.3.0";
const X_ = "0.3.1";
const Ps = Object.freeze([{
  id: "zero",
  ordinal: 0,
  min: 0,
  max: 0,
  range: "Exactly 0.000",
  label: "Zero",
  interpretation: "No central blood ethanol",
  nonColourCue: "open circle",
  palette: {
    light: {
      accent: "#64748B",
      surface: "#F1F5F9"
    },
    dark: {
      accent: "#A8B5C5",
      surface: "#1E293B"
    }
  }
}, {
  id: "minimal",
  ordinal: 1,
  min: Number.MIN_VALUE,
  max: .02,
  range: ">0 to <0.020",
  label: "Minimal",
  interpretation: "Trace, very-low or subtle concentration without an established intoxication tier",
  nonColourCue: "single dot",
  palette: {
    light: {
      accent: "#0E7490",
      surface: "#ECFEFF"
    },
    dark: {
      accent: "#67E8F9",
      surface: "#083344"
    }
  }
}, {
  id: "low",
  ordinal: 2,
  min: .02,
  max: .08,
  range: "0.020 to <0.080",
  label: "Low",
  interpretation: "Early subjective, inhibitory, attentional or coordination change",
  nonColourCue: "double dot",
  palette: {
    light: {
      accent: "#A16207",
      surface: "#FEFCE8"
    },
    dark: {
      accent: "#FDE047",
      surface: "#422006"
    }
  }
}, {
  id: "medium",
  ordinal: 3,
  min: .08,
  max: .12,
  range: "0.080 to <0.120",
  label: "Medium",
  interpretation: "Established through pronounced cognitive-motor impairment",
  nonColourCue: "short bar",
  palette: {
    light: {
      accent: "#C2410C",
      surface: "#FFF7ED"
    },
    dark: {
      accent: "#FB923C",
      surface: "#431407"
    }
  }
}, {
  id: "high",
  ordinal: 4,
  min: .12,
  max: .18,
  range: "0.120 to <0.180",
  label: "High",
  interpretation: "Strong motor, judgment, balance and executive unreliability",
  nonColourCue: "double bar",
  palette: {
    light: {
      accent: "#C62828",
      surface: "#FEF2F2"
    },
    dark: {
      accent: "#FF6B5E",
      surface: "#4C0519"
    }
  }
}, {
  id: "very-high",
  ordinal: 5,
  min: .18,
  max: .25,
  range: "0.180 to <0.250",
  label: "Very high",
  interpretation: "Major balance disruption, sedative loading, memory disruption and gross coordination loss",
  nonColourCue: "triangle",
  palette: {
    light: {
      accent: "#B91C1C",
      surface: "#FFF1F2"
    },
    dark: {
      accent: "#FF3B4D",
      surface: "#500724"
    }
  }
}, {
  id: "severe",
  ordinal: 6,
  min: .25,
  max: .4,
  range: "0.250 to <0.400",
  label: "Severe",
  interpretation: "Orientation collapse, intermittent responsiveness, stupor or unconsciousness risk",
  nonColourCue: "diamond",
  palette: {
    light: {
      accent: "#9F1239",
      surface: "#FCE7F3"
    },
    dark: {
      accent: "#FB7185",
      surface: "#3B071A"
    }
  }
}, {
  id: "extreme",
  ordinal: 7,
  min: .4,
  max: Number.POSITIVE_INFINITY,
  range: "0.400 and above",
  label: "Extreme",
  interpretation: "Coma-range depression, respiratory compromise and loss of protective reflexes",
  nonColourCue: "filled diamond",
  palette: {
    light: {
      accent: "#A21CAF",
      surface: "#FDF4FF"
    },
    dark: {
      accent: "#E879F9",
      surface: "#3B0764"
    }
  }
}]);
const pj = Object.freeze(Object.fromEntries(Ps.map(e => [e.id, e])));
const jr = [];
let bZ = 0;
function ba(e, t, n, a, s, l, c, d, f, h = !1) {
  return {
    id: e,
    ordinal: bZ++,
    min: t,
    max: n,
    range: a,
    label: s,
    interpretation: l,
    performance: c,
    level: d,
    colourToken: `--bac-${e}`,
    sourceClass: f,
    exactZero: h
  };
}
jr.push(ba("zero", 0, 0, "Exactly 0", "No blood ethanol modeled", "No intoxication phenotype is assigned", "No concentration-linked performance effect is assigned", "minimal", "sentinel", !0), ba("trace", Number.MIN_VALUE, .001, ">0 to <0.001", "Trace ethanol concentration", "Analytically positive but below the ordinary displayed BAC increment; no intoxication band", "No overt functional phenotype is assigned from this trace alone", "minimal", "local interpretive extension"), ba("very-low", .001, .005, "0.001-0.004", "Very low ethanol concentration", "No overt phenotype should be assigned from BAC alone", "Concentration is present without a material BAC-linked performance statement", "minimal", "local interpretive extension"), ba("subtle", .005, .02, "0.005-0.019", "Subtle ethanol-effect range", "Subtle warmth, relaxation, or loosened restraint can emerge without a conspicuous outward phenotype", "Complex divided attention may begin to drift before outward signs are obvious", "minimal", "local interpretive extension"), ba("early", .02, .04, "0.020-0.039", "Early subjective and attention shift", "Warmth, easier social initiation, lowered inhibition, and early divided-attention drift", "Visual tracking and divided attention can begin to weaken", "mild", "NHTSA-anchored"), ba("emerging", .04, .05, "0.040-0.049", "Emerging judgment and inhibition change", "Disinhibition and judgment drift become more evident", "Response selection and divided attention become less dependable", "mild", "local interpretive extension"), ba("coordination", .05, .08, "0.050-0.079", "Coordination and response drift", "Tracking, fine control, response selection, alertness, and inhibition become less reliable", "Coordination, object tracking, and emergency-response reliability degrade", "moderate", "NHTSA-anchored"), ba("established", .08, .1, "0.080-0.099", "Established impairment", "Cognitive-motor impairment is established across reaction, tracking, judgment, and coordination", "Concentration, visual search, speed control, and signal detection are materially worse", "moderate", "NHTSA-anchored"), ba("pronounced", .1, .12, "0.100-0.119", "Pronounced cognitive-motor impairment", "Slowing, imprecise control, weaker memory encoding, and conspicuous judgment impairment", "Coordination, reaction timing, reasoning, and short-term memory are substantially degraded", "high", "NHTSA-anchored"), ba("high", .12, .15, "0.120-0.149", "High impairment", "Motor control and situational awareness are strongly degraded; slurring and emotional volatility become more common", "Reaction control and purposeful monitoring are strongly unreliable", "high", "local interpretive extension"), ba("major", .15, .16, "0.150-0.159", "Major global impairment", "Marked speech, balance, response, and reasoning disruption", "Purposeful cognitive-motor performance is broadly unreliable", "high", "NHTSA-anchored"), ba("very-high", .16, .2, "0.160-0.199", "Marked motor and balance impairment", "Major balance loss, confusion, vomiting tendency, and severely unreliable purposeful action", "Walking, speech timing, attention, and visual-motor integration are severely degraded", "very-high", "toxicological extension"), ba("heavy-sedation", .2, .25, "0.200-0.249", "Heavy sedation and gross coordination loss", "Heavy sedation, gross motor loss, memory disruption, and unstable responsiveness", "Basic balance, speech, attention, and memory are heavily compromised", "very-high", "toxicological extension"), ba("severe", .25, .3, "0.250-0.299", "Severe intoxication and orientation collapse", "Severe confusion, staggering or inability to stand, vomiting, and intermittent responsiveness", "Purposeful behaviour and protective responses are grossly unreliable", "severe", "toxicological extension"), ba("stupor-risk", .3, .4, "0.300-0.399", "Stupor and unconsciousness risk", "Stupor, unconsciousness, aspiration risk, and respiratory depression become central", "Orientation, posture, responsiveness, and protective behaviour are profoundly compromised", "severe", "toxicological extension"), ba("extreme-toxicity", .4, Number.POSITIVE_INFINITY, "0.400+", "Extreme toxicity", "Coma-range depression, respiratory compromise, and loss of protective reflexes", "Intentional behavioural control is absent or near-absent", "extreme", "toxicological extension"));
const mT = Object.freeze(Object.fromEntries(jr.map(e => [e.id, Object.freeze(e)])));
function jn(e) {
  return !Number.isFinite(e) || e <= 0 ? mT.zero : jr.find(t => !t.exactZero && e >= t.min && e < t.max) ?? mT["extreme-toxicity"];
}
function Qa(e) {
  return !Number.isFinite(e) || e <= 0 ? pj.zero : Ps.find(t => t.id !== "zero" && e >= t.min && e < t.max) ?? pj.extreme;
}
function hT(e, t = "g/dL", n = 3) {
  return e > 0 && e < .001 ? t === "g/dL" || t === "% BAC" ? `<0.001 ${t}` : t === "g/L" ? "<0.010 g/L" : "<0.010 permille" : `${(t === "g/L" || t === "permille" ? e * 10 : e).toFixed(t === "g/L" || t === "permille" ? Math.max(2, n - 1) : n)} ${t}`;
}
const Yl = ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"];
const Gv = ["narcissism", "machiavellianism", "psychopathy", "sadism"];
const $o = {
  openness: ["fantasy", "aesthetics", "feelings", "actions", "ideas", "values"],
  conscientiousness: ["competence", "order", "dutifulness", "achievementStriving", "selfDiscipline", "deliberation"],
  extraversion: ["warmth", "gregariousness", "assertiveness", "activity", "excitementSeeking", "positiveEmotions"],
  agreeableness: ["trust", "straightforwardness", "altruism", "compliance", "modesty", "tenderMindedness"],
  neuroticism: ["anxiety", "angryHostility", "depression", "selfConsciousness", "impulsiveness", "vulnerability"]
};
const zu = {
  narcissism: ["grandiosity", "entitlement", "exhibitionism", "exploitativeness", "vulnerability"],
  machiavellianism: ["cynicism", "strategicManipulation", "amorality", "longTermPlanning"],
  psychopathy: ["boldness", "meanness", "disinhibition", "impulsiveAntisociality"],
  sadism: ["directSadism", "vicariousSadism", "verbalSadism", "callousEnjoyment"]
};
function Xg() {
  return {
    openness: null,
    conscientiousness: null,
    extraversion: null,
    agreeableness: null,
    neuroticism: null
  };
}
function Vu() {
  return {
    narcissism: null,
    machiavellianism: null,
    psychopathy: null,
    sadism: null
  };
}
const yT = 10;
const bT = Object.freeze({
  "extraversion.excitement": {
    domain: "extraversion",
    facets: ["activity", "excitementSeeking", "assertiveness", "gregariousness"]
  },
  "extraversion.warmth": {
    domain: "extraversion",
    facets: ["warmth", "positiveEmotions"]
  },
  "conscientiousness.order": {
    domain: "conscientiousness",
    facets: ["order", "dutifulness"]
  },
  "conscientiousness.deliberation": {
    domain: "conscientiousness",
    facets: ["deliberation", "selfDiscipline", "competence"]
  },
  "neuroticism.anxiety": {
    domain: "neuroticism",
    facets: ["anxiety", "vulnerability", "selfConsciousness"]
  },
  "neuroticism.hostility": {
    domain: "neuroticism",
    facets: ["angryHostility", "impulsiveness"]
  },
  "agreeableness.trust": {
    domain: "agreeableness",
    facets: ["trust", "straightforwardness"]
  },
  "agreeableness.compliance": {
    domain: "agreeableness",
    facets: ["compliance", "altruism", "tenderMindedness"]
  },
  "narcissism.grandiosity": {
    domain: "narcissism",
    facets: ["grandiosity", "entitlement", "exhibitionism"]
  },
  "narcissism.vulnerability": {
    domain: "narcissism",
    facets: ["vulnerability"]
  },
  "psychopathy.boldness": {
    domain: "psychopathy",
    facets: ["boldness"]
  },
  "psychopathy.disinhibition": {
    domain: "psychopathy",
    facets: ["disinhibition", "impulsiveAntisociality", "meanness"]
  },
  "machiavellianism.antagonism": {
    domain: "machiavellianism",
    facets: ["cynicism", "strategicManipulation", "amorality"]
  },
  "machiavellianism.planning": {
    domain: "machiavellianism",
    facets: ["longTermPlanning"]
  }
});
const Ls = Object.freeze({
  socialScale: ["unknown", "alone", "small", "large"],
  socialFamiliarity: ["unknown", "familiar", "mixed", "unfamiliar"],
  environmentalStimulation: ["unknown", "low", "moderate", "high"],
  accountability: ["unknown", "none", "peer", "formal", "supervised"],
  conflictLoad: ["unknown", "low", "moderate", "high"],
  taskDemand: ["unknown", "low", "moderate", "high"],
  sessionIntent: ["unknown", "no-further-intake", "planned-limit", "open-ended", "heavy-session"],
  stoppingPlan: ["unknown", "none", "implicit", "explicit"],
  acuteStress: ["unknown", "low", "moderate", "high"],
  substanceFamiliarity: ["unknown", "low", "moderate", "high"]
});
function OZ() {
  return {
    socialScale: "unknown",
    socialFamiliarity: "unknown",
    environmentalStimulation: "unknown",
    accountability: "unknown",
    conflictLoad: "unknown",
    taskDemand: "unknown",
    sessionIntent: "unknown",
    stoppingPlan: "unknown",
    acuteStress: "unknown",
    substanceFamiliarity: "unknown"
  };
}
function hn() {
  return {
    applied: !1,
    initialSection: "situation",
    traits: {
      sourceBasis: "unknown",
      instrumentName: "",
      scoreConvention: "percentile (0-100)",
      bigFive: Xg(),
      bigFiveFacets: {},
      advancedTraits: Vu(),
      advancedTraitFacets: {}
    },
    context: OZ(),
    narrativeMetadata: {
      mbtiType: null,
      mbtiVariant: null
    }
  };
}
function Mn(e) {
  return JSON.parse(JSON.stringify(e));
}
function xa(e) {
  return typeof e == "number" && Number.isFinite(e) && e >= 0 && e <= 100;
}
function aB(e) {
  return typeof e == "number" && Number.isFinite(e) ? Math.max(0, Math.min(100, e)) : null;
}
function vj(e) {
  return e.length ? e.reduce((t, n) => t + n, 0) / e.length : null;
}
function Bm(e) {
  return Object.fromEntries(Yl.map(t => {
    const n = $o[t],
      a = e.traits.bigFiveFacets[t],
      s = n.map(p => a?.[p]).filter(xa),
      l = xa(e.traits.bigFive[t]) ? e.traits.bigFive[t] : null,
      c = vj(s),
      d = s.length / n.length,
      f = l ?? 50,
      h = l === null && c === null ? null : Math.max(0, Math.min(100, f + d * ((c ?? f) - f)));
    return [t, {
      id: t,
      value: h,
      parentValue: l,
      facetMean: c,
      facetCoverage: d,
      suppliedFacetCount: s.length,
      registeredFacetCount: n.length
    }];
  }));
}
function xT(e) {
  return Object.values(e).reduce((t, n) => t + Object.values(n ?? {}).filter(xa).length, 0);
}
function Xl(e) {
  const t = Object.values(e.context).filter(f => f !== "unknown").length,
    n = Object.values(e.traits.bigFive).filter(xa).length,
    a = xT(e.traits.bigFiveFacets),
    s = Object.values($o).reduce((f, h) => f + h.length, 0),
    l = Object.values(e.traits.advancedTraits).filter(xa).length + xT(e.traits.advancedTraitFacets);
  let c = "none";
  l > 0 ? c = "advanced-trait-informed" : a === s ? c = "facet-complete" : a > 0 ? c = "facet-partial" : n === Yl.length ? c = "domain-complete" : n > 0 ? c = "domain-partial" : t > 0 && (c = "context-only");
  const d = [`${t}/${Object.keys(Ls).length} situation fields`];
  return (n || a || l) && d.push(`${n}/5 domains`, `${a}/${s} facets`), l && d.push(`${l} advanced inputs`), {
    code: c,
    contextCount: t,
    contextTotal: Object.keys(Ls).length,
    domainCount: n,
    domainTotal: 5,
    facetCount: a,
    facetTotal: s,
    advancedCount: l,
    label: d.join(" - ")
  };
}
function IZ(e) {
  if (e.length < 2) return 0;
  const t = e.reduce((n, a) => n + a, 0) / e.length;
  return Math.sqrt(e.reduce((n, a) => n + (a - t) ** 2, 0) / e.length);
}
function DZ(e) {
  return e.code === "none" ? "none" : e.code === "context-only" || e.code === "domain-partial" ? "limited" : e.code === "facet-complete" || e.code === "advanced-trait-informed" && e.advancedCount >= 3 ? "strong" : "moderate";
}
function iB(e) {
  const t = Xl(e),
    n = Bm(e),
    a = [],
    s = [];
  for (const g of Yl) {
    const C = e.traits.bigFive[g];
    xa(C) && a.push("traits.bigFive." + g);
    const S = e.traits.bigFiveFacets[g],
      k = $o[g].map(E => {
        const O = S?.[E];
        return xa(O) && a.push("traits.bigFiveFacets." + g + "." + E), O;
      }).filter(xa);
    s.push({
      domain: g,
      parent: C,
      values: k,
      total: $o[g].length
    });
  }
  for (const g of Gv) {
    const C = e.traits.advancedTraits[g];
    xa(C) && a.push("traits.advancedTraits." + g);
    const S = e.traits.advancedTraitFacets[g],
      k = zu[g].map(E => {
        const O = S?.[E];
        return xa(O) && a.push("traits.advancedTraitFacets." + g + "." + E), O;
      }).filter(xa);
    s.push({
      domain: g,
      parent: C,
      values: k,
      total: zu[g].length
    });
  }
  for (const [g, C] of Object.entries(e.context)) C !== "unknown" && a.push("context." + g);
  e.narrativeMetadata.mbtiType && a.push("narrativeMetadata.mbtiType");
  const l = Object.fromEntries(s.map(g => [g.domain, {
      supplied: g.values.length,
      total: g.total,
      ratio: g.total ? g.values.length / g.total : 0
    }])),
    c = s.reduce((g, C) => g + C.total, 0),
    d = s.reduce((g, C) => g + C.values.length, 0),
    f = s.filter(g => g.values.length >= 2).map(g => ({
      domain: g.domain,
      suppliedFacetCount: g.values.length,
      standardDeviation: IZ(g.values)
    })),
    h = s.filter(g => xa(g.parent) && g.values.length > 0).map(g => {
      const C = vj(g.values);
      return {
        domain: g.domain,
        parentValue: g.parent,
        facetMean: C,
        difference: C - g.parent,
        direction: C >= g.parent ? "facets-higher" : "facets-lower"
      };
    }).filter(g => Math.abs(g.difference) >= yT),
    p = g => {
      const C = bT[g],
        S = Yl.includes(C.domain),
        k = S ? e.traits.bigFive[C.domain] : e.traits.advancedTraits[C.domain],
        O = S ? e.traits.bigFiveFacets[C.domain] : e.traits.advancedTraitFacets[C.domain],
        A = [];
      for (const D of C.facets) {
        const V = O?.[D];
        xa(V) && A.push({
          facet: D,
          value: V
        });
      }
      const N = A.length ? vj(A.map(D => D.value)) : xa(k) ? k : null,
        T = e.applied && N !== null && Math.abs(N - 50) >= yT;
      return {
        id: g,
        domain: C.domain,
        value: e.applied ? N : null,
        source: A.length ? "supplied-facet" : xa(k) ? "parent-prior" : "unknown",
        suppliedFields: A.length ? A.map(D => (S ? "traits.bigFiveFacets" : "traits.advancedTraitFacets") + "." + C.domain + "." + D.facet) : xa(k) ? [(S ? "traits.bigFive" : "traits.advancedTraits") + "." + C.domain] : [],
        material: T,
        direction: !T || N === null ? "neutral" : N > 50 ? "increase" : "decrease"
      };
    },
    v = Object.fromEntries(Object.keys(bT).map(g => [g, p(g)])),
    b = Object.values(v).filter(g => g.source === "supplied-facet" && g.value !== null).map(g => ({
      id: g.id,
      value: g.value,
      sourceFields: g.suppliedFields,
      evidenceStrength: g.suppliedFields.length > 1 ? "strong" : "moderate"
    })),
    x = Object.values(v).filter(g => g.material && g.direction === "increase").map(g => g.id),
    w = Object.values(v).filter(g => g.material && g.direction === "decrease").map(g => g.id);
  return e.applied && (["peer", "formal", "supervised"].includes(e.context.accountability) && w.push("context.accountability"), e.context.stoppingPlan === "explicit" && w.push("context.stopping-plan"), (e.context.sessionIntent === "open-ended" || e.context.sessionIntent === "heavy-session") && x.push("context.continuation-intent"), e.context.acuteStress === "high" && x.push("context.acute-stress")), {
    coverage: t,
    suppliedFields: a,
    inferredComposites: b,
    effectiveDomains: Object.fromEntries(Object.entries(n).map(([g, C]) => [g, {
      value: e.applied ? C.value : null,
      parentValue: C.parentValue,
      facetMean: C.facetMean,
      evidenceStrength: C.suppliedFacetCount >= 3 ? "strong" : C.value !== null ? "moderate" : "none"
    }])),
    facetCoverage: {
      supplied: d,
      total: c,
      ratio: c ? d / c : 0,
      byDomain: l
    },
    withinDomainDispersion: f,
    parentFacetDiscordance: h,
    pathways: v,
    activePathways: [...new Set(x)],
    countervailingPathways: [...new Set(w)],
    evidenceStrength: e.applied ? DZ(t) : "none"
  };
}
function Kv(e) {
  return Array.isArray(e) ? e.map(Kv) : e && typeof e == "object" ? Object.fromEntries(Object.entries(e).filter(([, t]) => t !== void 0).sort(([t], [n]) => t.localeCompare(n)).map(([t, n]) => [t, Kv(n)])) : e;
}
function um(e) {
  return e.applied ? JSON.stringify(Kv({
    applied: !0,
    bigFive: e.traits.bigFive,
    bigFiveFacets: e.traits.bigFiveFacets,
    advancedTraits: e.traits.advancedTraits,
    advancedTraitFacets: e.traits.advancedTraitFacets,
    context: e.context
  })) : JSON.stringify({
    applied: !1
  });
}
function jT(e, t, n) {
  const a = e && typeof e == "object" ? e : {},
    s = n;
  return Object.fromEntries(t.map(l => [l, aB(a[l] ?? s[l])]));
}
function MT(e, t) {
  const n = e && typeof e == "object" ? e : {};
  return Object.fromEntries(Object.entries(t).map(([a, s]) => {
    const l = n[a] && typeof n[a] == "object" ? n[a] : {};
    return [a, Object.fromEntries(s.map(c => [c, aB(l[c])]))];
  }));
}
function Lm(e) {
  if (!e) return hn();
  const t = hn();
  t.applied = !!e.enabled, t.initialSection = e.inputMode === "advanced" ? "stable-traits" : "situation", t.traits.sourceBasis = "imported-profile", t.traits.instrumentName = e.instrumentName ?? "", t.traits.bigFive = jT(e.bigFive, Yl, Xg()), t.traits.bigFiveFacets = MT(e.bigFiveFacets, $o), t.traits.advancedTraits = jT(e.darkTetrad, Gv, Vu()), t.traits.advancedTraitFacets = MT(e.darkTetradFacets, zu), t.narrativeMetadata = {
    mbtiType: e.mbti?.type ?? null,
    mbtiVariant: e.mbti?.variant ?? null
  };
  const n = {
      unknown: {},
      alone: {
        socialScale: "alone"
      },
      "small-known-group": {
        socialScale: "small",
        socialFamiliarity: "familiar"
      },
      "large-social": {
        socialScale: "large"
      },
      "club-nightlife": {
        socialScale: "large",
        environmentalStimulation: "high"
      },
      "conflict-prone": {
        conflictLoad: "high"
      },
      "work-formal": {
        accountability: "formal",
        taskDemand: "high"
      },
      supervised: {
        accountability: "supervised"
      }
    },
    a = {
      unknown: {},
      abstinent: {
        sessionIntent: "no-further-intake"
      },
      moderate: {
        sessionIntent: "planned-limit"
      },
      "heavy-session": {
        sessionIntent: "heavy-session"
      },
      "binge-like": {
        sessionIntent: "heavy-session"
      },
      "performance-social": {
        taskDemand: "high"
      }
    };
  return t.context = {
    ...t.context,
    ...n[e.context.socialContext],
    ...a[e.context.intent],
    acuteStress: e.context.acuteStress,
    substanceFamiliarity: e.context.priorToleranceSelfReport
  }, t.migrationProvenance = {
    source: "temperamentProfile",
    legacyInputConfidence: e.inputConfidence,
    legacySocialContext: e.context.socialContext,
    legacyIntent: e.context.intent,
    legacyRecentSleepQuality: e.context.recentSleepQuality,
    legacyPriorToleranceSelfReport: e.context.priorToleranceSelfReport
  }, t;
}
const Ts = "0.6.0";
const $m = "0.6.0";
const Ro = "0.6.0";
const Rm = "0.6.0";
const _Z = [{
  id: "functional-low",
  min: 0,
  label: "low functional concern"
}, {
  id: "functional-emerging",
  min: 15,
  label: "emerging functional concern"
}, {
  id: "functional-material",
  min: 35,
  label: "material functional concern"
}, {
  id: "functional-high",
  min: 60,
  label: "high functional concern"
}, {
  id: "functional-severe",
  min: 82,
  label: "severe functional concern"
}];
const BZ = [{
  id: "activation-quiet",
  min: 0,
  label: "quiet activation"
}, {
  id: "activation-noticeable",
  min: 20,
  label: "noticeable activation"
}, {
  id: "activation-prominent",
  min: 45,
  label: "prominent activation"
}, {
  id: "activation-intense",
  min: 70,
  label: "intense activation"
}];
const LZ = [{
  id: "calibration-aligned",
  min: 0,
  label: "closely calibrated"
}, {
  id: "calibration-diverging",
  min: 20,
  label: "calibration diverging"
}, {
  id: "calibration-wide",
  min: 45,
  label: "wide confidence-performance gap"
}, {
  id: "calibration-pronounced",
  min: 70,
  label: "pronounced confidence-performance gap"
}];
const $Z = [{
  id: "protective-low",
  min: 0,
  label: "limited protective strength"
}, {
  id: "protective-present",
  min: 25,
  label: "present protective strength"
}, {
  id: "protective-strong",
  min: 55,
  label: "strong protective strength"
}, {
  id: "protective-very-strong",
  min: 80,
  label: "very strong protective strength"
}];
const RZ = [{
  id: "magnitude-low",
  min: 0,
  label: "low magnitude"
}, {
  id: "magnitude-noticeable",
  min: 25,
  label: "noticeable magnitude"
}, {
  id: "magnitude-prominent",
  min: 55,
  label: "prominent magnitude"
}, {
  id: "magnitude-high",
  min: 80,
  label: "high magnitude"
}];
function Wn(e, t, n, a, s, l, c, d) {
  const f = a === "functional-concern" ? "functional-concern" : a === "activation-intensity" ? "activation-intensity" : a === "calibration-mismatch" ? "calibration-mismatch" : a === "protective-strength" ? "protective-strength" : "neutral-magnitude";
  return Object.freeze({
    id: e,
    label: t,
    group: n,
    polarity: a,
    vocabularyId: f,
    units: "/100",
    meaning: s,
    baseDriverIds: l,
    permittedModifierIds: c,
    applicability: d,
    floor: 0,
    ceiling: 100,
    thresholds: f === "functional-concern" ? _Z : f === "activation-intensity" ? BZ : f === "calibration-mismatch" ? LZ : f === "protective-strength" ? $Z : RZ,
    traitCap: 16,
    contextCap: 12,
    narrativeKey: e,
    displayPrecision: 1,
    provenanceIds: [`behaviour.axis.${e}`, "behaviour.engineering-heuristic-v0.6.0"]
  });
}
const vt = Object.freeze(Object.fromEntries([Wn("inhibitoryControlLoss", "Inhibitory-control loss", "functional-reliability", "functional-concern", "Reduced response suppression and stopping reliability.", ["pd.ethanol-impairment", "pd.ethanol-stimulation"], [], "Ethanol-linked functional state"), Wn("judgmentRiskDrift", "Judgment and risk drift", "functional-reliability", "functional-concern", "Reduced decision calibration and risk discrimination.", ["pd.ethanol-impairment", "pk.bac-band"], [], "Ethanol-linked functional state"), Wn("dividedAttentionLoad", "Divided-attention load", "functional-reliability", "functional-concern", "Difficulty distributing attention across simultaneous demands.", ["pd.ethanol-impairment", "pd.mismatch"], [], "Ethanol-linked functional state"), Wn("motorReactionUnreliability", "Motor and reaction unreliability", "functional-reliability", "functional-concern", "Coordination, tracking, balance, and reaction instability.", ["pd.ethanol-impairment", "pd.ethanol-sedation", "pk.bac-band"], [], "Ethanol-linked functional state"), Wn("memoryEncodingFragility", "Memory-encoding fragility", "functional-reliability", "functional-concern", "Reduced reliability of encoding and short-term retention.", ["pd.ethanol-impairment", "pd.ethanol-sedation"], [], "Ethanol-linked functional state"), Wn("wakefulActivation", "Wakeful activation", "activation", "activation-intensity", "Caffeine-linked or rising-limb activation without implying competence.", ["pd.caffeine-alertness", "pd.ethanol-stimulation"], ["context.environmental-stimulation"], "Caffeine or rising-limb activation"), Wn("sedativeFatigueLoad", "Sedation and fatigue load", "activation", "activation-intensity", "Drowsiness, psychomotor heaviness, and descending-limb fatigue.", ["pd.ethanol-sedation", "pd.ethanol-impairment"], ["subject.sleep-debt"], "Ethanol-linked or sleep-amplified fatigue"), Wn("anxiousActivation", "Anxious activation", "activation", "activation-intensity", "Alertness accompanied by stress-sensitive tension or agitation.", ["pd.caffeine-alertness", "pd.combined-alertness"], ["trait.neuroticism", "context.acute-stress", "subject.sleep-debt"], "Activation with registered stress-sensitive inputs"), Wn("taskPersistenceDrive", "Task-persistence drive", "activation", "activation-intensity", "Drive to continue an activity, kept explicitly separate from accuracy or competence.", ["pd.caffeine-alertness", "pd.ethanol-stimulation"], ["trait.extraversion", "trait.conscientiousness", "context.task-demand"], "Active stimulant or rising-limb persistence"), Wn("perceivedControl", "Perceived control", "self-calibration", "protective-strength", "Modeled subjective sense of control.", ["pd.perceived-control"], ["trait.conscientiousness", "context.substance-familiarity"], "Active drug-linked self-appraisal"), Wn("confidencePerformanceMismatch", "Confidence-performance mismatch", "self-calibration", "calibration-mismatch", "Separation between subjective activation or control and functional reliability.", ["pd.mismatch", "pd.perceived-control", "pd.ethanol-impairment"], ["trait.advanced-narcissism", "context.substance-familiarity"], "Combined subjective and functional state"), Wn("selfMonitoringDegradation", "Self-monitoring degradation", "self-calibration", "functional-concern", "Reduced recognition or correction of a changing state.", ["pd.ethanol-impairment", "pd.mismatch", "pd.ethanol-sedation"], ["trait.conscientiousness", "context.social-familiarity"], "Drug-linked regulation state"), Wn("stoppingRuleResistance", "Stopping-rule resistance", "self-calibration", "functional-concern", "Reduced salience or adherence to a stated stopping plan.", ["pd.ethanol-impairment", "pd.ethanol-stimulation", "pd.mismatch"], ["trait.conscientiousness", "context.accountability", "context.stopping-plan", "context.session-intent"], "Drug-linked continuation state"), Wn("continuationPressure", "Continuation pressure", "self-calibration", "functional-concern", "Pressure to keep drinking, socialising, or working despite a changing functional state.", ["pd.ethanol-stimulation", "pd.mismatch"], ["trait.extraversion", "trait.conscientiousness", "context.accountability", "context.stopping-plan", "context.session-intent"], "Active continuation state"), Wn("protectiveRegulatoryStrength", "Protective regulatory strength", "self-calibration", "protective-strength", "Available planning, accountability, and deliberative restraint that can constrain expression or continuation.", [], ["trait.conscientiousness", "trait.agreeableness", "context.accountability", "context.stopping-plan", "context.session-intent"], "Applied protective context during an active state"), Wn("socialExpressivity", "Social expressivity", "expression", "neutral-magnitude", "Outward engagement, talkativeness, or social activation.", ["pd.ethanol-stimulation", "pd.caffeine-alertness"], ["trait.extraversion", "context.social-scale", "context.social-familiarity", "context.environmental-stimulation"], "Baseline disposition and activated expression"), Wn("affectiveVolatility", "Affective volatility", "expression", "neutral-magnitude", "Lability or reactivity of affective expression.", ["pd.ethanol-impairment", "pd.caffeine-alertness"], ["trait.neuroticism", "context.acute-stress"], "Baseline disposition and stress-sensitive expression"), Wn("conflictReactivity", "Conflict reactivity", "expression", "neutral-magnitude", "Degree to which conflict cues shape expression, without predicting aggression.", ["pd.ethanol-impairment"], ["trait.agreeableness", "trait.advanced-antagonistic-expression", "context.conflict-load"], "Conflict-sensitive expression only")].map(e => [e.id, e])));
const jt = Object.freeze(Object.keys(vt));
function HZ(e, t) {
  const n = vt[e],
    a = t === "base-pd" ? "base." + e : t + "." + e,
    s = t === "base-pd" ? n.ceiling : t === "trait" ? n.traitCap : t === "context" ? n.contextCap : 22;
  return Object.freeze({
    id: a,
    sourceId: t === "base-pd" ? n.baseDriverIds.join("+") || "profile-independent-baseline" : t === "trait" ? "profile.resolved-trait-pathways" : t === "context" ? "profile.supplied-context" : "behaviour.registered-interaction",
    axisId: e,
    layer: t,
    direction: t === "base-pd" ? "increase" : "bidirectional",
    neutralPoint: 0,
    maximumMagnitude: s,
    applicability: n.applicability,
    rationale: t === "base-pd" ? n.meaning : "Bounded " + t + " contribution to " + n.label.toLowerCase() + ".",
    version: Rm
  });
}
const FZ = Object.freeze(Object.fromEntries(jt.flatMap(e => ["base-pd", "subject", "trait", "context", "interaction"].map(t => {
  const n = HZ(e, t);
  return [n.id, n];
}))));
const Uv = Object.freeze({
  baseline: {
    label: "Baseline",
    precedence: 0
  },
  "wakefully-activated": {
    label: "Wakefully activated",
    precedence: 2
  },
  "rising-limb-activated": {
    label: "Rising-limb activated",
    precedence: 3
  },
  "functionally-impaired": {
    label: "Functionally impaired",
    precedence: 6
  },
  "sedating-and-impaired": {
    label: "Sedating and impaired",
    precedence: 7
  },
  "alert-but-impaired": {
    label: "Alert but impaired",
    precedence: 8
  },
  "anxiously-activated": {
    label: "Anxiously activated",
    precedence: 4
  },
  "socially-activated": {
    label: "Socially activated",
    precedence: 1
  },
  "sequential-transition": {
    label: "Sequential transition",
    precedence: 5
  },
  "washout-residual": {
    label: "Washout / residual",
    precedence: 1
  },
  "severe-depressant-state": {
    label: "Severe depressant state",
    precedence: 10
  }
});
const cr = 16;
const _i = 12;
const Vx = 22;
const zZ = .1;
const Qc = 8;
const Ya = ["inhibitoryControlLoss", "judgmentRiskDrift", "dividedAttentionLoad", "motorReactionUnreliability", "memoryEncodingFragility"];
const Zg = ["wakefulActivation", "sedativeFatigueLoad", "anxiousActivation", "taskPersistenceDrive"];
const yM = ["perceivedControl", "confidencePerformanceMismatch", "selfMonitoringDegradation", "stoppingRuleResistance", "continuationPressure", "protectiveRegulatoryStrength"];
const bM = ["socialExpressivity", "affectiveVolatility", "conflictReactivity"];
function So(e) {
  return Math.max(0, Math.min(100, Number.isFinite(e) ? e : 0));
}
function $t(e, t) {
  return Math.max(-t, Math.min(t, Number.isFinite(e) ? e : 0));
}
function VZ(e) {
  return typeof e == "number" && Number.isFinite(e) ? (e - 50) / 50 : 0;
}
function Gx(e) {
  return e === "low" ? -.25 : e === "moderate" ? .45 : e === "high" ? 1 : 0;
}
function Ms(e, t) {
  return Math.max(0, ...t.map(n => e[n]));
}
function GZ() {
  return Object.fromEntries(jt.map(e => [e, 0]));
}
function KZ(e) {
  const t = Xl(e);
  return !e.applied || t.code === "none" ? {
    code: "pk-pd-only",
    label: "PK/PD only",
    activeLayers: ["pk-pd"],
    coverage: t
  } : t.advancedCount > 0 ? {
    code: "advanced-trait-informed",
    label: "Advanced trait-informed",
    activeLayers: ["pk-pd", "context", "traits", "facets", "advanced-traits"],
    coverage: t
  } : t.facetCount > 0 ? {
    code: "facet-informed",
    label: "Facet-informed",
    activeLayers: ["pk-pd", "context", "traits", "facets"],
    coverage: t
  } : t.domainCount > 0 ? {
    code: "trait-informed",
    label: "Trait-informed",
    activeLayers: ["pk-pd", "context", "traits"],
    coverage: t
  } : {
    code: "context-informed",
    label: "Context-informed",
    activeLayers: ["pk-pd", "context"],
    coverage: t
  };
}
function UZ(e, t) {
  const n = e.ethanolImpairmentIndex > .01 || e.bacGdL > .002,
    a = e.caffeineAlertnessIndex > .01 || e.caffeineMgL > .05;
  return !n && !a ? t.exposure.kind === "historical-trace" ? "historical-residue" : "baseline" : n && a ? "combined-overlap" : n ? Math.abs(e.tH - t.summary.timeOfPeakBACH) <= .25 ? "ethanol-peak" : e.bacRateGdLPerH > 5e-4 ? "ethanol-rising" : "ethanol-falling" : "caffeine-active";
}
function qZ(e) {
  const t = iB(e);
  if (!e.applied) return {
    trait: {},
    context: {},
    driverIds: [],
    resolution: t
  };
  const n = k => {
      const E = t.pathways[k];
      return E?.material ? VZ(E.value) : 0;
    },
    a = {
      anxiousActivation: $t(8 * n("neuroticism.anxiety") + 4 * n("neuroticism.hostility"), cr),
      taskPersistenceDrive: $t(6 * n("extraversion.excitement") + 4 * n("conscientiousness.deliberation"), cr),
      perceivedControl: $t(5 * n("conscientiousness.deliberation") + 5 * n("narcissism.grandiosity"), cr),
      confidencePerformanceMismatch: $t(7 * n("narcissism.grandiosity") + 5 * n("psychopathy.disinhibition") + 2 * n("psychopathy.boldness"), cr),
      selfMonitoringDegradation: $t(-7 * n("conscientiousness.deliberation") - 3 * n("agreeableness.compliance") + 4 * n("psychopathy.disinhibition"), cr),
      stoppingRuleResistance: $t(-7 * n("conscientiousness.deliberation") - 4 * n("conscientiousness.order") + 5 * n("psychopathy.disinhibition"), cr),
      continuationPressure: $t(8 * n("extraversion.excitement") - 6 * n("conscientiousness.deliberation") - 3 * n("conscientiousness.order") + 4 * n("psychopathy.disinhibition"), cr),
      protectiveRegulatoryStrength: $t(8 * n("conscientiousness.deliberation") + 5 * n("conscientiousness.order") + 3 * n("agreeableness.compliance"), cr),
      socialExpressivity: $t(10 * n("extraversion.excitement") + 5 * n("extraversion.warmth"), cr),
      affectiveVolatility: $t(8 * n("neuroticism.anxiety") + 6 * n("neuroticism.hostility") + 3 * n("narcissism.vulnerability"), cr),
      conflictReactivity: $t(7 * n("neuroticism.hostility") - 5 * n("agreeableness.compliance") + 4 * n("psychopathy.disinhibition"), cr)
    },
    s = e.context,
    l = s.socialScale === "alone" ? -5 : s.socialScale === "small" ? 3 : s.socialScale === "large" ? 7 : 0,
    c = s.socialFamiliarity === "familiar" ? -2 : s.socialFamiliarity === "mixed" ? 2 : s.socialFamiliarity === "unfamiliar" ? 5 : 0,
    d = Gx(s.environmentalStimulation) * 7,
    f = Gx(s.acuteStress),
    h = Gx(s.conflictLoad),
    p = s.accountability === "none" ? 3 : s.accountability === "peer" ? -2 : s.accountability === "formal" ? -6 : s.accountability === "supervised" ? -9 : 0,
    v = s.stoppingPlan === "none" ? 5 : s.stoppingPlan === "implicit" ? -3 : s.stoppingPlan === "explicit" ? -9 : 0,
    b = s.sessionIntent === "heavy-session" ? 7 : s.sessionIntent === "open-ended" ? 4 : s.sessionIntent === "planned-limit" ? -5 : s.sessionIntent === "no-further-intake" ? -8 : 0,
    x = s.substanceFamiliarity === "high" ? 5 : s.substanceFamiliarity === "moderate" ? 3 : s.substanceFamiliarity === "low" ? -1 : 0,
    w = s.taskDemand === "high" ? 8 : s.taskDemand === "moderate" ? 4 : s.taskDemand === "low" ? -2 : 0,
    g = Math.max(0, -p) + Math.max(0, -v) + (s.sessionIntent === "no-further-intake" ? 8 : s.sessionIntent === "planned-limit" ? 5 : 0),
    C = {
      wakefulActivation: $t(d, _i),
      anxiousActivation: $t(f * 10, _i),
      taskPersistenceDrive: $t(w, _i),
      perceivedControl: $t(x, _i),
      confidencePerformanceMismatch: $t(Math.max(0, x), _i),
      selfMonitoringDegradation: $t(c + p * .4, _i),
      stoppingRuleResistance: $t(p + v + b, _i),
      continuationPressure: $t(p + v + b, _i),
      protectiveRegulatoryStrength: $t(g, _i),
      socialExpressivity: $t(l + d - c * .2, _i),
      affectiveVolatility: $t(f * 8, _i),
      conflictReactivity: $t(h * 9 + f * 3, _i)
    },
    S = [...t.activePathways.map(k => "trait." + k), ...t.countervailingPathways.filter(k => !k.startsWith("context.")).map(k => "trait." + k), ...Object.entries(s).filter(([, k]) => k !== "unknown").map(([k]) => `context.${k}`)];
  return {
    trait: a,
    context: C,
    driverIds: S,
    resolution: t
  };
}
function xp(e, t, n) {
  if (!Number.isFinite(n) || Math.abs(n) < 1e-9) return [];
  const a = FZ[t + "." + e];
  return [{
    coefficientId: a.id,
    sourceId: a.sourceId,
    label: a.rationale,
    layer: t,
    direction: n >= 0 ? "increase" : "decrease",
    magnitude: n,
    applicability: a.applicability,
    cap: a.maximumMagnitude,
    provenanceIds: [a.id, "behaviour.coefficients." + Rm]
  }];
}
function WZ(e, compact = false) {
  const t = vt[e.axisId],
    n = $t(e.subject ?? 0, Vx),
    a = $t(e.trait ?? 0, t.traitCap),
    s = $t(e.context ?? 0, t.contextCap),
    c = $t(a + s, Vx) - a - s,
    d = $t((e.interaction ?? 0) + c, Vx),
    f = Math.max(t.floor, e.pharmacodynamicFloor ?? t.floor),
    h = Math.max(f, So(e.basePD + n + a + s + d)),
    p = compact ? [] : xp(e.axisId, "subject", n),
    v = compact ? [] : xp(e.axisId, "trait", a),
    b = compact ? [] : xp(e.axisId, "context", s),
    x = compact ? [] : xp(e.axisId, "interaction", d),
    w = [...p, ...v, ...b, ...x];
  if (compact) return h;
  return {
    axisId: e.axisId,
    basePD: So(e.basePD),
    subjectContributions: p,
    traitContributions: v,
    contextContributions: b,
    interactionContributions: x,
    pharmacodynamicFloor: f,
    lowerBound: t.floor,
    upperBound: t.ceiling,
    finalValue: h,
    materialDrivers: [...new Set([...(Math.abs(e.basePD) >= .5 ? t.baseDriverIds : []), ...w.filter(g => g.magnitude >= .5).map(g => g.coefficientId)])],
    countervailingDrivers: [...new Set(w.filter(g => g.magnitude <= -.5).map(g => g.coefficientId))]
  };
}
function YZ(e) {
  return e.coverage.code === "none" ? "none" : e.coverage.code === "context-only" || e.coverage.code === "domain-partial" ? "limited" : e.coverage.code === "facet-complete" || e.coverage.code === "advanced-trait-informed" && e.coverage.advancedCount >= 3 ? "strong" : "moderate";
}
function rB(e) {
  const t = e.axisValues,
    n = Ms(t, Ya),
    a = e.stateSignatureId === "severe-depressant-state",
    s = Math.max(t.wakefulActivation, t.taskPersistenceDrive),
    l = jt.slice().sort((w, g) => t[g] - t[w]).flatMap(w => e.axisDecomposition[w]?.materialDrivers ?? []).filter((w, g, C) => C.indexOf(w) === g).slice(0, 6),
    c = jt.flatMap(w => e.axisDecomposition[w]?.countervailingDrivers ?? []).filter((w, g, C) => C.indexOf(w) === g),
    d = a ? "severe global functional constraint" : n >= 60 ? "markedly unreliable coordination, judgment, attention, and self-correction" : n >= 35 ? "material reduction in functional reliability" : n >= 15 ? "emerging loss of consistency under demand" : "no material concentration-linked functional constraint",
    f = a ? "sedative dominance" : t.sedativeFatigueLoad >= s + 10 ? "fatigue-led" : t.anxiousActivation >= s - 5 && t.anxiousActivation >= 25 ? "tense activation" : s >= 25 ? "wakeful persistence" : "low activation",
    h = a ? "pharmacodynamic overrun" : t.protectiveRegulatoryStrength >= Math.max(t.continuationPressure, t.stoppingRuleResistance) + 8 ? "protectively constrained" : t.continuationPressure >= 30 || t.stoppingRuleResistance >= 30 ? "continuation-biased" : t.selfMonitoringDegradation >= 25 ? "self-correction weakened" : "comparatively regulated",
    p = a ? "self-appraisal no longer behaviorally reliable" : t.confidencePerformanceMismatch >= 45 ? "confidence materially exceeds reliability" : t.confidencePerformanceMismatch >= 20 ? "confidence and reliability diverging" : t.perceivedControl >= 35 ? "subjective control remains salient" : "closely calibrated",
    v = a ? "lighter interpersonal expression is superseded" : t.conflictReactivity >= 45 ? "conflict-sensitive and reactive" : t.socialExpressivity >= 45 ? "socially expansive" : t.socialExpressivity >= 25 ? "more outwardly engaged" : "low outward shift",
    b = a ? "depressant-state dominance" : t.anxiousActivation >= 35 ? "tense or restless" : t.affectiveVolatility >= 35 ? "emotionally labile" : t.sedativeFatigueLoad >= 35 ? "heavy and fatigued" : s >= 25 ? "energised" : "near baseline",
    x = a ? "depressant severity overrides expressive nuance" : n >= 25 && s >= 25 ? "felt activation versus reduced functional reliability" : t.taskPersistenceDrive >= 30 && n >= 15 ? "persistence versus competence" : t.protectiveRegulatoryStrength >= 25 && t.continuationPressure >= 25 ? "protective restraint versus continuation pressure" : t.confidencePerformanceMismatch >= 20 ? "subjective control versus actual reliability" : t.sedativeFatigueLoad >= 25 ? "fatigue versus sustained engagement" : "no dominant internal conflict";
  return {
    stateSignature: e.stateSignatureId,
    functionalConstraint: d,
    activationMode: f,
    regulatoryMode: h,
    selfAppraisalMode: p,
    interpersonalMode: v,
    affectiveMode: b,
    dominantTension: x,
    dominantDrivers: l,
    secondaryDrivers: e.activeDriverIds.filter(w => !l.includes(w)).slice(0, 6),
    countervailingControl: a ? "insufficient to alter the severe depressant state" : c.length ? c.join(", ") : t.protectiveRegulatoryStrength >= 20 ? "registered protective regulation" : "none materially active",
    temporalDirection: e.phaseId.includes("rising") ? "developing" : e.phaseId.includes("falling") ? "descending without completed recovery" : e.phaseId,
    evidenceCoverage: e.basis.coverage.code,
    confidenceClass: YZ(e.basis)
  };
}
function XZ(e, t, n) {
  if (!(e.ethanolImpairmentIndex > .01 || e.caffeineAlertnessIndex > .01 || e.ethanolSedationIndex > .01 || e.ethanolStimulationIndex > .01)) return {
    primary: "baseline",
    secondary: []
  };
  const s = Ms(t, Ya),
    l = t.wakefulActivation,
    c = t.sedativeFatigueLoad,
    d = t.anxiousActivation,
    f = t.socialExpressivity;
  if (e.bacGdL >= .25 || e.ethanolImpairmentIndex >= .86) return {
    primary: "severe-depressant-state",
    secondary: c >= 35 ? ["sedating-and-impaired"] : []
  };
  const h = [];
  return s >= 28 && h.push("functionally-impaired"), s >= 28 && c >= 34 && h.push("sedating-and-impaired"), s >= 24 && l >= 28 && h.push("alert-but-impaired"), d >= 35 && s < 28 && h.push("anxiously-activated"), e.bacRateGdLPerH > 5e-4 && e.ethanolStimulationIndex >= .18 && s < 45 && h.push("rising-limb-activated"), n.exposure.kind === "combined-sequential" && !(e.ethanolImpairmentIndex > .02 && e.caffeineAlertnessIndex > .02) && h.push("sequential-transition"), l >= 24 && s < 24 && h.push("wakefully-activated"), f >= 42 && s < 24 && h.push("socially-activated"), h.length === 0 && h.push("washout-residual"), h.sort((p, v) => Uv[v].precedence - Uv[p].precedence), {
    primary: h[0],
    secondary: h.slice(1, 3)
  };
}
function ZZ(e, t, n) {
  const a = [];
  return e.bacGdL > .002 && a.push("pk.bac-band"), e.ethanolImpairmentIndex > .01 && a.push("pd.ethanol-impairment"), e.ethanolSedationIndex > .01 && a.push("pd.ethanol-sedation"), e.ethanolStimulationIndex > .01 && a.push("pd.ethanol-stimulation"), e.caffeineAlertnessIndex > .01 && a.push("pd.caffeine-alertness"), e.combinedAlertnessIndex > .01 && a.push("pd.combined-alertness"), e.perceivedControlIndex > .01 && a.push("pd.perceived-control"), e.mismatchIndex > .01 && a.push("pd.mismatch"), t === "ethanol-rising" && a.push("temporal.rising-bac"), t === "ethanol-falling" && a.push("temporal.falling-bac"), [...new Set([...a, ...n.driverIds])];
}
function JZ(e, t, n, a, s, l, compact = false) {
  const c = GZ(),
    d = {},
    f = ($, ne) => {
      const ue = WZ({
        axisId: $,
        ...ne
      }, compact);
      if (compact) c[$] = ue; else { d[$] = ue; c[$] = ue.finalValue; }
    },
    h = e.ethanolImpairmentIndex > 1e-9 || e.bacGdL > 1e-9,
    p = e.ethanolImpairmentIndex * 100,
    v = e.ethanolSedationIndex * 100,
    b = e.ethanolStimulationIndex * 100,
    x = e.caffeineAlertnessIndex * 100,
    w = e.mismatchIndex * 100,
    g = e.perceivedControlIndex * 100,
    C = h ? Math.min(100, e.bacGdL / .16 * 100) : 0,
    S = {
      inhibitoryControlLoss: h ? So(.72 * p + .18 * b + .1 * C) : 0,
      judgmentRiskDrift: h ? So(.74 * p + .14 * b + .12 * C) : 0,
      dividedAttentionLoad: h ? So(.7 * p + .18 * v + .12 * w) : 0,
      motorReactionUnreliability: h ? So(.72 * p + .2 * v + .08 * C) : 0,
      memoryEncodingFragility: h ? So(.7 * p + .2 * v + .1 * C) : 0
    };
  for (const $ of Ya) f($, {
    basePD: S[$] ?? 0,
    pharmacodynamicFloor: S[$] ?? 0
  });
  const k = Math.max(e.ethanolImpairmentIndex, e.ethanolSedationIndex, e.ethanolStimulationIndex, e.caffeineAlertnessIndex),
    E = Math.min(1, k * 3),
    O = So(Math.max(0, (n.sleepDebtModifier - 1) / 3) * 100) * E,
    A = $ => (l.trait[$] ?? 0) * E,
    N = $ => (l.context[$] ?? 0) * E;
  f("wakefulActivation", {
    basePD: Math.max(x, b * .72),
    trait: A("wakefulActivation"),
    context: N("wakefulActivation")
  }), f("sedativeFatigueLoad", {
    basePD: .72 * v + .18 * p,
    subject: .1 * O
  }), f("anxiousActivation", {
    basePD: .48 * x + .18 * e.combinedAlertnessIndex * 100,
    subject: .08 * O,
    trait: A("anxiousActivation"),
    context: N("anxiousActivation")
  }), f("taskPersistenceDrive", {
    basePD: .62 * x + .16 * b,
    trait: A("taskPersistenceDrive"),
    context: N("taskPersistenceDrive")
  }), f("perceivedControl", {
    basePD: k > .001 ? g : 0,
    trait: A("perceivedControl"),
    context: N("perceivedControl")
  }), f("confidencePerformanceMismatch", {
    basePD: k > .001 ? w : 0,
    trait: A("confidencePerformanceMismatch"),
    context: N("confidencePerformanceMismatch")
  }), f("selfMonitoringDegradation", {
    basePD: k > .001 ? .58 * p + .24 * w + .18 * v : 0,
    trait: A("selfMonitoringDegradation"),
    context: N("selfMonitoringDegradation")
  }), f("protectiveRegulatoryStrength", {
    basePD: 0,
    trait: A("protectiveRegulatoryStrength"),
    context: N("protectiveRegulatoryStrength")
  }), f("stoppingRuleResistance", {
    basePD: k > .001 ? .42 * p + .22 * b + .18 * w : 0,
    trait: A("stoppingRuleResistance"),
    context: N("stoppingRuleResistance")
  }), f("continuationPressure", {
    basePD: k > .001 ? .34 * p + .2 * b + .16 * w : 0,
    trait: A("continuationPressure"),
    context: N("continuationPressure"),
    interaction: -.16 * c.protectiveRegulatoryStrength
  });
  const T = -.08 * c.protectiveRegulatoryStrength;
  f("socialExpressivity", {
    basePD: .48 * b + .32 * x,
    trait: A("socialExpressivity"),
    context: N("socialExpressivity"),
    interaction: T
  }), f("affectiveVolatility", {
    basePD: .26 * p + .16 * x,
    trait: A("affectiveVolatility"),
    context: N("affectiveVolatility"),
    interaction: T
  }), f("conflictReactivity", {
    basePD: .22 * p,
    trait: A("conflictReactivity"),
    context: N("conflictReactivity"),
    interaction: T
  });
  const D = UZ(e, t),
    V = XZ(e, c, t),
    G = ZZ(e, D, l);
  if (compact) return { tH:e.tH, axisValues:c, phaseId:D, stateSignatureId:V.primary, secondarySignatureIds:V.secondary, activeDriverIds:G };
  for (const $ of Object.values(d)) $.materialDrivers = $.materialDrivers.filter(ne => ne.startsWith("base.") || ne.startsWith("subject.") || ne.startsWith("trait.") || ne.startsWith("context.") || ne.startsWith("interaction.") || G.includes(ne));
  const W = rB({
    phaseId: D,
    axisValues: c,
    axisDecomposition: d,
    activeDriverIds: G,
    basis: s,
    stateSignatureId: V.primary
  });
  return {
    tH: e.tH,
    phaseId: D,
    exposureKind: t.exposure.kind,
    axisValues: c,
    axisDecomposition: d,
    psychodynamicGestalt: W,
    functionalCore: Object.fromEntries(Ya.map($ => [$, c[$]])),
    arousalState: Object.fromEntries(Zg.map($ => [$, c[$]])),
    regulationState: Object.fromEntries(yM.map($ => [$, c[$]])),
    expressionState: Object.fromEntries(bM.map($ => [$, c[$]])),
    stateSignatureId: V.primary,
    secondarySignatureIds: V.secondary,
    activeDriverIds: G,
    basis: s
  };
}
function Oo(e) {
  return Math.max(Ms(e.axisValues, Ya), Ms(e.axisValues, Zg), e.axisValues.confidencePerformanceMismatch);
}
function CT(e, t, n) {
  const a = Oo(e),
    s = Oo(t);
  return Math.abs(s - a) < 1e-12 ? t.tH : e.tH + (n - a) / (s - a) * (t.tH - e.tH);
}
function QZ(e) {
  return e.reduce((t, n) => Oo(n) > Oo(t) ? n : t, e[0]);
}
function xM(e) {
  if (e.length === 0) return [];
  const t = [];
  let n = -1,
    a = "baseline";
  for (let l = 0; l < e.length; l += 1) {
    const c = e[l].stateSignatureId;
    if (c === "baseline") {
      n >= 0 && (t.push({
        signature: a,
        start: n,
        end: l - 1
      }), n = -1);
      continue;
    }
    n < 0 ? (n = l, a = c) : c !== a && (t.push({
      signature: a,
      start: n,
      end: l - 1
    }), n = l, a = c);
  }
  n >= 0 && t.push({
    signature: a,
    start: n,
    end: e.length - 1
  });
  const s = [];
  for (const l of t) {
    const c = s.at(-1);
    c && c.signature === l.signature && e[l.start].tH - e[c.end].tH <= zZ ? c.end = l.end : s.push({
      ...l
    });
  }
  return s.map((l, c) => {
    const d = e.slice(l.start, l.end + 1),
      f = QZ(d),
      h = e[l.start - 1],
      p = e[l.end + 1],
      v = h && Oo(h) < Qc && Oo(e[l.start]) >= Qc ? CT(h, e[l.start], Qc) : e[l.start].tH,
      b = p && Oo(e[l.end]) >= Qc && Oo(p) < Qc ? CT(e[l.end], p, Qc) : e[l.end].tH,
      x = [...jt].sort((w, g) => f.axisValues[g] - f.axisValues[w]).slice(0, 3);
    return {
      id: `episode-${c + 1}-${l.signature}`,
      startH: v,
      endH: b,
      peakH: f.tH,
      stateSignatureId: l.signature,
      dominantAxisIds: x,
      peakValues: {
        ...f.axisValues
      },
      driverIds: [...new Set(d.flatMap(w => w.activeDriverIds))]
    };
  });
}
function eJ(e, t, n) {
  let a = 0;
  for (let s = 1; s < e.length; s += 1) {
    const l = e[s - 1],
      c = e[s],
      d = l.axisValues[t],
      f = c.axisValues[t],
      h = c.tH - l.tH;
    if (d >= n && f >= n) a += h;else if (d >= n != f >= n && Math.abs(f - d) > 1e-12) {
      const p = Math.max(0, Math.min(1, (n - d) / (f - d)));
      a += d >= n ? h * p : h * (1 - p);
    }
  }
  return a;
}
function tJ(e, t) {
  const n = xM(e),
    a = Object.fromEntries(jt.map(h => {
      const p = e.reduce((v, b) => b.axisValues[h] > v.axisValues[h] ? b : v, e[0]);
      return [h, {
        status: "applicable",
        value: p.axisValues[h],
        timeH: p.tH,
        scope: "horizon"
      }];
    })),
    s = Object.fromEntries(jt.map(h => {
      const p = vt[h],
        v = p.thresholds[Math.min(2, p.thresholds.length - 1)];
      return [h, {
        status: "applicable",
        durationH: eJ(e, h, v.min),
        thresholdId: v.id,
        scope: "horizon"
      }];
    })),
    l = e.filter(h => Ms(h.axisValues, Ya) >= 25),
    c = l.length ? l.reduce((h, p) => Ms(p.axisValues, Ya) > Ms(h.axisValues, Ya) ? p : h, l[0]) : null,
    d = c ? {
      status: "present",
      startH: l[0].tH,
      endH: l.at(-1).tH,
      peakH: c.tH,
      scope: "horizon"
    } : {
      status: "not-present",
      scope: "horizon"
    };
  return {
    scope: "horizon",
    dominantEpisodeId: n.reduce((h, p) => !h || Ms(p.peakValues, Ya) > Ms(h.peakValues, Ya) ? p : h, null)?.id ?? n[0]?.id ?? null,
    episodes: n,
    axisMaxima: a,
    axisDurations: s,
    highestConcernWindow: d,
    basis: t
  };
}

function zi(e, t, n) {
  if (e.numericalValidity === "invalid") return {
    status: "invalid",
    messages: e.validationMessages.length ? e.validationMessages : [{
      level: "error",
      code: "behaviour-invalid-result",
      message: "Behavioural interpretation requires a valid numerical result."
    }],
    modelVersion: Ts
  };
  const a = JSON.stringify({
      sedativeToleranceModifier: t.sedativeToleranceModifier,
      caffeineToleranceModifier: t.caffeineToleranceModifier,
      baselineAlertnessIndex: t.baselineAlertnessIndex,
      perceivedControlCalibration: t.perceivedControlCalibration,
      sleepDebtModifier: t.sleepDebtModifier
    }),
    s = `${Ts}|${a}|${um(n)}`,
    l = null;
  const c = KZ(n),
    d = qZ(n),
    h = (e.analysisPoints.length ? e.analysisPoints : e.points).map(b => JZ(b, e, t, n, c, d)),
    p = {
      status: "valid",
      points: h,
      summary: tJ(h, c),
      profileFingerprint: um(n),
      profileResolution: d.resolution,
      modelVersion: Ts
    },
    v = null;
  return p;
}
function br(e, t) {
  if (e.status === "invalid" || e.points.length === 0) return null;
  const n = e.points;
  if (t <= n[0].tH) return n[0];
  if (t >= n.at(-1).tH) return n.at(-1);
  let a = 0,
    s = n.length - 1;
  for (; a + 1 < s;) {
    const x = Math.floor((a + s) / 2);
    n[x].tH <= t ? a = x : s = x;
  }
  const l = n[a],
    c = n[s],
    d = (t - l.tH) / Math.max(1e-12, c.tH - l.tH),
    f = Object.fromEntries(jt.map(x => [x, l.axisValues[x] + d * (c.axisValues[x] - l.axisValues[x])])),
    h = d < .5 ? l : c,
    p = (x, w) => [...new Set([...x, ...w].map(C => C.coefficientId))].map(C => {
      const S = x.find(A => A.coefficientId === C),
        k = w.find(A => A.coefficientId === C),
        E = S ?? k,
        O = (S?.magnitude ?? 0) + d * ((k?.magnitude ?? 0) - (S?.magnitude ?? 0));
      return {
        ...E,
        magnitude: O,
        direction: O >= 0 ? "increase" : "decrease"
      };
    }).filter(C => Math.abs(C.magnitude) >= 1e-9),
    v = Object.fromEntries(jt.map(x => {
      const w = l.axisDecomposition[x],
        g = c.axisDecomposition[x],
        C = p(w.subjectContributions, g.subjectContributions),
        S = p(w.traitContributions, g.traitContributions),
        k = p(w.contextContributions, g.contextContributions),
        E = p(w.interactionContributions, g.interactionContributions);
      return [x, {
        axisId: x,
        basePD: w.basePD + d * (g.basePD - w.basePD),
        subjectContributions: C,
        traitContributions: S,
        contextContributions: k,
        interactionContributions: E,
        pharmacodynamicFloor: w.pharmacodynamicFloor + d * (g.pharmacodynamicFloor - w.pharmacodynamicFloor),
        lowerBound: w.lowerBound,
        upperBound: w.upperBound,
        finalValue: f[x],
        materialDrivers: [...new Set([...w.materialDrivers, ...g.materialDrivers])],
        countervailingDrivers: [...new Set([...w.countervailingDrivers, ...g.countervailingDrivers])]
      }];
    })),
    b = {
      ...h,
      tH: t,
      axisValues: f,
      axisDecomposition: v,
      functionalCore: Object.fromEntries(Ya.map(x => [x, f[x]])),
      arousalState: Object.fromEntries(Zg.map(x => [x, f[x]])),
      regulationState: Object.fromEntries(yM.map(x => [x, f[x]])),
      expressionState: Object.fromEntries(bM.map(x => [x, f[x]]))
    };
  return {
    ...b,
    psychodynamicGestalt: rB(b)
  };
}
function Zl(e, t) {
  const n = vt[e].thresholds;
  return [...n].reverse().find(a => t >= a.min) ?? n[0];
}
function ea(e) {
  return Uv[e]?.label ?? "Modeled state";
}
const Ho = "0.6.0";
const oB = ["selected-time", "episode", "horizon"];
const lB = ["emerging", "material", "high", "severe"];
const nJ = {
  inhibitoryControlLoss: {
    family: "functional",
    plain: "Pausing or stopping an initiated response is less reliable.",
    technical: "Response suppression and inhibitory control are less reliable."
  },
  judgmentRiskDrift: {
    family: "functional",
    plain: "Judgment and discrimination between safer and riskier choices are less reliable.",
    technical: "Decision calibration and risk discrimination are less reliable."
  },
  dividedAttentionLoad: {
    family: "functional",
    plain: "Dividing attention across simultaneous demands is more difficult.",
    technical: "Divided-attention capacity is under increased load."
  },
  motorReactionUnreliability: {
    family: "functional",
    plain: "Coordination, tracking, balance, and reaction timing are less reliable.",
    technical: "Motor coordination and reaction reliability are reduced."
  },
  memoryEncodingFragility: {
    family: "functional",
    plain: "Encoding and retaining new information is less reliable.",
    technical: "Memory encoding and short-term retention are more fragile."
  },
  wakefulActivation: {
    family: "subjective",
    plain: "Wakefulness and mental activation are elevated.",
    technical: "Wakeful activation is materially elevated."
  },
  sedativeFatigueLoad: {
    family: "subjective",
    plain: "Heaviness, sleepiness, and effortful engagement are prominent.",
    technical: "Sedation and fatigue load are materially elevated."
  },
  anxiousActivation: {
    family: "subjective",
    plain: "Activation is tense or restless rather than smoothly focused.",
    technical: "Stress-sensitive anxious activation is materially elevated."
  },
  taskPersistenceDrive: {
    family: "subjective",
    plain: "Drive to persist with an activity is elevated without a corresponding gain in competence.",
    technical: "Task-persistence drive is elevated independently of functional reliability."
  },
  perceivedControl: {
    family: "calibration",
    plain: "A comparatively strong sense of control remains present.",
    technical: "Perceived control remains elevated relative to the active state."
  },
  confidencePerformanceMismatch: {
    family: "calibration",
    plain: "Felt capability exceeds modeled performance reliability.",
    technical: "Confidence and functional performance are materially miscalibrated."
  },
  selfMonitoringDegradation: {
    family: "calibration",
    plain: "Recognition and correction of performance changes are less reliable.",
    technical: "Self-monitoring and corrective regulation are degraded."
  },
  stoppingRuleResistance: {
    family: "calibration",
    plain: "A previously chosen stopping point carries less weight in the moment.",
    technical: "Adherence to a stated stopping rule is less reliable."
  },
  continuationPressure: {
    family: "calibration",
    plain: "Pressure to continue the session or current task is elevated.",
    technical: "Continuation pressure is elevated relative to available restraint."
  },
  protectiveRegulatoryStrength: {
    family: "calibration",
    plain: "Planning, accountability, and deliberation provide active countervailing restraint.",
    technical: "Protective regulatory strength constrains continuation and outward expression."
  },
  socialExpressivity: {
    family: "expression",
    plain: "Talkativeness, engagement, or visible social energy is elevated.",
    technical: "Social expressivity is materially elevated."
  },
  affectiveVolatility: {
    family: "expression",
    plain: "Emotional reactions are more changeable and visibly reactive.",
    technical: "Affective expression is more volatile."
  },
  conflictReactivity: {
    family: "expression",
    plain: "Existing disagreement exerts a stronger influence on outward reactions.",
    technical: "Conflict cues exert a stronger bounded influence on expression."
  }
};
function aJ(e) {
  const t = vt[e],
    n = nJ[e];
  return Object.freeze({
    id: `axis.${e.replace(/([A-Z])/g, "-$1").toLowerCase()}`,
    family: n.family,
    axisIds: [e],
    driverIds: [...t.baseDriverIds, ...t.permittedModifierIds],
    exposureKinds: [],
    signatureIds: [],
    phases: [],
    scopeKinds: oB,
    magnitudeBands: lB,
    profilePredicates: t.permittedModifierIds.filter(a => a.startsWith("trait.")),
    contextPredicates: t.permittedModifierIds.filter(a => a.startsWith("context.")),
    precedence: t.group === "functional-reliability" ? 700 : t.group === "self-calibration" ? 600 : t.group === "activation" ? 500 : 400,
    suppresses: [],
    incompatibleWith: [],
    requiredInvariantIds: e === "wakefulActivation" ? ["invariant.activation-is-not-competence"] : e === "confidencePerformanceMismatch" ? ["invariant.caffeine-does-not-cancel-impairment"] : [],
    defaultTemplate: n.plain,
    detailedTemplate: n.technical,
    expertTemplate: `${n.technical} {value}/100 ({band}).`,
    provenanceIds: [...t.provenanceIds]
  });
}
const iJ = jt.map(aJ);
function it(e) {
  return Object.freeze({
    axisIds: [],
    driverIds: [],
    exposureKinds: [],
    signatureIds: [],
    phases: [],
    scopeKinds: oB,
    magnitudeBands: ["quiet", ...lB],
    profilePredicates: [],
    contextPredicates: [],
    suppresses: [],
    incompatibleWith: [],
    requiredInvariantIds: [],
    provenanceIds: [],
    ...e
  });
}
const rJ = [it({
  id: "temporal.neutral",
  family: "temporal",
  precedence: 1e3,
  defaultTemplate: "No active drug-linked behavioural change is modeled at this time.",
  detailedTemplate: "The selected point remains at the registered behavioural baseline.",
  expertTemplate: "No active axis crosses its narrative materiality threshold."
}), it({
  id: "temporal.rising",
  family: "temporal",
  precedence: 720,
  phases: ["ethanol-rising", "caffeine-active"],
  defaultTemplate: "The active effects are still developing, so the balance of alertness and functional reliability may continue to change.",
  detailedTemplate: "The selected point is on an active rising phase; axis magnitudes have not necessarily reached their horizon maxima.",
  expertTemplate: "The selected phase is rising; current values are distinct from episode and horizon maxima."
}), it({
  id: "temporal.falling-not-recovered",
  family: "temporal",
  precedence: 900,
  phases: ["ethanol-falling"],
  axisIds: ["motorReactionUnreliability", "selfMonitoringDegradation"],
  defaultTemplate: "BAC is falling, but modeled recovery of coordination and self-monitoring is not yet complete.",
  detailedTemplate: "The descending BAC limb persists alongside active functional and self-monitoring effects; falling concentration is not complete recovery.",
  expertTemplate: "Descending-limb precedence applies while functional axes remain active; falling BAC is not complete recovery.",
  requiredInvariantIds: ["invariant.falling-bac-is-not-recovery"],
  provenanceIds: ["behaviour.interaction.descending-limb-fatigue"]
}), it({
  id: "temporal.sequential",
  family: "temporal",
  precedence: 880,
  exposureKinds: ["combined-sequential"],
  defaultTemplate: "The alcohol-led and caffeine-led effects occur in separate phases rather than cancelling one another.",
  detailedTemplate: "The exposure classifier identifies sequential phases; their state entailments are evaluated separately without cancellation.",
  expertTemplate: "Sequential exposure precedence applies; clause selection remains local to the selected phase.",
  requiredInvariantIds: ["invariant.caffeine-does-not-cancel-impairment"],
  provenanceIds: ["behaviour.interaction.stimulant-impairment-coexistence"]
}), it({
  id: "temporal.overlap",
  family: "temporal",
  precedence: 860,
  exposureKinds: ["combined-overlap"],
  defaultTemplate: "Alcohol-linked impairment and caffeine-linked wakefulness are active together at this point.",
  detailedTemplate: "The overlap phase contains simultaneous stimulant activation and ethanol-linked functional impairment.",
  expertTemplate: "Combined-overlap exposure activates coexistence precedence without modifying the ethanol functional floor.",
  requiredInvariantIds: ["invariant.caffeine-does-not-cancel-impairment", "invariant.activation-is-not-competence"],
  provenanceIds: ["behaviour.interaction.stimulant-impairment-coexistence"]
}), it({
  id: "temporal.activation-persisting",
  family: "temporal",
  precedence: 700,
  exposureKinds: ["caffeine-only", "combined-overlap", "combined-sequential"],
  defaultTemplate: "The currently prominent activation is expected to ease as the stimulant concentration declines.",
  detailedTemplate: "Activation remains material at the selected point and is expected to recede with the caffeine-linked trajectory.",
  expertTemplate: "The selected activation axes remain above narrative threshold during the current caffeine-linked phase.",
  provenanceIds: ["pd.caffeine-alertness"]
}), it({
  id: "context.protective-regulation",
  family: "context",
  precedence: 800,
  contextPredicates: ["accountability:peer|formal|supervised", "stoppingPlan:explicit"],
  defaultTemplate: "The entered planning and accountability context may support firmer outward control, although it does not reduce the underlying impairment.",
  detailedTemplate: "Registered planning or accountability inputs support bounded regulation without lowering BAC or the concentration-derived functional floor.",
  expertTemplate: "Protective-context modifiers alter regulation pathways only; they cannot reduce PK/PD-derived impairment axes.",
  requiredInvariantIds: ["invariant.protective-context-is-not-pharmacological-protection"],
  provenanceIds: ["behaviour.interaction.deliberative-regulation"]
}), it({
  id: "context.stress-sensitive-activation",
  family: "context",
  precedence: 760,
  axisIds: ["anxiousActivation"],
  contextPredicates: ["acuteStress:high"],
  defaultTemplate: "With the entered stress context, activation may feel tenser rather than smoothly focused.",
  detailedTemplate: "High entered acute stress contributes a bounded stress-sensitive modifier to anxious activation.",
  expertTemplate: "The registered acute-stress predicate is active within the anxious-activation context cap.",
  provenanceIds: ["behaviour.interaction.anxious-activation"]
}), it({
  id: "context.social-expression",
  family: "context",
  precedence: 520,
  axisIds: ["socialExpressivity"],
  contextPredicates: ["socialScale:small|large", "environmentalStimulation:high"],
  defaultTemplate: "The entered social setting may make the activated state more outwardly noticeable.",
  detailedTemplate: "Social scale or environmental stimulation supplies a bounded expression modifier.",
  expertTemplate: "A registered social-context predicate contributes to expression only and leaves PK/PD arrays unchanged.",
  provenanceIds: ["behaviour.interaction.social-activation"]
}), it({
  id: "context.mbti-narrative-only",
  family: "context",
  precedence: 100,
  profilePredicates: ["narrativeMetadata.mbtiType"],
  defaultTemplate: "MBTI metadata is reserved for higher-detail views.",
  detailedTemplate: "The supplied MBTI label is retained as low-priority narrative metadata.",
  expertTemplate: "MBTI metadata is present with a registered quantitative coefficient of exactly zero.",
  provenanceIds: ["behaviour.profile.mbti-narrative-only"]
}), it({
  id: "invariant.caffeine-does-not-cancel-impairment",
  family: "invariant",
  precedence: 1e3,
  defaultTemplate: "Greater wakefulness does not lower BAC or reverse alcohol-linked impairment.",
  detailedTemplate: "Caffeine-linked activation coexists with, and does not reduce, BAC or ethanol impairment.",
  expertTemplate: "The stimulant-impairment coexistence invariant preserves the ethanol functional floor."
}), it({
  id: "invariant.activation-is-not-competence",
  family: "invariant",
  precedence: 990,
  defaultTemplate: "Feeling more alert does not imply more reliable judgment, coordination, or reaction time.",
  detailedTemplate: "Activation does not imply competence or improved functional reliability.",
  expertTemplate: "Activation axes cannot subtract from functional-reliability axes."
}), it({
  id: "invariant.falling-bac-is-not-recovery",
  family: "invariant",
  precedence: 980,
  defaultTemplate: "A falling BAC does not by itself mean that function has recovered.",
  detailedTemplate: "Falling BAC is not complete functional recovery.",
  expertTemplate: "Descending concentration does not suppress active functional clauses."
}), it({
  id: "invariant.protective-context-is-not-pharmacological-protection",
  family: "invariant",
  precedence: 970,
  defaultTemplate: "Planning and accountability do not lower BAC or underlying impairment.",
  detailedTemplate: "Protective context is not pharmacological protection.",
  expertTemplate: "Protective context cannot alter concentration-derived floors."
}), it({
  id: "invariant.traits-cannot-lower-functional-floor",
  family: "invariant",
  precedence: 960,
  defaultTemplate: "Personal tendencies may shape expression, but they do not reduce the modeled functional impairment.",
  detailedTemplate: "Temperament and context cannot soften the concentration-derived functional floor.",
  expertTemplate: "Trait and context coefficients are bounded outside the functional core."
}), it({
  id: "invariant.non-diagnostic",
  family: "invariant",
  precedence: 950,
  defaultTemplate: "This pattern describes the modeled state without assigning a diagnosis or predicting harmful conduct.",
  detailedTemplate: "The behavioural output remains heuristic and non-diagnostic and makes no harmful-conduct or individual clinical prediction.",
  expertTemplate: "Narrative predicates exclude diagnostic, harmful-conduct, and individual clinical-outcome claims."
}), it({
  id: "presentation.no-exposure",
  family: "temporal",
  precedence: 1100,
  defaultTemplate: "The selected state remains at the modeled baseline.",
  detailedTemplate: "No concentration-linked PK/PD state is active at the selected time.",
  expertTemplate: "The selected canonical point is exposure-negative.",
  provenanceIds: ["pk.bac-band", "pd.caffeine-alertness"]
}), it({
  id: "presentation.scheduled",
  family: "temporal",
  precedence: 1090,
  defaultTemplate: "Ethanol is scheduled later; BAC remains zero.",
  detailedTemplate: "A future ethanol event is present, with no central BAC at the selected time.",
  expertTemplate: "Scheduled-input precedence applies before ethanol administration.",
  provenanceIds: ["pk.bac-band"]
}), it({
  id: "presentation.pre-absorption",
  family: "temporal",
  precedence: 1080,
  defaultTemplate: "Ethanol is in the absorption compartments; BAC remains zero.",
  detailedTemplate: "Administered ethanol has not yet produced a central BAC.",
  expertTemplate: "Pre-absorption precedence applies while gastric or intestinal ethanol is positive and central BAC is zero.",
  provenanceIds: ["pk.bac-band"]
}), it({
  id: "presentation.trace",
  family: "temporal",
  precedence: 1070,
  defaultTemplate: "Only a trace ethanol concentration remains.",
  detailedTemplate: "The selected BAC is analytically positive but below the ordinary display increment.",
  expertTemplate: "Trace-band precedence applies below 0.001 g/dL.",
  provenanceIds: ["pk.bac-band"]
}), it({
  id: "presentation.very-low",
  family: "temporal",
  precedence: 1060,
  defaultTemplate: "A very low ethanol concentration is present.",
  detailedTemplate: "The selected BAC is in the registered very-low band.",
  expertTemplate: "Very-low BAC-band precedence applies from 0.001 to below 0.005 g/dL.",
  provenanceIds: ["pk.bac-band"]
}), it({
  id: "presentation.rising",
  family: "temporal",
  precedence: 1050,
  defaultTemplate: "BAC is rising toward the modeled peak.",
  detailedTemplate: "The selected point is on the rising BAC limb.",
  expertTemplate: "Positive BAC-rate precedence applies at the selected point.",
  provenanceIds: ["pk.bac-band"]
}), it({
  id: "presentation.near-peak",
  family: "temporal",
  precedence: 1040,
  defaultTemplate: "BAC is around its modeled peak.",
  detailedTemplate: "The selected time lies within the registered peak window.",
  expertTemplate: "Near-peak temporal precedence applies within 0.25 h of peak BAC.",
  provenanceIds: ["pk.bac-band"]
}), it({
  id: "presentation.descending",
  family: "temporal",
  precedence: 1030,
  defaultTemplate: "BAC is falling while the current concentration-linked effects remain active.",
  detailedTemplate: "The selected point is on the descending BAC limb.",
  expertTemplate: "Negative BAC-rate precedence applies without implying functional recovery.",
  requiredInvariantIds: ["invariant.falling-bac-is-not-recovery"],
  provenanceIds: ["pk.bac-band", "behaviour.interaction.descending-limb-fatigue"]
}), it({
  id: "presentation.caffeine-pending",
  family: "temporal",
  precedence: 1020,
  defaultTemplate: "Caffeine is scheduled or absorbing without a central concentration yet.",
  detailedTemplate: "A caffeine input or gut amount precedes measurable central caffeine.",
  expertTemplate: "Pending-caffeine precedence applies before central concentration emerges.",
  provenanceIds: ["pd.caffeine-alertness"]
}), it({
  id: "presentation.caffeine-rising",
  family: "temporal",
  precedence: 1010,
  defaultTemplate: "Caffeine concentration is rising.",
  detailedTemplate: "The selected point is on the rising caffeine limb.",
  expertTemplate: "Positive local caffeine-slope precedence applies.",
  provenanceIds: ["pd.caffeine-alertness"]
}), it({
  id: "presentation.caffeine-near-peak",
  family: "temporal",
  precedence: 1e3,
  defaultTemplate: "Caffeine is around its modeled peak.",
  detailedTemplate: "The selected time lies within the caffeine peak window.",
  expertTemplate: "Near-peak caffeine precedence applies within 0.25 h of peak concentration.",
  provenanceIds: ["pd.caffeine-alertness"]
}), it({
  id: "presentation.caffeine-declining",
  family: "temporal",
  precedence: 990,
  defaultTemplate: "Caffeine concentration is declining.",
  detailedTemplate: "The selected point is on the declining caffeine limb.",
  expertTemplate: "Negative local caffeine-slope precedence applies.",
  provenanceIds: ["pd.caffeine-alertness"]
}), it({
  id: "presentation.combined-overlap",
  family: "temporal",
  precedence: 1120,
  defaultTemplate: "Caffeine-linked activation and alcohol-linked impairment are active together.",
  detailedTemplate: "Meaningful overlap is active at the selected point without cancellation.",
  expertTemplate: "Combined-overlap presentation preserves the ethanol functional floor.",
  requiredInvariantIds: ["invariant.caffeine-does-not-cancel-impairment"],
  provenanceIds: ["behaviour.interaction.stimulant-impairment-coexistence"]
}), it({
  id: "presentation.combined-sequential",
  family: "temporal",
  precedence: 1110,
  defaultTemplate: "The alcohol-led and caffeine-led phases occur in sequence.",
  detailedTemplate: "Sequential exposure is presented as distinct local states.",
  expertTemplate: "Combined-sequential presentation evaluates each selected-time phase independently.",
  requiredInvariantIds: ["invariant.caffeine-does-not-cancel-impairment"],
  provenanceIds: ["behaviour.interaction.stimulant-impairment-coexistence"]
}), it({
  id: "presentation.historical-trace",
  family: "temporal",
  precedence: 1130,
  defaultTemplate: "Only a negligible historical residue remains.",
  detailedTemplate: "The modeled horizon contains residual values below active presentation floors.",
  expertTemplate: "Historical-trace exposure precedence applies.",
  provenanceIds: ["pk.bac-band"]
}), it({
  id: "presentation.severe",
  family: "temporal",
  precedence: 1140,
  defaultTemplate: "Severe concentration-linked impairment is dominant.",
  detailedTemplate: "The selected BAC is in a severe or extreme registered band.",
  expertTemplate: "Severe-state precedence suppresses lighter expression language.",
  provenanceIds: ["pk.bac-band"]
}), it({
  id: "presentation.temperament-expression",
  family: "context",
  precedence: 510,
  defaultTemplate: "The entered profile shapes outward expression within registered limits.",
  detailedTemplate: "Profile and context inputs affect expression without changing PK/PD values.",
  expertTemplate: "Bounded profile-expression composition is active.",
  requiredInvariantIds: ["invariant.traits-cannot-lower-functional-floor"],
  provenanceIds: ["behaviour.profile.registered-traits"]
}), ...[["zero", "Exactly zero central blood ethanol"], ["minimal", "Minimal BAC severity"], ["low", "Low BAC severity"], ["medium", "Medium BAC severity"], ["high", "High BAC severity"], ["very-high", "Very-high BAC severity"], ["severe", "Severe BAC severity"], ["extreme", "Extreme BAC severity"]].map(([e, t], n) => it({
  id: `presentation.severity.${e}`,
  family: "temporal",
  precedence: 1200 + n,
  defaultTemplate: `${t} is active at the selected point.`,
  detailedTemplate: `${t} is selected by the exact independent BAC severity registry.`,
  expertTemplate: `${t}; exact tier-registry boundary precedence is active.`,
  provenanceIds: ["pk.bac-severity-tier"]
})), ...["absent", "scheduled", "pre-absorption", "rising", "near-peak", "descending", "residual", "stable"].map(e => it({
  id: `presentation.bac-${e}`,
  family: "temporal",
  precedence: 1180,
  defaultTemplate: `The selected BAC trajectory is ${e.replace(/-/g, " ")}.`,
  detailedTemplate: `Selected-time BAC trajectory classification: ${e.replace(/-/g, " ")}.`,
  expertTemplate: `Typed BAC trajectory state ${e} is active.`,
  provenanceIds: ["pk.bac-band"]
})), it({
  id: "presentation.caffeine-residual",
  family: "temporal",
  precedence: 985,
  defaultTemplate: "Residual caffeine-linked activation remains.",
  detailedTemplate: "Caffeine is below the principal active threshold but remains centrally present.",
  expertTemplate: "Typed caffeine residual state is active.",
  provenanceIds: ["pd.caffeine-alertness"]
}), it({
  id: "presentation.caffeine-stable",
  family: "temporal",
  precedence: 980,
  defaultTemplate: "Caffeine-linked activation is comparatively stable.",
  detailedTemplate: "Local caffeine slope remains within the stable threshold.",
  expertTemplate: "Typed caffeine stable state is active.",
  provenanceIds: ["pd.caffeine-alertness"]
}), it({
  id: "presentation.caffeine-tolerance",
  family: "context",
  precedence: 515,
  defaultTemplate: "Entered caffeine tolerance shapes alertness response relative to concentration.",
  detailedTemplate: "The registered caffeine-tolerance modifier changes alertness PD without changing concentration.",
  expertTemplate: "subject.caffeineToleranceModifier is active in the selected presentation.",
  provenanceIds: ["subject.caffeineToleranceModifier"]
}), it({
  id: "presentation.sleep-restriction",
  family: "context",
  precedence: 514,
  defaultTemplate: "Entered sleep state shapes fatigue and activation quality.",
  detailedTemplate: "The registered sleep-debt modifier changes behavioural response without changing concentration.",
  expertTemplate: "subject.sleepDebtModifier is active in the selected presentation.",
  provenanceIds: ["subject.sleepDebtModifier"]
})];
const fa = Object.freeze(Object.fromEntries([...iJ, ...rJ].map(e => [e.id, e])));
const sJ = Object.freeze({
  "presentation.temperament-expression": "context.registered-trait-expression"
});
function oJ(e) {
  return e >= 82 ? "severe" : e >= 60 ? "high" : e >= 35 ? "material" : e >= 15 ? "emerging" : "quiet";
}
function jM(e) {
  const t = vt[e].group;
  return t === "functional-reliability" ? 15 : t === "activation" ? 20 : e === "perceivedControl" ? 25 : e === "confidencePerformanceMismatch" ? 20 : t === "self-calibration" ? 15 : 25;
}
function cB(e, t, n) {
  const a = t === "default" ? e.defaultTemplate : t === "detailed" ? e.detailedTemplate : e.expertTemplate,
    s = e.axisIds[0];
  if (!s) return a;
  const l = n.axisValues[s];
  return a.replace("{value}", l.toFixed(1)).replace("{band}", Zl(s, l).label);
}
function wT(e) {
  const t = e.trim().replace(/\s+/g, " ");
  return !t || /[.!?]$/.test(t) ? t : t + ".";
}
function lJ(e) {
  return e && e.charAt(0).toLowerCase() + e.slice(1);
}
function cJ(e) {
  return e === "subjective" ? "felt state" : e === "functional" ? "functional reliability" : e === "calibration" ? "self-calibration" : e === "expression" ? "outward expression" : e === "context" ? "regulatory context" : e === "temporal" ? "temporal course" : "model invariant";
}
function Po(e, t, n, a = "selected-time", s = "At " + n.tH + " h") {
  const l = Object.fromEntries(e.axisIds.map(x => [x, n.axisValues[x]])),
    c = e.driverIds.filter(x => n.activeDriverIds.includes(x)),
    d = Math.max(0, ...e.axisIds.map(x => n.axisValues[x])),
    f = wT(cB(e, t, n)),
    h = [...new Set(e.axisIds.flatMap(x => n.axisDecomposition[x]?.materialDrivers ?? []))],
    p = [...new Set(e.axisIds.flatMap(x => n.axisDecomposition[x]?.countervailingDrivers ?? []))],
    v = [...new Set([...e.provenanceIds, ...e.axisIds.flatMap(x => vt[x].provenanceIds), ...c])],
    b = e.axisIds[0] ? vt[e.axisIds[0]].polarity : null;
  return {
    id: e.id,
    family: e.family,
    text: f,
    axisIds: e.axisIds,
    driverIds: c,
    values: l,
    magnitudeBand: oJ(d),
    registeredBandIds: e.axisIds.map(x => Zl(x, n.axisValues[x]).id),
    precedence: e.precedence,
    provenanceIds: v,
    subject: cJ(e.family),
    predicate: e.family === "invariant" ? "constrains" : e.family === "temporal" ? "locates" : "indicates",
    complement: f.replace(/[.!?]$/, ""),
    polarity: b === "protective-strength" ? "protective" : e.family === "invariant" || e.family === "temporal" ? "neutral" : "increase",
    magnitude: d,
    temporalScope: a,
    stateScope: n.stateSignatureId,
    dependencies: [...new Set([...e.axisIds, ...c, ...e.requiredInvariantIds])],
    materialDrivers: h,
    countervailingDrivers: p,
    confidenceClass: n.psychodynamicGestalt.confidenceClass,
    provenance: v,
    labelSafeText: f,
    standaloneText: wT(s + ", " + lJ(f))
  };
}
function uJ(e, t, n, a) {
  return jt.filter(s => e.axisValues[s] >= jM(s)).map(s => Po(fa[`axis.${s.replace(/([A-Z])/g, "-$1").toLowerCase()}`], t, e, n, a)).sort((s, l) => l.precedence + maintenanceMax(Object.values(l.values)) - (s.precedence + maintenanceMax(Object.values(s.values))));
}
function dJ(e, t, n, a, s, l) {
  let c = "temporal.neutral";
  return e.exposureKind === "combined-sequential" ? c = "temporal.sequential" : e.exposureKind === "combined-overlap" && n ? c = "temporal.overlap" : e.phaseId.includes("falling") && n ? c = "temporal.falling-not-recovered" : e.phaseId.includes("rising") || e.phaseId === "caffeine-active" ? c = "temporal.rising" : a && (e.exposureKind === "caffeine-only" || e.exposureKind.startsWith("combined")) && (c = "temporal.activation-persisting"), Po(fa[c], t, e, s, l);
}
function fJ(e, t, n, a, s) {
  if (!t.applied) return null;
  if ((["peer", "formal", "supervised"].includes(t.context.accountability) || t.context.stoppingPlan === "explicit") && ["inhibitoryControlLoss", "judgmentRiskDrift", "dividedAttentionLoad", "motorReactionUnreliability", "memoryEncodingFragility"].some(f => e.axisValues[f] >= 15)) return Po(fa["context.protective-regulation"], n, e, a, s);
  if (t.context.acuteStress === "high" && e.axisValues.anxiousActivation >= 20) return Po(fa["context.stress-sensitive-activation"], n, e, a, s);
  if ((["small", "large"].includes(t.context.socialScale) || t.context.environmentalStimulation === "high") && e.axisValues.socialExpressivity >= 25) return Po(fa["context.social-expression"], n, e, a, s);
  const c = Bm(t);
  if (Object.values(c).some(f => f.value !== null) && e.axisValues.socialExpressivity >= 25) {
    const f = Po(fa["context.social-expression"], n, e, a, s);
    return {
      ...f,
      id: "context.registered-trait-expression",
      text: n === "default" ? "The entered stable-trait profile may shape how visible the state is, without reducing its underlying functional effects." : "Supplied stable-trait values contribute only through bounded expression and regulation pathways.",
      provenanceIds: [...f.provenanceIds, "behaviour.profile.registered-traits"]
    };
  }
  return n !== "default" && t.narrativeMetadata.mbtiType ? Po(fa["context.mbti-narrative-only"], n, e, a, s) : null;
}
function mJ(e, t, n) {
  return !t && !n ? "No active drug-linked change" : e.stateSignatureId === "severe-depressant-state" ? "Severe depressant effects are dominant" : t && n ? "Awake or activated, with impairment still present" : t && e.axisValues.sedativeFatigueLoad >= 20 ? "Fatigue and functional impairment are active together" : t ? "Functional reliability is reduced at this point" : e.axisValues.anxiousActivation >= 20 ? "Alertness is elevated and tense" : n ? "Wakefulness and activation are elevated" : ea(e.stateSignatureId);
}
function jp(e, t, n) {
  const a = t.filter(s => s.family === n);
  return e === "expert" ? a : a.slice(0, e === "detailed" ? 2 : 1);
}
function qi(e, t, n) {
  const a = n.detail ?? "default",
    s = n.scope ?? "selected-time",
    l = uJ(e, a, s, n.scopeLabel),
    c = l.some(D => D.family === "functional"),
    d = l.some(D => D.family === "subjective"),
    f = e.exposureKind === "caffeine-only" || e.exposureKind.startsWith("combined") || e.activeDriverIds.includes("pd.caffeine-alertness"),
    h = e.stateSignatureId === "severe-depressant-state" || Math.max(e.axisValues.motorReactionUnreliability, e.axisValues.sedativeFatigueLoad) >= 82,
    p = h ? l.filter(D => D.family !== "expression" && D.id !== "axis.perceived-control") : l,
    v = jp(a, p, "subjective"),
    b = jp(a, p, "functional"),
    x = jp(a, p, "calibration"),
    w = jp(a, p, "expression"),
    g = dJ(e, a, c, d, s, n.scopeLabel),
    C = h ? null : fJ(e, t, a, s, n.scopeLabel),
    S = new Set();
  c && d && S.add("invariant.activation-is-not-competence"), c && f && S.add("invariant.caffeine-does-not-cancel-impairment"), e.phaseId.includes("falling") && c && S.add("invariant.falling-bac-is-not-recovery"), C?.id === "context.protective-regulation" && S.add("invariant.protective-context-is-not-pharmacological-protection"), t.applied && c && S.add("invariant.traits-cannot-lower-functional-floor"), a === "expert" && S.add("invariant.non-diagnostic");
  for (const D of fa[g.id]?.requiredInvariantIds ?? []) S.add(D);
  const k = [...S].map(D => Po(fa[D], a, e, s, n.scopeLabel)),
    E = [...v, ...b, ...x, ...w, g, ...(C ? [C] : []), ...k],
    O = E.map(D => D.id),
    A = {};
  for (const D of jt) {
    const V = `axis.${D.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
    e.axisValues[D] < jM(D) ? A[V] = "below-materiality-deadband" : h && (fa[V].family === "expression" || D === "perceivedControl") ? A[V] = "severe-depressant-precedence" : O.includes(V) || (A[V] = "detail-budget");
  }
  t.narrativeMetadata.mbtiType && a === "default" && (A["context.mbti-narrative-only"] = "detailed-or-expert-only-zero-coefficient-metadata");
  const N = Object.keys(A),
    T = h ? "Marked sedation and functional impairment are dominant at this point in the modeled timeline." : !c && !d ? "No active drug-linked behavioural change is modeled at this time." : c && d ? "Wakeful activation or persistence remains present, while functional reliability is reduced; alertness does not restore judgment, coordination, attention, or reaction consistency." : v[0]?.text ?? b[0]?.text ?? g.text;
  return {
    scope: s,
    scopeLabel: n.scopeLabel,
    stateSignatureId: e.stateSignatureId,
    headline: mJ(e, c, d),
    plainSynopsis: T,
    subjectiveClauses: v,
    functionalClauses: b,
    calibrationClauses: x,
    expressionClauses: w,
    temporalClause: g,
    contextClause: C,
    invariantClauses: k,
    selectedClauseIds: O,
    suppressedClauseIds: N,
    suppressedClauseReasons: A,
    semanticEntailments: E,
    psychodynamicGestalt: e.psychodynamicGestalt,
    axisDecomposition: e.axisDecomposition,
    profileResolution: iB(t),
    entailmentAliases: {
      ...sJ
    },
    provenanceIds: [...new Set(E.flatMap(D => D.provenanceIds))],
    narrativeVersion: Ho,
    stateLabel: ea(e.stateSignatureId),
    functionalReliability: b.map(D => D.text).join(" ") || "No functional-reliability loss is active at this scope.",
    subjectivePresentation: v.map(D => D.text).join(" ") || "No material activation or fatigue change is modeled at this scope.",
    likelyExpression: w.map(D => D.text).join(" ") || "No outward expression tendency crosses its narrative threshold.",
    regulatoryContext: C?.text ?? x.filter(D => D.id.includes("protective-regulatory")).map(D => D.text).join(" ")
  };
}
const hJ = ["the observed phenotype is", "the phenotype is", "the most likely phenotype is", "the most likely presentation is", "the subjective presentation is", "the subjective phenotype is", "outward expression is", "the outward phenotype is", "the applied temperament profile", "the temperament and context profile", "the current trajectory is", "at the selected time, the selected-time state", "the modeled interpretation suggests that the modeled state"];
function yj(e) {
  return e.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(t => t.length > 2);
}
function pJ(e, t) {
  const n = new Set(yj(e)),
    a = new Set(yj(t)),
    s = new Set([...n, ...a]);
  if (!s.size) return 0;
  let l = 0;
  for (const c of n) a.has(c) && (l += 1);
  return l / s.size;
}
function vJ(e) {
  const t = [],
    n = e.toLowerCase();
  for (const d of hJ) n.includes(d) && t.push({
    code: "forbidden-referent",
    message: "A label-repeating referent appears in rendered prose.",
    excerpt: d
  });
  const a = n.match(/\b(can be characterized as|can be described as|the model suggests that|it is possible that)\b/g) ?? [];
  for (const d of a) t.push({
    code: "scaffolding",
    message: "Unnecessary interpretive scaffolding appears in rendered prose.",
    excerpt: d
  });
  const s = e.split(new RegExp("(?<=[.!?])\\s+")).map(d => d.trim()).filter(Boolean),
    l = s.map(d => yj(d).join(" "));
  l.forEach((d, f) => {
    d && l.indexOf(d) < f && t.push({
      code: "duplicate-clause",
      message: "A clause is repeated verbatim.",
      excerpt: s[f]
    });
  });
  for (let d = 0; d < s.length; d += 1) for (let f = d + 1; f < s.length; f += 1) l[d] !== l[f] && pJ(s[d], s[f]) >= .82 && t.push({
    code: "near-duplicate",
    message: "Two clauses are near-duplicates.",
    excerpt: s[f]
  });
  for (const d of ["phenotype", "presentation", "modeled state", "selected time"]) n.split(d).length - 1 > 2 && t.push({
    code: "repeated-stem",
    message: "A referential stem is repeated too often.",
    excerpt: d
  });
  const c = (n.match(/\b(may|might|could|possibly|suggests?)\b/g) ?? []).length;
  return c > Math.max(2, Math.ceil(s.length / 2)) && t.push({
    code: "hedge-density",
    message: "Rendered prose contains excessive repeated hedging.",
    excerpt: String(c)
  }), t;
}
function gJ(e) {
  return vJ(e.map(t => t.label + ". " + t.text).join(" "));
}
function uB(e, t, n) {
  return Number.isFinite(e) ? Math.min(n, Math.max(t, e)) : t;
}
function Bi(e) {
  return uB(e, 0, 1);
}
function hu(e, t) {
  return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function jJ(e, t, n) {
  return Math.max(0, e) * (Math.max(0, t) / 100) * n;
}
function dB(e, t) {
  if (e <= 0) return 0;
  if (t.calculationMode === "TBW-based") {
    const a = t.tbwL ?? 0;
    return a <= 0 ? 0 : e * t.bloodWaterFraction / (a * 10);
  }
  const n = t.apparentVdL ?? 0;
  return n <= 0 ? 0 : e / (n * 10);
}
function qv(e, t) {
  if (t.calculationMode === "TBW-based") {
    const a = t.tbwL ?? 0;
    return a <= 0 || t.bloodWaterFraction <= 0 ? 0 : e * (a * 10) / t.bloodWaterFraction;
  }
  const n = t.apparentVdL ?? 0;
  return n <= 0 ? 0 : e * n * 10;
}
function MM(e, t) {
  return e === "fasted" ? {
    gastricEmptyingRatePerH: t.gastricEmptyingRateFastedPerH,
    firstPassFraction: t.firstPassFractionFasted
  } : e === "heavy meal" ? {
    gastricEmptyingRatePerH: t.gastricEmptyingRateHeavyMealPerH,
    firstPassFraction: t.firstPassFractionHeavyMeal
  } : e === "custom" ? {
    gastricEmptyingRatePerH: t.gastricEmptyingRateCustomPerH,
    firstPassFraction: t.firstPassFractionCustom
  } : {
    gastricEmptyingRatePerH: t.gastricEmptyingRateLightMealPerH,
    firstPassFraction: t.firstPassFractionLightMeal
  };
}
function fm(e, t) {
  return Math.max(0, e) * Math.max(0, t);
}
function Hm(e) {
  return e.beverageType === "mixed-drink" ? Math.max(0, e.spiritVolumeMl ?? e.ethanolVolumeMl) : e.beverageType === "straight-spirit" ? Math.max(0, e.spiritVolumeMl ?? e.servingVolumeMl ?? e.ethanolVolumeMl) : Math.max(0, e.servingVolumeMl ?? e.ethanolVolumeMl);
}
function Jg(e) {
  return e.beverageType !== "mixed-drink" ? 0 : typeof e.mixerVolumeMl == "number" && Number.isFinite(e.mixerVolumeMl) ? Math.max(0, e.mixerVolumeMl) : fm(e.spiritVolumeMl ?? e.ethanolVolumeMl, e.mixerPartsPerSpiritPart ?? 0);
}
function $l(e) {
  return e.caffeineDoseMode === "mixer-derived" && e.beverageType === "mixed-drink" ? Jg(e) * Math.max(0, e.mixerCaffeineConcentrationMgPerMl ?? 0) : Math.max(0, e.caffeineMg);
}
function CM(e) {
  return typeof e.servings != "number" || !Number.isFinite(e.servings) ? 1 : Math.max(0, e.servings);
}
function Hp(e, t) {
  return typeof e.ethanolGrams == "number" ? Math.max(0, e.ethanolGrams) : jJ(Hm(e), e.abvPercent, t.ethanolDensityGPerMl);
}
function Ta(e, t) {
  return Hp(e, t) * CM(e);
}
function Na(e) {
  return $l(e) * CM(e);
}
const St = {
  bodyMassKg: 90,
  bodyCompositionMode: "default demographic TBW fraction",
  sexOrPhysiologyMode: "male default",
  ethanolEliminationMode: "Michaelis-Menten",
  ethanolVmaxMode: "reference-population",
  ethanolVmaxParameterState: "automatic",
  ethanolVmaxReferenceFfmKg: 60,
  ethanolClearanceModifier: 1,
  gastricEmptyingModifier: 1,
  ethanolToleranceModifier: 1,
  baselineAlertnessIndex: .5,
  caffeineToleranceModifier: 1,
  caffeineParameterMode: "direct effective half-life",
  referenceCaffeineHalfLifeH: 5,
  caffeineHalfLifeH: 5,
  caffeineAbsorptionModifier: 1,
  cyp1a2ActivityModifier: 1,
  simulationDurationH: 24,
  solverInternalStepMin: .5,
  timeStepMin: 5,
  customTBWFraction: .55,
  customApparentVdLPerKg: .6,
  sedativeToleranceModifier: 1,
  functionalToleranceModifier: 1,
  perceivedControlCalibration: 1,
  sleepDebtModifier: 1,
  foodState: "light meal",
  mealEvents: [],
  initialConditions: {
    gastricEthanolG: 0,
    intestinalEthanolG: 0,
    centralEthanolG: 0,
    caffeineGutMg: 0,
    caffeineCentralMg: 0,
    paraxanthineCentralMg: 0
  },
  legalBACThresholdGdL: .08,
  vehicleZeroToleranceThresholdGdL: .01,
  showSensitivityBands: !1,
  allowLeanFatResidualMass: !1
};
function bt(e = St.bodyMassKg) {
  return {
    ethanolDensityGPerMl: .789,
    gastricEmptyingRateFastedPerH: 2,
    gastricEmptyingRateLightMealPerH: .9,
    gastricEmptyingRateHeavyMealPerH: .35,
    gastricEmptyingRateCustomPerH: .75,
    gastricAbsorptionRatePerH: .25,
    intestinalAbsorptionRatePerH: 3,
    firstPassFractionFasted: .05,
    firstPassFractionLightMeal: .1,
    firstPassFractionHeavyMeal: .15,
    firstPassFractionCustom: .1,
    zeroOrderEliminationGdLPerH: .015,
    michaelisMentenVmaxGPerH: 6.31,
    michaelisMentenKmGdL: .003,
    referencePopulationVmaxGPerH: 6.31,
    referencePopulationVmaxBodyMassKg: 75,
    legacyVmaxGPerHPerKg: .1,
    totalBodyWaterFractionDefaultMale: .58,
    totalBodyWaterFractionDefaultFemale: .49,
    totalBodyWaterFractionCustom: .55,
    leanTissueWaterFraction: .73,
    adiposeTissueWaterFraction: .1,
    bloodWaterFraction: .806,
    customApparentVdLPerKg: .6,
    caffeineVdLPerKg: .6,
    caffeineAbsorptionRatePerH: 2.5,
    paraxanthineApproximationEnabled: !1,
    caffeineToParaxanthineFraction: .8,
    caffeineMolecularMassMgPerMmol: 194.19,
    paraxanthineMolecularMassMgPerMmol: 180.16,
    paraxanthineVdLPerKg: .7,
    paraxanthineHalfLifeH: 3.1,
    paraxanthineRelativePotency: .5,
    ethanolDoesNotReduceCaffeineDose: !0,
    caffeineDoesNotReduceBAC: !0,
    optionalEthanolInhibitsCaffeineClearance: !1,
    ethanolCYP1A2InhibitionImax: .25,
    ethanolCYP1A2InhibitionIC50GdL: .08,
    ethanolEC50GdL: .06,
    ethanolHill: 2,
    caffeineEC50MgL: 3,
    caffeineHill: 1.5
  };
}
function ST(e, t, n, a) {
  return Math.max(0, Math.min(t, a) - Math.max(e, n));
}
function CJ(e, t) {
  const n = e.startTimeH,
    a = e.durationMin / 60;
  if (a <= 0) return n < 0 ? {
    pre: 1,
    inside: 0,
    post: 0
  } : n <= t ? {
    pre: 0,
    inside: 1,
    post: 0
  } : {
    pre: 0,
    inside: 0,
    post: 1
  };
  const s = n + a,
    l = ST(n, s, Number.NEGATIVE_INFINITY, 0) / a,
    c = ST(n, s, 0, t) / a,
    d = Math.max(0, 1 - l - c);
  return {
    pre: l,
    inside: c,
    post: d
  };
}
function mB(e, t, n) {
  return e.map(a => {
    const s = CJ(a, n),
      l = Ta(a, t),
      c = Na(a);
    return {
      id: a.id,
      label: a.label,
      doseBasis: typeof a.ethanolGrams == "number" ? "direct ethanol mass" : "volume x ABV x density",
      scheduledEthanolG: l,
      preHorizonEthanolG: l * s.pre,
      inHorizonEthanolG: l * s.inside,
      postHorizonEthanolG: l * s.post,
      scheduledCaffeineMg: c,
      preHorizonCaffeineMg: c * s.pre,
      inHorizonCaffeineMg: c * s.inside,
      postHorizonCaffeineMg: c * s.post
    };
  });
}
function Ao(e) {
  return typeof e == "number" && Number.isFinite(e);
}
function wJ(e) {
  if (e.compositionEvidence) return e.compositionEvidence;
  if (Ao(e.leanMassKg)) return {
    kind: "user-measured",
    measurementMeaning: "fat-free-mass",
    value: e.leanMassKg,
    unit: "kg",
    basisPreference: "automatic",
    active: !0,
    formula: "TBW = FFM x 0.73 L/kg",
    coefficientSet: "FFM hydration 0.73 L/kg",
    status: "entered",
    warnings: []
  };
  if (Ao(e.bodyFatPercent)) return {
    kind: "body-fat-estimate",
    measurementMeaning: "n/a",
    value: e.bodyFatPercent,
    unit: "%",
    basisPreference: "automatic",
    active: !0,
    formula: "FFM = body mass x (1 - body-fat fraction); TBW = FFM x 0.73 L/kg",
    coefficientSet: "FFM hydration 0.73 L/kg",
    status: "entered",
    warnings: []
  };
}
function hB(e, t) {
  const n = e.bodyMassKg,
    a = wJ(e),
    s = e.bodyCompositionMode === "direct apparent Vd",
    l = e.bodyCompositionMode === "custom TBW litres",
    c = a?.measurementMeaning === "fat-free-mass" && a.unit === "kg",
    d = a?.kind === "body-fat-estimate" && a.unit === "%" ? a.value : e.bodyFatPercent;
  if (s) return {
    id: "direct-apparent-vd",
    label: "Direct apparent ethanol Vd",
    evidence: a,
    supersededBasisLabel: a ? "Entered body composition" : void 0,
    valid: Ao(e.customApparentVdLPerKg)
  };
  if (l) return {
    id: "measured-tbw",
    label: "Measured or user-entered TBW",
    evidence: a,
    supersededBasisLabel: a ? "Entered body composition" : void 0,
    valid: Ao(e.customTBWL)
  };
  if (c) {
    const f = a.value,
      h = Ao(f) && f > 0 && f < n;
    return {
      id: "fat-free-mass",
      label: "Entered fat-free mass",
      fatFreeMassKg: f,
      fatMassKg: Ao(e.fatMassKg) ? e.fatMassKg : n - f,
      bodyFatPercent: Ao(e.bodyFatPercent) ? e.bodyFatPercent : n > 0 ? (n - f) / n * 100 : void 0,
      evidence: a,
      supersededBasisLabel: e.bodyCompositionMode === "default demographic TBW fraction" ? "Sex-coded demographic fallback" : void 0,
      valid: h
    };
  }
  if (Ao(d)) {
    const f = n * (1 - d / 100),
      h = d >= 3 && d <= 70 && f > 0 && f < n;
    return {
      id: "body-fat-derived-ffm",
      label: "Body-fat-derived fat-free mass",
      fatFreeMassKg: f,
      fatMassKg: n - f,
      bodyFatPercent: d,
      evidence: a,
      supersededBasisLabel: e.bodyCompositionMode === "default demographic TBW fraction" ? "Sex-coded demographic fallback" : void 0,
      valid: h
    };
  }
  return e.bodyCompositionMode === "Watson anthropometric TBW" ? {
    id: "watson",
    label: "Watson anthropometric TBW",
    valid: !0
  } : e.bodyCompositionMode === "BMI-adjusted apparent distribution estimate" ? {
    id: "bmi-apparent-vd",
    label: "BMI-adjusted apparent Vd",
    valid: !0
  } : {
    id: "demographic-fallback",
    label: "Sex-coded demographic fallback",
    valid: !0
  };
}
function SJ(e) {
  return {
    bloodWaterFraction: e.bloodWaterFraction,
    warnings: []
  };
}
function AJ(e, t) {
  const n = hu(e.heightCm, 175),
    a = hu(e.ageYears, 35);
  return e.sexOrPhysiologyMode === "female default" ? {
    tbwL: -2.097 + .1069 * n + .2466 * t,
    formula: `Watson female: -2.097 + 0.1069 x ${n.toFixed(1)} cm + 0.2466 x ${t.toFixed(1)} kg`
  } : {
    tbwL: 2.447 - .09516 * a + .1074 * n + .3362 * t,
    formula: `Watson male: 2.447 - 0.09516 x ${a.toFixed(1)} y + 0.1074 x ${n.toFixed(1)} cm + 0.3362 x ${t.toFixed(1)} kg`
  };
}
function mm(e, t) {
  const n = Math.max(e.bodyMassKg || 0, 1e-4),
    a = SJ(t),
    s = hu(e.customApparentVdLPerKg, t.customApparentVdLPerKg),
    l = hB(e);
  if (l.id === "fat-free-mass" || l.id === "body-fat-derived-ffm") {
    const f = l.fatFreeMassKg ?? 0,
      h = l.fatMassKg ?? Math.max(0, n - f),
      p = l.bodyFatPercent ?? h / n * 100,
      v = f * t.leanTissueWaterFraction;
    return {
      ...a,
      calculationMode: "TBW-based",
      tbwL: v,
      tbwFraction: v / n,
      leanMassKg: f,
      fatMassKg: h,
      bodyFatPercent: p,
      formula: `TBW = FFM ${f.toFixed(2)} kg x hydration ${t.leanTissueWaterFraction.toFixed(3)} L/kg`,
      source: "FFM hydration prior; see provenance distribution.ffm_hydration",
      populationApplicability: "Adults for whom entered fat-free mass or adiposity is meaningful; hydration varies with age, illness and measurement method.",
      estimateStatus: "derived",
      uncertaintyNote: "Broad prediction only; FFM hydration is assumed and fat mass is not treated as a separate additive water compartment.",
      warnings: l.valid ? [] : ["Entered composition is incompatible with total body mass and must be corrected before calculation."],
      activeBasisId: l.id,
      activeBasisLabel: l.label,
      evidenceKind: l.evidence?.kind,
      measurementMeaning: l.evidence?.measurementMeaning,
      supersededBasisLabel: l.supersededBasisLabel
    };
  }
  if (l.id === "watson") {
    const f = AJ(e, n),
      h = Math.max(1, f.tbwL);
    return {
      ...a,
      calculationMode: "TBW-based",
      tbwL: h,
      tbwFraction: h / n,
      formula: f.formula,
      source: "Watson, Watson & Batt 1980; PMID 6986753",
      populationApplicability: "Adult anthropometric regression derived from 458 males and 265 females selected from dilution studies.",
      estimateStatus: "derived",
      uncertaintyNote: "Population regression; prediction error may be wider in unusual body composition, ancestry, disease or age extremes.",
      warnings: e.sexOrPhysiologyMode === "custom" ? ["Watson mode requires a sex-specific equation; custom physiology uses the male equation as an explicit fallback."] : [],
      activeBasisId: "watson",
      activeBasisLabel: l.label
    };
  }
  if (e.bodyCompositionMode === "custom TBW litres") {
    const f = hu(e.customTBWL, n * t.totalBodyWaterFractionCustom);
    return {
      ...a,
      calculationMode: "TBW-based",
      tbwL: f,
      tbwFraction: f / n,
      formula: `Direct TBW input: ${f.toFixed(2)} L`,
      source: "User-specified or measured input",
      populationApplicability: "Depends on the measurement or estimation method used by the user.",
      estimateStatus: "measured/custom",
      uncertaintyNote: "Uncertainty is inherited from the supplied TBW value.",
      activeBasisId: "measured-tbw",
      activeBasisLabel: l.label,
      supersededBasisLabel: l.supersededBasisLabel
    };
  }
  if (e.bodyCompositionMode === "direct apparent Vd") {
    const f = s;
    return {
      ...a,
      calculationMode: "apparent Vd-based",
      apparentVdLPerKg: f,
      apparentVdL: n * f,
      formula: `Direct apparent Vd: ${n.toFixed(1)} kg x ${f.toFixed(3)} L/kg`,
      source: "User-specified apparent distribution volume",
      populationApplicability: "Depends on the source and meaning of the supplied apparent Vd.",
      estimateStatus: "measured/custom",
      uncertaintyNote: "Apparent Vd is not true TBW and is used directly in the BAC conversion.",
      warnings: ["Using direct apparent ethanol distribution volume, not true total body water."],
      activeBasisId: "direct-apparent-vd",
      activeBasisLabel: l.label,
      supersededBasisLabel: l.supersededBasisLabel
    };
  }
  if (e.bodyCompositionMode === "BMI-adjusted apparent distribution estimate") {
    const f = hu(e.heightCm, 175) / 100,
      h = n / (f * f);
    let p = t.customApparentVdLPerKg,
      v = `Custom apparent Vd ${p.toFixed(3)} L/kg`;
    e.sexOrPhysiologyMode === "male default" ? (p = .8202 - .009 * h, v = `Maudens male: 0.8202 - 0.0090 x BMI ${h.toFixed(2)}`) : e.sexOrPhysiologyMode === "female default" && (p = .7772 - .0099 * h, v = `Maudens female: 0.7772 - 0.0099 x BMI ${h.toFixed(2)}`);
    const b = p;
    p = uB(p, .35, .8);
    const x = ["Using BMI-adjusted apparent ethanol distribution volume, not true total body water."];
    return (h < 16 || h > 36) && x.push("BMI lies outside the Maudens study range (16-36 kg/m2); regression extrapolation is not treated as validated."), Math.abs(b - p) > 1e-9 && x.push("Apparent Vd L/kg was clamped to the configured 0.35-0.80 range."), {
      ...a,
      calculationMode: "apparent Vd-based",
      apparentVdLPerKg: p,
      apparentVdL: n * p,
      bmi: h,
      formula: v,
      source: "Maudens et al. 2014; PMID 24846125",
      populationApplicability: "50 healthy fasted volunteers (23 men, 27 women), BMI 16-36 kg/m2.",
      estimateStatus: "derived",
      uncertaintyNote: "Population regression with reported prediction intervals; individual Vd may differ materially.",
      warnings: x,
      activeBasisId: "bmi-apparent-vd",
      activeBasisLabel: l.label
    };
  }
  let c = hu(e.customTBWFraction, t.totalBodyWaterFractionCustom);
  e.sexOrPhysiologyMode === "male default" ? c = t.totalBodyWaterFractionDefaultMale : e.sexOrPhysiologyMode === "female default" && (c = t.totalBodyWaterFractionDefaultFemale);
  const d = n * c;
  return {
    ...a,
    calculationMode: "TBW-based",
    tbwL: d,
    tbwFraction: c,
    formula: `Fallback TBW: ${n.toFixed(1)} kg x ${c.toFixed(3)} L/kg`,
    source: "Broad demographic engineering fallback",
    populationApplicability: "Use only when measured or anthropometric body-water information is unavailable.",
    estimateStatus: "assumed",
    uncertaintyNote: "High model-structure and interindividual uncertainty; this is not an individual measurement.",
    warnings: [e.sexOrPhysiologyMode === "custom" ? "Body composition unknown; using the supplied custom TBW fraction." : "Body composition unknown; using a broad sex-coded default TBW fraction."],
    activeBasisId: "demographic-fallback",
    activeBasisLabel: l.label
  };
}
function AT(e, t) {
  if (e.calculationMode === "TBW-based") {
    const a = (e.tbwL ?? 0) * t;
    return {
      ...e,
      tbwL: a,
      tbwFraction: typeof e.tbwFraction == "number" ? e.tbwFraction * t : void 0,
      uncertaintyNote: `${e.uncertaintyNote} Coordinated exposure-envelope factor ${t.toFixed(3)} applied.`
    };
  }
  const n = (e.apparentVdL ?? 0) * t;
  return {
    ...e,
    apparentVdL: n,
    apparentVdLPerKg: typeof e.apparentVdLPerKg == "number" ? e.apparentVdLPerKg * t : void 0,
    uncertaintyNote: `${e.uncertaintyNote} Coordinated exposure-envelope factor ${t.toFixed(3)} applied.`
  };
}
const Zt = 1e-10;
const wM = .002;
const pB = .05;
const SM = pB;
const Do = .01;
function Ux(e, t) {
  return e.reduce((n, a) => Math.max(n, Math.abs(t(a))), 0);
}
function qx(e, t) {
  const n = e.filter(t);
  if (n.length !== 0) return {
    startH: n[0].tH,
    endH: n[n.length - 1].tH
  };
}
function ET(e, t) {
  if (e.length !== 0) return e.reduce((n, a) => t(a) > t(n) ? a : n, e[0]).tH;
}
function Yv(e, t) {
  const n = e.filter(W => W.tH >= -Zt),
    a = n.length > 0 ? n : e,
    s = t.scheduledEthanolG > Zt,
    l = t.scheduledCaffeineMg > Zt,
    c = t.ethanolAdministeredThroughHorizonG > Zt,
    d = t.caffeineAdministeredThroughHorizonMg > Zt,
    f = t.inHorizonEthanolG > Zt,
    h = t.inHorizonCaffeineMg > Zt,
    p = Ux(a, W => Math.max(W.bacGdL, W.gastricEthanolG, W.intestinalEthanolG, W.centralEthanolG)) > Zt,
    v = Ux(a, W => Math.max(W.caffeineMgL, W.caffeineGutMg, W.caffeineCentralMg, W.paraxanthineCentralMg ?? 0)) > Zt,
    b = c || p,
    x = d || v,
    w = W => W.bacGdL >= wM || W.ethanolImpairmentIndex >= Do || W.ethanolStimulationIndex >= Do || W.ethanolSedationIndex >= Do,
    g = W => W.caffeineMgL >= SM || W.caffeineAlertnessIndex >= Do,
    C = qx(a, w),
    S = qx(a, g),
    k = !!C,
    E = !!S,
    O = qx(a, W => w(W) && g(W)),
    A = Ux(a, W => !w(W) || !g(W) ? 0 : Math.max(Math.min(1, W.bacGdL / .05), W.ethanolImpairmentIndex, W.ethanolStimulationIndex, W.ethanolSedationIndex) * W.caffeineAlertnessIndex),
    N = O ? O.endH - O.startH : 0,
    T = b && x && !!O && (A >= .015 || N >= 1 / 12),
    D = ET(a, W => W.bacGdL),
    V = ET(a, W => W.caffeineMgL),
    G = typeof D == "number" && typeof V == "number" ? Math.abs(D - V) : void 0;
  return !b && !x ? {
    kind: "none",
    scheduledEthanolInput: s,
    scheduledCaffeineInput: l,
    administeredEthanolInput: c,
    administeredCaffeineInput: d,
    ethanolResidualPresent: p,
    caffeineResidualPresent: v,
    ethanolPharmacologicallyActive: k,
    caffeinePharmacologicallyActive: E,
    ethanolPresent: !1,
    caffeinePresent: !1,
    meaningfulOverlap: !1,
    maxOverlapScore: 0,
    label: "No modeled exposure"
  } : !k && !E && !f && !h ? {
    kind: "historical-trace",
    scheduledEthanolInput: s,
    scheduledCaffeineInput: l,
    administeredEthanolInput: c,
    administeredCaffeineInput: d,
    ethanolResidualPresent: p,
    caffeineResidualPresent: v,
    ethanolPharmacologicallyActive: k,
    caffeinePharmacologicallyActive: E,
    ethanolPresent: b,
    caffeinePresent: x,
    meaningfulOverlap: !1,
    maxOverlapScore: 0,
    label: "Historical trace / negligible residual"
  } : b && !x ? {
    kind: "ethanol-only",
    scheduledEthanolInput: s,
    scheduledCaffeineInput: l,
    administeredEthanolInput: c,
    administeredCaffeineInput: d,
    ethanolResidualPresent: p,
    caffeineResidualPresent: v,
    ethanolPharmacologicallyActive: k,
    caffeinePharmacologicallyActive: E,
    ethanolPresent: !0,
    caffeinePresent: !1,
    meaningfulOverlap: !1,
    maxOverlapScore: 0,
    ethanolActiveWindow: C,
    label: "Ethanol only"
  } : !b && x ? {
    kind: "caffeine-only",
    scheduledEthanolInput: s,
    scheduledCaffeineInput: l,
    administeredEthanolInput: c,
    administeredCaffeineInput: d,
    ethanolResidualPresent: p,
    caffeineResidualPresent: v,
    ethanolPharmacologicallyActive: k,
    caffeinePharmacologicallyActive: E,
    ethanolPresent: !1,
    caffeinePresent: !0,
    meaningfulOverlap: !1,
    maxOverlapScore: 0,
    caffeineActiveWindow: S,
    label: "Caffeine only"
  } : {
    kind: T ? "combined-overlap" : "combined-sequential",
    scheduledEthanolInput: s,
    scheduledCaffeineInput: l,
    administeredEthanolInput: c,
    administeredCaffeineInput: d,
    ethanolResidualPresent: p,
    caffeineResidualPresent: v,
    ethanolPharmacologicallyActive: k,
    caffeinePharmacologicallyActive: E,
    ethanolPresent: !0,
    caffeinePresent: !0,
    meaningfulOverlap: T,
    maxOverlapScore: A,
    peakSeparationH: G,
    ethanolActiveWindow: C,
    caffeineActiveWindow: S,
    overlapWindow: T ? O : void 0,
    label: T ? "Combined exposure with meaningful overlap" : "Combined input with sequential effects"
  };
}
function Xv(e, t, n) {
  const a = e.ethanolVmaxParameterState;
  if (a === "user-overridden" || a === "preset-specified" || e.ethanolVmaxMode === "direct") {
    const s = e.ethanolVmaxOverrideGPerH ?? t.michaelisMentenVmaxGPerH;
    return {
      valueGPerH: s,
      mode: "direct",
      parameterState: a,
      formula: `Direct Vmax ${s.toFixed(3)} g/h`,
      evidenceStatus: a === "user-overridden" ? "user-specified" : "preset-specified",
      detachedFromAutomaticScaling: !0
    };
  }
  if (e.ethanolVmaxMode === "FFM-scaled exploratory") {
    const s = n.leanMassKg ?? e.leanMassKg ?? e.bodyMassKg,
      l = Math.max(1, e.ethanolVmaxReferenceFfmKg);
    return {
      valueGPerH: t.referencePopulationVmaxGPerH * (s / l),
      mode: e.ethanolVmaxMode,
      parameterState: "automatic",
      formula: `${t.referencePopulationVmaxGPerH.toFixed(3)} g/h x FFM ${s.toFixed(2)} / reference FFM ${l.toFixed(2)}`,
      evidenceStatus: "exploratory allometric-style scaling; reference FFM is user-visible and not a fitted coefficient",
      detachedFromAutomaticScaling: !1
    };
  }
  return e.ethanolVmaxMode === "total-mass-scaled legacy" ? {
    valueGPerH: e.bodyMassKg * t.legacyVmaxGPerHPerKg,
    mode: e.ethanolVmaxMode,
    parameterState: "automatic",
    formula: `${e.bodyMassKg.toFixed(2)} kg x ${t.legacyVmaxGPerHPerKg.toFixed(3)} g/h/kg`,
    evidenceStatus: "legacy compatibility scaling; not preferred mechanistic covariate",
    detachedFromAutomaticScaling: !1
  } : {
    valueGPerH: t.referencePopulationVmaxGPerH,
    mode: "reference-population",
    parameterState: "automatic",
    formula: `Reference-population Vmax ${t.referencePopulationVmaxGPerH.toFixed(3)} g/h`,
    evidenceStatus: "primary fitted population parameter; PMID 36688276",
    detachedFromAutomaticScaling: !1
  };
}
function EJ(e) {
  const {
      bacGdL: t,
      bacRateGdLPerH: n,
      caffeineMgL: a,
      paraxanthineRelativeConc: s,
      subject: l,
      constants: c
    } = e,
    d = t > 1e-12,
    f = d ? t ** c.ethanolHill / (c.ethanolEC50GdL ** c.ethanolHill + t ** c.ethanolHill || 1) : 0,
    h = Bi(f),
    p = Math.tanh(n / .01),
    v = Bi((p + 1) / 2),
    b = Bi((1 - p) / 2),
    x = Math.exp(-.0012250000000000002 / (2 * .025 ** 2)),
    w = d ? Math.max(0, Math.exp(-((t - .035) ** 2) / (2 * .025 ** 2)) - x) : 0,
    g = Bi((t - .08) / .08),
    C = d ? Bi((.45 * w + .2 * v) * (1 - g)) : 0,
    S = d ? Bi(((t / .12) ** 2 + .15 * b) / Math.max(.25, l.sedativeToleranceModifier)) : 0,
    k = Math.max(0, a) + c.paraxanthineRelativePotency * Math.max(0, s ?? 0),
    E = k > 1e-12 ? k ** c.caffeineHill / (c.caffeineEC50MgL ** c.caffeineHill + k ** c.caffeineHill || 1) : 0,
    O = k > 1e-12 ? Bi(E / l.caffeineToleranceModifier) : 0,
    A = Bi(l.baselineAlertnessIndex ?? .5),
    N = d || k > 1e-12,
    T = N ? Bi(A + .35 * O + .2 * C - .35 * S) : 0,
    D = N ? Bi(Bi(.75 + .25 * (A - .5) + .25 * O + .15 * C - .45 * h - .25 * S) * l.perceivedControlCalibration) : 0,
    V = Bi(h * (.5 * T + .5 * D));
  return {
    ethanolImpairmentIndex: h,
    ethanolSedationIndex: S,
    ethanolStimulationIndex: C,
    caffeineAlertnessIndex: O,
    combinedAlertnessIndex: T,
    perceivedControlIndex: D,
    mismatchIndex: V
  };
}
function kJ(e, t) {
  return e < t ? "Below vehicle reference threshold" : "At or above vehicle reference threshold";
}
function PJ(e, t) {
  return e < t ? "Below configured comparison threshold; vehicle reference threshold is evaluated separately" : "At or above configured comparison threshold";
}
// v1.0.1 maintenance algorithms. Embedded in the same pure kernel in host and worker.
function maintenanceMax(values) {
  let value = -Infinity;
  for (const item of values) value = Math.max(value, item);
  return value;
}
function maintenanceMin(values) {
  let value = Infinity;
  for (const item of values) value = Math.min(value, item);
  return value;
}
function maintenanceThresholdIntervals(points, threshold, key = 'bacGdL') {
  const crossings = [], intervals = [];
  if (!points.length) return {status:'not-evaluable', threshold, crossings, intervals};
  const first = points[0], last = points[points.length - 1];
  const aboveAtStart = first[key] >= threshold;
  let startH = aboveAtStart ? first.tH : undefined;
  for (let i = 1; i < points.length; i++) {
    const a=points[i-1], b=points[i], aboveA=a[key]>=threshold, aboveB=b[key]>=threshold;
    if (aboveA === aboveB) continue;
    const fraction = (threshold-a[key])/(b[key]-a[key]);
    const timeH=a.tH+Math.max(0,Math.min(1,fraction))*(b.tH-a.tH);
    crossings.push({direction:aboveB?'up':'down',timeH});
    if (aboveB) startH=timeH;
    else { intervals.push({startH:startH??a.tH,endH:timeH,leftCensored:aboveAtStart&&intervals.length===0,rightCensored:false}); startH=undefined; }
  }
  const rightCensored=last[key]>=threshold;
  if(rightCensored) intervals.push({startH:startH??first.tH,endH:last.tH,leftCensored:aboveAtStart&&intervals.length===0,rightCensored:true});
  const downward=crossings.filter(c=>c.direction==='down');
  const finalReturnH=!rightCensored ? downward.at(-1)?.timeH : undefined;
  const status=intervals.length===0?'never-exceeded':aboveAtStart?(rightCensored?'above-at-start-not-returned':'above-at-start-returned'):(rightCensored?'crossed-not-returned':'crossed-returned');
  return {status,threshold,timeH:finalReturnH,firstReturnH:downward[0]?.timeH,finalReturnH,
    lastObservedReturnH:downward.at(-1)?.timeH,crossings,intervals,rightCensored,
    recrossingCount:Math.max(0,intervals.length-1),horizonH:last.tH,scope:'configured schedule within modeled horizon'};
}
function maintenanceRollingIntake(events, constants, horizonH, windowH) {
  const prepared=events.map(e=>({start:e.startTimeH,end:e.startTimeH+Math.max(0,e.durationMin)/60,
    duration:Math.max(0,e.durationMin)/60,ethanol:Ta(e,constants),caffeine:Na(e)}));
  const candidates=new Set([0,horizonH]);
  for(const e of prepared) for(const t of [e.start,e.end,e.start+windowH,e.end+windowH]) if(t>=0&&t<=horizonH)candidates.add(t);
  let ethanolG=0,caffeineMg=0,combined=false;
  for(const end of candidates){
    const start=end-windowH;
    let ethanol=0,caffeine=0;
    for(const e of prepared){
      const fraction=e.duration===0?(e.start>start&&e.start<=end?1:0):Math.max(0,Math.min(end,e.end)-Math.max(start,e.start))/e.duration;
      ethanol+=e.ethanol*fraction;caffeine+=e.caffeine*fraction;
    }
    ethanolG=Math.max(ethanolG,ethanol);caffeineMg=Math.max(caffeineMg,caffeine);
    if(ethanol>80&&caffeine>200)combined=true;
  }
  return {windowH,ethanolG,caffeineMg,combined,scope:'rolling window ending within modeled horizon'};
}
function maintenanceRefinedPeak(points,index,key){
  const p=points[index];
  if(index===0||index===points.length-1)return {value:p[key],tH:p.tH};
  const a=points[index-1],b=points[index+1],d=a.tH,f=p.tH,h=b.tH;
  const denominator=(d-f)*(d-h)*(f-h);
  if(Math.abs(denominator)<an)return {value:p[key],tH:f};
  const w=(h*(p[key]-a[key])+f*(a[key]-b[key])+d*(b[key]-p[key]))/denominator;
  const g=(h*h*(a[key]-p[key])+f*f*(b[key]-a[key])+d*d*(p[key]-b[key]))/denominator;
  if(Math.abs(w)<an)return {value:p[key],tH:f};
  const tH=-g/(2*w);
  if(tH<d||tH>h)return {value:p[key],tH:f};
  return {value:Math.max(p[key],w*tH*tH+g*tH+(a[key]-w*d*d-g*d)),tH};
}
const an = 1e-10;
function TJ() {
  return {
    gastricEthanolG: 0,
    intestinalEthanolG: 0,
    centralEthanolG: 0,
    eliminatedEthanolG: 0,
    firstPassEthanolG: 0,
    systemicallyAbsorbedEthanolG: 0,
    cumulativeEthanolAdministeredG: 0,
    caffeineGutMg: 0,
    caffeineCentralMg: 0,
    paraxanthineCentralMg: 0,
    cumulativeCaffeineAdministeredMg: 0,
    cumulativeCaffeineEliminatedMg: 0,
    cumulativeCaffeineNotRoutedMg: 0,
    cumulativeParaxanthineEliminatedMg: 0
  };
}
function Wx(e, t, n) {
  const a = {};
  for (const s of Object.keys(e)) a[s] = e[s] + t[s] * n;
  return a;
}
function NJ(e, t, n, a, s, l) {
  const c = {};
  for (const d of Object.keys(e)) c[d] = e[d] + l / 6 * (t[d] + 2 * n[d] + 2 * a[d] + s[d]);
  return c;
}
function OJ(e, t) {
  return e.map((n, a) => {
    const s = n.durationMin / 60;
    return {
      event: n,
      ethanolG: Ta(n, t),
      caffeineMg: Na(n),
      startH: n.startTimeH,
      endH: n.startTimeH + Math.max(0, s),
      durationH: Math.max(0, s),
      bolus: s <= 0,
      key: `${n.id}:${a}`
    };
  }).sort((n, a) => n.startH - a.startH || n.endH - a.endH || n.key.localeCompare(a.key));
}
function IJ(e) {
  return e.filter(t => !!t.foodOverride).map((t, n) => ({
    id: `dose-food-${t.id}-${n}`,
    label: `${t.label} food tag`,
    startTimeH: t.startTimeH,
    durationH: Math.max(t.durationMin / 60, 4),
    foodState: t.foodOverride,
    gastricEmptyingModifier: 1
  }));
}
function DJ(e, t) {
  return [...(e.mealEvents ?? []), ...IJ(t)].sort((n, a) => n.startTimeH - a.startTimeH || n.id.localeCompare(a.id));
}
function AM(e, t, n) {
  const a = t.filter(l => n >= l.startTimeH - an && n < l.startTimeH + l.durationH - an);
  if (a.length === 0) return {
    foodState: e.foodState,
    gastricModifier: 1
  };
  const s = a[0];
  return {
    foodState: s.foodState,
    gastricModifier: s.gastricEmptyingModifier,
    firstPassFraction: s.firstPassFraction
  };
}
function EM(e, t) {
  let n = 0,
    a = 0;
  for (const s of e) s.bolus || t < s.startH - an || t >= s.endH - an || (n += s.ethanolG / s.durationH, a += s.caffeineMg / s.durationH);
  return {
    ethanolGPerH: n,
    caffeineMgPerH: a
  };
}
function _J(e) {
  return e.caffeineParameterMode === "reference clearance plus CYP1A2 covariate" ? Math.log(2) / Math.max(.1, e.referenceCaffeineHalfLifeH) * Math.max(.01, e.cyp1a2ActivityModifier) : Math.log(2) / Math.max(.1, e.caffeineHalfLifeH);
}
function Pf(e) {
  const {
      state: t,
      tH: n,
      subject: a,
      constants: s,
      distribution: l,
      doses: c,
      meals: d,
      vmaxGPerH: f,
      forcing: h,
      absorptionContext: p
    } = e,
    v = h ?? EM(c, n),
    b = p ?? AM(a, d, n),
    x = MM(b.foodState, s),
    g = x.gastricEmptyingRatePerH * a.gastricEmptyingModifier * b.gastricModifier * t.gastricEthanolG,
    C = s.gastricAbsorptionRatePerH * t.gastricEthanolG,
    S = s.intestinalAbsorptionRatePerH * t.intestinalEthanolG,
    k = C + S,
    E = Math.max(0, Math.min(.95, b.firstPassFraction ?? x.firstPassFraction)),
    O = k * E,
    A = k - O,
    N = dB(t.centralEthanolG, l);
  let T = 0;
  a.ethanolEliminationMode !== "zero-order" && (T = f * (N / (Math.max(an, s.michaelisMentenKmGdL) + N)), T *= a.ethanolClearanceModifier);
  const D = s.caffeineAbsorptionRatePerH * a.caffeineAbsorptionModifier * t.caffeineGutMg;
  let V = _J(a);
  if (s.optionalEthanolInhibitsCaffeineClearance) {
    const ue = 1 - s.ethanolCYP1A2InhibitionImax * N / (Math.max(an, s.ethanolCYP1A2InhibitionIC50GdL) + N);
    V *= Math.max(.5, Math.min(1, ue));
  }
  const G = V * t.caffeineCentralMg,
    W = s.paraxanthineApproximationEnabled ? Math.max(0, Math.min(1, s.caffeineToParaxanthineFraction)) : 0,
    $ = G * W * (s.paraxanthineMolecularMassMgPerMmol / s.caffeineMolecularMassMgPerMmol),
    ne = Math.log(2) / Math.max(.1, s.paraxanthineHalfLifeH) * t.paraxanthineCentralMg;
  return {
    gastricEthanolG: v.ethanolGPerH - g - C,
    intestinalEthanolG: g - S,
    centralEthanolG: A - T,
    eliminatedEthanolG: T,
    firstPassEthanolG: O,
    systemicallyAbsorbedEthanolG: A,
    cumulativeEthanolAdministeredG: v.ethanolGPerH,
    caffeineGutMg: v.caffeineMgPerH - D,
    caffeineCentralMg: D - G,
    paraxanthineCentralMg: $ - ne,
    cumulativeCaffeineAdministeredMg: v.caffeineMgPerH,
    cumulativeCaffeineEliminatedMg: G,
    cumulativeCaffeineNotRoutedMg: G * (1 - W),
    cumulativeParaxanthineEliminatedMg: ne
  };
}
function BJ(e) {
  const {
      state: t,
      tH: n,
      dtH: a
    } = e,
    s = {
      ...e
    },
    l = n + a / 2,
    c = EM(e.doses, l),
    d = AM(e.subject, e.meals, l),
    f = {
      ...t
    };
  if (e.subject.ethanolEliminationMode === "zero-order") {
    const k = qv(e.constants.zeroOrderEliminationGdLPerH, e.distribution) * e.subject.ethanolClearanceModifier * (a / 2),
      E = Math.min(Math.max(0, f.centralEthanolG), Math.max(0, k));
    f.centralEthanolG -= E, f.eliminatedEthanolG += E;
  }
  const h = {
      ...s,
      forcing: c,
      absorptionContext: d
    },
    p = Pf({
      ...h,
      state: f,
      tH: n
    }),
    v = Wx(f, p, a / 2),
    b = Pf({
      ...h,
      state: v,
      tH: l
    }),
    x = Wx(f, b, a / 2),
    w = Pf({
      ...h,
      state: x,
      tH: l
    }),
    g = Wx(f, w, a),
    C = Pf({
      ...h,
      state: g,
      tH: n + a
    }),
    S = NJ(f, p, b, w, C, a);
  if (e.subject.ethanolEliminationMode === "zero-order") {
    const k = qv(e.constants.zeroOrderEliminationGdLPerH, e.distribution) * e.subject.ethanolClearanceModifier * (a / 2),
      E = Math.min(Math.max(0, S.centralEthanolG), Math.max(0, k));
    S.centralEthanolG -= E, S.eliminatedEthanolG += E;
  }
  return S;
}
function LJ(e) {
  const t = ["gastricEthanolG", "intestinalEthanolG", "centralEthanolG", "caffeineGutMg", "caffeineCentralMg", "paraxanthineCentralMg"];
  let n = 0;
  const a = {
    ...e
  };
  for (const s of t) a[s] < -1e-9 && (n += 1), a[s] = Math.max(0, a[s]);
  return {
    state: a,
    negatives: n
  };
}
function PT(state,doses,time,applied) {
  for(const dose of doses)if(dose.bolus&&!applied.has(dose.key)&&dose.startH===time){
    state.gastricEthanolG+=dose.ethanolG;state.cumulativeEthanolAdministeredG+=dose.ethanolG;
    state.caffeineGutMg+=dose.caffeineMg;state.cumulativeCaffeineAdministeredMg+=dose.caffeineMg;applied.add(dose.key);
  }
}
function TT(e, t) {
  const n = t.initialConditions;
  e.gastricEthanolG += n.gastricEthanolG, e.intestinalEthanolG += n.intestinalEthanolG, e.centralEthanolG += n.centralEthanolG, e.caffeineGutMg += n.caffeineGutMg, e.caffeineCentralMg += n.caffeineCentralMg, e.paraxanthineCentralMg += n.paraxanthineCentralMg;
}
function $J(e, t) {
  let n = 0,
    a = 0;
  for (const s of e) {
    const l = s.bolus ? t >= s.startH ? 1 : 0 : Math.max(0, Math.min(1, (t - s.startH) / Math.max(an, s.durationH)));
    n += s.ethanolG * l, a += s.caffeineMg * l;
  }
  return {
    ethanolG: n,
    caffeineMg: a
  };
}
function RJ(e) {
  return e.calculationMode === "TBW-based" ? (e.tbwL ?? 0) > 0 ? e.bloodWaterFraction / (10 * (e.tbwL ?? 1)) : 0 : (e.apparentVdL ?? 0) > 0 ? 1 / (10 * (e.apparentVdL ?? 1)) : 0;
}
function NT(e) {
  const {
      tH: t,
      state: n,
      subject: a,
      constants: s,
      distribution: l
    } = e,
    c = dB(n.centralEthanolG, l),
    d = EM(e.doses, t + 1e-12),
    f = AM(a, e.meals, t + 1e-12);
  let p = Pf({
    state: n,
    tH: t,
    subject: a,
    constants: s,
    distribution: l,
    doses: e.doses,
    meals: e.meals,
    vmaxGPerH: e.vmaxGPerH,
    forcing: d,
    absorptionContext: f
  }).centralEthanolG;
  if (a.ethanolEliminationMode === "zero-order") {
    const T = qv(s.zeroOrderEliminationGdLPerH, l) * a.ethanolClearanceModifier;
    p -= n.centralEthanolG > an ? T : Math.min(Math.max(0, p), T);
  }
  const v = p * RJ(l),
    b = a.bodyMassKg * s.caffeineVdLPerKg,
    x = a.bodyMassKg * s.paraxanthineVdLPerKg,
    w = n.caffeineCentralMg / Math.max(an, b),
    g = s.paraxanthineApproximationEnabled ? n.paraxanthineCentralMg / Math.max(an, x) : void 0,
    C = EJ({
      bacGdL: c,
      bacRateGdLPerH: v,
      caffeineMgL: w,
      paraxanthineRelativeConc: g,
      subject: a,
      constants: s
    }),
    S = e.initialEthanolG + n.cumulativeEthanolAdministeredG - n.gastricEthanolG - n.intestinalEthanolG - n.centralEthanolG - n.eliminatedEthanolG - n.firstPassEthanolG,
    k = (n.paraxanthineCentralMg + n.cumulativeParaxanthineEliminatedMg) * (s.caffeineMolecularMassMgPerMmol / s.paraxanthineMolecularMassMgPerMmol),
    E = e.initialCaffeineEquivalentMg + n.cumulativeCaffeineAdministeredMg - n.caffeineGutMg - n.caffeineCentralMg - n.cumulativeCaffeineNotRoutedMg - k,
    O = $J(e.doses, t),
    A = e.initialEthanolG + O.ethanolG - n.gastricEthanolG - n.intestinalEthanolG - n.centralEthanolG - n.eliminatedEthanolG - n.firstPassEthanolG,
    N = e.initialCaffeineEquivalentMg + O.caffeineMg - n.caffeineGutMg - n.caffeineCentralMg - n.cumulativeCaffeineNotRoutedMg - k;
  return {
    tH: t,
    gastricEthanolG: n.gastricEthanolG,
    intestinalEthanolG: n.intestinalEthanolG,
    centralEthanolG: n.centralEthanolG,
    eliminatedEthanolG: n.eliminatedEthanolG,
    firstPassEthanolG: n.firstPassEthanolG,
    bacGdL: c,
    caffeineGutMg: n.caffeineGutMg,
    caffeineCentralMg: n.caffeineCentralMg,
    caffeineMgL: w,
    paraxanthineCentralMg: s.paraxanthineApproximationEnabled ? n.paraxanthineCentralMg : void 0,
    paraxanthineRelativeConc: g,
    ethanolInputGThisStep: 0,
    caffeineInputMgThisStep: 0,
    bacRateGdLPerH: v,
    vehicleWarningLevel: kJ(c, a.vehicleZeroToleranceThresholdGdL),
    legalWarningLevel: PJ(c, a.legalBACThresholdGdL),
    ethanolMassBalanceResidualG: A,
    caffeineMassBalanceResidualMg: N,
    expectedCumulativeEthanolAdministeredG: O.ethanolG,
    numericallyIntegratedCumulativeEthanolG: n.cumulativeEthanolAdministeredG,
    ethanolInputDeliveryResidualG: n.cumulativeEthanolAdministeredG - O.ethanolG,
    ethanolInternalMassBalanceResidualG: S,
    expectedCumulativeCaffeineAdministeredMg: O.caffeineMg,
    numericallyIntegratedCumulativeCaffeineMg: n.cumulativeCaffeineAdministeredMg,
    caffeineInputDeliveryResidualMg: n.cumulativeCaffeineAdministeredMg - O.caffeineMg,
    caffeineInternalMassBalanceResidualMg: E,
    cumulativeCaffeineEliminatedMg: n.cumulativeCaffeineEliminatedMg,
    cumulativeCaffeineNotRoutedMg: n.cumulativeCaffeineNotRoutedMg,
    cumulativeParaxanthineEliminatedMg: n.cumulativeParaxanthineEliminatedMg,
    ...C
  };
}
function HJ(start,horizon,doses,meals) {
  const boundaries=new Set([start,0,horizon]);
  for(const d of doses){boundaries.add(d.startH);boundaries.add(d.endH);}
  for(const m of meals){boundaries.add(m.startTimeH);boundaries.add(m.startTimeH+m.durationH);}
  return [...boundaries].filter(t=>Number.isFinite(t)&&t>=start&&t<=horizon).sort((a,b)=>a-b);
}
function FJ(e, t, n) {
  return e + (t - e) * n;
}
function zJ(e, t, n) {
  if (n === t.tH) return {...t};
  if (n === e.tH || t.tH === e.tH) return {
    ...e,
    tH: n
  };
  const a = (n - e.tH) / (t.tH - e.tH),
    s = {
      ...e,
      tH: n
    };
  for (const l of Object.keys(e)) {
    if (l === "tH" || l === "vehicleWarningLevel" || l === "legalWarningLevel") continue;
    const c = e[l],
      d = t[l];
    typeof c == "number" && typeof d == "number" && (s[l] = FJ(c, d, a));
  }
  return s.vehicleWarningLevel = a < .5 ? e.vehicleWarningLevel : t.vehicleWarningLevel, s.legalWarningLevel = a < .5 ? e.legalWarningLevel : t.legalWarningLevel, s;
}
function VJ(e, t, n) {
  if (e.length === 0) return [];
  const a = n / 60,
    s = [];
  for (let d = 0; d < t - an; d += a) s.push(Number(d.toFixed(10)));
  s.push(t);
  const l = [];
  let c = 0;
  for (const d of s) {
    for (; c + 1 < e.length && e[c + 1].tH < d;) c += 1;
    const f = e[c],
      h = e[Math.min(e.length - 1, c + 1)];
    l.push(zJ(f, h, d));
  }
  return l;
}
function OT(e, t) {
  let n = 0;
  for (let a = 1; a < e.length; a += 1) {
    const s = e[a - 1],
      l = e[a];
    n += (s[t] + l[t]) / 2 * (l.tH - s.tH);
  }
  return n;
}
function IT(points,key){
  if(!points.length)return {value:0,tH:0,tiedPeakCount:0,tiedPeakTimesH:[]};
  let index=0;
  for(let i=1;i<points.length;i++)if(points[i][key]>points[index][key])index=i;
  let global=maintenanceRefinedPeak(points,index,key);
  if(global.value===0)return {...global,tiedPeakCount:1,tiedPeakTimesH:[global.tH]};
  const localPeaks=[];
  for(let i=0;i<points.length;i++){
    const v=points[i][key];
    if(v<=0)continue;
    if(i>0&&v<points[i-1][key]||i+1<points.length&&v<points[i+1][key])continue;
    const peak=maintenanceRefinedPeak(points,i,key);
    localPeaks.push(peak);
    if(peak.value>global.value)global=peak;
  }
  const tolerance=1e-12+Math.abs(global.value)*1e-6,candidates=localPeaks.filter(p=>global.value-p.value<=tolerance);
  const representative=candidates[0]??global;
  return {value:global.value,tH:representative.tH,representativeValue:representative.value,
    tiedPeakCount:candidates.length||1,tiedPeakTimesH:candidates.length?candidates.map(p=>p.tH):[global.tH],
    equivalenceTolerance:tolerance,selectionPolicy:'earliest local peak within 1 ppm plus 1e-12 concentration of global maximum'};
}
function DT(points,peakH,threshold){
  const outcome=maintenanceThresholdIntervals(points,threshold);
  return {...outcome,firstReturnAfterPeakH:outcome.crossings.find(c=>c.direction==='down'&&c.timeH>=peakH)?.timeH};
}
function jo(e, t) {
  return e.reduce((n, a) => n + (typeof a[t] == "number" ? a[t] : 0), 0);
}
function GJ(e, t, n, a) {
  const s = IT(e, "bacGdL"),
    l = IT(e, "caffeineMgL"),
    c = jo(n, "scheduledEthanolG"),
    d = jo(n, "inHorizonEthanolG"),
    f = jo(n, "scheduledCaffeineMg"),
    h = jo(n, "inHorizonCaffeineMg"),
    p = e[e.length - 1],
    v = DT(e, s.tH, a.vehicleZeroToleranceThresholdGdL),
    b = DT(e, s.tH, a.legalBACThresholdGdL),
    x = jo(n, "preHorizonEthanolG"),
    w = jo(n, "preHorizonCaffeineMg");
  return {
    peakBACGdL: s.value,
    timeOfPeakBACH: s.tH,
    bacPeakSelection: s,
    caffeinePeakSelection: l,
    negligibleThresholdOutcome: DT(e,s.tH,wM),
    caffeineDisplayThresholdOutcome: maintenanceThresholdIntervals(e,pB,"caffeineMgL"),
    horizonH: a.simulationDurationH,
    scheduleScope: "configured schedule within modeled horizon",
    peakCaffeineMgL: l.value,
    timeOfPeakCaffeineH: l.tH,
    bacBelowVehicleAfterPeakH: v.timeH,
    bacBelowLegalAfterPeakH: b.timeH,
    vehicleThresholdOutcome: v,
    legalThresholdOutcome: b,
    maxImpairmentIndex: maintenanceMax(e.map(g => g.ethanolImpairmentIndex)),
    maxAlertnessIndex: maintenanceMax(e.map(g => g.combinedAlertnessIndex)),
    maxMismatchIndex: maintenanceMax(e.map(g => g.mismatchIndex)),
    bacAucGdLH: OT(e, "bacGdL"),
    caffeineAucMgHL: OT(e, "caffeineMgL"),
    scheduledEthanolG: c,
    inHorizonEthanolG: d,
    preHorizonEthanolG: x,
    postHorizonEthanolG: jo(n, "postHorizonEthanolG"),
    totalEthanolG: d,
    totalUkUnits: d / 8,
    totalCaffeineMg: h,
    scheduledCaffeineMg: f,
    inHorizonCaffeineMg: h,
    preHorizonCaffeineMg: w,
    postHorizonCaffeineMg: jo(n, "postHorizonCaffeineMg"),
    caffeineAdministeredThroughHorizonMg: w + h,
    ethanolAdministeredThroughHorizonG: x + d,
    numericallyIntegratedEthanolG: t.cumulativeEthanolAdministeredG,
    numericallyIntegratedCaffeineMg: t.cumulativeCaffeineAdministeredMg,
    ethanolInputDeliveryResidualG: t.cumulativeEthanolAdministeredG - (x + d),
    caffeineInputDeliveryResidualMg: t.cumulativeCaffeineAdministeredMg - (w + h),
    systemicallyAbsorbedEthanolG: t.systemicallyAbsorbedEthanolG,
    firstPassRemovedEthanolG: t.firstPassEthanolG,
    eliminatedEthanolG: t.eliminatedEthanolG,
    currentEthanolBurdenG: t.gastricEthanolG + t.intestinalEthanolG + t.centralEthanolG,
    finalBACGdL: p.bacGdL,
    finalCaffeineMgL: p.caffeineMgL
  };
}
function yf(e, t, n, a, s) {
  const l = OJ(t, n),
    c = DJ(e, t),
    d = l.reduce((V, G) => Math.min(V, G.startH), 0),
    f = c.reduce((V, G) => Math.min(V, G.startTimeH), 0),
    h = Math.min(0, d, f),
    p = HJ(h, e.simulationDurationH, l, c),
    v = mB(t, n, e.simulationDurationH),
    b = Xv(e, n, a),
    x = e.initialConditions,
    w = x.gastricEthanolG + x.intestinalEthanolG + x.centralEthanolG,
    g = x.caffeineGutMg + x.caffeineCentralMg + x.paraxanthineCentralMg * (n.caffeineMolecularMassMgPerMmol / n.paraxanthineMolecularMassMgPerMmol);
  let C = TJ(),
    S = h,
    k = !1,
    E = 0;
  const O = new Set(),
    A = [];
  let N = 0;
  for (; N < p.length && p[N] <= S;) N += 1;
  S === 0 && (TT(C, e), k = !0), PT(C, l, S, O), S >= -an && A.push(NT({
    tH: 0,
    state: C,
    subject: e,
    constants: n,
    distribution: a,
    doses: l,
    meals: c,
    vmaxGPerH: b.valueGPerH,
    initialEthanolG: w,
    initialCaffeineEquivalentMg: g
  }));
  const T = s / 60;
  for (; S < e.simulationDurationH;) {
    const V = p[N] ?? e.simulationDurationH,
      G = Math.min(e.simulationDurationH, V, S + T) >= Math.min(e.simulationDurationH,V)-1e-10 ? Math.min(e.simulationDurationH,V) : Math.min(e.simulationDurationH,V,S+T),
      W = G - S;
    C = BJ({
      state: C,
      tH: S,
      dtH: W,
      subject: e,
      constants: n,
      distribution: a,
      doses: l,
      meals: c,
      vmaxGPerH: b.valueGPerH
    });
    const $ = LJ(C);
    for (C = $.state, E += $.negatives, S = G; N < p.length && p[N] <= S;) N += 1;
    !k && S === 0 && (TT(C, e), k = !0), PT(C, l, S, O), S >= -an && A.push(NT({
      tH: Math.max(0, S),
      state: C,
      previous: A[A.length - 1],
      subject: e,
      constants: n,
      distribution: a,
      doses: l,
      meals: c,
      vmaxGPerH: b.valueGPerH,
      initialEthanolG: w,
      initialCaffeineEquivalentMg: g
    }));
  }
  const D = VJ(A, e.simulationDurationH, e.timeStepMin);
  return {
    densePoints: A,
    sampledPoints: D,
    summary: {...GJ(A,C,v,e),lastInHorizonInputEndH:t.reduce((end,d)=>d.startTimeH<=e.simulationDurationH&&(Ta(d,n)>0||Na(d)>0)?Math.max(end,Math.min(e.simulationDurationH,d.startTimeH+Math.max(0,d.durationMin)/60)):end,0),futureScheduledInput:t.some(d=>d.startTimeH>e.simulationDurationH&&(Ta(d,n)>0||Na(d)>0))},
    doseAccounting: v,
    preClampNegativeCount: E,
    resolvedVmaxGPerH: b.valueGPerH
  };
}
const xj = 200;
function qJ(e, t) {
  const n = new Set(),
    a = [],
    s = (l, c, d) => {
      const f = typeof l == "string" ? l.trim() : "";
      f ? f.length > xj ? a.push({
        level: "error",
        code: `${c}-id-length-${d}`,
        message: `${c === "dose" ? "Dose" : "Meal"} event ${d + 1} identifier exceeds ${xj} characters.`
      }) : n.has(f) && a.push({
        level: "error",
        code: `${c}-id-duplicate-${d}`,
        message: `Event identifier "${f}" is repeated across the combined schedule.`
      }) : a.push({
        level: "error",
        code: `${c}-id-missing-${d}`,
        message: `${c === "dose" ? "Dose" : "Meal"} event ${d + 1} requires a canonical identifier.`
      }), f && n.add(f);
    };
  return e.forEach((l, c) => s(l.id, "dose", c)), t.forEach((l, c) => s(l.id, "meal", c)), a;
}
const Ue = (e, t, n, a, s, l, c, d, f = "Always when rendered") => ({
  id: e,
  path: t,
  type: "number",
  unit: n,
  hard: {
    min: a,
    max: s
  },
  advisory: d,
  step: l,
  applicability: f,
  message: c
});
const Nn = (e, t, n, a, s = "Always when rendered") => ({
  id: e,
  path: t,
  type: "categorical",
  unit: "",
  allowed: n,
  applicability: s,
  message: a
});
const YJ = (e, t, n, a) => ({
  id: e,
  path: t,
  type: "derived",
  unit: n,
  applicability: a,
  message: `${t} is derived from its canonical composition inputs.`
});
const Cu = (e, t, n = "Always when rendered") => ({
  id: e,
  path: t,
  type: "boolean",
  unit: "",
  allowed: [!1, !0],
  applicability: n,
  message: `${t} must be true or false.`
});
const XJ = [Ue("analysis.sweepEvaluations", "analysis.sweep.evaluations", "evaluations", 3, 31, 1, "Sweep evaluations must be a whole number from 3 to 31."), Cu("analysis.showSensitivityBands", "analysis.showSensitivityBands", "Results curve analysis"), Cu("subject.allowLeanFatResidualMass", "subject.allowLeanFatResidualMass", "Known lean/fat mode"), Ue("subject.bodyMassKg", "subject.bodyMassKg", "kg", 35, 250, .1, "Body mass must be from 35 to 250 kg.", {
  min: 45,
  max: 200
}), Ue("subject.simulationDurationH", "subject.simulationDurationH", "h", 1, 72, 1, "Modeled horizon must be from 1 to 72 hours.", {
  min: 6,
  max: 48
}), Ue("subject.legalBACThresholdGdL", "subject.legalBACThresholdGdL", "g/dL", 0, .2, .005, "Configured BAC comparison threshold must be from 0 to 0.2 g/dL."), Ue("subject.vehicleZeroToleranceThresholdGdL", "subject.vehicleZeroToleranceThresholdGdL", "g/dL", 0, .2, .001, "Vehicle reference threshold must be from 0 to 0.2 g/dL."), Ue("subject.ethanolClearanceModifier", "subject.ethanolClearanceModifier", "x", .2, 3, .05, "Ethanol clearance modifier must be from 0.2x to 3x."), Ue("subject.gastricEmptyingModifier", "subject.gastricEmptyingModifier", "x", .2, 4, .05, "Gastric emptying modifier must be from 0.2x to 4x."), Ue("subject.ethanolToleranceModifier", "subject.ethanolToleranceModifier", "x", .2, 5, .05, "Ethanol subjective tolerance modifier must be from 0.2x to 5x."), Ue("subject.baselineAlertnessIndex", "subject.baselineAlertnessIndex", "index", 0, 1, .01, "Baseline alertness must be from 0 to 1."), Ue("subject.caffeineToleranceModifier", "subject.caffeineToleranceModifier", "x", .2, 5, .05, "Caffeine tolerance modifier must be from 0.2x to 5x."), Ue("subject.caffeineHalfLifeH", "subject.caffeineHalfLifeH", "h", 1, 30, .25, "Caffeine half-life must be from 1 to 30 hours.", {
  min: 2,
  max: 15
}), Ue("subject.referenceCaffeineHalfLifeH", "subject.referenceCaffeineHalfLifeH", "h", 1, 30, .25, "Reference caffeine half-life must be from 1 to 30 hours.", {
  min: 2,
  max: 15
}), Ue("subject.caffeineAbsorptionModifier", "subject.caffeineAbsorptionModifier", "x", .1, 5, .05, "Caffeine absorption modifier must be from 0.1x to 5x."), Ue("subject.cyp1a2ActivityModifier", "subject.cyp1a2ActivityModifier", "x", .1, 5, .05, "CYP1A2 modifier must be from 0.1x to 5x."), Ue("subject.sleepDebtModifier", "subject.sleepDebtModifier", "x", .25, 4, .05, "Sleep-debt modifier must be from 0.25x to 4x."), Ue("subject.ethanolVmaxReferenceFfmKg", "subject.ethanolVmaxReferenceFfmKg", "kg", 25, 120, .1, "Reference FFM must be from 25 to 120 kg."), Ue("subject.ethanolVmaxOverrideGPerH", "subject.ethanolVmaxOverrideGPerH", "g/h", 1e-6, 80, .1, "Vmax override must be above 0 and no more than 80 g/h.", void 0, "Direct or detached Vmax modes"), Ue("subject.sedativeToleranceModifier", "subject.sedativeToleranceModifier", "x", .2, 5, .05, "Sedative-response modifier must be from 0.2x to 5x."), Ue("subject.functionalToleranceModifier", "subject.functionalToleranceModifier", "x", .2, 5, .05, "Functional-tolerance annotation must be from 0.2x to 5x."), Ue("subject.perceivedControlCalibration", "subject.perceivedControlCalibration", "x", .2, 5, .05, "Perceived-control calibration must be from 0.2x to 5x."), Ue("subject.bodyFatPercent", "subject.bodyFatPercent", "%", 3, 70, .1, "Body fat must be from 3% to 70%.", void 0, "Known body-fat or FFM modes"), Ue("subject.leanMassKg", "subject.leanMassKg", "kg", 0, 250, .1, "Lean mass must be from 0 to 250 kg.", void 0, "Known lean-mass modes"), Ue("subject.fatMassKg", "subject.fatMassKg", "kg", 0, 250, .1, "Fat mass must be from 0 to 250 kg.", void 0, "Known lean/fat mode"), Ue("subject.customTBWFraction", "subject.customTBWFraction", "fraction", .3, .8, .01, "Custom TBW fraction must be from 0.3 to 0.8.", void 0, "Custom demographic physiology"), Ue("subject.customTBWL", "subject.customTBWL", "L", 20, 120, .1, "Custom TBW must be from 20 to 120 L.", void 0, "Custom TBW mode"), Ue("subject.customApparentVdLPerKg", "subject.customApparentVdLPerKg", "L/kg", .2, 1.2, .01, "Direct apparent Vd must be from 0.2 to 1.2 L/kg.", void 0, "Apparent-Vd modes"), Ue("subject.heightCm", "subject.heightCm", "cm", 120, 230, .1, "Height must be from 120 to 230 cm.", void 0, "Anthropometric modes"), Ue("subject.ageYears", "subject.ageYears", "years", 18, 90, 1, "Age must be from 18 to 90 years.", void 0, "Watson anthropometric TBW"), Nn("subject.sexOrPhysiologyMode", "subject.sexOrPhysiologyMode", ["male default", "female default", "custom"], "Choose a supported sex/physiology mode."), Nn("subject.bodyCompositionMode", "subject.bodyCompositionMode", ["default demographic TBW fraction", "body fat percentage known", "lean mass and fat mass known", "FFM-derived TBW", "Watson anthropometric TBW", "custom TBW litres", "BMI-adjusted apparent distribution estimate", "direct apparent Vd"], "Choose a supported body-composition mode."), Nn("subject.ethanolEliminationMode", "subject.ethanolEliminationMode", ["zero-order", "Michaelis-Menten"], "Choose a supported ethanol-elimination mode."), Nn("subject.ethanolVmaxMode", "subject.ethanolVmaxMode", ["reference-population", "direct", "FFM-scaled exploratory", "total-mass-scaled legacy"], "Choose a supported Vmax mode."), Nn("subject.ethanolVmaxParameterState", "subject.ethanolVmaxParameterState", ["automatic", "user-overridden", "preset-specified"], "Choose a supported Vmax parameter state."), Nn("subject.caffeineParameterMode", "subject.caffeineParameterMode", ["direct effective half-life", "reference clearance plus CYP1A2 covariate"], "Choose a supported caffeine parameter mode."), Nn("subject.foodState", "subject.foodState", ["fasted", "light meal", "heavy meal", "custom"], "Choose a supported food state."), Nn("subject.solverInternalStepMin", "subject.solverInternalStepMin", [.25, .5, 1, 2], "Internal solver step must be 0.25, 0.5, 1, or 2 minutes."), Nn("subject.timeStepMin", "subject.timeStepMin", [1, 2.5, 5, 10, 15], "Output step must be 1, 2.5, 5, 10, or 15 minutes."), Ue("subject.initialConditions.gastricEthanolG", "subject.initialConditions.gastricEthanolG", "g", 0, 1e4, .1, "Initial gastric ethanol must be from 0 to 10,000 g.", void 0, "Initial-state modeling"), Ue("subject.initialConditions.intestinalEthanolG", "subject.initialConditions.intestinalEthanolG", "g", 0, 1e4, .1, "Initial intestinal ethanol must be from 0 to 10,000 g.", void 0, "Initial-state modeling"), Ue("subject.initialConditions.centralEthanolG", "subject.initialConditions.centralEthanolG", "g", 0, 1e4, .1, "Initial central ethanol must be from 0 to 10,000 g.", void 0, "Initial-state modeling"), Ue("subject.initialConditions.caffeineGutMg", "subject.initialConditions.caffeineGutMg", "mg", 0, 1e4, 1, "Initial gut caffeine must be from 0 to 10,000 mg.", void 0, "Initial-state modeling"), Ue("subject.initialConditions.caffeineCentralMg", "subject.initialConditions.caffeineCentralMg", "mg", 0, 1e4, 1, "Initial central caffeine must be from 0 to 10,000 mg.", void 0, "Initial-state modeling"), Ue("subject.initialConditions.paraxanthineCentralMg", "subject.initialConditions.paraxanthineCentralMg", "mg", 0, 1e4, 1, "Initial central paraxanthine must be from 0 to 10,000 mg.", void 0, "Initial-state modeling"), Cu("temperament.enabled", "temperament.enabled", "Behavioural interpretation"), Ue("temperament.traitPercentile", "temperament.* percentile", "percentile", 0, 100, 1, "Trait percentiles must be from 0 to 100.", void 0, "Populated temperament domains or facets"), Nn("temperament.inputMode", "temperament.inputMode", ["simple", "advanced"], "Choose a supported psychology input mode."), Nn("temperament.mbtiType", "temperament.mbti.type", ["", "INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"], "Choose a supported optional MBTI narrative label."), Nn("temperament.mbtiVariant", "temperament.mbti.variant", ["", "A", "T"], "Choose A, T, or unknown."), Nn("temperament.context.socialContext", "temperament.context.socialContext", ["unknown", "alone", "small-known-group", "large-social", "club-nightlife", "conflict-prone", "work-formal", "supervised"], "Choose a supported social context."), Nn("temperament.context.intent", "temperament.context.intent", ["unknown", "abstinent", "moderate", "heavy-session", "binge-like", "performance-social"], "Choose a supported intent context."), Nn("temperament.context.recentSleepQuality", "temperament.context.recentSleepQuality", ["unknown", "normal", "restricted", "severely-restricted"], "Choose a supported recent-sleep context."), Nn("temperament.context.acuteStress", "temperament.context.acuteStress", ["unknown", "low", "moderate", "high"], "Choose a supported acute-stress context.")];
const ZJ = [Ue("dose.startTimeH", "doseEvents[].startTimeH", "h", -168, 240, .25, "Dose start must remain within the supported event window."), Ue("dose.durationMin", "doseEvents[].durationMin", "min", 0, 10080, 1, "Dose duration must be from 0 to 10,080 minutes."), Ue("dose.servings", "doseEvents[].servings", "servings", 0, 50, .25, "Servings must be from 0 to 50."), Ue("dose.ethanolVolumeMl", "doseEvents[].ethanolVolumeMl", "mL", 0, 1e4, 1, "Ethanol-containing volume must be from 0 to 10,000 mL."), Ue("dose.servingVolumeMl", "doseEvents[].servingVolumeMl", "mL", 0, 1e4, 1, "Serving volume must be from 0 to 10,000 mL."), Ue("dose.spiritVolumeMl", "doseEvents[].spiritVolumeMl", "mL", 0, 1e4, 1, "Spirit volume must be from 0 to 10,000 mL."), Ue("dose.mixerVolumeMl", "doseEvents[].mixerVolumeMl", "mL", 0, 1e4, 1, "Mixer volume must be from 0 to 10,000 mL."), Ue("dose.mixerPartsPerSpiritPart", "doseEvents[].mixerPartsPerSpiritPart", "ratio", 0, 50, .25, "Mixer-to-spirit ratio must be from 0 to 50."), Ue("dose.mixerCaffeineConcentrationMgPerMl", "doseEvents[].mixerCaffeineConcentrationMgPerMl", "mg/mL", 0, 100, .01, "Mixer caffeine concentration must be from 0 to 100 mg/mL."), YJ("dose.totalServeVolumeMl", "doseEvents[].totalServeVolumeMl", "mL", "Derived from serving or spirit and mixer volume"), Ue("dose.abvPercent", "doseEvents[].abvPercent", "%", 0, 100, .1, "ABV must be from 0% to 100%."), Ue("dose.ethanolGrams", "doseEvents[].ethanolGrams", "g", 0, 1e3, .1, "Direct ethanol mass must be from 0 to 1,000 g."), Ue("dose.caffeineMg", "doseEvents[].caffeineMg", "mg", 0, 1e4, 1, "Caffeine must be from 0 to 10,000 mg."), Ue("dose.sugarG", "doseEvents[].sugarG", "g", 0, 1e3, .1, "Sugar must be from 0 to 1,000 g."), Cu("dose.carbonated", "doseEvents[].carbonated", "Dose context metadata"), Ue("meal.startTimeH", "subject.mealEvents[].startTimeH", "h", -168, 240, .25, "Meal start must remain within the supported event window."), Ue("meal.durationH", "subject.mealEvents[].durationH", "h", 1 / 60, 168, .25, "Meal duration must be positive and no more than 168 hours."), Ue("meal.durationMinEditor", "subject.mealEvents[].durationH", "min", 1, 10080, 1, "Meal duration must be from 1 to 10,080 minutes."), Ue("meal.gastricEmptyingModifier", "subject.mealEvents[].gastricEmptyingModifier", "x", 1e-6, 5, .05, "Meal gastric-emptying modifier must be above 0 and no more than 5x."), Ue("meal.firstPassFraction", "subject.mealEvents[].firstPassFraction", "fraction", 0, .95, .01, "Meal first-pass fraction must be from 0 to 0.95."), Nn("dose.beverageType", "doseEvents[].beverageType", ["beer-wine-cider", "straight-spirit", "mixed-drink", "caffeine-only", "custom"], "Choose a supported beverage type."), Nn("dose.caffeineDoseMode", "doseEvents[].caffeineDoseMode", ["direct", "mixer-derived"], "Choose a supported caffeine-dose mode."), Nn("dose.foodOverride", "doseEvents[].foodOverride", ["", "fasted", "light meal", "heavy meal", "custom"], "Choose a supported dose-level food state."), Nn("meal.foodState", "subject.mealEvents[].foodState", ["fasted", "light meal", "heavy meal", "custom"], "Choose a supported meal state.")];
const JJ = [["ethanolDensityGPerMl", "g/mL", .7, .9, .001], ["gastricEmptyingRateFastedPerH", "/h", 0, 8, .05], ["gastricEmptyingRateLightMealPerH", "/h", 0, 8, .05], ["gastricEmptyingRateHeavyMealPerH", "/h", 0, 8, .05], ["gastricEmptyingRateCustomPerH", "/h", 0, 8, .05], ["gastricAbsorptionRatePerH", "/h", 0, 8, .05], ["intestinalAbsorptionRatePerH", "/h", 0, 12, .05], ["firstPassFractionFasted", "fraction", 0, .95, .01], ["firstPassFractionLightMeal", "fraction", 0, .95, .01], ["firstPassFractionHeavyMeal", "fraction", 0, .95, .01], ["firstPassFractionCustom", "fraction", 0, .95, .01], ["zeroOrderEliminationGdLPerH", "g/dL/h", 0, .08, .001], ["michaelisMentenVmaxGPerH", "g/h", 1e-6, 80, .1], ["michaelisMentenKmGdL", "g/dL", .001, .3, .001], ["referencePopulationVmaxGPerH", "g/h", .1, 80, .1], ["referencePopulationVmaxBodyMassKg", "kg", 35, 250, .1], ["legacyVmaxGPerHPerKg", "g/h/kg", .01, .5, .001], ["totalBodyWaterFractionDefaultMale", "fraction", .3, .8, .01], ["totalBodyWaterFractionDefaultFemale", "fraction", .3, .8, .01], ["totalBodyWaterFractionCustom", "fraction", .3, .8, .01], ["leanTissueWaterFraction", "fraction", .5, .9, .01], ["adiposeTissueWaterFraction", "fraction", 0, .4, .01], ["bloodWaterFraction", "fraction", .6, .95, .01], ["customApparentVdLPerKg", "L/kg", .2, 1.2, .01], ["caffeineVdLPerKg", "L/kg", .2, 1.5, .01], ["caffeineAbsorptionRatePerH", "/h", 0, 10, .05], ["caffeineToParaxanthineFraction", "fraction", 0, 1, .01], ["paraxanthineHalfLifeH", "h", 1, 40, .25], ["caffeineMolecularMassMgPerMmol", "mg/mmol", 190, 200, .01], ["paraxanthineMolecularMassMgPerMmol", "mg/mmol", 175, 185, .01], ["paraxanthineVdLPerKg", "L/kg", .2, 1.5, .01], ["paraxanthineRelativePotency", "x", 0, 2, .01], ["ethanolCYP1A2InhibitionImax", "fraction", 0, .95, .01], ["ethanolCYP1A2InhibitionIC50GdL", "g/dL", .001, .5, .001], ["ethanolEC50GdL", "g/dL", .005, .3, .001], ["ethanolHill", "coefficient", .2, 8, .1], ["caffeineEC50MgL", "mg/L", .1, 20, .1], ["caffeineHill", "coefficient", .2, 8, .1]];
const QJ = [...JJ.map(([e, t, n, a, s]) => Ue(`constants.${e}`, `constants.${e}`, t, n, a, s, `${e} must be from ${n} to ${a} ${t}.`, void 0, "Expert constants")), Cu("constants.paraxanthineApproximationEnabled", "constants.paraxanthineApproximationEnabled", "Expert caffeine constants"), Cu("constants.optionalEthanolInhibitsCaffeineClearance", "constants.optionalEthanolInhibitsCaffeineClearance", "Expert caffeine constants")];
const Qg = Object.freeze(Object.fromEntries([...XJ, ...ZJ, ...QJ].map(e => [e.id, Object.freeze(e)])));
function ey(e) {
  const t = Qg[e];
  if (!t) throw new Error(`Unknown canonical parameter: ${e}`);
  return t;
}
function Fi(e) {
  const t = ey(e);
  if (t.type !== "number" || !t.hard) throw new Error(`${e} is not a bounded numeric parameter.`);
  return {
    ...t.hard,
    step: t.step ?? 1
  };
}
function gs(e, t, n = e.replace(/[^a-z0-9]+/gi, "-").toLowerCase()) {
  const a = ey(e);
  if (a.type !== "derived") {
    if (a.type === "number") {
      if (typeof t != "number" || !Number.isFinite(t)) return {
        level: "error",
        code: `missing-${n}`,
        message: `Missing ${a.path}.`
      };
      if (!a.hard || t < a.hard.min || t > a.hard.max) return {
        level: "error",
        code: `${n}-range`,
        message: a.message
      };
    } else if (!a.allowed?.includes(t)) return {
      level: "error",
      code: `invalid-${n}`,
      message: a.message
    };
  }
}
const _T = ["fasted", "light meal", "heavy meal", "custom"];
function Be(e, t, n) {
  return {
    level: e,
    code: t,
    message: n
  };
}
function dn(e) {
  return typeof e != "number" || !Number.isFinite(e);
}
function qe(e, t, n, a, s, l = "error") {
  if (dn(e)) return Be("error", `missing-${t}`, `Missing ${n}.`);
  if ((e ?? 0) < a || (e ?? 0) > s) return Be(l, `${t}-range`, `${n} is outside ${a}-${s}.`);
}
function nQ(e, t) {
  return Ta(e, t);
}
function aQ(e, t, n, a) {
  const s = [],
    l = gs("subject.bodyMassKg", e.bodyMassKg, "body-mass");
  l && s.push(l), [["subject.sexOrPhysiologyMode", e.sexOrPhysiologyMode, "sex-mode"], ["subject.bodyCompositionMode", e.bodyCompositionMode, "body-composition"], ["subject.ethanolEliminationMode", e.ethanolEliminationMode, "ethanol-elimination"], ["subject.foodState", e.foodState, "food-state"], ["subject.timeStepMin", e.timeStepMin, "time-step"], ["subject.solverInternalStepMin", e.solverInternalStepMin, "solver-step"], ["subject.ethanolVmaxMode", e.ethanolVmaxMode, "vmax-mode"], ["subject.ethanolVmaxParameterState", e.ethanolVmaxParameterState, "vmax-state"], ["subject.caffeineParameterMode", e.caffeineParameterMode, "caffeine-mode"]].forEach(([g, C, S]) => {
    const k = gs(String(g), C, String(S));
    k && s.push(k);
  }), [qe(e.ethanolClearanceModifier, "ethanol-clearance-modifier", "Ethanol clearance modifier", .2, 3), qe(e.gastricEmptyingModifier, "gastric-emptying-modifier", "Gastric emptying modifier", .2, 4), qe(e.ethanolToleranceModifier, "ethanol-tolerance-modifier", "Ethanol subjective tolerance modifier", .2, 5), qe(e.baselineAlertnessIndex, "baseline-alertness-index", "Baseline alertness index", 0, 1), qe(e.caffeineToleranceModifier, "caffeine-tolerance-modifier", "Caffeine alertness tolerance modifier", .2, 5), gs("subject.caffeineHalfLifeH", e.caffeineHalfLifeH, "caffeine-half-life"), gs("subject.referenceCaffeineHalfLifeH", e.referenceCaffeineHalfLifeH, "reference-caffeine-half-life"), qe(e.caffeineAbsorptionModifier, "caffeine-absorption-modifier", "Caffeine absorption modifier", .1, 5), qe(e.cyp1a2ActivityModifier, "cyp1a2-activity-modifier", "CYP1A2/caffeine clearance modifier", .1, 5), gs("subject.simulationDurationH", e.simulationDurationH, "simulation-duration"), qe(e.sleepDebtModifier, "sleep-debt-modifier", "Sleep debt modifier", .25, 4), qe(e.ethanolVmaxReferenceFfmKg, "vmax-reference-ffm", "Reference FFM for exploratory Vmax scaling", 25, 120), qe(e.sedativeToleranceModifier, "sedative-tolerance", "Sedative-response modifier", .2, 5), qe(e.functionalToleranceModifier, "functional-tolerance", "Functional-tolerance annotation", .2, 5), qe(e.perceivedControlCalibration, "perceived-control-calibration", "Perceived-control calibration", .2, 5), gs("subject.legalBACThresholdGdL", e.legalBACThresholdGdL, "legal-bac-threshold"), gs("subject.vehicleZeroToleranceThresholdGdL", e.vehicleZeroToleranceThresholdGdL, "vehicle-bac-threshold")].forEach(g => {
    g && s.push(g);
  }), s.push(...qJ(t, e.mealEvents ?? [])), (e.ethanolVmaxMode === "direct" || e.ethanolVmaxParameterState !== "automatic") && dn(e.ethanolVmaxOverrideGPerH) ? s.push(Be("error", "missing-vmax-override", "A direct or detached Vmax state requires a finite Vmax override.")) : typeof e.ethanolVmaxOverrideGPerH == "number" && (e.ethanolVmaxOverrideGPerH <= 0 || e.ethanolVmaxOverrideGPerH > 80) && s.push(Be("error", "vmax-override-range", "Vmax override must be above 0 and no more than 80 g/h."));
  for (const [g, C] of Object.entries(e.initialConditions ?? {})) {
    const S = gs(`subject.initialConditions.${g}`, C, `initial-${g}`);
    S && s.push(S);
  }
  (e.initialConditions?.paraxanthineCentralMg ?? 0) > 0 && !n.paraxanthineApproximationEnabled && s.push(Be("warning", "initial-paraxanthine-disabled", "Initial paraxanthine is mass-balanced but does not enter the PD signal while the paraxanthine compartment is disabled."));
  const c = [...(e.mealEvents ?? []), ...t.filter(g => !!g.foodOverride).map(g => ({
    id: `dose-food-${g.id}`,
    startTimeH: g.startTimeH,
    durationH: Math.max(4, g.durationMin / 60),
    foodState: g.foodOverride,
    gastricEmptyingModifier: 1,
    label: `${g.label} food tag`
  }))];
  for (const g of c) _T.includes(g.foodState) || s.push(Be("error", `invalid-meal-state-${g.id}`, `${g.label} has an invalid food state.`)), (!Number.isFinite(g.startTimeH) || !Number.isFinite(g.durationH) || g.durationH <= 0) && s.push(Be("error", `invalid-meal-time-${g.id}`, `${g.label} requires a finite start and positive duration.`)), (g.startTimeH < -168 || g.startTimeH > e.simulationDurationH + 168 || g.durationH > 168) && s.push(Be("error", `meal-window-range-${g.id}`, `${g.label} exceeds the supported +/-168 h timeline range.`)), (!Number.isFinite(g.gastricEmptyingModifier) || g.gastricEmptyingModifier <= 0 || g.gastricEmptyingModifier > 5) && s.push(Be("error", `invalid-meal-modifier-${g.id}`, `${g.label} has an invalid gastric-emptying modifier.`)), g.firstPassFraction !== void 0 && (!Number.isFinite(g.firstPassFraction) || g.firstPassFraction < 0 || g.firstPassFraction > .95) && s.push(Be("error", `invalid-meal-first-pass-${g.id}`, `${g.label} has an invalid first-pass fraction.`));
  for (let g = 0; g < c.length; g += 1) for (let C = g + 1; C < c.length; C += 1) {
    const S = c[g],
      k = c[C],
      E = Math.max(S.startTimeH, k.startTimeH) < Math.min(S.startTimeH + S.durationH, k.startTimeH + k.durationH) - 1e-9,
      O = S.foodState !== k.foodState || Math.abs(S.gastricEmptyingModifier - k.gastricEmptyingModifier) > 1e-9 || (S.firstPassFraction ?? null) !== (k.firstPassFraction ?? null);
    E && O && s.push(Be("error", `food-conflict-${S.id}-${k.id}`, `Contradictory food/absorption states overlap: ${S.label} (${S.foodState}) and ${k.label} (${k.foodState}).`));
  }
  if (e.sexOrPhysiologyMode === "custom" && e.bodyCompositionMode === "default demographic TBW fraction" || typeof e.customTBWFraction == "number") {
    const g = qe(e.customTBWFraction, "custom-subject-tbw-fraction", "Custom physiology TBW fraction", .3, .8);
    g && s.push(g);
  }
  if (e.sexOrPhysiologyMode === "custom" && e.bodyCompositionMode === "BMI-adjusted apparent distribution estimate" || typeof e.customApparentVdLPerKg == "number") {
    const g = qe(e.customApparentVdLPerKg, "custom-subject-apparent-vd", "Custom physiology apparent Vd", .2, 1.2);
    g && s.push(g);
  }
  const p = (e.compositionEvidence?.measurementMeaning === "fat-free-mass" && e.compositionEvidence.unit === "kg" ? e.compositionEvidence.value : void 0) ?? e.leanMassKg,
    b = (e.compositionEvidence?.kind === "body-fat-estimate" && e.compositionEvidence.unit === "%" ? e.compositionEvidence.value : void 0) ?? e.bodyFatPercent;
  if (typeof p == "number" && Number.isFinite(p) && (p <= 0 || p >= e.bodyMassKg) && s.push(Be("error", "ffm-mass-conflict", "Fat-free mass must be positive and lower than total body mass. Correct the linked composition value before calculation.")), typeof b == "number" && Number.isFinite(b) && (b < 3 || b > 70) && s.push(Be("error", "body-fat-range", "Body fat percent is outside 3-70%.")), typeof p == "number" && Number.isFinite(p) && typeof b == "number" && Number.isFinite(b)) {
    const g = e.bodyMassKg * (1 - b / 100);
    Math.abs(g - p) > e.bodyMassKg * .03 && s.push(Be("error", "conflicting-ffm-inputs", "Entered fat-free mass conflicts with body mass and body-fat percentage by more than 3%. Correct either linked value."));
  }
  if (e.bodyCompositionMode === "body fat percentage known") {
    const g = e.bodyFatPercent;
    (typeof g != "number" || !Number.isFinite(g)) && s.push(Be("error", "missing-body-fat-percent", 'Missing body fat percent for "body fat percentage known" mode.'));
  }
  if (e.bodyCompositionMode === "lean mass and fat mass known") {
    if (dn(e.leanMassKg) && dn(e.fatMassKg)) s.push(Be("error", "missing-lean-fat", "Missing lean mass and fat mass for lean/fat mode."));else if (!dn(e.leanMassKg) && dn(e.fatMassKg)) {
      const g = e.bodyMassKg - (e.leanMassKg ?? 0);
      g < 0 ? s.push(Be("error", "negative-derived-fat", "Lean mass exceeds body mass, so fat mass is negative.")) : s.push(Be("warning", "derived-fat-mass", `Fat mass derived as body mass minus lean mass (${g.toFixed(1)} kg).`));
    } else dn(e.leanMassKg) && !dn(e.fatMassKg) && s.push(Be("error", "missing-lean-mass", "Lean mass is missing; fat mass alone is not enough."));
    if (!dn(e.leanMassKg) && !dn(e.fatMassKg)) {
      const g = (e.leanMassKg ?? 0) + (e.fatMassKg ?? 0),
        C = e.bodyMassKg * .05;
      !e.allowLeanFatResidualMass && Math.abs(g - e.bodyMassKg) > C && s.push(Be("warning", "lean-fat-total", "Lean mass plus fat mass differs from body mass by more than +/-5%."));
    }
  }
  if (e.bodyCompositionMode === "custom TBW litres" && (dn(e.customTBWL) ? s.push(Be("error", "missing-custom-tbw", "Custom TBW litres is missing.")) : ((e.customTBWL ?? 0) < 20 || (e.customTBWL ?? 0) > 120) && s.push(Be("error", "custom-tbw-range", "Custom TBW is outside 20-120 L."))), e.bodyCompositionMode === "FFM-derived TBW" && dn(e.leanMassKg) && dn(e.bodyFatPercent) && s.push(Be("error", "missing-ffm-input", "FFM-derived TBW requires fat-free mass or body-fat percentage.")), e.bodyCompositionMode === "FFM-derived TBW" && !dn(e.leanMassKg) && !dn(e.bodyFatPercent)) {
    const g = e.bodyMassKg * (1 - (e.bodyFatPercent ?? 0) / 100);
    Math.abs(g - (e.leanMassKg ?? 0)) > e.bodyMassKg * .03 && (s.some(C => C.code === "conflicting-ffm-inputs") || s.push(Be("error", "conflicting-ffm-inputs", "Entered fat-free mass conflicts with body mass and body-fat percentage by more than 3%. Correct either linked value.")));
  }
  if (e.bodyCompositionMode === "Watson anthropometric TBW" && (e.sexOrPhysiologyMode === "custom" && s.push(Be("error", "watson-sex-equation", "Watson TBW requires an explicit male or female physiological equation selection.")), dn(e.heightCm) || dn(e.ageYears) ? s.push(Be("error", "missing-watson-input", "Watson TBW requires adult age and height.")) : ((e.ageYears ?? 0) < 18 || (e.ageYears ?? 0) > 90 || (e.heightCm ?? 0) < 120 || (e.heightCm ?? 0) > 230) && s.push(Be("warning", "watson-applicability", "Age or height lies outside the app's ordinary adult Watson applicability range."))), e.bodyCompositionMode === "direct apparent Vd") {
    const g = qe(e.customApparentVdLPerKg, "direct-apparent-vd", "Direct apparent Vd", .2, 1.2);
    g && s.push(g);
  }
  if (e.bodyCompositionMode === "BMI-adjusted apparent distribution estimate") if (dn(e.heightCm)) s.push(Be("error", "missing-height", "Height is missing for BMI-adjusted apparent Vd mode."));else {
    const g = (e.heightCm ?? 0) / 100,
      C = e.bodyMassKg / (g * g);
    (C < 12 || C > 60) && s.push(Be("warning", "bmi-range", "BMI is outside 12-60."));
  }
  a.calculationMode === "TBW-based" && typeof a.tbwFraction == "number" && (a.tbwFraction < .35 || a.tbwFraction > .75) && s.push(Be("warning", "tbw-fraction-range", "Derived TBW fraction is outside 0.35-0.75.")), [qe(n.ethanolDensityGPerMl, "ethanol-density", "Ethanol density constant", .7, .9, "warning"), qe(n.gastricEmptyingRateFastedPerH, "gastric-emptying-fasted", "Fasted gastric emptying rate", 0, 8), qe(n.gastricEmptyingRateLightMealPerH, "gastric-emptying-light-meal", "Light-meal gastric emptying rate", 0, 8), qe(n.gastricEmptyingRateHeavyMealPerH, "gastric-emptying-heavy-meal", "Heavy-meal gastric emptying rate", 0, 8), qe(n.gastricEmptyingRateCustomPerH, "gastric-emptying-custom", "Custom gastric emptying rate", 0, 8), qe(n.gastricAbsorptionRatePerH, "gastric-absorption", "Gastric absorption rate", 0, 8), qe(n.intestinalAbsorptionRatePerH, "intestinal-absorption", "Intestinal absorption rate", 0, 12), qe(n.firstPassFractionFasted, "first-pass-fasted", "Fasted first-pass fraction", 0, .95), qe(n.firstPassFractionLightMeal, "first-pass-light-meal", "Light-meal first-pass fraction", 0, .95), qe(n.firstPassFractionHeavyMeal, "first-pass-heavy-meal", "Heavy-meal first-pass fraction", 0, .95), qe(n.firstPassFractionCustom, "first-pass-custom", "Custom first-pass fraction", 0, .95), qe(n.zeroOrderEliminationGdLPerH, "zero-order-elimination", "Zero-order ethanol elimination constant", 0, .08), qe(n.michaelisMentenVmaxGPerH, "mm-vmax", "Michaelis-Menten Vmax", 0, 80), qe(n.michaelisMentenKmGdL, "mm-km", "Michaelis-Menten Km", .001, .3), qe(n.referencePopulationVmaxGPerH, "reference-vmax", "Reference-population Vmax", .1, 80), qe(n.referencePopulationVmaxBodyMassKg, "reference-vmax-mass", "Reference Vmax population mass annotation", 35, 250), qe(n.legacyVmaxGPerHPerKg, "legacy-vmax-scale", "Legacy Vmax mass scale", .01, .5), qe(n.totalBodyWaterFractionDefaultMale, "male-tbw-fraction", "Default male TBW fraction", .3, .8), qe(n.totalBodyWaterFractionDefaultFemale, "female-tbw-fraction", "Default female TBW fraction", .3, .8), qe(n.totalBodyWaterFractionCustom, "custom-tbw-fraction", "Custom TBW fraction", .3, .8), qe(n.leanTissueWaterFraction, "lean-water-fraction", "Lean tissue water fraction", .5, .9), qe(n.adiposeTissueWaterFraction, "adipose-water-fraction", "Adipose water fraction", 0, .4), qe(n.bloodWaterFraction, "blood-water-fraction", "Blood water fraction", .6, .95), qe(n.customApparentVdLPerKg, "custom-apparent-vd", "Custom apparent Vd", .2, 1.2), qe(n.caffeineVdLPerKg, "caffeine-vd", "Caffeine apparent distribution volume", .2, 1.5), qe(n.caffeineAbsorptionRatePerH, "caffeine-absorption-rate", "Caffeine absorption rate constant", 0, 10), qe(n.caffeineToParaxanthineFraction, "caffeine-to-paraxanthine", "Caffeine-to-paraxanthine fraction", 0, 1), qe(n.paraxanthineHalfLifeH, "paraxanthine-half-life", "Paraxanthine half-life", 1, 40), qe(n.caffeineMolecularMassMgPerMmol, "caffeine-molecular-mass", "Caffeine molecular mass", 190, 200), qe(n.paraxanthineMolecularMassMgPerMmol, "paraxanthine-molecular-mass", "Paraxanthine molecular mass", 175, 185), qe(n.paraxanthineVdLPerKg, "paraxanthine-vd", "Paraxanthine apparent Vd", .2, 1.5), qe(n.paraxanthineRelativePotency, "paraxanthine-relative-potency", "Paraxanthine relative potency", 0, 2), qe(n.ethanolCYP1A2InhibitionImax, "ethanol-cyp1a2-inhibition-imax", "Ethanol CYP1A2 inhibition Imax", 0, .95), qe(n.ethanolCYP1A2InhibitionIC50GdL, "ethanol-cyp1a2-inhibition-ic50", "Ethanol CYP1A2 inhibition IC50", .001, .5), qe(n.ethanolEC50GdL, "ethanol-ec50", "Ethanol EC50", .005, .3), qe(n.ethanolHill, "ethanol-hill", "Ethanol Hill coefficient", .2, 8), qe(n.caffeineEC50MgL, "caffeine-ec50", "Caffeine EC50", .1, 20), qe(n.caffeineHill, "caffeine-hill", "Caffeine Hill coefficient", .2, 8)].forEach(g => {
    g && s.push(g);
  });
  for (const g of a.warnings) s.push(Be("info", "distribution-info", g));
  let x = 0,
    w = 0;
  for (const g of t) {
    const C = nQ(g, n),
      S = CM(g),
      k = g.servings ?? 1;
    x += C, w += Na(g), (typeof g.startTimeH != "number" || !Number.isFinite(g.startTimeH)) && s.push(Be("error", `missing-start-${g.id}`, `Missing start time in ${g.label}.`)), dn(g.durationMin) && s.push(Be("error", `missing-duration-${g.id}`, `Missing duration in ${g.label}.`));
    const E = typeof g.ethanolGrams == "number" && Number.isFinite(g.ethanolGrams);
    !E && dn(g.ethanolVolumeMl) && s.push(Be("error", `missing-volume-${g.id}`, `Missing ethanol volume in ${g.label}.`)), !E && dn(g.abvPercent) && s.push(Be("error", `missing-abv-${g.id}`, `Missing ABV in ${g.label}.`)), dn(g.caffeineMg) && s.push(Be("error", `missing-caffeine-${g.id}`, `Missing caffeine in ${g.label}.`)), typeof g.servings == "number" && !Number.isFinite(g.servings) && s.push(Be("error", `missing-servings-${g.id}`, `Missing servings/drink count in ${g.label}.`)), k < 0 && s.push(Be("error", `negative-servings-${g.id}`, `Negative servings/drink count in ${g.label}.`)), k > 50 && s.push(Be("warning", `high-servings-${g.id}`, `${g.label} is scaled above 50 drinks.`)), k > 1e3 && s.push(Be("error", `extreme-servings-${g.id}`, `${g.label} exceeds the 1,000-serving computational limit.`)), g.ethanolVolumeMl < 0 && s.push(Be("error", `negative-volume-${g.id}`, `Negative ethanol volume in ${g.label}.`)), g.ethanolVolumeMl > 1e4 && s.push(Be("error", `extreme-volume-${g.id}`, `${g.label} exceeds 10,000 mL per serving.`)), g.abvPercent < 0 || g.abvPercent > 100 ? s.push(Be("error", `abv-range-${g.id}`, `ABV must be between 0 and 100% in ${g.label}.`)) : g.abvPercent >= 95 && s.push(Be("warning", `high-abv-${g.id}`, `ABV is >=95% in ${g.label}.`)), g.caffeineMg < 0 && s.push(Be("error", `negative-caffeine-${g.id}`, `Negative caffeine in ${g.label}.`)), g.caffeineMg > 1e5 && s.push(Be("error", `extreme-caffeine-${g.id}`, `${g.label} exceeds 100,000 mg caffeine per serving.`)), typeof g.ethanolGrams == "number" && g.ethanolGrams < 0 && s.push(Be("error", `negative-ethanol-grams-${g.id}`, `Negative direct ethanol grams in ${g.label}.`)), typeof g.ethanolGrams == "number" && g.ethanolGrams > 1e4 && s.push(Be("error", `extreme-ethanol-grams-${g.id}`, `${g.label} exceeds 10,000 g direct ethanol per serving.`)), g.foodOverride !== void 0 && g.foodOverride !== "" && !_T.includes(g.foodOverride) && s.push(Be("error", `invalid-food-override-${g.id}`, `Invalid food override in ${g.label}.`)), typeof g.sugarG == "number" && g.sugarG < 0 ? s.push(Be("error", `negative-sugar-${g.id}`, `Negative sugar in ${g.label}.`)) : typeof g.sugarG == "number" && g.sugarG * S > 250 && s.push(Be("warning", `high-sugar-${g.id}`, `Total scaled sugar exceeds 250 g in ${g.label}.`)), g.durationMin < 0 && s.push(Be("error", `negative-duration-${g.id}`, `Negative duration in ${g.label}.`)), g.durationMin > 600 && s.push(Be("warning", `long-duration-${g.id}`, `${g.label} is spread across more than 10 hours.`)), g.durationMin > 4320 && s.push(Be("error", `extreme-duration-${g.id}`, `${g.label} exceeds the supported 72-hour event duration.`)), (g.startTimeH < -168 || g.startTimeH > e.simulationDurationH + 168) && s.push(Be("error", `extreme-start-${g.id}`, `${g.label} lies outside the supported +/-168 h timeline range.`)), (g.startTimeH < 0 || g.startTimeH > e.simulationDurationH || g.startTimeH + Math.max(0, g.durationMin) / 60 > e.simulationDurationH) && s.push(Be("warning", `event-horizon-${g.id}`, `${g.label} is partly or wholly outside the horizon.`)), C > 120 && s.push(Be("warning", `single-high-ethanol-${g.id}`, `${g.label} scales above 120 g ethanol.`));
  }
  const rolling24=maintenanceRollingIntake(t,n,e.simulationDurationH,24),rolling6=maintenanceRollingIntake(t,n,e.simulationDurationH,6);
  return rolling24.ethanolG>180 && s.push(Be('warning','high-total-ethanol','Rolling 24-hour ethanol intake exceeds 180 g within the modeled timeline.')),
    rolling24.caffeineMg>=800?s.push(Be('warning','very-high-caffeine','Rolling 24-hour caffeine intake is >=800 mg within the modeled timeline.')):rolling24.caffeineMg>=400&&s.push(Be('warning','high-caffeine','Rolling 24-hour caffeine intake is >=400 mg within the modeled timeline.')),
    rolling6.combined&&s.push(Be('warning','combined-ethanol-caffeine','Ethanol >80 g and caffeine >200 mg occur in the same rolling 6-hour window. This intake-screening heuristic has no individual clinical calibration.')),
    n.caffeineDoesNotReduceBAC && n.ethanolDoesNotReduceCaffeineDose && s.push(Be("info", "interaction-boundary", "Caffeine alertness/perceived-control effects travel alongside BAC and ethanol-impairment axes.")), s;
}
function iQ(e, t, n) {
  if (e.length === 0) return [];
  const a = [],
    s = e[e.length - 1],
    l = Math.max(1e-6, Math.abs(t) * 1e-7),
    c = Math.max(1e-5, Math.abs(n) * 1e-7),
    d = maintenanceMax(e.map(v => Math.abs(v.ethanolMassBalanceResidualG ?? 0))),
    f = maintenanceMax(e.map(v => Math.abs(v.caffeineMassBalanceResidualMg ?? 0))),
    h = maintenanceMax(e.map(v => Math.abs(v.ethanolInputDeliveryResidualG ?? 0))),
    p = maintenanceMax(e.map(v => Math.abs(v.caffeineInputDeliveryResidualMg ?? 0)));
  return (Math.abs(s.ethanolMassBalanceResidualG) > l || d > l) && a.push(Be("error", "ethanol-mass-balance", `External ethanol mass-balance tolerance failed: final residual ${s.ethanolMassBalanceResidualG.toExponential(3)} g; maximum absolute residual ${d.toExponential(3)} g; tolerance ${l.toExponential(3)} g.`)), h > l && a.push(Be("error", "ethanol-input-delivery", `Numerically integrated ethanol input differs from the analytically scheduled dose by up to ${h.toExponential(3)} g.`)), (Math.abs(s.caffeineMassBalanceResidualMg) > c || f > c) && a.push(Be("error", "caffeine-mass-balance", `External caffeine-equivalent mass-balance tolerance failed: final residual ${s.caffeineMassBalanceResidualMg.toExponential(3)} mg; maximum absolute residual ${f.toExponential(3)} mg; tolerance ${c.toExponential(3)} mg.`)), p > c && a.push(Be("error", "caffeine-input-delivery", `Numerically integrated caffeine input differs from the analytically scheduled dose by up to ${p.toExponential(3)} mg.`)), a;
}
function rQ() {
  return {
    peakBACGdL: 0,
    timeOfPeakBACH: 0,
    peakCaffeineMgL: 0,
    timeOfPeakCaffeineH: 0,
    bacBelowVehicleAfterPeakH: void 0,
    bacBelowLegalAfterPeakH: void 0,
    vehicleThresholdOutcome: {
      status: "not-evaluable"
    },
    legalThresholdOutcome: {
      status: "not-evaluable"
    },
    maxImpairmentIndex: 0,
    maxAlertnessIndex: 0,
    maxMismatchIndex: 0,
    bacAucGdLH: 0,
    caffeineAucMgHL: 0,
    scheduledEthanolG: 0,
    inHorizonEthanolG: 0,
    preHorizonEthanolG: 0,
    postHorizonEthanolG: 0,
    totalEthanolG: 0,
    totalUkUnits: 0,
    totalCaffeineMg: 0,
    scheduledCaffeineMg: 0,
    inHorizonCaffeineMg: 0,
    preHorizonCaffeineMg: 0,
    postHorizonCaffeineMg: 0,
    caffeineAdministeredThroughHorizonMg: 0,
    ethanolAdministeredThroughHorizonG: 0,
    numericallyIntegratedEthanolG: 0,
    numericallyIntegratedCaffeineMg: 0,
    ethanolInputDeliveryResidualG: 0,
    caffeineInputDeliveryResidualMg: 0,
    systemicallyAbsorbedEthanolG: 0,
    firstPassRemovedEthanolG: 0,
    eliminatedEthanolG: 0,
    currentEthanolBurdenG: 0,
    finalBACGdL: 0,
    finalCaffeineMgL: 0
  };
}
function Mp(e, t) {
  const n = Math.max(Math.abs(t), 1e-9);
  return Math.abs(e - t) / n;
}
function BT(e, t) {
  if (!(typeof e != "number" || typeof t != "number")) return Math.abs(e - t) * 60;
}
function LT(e, t, n) {
  const a = Mp(e.summary.peakBACGdL, t.summary.peakBACGdL),
    s = Mp(e.summary.bacAucGdLH, t.summary.bacAucGdLH),
    l = Mp(e.summary.peakCaffeineMgL, t.summary.peakCaffeineMgL),
    c = Mp(e.summary.maxMismatchIndex, t.summary.maxMismatchIndex),
    d = Math.abs(e.summary.timeOfPeakBACH - t.summary.timeOfPeakBACH) * 60,
    equivalentTiedPeaks = e.summary.bacPeakSelection?.tiedPeakCount>1 && t.summary.bacPeakSelection?.tiedPeakCount>1 && a<.005,
    f = BT(e.summary.bacBelowVehicleAfterPeakH, t.summary.bacBelowVehicleAfterPeakH),
    h = BT(e.summary.bacBelowLegalAfterPeakH, t.summary.bacBelowLegalAfterPeakH),
    p = (f === void 0 || f < 1) && (h === void 0 || h < 1) && e.summary.vehicleThresholdOutcome.status === t.summary.vehicleThresholdOutcome.status && e.summary.legalThresholdOutcome.status === t.summary.legalThresholdOutcome.status,
    v = a < .005 && s < .005 && l < .005 && c < .01 && (d < 1 || equivalentTiedPeaks) && p;
  return {
    coarseInternalStepMin: n,
    fineInternalStepMin: n / 2,
    peakBACRelativeDifference: a,
    timeOfPeakDifferenceMin: d,
    peakTimeIdentifiable: !equivalentTiedPeaks,
    equivalentTiedPeaks,
    bacAucRelativeDifference: s,
    vehicleThresholdDifferenceMin: f,
    legalThresholdDifferenceMin: h,
    peakCaffeineRelativeDifference: l,
    peakMismatchRelativeDifference: c,
    converged: v,
    toleranceSummary: "Target: peak BAC, BAC AUC and peak caffeine <0.5% relative difference; threshold states identical; final threshold returns and identifiable peak time <1 minute; tied peak sets are concentration-equivalent; peak mismatch <1% relative difference."
  };
}
function sQ(e) {
  return {
    coarseInternalStepMin: e.solverInternalStepMin,
    fineInternalStepMin: e.solverInternalStepMin / 2,
    peakBACRelativeDifference: 0,
    timeOfPeakDifferenceMin: 0,
    bacAucRelativeDifference: 0,
    peakCaffeineRelativeDifference: 0,
    peakMismatchRelativeDifference: 0,
    converged: !1,
    toleranceSummary: "Simulation did not run because validation blocked the model.",
    requestedInternalStepMin: e.solverInternalStepMin,
    selectedInternalStepMin: e.solverInternalStepMin / 2,
    automaticRefinementCount: 0
  };
}
function $T(e) {
  return e.reduce((t, n) => Math.max(t, Math.abs(n)), 0);
}
function RT(e) {
  const {
      subject: t,
      constants: n,
      summary: a,
      points: s,
      convergence: l,
      preClampNegativeCount: c
    } = e,
    d = s[s.length - 1],
    f = Math.max(1e-6, 1e-7 * Math.abs(a.ethanolAdministeredThroughHorizonG)),
    h = Math.max(1e-5, 1e-7 * Math.abs(a.caffeineAdministeredThroughHorizonMg)),
    p = $T(s.map(E => E.ethanolMassBalanceResidualG)),
    v = $T(s.map(E => E.caffeineMassBalanceResidualMg)),
    b = d?.paraxanthineCentralMg ?? 0,
    x = d?.cumulativeParaxanthineEliminatedMg ?? 0,
    w = (b + x) * (n.caffeineMolecularMassMgPerMmol / n.paraxanthineMolecularMassMgPerMmol),
    g = Math.max(1e-12, a.ethanolAdministeredThroughHorizonG + t.initialConditions.gastricEthanolG + t.initialConditions.intestinalEthanolG + t.initialConditions.centralEthanolG),
    C = t.initialConditions.caffeineGutMg + t.initialConditions.caffeineCentralMg + t.initialConditions.paraxanthineCentralMg * (n.caffeineMolecularMassMgPerMmol / n.paraxanthineMolecularMassMgPerMmol),
    S = Math.max(1e-12, a.caffeineAdministeredThroughHorizonMg + C),
    k = p <= f && v <= h && Math.abs(a.ethanolInputDeliveryResidualG) <= f && Math.abs(a.caffeineInputDeliveryResidualMg) <= h;
  return {
    tolerance: {
      ethanolAbsoluteG: f,
      caffeineEquivalentAbsoluteMg: h
    },
    ethanol: {
      administeredThroughHorizonG: a.ethanolAdministeredThroughHorizonG,
      numericallyIntegratedDoseG: a.numericallyIntegratedEthanolG,
      gastricRemainderG: d?.gastricEthanolG ?? 0,
      intestinalRemainderG: d?.intestinalEthanolG ?? 0,
      centralAmountG: d?.centralEthanolG ?? 0,
      firstPassLossG: d?.firstPassEthanolG ?? 0,
      eliminatedAmountG: d?.eliminatedEthanolG ?? 0,
      finalResidualG: d?.ethanolMassBalanceResidualG ?? 0,
      maximumAbsoluteResidualG: p,
      relativeError: Math.abs(d?.ethanolMassBalanceResidualG ?? 0) / g,
      inputDeliveryResidualG: a.ethanolInputDeliveryResidualG
    },
    caffeine: {
      administeredThroughHorizonMg: a.caffeineAdministeredThroughHorizonMg,
      numericallyIntegratedDoseMg: a.numericallyIntegratedCaffeineMg,
      gutRemainderMg: d?.caffeineGutMg ?? 0,
      centralAmountMg: d?.caffeineCentralMg ?? 0,
      eliminatedParentMg: d?.cumulativeCaffeineEliminatedMg ?? 0,
      notRoutedToParaxanthineMg: d?.cumulativeCaffeineNotRoutedMg ?? 0,
      paraxanthineActualMassMg: b,
      paraxanthineEliminatedActualMassMg: x,
      paraxanthineCaffeineEquivalentMg: w,
      metaboliteFormationRoute: n.paraxanthineApproximationEnabled ? `Parent caffeine elimination routed ${Math.round(n.caffeineToParaxanthineFraction * 100)}% to paraxanthine on a molar basis.` : "Paraxanthine formation disabled; eliminated caffeine remains in the parent-elimination ledger.",
      finalResidualCaffeineEquivalentMg: d?.caffeineMassBalanceResidualMg ?? 0,
      maximumAbsoluteResidualCaffeineEquivalentMg: v,
      relativeError: Math.abs(d?.caffeineMassBalanceResidualMg ?? 0) / S,
      inputDeliveryResidualMg: a.caffeineInputDeliveryResidualMg
    },
    solver: {
      converged: l.converged,
      requestedInternalStepMin: l.requestedInternalStepMin ?? t.solverInternalStepMin,
      selectedInternalStepMin: l.selectedInternalStepMin ?? l.fineInternalStepMin,
      outputStepMin: t.timeStepMin,
      automaticRefinementCount: l.automaticRefinementCount ?? 0,
      denseAnalysisPointCount: s.length,
      displayedPointCount: e.displayedPointCount,
      preClampNegativeCount: c,
      numericalRepairRequired: c > 0
    },
    massBalancePassed: k
  };
}
function HT(e, t) {
  const n = t === "low";
  return {
    ...e,
    gastricEmptyingRateFastedPerH: e.gastricEmptyingRateFastedPerH * (n ? .75 : 1.25),
    gastricEmptyingRateLightMealPerH: e.gastricEmptyingRateLightMealPerH * (n ? .75 : 1.25),
    gastricEmptyingRateHeavyMealPerH: e.gastricEmptyingRateHeavyMealPerH * (n ? .75 : 1.25),
    gastricEmptyingRateCustomPerH: e.gastricEmptyingRateCustomPerH * (n ? .75 : 1.25),
    intestinalAbsorptionRatePerH: e.intestinalAbsorptionRatePerH * (n ? .85 : 1.15),
    referencePopulationVmaxGPerH: e.referencePopulationVmaxGPerH * (n ? 1.2 : .8),
    michaelisMentenVmaxGPerH: e.michaelisMentenVmaxGPerH * (n ? 1.2 : .8)
  };
}
function FT(e, t) {
  const n = t === "low" ? .7 : 1.5;
  return {
    ...e,
    showSensitivityBands: !1,
    caffeineHalfLifeH: e.caffeineHalfLifeH * n,
    referenceCaffeineHalfLifeH: e.referenceCaffeineHalfLifeH * n
  };
}
function Mr(e, t, n) {
  const a = mm(e, n),
    s = aQ(e, t, n, a),
    l = mB(t, n, e.simulationDurationH);
  if (s.some(E => E.level === "error")) {
    const E = l.reduce((G, W) => G + W.scheduledEthanolG, 0),
      O = l.reduce((G, W) => G + W.inHorizonEthanolG, 0),
      A = l.reduce((G, W) => G + W.scheduledCaffeineMg, 0),
      N = l.reduce((G, W) => G + W.inHorizonCaffeineMg, 0),
      T = {
        ...rQ(),
        scheduledEthanolG: E,
        inHorizonEthanolG: O,
        totalEthanolG: O,
        totalUkUnits: O / 8,
        scheduledCaffeineMg: A,
        inHorizonCaffeineMg: N,
        totalCaffeineMg: N
      },
      D = sQ(e),
      V = Yv([], T);
    return {
      points: [],
      analysisPoints: [],
      summary: T,
      distribution: a,
      validationMessages: s,
      convergence: D,
      exposure: V,
      integrity: RT({
        subject: e,
        constants: n,
        summary: T,
        points: [],
        convergence: D,
        preClampNegativeCount: 0,
        displayedPointCount: 0
      }),
      numericalValidity: "invalid",
      doseAccounting: l,
      solver: {
        method: "event-segmented fixed-step RK4",
        internalStepMin: e.solverInternalStepMin / 2,
        requestedInternalStepMin: e.solverInternalStepMin,
        outputStepMin: e.timeStepMin,
        eventAware: !0,
        automaticRefinementCount: 0
      }
    };
  }
  const c = e.solverInternalStepMin;
  let d = c,
    f = d / 2,
    h = yf(e, t, n, a, d),
    p = yf(e, t, n, a, f),
    v = LT(h, p, d),
    b = 0;
  for (; !v.converged && f > .03125 + 1e-12 && b < 5;) h = p, d = f, f /= 2, p = yf(e, t, n, a, f), v = LT(h, p, d), b += 1;
  v = {
    ...v,
    requestedInternalStepMin: c,
    selectedInternalStepMin: f,
    automaticRefinementCount: b
  };
  const x = iQ(p.densePoints, p.summary.preHorizonEthanolG + p.summary.inHorizonEthanolG, p.summary.preHorizonCaffeineMg + p.summary.inHorizonCaffeineMg),
    w = [...s, ...x];
  v.converged || w.push({
    level: "error",
    code: "integration-convergence",
    message: "Automatic refinement exhausted the supported step floor without satisfying the convergence target. Numerical outputs are retained for numerical review and interpretation is suppressed."
  }), p.preClampNegativeCount > 0 && w.push({
    level: "error",
    code: "pre-clamp-negatives",
    message: `Compartment clamps prevented ${p.preClampNegativeCount} negative mass value(s); the numerical run is invalid.`
  }), e.ethanolEliminationMode === "zero-order" && w.push({
    level: "warning",
    code: "legacy-zero-order",
    message: "Legacy zero-order/Widmark-style elimination is selected. A mass-conservative positivity-preserving Strang split constrains removal to available central ethanol; the mode remains a comparison approximation."
  }), n.optionalEthanolInhibitsCaffeineClearance && w.push({
    level: "warning",
    code: "experimental-caffeine-clearance-interaction",
    message: "The acute BAC-dependent caffeine-clearance interaction is experimental and disabled by default; its Imax/IC50 form is not externally calibrated."
  });
  const g = w.some(E => E.level === "error") ? "invalid" : "valid",
    C = Yv(p.densePoints, p.summary),
    S = RT({
      subject: e,
      constants: n,
      summary: p.summary,
      points: p.densePoints,
      convergence: v,
      preClampNegativeCount: p.preClampNegativeCount,
      displayedPointCount: p.sampledPoints.length
    }),
    k = {
      points: p.sampledPoints,
      analysisPoints: p.densePoints,
      summary: p.summary,
      distribution: a,
      validationMessages: w,
      convergence: v,
      exposure: C,
      integrity: S,
      numericalValidity: g,
      doseAccounting: p.doseAccounting,
      solver: {
        method: e.ethanolEliminationMode === "zero-order" ? "event-segmented RK4 with positivity-preserving zero-order Strang split" : "event-segmented RK4 with piecewise-constant forcing",
        internalStepMin: f,
        requestedInternalStepMin: c,
        outputStepMin: e.timeStepMin,
        eventAware: !0,
        automaticRefinementCount: b
      }
    };
  if (e.showSensitivityBands) {
    const E = FT(e, "low"),
      O = FT(e, "high"),
      A = HT(n, "low"),
      N = HT(n, "high");
    const lowPass=yf(E,t,A,AT(a,1.05),f), highPass=yf(O,t,N,AT(a,.95),f);
    k.sensitivity={low:lowPass.sampledPoints,high:highPass.sampledPoints};
    Object.defineProperty(k,"__sensitivityDense",{value:{low:lowPass.densePoints,high:highPass.densePoints}});
  }
  return k;
}
function Zn(e) {
  return e.map(t => ({
    ...t
  }));
}
function It(e) {
  return {
    ...e,
    compositionEvidence: e.compositionEvidence ? {
      ...e.compositionEvidence,
      warnings: [...e.compositionEvidence.warnings]
    } : void 0,
    initialConditions: {
      ...e.initialConditions
    },
    mealEvents: e.mealEvents.map(t => ({
      ...t
    }))
  };
}
function Oa(e) {
  return {
    ...e
  };
}
function ke(e, t = 2) {
  return typeof e != "number" || !Number.isFinite(e) ? "--" : e.toFixed(t);
}
function we(e, t = 2) {
  return typeof e != "number" || !Number.isFinite(e) ? "--" : Number(e.toFixed(t)).toString();
}
function Ce(e) {
  if (typeof e != "number" || !Number.isFinite(e)) return "--";
  const t = e < 0 ? "T-" : "",
    n = Math.round(Math.abs(e) * 60),
    a = Math.floor(n / 60),
    s = n % 60;
  return `${t}${a}h ${s.toString().padStart(2, "0")}m`;
}
function Ql(outcome){
  if(outcome.status==='not-evaluable')return 'not evaluable';
  if(outcome.status==='never-exceeded')return 'never exceeded';
  if(outcome.rightCensored||outcome.status.endsWith('not-returned'))return 'remains above at horizon';
  return Number.isFinite(outcome.timeH)?`${outcome.recrossingCount?'final return':'below'} at ${Ce(outcome.timeH)}${outcome.recrossingCount?`; ${outcome.recrossingCount} later re-exposure interval(s)`:''}`:'returned below';
}
function lQ(e) {
  return e.doseEvents.map(t => ({
    startTimeH: t.startTimeH,
    durationMin: t.durationMin,
    ethanolG: Ta(t, e.constants),
    caffeineMg: Na(t),
    foodOverride: t.foodOverride
  }));
}
function wu(e, t) {
  if (e.numericalValidity === "valid" && !e.validationMessages.some(a => a.level === "error")) return {
    status: "valid",
    result: e
  };
  const n = e.validationMessages.filter(a => a.level === "error");
  return {
    status: "invalid",
    messages: n.length ? n : [{
      level: "error",
      code: "invalid-numerical-result",
      message: "The numerical result failed integrity validation."
    }],
    attemptedState: t
  };
}
const ZQ = "2026-09-06";
function rt(e, t, n, a, s, l, c = {}) {
  return {
    parameterId: e,
    label: t,
    value: n,
    units: a,
    population: c.population ?? "Not population-fitted",
    sourceUrl: c.sourceUrl,
    evidenceClass: s,
    applicabilityLimits: c.applicabilityLimits ?? "Model implementation assumption; not an individual clinical estimate.",
    derivationNote: l,
    lastReviewed: ZQ,
    status: c.status ?? "default",
    plausibleRange: c.plausibleRange
  };
}
const Ku = "0.6.0";
const ny = [rt("behaviour.engineering-heuristic-v0.6.0", "Behavioural coefficient registry", "registered 18-axis deterministic transform with decomposition and gestalt resolution", "structure", "local heuristic", "Versioned behavioural axes and named interactions derive bounded state, regulation, continuation, and expression channels from existing PK/PD signals, supplied traits, and acute context.", {
  applicabilityLimits: "Engineering heuristics are not individualized fitted predictors; functional impairment floors remain determined by existing pharmacodynamic signals."
}), rt("model.ethanol.structure", "Ethanol model structure", "hybrid gastric-intestinal absorption plus one central ethanol pool", "structure", "local heuristic", "The application combines locally parameterized gastric/intestinal absorption and first-pass fractions with literature-derived elimination priors.", {
  applicabilityLimits: "The embedded priors do not make this implementation identical to a source population model."
}), rt("ethanol.density", "Ethanol density", .789, "g/mL", "secondary reference", "Volume x ABV is converted to grams with this density."), rt("ethanol.absorption.gastric_fasted", "Fasted gastric emptying rate", 2, "1/h", "engineering default", "Local compartment-model rate; retained for compatibility and sensitivity analysis."), rt("ethanol.absorption.gastric_light_meal", "Light-meal gastric emptying rate", .9, "1/h", "engineering default", "Local compartment-model rate; food effects are empirical approximations."), rt("ethanol.absorption.gastric_heavy_meal", "Heavy-meal gastric emptying rate", .35, "1/h", "engineering default", "Local compartment-model rate; food effects are empirical approximations."), rt("ethanol.absorption.gastric_custom", "Custom-state gastric emptying rate", .75, "1/h", "engineering default", "Fallback rate for user-defined food state."), rt("ethanol.absorption.gastric_absorption", "Gastric absorption rate", .25, "1/h", "engineering default", "Local first-order gastric absorption approximation."), rt("ethanol.absorption.intestinal", "Intestinal absorption rate", 3, "1/h", "engineering default", "Local first-order intestinal absorption approximation."), rt("ethanol.first_pass.fasted", "Fasted first-pass fraction", .05, "fraction", "local heuristic", "Empirical approximation, not universal physiology."), rt("ethanol.first_pass.light_meal", "Light-meal first-pass fraction", .1, "fraction", "local heuristic", "Empirical approximation, not universal physiology."), rt("ethanol.first_pass.heavy_meal", "Heavy-meal first-pass fraction", .15, "fraction", "local heuristic", "Empirical approximation, not universal physiology."), rt("ethanol.first_pass.custom", "Custom-state first-pass fraction", .1, "fraction", "local heuristic", "Fallback empirical approximation."), rt("ethanol.elimination.reference_vmax", "Reference-population ethanol Vmax", 6.31, "g/h", "primary fitted parameter", "Fasted maximum elimination-rate estimate from a nonlinear mixed-effects two-compartment model.", {
  plausibleRange: "95% CI 6.04-6.59 g/h",
  population: "72 healthy adults (60 men, 12 women), ages 20-60, pooled clinical studies",
  sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/36688276/",
  applicabilityLimits: "Reference-population prior imported into the application's one-central-compartment hybrid; individual elimination varies and the source study population was predominantly male."
}), rt("ethanol.elimination.km", "Michaelis-Menten Km", .003, "g/dL", "primary fitted parameter", "Converted from 0.03 g/L reported by Rangno et al.", {
  population: "Eight healthy volunteers receiving IV and oral ethanol",
  sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/7332732/",
  applicabilityLimits: "Small historical study; use as a mechanistic prior rather than an individual estimate."
}), rt("ethanol.elimination.legacy_zero_order", "Legacy zero-order slope", .015, "g/dL/h", "engineering default", "Retained only for explicit Widmark-style comparison."), rt("ethanol.elimination.legacy_mass_scale", "Legacy total-mass Vmax scale", .1, "g/h/kg", "engineering default", "Legacy compatibility coefficient; not the preferred mechanistic covariate."), rt("distribution.ffm_hydration", "FFM hydration fraction", .73, "L/kg FFM", "secondary reference", "FFM-derived TBW uses FFM hydration only; adipose water is not added again."), rt("distribution.default_male_tbw", "Male fallback TBW fraction", .58, "L/kg", "engineering default", "Broad demographic fallback when composition is unknown."), rt("distribution.default_female_tbw", "Female fallback TBW fraction", .49, "L/kg", "engineering default", "Broad demographic fallback when composition is unknown."), rt("distribution.watson", "Watson anthropometric TBW equations", "sex-specific age/height/mass regression", "L", "primary fitted parameter", "Adult TBW prediction equations derived from dilution-study data.", {
  population: "458 adult males and 265 adult females selected from published dilution studies",
  sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/6986753/",
  applicabilityLimits: "Population regression; accuracy may differ across ancestry, disease state, age extremes and unusual body composition."
}), rt("distribution.maudens", "Maudens BMI-adjusted apparent ethanol Vd", "male 0.8202-0.0090xBMI; female 0.7772-0.0099xBMI", "L/kg", "primary fitted parameter", "Sex-specific regression for apparent ethanol distribution volume.", {
  population: "50 healthy volunteers (23 men, 27 women), BMI 16-36 kg/m2, overnight fast",
  sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/24846125/",
  applicabilityLimits: "Do not silently extrapolate beyond BMI 16-36 kg/m2; apparent Vd is not true TBW."
}), rt("distribution.blood_water_fraction", "Blood-water fraction", .806, "fraction", "secondary reference", "Maps TBW-distributed ethanol amount to blood-water concentration."), rt("caffeine.vd", "Caffeine apparent Vd", .6, "L/kg", "primary literature prior", "One-compartment parent-caffeine distribution prior.", {
  plausibleRange: "approximately 0.63-0.72 L/kg for caffeine and related methylxanthines",
  population: "Six healthy male volunteers",
  sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/3756065/"
}), rt("caffeine.absorption", "Caffeine absorption rate", 2.5, "1/h", "engineering default", "Local oral one-compartment absorption prior."), rt("caffeine.reference_half_life", "Reference caffeine half-life", 5, "h", "primary literature prior", "Reference prior near the 4.1 h mean reported by Lelo et al.; rounded for the app default.", {
  population: "Six healthy male volunteers",
  sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/3756065/"
}), rt("caffeine.experimental_acute_ethanol_inhibition", "Acute BAC-dependent caffeine-clearance interaction", !1, "enabled", "local heuristic", "Optional Imax/IC50 implementation retained for experimentation and disabled by default.", {
  applicabilityLimits: "The exact acute BAC-dependent functional form is not calibrated to a primary human coadministration dataset and must not be treated as established physiology."
}), rt("paraxanthine.molecular_mass", "Paraxanthine molecular mass", 180.16, "mg/mmol", "secondary reference", "Used for molar conversion after caffeine demethylation."), rt("caffeine.molecular_mass", "Caffeine molecular mass", 194.19, "mg/mmol", "secondary reference", "Used for molar-equivalent metabolite accounting."), rt("paraxanthine.vd", "Paraxanthine apparent Vd", .7, "L/kg", "primary literature prior", "Selected within the reported 0.63-0.72 L/kg range for methylxanthines.", {
  population: "Six healthy male volunteers",
  sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/3756065/"
}), rt("paraxanthine.half_life", "Paraxanthine half-life", 3.1, "h", "primary fitted parameter", "Mean half-life reported after oral paraxanthine.", {
  population: "Six healthy male volunteers",
  sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/3756065/"
}), rt("pd.ethanol_ec50", "Ethanol impairment-proxy EC50", .06, "g/dL", "local heuristic", "Uncalibrated Hill-transform midpoint."), rt("pd.ethanol_hill", "Ethanol impairment-proxy Hill coefficient", 2, "unitless", "local heuristic", "Uncalibrated shape coefficient."), rt("pd.caffeine_ec50", "Caffeine alertness-proxy EC50", 3, "mg/L", "local heuristic", "Uncalibrated alertness-proxy midpoint."), rt("pd.caffeine_hill", "Caffeine alertness-proxy Hill coefficient", 1.5, "unitless", "local heuristic", "Uncalibrated shape coefficient."), rt("pd.caffeine_ethanol_boundary", "Caffeine-ethanol behavioural boundary", "endpoint heterogeneous", "text", "primary literature prior", "Caffeine may alter subjective alertness and selected endpoints but does not reduce BAC or uniformly reverse impairment.", {
  sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/23750693/",
  applicabilityLimits: "Controlled-study findings do not justify deterministic individual behavioural predictions."
}), rt("temperament.structure", "Temperament structural reference", "instrument-explicit Big Five domains with instrument-specific facets", "text", "primary literature prior", "Facets replace or refine parent-domain contributions rather than being independently added. The six-facet labels exposed by this interface are NEO-style labels and are not represented as the three-facet BFI-2 hierarchy.", {
  sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/27055049/",
  applicabilityLimits: "Manual scores must come from a named instrument and remain exploratory; questionnaire items are not reproduced."
}), rt("temperament.concern_threshold", "Temperament-overlay concern-window threshold", 62, "0-100 heuristic index", "local heuristic", "Marks intervals for qualitative review when a selected temperament-context output reaches the threshold.", {
  applicabilityLimits: "Uncalibrated and non-diagnostic; this is not a clinical cutoff, probability, norm-referenced risk score, or decision threshold."
}), rt("bac.effects.nhtsa", "BAC effect anchors", "0.02, 0.05, 0.08, 0.10, 0.15 g/dL anchors", "g/dL", "secondary reference", "Direct NHTSA table anchors; intermediate and upper bands in the app are labelled as interpolation/local extension.", {
  sourceUrl: "https://www.nhtsa.gov/sites/nhtsa.dot.gov/files/809844-theabcsofbac.pdf",
  applicabilityLimits: "Population descriptors and typical effects are not deterministic individual diagnoses."
})];
function eee(e, t) {
  const n = e.analysisPoints.length > 0 ? e.analysisPoints : e.points;
  return n.length === 0 ? {
    tH: Math.max(0, t),
    gastricEthanolG: 0,
    intestinalEthanolG: 0,
    centralEthanolG: 0,
    eliminatedEthanolG: 0,
    firstPassEthanolG: 0,
    bacGdL: 0,
    caffeineGutMg: 0,
    caffeineCentralMg: 0,
    caffeineMgL: 0,
    paraxanthineCentralMg: 0,
    paraxanthineRelativeConc: 0,
    ethanolInputGThisStep: 0,
    caffeineInputMgThisStep: 0,
    ethanolImpairmentIndex: 0,
    ethanolSedationIndex: 0,
    ethanolStimulationIndex: 0,
    caffeineAlertnessIndex: 0,
    combinedAlertnessIndex: 0,
    perceivedControlIndex: 0,
    mismatchIndex: 0,
    bacRateGdLPerH: 0,
    vehicleWarningLevel: "not evaluated",
    legalWarningLevel: "not evaluated",
    ethanolMassBalanceResidualG: 0,
    caffeineMassBalanceResidualMg: 0,
    expectedCumulativeEthanolAdministeredG: 0,
    numericallyIntegratedCumulativeEthanolG: 0,
    ethanolInputDeliveryResidualG: 0,
    ethanolInternalMassBalanceResidualG: 0,
    expectedCumulativeCaffeineAdministeredMg: 0,
    numericallyIntegratedCumulativeCaffeineMg: 0,
    caffeineInputDeliveryResidualMg: 0,
    caffeineInternalMassBalanceResidualMg: 0,
    cumulativeCaffeineEliminatedMg: 0,
    cumulativeCaffeineNotRoutedMg: 0,
    cumulativeParaxanthineEliminatedMg: 0
  } : n.reduce((a, s) => Math.abs(s.tH - t) < Math.abs(a.tH - t) ? s : a, n[0]);
}
function jB(result){
  if(result.exposure.ethanolPresent){const outcome=result.summary.negligibleThresholdOutcome;return outcome?.status==='never-exceeded'?0:outcome?.timeH;}
}
function MB(result){
  if(!result.exposure.caffeinePresent)return {status:'not applicable',thresholdMgL:pB};
  const outcome=result.summary.caffeineDisplayThresholdOutcome??maintenanceThresholdIntervals(result.analysisPoints,pB,'caffeineMgL');
  return {...outcome,thresholdMgL:pB,status:outcome.status==='never-exceeded'?'already below at peak':outcome.rightCensored?'not below within horizon':'below within horizon',
    timeH:outcome.status==='never-exceeded'?result.summary.timeOfPeakCaffeineH:outcome.timeH};
}
function Uu(e, t) {
  const n = eee(e, t);
  if (e.exposure.kind === "none") return {
    point: n,
    phase: "baseline",
    interpretation: "No modeled pharmacological change at this time.",
    ethanolActive: !1,
    caffeineActive: !1
  };
  const a = n.bacGdL >= wM || n.ethanolImpairmentIndex >= Do || n.ethanolSedationIndex >= Do || n.ethanolStimulationIndex >= Do,
    s = n.caffeineMgL >= SM || n.caffeineAlertnessIndex >= Do,
    l = e.exposure.ethanolPresent && Math.abs(n.tH - e.summary.timeOfPeakBACH) <= .25,
    c = n.expectedCumulativeEthanolAdministeredG > 0 || n.expectedCumulativeCaffeineAdministeredMg > 0;
  let d;
  !a && !s ? d = c ? "post-exposure" : "onset" : a && s && e.exposure.meaningfulOverlap ? d = "overlap" : l ? d = "peak" : a && n.bacRateGdLPerH > 1e-4 ? d = "rising exposure" : a ? d = "decline" : d = e.exposure.kind === "combined-sequential" ? "sequential caffeine phase" : "rising exposure";
  let f;
  return a && s && e.exposure.meaningfulOverlap ? f = n.mismatchIndex >= .25 ? "Alertness and perceived control are elevated relative to the concurrent ethanol-linked impairment." : "Ethanol-linked impairment and caffeine-linked alertness are concurrently active." : a ? f = n.ethanolSedationIndex >= n.ethanolStimulationIndex ? "Ethanol-linked impairment with a predominantly sedative state is modeled at this time." : "Ethanol-linked impairment with an earlier stimulatory limb is modeled at this time." : s ? f = "Caffeine-linked alertness is modeled without an active ethanol-effect state at this time." : d === "onset" ? f = "An intake event is scheduled or commencing; modeled concentrations have not yet reached an active effect state." : f = "The modeled pharmacological effect state has returned close to baseline.", {
    point: n,
    phase: d,
    interpretation: f,
    ethanolActive: a,
    caffeineActive: s
  };
}
function NM(e) {
  return "applied" in e ? e : Lm(e);
}
const _r = e => typeof e == "number" ? Number(e.toPrecision(6)).toString() : String(e);
const jee = e => e.doseEvents.length > 0;
const Mee = e => e.doseEvents.some(t => Ta(t, e.constants) > 0);
const tN = e => e.doseEvents.some(t => Na(t) > 0);
const Xx = e => jee(e) ? null : "Add an intake before sweeping first-intake values.";
const vm = [{
  id: "body-mass",
  label: "Body mass",
  kind: "continuous",
  ...Fi("subject.bodyMassKg"),
  units: "kg",
  registryId: "subject.bodyMassKg",
  activeCalculationModes: ["demographic composition"],
  dependencies: ["subject.bodyMassKg", "subject.bodyCompositionMode"],
  affectedOutputDomains: ["concentration", "timing", "integrated", "pd", "behaviour"],
  explanation: "Changes scale mass only when broad demographic composition is active. Measured composition is not silently rescaled.",
  format: e => `${_r(e)} kg`,
  getter: e => e.subject.bodyMassKg,
  setter: (e, t, n) => {
    e.subject.bodyMassKg = Number(n);
  },
  prerequisite: e => e.subject.bodyCompositionMode === "default demographic TBW fraction" ? null : "Measured body composition is active. Sweep a directly measured physiology field instead of changing body mass alone."
}, {
  id: "ethanol-clearance",
  label: "Ethanol clearance modifier",
  kind: "continuous",
  ...Fi("subject.ethanolClearanceModifier"),
  units: "x",
  registryId: "subject.ethanolClearanceModifier",
  activeCalculationModes: ["Michaelis-Menten", "zero-order"],
  dependencies: ["subject.ethanolClearanceModifier", "subject.ethanolEliminationMode"],
  affectedOutputDomains: ["concentration", "timing", "integrated", "pd", "behaviour"],
  explanation: "Scales the active ethanol-elimination pathway.",
  format: e => `${_r(e)}x`,
  getter: e => e.subject.ethanolClearanceModifier,
  setter: (e, t, n) => {
    e.subject.ethanolClearanceModifier = Number(n);
  },
  prerequisite: e => Mee(e) ? null : "No ethanol input is present, so ethanol clearance has no active pathway."
}, {
  id: "caffeine-half-life",
  label: "Effective caffeine half-life",
  kind: "continuous",
  ...Fi("subject.caffeineHalfLifeH"),
  units: "h",
  registryId: "subject.caffeineHalfLifeH",
  activeCalculationModes: ["direct effective half-life"],
  dependencies: ["subject.caffeineHalfLifeH", "subject.caffeineParameterMode"],
  affectedOutputDomains: ["concentration", "timing", "integrated", "pd", "behaviour"],
  explanation: "Changes the active direct effective half-life. Covariate mode uses reference clearance plus CYP1A2 instead.",
  format: e => `${_r(e)} h`,
  getter: e => e.subject.caffeineHalfLifeH,
  setter: (e, t, n) => {
    e.subject.caffeineHalfLifeH = Number(n);
  },
  prerequisite: e => tN(e) ? e.subject.caffeineParameterMode === "direct effective half-life" ? null : "Covariate mode ignores the nominal effective-half-life field. Activate direct effective-half-life mode to sweep it." : "No caffeine input is present, so caffeine half-life has no active pathway.",
  activation: "direct-caffeine"
}, {
  id: "cyp1a2",
  label: "CYP1A2 activity modifier",
  kind: "continuous",
  ...Fi("subject.cyp1a2ActivityModifier"),
  units: "x",
  registryId: "subject.cyp1a2ActivityModifier",
  activeCalculationModes: ["reference clearance + CYP1A2"],
  dependencies: ["subject.referenceCaffeineHalfLifeH", "subject.cyp1a2ActivityModifier", "subject.caffeineParameterMode"],
  affectedOutputDomains: ["concentration", "timing", "integrated", "pd", "behaviour"],
  explanation: "Scales reference caffeine clearance only in covariate mode; direct effective-half-life mode ignores it.",
  format: e => `${_r(e)}x`,
  getter: e => e.subject.cyp1a2ActivityModifier,
  setter: (e, t, n) => {
    e.subject.cyp1a2ActivityModifier = Number(n);
  },
  prerequisite: e => tN(e) ? e.subject.caffeineParameterMode === "direct effective half-life" ? "Direct effective-half-life mode ignores CYP1A2. Activate reference-clearance-plus-CYP1A2 mode to sweep it." : null : "No caffeine input is present, so CYP1A2 has no active pathway.",
  activation: "reference-cyp1a2"
}, {
  id: "first-dose-servings",
  label: "First intake servings",
  kind: "continuous",
  ...Fi("dose.servings"),
  units: "servings",
  registryId: "dose.servings",
  activeCalculationModes: ["all intake modes"],
  dependencies: ["doseEvents[0].servings"],
  affectedOutputDomains: ["concentration", "timing", "integrated", "pd", "behaviour"],
  explanation: "Changes only the first canonical intake event serving count.",
  format: e => `${_r(e)} servings`,
  getter: e => e.doseEvents[0]?.servings ?? 0,
  setter: (e, t, n) => {
    e.doseEvents[0] && (e.doseEvents[0].servings = Number(n));
  },
  prerequisite: Xx
}, {
  id: "first-dose-time",
  label: "First intake start",
  kind: "continuous",
  ...Fi("dose.startTimeH"),
  units: "h",
  registryId: "dose.startTimeH",
  activeCalculationModes: ["elapsed and clock presentation"],
  dependencies: ["doseEvents[0].startTimeH"],
  affectedOutputDomains: ["timing", "pd", "behaviour"],
  explanation: "Moves the first intake on the modeled time axis without changing its dose.",
  format: e => `${_r(e)} h`,
  getter: e => e.doseEvents[0]?.startTimeH ?? 0,
  setter: (e, t, n) => {
    e.doseEvents[0] && (e.doseEvents[0].startTimeH = Number(n));
  },
  prerequisite: Xx
}, {
  id: "food-state",
  label: "Food state",
  kind: "categorical",
  categories: ["fasted", "light meal", "heavy meal", "custom"],
  activeCalculationModes: ["all absorption modes"],
  dependencies: ["subject.foodState", "gastric emptying", "first pass"],
  affectedOutputDomains: ["concentration", "timing", "integrated", "pd", "behaviour"],
  explanation: "Changes the subject-level absorption context while retaining dose events.",
  format: _r,
  getter: e => e.subject.foodState,
  setter: (e, t, n) => {
    e.subject.foodState = n;
  },
  prerequisite: Xx
}, {
  id: "acute-stress",
  label: "Acute stress context",
  kind: "categorical",
  categories: ["unknown", "low", "moderate", "high"],
  temperamentOnly: !0,
  activeCalculationModes: ["behavioural profile interpretation"],
  dependencies: ["behaviourProfile.applied", "behaviourProfile.context.acuteStress"],
  affectedOutputDomains: ["behaviour"],
  explanation: "Changes behavioural interpretation only and cannot alter concentration arrays.",
  format: _r,
  getter: (e, t) => t.context.acuteStress,
  setter: (e, t, n) => {
    t.applied = !0, t.context.acuteStress = n;
  },
  prerequisite: () => null
}, {
  id: "sleep-debt",
  label: "Sleep-debt response modifier",
  kind: "continuous",
  ...Fi("subject.sleepDebtModifier"),
  units: "x",
  registryId: "subject.sleepDebtModifier",
  activeCalculationModes: ["behavioural subject response"],
  dependencies: ["subject.sleepDebtModifier"],
  affectedOutputDomains: ["behaviour"],
  explanation: "Changes the canonical subject-response sleep pathway without changing concentration or base dose arithmetic.",
  format: e => `${_r(e)}x`,
  getter: e => e.subject.sleepDebtModifier,
  setter: (e, t, n) => {
    e.subject.sleepDebtModifier = Number(n);
  },
  prerequisite: () => null
}, {
  id: "perceived-control-response",
  label: "Perceived-control calibration",
  kind: "continuous",
  ...Fi("subject.perceivedControlCalibration"),
  units: "x",
  registryId: "subject.perceivedControlCalibration",
  activeCalculationModes: ["existing PD response pathway"],
  dependencies: ["subject.perceivedControlCalibration"],
  affectedOutputDomains: ["pd", "behaviour"],
  explanation: "Changes the existing perceived-control PD transform and downstream registered calibration axes, never concentration.",
  format: e => `${_r(e)}x`,
  getter: e => e.subject.perceivedControlCalibration,
  setter: (e, t, n) => {
    e.subject.perceivedControlCalibration = Number(n);
  },
  prerequisite: () => null
}];
const mr = [{
  id: "peak-bac",
  label: "Peak BAC",
  units: "g/dL",
  domain: "concentration"
}, {
  id: "peak-caffeine",
  label: "Peak caffeine",
  units: "mg/L",
  domain: "concentration"
}, {
  id: "time-peak-bac",
  label: "Time to peak BAC",
  units: "h",
  domain: "timing"
}, {
  id: "time-peak-caffeine",
  label: "Time to peak caffeine",
  units: "h",
  domain: "timing"
}, {
  id: "negligible-bac",
  label: "Negligible modeled BAC time",
  units: "h",
  domain: "timing",
  typedTemporal: !0
}, {
  id: "threshold-return",
  label: "Configured-threshold return",
  units: "h",
  domain: "timing",
  typedTemporal: !0
}, {
  id: "overlap-duration",
  label: "Ethanol-caffeine overlap",
  units: "h",
  domain: "timing"
}, {
  id: "bac-auc",
  label: "BAC AUC",
  units: "g h/dL",
  domain: "integrated"
}, {
  id: "caffeine-auc",
  label: "Caffeine AUC",
  units: "mg h/L",
  domain: "integrated"
}, {
  id: "max-impairment",
  label: "Maximum impairment",
  units: "/100",
  domain: "pd"
}, {
  id: "max-alertness",
  label: "Maximum alertness",
  units: "/100",
  domain: "pd"
}, {
  id: "max-mismatch",
  label: "Maximum mismatch",
  units: "/100",
  domain: "pd"
}, {
  id: "behaviour-axis-maximum",
  label: "Registered axis maximum",
  units: "/100",
  domain: "behaviour",
  behavioural: !0
}, {
  id: "behaviour-axis-maximum-time",
  label: "Time of registered axis maximum",
  units: "h",
  domain: "behaviour",
  behavioural: !0
}, {
  id: "behaviour-axis-duration-high",
  label: "Duration above registered material band",
  units: "h",
  domain: "behaviour",
  behavioural: !0
}, {
  id: "behaviour-episode-duration",
  label: "Selected state-signature episode duration",
  units: "h",
  domain: "behaviour",
  behavioural: !0
}, {
  id: "behaviour-selected-axis",
  label: "Registered axis at inspection time",
  units: "/100",
  domain: "behaviour",
  behavioural: !0
}, {
  id: "behaviour-state-signature",
  label: "Dominant episode state signature",
  units: "state",
  domain: "behaviour",
  behavioural: !0
}];
function Fo(e) {
  return vm.find(t => t.id === e) ?? vm[0];
}
function bu(e, t, n) {
  const a = e.prerequisite(t, NM(n));
  return {
    active: !a,
    reason: a ?? void 0,
    compatibleOutputs: mr.filter(s => e.affectedOutputDomains.includes(s.domain) && (!e.temperamentOnly || s.behavioural)).map(s => s.id)
  };
}
function Cee(e, t, n) {
  const a = Fo(e.factorId),
    s = [],
    l = bu(a, t, n),
    c = cheapValidation(t);
  return c.status === "invalid" && s.push({
    field: "factor",
    code: "invalid-baseline",
    message: `Baseline scenario is invalid: ${c.messages.map(d => d.message).join(" ")}`
  }), l.active || s.push({
    field: "factor",
    code: "inactive-factor",
    message: l.reason ?? "The selected factor is not active."
  }), a.kind === "continuous" ? ((!Number.isFinite(e.min) || e.min < a.min || e.min > a.max) && s.push({
    field: "minimum",
    code: "minimum-out-of-domain",
    message: `Minimum must be within ${a.min}-${a.max} ${a.units}.`
  }), (!Number.isFinite(e.max) || e.max < a.min || e.max > a.max) && s.push({
    field: "maximum",
    code: "maximum-out-of-domain",
    message: `Maximum must be within ${a.min}-${a.max} ${a.units}.`
  }), Number.isFinite(e.min) && Number.isFinite(e.max) && e.min >= e.max && s.push({
    field: "maximum",
    code: "range-order",
    message: "Maximum must be greater than minimum."
  }), (!Number.isInteger(e.evaluations) || e.evaluations < 3 || e.evaluations > 31) && s.push({
    field: "evaluations",
    code: "evaluation-count",
    message: "Evaluations must be a whole number from 3 to 31."
  })) : e.categories.length < 2 && s.push({
    field: "categories",
    code: "category-count",
    message: "Select at least two categories to compare."
  }), (e.outputIds.length === 0 || !e.outputIds.some(d => l.compatibleOutputs.includes(d))) && s.push({
    field: "outputs",
    code: "no-compatible-output",
    message: "Select at least one output from the active factor pathway."
  }), s;
}
function See(e, t, n, a) {
  const s = {
      subject: It(e.subject),
      doseEvents: Zn(e.doseEvents),
      constants: Oa(e.constants)
    },
    l = Mn(NM(t));
  return Fo(n).setter(s, l, a), {
    scenario: s,
    profile: l
  };
}
function Aee(e) {
  if (!e.exposure.ethanolPresent) return {
    status: "not_applicable"
  };
  if (e.summary.peakBACGdL <= .001) return {
    status: "never_exceeded"
  };
  const t = e.analysisPoints.filter(n => n.tH >= e.summary.timeOfPeakBACH).find(n => n.bacGdL <= .001)?.tH;
  return typeof t == "number" ? {
    status: "returned_at",
    value: t
  } : {
    status: "not_reached_within_horizon"
  };
}
function Eee(e) {
  const t = e.summary.legalThresholdOutcome;
  return t.status === "never-exceeded" ? {
    status: "never_exceeded"
  } : t.status === "not-evaluable" ? {
    status: "not_applicable"
  } : (t.status === "crossed-returned" || t.status === "above-at-start-returned") && typeof t.timeH == "number" ? {
    status: "returned_at",
    value: t.timeH
  } : {
    status: "not_reached_within_horizon"
  };
}
function kee(e) {
  let t = 0;
  for (let n = 1; n < e.analysisPoints.length; n += 1) {
    const a = e.analysisPoints[n];
    a.bacGdL > .001 && a.caffeineMgL > .01 && (t += a.tH - e.analysisPoints[n - 1].tH);
  }
  return t;
}
function kj(e, t, n, a, acceptedNumerical, acceptedBehavioural) {
  const s = See(e, t, n.factorId, a),
    l = acceptedNumerical ?? Mr(s.scenario.subject, s.scenario.doseEvents, s.scenario.constants),
    c = wu(l, s.scenario);
  if (c.status === "invalid") return {
    status: "invalid",
    factorValue: a,
    outputs: {},
    outcomes: {},
    categoricalOutputs: {},
    validationMessages: c.messages
  };
  const d = {},
    f = {},
    h = {},
    p = n.outputIds.some(b => mr.find(x => x.id === b)?.behavioural) ? (acceptedBehavioural ?? zi(l, s.scenario.subject, s.profile)) : null,
    v = n.behaviourAxisId ?? "confidencePerformanceMismatch";
  for (const b of n.outputIds) {
    if (b === "peak-bac" && (d[b] = l.summary.peakBACGdL), b === "time-peak-bac" && (d[b] = l.summary.timeOfPeakBACH), b === "peak-caffeine" && (d[b] = l.summary.peakCaffeineMgL), b === "time-peak-caffeine" && (d[b] = l.summary.timeOfPeakCaffeineH), b === "bac-auc" && (d[b] = l.summary.bacAucGdLH), b === "caffeine-auc" && (d[b] = l.summary.caffeineAucMgHL), b === "max-impairment" && (d[b] = l.summary.maxImpairmentIndex * 100), b === "max-alertness" && (d[b] = l.summary.maxAlertnessIndex * 100), b === "max-mismatch" && (d[b] = l.summary.maxMismatchIndex * 100), b === "negligible-bac" && (f[b] = Aee(l)), b === "threshold-return" && (f[b] = Eee(l)), b === "overlap-duration" && (d[b] = kee(l)), p?.status === "valid" && ((b === "behaviour-axis-maximum" || b === "behavioural-score") && (d[b] = p.summary.axisMaxima[v].value ?? 0), b === "behaviour-axis-maximum-time" && (d[b] = p.summary.axisMaxima[v].timeH ?? 0), b === "behaviour-axis-duration-high" && (d[b] = p.summary.axisDurations[v].durationH ?? 0), b === "behaviour-episode-duration" && (d[b] = p.summary.episodes.filter(w => w.stateSignatureId === (n.episodeSignatureId ?? "alert-but-impaired")).reduce((w, g) => w + Math.max(0, g.endH - g.startH), 0)), b === "behaviour-selected-axis" && (d[b] = br(p, n.selectedTimeH ?? 0)?.axisValues[v] ?? 0), b === "behaviour-state-signature")) {
      const w = p.summary.episodes.find(g => g.id === p.summary.dominantEpisodeId);
      h[b] = w ? ea(w.stateSignatureId) : "Baseline";
    }
    const x = f[b];
    x?.status === "returned_at" && typeof x.value == "number" && (d[b] = x.value);
  }
  return {
    status: "valid",
    factorValue: a,
    outputs: d,
    outcomes: f,
    categoricalOutputs: h,
    validationMessages: []
  };
}
const Vi = "1.0.1";
const tg = "ethanol-caffeine-pk-scenario";
const Cr = "0.8.2";
const zp = "0.8.3";
const Pj = "0.4.4";
const TB = "0.3.0";
const NB = "0.4.2";
const OB = Ts;
const Iee = "2026-10-22";
const qt = {
  formalModelName: "Ethanol-Caffeine PK Interaction Model",
  appVersion: Vi,
  scenarioSchema: tg,
  scenarioSchemaVersion: Cr,
  modelEngineVersion: Pj,
  maintenanceRelease: "1.0.1",
  buildFingerprint: "__MAINTENANCE_BUILD_FINGERPRINT__",
  engineCompatibility: Pj,
  constantsVersion: TB,
  presetSetVersion: NB,
  behaviouralModelVersion: Ts,
  behaviouralCoefficientVersion: Ts,
  behaviouralAxisRegistryVersion: $m,
  behaviouralInteractionRegistryVersion: Ro,
  behaviouralCoefficientRegistryVersion: Rm,
  behaviouralNarrativeVersion: Ho,
  bacPhenotypeRegistryVersion: Vv,
  bacSeverityRegistryVersion: X_,
  temperamentCoefficientVersion: OB,
  buildDate: Iee,
  localOfflineStatus: "Local offline build: all calculations run in the browser."
};
const $ee = "0.5.0";
const Ree = Object.freeze([{
  field: "bodyMassKg",
  role: "direct-pk-input",
  affects: ["distribution", "caffeine Vd"],
  note: "Used directly in distribution and concentration calculations."
}, {
  field: "sexOrPhysiologyMode",
  role: "direct-pk-input",
  affects: ["default TBW fraction", "Watson TBW"],
  note: "Selects physiology-specific distribution defaults and formulas."
}, {
  field: "heightCm",
  role: "direct-pk-input",
  affects: ["Watson TBW", "BMI"],
  note: "Used when the selected composition model requires stature."
}, {
  field: "bodyFatPercent",
  role: "direct-pk-input",
  affects: ["lean mass", "fat mass", "TBW"],
  note: "Used in composition-aware distribution modes."
}, {
  field: "leanMassKg",
  role: "direct-pk-input",
  affects: ["TBW", "FFM-scaled Vmax"],
  note: "Used only in modes that explicitly support measured lean mass."
}, {
  field: "fatMassKg",
  role: "direct-pk-input",
  affects: ["composition validation"],
  note: "Used with lean mass to reconcile total body mass."
}, {
  field: "skeletalMuscleMassKg",
  role: "inactive-metadata",
  affects: [],
  note: "Surfaced for physiological context; not an independent PK coefficient."
}, {
  field: "ffmi",
  role: "derived-pk-input",
  affects: ["assumption display"],
  note: "Derived from lean mass and height; not separately multiplied into PK."
}, {
  field: "foodState",
  role: "direct-pk-input",
  affects: ["gastric emptying", "first pass"],
  note: "Selects absorption and first-pass parameters."
}, {
  field: "sugarGrams",
  role: "context-only",
  affects: ["report context"],
  note: "Recorded but does not alter the current PK/PD equations."
}, {
  field: "carbonation",
  role: "context-only",
  affects: ["report context"],
  note: "Recorded but does not alter the current PK/PD equations."
}, {
  field: "androgenExposureNote",
  role: "inactive-metadata",
  affects: [],
  note: "Narrative context only; no androgen coefficient exists in the model."
}, {
  field: "temperamentProfile",
  role: "behavioural-modifier",
  affects: ["interpreted behaviour state"],
  note: "Bounded modifier applied after PK and PD; never changes BAC or caffeine curves."
}, {
  field: "behaviourProfile.applied",
  role: "behavioural-modifier",
  affects: ["registered behavioural axes"],
  note: "Activates bounded profile and context refinements without changing PK or base PD arrays."
}, {
  field: "behaviourProfile.traits.bigFive",
  role: "behavioural-modifier",
  affects: ["eligible expression and regulation axes"],
  note: "Coverage-resolved percentile inputs are bounded by each axis trait cap and cannot lower ethanol functional floors."
}, {
  field: "behaviourProfile.traits.bigFiveFacets",
  role: "behavioural-modifier",
  affects: ["coverage-weighted Big Five domains"],
  note: "Supplied facets influence their parent domain in proportion to registered facet coverage."
}, {
  field: "behaviourProfile.traits.advancedTraits",
  role: "behavioural-modifier",
  affects: ["eligible self-appraisal and expression axes"],
  note: "Optional bounded channels with named interaction pathways; no concentration effect."
}, {
  field: "behaviourProfile.traits.advancedTraitFacets",
  role: "behavioural-modifier",
  affects: ["coverage-weighted advanced traits"],
  note: "Optional facets resolve through their registered parent before bounded axis use."
}, {
  field: "behaviourProfile.context.socialScale",
  role: "behavioural-modifier",
  affects: ["social expressivity"],
  note: "Orthogonal acute context; cannot create a drug-linked state by itself."
}, {
  field: "behaviourProfile.context.socialFamiliarity",
  role: "behavioural-modifier",
  affects: ["social expressivity", "self monitoring"],
  note: "Orthogonal acute context within the registered context cap."
}, {
  field: "behaviourProfile.context.environmentalStimulation",
  role: "behavioural-modifier",
  affects: ["wakeful activation", "social expressivity"],
  note: "Shapes activation expression without changing concentration or functional floors."
}, {
  field: "behaviourProfile.context.accountability",
  role: "behavioural-modifier",
  affects: ["stopping-rule resistance", "self monitoring"],
  note: "Protective regulation input that cannot reduce objective impairment."
}, {
  field: "behaviourProfile.context.conflictLoad",
  role: "behavioural-modifier",
  affects: ["conflict reactivity"],
  note: "Conflict-sensitive expression only; it is not an aggression prediction."
}, {
  field: "behaviourProfile.context.taskDemand",
  role: "behavioural-modifier",
  affects: ["divided-attention salience"],
  note: "Describes acute task demands without changing the functional core."
}, {
  field: "behaviourProfile.context.sessionIntent",
  role: "behavioural-modifier",
  affects: ["stopping-rule resistance"],
  note: "Bounded continuation-context pathway without diagnostic inference."
}, {
  field: "behaviourProfile.context.stoppingPlan",
  role: "behavioural-modifier",
  affects: ["stopping-rule resistance"],
  note: "Protective plan salience cannot reduce objective impairment."
}, {
  field: "behaviourProfile.context.acuteStress",
  role: "behavioural-modifier",
  affects: ["anxious activation", "affective volatility"],
  note: "Orthogonal acute stress input within the registered context cap."
}, {
  field: "behaviourProfile.context.substanceFamiliarity",
  role: "behavioural-modifier",
  affects: ["perceived control", "confidence-performance mismatch"],
  note: "Familiarity may shape self-appraisal but never lower impairment or motor unreliability."
}, {
  field: "behaviourProfile.traits.sourceBasis",
  role: "inactive-metadata",
  affects: [],
  note: "Descriptive source metadata; does not activate or suppress profile mathematics."
}, {
  field: "behaviourProfile.traits.instrumentName",
  role: "inactive-metadata",
  affects: [],
  note: "Descriptive instrument metadata only."
}, {
  field: "behaviourProfile.narrativeMetadata.mbtiType",
  role: "inactive-metadata",
  affects: [],
  note: "Narrative metadata with zero numeric coverage or coefficient authority."
}, {
  field: "behaviourProfile.narrativeMetadata.mbtiVariant",
  role: "inactive-metadata",
  affects: [],
  note: "Narrative metadata with zero numeric coverage or coefficient authority."
}, {
  field: "sleepDebtModifier",
  role: "behavioural-modifier",
  affects: ["alertness", "perceived control", "mismatch"],
  note: "Applied to the PD/behaviour layer without changing concentrations."
}, {
  field: "ethanolToleranceModifier",
  role: "behavioural-modifier",
  affects: ["ethanol PD"],
  note: "Changes effect interpretation, not ethanol mass or BAC."
}]);
const Hee = "ethanol-caffeine-pk-results";
const BB = zp;
function Fee(){return kernelEnvironment.nowISO;}
function ng(e) {
  const t = e.behavioural?.status === "valid" ? e.behavioural : null,
    n = e.behaviourProfile ?? hn();
  return {
    schema: Hee,
    schemaVersion: BB,
    generatedAt: Fee(),
    versions: {
      ...qt,
      provenanceRegistryVersion: Ku,
      causalFieldRegistryVersion: $ee
    },
    scenario: {
      title: e.title,
      notes: e.notes,
      subject: e.subject,
      doseEvents: e.doseEvents,
      constants: e.constants
    },
    derived: {
      distribution: e.result.distribution,
      doseAccounting: e.result.doseAccounting,
      exposure: e.result.exposure,
      summary: e.result.summary,
      convergence: e.result.convergence,
      solver: e.result.solver,
      numericalValidity: e.result.numericalValidity,
      integrity: e.result.integrity
    },
    ...(e.includeBehavioralInterpretation === !1 || !t ? {} : {
      behaviouralModel: {
        version: Ts,
        axisRegistryVersion: $m,
        interactionRegistryVersion: Ro,
        coefficientRegistryVersion: Rm,
        narrativeRegistryVersion: Ho,
        provenanceVersion: Ku
      },
      behaviouralBasis: t.summary.basis,
      behaviourProfile: e.behaviourProfile,
      behaviourProfileResolution: t.profileResolution,
      behaviouralSeries: t.points.map(a => ({
        timeH: a.tH,
        phaseId: a.phaseId,
        stateSignatureId: a.stateSignatureId,
        basisCode: a.basis.code,
        axes: a.axisValues,
        axisDecomposition: a.axisDecomposition,
        psychodynamicGestalt: a.psychodynamicGestalt,
        narrative: qi(a, n, {
          scope: "selected-time",
          scopeLabel: `At ${a.tH} h`,
          detail: "expert"
        })
      })),
      behaviouralEpisodes: t.summary.episodes,
      behaviouralSummary: t.summary
    }),
    ...(e.behavioral && !t ? {
      deprecatedCompatibility: {
        legacyBehavioralPhenotype: e.behavioral,
        legacyTemperamentProfile: e.temperamentProfile
      }
    } : {}),
    assumptionLedger: e.assumptions,
    provenanceIds: ny.map(a => a.parameterId),
    causalFieldRegistry: Ree,
    timeSeries: e.result.analysisPoints,
    validationMessages: e.result.validationMessages
  };
}
function zee(e) {
  const t = String(e);
  return /[",\r\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
}
function OM(e, t = hn()) {
  const n = ["time_h", ...jt, "phase_id", "state_signature_id", "basis_code", "gestalt_signature", "gestalt_dominant_tension", "narrative_version", "narrative_headline", "narrative_plain_synopsis", "selected_clause_ids", "suppressed_clause_ids", "selected_entailment_ids", "suppression_reasons", "narrative_provenance_ids"];
  if (e.status === "invalid") return n.join(",");
  const a = e.points.map(s => {
    const l = qi(s, t, {
      scope: "selected-time",
      scopeLabel: `At ${s.tH} h`,
      detail: "expert"
    });
    return [s.tH, ...jt.map(c => s.axisValues[c]), s.phaseId, s.stateSignatureId, s.basis.code, s.psychodynamicGestalt.stateSignature, s.psychodynamicGestalt.dominantTension, l.narrativeVersion, l.headline, l.plainSynopsis, l.selectedClauseIds.join("|"), l.suppressedClauseIds.join("|"), l.semanticEntailments.map(c => c.id).join("|"), Object.entries(l.suppressedClauseReasons).map(([c, d]) => c + ":" + d).join("|"), l.provenanceIds.join("|")].map(zee).join(",");
  });
  return [n.join(","), ...a].join(`\r
`);
}
const ag = [["time_h", e => e.tH], ["bac_g_dL", e => e.bacGdL], ["gastric_ethanol_g", e => e.gastricEthanolG], ["intestinal_ethanol_g", e => e.intestinalEthanolG], ["central_ethanol_g", e => e.centralEthanolG], ["eliminated_ethanol_g", e => e.eliminatedEthanolG], ["first_pass_ethanol_g", e => e.firstPassEthanolG], ["caffeine_gut_mg", e => e.caffeineGutMg], ["caffeine_central_mg", e => e.caffeineCentralMg], ["caffeine_mg_L", e => e.caffeineMgL], ["paraxanthine_central_mg", e => e.paraxanthineCentralMg ?? 0], ["ethanol_impairment_index_0_1", e => e.ethanolImpairmentIndex], ["caffeine_alertness_index_0_1", e => e.caffeineAlertnessIndex], ["combined_alertness_index_0_1", e => e.combinedAlertnessIndex], ["perceived_control_index_0_1", e => e.perceivedControlIndex], ["mismatch_index_0_1", e => e.mismatchIndex], ["bac_rate_g_dL_h", e => e.bacRateGdLPerH], ["ethanol_balance_residual_g", e => e.ethanolMassBalanceResidualG], ["caffeine_balance_residual_mg_equivalent", e => e.caffeineMassBalanceResidualMg]];
function IM(e) {
  const t = e.analysisPoints.map(n => ag.map(([, a]) => {
    const s = a(n);
    return typeof s == "number" ? String(s) : s;
  }).join(","));
  return [ag.map(([n]) => n).join(","), ...t].join(`\r
`);
}
function Jee(e, t) {
  return e.reduce((n, a) => !n || t(a) > t(n) ? a : n, void 0);
}
function Qee(e, t) {
  const n = Math.max(0, e.points.at(-1)?.tH ?? 0),
    a = [],
    s = t.filter(d => d.startTimeH >= 0 && d.startTimeH <= n).sort((d, f) => d.startTimeH - f.startTimeH)[0];
  s && a.push({
    id: "first-intake",
    label: "First intake",
    timeH: s.startTimeH,
    kind: "event",
    description: s.label
  }), e.exposure.ethanolPresent && a.push({
    id: "peak-bac",
    label: "Peak BAC",
    timeH: e.summary.timeOfPeakBACH,
    kind: "ethanol",
    description: `Peak BAC ${e.summary.peakBACGdL.toFixed(4)} g/dL`
  }), e.exposure.caffeinePresent && a.push({
    id: "peak-caffeine",
    label: "Peak caffeine",
    timeH: e.summary.timeOfPeakCaffeineH,
    kind: "caffeine",
    description: `Peak caffeine ${e.summary.peakCaffeineMgL.toFixed(3)} mg/L`
  });
  for(const dose of t.filter(d=>d.startTimeH>=0&&d.startTimeH<=n).sort((a,b)=>a.startTimeH-b.startTimeH).slice(1)) a.push({id:'intake-'+dose.id,label:'Intake: '+dose.label,timeH:dose.startTimeH,kind:'event',description:dose.label});
  for(const [prefix,outcome] of [['vehicle',e.summary.vehicleThresholdOutcome],['negligible',e.summary.negligibleThresholdOutcome]]) for(const [i,crossing] of (outcome?.crossings??[]).entries()) a.push({id:prefix+'-crossing-'+i,label:(crossing.direction==='up'?'Above ':'Below ')+(prefix==='vehicle'?'vehicle reference':'negligible BAC')+(outcome.recrossingCount?' (episode crossing)':''),timeH:crossing.timeH,kind:'threshold',description:'Configured schedule; '+outcome.threshold+' g/dL'});
  const l = MB(e);
  if (l.status === "below within horizon" && typeof l.timeH == "number" && a.push({
    id: "caffeine-below-display-threshold",
    label: "Caffeine near baseline",
    timeH: l.timeH,
    kind: "caffeine",
    description: `Interpolated crossing below ${l.thresholdMgL} mg/L`
  }), e.exposure.kind === "combined-overlap" || e.exposure.kind === "combined-sequential") {
    const d = Jee(e.analysisPoints, f => f.mismatchIndex);
    d && a.push({
      id: "maximum-mismatch",
      label: e.exposure.meaningfulOverlap ? "Maximum mismatch" : "Strongest overlap",
      timeH: d.tH,
      kind: "overlap",
      description: `Mismatch index ${(d.mismatchIndex * 100).toFixed(1)}/100`
    });
  }
  if (e.summary.legalThresholdOutcome.status === "crossed-returned" || e.summary.legalThresholdOutcome.status === "above-at-start-returned") {
    const d = e.summary.legalThresholdOutcome.timeH ?? e.summary.bacBelowLegalAfterPeakH;
    typeof d == "number" && a.push({
      id: "comparison-threshold-return",
      label: "Below comparison threshold",
      timeH: d,
      kind: "threshold",
      description: "Modeled return below the configured analytical comparison threshold"
    });
  }
  const c = jB(e);
  return e.exposure.ethanolPresent && typeof c == "number" && a.push({
    id: "negligible-bac",
    label: "Negligible modeled BAC",
    timeH: c,
    kind: "ethanol",
    description: "BAC falls below the model's negligible display threshold"
  }), a.push({
    id: "modeled-horizon",
    label: "Modeled horizon",
    timeH: n,
    kind: "horizon",
    description: "End of the configured simulation horizon"
  }), a.filter(d => Number.isFinite(d.timeH) && d.timeH >= 0 && d.timeH <= n).sort((d, f) => d.timeH - f.timeH || d.label.localeCompare(f.label));
}
function kN(e) {
  return e ? "yes" : "no";
}
function PN(e) {
  return e.length === 0 ? "no dose events" : e.map(t => {
    const n = t.durationMin / 60;
    return `${t.label || t.id}: ${we(t.startTimeH, 2)}-${we(t.startTimeH + n, 2)} h`;
  }).join("; ");
}
function Ite(e, t) {
  return MM(e.foodState, t).firstPassFraction;
}
function VB(e) {
  const {
      subject: t,
      doses: n,
      constants: a,
      result: s,
      behavioural: l,
      temperamentEnabled: c
    } = e,
    d = e.profileApplied ?? c ?? !1,
    f = s.distribution,
    h = MM(t.foodState, a),
    p = n.reduce((w, g) => w + Ta(g, a), 0),
    v = n.reduce((w, g) => w + Na(g), 0),
    b = t.ethanolEliminationMode === "zero-order" ? `${we(qv(a.zeroOrderEliminationGdLPerH, f) * t.ethanolClearanceModifier, 2)} g/h equivalent` : `Michaelis-Menten effective Vmax ${we(Xv(t, a, f).valueGPerH * t.ethanolClearanceModifier, 2)} g/h; Km ${we(a.michaelisMentenKmGdL, 3)} g/dL`,
    x = f.calculationMode === "TBW-based" ? `TBW ${we(f.tbwL, 1)} L; fraction ${we(f.tbwFraction, 3)}` : `apparent Vd ${we(f.apparentVdL, 1)} L; ${we(f.apparentVdLPerKg, 3)} L/kg`;
  return [{
    id: "bac",
    title: "Peak BAC / BAC Curve",
    items: [{
      label: "Scheduled ethanol",
      value: `${ke(p, 1)} g`
    }, {
      label: "In-horizon delivered ethanol",
      value: `${ke(s.summary.inHorizonEthanolG, 1)} g`
    }, {
      label: "Post-horizon excluded ethanol",
      value: `${ke(s.summary.postHorizonEthanolG, 1)} g`
    }, {
      label: "Dose timing and duration",
      value: PN(n)
    }, {
      label: "Food state",
      value: t.foodState
    }, {
      label: "Gastric emptying modifier",
      value: `base ${we(h.gastricEmptyingRatePerH, 2)} /h x ${we(t.gastricEmptyingModifier, 2)}`
    }, {
      label: "First-pass fraction",
      value: we(Ite(t, a), 3)
    }, {
      label: "Distribution mode",
      value: f.calculationMode
    }, {
      label: "Distribution formula",
      value: f.formula
    }, {
      label: "Distribution provenance",
      value: `${f.source}; ${f.estimateStatus}`
    }, {
      label: "Body mass",
      value: `${ke(t.bodyMassKg, 1)} kg`
    }, {
      label: "Body composition",
      value: f.calculationMode === "TBW-based" ? `lean ${we(f.leanMassKg, 1)} kg; fat ${we(f.fatMassKg, 1)} kg; body fat ${we(f.bodyFatPercent, 1)}%` : `BMI ${we(f.bmi, 1)}; apparent-volume frame`
    }, {
      label: "TBW / apparent Vd",
      value: x
    }, {
      label: "Ethanol elimination",
      value: `${t.ethanolEliminationMode}; ${b}`
    }, {
      label: "Simulation duration",
      value: Ce(t.simulationDurationH)
    }, {
      label: "Internal integration step",
      value: `${we(s.solver.internalStepMin, 2)} min`
    }, {
      label: "Display sampling interval",
      value: `${we(s.solver.outputStepMin, 1)} min`
    }]
  }, {
    id: "caffeine",
    title: "Peak Caffeine / Caffeine Curve",
    items: [{
      label: "Scheduled caffeine",
      value: `${ke(v, 0)} mg`
    }, {
      label: "In-horizon delivered caffeine",
      value: `${ke(s.summary.inHorizonCaffeineMg, 0)} mg`
    }, {
      label: "Dose timing and duration",
      value: PN(n)
    }, {
      label: "Caffeine absorption modifier",
      value: `base ${we(a.caffeineAbsorptionRatePerH, 2)} /h x ${we(t.caffeineAbsorptionModifier, 2)}`
    }, {
      label: "Caffeine parameter mode",
      value: t.caffeineParameterMode
    }, {
      label: "Active caffeine half-life",
      value: `${we(t.caffeineParameterMode === "direct effective half-life" ? t.caffeineHalfLifeH : t.referenceCaffeineHalfLifeH, 2)} h`
    }, {
      label: "Caffeine Vd",
      value: `${we(a.caffeineVdLPerKg, 2)} L/kg`
    }, {
      label: "CYP1A2 / caffeine clearance modifier",
      value: t.caffeineParameterMode === "direct effective half-life" ? "ignored in direct mode" : `x${we(t.cyp1a2ActivityModifier, 2)}`
    }, {
      label: "Paraxanthine-like tail",
      value: kN(a.paraxanthineApproximationEnabled)
    }, {
      label: "Ethanol-mediated caffeine-clearance interaction",
      value: kN(a.optionalEthanolInhibitsCaffeineClearance)
    }, {
      label: "Final caffeine at horizon",
      value: `${ke(s.summary.finalCaffeineMgL, 2)} mg/L`
    }]
  }, {
    id: "mismatch",
    title: "Behavioural Mismatch",
    items: [{
      label: "BAC-driven impairment source",
      value: `peak BAC ${ke(s.summary.peakBACGdL, 3)} g/dL`
    }, {
      label: "Ethanol stimulation/sedation source",
      value: `PD EC50 ${we(a.ethanolEC50GdL, 3)} g/dL; Hill ${we(a.ethanolHill, 2)}`
    }, {
      label: "Caffeine alertness source",
      value: `EC50 ${we(a.caffeineEC50MgL, 2)} mg/L; Hill ${we(a.caffeineHill, 2)}`
    }, {
      label: "Perceived-control source",
      value: `baseline alertness ${we(t.baselineAlertnessIndex, 2)}; sedative response x${we(t.sedativeToleranceModifier, 2)}, perceived-control calibration x${we(t.perceivedControlCalibration, 2)}, caffeine response x${we(t.caffeineToleranceModifier, 2)}`
    }, {
      label: "Sleep/context modifier",
      value: `sleep debt x${we(t.sleepDebtModifier, 2)}`
    }, {
      label: "Behavioural basis",
      value: l?.status === "valid" ? l.summary.basis.label : "not generated"
    }, {
      label: "Profile refinement",
      value: d ? "applied within registered caps" : "PK/PD only"
    }, {
      label: "Dominant behavioural state",
      value: l?.status === "valid" && l.summary.dominantEpisodeId ? ea(l.summary.episodes.find(w => w.id === l.summary.dominantEpisodeId)?.stateSignatureId ?? "baseline") : "baseline / no active episode"
    }],
    note: "Caffeine does not reduce BAC; it can alter alertness/perceived control."
  }, {
    id: "thresholds",
    title: "Threshold Crossings",
    items: [{
      label: "Vehicle reference threshold",
      value: `${ke(t.vehicleZeroToleranceThresholdGdL, 3)} g/dL`
    }, {
      label: "Configured comparison threshold",
      value: `${ke(t.legalBACThresholdGdL, 3)} g/dL`
    }, {
      label: "Vehicle-reference threshold outcome after peak",
      value: Ql(s.summary.vehicleThresholdOutcome)
    }, {
      label: "Comparison-threshold outcome after peak",
      value: Ql(s.summary.legalThresholdOutcome)
    }, {
      label: "Final BAC at horizon",
      value: `${ke(s.summary.finalBACGdL, 3)} g/dL`
    }]
  }];
}
function o0(e,t){const n=cheapValidation({...e,constants:e.constants??bt(e.subject.bodyMassKg)});return {errors:n.messages.filter(a=>a.level==='error').map(a=>t+': '+a.message),warnings:n.messages.filter(a=>a.level!=='error').map(a=>t+': '+a.message)};}
function Qte(e) {
  const {
      subject: t,
      doses: n,
      result: a
    } = e,
    s = a.integrity,
    l = a.validationMessages.some(d => d.level === "error"),
    c = a.validationMessages.some(d => d.level === "warning");
  return {
    validationState: l ? "errors" : c ? "warnings" : "valid",
    massBalancePassed: s.massBalancePassed,
    converged: s.solver.converged,
    numericalRepairRequired: s.solver.numericalRepairRequired,
    sections: [{
      title: "Ethanol conservation",
      items: [{
        label: "Administered through horizon",
        value: `${ke(s.ethanol.administeredThroughHorizonG, 4)} g`
      }, {
        label: "Numerically integrated input",
        value: `${ke(s.ethanol.numericallyIntegratedDoseG, 4)} g`
      }, {
        label: "Gastric remainder",
        value: `${ke(s.ethanol.gastricRemainderG, 4)} g`
      }, {
        label: "Intestinal remainder",
        value: `${ke(s.ethanol.intestinalRemainderG, 4)} g`
      }, {
        label: "Central amount",
        value: `${ke(s.ethanol.centralAmountG, 4)} g`
      }, {
        label: "First-pass loss",
        value: `${ke(s.ethanol.firstPassLossG, 4)} g`
      }, {
        label: "Eliminated amount",
        value: `${ke(s.ethanol.eliminatedAmountG, 4)} g`
      }, {
        label: "Input-delivery residual",
        value: `${ke(s.ethanol.inputDeliveryResidualG, 7)} g`
      }, {
        label: "Final external residual",
        value: `${ke(s.ethanol.finalResidualG, 7)} g`
      }, {
        label: "Maximum absolute residual",
        value: `${ke(s.ethanol.maximumAbsoluteResidualG, 7)} g`
      }, {
        label: "Relative error",
        value: `${ke(s.ethanol.relativeError * 100, 6)}%`
      }, {
        label: "Pass tolerance",
        value: `${ke(s.tolerance.ethanolAbsoluteG, 7)} g`
      }]
    }, {
      title: "Caffeine conservation",
      items: [{
        label: "Administered through horizon",
        value: `${ke(s.caffeine.administeredThroughHorizonMg, 4)} mg`
      }, {
        label: "Numerically integrated input",
        value: `${ke(s.caffeine.numericallyIntegratedDoseMg, 4)} mg`
      }, {
        label: "Gut remainder",
        value: `${ke(s.caffeine.gutRemainderMg, 4)} mg`
      }, {
        label: "Parent central amount",
        value: `${ke(s.caffeine.centralAmountMg, 4)} mg`
      }, {
        label: "Parent eliminated",
        value: `${ke(s.caffeine.eliminatedParentMg, 4)} mg`
      }, {
        label: "Parent not routed to paraxanthine",
        value: `${ke(s.caffeine.notRoutedToParaxanthineMg, 4)} mg`
      }, {
        label: "Paraxanthine actual mass",
        value: `${ke(s.caffeine.paraxanthineActualMassMg, 4)} mg`
      }, {
        label: "Paraxanthine eliminated actual mass",
        value: `${ke(s.caffeine.paraxanthineEliminatedActualMassMg, 4)} mg`
      }, {
        label: "Paraxanthine caffeine-equivalent",
        value: `${ke(s.caffeine.paraxanthineCaffeineEquivalentMg, 4)} mg`
      }, {
        label: "Formation route",
        value: s.caffeine.metaboliteFormationRoute
      }, {
        label: "Input-delivery residual",
        value: `${ke(s.caffeine.inputDeliveryResidualMg, 7)} mg`
      }, {
        label: "Final equivalent residual",
        value: `${ke(s.caffeine.finalResidualCaffeineEquivalentMg, 7)} mg`
      }, {
        label: "Maximum absolute residual",
        value: `${ke(s.caffeine.maximumAbsoluteResidualCaffeineEquivalentMg, 7)} mg`
      }, {
        label: "Relative error",
        value: `${ke(s.caffeine.relativeError * 100, 6)}%`
      }, {
        label: "Pass tolerance",
        value: `${ke(s.tolerance.caffeineEquivalentAbsoluteMg, 7)} mg`
      }]
    }, {
      title: "Solver and run validity",
      items: [{
        label: "Simulation duration",
        value: Ce(t.simulationDurationH)
      }, {
        label: "Solver",
        value: a.solver.method
      }, {
        label: "Requested internal step",
        value: `${we(s.solver.requestedInternalStepMin, 4)} min`
      }, {
        label: "Selected internal step",
        value: `${we(s.solver.selectedInternalStepMin, 4)} min`
      }, {
        label: "Automatic refinements",
        value: `${s.solver.automaticRefinementCount}`
      }, {
        label: "Output sampling",
        value: `${we(s.solver.outputStepMin, 2)} min`
      }, {
        label: "Dense analysis points",
        value: `${s.solver.denseAnalysisPointCount}`
      }, {
        label: "Displayed points",
        value: `${s.solver.displayedPointCount}`
      }, {
        label: "h versus h/2 convergence",
        value: s.solver.converged ? "passed" : "failed"
      }, {
        label: "Peak BAC relative difference",
        value: `${ke(a.convergence.peakBACRelativeDifference * 100, 4)}%`
      }, {
        label: "BAC AUC relative difference",
        value: `${ke(a.convergence.bacAucRelativeDifference * 100, 4)}%`
      }, {
        label: "Peak-time difference",
        value: `${ke(a.convergence.timeOfPeakDifferenceMin, 3)} min`
      }, {
        label: "Pre-clamp negatives",
        value: `${s.solver.preClampNegativeCount}`
      }, {
        label: "Numerical repair required",
        value: s.solver.numericalRepairRequired ? "yes - run invalid" : "no"
      }, {
        label: "Mass balance",
        value: s.massBalancePassed ? "passed" : "failed"
      }, {
        label: "Dose event count",
        value: `${n.length}`
      }]
    }]
  };
}
const WB = "0.8.6";
function YB(e) {
  return (e.ethanolGrams ?? e.ethanolVolumeMl * e.abvPercent / 100) * (e.servings ?? 1) > Zt;
}
function ine(e) {
  return e.caffeineMg * (e.servings ?? 1) > Zt;
}
function Cs(e) {
  const t = e.trim().replace(/\s+/g, " ");
  return !t || /[.!?]$/.test(t) ? t : `${t}.`;
}
function Lj(e) {
  return e && e[0].toLowerCase() + e.slice(1);
}
function Mo(e) {
  return [...new Set(e.map(Cs).filter(Boolean))].join(" ");
}
function rne(e, t) {
  const n = e.analysisPoints.length > 0 ? e.analysisPoints : e.points;
  if (n.length < 2) return 0;
  const a = n.reduce((c, d, f) => Math.abs(d.tH - t.tH) < Math.abs(n[c].tH - t.tH) ? f : c, 0),
    s = n[Math.max(0, a - 1)],
    l = n[Math.min(n.length - 1, a + 1)];
  return l.tH === s.tH ? 0 : (l.caffeineMgL - s.caffeineMgL) / (l.tH - s.tH);
}
function sne(e, t, n) {
  const a = t.bacGdL <= Zt,
    s = t.gastricEthanolG + t.intestinalEthanolG;
  return e.exposure.kind === "historical-trace" || t.bacGdL > 0 && t.bacGdL < .001 ? "residual" : a && s > Zt ? "pre-absorption" : a && n.some(l => YB(l) && l.startTimeH > t.tH + Zt) ? "scheduled" : a && !e.exposure.ethanolPresent ? "absent" : Math.abs(t.tH - e.summary.timeOfPeakBACH) <= .25 ? "near-peak" : t.bacRateGdLPerH > .001 ? "rising" : t.bacRateGdLPerH < -.001 ? "descending" : a ? "absent" : "stable";
}
function one(e, t, n) {
  if (!e.exposure.caffeinePresent) return "absent";
  const a = n.some(l => ine(l) && l.startTimeH > t.tH + Zt);
  if (t.caffeineMgL <= Zt && (t.caffeineGutMg > Zt || a)) return "pending";
  if (t.caffeineMgL < SM && t.expectedCumulativeCaffeineAdministeredMg > Zt) return "residual";
  if (Math.abs(t.tH - e.summary.timeOfPeakCaffeineH) <= .25) return "near-peak";
  const s = rne(e, t);
  return s > .01 ? "rising" : s < -.01 ? "declining" : t.caffeineMgL <= Zt ? "pending" : "stable";
}
const Op = {
  absent: "No caffeine concentration",
  pending: "Caffeine pending absorption",
  rising: "Caffeine concentration rising",
  "near-peak": "Caffeine near peak",
  declining: "Caffeine concentration declining",
  residual: "Caffeine residual",
  stable: "Caffeine concentration stable"
};
const u0 = {
  absent: "absent",
  scheduled: "scheduled",
  "pre-absorption": "pre-absorption",
  rising: "rising",
  "near-peak": "near peak",
  descending: "falling",
  residual: "residual trace",
  stable: "stable"
};
function lne(e, t, n) {
  const a = {
      zero: "No concentration-linked outward change is expected.",
      minimal: "Visible change is subtle, with mild warmth or loosened restraint more apparent internally than to an observer.",
      low: "Social initiation and reduced inhibition become more apparent, with early timing or coordination imprecision toward the upper part of this tier.",
      medium: "Recognisable impairment appears in speech timing, tracking, response selection, and motor precision.",
      high: "Conspicuous impairment includes unstable balance, poorly timed or slurred speech, emotional variability, and unreliable purposeful monitoring.",
      "very-high": "Gross coordination loss, heavy sedation, confusion, memory disruption, and unstable responsiveness dominate.",
      severe: "Severe disorientation, inability to sustain posture or purposeful action, vomiting risk, and intermittent or absent responsiveness dominate.",
      extreme: "Coma-range unresponsiveness with profoundly compromised protective reflexes and respiratory function dominates."
    },
    s = t && n.likelyExpression.trim() ? Cs(n.likelyExpression) : "";
  return {
    expression: a[e.id],
    temperament: s
  };
}
function ON(e, t, n) {
  if (e === "absent") return "";
  const a = {
      pending: "Caffeine is scheduled or still absorbing, so its central alertness signal has not yet emerged.",
      rising: "Caffeine-linked wakefulness, energy, and task persistence are most likely still increasing.",
      "near-peak": "Caffeine-linked wakefulness and persistence are most likely near their modeled maximum.",
      declining: "Caffeine-linked activation is declining but remains present at the selected concentration.",
      residual: "A residual caffeine concentration remains, with a comparatively light alertness signal.",
      stable: "Caffeine-linked wakefulness is relatively stable at the selected time."
    },
    s = [];
  return n > Zt && t.caffeineToleranceModifier > 1.1 && s.push("The entered caffeine tolerance attenuates the alertness response relative to concentration."), n > Zt && t.caffeineToleranceModifier < .9 && s.push("The entered low tolerance amplifies the alertness response relative to concentration."), n > Zt && t.sleepDebtModifier > 1.1 && s.push("The entered sleep restriction adds fatigue and makes the activation less smoothly restorative."), Mo([a[e], ...s]);
}
function cne(e) {
  return e.bacState === "scheduled" ? e.scheduledEthanol ? `The next ethanol administration begins at ${Ce(e.scheduledEthanol.startTimeH)}.` : "The next ethanol administration begins later in the modeled horizon." : e.bacState === "pre-absorption" ? `Central BAC is expected to emerge as absorption continues toward the modeled peak at ${Ce(e.result.summary.timeOfPeakBACH)}.` : e.bacState === "rising" ? `BAC is still increasing toward the modeled peak at ${Ce(e.result.summary.timeOfPeakBACH)}, so the present effects are still developing.` : e.bacState === "near-peak" ? "BAC is around its modeled peak, so concentration and the current effects are changing comparatively slowly." : e.bacState === "descending" ? "BAC is falling, but concentration-linked effects remain active until the trajectory crosses into lower bands." : e.caffeineState === "pending" ? `Caffeine concentration is expected to emerge as absorption continues toward its modeled peak at ${Ce(e.result.summary.timeOfPeakCaffeineH)}.` : e.caffeineState === "rising" ? `Caffeine is increasing toward its modeled peak at ${Ce(e.result.summary.timeOfPeakCaffeineH)}.` : e.caffeineState === "near-peak" ? "Caffeine is around its modeled peak and is expected to decline afterward." : e.caffeineState === "declining" ? "Caffeine-linked activation is declining toward baseline over the remaining horizon." : e.result.exposure.kind === "none" ? "The modeled horizon remains at baseline unless an intake is added." : "The selected concentration state is changing slowly at this point in the modeled course.";
}
function une(e) {
  const t = Cs(e.text),
    n = Math.max(0, ...Object.values(e.point.axisValues)),
    a = n >= 82 ? "severe" : n >= 60 ? "high" : n >= 35 ? "material" : n >= 15 ? "emerging" : "quiet",
    s = e.family === "subjective" ? "felt state" : e.family === "functional" ? "functional reliability" : e.family === "calibration" ? "self-calibration" : e.family === "expression" ? "outward expression" : e.family === "context" ? "regulatory context" : "temporal course";
  return {
    id: e.id,
    family: e.family,
    text: t,
    axisIds: [],
    driverIds: [],
    values: {},
    magnitudeBand: a,
    registeredBandIds: [],
    precedence: 1e3,
    provenanceIds: e.provenanceIds,
    subject: s,
    predicate: e.family === "temporal" ? "locates" : "indicates",
    complement: t.replace(/[.!?]$/, ""),
    polarity: "neutral",
    magnitude: n,
    temporalScope: "selected-time",
    stateScope: e.point.stateSignatureId,
    dependencies: e.point.activeDriverIds,
    materialDrivers: e.point.psychodynamicGestalt.dominantDrivers,
    countervailingDrivers: e.point.axisDecomposition.protectiveRegulatoryStrength.countervailingDrivers,
    confidenceClass: e.point.psychodynamicGestalt.confidenceClass,
    provenance: e.provenanceIds,
    labelSafeText: t,
    standaloneText: Cs(e.scopeLabel + ", " + Lj(t))
  };
}
function $j(e) {
  const {
    result: t,
    behavioural: n,
    profile: a,
    doseEvents: s
  } = e;
  if (t.numericalValidity !== "valid" || n.status !== "valid") return null;
  const l = Uu(t, e.selectedTimeH),
    c = l.point,
    d = br(n, c.tH);
  if (!d) return null;
  const f = e.subject ?? St,
    h = e.bacDisplayUnit ?? "g/dL",
    p = jn(c.bacGdL),
    v = Qa(c.bacGdL),
    b = jn(t.summary.peakBACGdL),
    x = Qa(t.summary.peakBACGdL),
    w = sne(t, c, s),
    g = one(t, c, s),
    C = qi(d, a, {
      scope: "selected-time",
      scopeLabel: `At ${Ce(c.tH)}`,
      detail: "default"
    }),
    S = {
      id: d.stateSignatureId,
      label: ea(d.stateSignatureId)
    },
    k = s.filter(ye => YB(ye) && ye.startTimeH > c.tH + Zt).sort((ye, je) => ye.startTimeH - je.startTimeH || ye.id.localeCompare(je.id))[0],
    E = hT(c.bacGdL, h),
    O = `${ke(c.caffeineMgL, 2)} mg/L`;
  let A = p.label,
    N = "",
    T = "",
    D = "";
  t.exposure.kind === "none" ? (A = "Modeled baseline state", N = "No active alcohol- or caffeine-linked central concentration is present at the selected time.", T = "Felt state remains at the entered physiological and behavioural baseline.", D = "Concentration-linked functional reliability remains at the modeled baseline.") : t.exposure.ethanolPresent ? w === "scheduled" ? (A = "Ethanol scheduled; BAC remains zero", N = `At ${Ce(c.tH)}, modeled BAC is ${E}; ethanol administration begins later.`, T = k ? `The first ethanol-linked shift is expected after the scheduled intake at ${Ce(k.startTimeH)}.` : "The first ethanol-linked shift is scheduled later in the horizon.", D = "BAC-linked functional reliability remains at baseline at this selected time.") : w === "pre-absorption" ? (A = "Ethanol absorbing; BAC remains zero", N = `At ${Ce(c.tH)}, administered ethanol remains in absorption compartments while modeled BAC is ${E}.`, T = "A central ethanol-linked subjective phenotype has not yet emerged.", D = "BAC-linked functional reliability remains at baseline until central concentration emerges.") : w === "residual" ? (A = t.exposure.kind === "historical-trace" ? "Historical trace at negligible concentration" : p.label, N = `At ${Ce(c.tH)}, modeled BAC is ${E}, a ${v.label.toLowerCase()} severity residual trace.`, T = "Felt ethanol effects are negligible at this residual concentration.", D = Cs(p.performance)) : (N = `At ${Ce(c.tH)}, modeled BAC is ${E}: ${v.label.toLowerCase()} severity, ${Lj(p.label)}, and ${u0[w]}.`, T = p.id === "zero" ? "No ethanol-linked felt shift is active." : Cs(p.interpretation), D = p.id === "zero" ? "No BAC-linked functional change is active." : Cs(p.performance)) : (A = Op[g], N = `At ${Ce(c.tH)}, modeled caffeine concentration is ${O} and ${Lj(Op[g])}.`, T = ON(g, f, c.caffeineMgL), D = d.axisValues.taskPersistenceDrive >= 20 ? "Drive to persist with the current task is elevated, while judgment, accuracy, coordination, and reaction reliability receive no corresponding gain." : "No ethanol-linked reduction in functional reliability is active.");
  const {
      expression: V,
      temperament: G
    } = lne(v, a.applied, C),
    W = t.exposure.ethanolPresent ? Mo([V, d.stateSignatureId === "severe-depressant-state" ? "" : G]) : Cs(C.likelyExpression),
    $ = ON(g, f, c.caffeineMgL);
  let ne = "";
  t.exposure.kind === "combined-overlap" && l.ethanolActive && l.caffeineActive ? ne = c.mismatchIndex >= .25 ? "Caffeine-linked wakefulness and perceived control are elevated relative to current functional reliability; the stimulant signal does not reduce the concurrent BAC-linked impairment." : "Caffeine-linked activation and alcohol-linked impairment coexist at this point; the activation does not reduce the concurrent BAC-linked impairment." : t.exposure.kind === "combined-sequential" && (l.ethanolActive || l.caffeineActive) && (ne = "The alcohol-led and caffeine-led phases occur sequentially, so the active phase determines the local state.");
  const ue = cne({
      bacState: w,
      caffeineState: g,
      result: t,
      scheduledEthanol: k
    }),
    me = G,
    K = Mo([...C.calibrationClauses.slice(0, 2).map(ye => ye.labelSafeText), ne]),
    Q = C.contextClause?.labelSafeText ?? "",
    X = d.stateSignatureId !== "severe-depressant-state" && d.axisValues.protectiveRegulatoryStrength >= 15 ? "Entered planning, accountability, or deliberative tendencies constrain visible expression and continuation pressure without altering the concentration-derived functional state." : "",
    se = Mo([T, t.exposure.caffeinePresent ? $ : "", ...C.subjectiveClauses.slice(0, 2).map(ye => ye.labelSafeText)]),
    Ee = [{
      id: "felt-state",
      label: "Felt state",
      text: se,
      entailmentIds: C.subjectiveClauses.map(ye => ye.id)
    }, {
      id: "functional-reliability",
      label: "Functional reliability",
      text: D,
      entailmentIds: C.functionalClauses.map(ye => ye.id)
    }, ...(K ? [{
      id: "self-calibration",
      label: "Self-calibration",
      text: K,
      entailmentIds: C.calibrationClauses.map(ye => ye.id)
    }] : []), ...(W ? [{
      id: "outward-expression",
      label: "Outward expression",
      text: W,
      entailmentIds: C.expressionClauses.map(ye => ye.id)
    }] : []), ...(Q ? [{
      id: "regulatory-context",
      label: "Regulatory context",
      text: Q,
      entailmentIds: C.contextClause ? [C.contextClause.id] : []
    }] : []), ...(X ? [{
      id: "countervailing-restraint",
      label: "Countervailing restraint",
      text: X,
      entailmentIds: ["axis.protective-regulatory-strength"]
    }] : []), {
      id: "next-transition",
      label: "Next transition",
      text: ue,
      entailmentIds: C.temporalClause ? [C.temporalClause.id] : []
    }].filter(ye => ye.text.trim()),
    R = t.exposure.kind.startsWith("combined") || a.applied ? Cs("The dominant tension is " + d.psychodynamicGestalt.dominantTension + ", with " + d.psychodynamicGestalt.regulatoryMode + " regulation and " + d.psychodynamicGestalt.interpersonalMode + " outward expression") : "",
    B = Mo([se, D, K, ue]),
    F = Mo([N, ...Ee.map(ye => ye.text), R]),
    Z = Mo([N, ...Ee.map(ye => ye.text), R]),
    he = t.exposure.kind === "combined-overlap" ? "Alcohol impairment and caffeine activation overlap" : t.exposure.kind === "combined-sequential" ? "Alcohol and caffeine effects occur in sequence" : t.exposure.label,
    Ae = [...new Set([...C.selectedClauseIds, ...(t.exposure.kind === "none" ? ["presentation.no-exposure"] : []), ...(t.exposure.kind === "historical-trace" ? ["presentation.historical-trace"] : []), ...(w === "scheduled" ? ["presentation.scheduled"] : []), ...(w === "pre-absorption" ? ["presentation.pre-absorption"] : []), ...(w === "residual" ? ["presentation.trace"] : []), ...(w === "rising" ? ["presentation.rising"] : []), ...(w === "near-peak" ? ["presentation.near-peak"] : []), ...(w === "descending" ? ["presentation.descending"] : []), ...(v.id === "severe" || v.id === "extreme" ? ["presentation.severe"] : []), `presentation.severity.${v.id}`, `presentation.bac-${w}`, ...(g !== "absent" ? [`presentation.caffeine-${g}`] : []), ...(ne ? [`presentation.${t.exposure.kind}`] : []), ...(f.caffeineToleranceModifier !== 1 ? ["presentation.caffeine-tolerance"] : []), ...(f.sleepDebtModifier !== 1 ? ["presentation.sleep-restriction"] : []), ...(a.applied ? ["presentation.temperament-expression"] : []), ...(X ? ["axis.protective-regulatory-strength"] : [])])],
    Oe = new Set(C.semanticEntailments.map(ye => ye.id)),
    ge = Ae.filter(ye => !Oe.has(ye)).map(ye => {
      const je = ye.includes("temperament") || ye.includes("tolerance") || ye.includes("sleep") ? "context" : "temporal",
        Me = ye.startsWith("presentation.caffeine-") ? $ : ye.startsWith("presentation.combined-") ? ne : ye.startsWith("presentation.bac-") || ye === "presentation.descending" || ye === "presentation.rising" || ye === "presentation.near-peak" ? ue : ye === "axis.protective-regulatory-strength" ? X : N || A;
      return une({
        id: ye,
        family: je,
        text: Me,
        point: d,
        scopeLabel: "At " + Ce(c.tH),
        provenanceIds: ye.includes("caffeine") ? ["pd.caffeine-alertness"] : ["pk.bac-band", "pk.bac-severity-tier"]
      });
    }),
    de = [...C.semanticEntailments, ...ge],
    oe = gJ(Ee),
    Ie = [...new Set([...C.provenanceIds, "pk.bac-band", "pk.bac-severity-tier", ...(t.exposure.caffeinePresent ? ["pd.caffeine-alertness"] : [])])],
    H = Mo([`${Ce(c.tH)} selected`, t.exposure.ethanolPresent ? `BAC ${E}; ${v.label} severity; phenotype ${p.label}; ${u0[w]}` : "", t.exposure.caffeinePresent ? `Caffeine ${O}; ${Op[g]}` : ""]);
  return {
    version: WB,
    selectedTimeH: c.tH,
    selectedTimeLabel: Ce(c.tH),
    point: c,
    bacValueGdL: c.bacGdL,
    bacDisplay: E,
    bacBand: p,
    severityTierId: v.id,
    severityTier: v,
    bacState: w,
    bacDirectionLabel: u0[w],
    peakBAC: {
      valueGdL: t.summary.peakBACGdL,
      display: hT(t.summary.peakBACGdL, h),
      timeH: t.summary.timeOfPeakBACH,
      timeLabel: Ce(t.summary.timeOfPeakBACH),
      band: b,
      severityTierId: x.id,
      severityTier: x
    },
    caffeineValueMgL: c.caffeineMgL,
    caffeineDisplay: O,
    caffeineState: g,
    caffeineStateLabel: Op[g],
    peakCaffeine: {
      valueMgL: t.summary.peakCaffeineMgL,
      display: `${ke(t.summary.peakCaffeineMgL, 2)} mg/L`,
      timeH: t.summary.timeOfPeakCaffeineH,
      timeLabel: Ce(t.summary.timeOfPeakCaffeineH)
    },
    exposureRelationship: he,
    behaviouralPoint: d,
    behaviouralState: S,
    behaviourNarrative: C,
    headline: A,
    pkStateSentence: N,
    subjectiveSentence: T,
    functionalSentence: D,
    expressionSentence: W,
    combinedSentence: ne,
    temperamentSentence: me,
    trajectorySentence: ue,
    compactAccount: B,
    expandedDefaultAccount: F,
    standaloneAccount: Z,
    interpretationRows: Ee,
    semanticEntailments: de,
    narrativeLint: oe,
    selectedClauseIds: Ae,
    provenanceIds: Ie,
    stateNarrative: B,
    feltState: T,
    functionalState: D,
    outwardState: W,
    nextChange: ue,
    basisLabel: d.basis.label,
    narrativeIds: Ae,
    accessibleAnnouncement: H
  };
}
/* v0.9.1 exact data-plane adapters. This file is embedded with the extracted pure core. */
let kernelEnvironment = {
  now: () => 0,
  nowISO: '1970-01-01T00:00:00.000Z',
  yieldTask: () => Promise.resolve()
};
const KERNEL_PROTOCOL = '1.0.0',
  COMPACT_VERSION = '1.0.0',
  SNAPSHOT_VERSION = '1.0.0';
const kernelCounters = {
  numericalInvocations: 0,
  refinementPasses: 0,
  behaviouralDenseScans: 0,
  richPointMaterializations: 0,
  pdDerivations: 0
};
function stableKey(value) {
  const visit = v => {
    if (typeof v === 'number') {
      if (!Number.isFinite(v)) throw new TypeError('Nonfinite numerical state');
      return Object.is(v, -0) ? '-0' : String(v);
    }
    if (v === undefined) return 'undefined';
    if (v === null || typeof v !== 'object') return JSON.stringify(v);
    if (Array.isArray(v)) return '[' + v.map(visit).join(',') + ']';
    return '{' + Object.keys(v).filter(k => v[k] !== undefined).sort().map(k => JSON.stringify(k) + ':' + visit(v[k])).join(',') + '}';
  };
  return visit(value);
}
const pdSubjectFields = ['sedativeToleranceModifier', 'caffeineToleranceModifier', 'baselineAlertnessIndex', 'perceivedControlCalibration'];
const pdConstantFields = ['ethanolHill', 'ethanolEC50GdL', 'caffeineHill', 'caffeineEC50MgL', 'paraxanthineRelativePotency'];
function dependencyKeys(input, profile = hn(), documentState = input, presentation = {}) {
  const subject = {
      ...input.subject
    },
    constants = {
      ...input.constants
    };
  for (const k of [...pdSubjectFields, 'sleepDebtModifier', 'ethanolToleranceModifier', 'functionalToleranceModifier']) delete subject[k];
  subject.mealEvents = (subject.mealEvents ?? []).map(({
    id,
    label,
    ...rest
  }) => rest);
  for (const k of pdConstantFields) delete constants[k];
  const pkKey = stableKey({
    engine: Pj,
    constantsVersion: TB,
    subject,
    constants,
    doses: lQ(input)
  });
  const numericalKey = stableKey({
    pkKey,
    pd: Object.fromEntries(pdSubjectFields.map(k => [k, input.subject[k]])),
    pdConstants: Object.fromEntries(pdConstantFields.map(k => [k, input.constants[k]]))
  });
  const behaviouralKey = stableKey({
    numericalKey,
    sleepDebtModifier: input.subject.sleepDebtModifier,
    profile: um(profile),
    versions: [Ts, $m, Ro, Rm]
  });
  return {
    documentKey: stableKey(documentState),
    pkKey,
    numericalKey,
    behaviouralKey,
    narrativeKey: stableKey({
      behaviouralKey,
      profileMetadata: profile.narrativeMetadata,
      version: Ho
    }),
    presentationKey: stableKey(presentation)
  };
}
function cheapValidation(input) {
  try {
    stableKey(input);
    const messages = aQ(input.subject, input.doseEvents, input.constants, mm(input.subject, input.constants));
    return messages.some(m => m.level === 'error') ? {
      status: 'invalid',
      attemptedState: input,
      messages: messages.filter(m => m.level === 'error')
    } : {
      status: 'valid',
      messages
    };
  } catch (error) {
    return {
      status: 'invalid',
      attemptedState: input,
      messages: [{
        level: 'error',
        code: 'invalid-canonical-input',
        message: error.message
      }]
    };
  }
}
function packSeries(rows) {
  const keys = [...new Set(rows.flatMap(Object.keys))],
    columns = {},
    optional = {},
    dictionary = {},
    length = rows.length;
  for (const key of keys) {
    const numeric = rows.every(p => p[key] === undefined || typeof p[key] === 'number');
    if (numeric) {
      columns[key] = Float64Array.from(rows, p => p[key] ?? 0);
      if (rows.some(p => p[key] === undefined)) optional[key] = Uint8Array.from(rows, p => p[key] === undefined ? 0 : 1);
    } else {
      const values = [],
        codes = new Uint16Array(length),
        map = new Map();
      rows.forEach((p, i) => {
        const v = p[key];
        if (!map.has(v)) {
          map.set(v, values.length);
          values.push(v);
        }
        codes[i] = map.get(v);
      });
      dictionary[key] = {
        values,
        codes
      };
    }
  }
  return {
    version: COMPACT_VERSION,
    length,
    keys,
    columns,
    optional,
    dictionary
  };
}
function seriesPoint(series, i) {
  const p = {};
  for (const key of series.keys) p[key] = series.columns[key] ? series.optional[key] && !series.optional[key][i] ? undefined : series.columns[key][i] : series.dictionary[key].values[series.dictionary[key].codes[i]];
  return p;
}
function indexedView(length, get) {
  const target = [];
  target.length = length;
  return new Proxy(target, {
    get(t, k) {
      if (typeof k === 'string' && /^\d+$/.test(k)) return +k < length ? get(+k) : undefined;
      if (k === 'toJSON') return () => Array.from({
        length
      }, (_, i) => get(i));
      return Reflect.get(t, k);
    },
    has(t, k) {
      return typeof k === 'string' && /^\d+$/.test(k) ? +k < length : Reflect.has(t, k);
    },
    set() {
      throw new TypeError('Immutable series');
    },
    deleteProperty() {
      throw new TypeError('Immutable series');
    }
  });
}
function packNumerical(result) {
  const {
    points,
    analysisPoints,
    sensitivity,
    __sensitivityDense,
    ...metadata
  } = result;
  return {
    metadata,
    display: packSeries(points),
    analysis: packSeries(analysisPoints),
    ...(sensitivity ? {
      sensitivity: {
        low: packSeries(sensitivity.low),
        high: packSeries(sensitivity.high)
      },
      ...(__sensitivityDense ? {
        sensitivityAnalysis: {
          low: packSeries(__sensitivityDense.low),
          high: packSeries(__sensitivityDense.high)
        }
      } : {})
    } : {})
  };
}
function readonlyPoint(s, i) {
  return new Proxy({}, {
    get(t, k) {
      if (k === 'toJSON') return () => seriesPoint(s, i);
      return s.columns[k] ? s.optional[k] && !s.optional[k][i] ? undefined : s.columns[k][i] : s.dictionary[k]?.values[s.dictionary[k].codes[i]];
    },
    ownKeys() {
      return s.keys;
    },
    getOwnPropertyDescriptor(t, k) {
      return s.keys.includes(k) ? {
        enumerable: true,
        configurable: true
      } : undefined;
    },
    set() {
      throw Error('Immutable point');
    },
    defineProperty() {
      throw Error('Immutable point');
    },
    deleteProperty() {
      throw Error('Immutable point');
    }
  });
}
function numericalView(packed, freeze = false) {
  const view = s => indexedView(s.length, i => freeze ? readonlyPoint(s, i) : seriesPoint(s, i));
  return {
    ...packed.metadata,
    points: view(packed.display),
    analysisPoints: view(packed.analysis),
    ...(packed.sensitivity ? {
      sensitivity: {
        low: view(packed.sensitivity.low),
        high: view(packed.sensitivity.high)
      }
    } : {})
  };
}
function compactBehaviour(numerical, subject, profile) {
  kernelCounters.behaviouralDenseScans++;
  const basis = KZ(profile),
    resolution = qZ(profile),
    series = numerical.analysisPoints.length ? numerical.analysisPoints : numerical.points,
    length = series.length;
  const axisColumns = Object.fromEntries(jt.map(id => [id, new Float64Array(length)])),
    timeH = new Float64Array(length),
    stateSignatureCodes = new Uint16Array(length),
    phaseCodes = new Uint16Array(length),
    driverCodes = new Uint16Array(length),
    secondaryCodes = new Uint16Array(length);
  const dictionaries = {
      states: [],
      phases: [],
      drivers: [],
      secondary: []
    },
    maps = {
      states: new Map(),
      phases: new Map(),
      drivers: new Map(),
      secondary: new Map()
    };
  const intern = (type, value) => {
    const key = JSON.stringify(value),
      map = maps[type];
    if (!map.has(key)) {
      map.set(key, dictionaries[type].length);
      dictionaries[type].push(value);
    }
    return map.get(key);
  };
  for (let i = 0; i < length; i++) {
    const p = JZ(series[i], numerical, subject, profile, basis, resolution, true);
    timeH[i] = p.tH;
    for (const id of jt) axisColumns[id][i] = p.axisValues[id];
    stateSignatureCodes[i] = intern('states', p.stateSignatureId);
    phaseCodes[i] = intern('phases', p.phaseId);
    driverCodes[i] = intern('drivers', p.activeDriverIds);
    secondaryCodes[i] = intern('secondary', p.secondarySignatureIds);
  }
  const packed = {
    version: COMPACT_VERSION,
    length,
    axisIds: jt,
    axisColumns,
    timeH,
    stateSignatureCodes,
    phaseCodes,
    driverCodes,
    secondaryCodes,
    dictionaries,
    basis,
    profileResolution: resolution.resolution,
    profileFingerprint: um(profile),
    modelVersion: Ts
  };
  packed.summary = tJ(indexedView(length, i => thinBehaviourPoint(packed, i, numerical.exposure.kind)), basis);
  return packed;
}
function thinBehaviourPoint(p, i, exposureKind) {
  return {
    tH: p.timeH[i],
    axisValues: Object.fromEntries(jt.map(id => [id, p.axisColumns[id][i]])),
    phaseId: p.dictionaries.phases[p.phaseCodes[i]],
    stateSignatureId: p.dictionaries.states[p.stateSignatureCodes[i]],
    secondarySignatureIds: p.dictionaries.secondary[p.secondaryCodes[i]],
    activeDriverIds: p.dictionaries.drivers[p.driverCodes[i]],
    basis: p.basis,
    exposureKind
  };
}
function behaviourView(p, numerical, subject, profile, materialize) {
  const basis = p.basis,
    resolution = qZ(profile),
    get = materialize ?? (i => {
      kernelCounters.richPointMaterializations++;
      return JZ(numerical.analysisPoints[i], numerical, subject, profile, basis, resolution);
    });
  return {
    status: 'valid',
    points: indexedView(p.length, get),
    summary: p.summary,
    profileFingerprint: p.profileFingerprint,
    profileResolution: p.profileResolution,
    modelVersion: p.modelVersion
  };
}
function projectAxes(p, t) {
  let lo = 0,
    hi = p.length - 1;
  if (t <= p.timeH[0]) hi = 0;else if (t >= p.timeH[hi]) lo = hi;else while (lo + 1 < hi) {
    const mid = lo + hi >> 1;
    p.timeH[mid] <= t ? lo = mid : hi = mid;
  }
  const f = lo === hi ? 0 : (t - p.timeH[lo]) / Math.max(1e-12, p.timeH[hi] - p.timeH[lo]);
  return Object.fromEntries(jt.map(id => [id, p.axisColumns[id][lo] + f * (p.axisColumns[id][hi] - p.axisColumns[id][lo])]));
}
function derivePD(packed, input) {
  kernelCounters.pdDerivations++;
  const r = numericalView(packed),
    map = p => ({
      ...p,
      ...EJ({
        bacGdL: p.bacGdL,
        bacRateGdLPerH: p.bacRateGdLPerH,
        caffeineMgL: p.caffeineMgL,
        paraxanthineRelativeConc: p.paraxanthineRelativeConc,
        subject: input.subject,
        constants: input.constants
      })
    });
  const analysisPoints = r.analysisPoints.map(map),
    points = VJ(analysisPoints, input.subject.simulationDurationH, input.subject.timeStepMin);
  const summary = {
    ...r.summary,
    maxImpairmentIndex: maintenanceMax(analysisPoints.map(p => p.ethanolImpairmentIndex)),
    maxAlertnessIndex: maintenanceMax(analysisPoints.map(p => p.combinedAlertnessIndex)),
    maxMismatchIndex: maintenanceMax(analysisPoints.map(p => p.mismatchIndex))
  };
  return packNumerical({
    ...r,
    analysisPoints,
    points,
    summary,
    exposure: Yv(analysisPoints, summary),
    ...(r.sensitivity ? (() => {
      const low = indexedView(packed.sensitivityAnalysis.low.length, i => seriesPoint(packed.sensitivityAnalysis.low, i)).map(map),
        high = indexedView(packed.sensitivityAnalysis.high.length, i => seriesPoint(packed.sensitivityAnalysis.high, i)).map(map);
      return {
        sensitivity: {
          low: VJ(low, input.subject.simulationDurationH, input.subject.timeStepMin),
          high: VJ(high, input.subject.simulationDurationH, input.subject.timeStepMin)
        },
        __sensitivityDense: {
          low,
          high
        }
      };
    })() : {})
  });
}
function kernelNumerical(input) {
  kernelCounters.numericalInvocations++;
  const outcome = wu(Mr(input.subject, input.doseEvents, input.constants), input);
  if (outcome.status !== 'valid') return outcome;
  kernelCounters.refinementPasses += outcome.result.solver.automaticRefinementCount + 2 + (outcome.result.sensitivity ? 2 : 0);
  return {
    status: 'valid',
    packed: packNumerical(outcome.result)
  };
}
function retainedBytes(value, seen = new Set()) {
  if (value == null) return 0;
  if (typeof value === 'string') return value.length * 2;
  if (typeof value !== 'object') return 8;
  if (seen.has(value)) return 0;
  seen.add(value);
  if (ArrayBuffer.isView(value)) return value.byteLength;
  if (value instanceof ArrayBuffer) return value.byteLength;
  return 32 + Object.entries(value).reduce((n, [k, v]) => n + k.length * 2 + retainedBytes(v, seen), 0);
}
function transferables(value, out = [], seen = new Set()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return out;
  seen.add(value);
  if (ArrayBuffer.isView(value)) {
    if (!out.includes(value.buffer)) out.push(value.buffer);
  } else for (const v of Object.values(value)) transferables(v, out, seen);
  return out;
}
function sweepOutput(numerical, behavioural, scenario, profile, config, value) {
  return kj(scenario, profile, config, value, numerical, behavioural);
}
async function exportBlob(payload) {
  const {
      packed,
      behaviour,
      input,
      profile,
      request
    } = payload,
    result = numericalView(packed),
    behavior = behaviour ? behaviourView(behaviour, result, input.subject, profile) : null;
  const args = {
    ...request.context,
    ...input,
    result,
    behavioural: behavior,
    behaviourProfile: profile
  };
  const parts = [];
  let chunk = '',
    scratchPeak = 0;
  const append = text => {
    chunk += text;
    if (chunk.length > 65536) {
      parts.push(new Blob([chunk]));
      scratchPeak = Math.max(scratchPeak, chunk.length * 2);
      chunk = '';
    }
  };
  const pause = () => kernelEnvironment.yieldTask();
  if (request.format === 'csv') {
    if (request.tier === 'behaviour') for (let i = 0; i < behavior.points.length; i++) {
      const row = OM({
        ...behavior,
        points: [behavior.points[i]]
      }, profile).split('\r\n');
      append((i ? '\r\n' : '') + (i ? row[1] : row.join('\r\n')));
      if (i % 128 === 0) await pause();
    } else {
      append(ag.map(([id]) => id).join(','));
      const rows = request.tier === 'displayed' ? request.displayedPoints : result.analysisPoints;
      for (let i = 0; i < rows.length; i++) {
        append('\r\n' + ag.map(([, get]) => String(get(rows[i]))).join(','));
        if (i % 512 === 0) await pause();
      }
    }
  } else if (request.tier === 'summary') append(request.summaryText);else if (request.tier === 'displayed') append(JSON.stringify({
    schema: 'ethanol-caffeine-pk-view-series',
    schemaVersion: zp,
    versions: {...qt},
    view: request.viewMetadata,
    points: request.displayedPoints
  }));else {
    const shell = ng({
      ...args,
      includeBehavioralInterpretation: false
    });
    delete shell.timeSeries;
    if (behavior && args.includeBehavioralInterpretation !== false) {
      Object.assign(shell, {
        behaviouralModel: {
          version: Ts,
          axisRegistryVersion: $m,
          interactionRegistryVersion: Ro,
          coefficientRegistryVersion: Rm,
          narrativeRegistryVersion: Ho,
          provenanceVersion: Ku
        },
        behaviouralBasis: behavior.summary.basis,
        behaviourProfile: profile,
        behaviourProfileResolution: behavior.profileResolution,
        behaviouralEpisodes: behavior.summary.episodes,
        behaviouralSummary: behavior.summary
      });
    }
    if (request.tier === 'behaviour') {
      append(JSON.stringify({
        schema: 'ethanol-caffeine-pk-behavioural-series',
        schemaVersion: zp,
        versions: {...qt},
        behaviouralModel: shell.behaviouralModel
      }).slice(0, -1));
    } else append(JSON.stringify(shell).slice(0, -1));
    if (behavior && args.includeBehavioralInterpretation !== false) {
      append(',"behaviouralSeries":[');
      for (let i = 0; i < behavior.points.length; i++) {
        const p = behavior.points[i];
        append((i ? ',' : '') + JSON.stringify({
          timeH: p.tH,
          phaseId: p.phaseId,
          stateSignatureId: p.stateSignatureId,
          basisCode: p.basis.code,
          axes: p.axisValues,
          axisDecomposition: p.axisDecomposition,
          psychodynamicGestalt: p.psychodynamicGestalt,
          narrative: qi(p, profile, {
            scope: 'selected-time',
            scopeLabel: `At ${p.tH} h`,
            detail: 'expert'
          })
        }));
        if (i % 64 === 0) await pause();
      }
      append(']');
    }
    if (request.tier !== 'behaviour') {
      append(',"timeSeries":[');
      for (let i = 0; i < result.analysisPoints.length; i++) {
        append((i ? ',' : '') + JSON.stringify(result.analysisPoints[i]));
        if (i % 512 === 0) await pause();
      }
      append(']');
    }
    append('}');
  }
  if (chunk) parts.push(new Blob([chunk]));
  let blob = new Blob(parts, {
    type: request.format === 'csv' ? 'text/csv;charset=utf-8' : 'application/json'
  });
  parts.length = 0;
  if (request.format === 'compressed') {
    if (typeof CompressionStream === 'undefined') throw Error('Compressed export is unavailable in this browser. Choose JSON instead.');
    blob = await new Response(blob.stream().pipeThrough(new CompressionStream('gzip'))).blob();
  }
  return {
    blob,
    scratchPeak,
    bytes: blob.size
  };
}
async function executeKernelJob(job, environment) {
  if (environment) kernelEnvironment = environment;
  const before = {
      ...kernelCounters
    },
    start = kernelEnvironment.now();
  let payload;
  if (job.kind === 'numerical') payload = kernelNumerical(job.input);else if (job.kind === 'pd') payload = {
    status: 'valid',
    packed: derivePD(job.packed, job.input)
  };else if (job.kind === 'behaviour') payload = {
    status: 'valid',
    behaviour: compactBehaviour(numericalView(job.packed), job.input.subject, job.profile)
  };else if (job.kind === 'sweep-output') payload = sweepOutput(numericalView(job.packed), job.behaviour ? behaviourView(job.behaviour, numericalView(job.packed), job.input.subject, job.profile) : null, job.baseline, job.baselineProfile, job.config, job.value);else if (job.kind === 'export') payload = await exportBlob(job);else throw new Error('Unknown kernel job ' + job.kind);
  return {
    payload,
    metrics: Object.fromEntries(Object.keys(before).map(k => [k, kernelCounters[k] - before[k]])),
    elapsedMs: kernelEnvironment.now() - start
  };
}

function dependencyClass(id){if(/mbti|narrativeMetadata/.test(id))return 'narrative-only';if(/temperament|behaviourProfile|context|trait/.test(id))return 'behavioural';if(id==='subject.sleepDebtModifier')return 'behavioural';if(['subject.ethanolToleranceModifier','subject.functionalToleranceModifier'].includes(id))return 'document-metadata';if(pdSubjectFields.some(k=>id==='subject.'+k)||pdConstantFields.some(k=>id==='constants.'+k))return 'numerical-pd';if(/selectedTime/.test(id))return 'selected-point';if(/^(ui|presentation|analysis)\./.test(id))return 'presentation-only';if(/label|notes|title|id$/.test(id))return 'document-metadata';return 'numerical-pk';}
for(const entry of XJ){entry.dependencyClass=dependencyClass(entry.id);entry.invalidates=entry.dependencyClass==='numerical-pk'?['numerical','behavioural','narrative']:entry.dependencyClass==='numerical-pd'?['pd','behavioural','narrative']:entry.dependencyClass==='behavioural'?['behavioural','narrative']:entry.dependencyClass==='narrative-only'?['narrative']:[];}
return {maintenanceMax,maintenanceMin,maintenanceThresholdIntervals,maintenanceRollingIntake,Vv,X_,Ps,pj,jr,bZ,ba,mT,jn,Qa,hT,Yl,Gv,$o,zu,Xg,Vu,yT,bT,Ls,OZ,hn,Mn,xa,aB,vj,Bm,xT,Xl,IZ,DZ,iB,Kv,um,jT,MT,Lm,Ts,$m,Ro,Rm,_Z,BZ,LZ,$Z,RZ,Wn,vt,jt,HZ,FZ,Uv,cr,_i,Vx,zZ,Qc,Ya,Zg,yM,bM,So,$t,VZ,Gx,Ms,GZ,KZ,UZ,qZ,xp,WZ,YZ,rB,XZ,ZZ,JZ,Oo,CT,QZ,xM,eJ,tJ,zi,br,Zl,ea,Ho,oB,lB,nJ,aJ,iJ,it,rJ,fa,sJ,oJ,jM,cB,wT,lJ,cJ,Po,uJ,dJ,fJ,mJ,jp,qi,hJ,yj,pJ,vJ,gJ,uB,Bi,hu,jJ,dB,qv,MM,fm,Hm,Jg,$l,CM,Hp,Ta,Na,St,bt,ST,CJ,mB,Ao,wJ,hB,SJ,AJ,mm,AT,Zt,wM,pB,SM,Do,Ux,qx,ET,Yv,Xv,EJ,kJ,PJ,an,TJ,Wx,NJ,OJ,IJ,DJ,AM,EM,_J,Pf,BJ,LJ,PT,TT,$J,RJ,NT,HJ,FJ,zJ,VJ,OT,IT,DT,jo,GJ,yf,xj,qJ,Ue,Nn,YJ,Cu,XJ,ZJ,JJ,QJ,Qg,ey,Fi,gs,_T,Be,dn,qe,nQ,aQ,iQ,rQ,Mp,BT,LT,sQ,$T,RT,HT,FT,Mr,Zn,It,Oa,ke,we,Ce,Ql,lQ,wu,ZQ,rt,Ku,ny,eee,jB,MB,Uu,NM,_r,jee,Mee,tN,Xx,vm,mr,Fo,bu,Cee,See,Aee,Eee,kee,kj,Vi,tg,Cr,zp,Pj,TB,NB,OB,Iee,qt,$ee,Ree,Hee,BB,Fee,ng,zee,OM,ag,IM,Jee,Qee,kN,PN,Ite,VB,o0,Qte,WB,YB,ine,Cs,Lj,Mo,rne,sne,one,Op,u0,lne,ON,cne,une,$j,kernelEnvironment,KERNEL_PROTOCOL,COMPACT_VERSION,SNAPSHOT_VERSION,kernelCounters,stableKey,pdSubjectFields,pdConstantFields,dependencyKeys,cheapValidation,packSeries,seriesPoint,indexedView,packNumerical,readonlyPoint,numericalView,compactBehaviour,thinBehaviourPoint,behaviourView,projectAxes,derivePD,kernelNumerical,retainedBytes,transferables,sweepOutput,exportBlob,executeKernelJob,dependencyClass};
})();
