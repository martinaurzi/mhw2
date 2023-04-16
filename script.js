/* TODO: inserite il codice JavaScript necessario a completare il MHW! */
function changeToUnselected(deselectedDiv){
    deselectedDiv.classList.remove('selected');
    deselectedDiv.classList.add('unselected');

    const image = deselectedDiv.querySelector('.checkbox');
    image.src = "./images/unchecked.png";

    // riaggiungo event Listener per rendere l'elemento nuovamente cliccabile
    deselectedDiv.addEventListener('click', changeToSelected);
}

function findElement(elementToFind){
  for(const box in selectedBoxes)
    if(box === elementToFind)
      return true;  
}

function stopSelecting(){
  for(const box of boxes)
    box.removeEventListener('click', changeToSelected);
}

function startSelecting(){
  for(const box of boxes)
    box.addEventListener('click', changeToSelected);
}

function countElement(){
  let count = 0;

  for(const box in selectedBoxes)
    count++;
     
  return count;
}

function getPersonality(){ 
  if(selectedBoxes["two"] === selectedBoxes["three"])
    return selectedBoxes["two"];
  else return selectedBoxes["one"];
}

function refreshGame(){
  // Le risposte scelte devono tornare al loro aspetto originario
  for(const box in selectedBoxes){
    for(const div of boxes){
      if(div.dataset.questionId === box && 
        div.dataset.choiceId === selectedBoxes[box]){
          let image = div.querySelector('.checkbox');
          image.src = "./images/unchecked.png";
          div.classList.remove('selected');
          delete selectedBoxes[box];
        }
    }
  }

  for(const box of boxes)
    box.classList.remove('unselected');

  // Il risultato sulla personalità deve scomparire
  personalityContainer.innerHTML = '';
  personalityContainer.classList.add('hidden');

  // Le risposte devono poter essere nuovamente selezionabili
  startSelecting();
}

function displayPersonality(){
  const personality = getPersonality();
  
  personalityContainer.classList.remove('hidden');

  const header = document.createElement('h1');
  header.textContent = RESULTS_MAP[personality].title;
  personalityContainer.appendChild(header);

  const p = document.createElement('p');
  p.textContent = RESULTS_MAP[personality].contents;
  personalityContainer.appendChild(p);

  const button = document.createElement('button');
  button.textContent = "Ricomincia il quiz";
  button.classList.add('border');
  personalityContainer.appendChild(button);

  button.addEventListener('click', refreshGame);
}

function changeToSelected(event){
  const selectedDiv = event.currentTarget;

  // cambio img del checkbox a checked ed il background 
  const image = selectedDiv.querySelector('.checkbox');    
  image.src = "./images/checked.png";
  selectedDiv.classList.add('selected');

  /* controllo se è già presente nella mappa un elemento con la stessa questionId
     dell'elemento che ho selezionato */
  if(findElement(selectedDiv.dataset.questionId)){ 
    selectedDiv.classList.remove('unselected');
  }
    
  // aggiungo l'elemento selezionato alla mappa selectedBoxes
  selectedBoxes[selectedDiv.dataset.questionId] = selectedDiv.dataset.choiceId;

  // rendo tutti gli altri div non selezionati, con la stessa questionId, trasparenti
  for(const box of boxes){
    if(box.dataset.questionId === selectedDiv.dataset.questionId &&
      box.dataset.choiceId !== selectedDiv.dataset.choiceId)
        changeToUnselected(box);
  }

  selectedDiv.removeEventListener('click', changeToSelected);
  
  if(countElement() === 3){ 
    stopSelecting();
    displayPersonality();
  }
}

const selectedBoxes = {}; 
const personalityContainer = document.querySelector('#results');
const boxes = document.querySelectorAll('.choice-grid div');

startSelecting();