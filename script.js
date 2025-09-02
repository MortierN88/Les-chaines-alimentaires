const correctOrder = ['herbe','sauterelle','grenouille','serpent','aigle'];
const assets = {
  herbe: {label: 'Herbe', emoji: '🌿'},
  sauterelle: {label: 'Sauterelle', emoji: '🦗'},
  grenouille: {label: 'Grenouille', emoji: '🐸'},
  serpent: {label: 'Serpent', emoji: '🐍'},
  aigle: {label: 'Aigle', emoji: '🦅'}
};

function el(html){ const template = document.createElement('template'); template.innerHTML = html.trim(); return template.content.firstChild; }

document.addEventListener('DOMContentLoaded', ()=>{
  const startBtn = document.getElementById('startBtn');
  const game = document.getElementById('game');
  const intro = document.getElementById('intro');
  const bank = document.getElementById('bank');
  const slots = document.getElementById('slots');
  const checkBtn = document.getElementById('checkBtn');
  const resetBtn = document.getElementById('resetBtn');
  const feedback = document.getElementById('feedback');
  const quiz = document.getElementById('quiz');
  const conclusion = document.getElementById('conclusion');
  const quizForm = document.getElementById('quizForm');
  const quizFeedback = document.getElementById('quizFeedback');
  const replay = document.getElementById('replay');

  startBtn.addEventListener('click', ()=>{
    intro.classList.add('hidden');
    game.classList.remove('hidden');
    quiz.classList.add('hidden');
    conclusion.classList.add('hidden');
    initGame();
  });

  replay.addEventListener('click', ()=>{
    intro.classList.remove('hidden');
    game.classList.add('hidden');
    quiz.classList.add('hidden');
    conclusion.classList.add('hidden');
    feedback.textContent = '';
    bank.innerHTML = '';
    slots.innerHTML = '';
  });

  function initGame(){
    bank.innerHTML = '';
    slots.innerHTML = '';
    const order = shuffleArray([...correctOrder]);
    order.forEach(id=>{
      const item = el(`<div class="item" draggable="true" data-id="${id}"><div style="font-size:28px;text-align:center">${assets[id].emoji}</div><div style="font-size:12px;text-align:center">${assets[id].label}</div></div>`);
      bank.appendChild(item);
      item.addEventListener('dragstart', dragStart);
    });
    for(let i=0;i<correctOrder.length;i++){
      const slot = el(`<div class="slot" data-index="${i}"></div>`);
      slots.appendChild(slot);
      slot.addEventListener('dragover', dragOver);
      slot.addEventListener('drop', dropItem);
    }
    feedback.textContent = 'Glisse les éléments dans les cases vides.';
  }

  function dragStart(e){ e.dataTransfer.setData('text/plain', e.currentTarget.dataset.id); }
  function dragOver(e){ e.preventDefault(); }
  function dropItem(e){
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const slot = e.currentTarget;
    if(slot.firstChild){ document.getElementById('bank').appendChild(slot.firstChild); }
    const dragged = document.querySelector('.bank .item[data-id="'+id+'"]') || document.querySelector('.item[data-id="'+id+'"]');
    if(dragged){ slot.appendChild(dragged); }
  }

  checkBtn.addEventListener('click', ()=>{
    const placed = Array.from(document.querySelectorAll('.slot')).map(s=> s.firstChild ? s.firstChild.dataset.id : null);
    if(placed.includes(null)){ feedback.textContent = 'Place tous les éléments avant de vérifier.'; return; }
    const ok = placed.every((id,i)=> id === correctOrder[i]);
    if(ok){ feedback.textContent = '✅ Bravo — la chaîne est correcte !'; game.classList.add('hidden'); quiz.classList.remove('hidden'); }
    else{ feedback.textContent = '❌ Pas encore. Observe qui est le plus petit producteur et qui est le plus grand prédateur.'; }
  });

  resetBtn.addEventListener('click', initGame);

  quizForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const a1 = quizForm.q1.value;
    const a2 = quizForm.q2.value;
    let score = 0;
    if(a1 === 'herbe') score++;
    if(a2 === 'sauterelle') score++;
    quizFeedback.textContent = `Tu as ${score}/2 bonnes réponses.`;
    if(score === 2){ setTimeout(()=>{ quiz.classList.add('hidden'); conclusion.classList.remove('hidden'); },800); }
  });

  function shuffleArray(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]] } return a }
});
