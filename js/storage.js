function save() {
  const data = [...document.querySelectorAll(".box")].map(el => ({
    id: el.dataset.id,
    type: el.dataset.type,
    x: el.style.left,
    y: el.style.top,
    width: el.style.width,
    height: el.style.height,
    color: el.style.background
  }));

  localStorage.setItem("design", JSON.stringify(data));
}

window.onload = () => {
  const data = JSON.parse(localStorage.getItem("design") || "[]");

  data.forEach(d => {
    const el = document.createElement("div");
    el.className = "box";
    Object.assign(el.style, {
      left: d.x,
      top: d.y,
      width: d.width,
      height: d.height,
      background: d.color
    });

    el.dataset.id = d.id;
    el.dataset.type = d.type;

    makeSelectable(el);
    canvas.appendChild(el);
  });
};
