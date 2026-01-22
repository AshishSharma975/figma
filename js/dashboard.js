document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("newProjectBtn");

  if (btn) {
    btn.addEventListener("click", () => {
      window.location.href = "editor.html";
    });
  }
});
