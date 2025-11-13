const plank = document.getElementById("plank");
const weights = document.querySelectorAll(".weight");

let placedWeights = []; // { mass, distance, element }
const maxPerSide = 10;

// Make the bottom weights draggable
weights.forEach(w => {
  w.draggable = true;
  w.addEventListener("dragstart", e => {
    e.dataTransfer.setData("mass", w.dataset.mass);
  });
});

// Seesaw dragging
plank.addEventListener("dragover", e => e.preventDefault());
plank.addEventListener("drop", handleDrop);

function handleDrop(e) {
  e.preventDefault();
  const mass = Number(e.dataTransfer.getData("mass"));
  const rect = plank.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const pivot = rect.width / 2;
  const distance = x - pivot;

  const side = distance < 0 ? "left" : "right";
  const sideCount = placedWeights.filter(w => w.side === side).length;
  if (sideCount >= maxPerSide) return; // limit 10 per side

  // Create new weight
  const clone = document.createElement("div");
  clone.className = "weight on-plank";
  clone.style.left = `${x}px`;
  clone.textContent = mass;
  clone.dataset.mass = mass;

  // Add weight to the plank
  plank.appendChild(clone);

  // Add to the list
  placedWeights.push({ mass, distance, element: clone, side });

  updateSeesaw();

  // Delete weight by click
  clone.addEventListener("click", () => {
    // Remove from DOM
    clone.remove();

    // Remove from list
    placedWeights = placedWeights.filter(w => w.element !== clone);

    // Re-calculate the balance
    updateSeesaw();
  });
}

function updateSeesaw() {
  if (placedWeights.length === 0) {
    plank.style.transform = "translateX(-50%) rotate(0deg)";
    return;
  }

  // Total moment (torque)
  let totalMoment = 0;
  placedWeights.forEach(w => {
    totalMoment += w.mass * w.distance;
  });

  // Calculate the angel and apply
  const angle = Math.max(-30, Math.min(30, totalMoment * 0.02));
  plank.style.transform = `translateX(-50%) rotate(${angle}deg)`;
}
