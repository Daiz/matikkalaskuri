//@ts-check
const d = document;

/** @typedef {import("./types").Test} Test */

/* scale to window */
const BASE_WIDTH = 320;
const BASE_FONT_SIZE = 16;
const SCALE_MAX = 2;
const STAR = "★";
const STORE = "matikkalaskuri-pisteet";
/** @type {{ [key: string]: number }} */
const grades = JSON.parse(localStorage.getItem(STORE) ?? "{}");

function resize() {
  const iw = window.innerWidth;
  const scale = Math.min(SCALE_MAX, iw / BASE_WIDTH);
  const fontSize = (BASE_FONT_SIZE * scale).toFixed(2) + "px";
  d.documentElement.style.fontSize = fontSize;
}

window.addEventListener("resize", resize);
resize();

/**
 * Query Selector shortcut
 * @param {string} selector
 * @param {Element | Document} root
 * @returns {HTMLElement}
 */
const $ = (selector, root = d) => {
  const res = root.querySelector(selector);
  if (!res)
    throw new Error(
      `Could not find an element with selector "${selector}" from ${root}`
    );
  return /** @type {HTMLElement} */ (res);
};

/**
 * Pad a number or string with a character to desired length.
 * @param {string | number} i
 * @param {number} n
 * @param {string} c
 * @returns {string}
 */
function pad(i, n = 2, c = "0") {
  i = "" + i;
  while (i.length < n) {
    i = c + i;
  }
  return i;
}

/**
 * Clamp a value.
 * @param {number} val 
 * @param {number} min 
 * @param {number} max 
 * @returns 
 */
function clamp(val, min, max) {
  return val < min ? min : val > max ? max : val;
}

/**
 * Format a timestamp to a MM:SS string.
 * @param {number} time - time in milliseconds
 */
function formatTime(time) {
  const mm = ~~(time / 60 / 1000);
  const ss = ~~((time / 1000) % 60);
  return pad(mm) + ":" + pad(ss);
}

/**
 * Format a number as string. Uses comma as decimal separator.
 * @param {number | string} num
 * @returns {string}
 */
function formatNumber(num) {
  return num.toString().replace(/\./g, ",");
}

/**
 * Format the user answer for comparison purposes.
 * @param {string | number} input 
 * @returns 
 */
function formatAnswer(input) {
  return input
    .toString()
    .replace(/(\d+)\.(\d+)/g, (m) => `${m[1]},${m[2]}`)
    .replace(/^(\d+,\d*?)0+$/, (_, v) => v);
}

/**
 * Parse a number from a string. Supports comma as decimal separator.
 * @param {string} str
 * @returns {number}
 */

function parseNumber(str) {
  return parseFloat(str.replace(/,/g, "."));
}

/**
 * Get a random integer. From 0 to a - 1, or from a to b.
 * @param {number} a
 * @param {number=} b
 * @returns {number}
 */
function randInt(a, b) {
  if (a == null) throw new Error("At least one argument must be supplied.");
  if (b == null) return Math.floor(Math.random() * (a));
  return a + Math.floor(Math.random() * (b - a + 1));
}

/**
 * Perform a Fisher-Yates shuffle on an array.
 * @template T
 * @param {T[]} input
 * @returns {T[]}
 */
function shuffle(input) {
  let m = input.length;
  if (!m) return [];
  let array = input.slice(0);
  let i = 0;
  let t = array[0];
  while (m) {
    i = ~~(Math.random() * m--);
    t = array[i];
    array[i] = array[m];
    array[m] = t;
  }
  return array;
}

/**
 * @template T
 * @param {T} note
 * @param {import("./types").DeckBasic<T>} deck
 * @returns {import("./types").Deck<T>}
 */
function makeDeck(note, deck) {
  return {
    ...deck,
    notes: [],
  };
}

const EL = {
  app: $("#app"),
  tests: $("#tests"),
  test: $("#test"),
  title: $("#title"),
  question: $("#question"),
  answer: $("#answer"),
  current: $("#current"),
  count: $("#count"),
  next: $(".js-next"),
  quit: $(".js-quit"),
};

const app = {
  screen: "test",
  /**
   * Change the current screen.
   * @param {string} key
   */
  changeScreen(key) {
    app.screen = key;
    EL.app.querySelectorAll(".screen").forEach((el) => {
      if (el.id === key) {
        el.classList.remove("hidden");
      } else {
        el.classList.add("hidden");
      }
    });
  },
};

const vals = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];

const ABC = { a: 0, b: 0, c: 0 };
// unit conversion
// u = unit, p = prefix
const UC = { u: "", a: 0, ap: "", b: 0, bp: ""}

const UNITS = ["g", "L", "m"];

const PREFIX = {
  "k": Math.pow(10, 3),
  "": 1,
  // "d": Math.pow(10, -1),
  "c": Math.pow(10, -2),
  // "%": Math.pow(10, -2),
  "m": Math.pow(10, -3),
  "µ": Math.pow(10, -6),
}

const PREFIXES = Object.keys(PREFIX);

/**
 * Format a decimal number.
 * @param {number} num 
 * @returns 
 */
function formatDecimal(num) {
  return num.toFixed(9).replace(/^(\d+\.\d*?)0+$/, (_, v) => v).replace(".", ",").replace(/,$/, "");
}

const decks = {
  AddSub1: makeDeck(ABC, {
    title: "Yhteen- ja vähennyslaskut 1",
    inputType: "tel",
    baseTime: 60,
    count: 20,
    cards: [
      ({ a, b, c }) => ({ Q: `${a} + ${b} = ::`, A: c }),
      ({ a, b, c }) => ({ Q: `${b} + ${a} = ::`, A: c }),
      ({ a, b, c }) => ({ Q: `${c} − ${b} = ::`, A: a }),
      ({ a, b, c }) => ({ Q: `${c} − ${a} = ::`, A: b }),
    ],
  }),
  AddSub2: makeDeck(ABC, {
    title: "Yhteen- ja vähennyslaskut 2",
    inputType: "tel",
    baseTime: 75,
    count: 20,
    cards: [
      ({ a, b, c }) => ({ Q: `${a} + ${b} = ::`, A: c }),
      ({ a, b, c }) => ({ Q: `${b} + ${a} = ::`, A: c }),
      ({ a, b, c }) => ({ Q: `${c} − ${b} = ::`, A: a }),
      ({ a, b, c }) => ({ Q: `${c} − ${a} = ::`, A: b }),
    ],
  }),
  MulDiv1: makeDeck(ABC, {
    title: "Kerto- ja jakolaskut 1",
    inputType: "tel",
    baseTime: 90,
    count: 20,
    cards: [
      ({ a, b, c }) => ({ Q: `${a} × ${b} = ::`, A: c }),
      ({ a, b, c }) => ({ Q: `${b} × ${a} = ::`, A: c }),
      ({ a, b, c }) => ({ Q: `${c} ÷ ${b} = ::`, A: a }),
      ({ a, b, c }) => ({ Q: `${c} ÷ ${a} = ::`, A: b }),
    ],
  }),
  MulDiv2: makeDeck(ABC, {
    title: "Kerto- ja jakolaskut 2",
    inputType: "tel",
    baseTime: 120,
    count: 20,
    cards: [
      ({ a, b, c }) => ({ Q: `${a} × ${b} = ::`, A: c }),
      ({ a, b, c }) => ({ Q: `${b} × ${a} = ::`, A: c }),
      ({ a, b, c }) => ({ Q: `${c} ÷ ${b} = ::`, A: a }),
      ({ a, b, c }) => ({ Q: `${c} ÷ ${a} = ::`, A: b }),
    ],
  }),
  Units1: makeDeck(UC, {
    title: "Yksikkömuunnokset 1",
    inputType: "tel",
    baseTime: 60,
    count: 20,
    cut: false,
    cards: [
      ({ u, a, b, ap, bp }) => ({ Q: `${formatDecimal(a)}${ap}${u} = :: ${bp}${u}?`, A: formatDecimal(b) }),
      ({ u, a, b, ap, bp }) => ({ Q: `${formatDecimal(b)}${bp}${u} = :: ${ap}${u}?`, A: formatDecimal(a) }),
    ],
    noteGen: () => {
      const plen = PREFIXES.length;
      // const pcti = PREFIXES.indexOf("%");
      let u = UNITS[randInt(UNITS.length)];
      let api = randInt(plen);
      let bpi = api;
      
      while (api === bpi) {
        bpi = clamp(api + randInt(-2, 2), 0, plen - 1)
      }

      let ap = PREFIXES[api];
      let bp = PREFIXES[bpi];

      if (Math.random() > 0.5) {
        [ap, bp] = [bp, ap];
      }

      const a = parseFloat((randInt(1, 1000) / ((10 * randInt(0, 3)) || 1)).toFixed(3));
      const b = (a * PREFIX[ap]) / PREFIX[bp];
      return { u, a, b, ap, bp };
    },
  }),
};

// create test buttons

// create notes
for (let i = 1; i < 10; ++i) {
  const a = vals[i];
  for (let ii = i; ii < 10; ++ii) {
    const b = vals[ii];
    decks.AddSub1.notes.push({ a, b, c: a + b });
    decks.MulDiv1.notes.push({ a, b, c: a * b });
  }
  for (let ii = 10; ii < 20; ++ii) {
    const b = vals[ii];
    decks.MulDiv2.notes.push({ a, b, c: a * b });
  }
}
for (let i = 1; i < 20; ++i) {
  const a = vals[i];
  for (let ii = 10; ii < 19; ++ii) {
    const b = vals[ii];
    decks.AddSub2.notes.push({ a, b, c: a + b });
  }
}

/**
 * Make a test.
 * @param {keyof typeof decks} key
 * @returns {import("./types").Test}
 */
function makeTest(key) {
  /** @type {import("./types").Deck<any>} */
  const deck = decks[key];
  let cards = deck.cards.slice();
  const cut = +(deck.cut ?? true) + 1;
  const cardCount = deck.count * cut;
  while (cards.length < cardCount) {
    cards = cards.concat(deck.cards);
  }
  const shuffler = deck.shuffle ?? shuffle;
  cards = shuffler(cards).slice(0, deck.count);
  console.log(cards);
  const notes = deck.notes.slice();
  if (!notes.length && deck.noteGen) {
    const set = new Set();
    while (set.size < cardCount) {
      const note = deck.noteGen();
      const key = JSON.stringify(note);
      set.add(key);
    };
    set.forEach(n => {
      notes.push(JSON.parse(n));
    });
  }
  const tasks = shuffle(notes)
    .slice(0, deck.count)
    .map((note, i) => {
      return cards[i](note);
    });
  const grade = grades[key] ?? 0;
  return {
    key,
    deck,
    tasks,
    grade,
    startTime: Date.now(),
    endTime: null,
    state: "review",
    index: -1,
    right: 0,
    wrong: 0,
  };
}

/**
 *
 * @param {number} stars
 */
function formatGrade(stars) {
  if (stars > 5) throw new Error("Exceeded maximum rating.");
  let html = "";
  for (let i = 0; i < 5; ++i) {
    const full = stars === 5 ? "var(--star-perfect)" : "var(--star-full)";
    const empty = "var(--star-empty)";
    html += `<span style="color: ${i < stars ? full : empty}">${STAR}</span>`;
  }
  return html;
}

/**
 *
 * @param {Test} test
 */
function gradeTest(test) {
  if (!test.endTime) {
    throw new Error("Only finished tests can be graded.");
  }
  const time = Math.floor((test.endTime - test.startTime) / 1000);
  const stars = Math.max(
    1,
    5 - Math.floor(time / test.deck.baseTime) - test.wrong
  );

  return {
    stars,
    html: formatGrade(stars),
  };
}

/** @type {Test} */
let test;

const INPUT = `<input type="text" name="answer" autocomplete="off" />`;

/**
 * Format question as a HTML string.
 * @param {string} str
 * @returns {string}
 */
function formatQuestion(str) {
  str = str.replace("::", INPUT);
  if (test.deck.inputType !== "text") {
    str = str.replace(`"text"`, `"${test.deck.inputType}"`);
  }
  return str;
}

/**
 * Start a test.
 * @param {keyof typeof decks} key
 */
function startTest(key) {
  app.changeScreen("test");
  test = makeTest(key);
  EL.title.innerHTML = test.deck.title;
  EL.next.removeAttribute("disabled");
  EL.count.textContent = String(test.deck.count);
  progressTest();
}

function quitTest() {
  app.changeScreen("menu");
  const btn = $(`.start-test[data-test='${test.key}'`);
  const grade = $(".grade", btn);
  // upgrade star rating if a new record was reached
  if (
    grades[test.key] > parseInt(grade.getAttribute("data-grade") ?? "0", 10)
  ) {
    $(".grade", btn).innerHTML = formatGrade(grades[test.key]);
  }
  currentFocus = $(`.start-test[data-test='${test.key}'`);
  currentFocus.focus();
}

function progressTest() {
  const task = test.tasks[test.index];
  const input = formatAnswer(/** @type {any} */ (EL.test).answer?.value ?? "");
  switch (test.state) {
    case "wait": {
      test.state = "review";
      const el = $("input", EL.question);
      const answers =
        task.A instanceof Array
          ? task.A.map(formatNumber)
          : [formatAnswer(task.A)];
      // el.setAttribute("disabled", "");
      const idx = answers.indexOf(input);
      if (idx > -1) {
        EL.answer.classList.add("right");
        el.classList.add("right");
        EL.answer.innerHTML = "Oikein!";
        ++test.right;
      } else {
        EL.answer.classList.add("wrong");
        el.classList.add("wrong");
        const closest = { answer: answers[0], distance: Infinity };
        if (answers.length > 1)
          answers.forEach((answer) => {
            const dist = distance(input, answer);
            if (dist < closest.distance) {
              closest.answer = answer;
              closest.distance = dist;
            }
          });
        EL.answer.innerHTML = `Väärin! Vastaus: ${closest.answer}`;
        ++test.wrong;
      }
      EL.next.textContent = "Seuraava";
      // EL.next.focus();
      break;
    }
    case "result": {
      // quit with perfect score
      if (test.grade === 5) {
        return quitTest();
      }
      // else restart the test
      test = makeTest(/** @type {keyof typeof decks} */ (test.key))
      // no break so we go to the next step for rest of restart
    }
    case "review": {
      test.index += 1;
      if (test.index < test.deck.count) {
        test.state = "wait";
        const task = test.tasks[test.index];
        EL.current.textContent = String(test.index + 1);
        EL.answer.classList.remove("wrong");
        EL.answer.classList.remove("right");
        EL.answer.innerHTML = "&nbsp;";
        EL.question.innerHTML = formatQuestion(task.Q);
        EL.next.textContent = "Tarkasta";
        $("input", EL.question).focus();
      } else {
        test.state = "result";
        test.endTime = Date.now();
        const grade = gradeTest(test);
        // store improved grades in localStorage
        if (grade.stars > (grades[test.key] ?? 0)) {
          grades[test.key] = grade.stars;
          localStorage.setItem(STORE, JSON.stringify(grades));
        }
        test.grade = grade.stars;
        const time = test.endTime - test.startTime;
        const pct = Math.round((test.right / test.deck.count) * 100);
        EL.next.textContent = "Uudestaan";
        EL.question.innerHTML = `
        <div class="flex flex-col">
        <span class="right">Oikein: ${test.right} / ${test.deck.count}</span>
        <span class="wrong">Väärin: ${test.wrong} / ${test.deck.count}</span>
        <span>Sait ${pct}% oikein!</span>
        <span>Suoritusaika: ${formatTime(time)}</span>
        <div class="flex" style="gap: 0.125rem; font-size: 1.75em;">
          ${grade.html}
        </div>
        </div>
        `;
        EL.answer.innerHTML = `<input type="text" name="answer" style="opacity: 0;" />`;
        $("input", EL.answer).focus();
      }
      break;
    }
  }
}

EL.test.addEventListener("submit", (e) => {
  e.preventDefault();
  progressTest();
});

EL.quit.addEventListener("click", quitTest);

function printTest() {
  let str = test.deck.title + "\n\n";
  for (let i = 0; i < test.tasks.length; ++i) {
    str += `${i + 1}. ${test.tasks[i].Q.replace("::", "?")}\n`;
  }
  console.log(str);
}

// create test start buttons
let html = ``;
for (let key in decks) {
  html += `<button onclick="startTest('${key}')" class="start-test self-stretch" data-test="${key}">
    <span>${decks[key].title.replace(/\s(\d+)$/, (m) => `&nbsp;${m[1]}`)}</span>
    <div class="grade" data-grade="${grades[key] ?? 0}">${formatGrade(
    grades[key] ?? 0
  )}</div>  
  </button>`;
}
EL.tests.innerHTML = html;

app.changeScreen("menu");
var currentFocus = $(".start-test");
currentFocus.focus();

function focusTestButton(key) {
  EL.tests.querySelectorAll(".start-test").forEach((button) => {
    const btn = /** @type {HTMLElement} */ (button);
    if (btn.getAttribute("data-test") === key) {
      btn.focus();
      currentFocus = btn;
    }
  });
}

d.addEventListener("keydown", (e) => {
  switch (app.screen) {
    case "menu": {
      switch (e.key) {
        case "ArrowDown": {
          if (currentFocus.nextElementSibling) {
            currentFocus = /** @type {HTMLElement} */ (
              currentFocus.nextElementSibling
            );
            currentFocus.focus();
            break;
          }
        }
        case "ArrowUp": {
          if (currentFocus.previousElementSibling) {
            currentFocus = /** @type {HTMLElement} */ (
              currentFocus.previousElementSibling
            );
            currentFocus.focus();
            break;
          }
        }
      }
      break;
    }
  }
});
