const subjects = [
  { name: "Algèbre", coeff: 1.5, ds: 0.20, ex: 0.70, orl: 0.10 },
  { name: "ASD", coeff: 1.5, ds: 0.20, ex: 0.70, orl: 0.10 },
  { name: "Analyse", coeff: 1.5, ds: 0.20, ex: 0.70, orl: 0.10 },
  { name: "Atelier", coeff: 1.0, ds: 0.10, ex: 0.70, tp: 0.20 },
  { name: "BD", coeff: 2.0, ds: 0.20, ex: 0.70, orl: 0.10 },
  { name: "Sys d'Exploitation", coeff: 1.5, ds: 0.10, ex: 0.70, tp: 0.20 },
  { name: "Réseaux", coeff: 2.0, ds: 0.10, ex: 0.70, tp: 0.20 },
  { name: "Français", coeff: 1.0, ds: 0.80, orl: 0.20 },
  { name: "2CN", coeff: 1.0, test: 1.00 },
  { name: "Anglais", coeff: 1.0, ds: 0.80, orl: 0.20 }
];

function createSubjectCard(subject, index) {
  const card = document.createElement('div');
  card.className = 'subject-card';
  
  // Helper to build inputs only if the property exists
  const fields = [
    { key: 'ds', label: 'DS' },
    { key: 'ex', label: 'Examen' },
    { key: 'orl', label: 'Oral' },
    { key: 'tp', label: 'TP' },
    { key: 'test', label: 'Test' }
  ];

  let inputsHTML = fields.map(field => {
    if (subject[field.key] === undefined) return '';
    const labelText = field.key === 'test' ? '100%' : `${Math.round(subject[field.key] * 100)}%`;
    return `
      <div class="input-group">
        <label>${field.label} (${labelText})</label>
        <input type="number" min="0" max="20" step="0.25" 
               id="${field.key}-${index}" 
               placeholder="Note" 
               oninput="liveCalculate()">
      </div>`;
  }).join('');

  card.innerHTML = `
    <h3>${subject.name} <small>(Coeff: ${subject.coeff})</small></h3>
    ${inputsHTML}
    <div class="moyenne-matiere">
      Moyenne : <span id="moy-${index}">0.00</span> / 20
    </div>
  `;
  return card;
}

function loadSubjects() {
  const container = document.getElementById('subjects');
  if (!container) return;
  subjects.forEach((sub, i) => {
    container.appendChild(createSubjectCard(sub, i));
  });
}

// Fixed: Now triggers the calculation
function liveCalculate() {
  calculateAll();
}

function calculateAll() {
  let totalPoints = 0;
  let totalCoeff = 0;

  subjects.forEach((subject, i) => {
    let moyMatiere = 0;

    if (subject.test !== undefined) {
      moyMatiere = parseFloat(document.getElementById(`test-${i}`).value) || 0;
    } else {
      const ds = parseFloat(document.getElementById(`ds-${i}`)?.value) || 0;
      const ex = parseFloat(document.getElementById(`ex-${i}`)?.value) || 0;
      const orl = parseFloat(document.getElementById(`orl-${i}`)?.value) || 0;
      const tp = parseFloat(document.getElementById(`tp-${i}`)?.value) || 0;

      // Calculation logic based on coefficients provided in the object
      moyMatiere = (ds * (subject.ds || 0)) + 
                   (ex * (subject.ex || 0)) + 
                   (orl * (subject.orl || 0)) + 
                   (tp * (subject.tp || 0));
    }

    const moyEl = document.getElementById(`moy-${i}`);
    if (moyEl) moyEl.textContent = moyMatiere.toFixed(2);

    totalPoints += moyMatiere * subject.coeff;
    totalCoeff += subject.coeff;
  });

  const moyenneGenerale = totalCoeff > 0 ? totalPoints / totalCoeff : 0;

  // Update UI
  const moyGenEl = document.getElementById('moyenne-generale');
  const progressEl = document.getElementById('progress');
  const mentionEl = document.getElementById('mention');

  if (moyGenEl) moyGenEl.textContent = moyenneGenerale.toFixed(2);
  if (progressEl) progressEl.style.width = `${(moyenneGenerale / 20) * 100}%`;

  if (mentionEl) {
    if (moyenneGenerale >= 16) mentionEl.textContent = "Excellent ! 🎉";
    else if (moyenneGenerale >= 14) mentionEl.textContent = "Très Bien";
    else if (moyenneGenerale >= 12) mentionEl.textContent = "Bien";
    else if (moyenneGenerale >= 10) mentionEl.textContent = "Assez Bien";
    else mentionEl.textContent = "Rattrapage / Échec";
  }
}

// Reset function
window.resetAll = function() {
  if (confirm("Réinitialiser toutes les notes ?")) {
    document.querySelectorAll('input').forEach(input => input.value = '');
    calculateAll(); // Recalculate to reset spans and progress bar
  }
};

// Theme Toggle logic
const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const icon = themeBtn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-moon');
      icon.classList.toggle('fa-sun');
    }
  });
}

// Initialize
loadSubjects();