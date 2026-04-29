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
  { name: "Anglais", coeff: 1.0, ds: 0.80, orl: 0.20 },
  // Nouvelle matière ajoutée selon ta demande :
  { name: "Prog Python", coeff: 1.0, ds: 0.10, ex: 0.70, tp: 0.20 }
];

function createSubjectCard(subject, index) {
  const card = document.createElement('div');
  card.className = 'subject-card';
  
  let inputsHTML = `<h3>${subject.name} <span class="coeff">(Coeff: ${subject.coeff})</span></h3><div class="inputs-grid">`;
  
  if (subject.ds) inputsHTML += `<div class="input-group"><label>DS</label><input type="number" step="0.25" min="0" max="20" class="ds-input" data-index="${index}" placeholder="00"></div>`;
  if (subject.ex) inputsHTML += `<div class="input-group"><label>Examen</label><input type="number" step="0.25" min="0" max="20" class="ex-input" data-index="${index}" placeholder="00"></div>`;
  if (subject.tp) inputsHTML += `<div class="input-group"><label>TP</label><input type="number" step="0.25" min="0" max="20" class="tp-input" data-index="${index}" placeholder="00"></div>`;
  if (subject.orl) inputsHTML += `<div class="input-group"><label>Oral/CC</label><input type="number" step="0.25" min="0" max="20" class="orl-input" data-index="${index}" placeholder="00"></div>`;
  if (subject.test) inputsHTML += `<div class="input-group"><label>Test</label><input type="number" step="0.25" min="0" max="20" class="test-input" data-index="${index}" placeholder="00"></div>`;
  
  inputsHTML += `</div><div class="subject-result">Moyenne: <span id="moy-${index}">0.00</span></div>`;
  card.innerHTML = inputsHTML;
  return card;
}

function calculateAll() {
  let totalPoints = 0;
  let totalCoeffs = 0;

  subjects.forEach((subject, index) => {
    const ds = parseFloat(document.querySelector(`.ds-input[data-index="${index}"]`)?.value) || 0;
    const ex = parseFloat(document.querySelector(`.ex-input[data-index="${index}"]`)?.value) || 0;
    const tp = parseFloat(document.querySelector(`.tp-input[data-index="${index}"]`)?.value) || 0;
    const orl = parseFloat(document.querySelector(`.orl-input[data-index="${index}"]`)?.value) || 0;
    const test = parseFloat(document.querySelector(`.test-input[data-index="${index}"]`)?.value) || 0;

    let moy = 0;
    if (subject.test) {
      moy = test * subject.test;
    } else {
      moy = (ds * (subject.ds || 0)) + (ex * (subject.ex || 0)) + (tp * (subject.tp || 0)) + (orl * (subject.orl || 0));
    }

    document.getElementById(`moy-${index}`).innerText = moy.toFixed(2);
    totalPoints += moy * subject.coeff;
    totalCoeffs += subject.coeff;
  });

  const genAverage = totalPoints / totalCoeffs;
  const avgElement = document.getElementById('moyenne-generale');
  avgElement.innerText = genAverage.toFixed(2);

  // Barre de progression et mention
  const progress = document.getElementById('progress');
  const percent = (genAverage / 20) * 100;
  progress.style.width = Math.min(percent, 100) + '%';
  
  const mention = document.getElementById('mention');
  if (genAverage >= 16) mention.innerText = "Mention Très Bien 🌟";
  else if (genAverage >= 14) mention.innerText = "Mention Bien 👍";
  else if (genAverage >= 12) mention.innerText = "Mention Assez Bien 🙂";
  else if (genAverage >= 10) mention.innerText = "Admis (Passable) 🎓";
  else mention.innerText = "Ajourné (Moyenne < 10) 📚";
}

function resetAll() {
  document.querySelectorAll('input').forEach(input => input.value = '');
  document.querySelectorAll('[id^="moy-"]').forEach(span => span.innerText = '0.00');
  document.getElementById('moyenne-generale').innerText = '0.00';
  document.getElementById('progress').style.width = '0%';
  document.getElementById('mention').innerText = '';
}

// Initialisation
const container = document.getElementById('subjects');
subjects.forEach((s, i) => container.appendChild(createSubjectCard(s, i)));

// Theme Toggle
const btn = document.getElementById("theme-toggle");
btn.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  btn.innerHTML = document.body.classList.contains("dark-theme") ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});
