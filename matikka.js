//@ts-check
const d = document;

/* scale to window */
const BASE_WIDTH = 320;
const BASE_FONT_SIZE = 16;
const SCALE_MAX = 2;

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
$.on = function (el, evt, cb) {
  el.addEventListener(evt, cb);
};
$.off = function (el, evt, cb) {
  el.removeEventListener(evt, cb);
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
 * Parse a number from a string. Supports comma as decimal separator.
 * @param {string} str
 * @returns {number}
 */

function parseNumber(str) {
  return parseFloat(str.replace(/,/g, "."));
}

/**
 * Get a random integer. From 0 to a, or from a to b.
 * @param {number} a
 * @param {number=} b
 * @returns {number}
 */
function randInt(a, b) {
  if (a == null) throw new Error("At least one argument must be supplied.");
  if (b == null) return Math.floor(Math.random() * (a + 1));
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

const decks = {
  AddSub1: makeDeck(ABC, {
    title: "Yhteen- ja vähennyslaskut 1",
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
    count: 20,
    cards: [
      ({ a, b, c }) => ({ Q: `${a} × ${b} = ::`, A: c }),
      ({ a, b, c }) => ({ Q: `${b} × ${a} = ::`, A: c }),
      ({ a, b, c }) => ({ Q: `${c} ÷ ${b} = ::`, A: a }),
      ({ a, b, c }) => ({ Q: `${c} ÷ ${a} = ::`, A: b }),
    ],
  }),
};

// create test buttons

// create notes
for (let i = 0; i < 10; ++i) {
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
for (let i = 0; i < 20; ++i) {
  const a = vals[i];
  for (let ii = i; ii < 20; ++ii) {
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
  const deck = decks[key];
  let cards = deck.cards.slice();
  const cardCount = deck.count * 2;
  while (cards.length < cardCount) {
    cards = cards.concat(deck.cards);
  }
  cards = shuffle(cards).slice(0, deck.count);
  const tasks = shuffle(deck.notes)
    .slice(0, deck.count)
    .map((note, i) => {
      return cards[i](note);
    });
  return {
    key,
    title: deck.title,
    count: deck.count,
    tasks,
    startTime: Date.now(),
    state: "review",
    index: -1,
    right: 0,
    wrong: 0,
  };
}

/** @type {import("./types").Test} */
let test;

const INPUT = `<input type="text" name="answer" autocomplete="off" />`;

/**
 * Format question as a HTML string.
 * @param {string} str
 * @returns {string}
 */
function formatQuestion(str) {
  return str.replace("::", INPUT);
}

/**
 * Start a test.
 * @param {keyof typeof decks} key
 */
function startTest(key) {
  app.changeScreen("test");
  test = makeTest(key);
  EL.title.textContent = test.title;
  EL.next.removeAttribute("disabled");
  EL.count.textContent = String(test.count);
  progressTest();
}

function progressTest() {
  const task = test.tasks[test.index];
  const input = /** @type {any} */ (EL.test).answer?.value;
  switch (test.state) {
    case "wait": {
      test.state = "review";
      const el = $("input", EL.question);
      const answers =
        task.A instanceof Array
          ? task.A.map(formatNumber)
          : [formatNumber(task.A)];
      el.setAttribute("disabled", "");
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
        if (answers.length > 1) answers.forEach(answer => {
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
      EL.next.focus();
      break;
    }
    case "review": {
      test.index += 1;
      if (test.index < test.count) {
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
        const endTime = Date.now();
        const time = endTime - test.startTime;
        const pct = Math.round(test.right / test.count) * 100;
        EL.question.innerHTML = `
        <div class="flex flex-col">
        <span class="right">Oikein: ${test.right} / ${test.count}</span>
        <span class="wrong">Väärin: ${test.wrong} / ${test.count}</span>
        <span>Sait ${pct}% oikein!</span>
        <span>Suoritusaika: ${formatTime(time)}</span>
        </div>
        `;
        EL.answer.innerHTML = ``;
        EL.next.setAttribute("disabled", "");
        EL.quit.focus();
        // TBD
      }
    }
  }
}

EL.test.addEventListener("submit", (e) => {
  e.preventDefault();
  progressTest();
});

EL.quit.addEventListener("click", (e) => {
  app.changeScreen("menu");
  currentFocus = $(`.start-test[data-test='${test.key}'`);
  currentFocus.focus();
});

function printTest() {
  let str = test.title + "\n\n";
  for (let i = 0; i < test.tasks.length; ++i) {
    str += `${i + 1}. ${test.tasks[i].Q.replace("::", "?")}\n`;
  }
  console.log(str);
}

// create test start buttons
let html = ``;
for (let key in decks) {
  html += `<button onclick="startTest('${key}')" class="start-test self-stretch" data-test="${key}">${decks[key].title}</button>`;
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
  console.log(app.screen, e.key);
  switch (app.screen) {
    case "menu": {
      console.log(e.key);
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
