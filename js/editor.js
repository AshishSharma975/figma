const canvas = document.getElementById("canvas");
const tools = document.querySelectorAll(".tool");
const colorPicker = document.getElementById("color");

let currentTool = "select";
let selected = null;
let isDrawing = false;
let startX = 0;
let startY = 0;

/* TOOL SELECT */
tools.forEach(btn => {
  btn.onclick = () => {
    tools.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentTool = btn.dataset.tool;
  };
});

/* =======================
   DRAW RECTANGLE
======================= */
canvas.addEventListener("mousedown", (e) => {
  if (currentTool !== "rect") return;

  isDrawing = true;

  const rect = document.createElement("div");
  rect.className = "element";
  rect.style.left = e.clientX + "px";
  rect.style.top = e.clientY + "px";

  canvas.appendChild(rect);
  select(rect);

  startX = e.clientX;
  startY = e.clientY;

  function draw(ev) {
    if (!isDrawing) return;

    const w = ev.clientX - startX;
    const h = ev.clientY - startY;

    rect.style.width = Math.abs(w) + "px";
    rect.style.height = Math.abs(h) + "px";
    rect.style.left = (w < 0 ? ev.clientX : startX) + "px";
    rect.style.top = (h < 0 ? ev.clientY : startY) + "px";
  }

  function stop() {
    isDrawing = false;
    makeDraggable(rect);
    addResize(rect);
    save();

    document.removeEventListener("mousemove", draw);
    document.removeEventListener("mouseup", stop);
  }

  document.addEventListener("mousemove", draw);
  document.addEventListener("mouseup", stop);
});

/* =======================
   TEXT TOOL
======================= */
canvas.addEventListener("click", (e) => {
  if (currentTool !== "text") return;

  const text = document.createElement("div");
  text.className = "element text";
  text.contentEditable = true;
  text.textContent = "Text";
  text.style.left = e.clientX + "px";
  text.style.top = e.clientY + "px";

  canvas.appendChild(text);
  makeDraggable(text);
  select(text);
  save();
});

/* =======================
   SELECT
======================= */
function select(el) {
  document.querySelectorAll(".element").forEach(e => e.classList.remove("selected"));
  el.classList.add("selected");
  selected = el;
}

/* =======================
   DRAG
======================= */
function makeDraggable(el) {
  el.onmousedown = (e) => {
    if (currentTool !== "select") return;

    e.stopPropagation();
    select(el);

    const startX = e.clientX - el.offsetLeft;
    const startY = e.clientY - el.offsetTop;

    function move(ev) {
      el.style.left = ev.clientX - startX + "px";
      el.style.top = ev.clientY - startY + "px";
    }

    function stop() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", stop);
      save();
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", stop);
  };
}

/* =======================
   RESIZE
======================= */
function addResize(el) {
  const handle = document.createElement("div");
  handle.className = "handle";
  el.appendChild(handle);

  handle.onmousedown = (e) => {
    e.stopPropagation();

    function resize(ev) {
      el.style.width = ev.clientX - el.offsetLeft + "px";
      el.style.height = ev.clientY - el.offsetTop + "px";
    }

    function stop() {
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stop);
      save();
    }

    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stop);
  };
}

/* =======================
   COLOR
======================= */
colorPicker.oninput = () => {
  if (selected) selected.style.background = colorPicker.value;
};

/* =======================
   DELETE
======================= */
document.addEventListener("keydown", (e) => {
  if (e.key === "Delete" && selected) {
    selected.remove();
    selected = null;
    save();
  }
});

/* =======================
   SAVE / LOAD
======================= */
function save() {
  const data = [...document.querySelectorAll(".element")].map(el => ({
    x: el.style.left,
    y: el.style.top,
    w: el.style.width,
    h: el.style.height,
    text: el.textContent,
    bg: el.style.background,
    type: el.classList.contains("text") ? "text" : "box"
  }));

  localStorage.setItem("design", JSON.stringify(data));
}

window.onload = () => {
  const data = JSON.parse(localStorage.getItem("design") || "[]");

  data.forEach(d => {
    const el = document.createElement("div");
    el.className = "element" + (d.type === "text" ? " text" : "");
    el.style.left = d.x;
    el.style.top = d.y;
    el.style.width = d.w;
    el.style.height = d.h;
    el.style.background = d.bg;
    el.textContent = d.text;

    makeDraggable(el);
    if (d.type !== "text") addResize(el);

    canvas.appendChild(el);
  });
};
