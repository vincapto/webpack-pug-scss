import './styles/index.scss';
import {
  getBody,
  createNotification,
  createLeaderBoard,
  createPopup,
  createPuzzleCell,
  createPuzzleItem,
  createPuzzleItemCell,
  createPuzzleItemList,
} from './body';

import { Timer } from './timer';
import { AnimateDrag } from './animation.js';

const body = document.querySelector('body');
body.innerHTML = getBody();

let seconds = document.querySelector('.seconds');
const timer = new Timer(showTimeCallback);

const selectSize = document.querySelector('.controlSelect');
const shuffleButton = document.querySelector('.controlShuffle');
const alarmCheck = document.querySelector('#alarmCheck');
const easyCheck = document.querySelector('#easyCheck');
const resetButton = document.querySelector('.controlReset');
const saveButton = document.querySelector('.controlSave');
const loadButton = document.querySelector('.controlLoad');
const infoButton = document.querySelector('.controlInfo');
const movesCountElement = document.querySelector('.movesCount');
const soundCheck = document.querySelector('#soundCheck');
const moveSound = document.getElementById('myAudio');
const modal = document.querySelector('.modal');
const puzzleListElement = document.querySelector('.puzzle__list');
const savedModal = document.querySelector('.savedModal');

moveSound.playbackRate = 1.4;

let arrayLength = 16;
let showCount = 0;
let animateDrag = null;
let solutionShuffle = [];

function showTimeCallback(str) {
  seconds.innerHTML = str;
}

showRules();

saveButton.addEventListener('click', () => {
  saveGame('');
});

loadButton.addEventListener('click', () => {
  loadGame('');
});

alarmCheck.addEventListener('change', (event) => {
  localStorage.setItem('rules', JSON.stringify(event.target.checked));
});

selectSize.addEventListener('change', (event) => {
  arrayLength = event.target.value ** 2;
  timer.clearCount();
  setGame();
  console.log(arrayLength);
});

shuffleButton.addEventListener('click', (event) => {
  console.log('SHUFFLE');
  setGame();
  // setBlinkTransition();
  timer.clearCount();
});

resetButton.addEventListener('click', (event) => {
  console.log('RESET');
  timer.startCount();
});

modal.addEventListener('click', (e) => {
  const closePopup = document.querySelector('.closePopup');
  if (modal === e.target || closePopup === e.target) {
    modal.classList.remove('activeModal');
    // callVictory();
  }
});

infoButton.addEventListener('click', (event) => {
  console.log('RUN SOLUTION');
  showModal(false);
});

function showRules() {
  const loaded = JSON.parse(localStorage.getItem('rules'));
  if (loaded === null || loaded === true) {
    modal.classList.toggle('activeModal');
    modal.innerHTML = createNotification();
  } else alarmCheck.checked = loaded;
}

function playAudio() {
  soundCheck.checked ? moveSound.play() : 0;
}

function fisherShuffle(arr) {
  let i = arr.length;
  if (easyCheck.checked) {
    console.log('EASY');
    [arr[i - 2], arr[i - 1]] = [arr[i - 1], arr[i - 2]];
    return arr;
  }
  while (--i > 0) {
    let randIndex = Math.floor(Math.random() * (i + 1));
    [arr[randIndex], arr[i]] = [arr[i], arr[randIndex]];
    // console.log(i + 1, randIndex + 1);
  }
  return arr;
}

function shuffleArray(arrayLength) {
  const array = Array(arrayLength)
    .fill(0)
    .map((_, key) => key);
  let shuffled = [];
  while (true) {
    shuffled = fisherShuffle(array);
    if (!isSolvable(shuffled)) {
      solutionShuffle = shuffled;
      return shuffled;
    }
  }
}

const checkVictory = (list) => {
  console.log(Array.isArray(list));
  const isVictory = list.every((a) => {
    console.log('ON PLACE', a.id === a.parentId);
    if (a.id === arrayLength.length - 1) return true;
    return a.id === a.parentId;
  });
  return isVictory;
};

const isSolvable = (arr) => {
  let inversion = 0;
  let len = arr.length - 1;
  for (let i = 0; i <= len; i++) {
    for (let j = i + 1; j <= len; j++) {
      if (arr[j] == len || arr[i] == len) continue;
      if (arr[j] < arr[i]) {
        inversion++;
      }
    }
  }
  const blank = Math.floor(arr.indexOf(len) / Math.sqrt(arrayLength));
  return arr.length % 2 !== 0
    ? inversion % 2 !== 0
    : (inversion + blank) % 2 === 0;
};

const setGridStyle = (count = 3) => {
  return `grid-template-columns: repeat(${count}, 1fr);
    grid-template-rows: repeat(${count}, 1fr);font-size:${90 / count}px;`;
};

const saveLeaderBoard = (score) => {
  const loaded = JSON.parse(localStorage.getItem('board'));
  console.log(loaded);
  if (loaded) {
    const list = [...loaded, score].sort((a, b) => {
      return a.total - b.total;
    });
    console.log(list);
    localStorage.setItem('board', JSON.stringify(list.slice(0, 10)));
  } else localStorage.setItem('board', JSON.stringify([score]));
};

const loadLeaderBoard = () => {
  const loaded = JSON.parse(localStorage.getItem('board'));
  const list = loaded
    ? loaded.sort((a, b) => {
        return a.total - b.total;
      })
    : [];
  return list.length !== 0 ? list : [];
};

const saveGame = () => {
  console.log('SAVE LIST', animateDrag.saveList);
  if (animateDrag.saveList.length !== null) {
    const sort = animateDrag.saveList.map((a) => {
      return a.parentId;
    });
    console.log('SAVING');
    localStorage.setItem('itemList', JSON.stringify(sort));
    localStorage.setItem('timer', JSON.stringify(timer.getTotal()));
    localStorage.setItem('moves', JSON.stringify(animateDrag.movesCount));
    localStorage.setItem('row', JSON.stringify(Math.sqrt(arrayLength)));
    localStorage.setItem('emptyCell', JSON.stringify(animateDrag.emptyCell.id));
    showSmallModal();
  }
};

function showModal(victory = false, count) {
  if (victory) {
    timer.stopCount();
    modal.classList.toggle('activeModal');
    modal.innerHTML = createPopup(timer.getEndTime(true), showCount);
    saveLeaderBoard({
      time: timer.getEndTime(true),
      count: showCount,
      total: timer.getTotal(),
    });
    setGame();
    timer.clearCount();
  } else {
    modal.classList.toggle('activeModal');
    modal.innerHTML = createLeaderBoard(loadLeaderBoard());
  }
}

function showSmallModal(message = 'Game Saved!') {
  savedModal.innerHTML = message;
  savedModal.classList.add('active');
  savedModal.addEventListener('transitionend', removeTransitionSaved);
}

function callVictory(flag) {
  if (flag) showModal(true);
}

function setBlinkTransition() {
  puzzleListElement.classList.add('blinkList');
  puzzleListElement.addEventListener('transitionend', removeTransitionBlink);
}
function removeTransitionBlink() {
  puzzleListElement.classList.remove('blinkList');
}
function removeTransitionSaved() {
  savedModal.classList.remove('active');
}

function getLoadedGameItems() {
  const itemList = JSON.parse(localStorage.getItem('itemList'));
  const emptyCell = JSON.parse(localStorage.getItem('emptyCell'));
  const movesLoaded = JSON.parse(localStorage.getItem('moves'));
  const total = JSON.parse(localStorage.getItem('timer'));
  const row = JSON.parse(localStorage.getItem('row'));
  return { itemList, emptyCell, movesLoaded, total, row };
}

const loadGame = () => {
  const { itemList, emptyCell, movesLoaded, total, row } = getLoadedGameItems();
  if (!itemList) {
    showSmallModal('NO SAVED GAME');
    return;
  }
  selectSize.value = row;
  arrayLength = row ** 2;
  timer.setTotal(total);
  showTimeCallback(timer.getEndTime());
  timer.stopCount();
  setGame(itemList, emptyCell, movesLoaded);
  // setBlinkTransition();
};

const changeMoveElement = (count) => {
  showCount = count;
  movesCountElement.innerHTML = `Moves ${count}`;
};

function clickHandler(e, item) {
  if (!timer.getIntervalState()) {
    timer.fireCount();
    console.log('FIIRED');
  }
  playAudio();
  animateDrag.startDragElementList(e, item);
  if (checkVictory(animateDrag.dragElementList)) {
    animateDrag.resetCount();
    showModal();
  }
}
let timeOut = null;
function windowListener() {
  clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    animateDrag.setResizePosition();
    console.log('RUNNING');
  }, 100);
  if (puzzleListElement.clientWidth < 1100) {
    console.log('LESS');
  } else console.log('more');
}

function findLast(list) {
  const element = list.find((a) => a.id === arrayLength - 1);
  return list.indexOf(element);
}

const setGame = (loadedGame = [], empty = null, movesLoaded = 0) => {
  window.removeEventListener('resize', windowListener);
  puzzleListElement.removeEventListener('transitionend', removeTransitionBlink);
  savedModal.removeEventListener('transitionend', removeTransitionSaved);
  const shuffledArray =
    loadedGame.length !== 0
      ? Array(arrayLength)
          .fill(0)
          .map((_, key) => key)
      : shuffleArray(arrayLength);
  puzzleListElement.setAttribute('style', setGridStyle(Math.sqrt(arrayLength)));

  const puzzleListArr = createPuzzleItemCell(arrayLength);
  puzzleListArr[0] = createPuzzleCell(
    [...createPuzzleItemList(shuffledArray)],
    0
  );

  puzzleListElement.innerHTML = [...puzzleListArr]
    .toString()
    .replaceAll(',', '');

  const puzzleListItem = document.querySelectorAll('.puzzle__item');
  const puzzleListCell = document.querySelectorAll('.puzzle__cell');

  const puzzleItemObjArr = [...puzzleListItem].map((item, key) => {
    const isLoaded = loadedGame.length !== 0;
    const parentId = isLoaded ? loadedGame[key] : key;
    return { item, parentId: parentId, id: Number(item.dataset.order) };
  });

  const puzzleCellObjArr = [...puzzleListCell].map((item, key) => {
    return { item, nestedId: puzzleItemObjArr[key].id, id: key };
  });

  const lastElementIndex =
    loadedGame.length !== 0 ? empty : findLast(puzzleItemObjArr);

  const prop = {
    puzzleRowLength: Math.sqrt(arrayLength),
    arrayLength: arrayLength,
    loadedGame: loadedGame,
    puzzleLength: arrayLength,
    callVictory: callVictory,
    movesCountElement: changeMoveElement,
    movesLoaded: movesLoaded ? movesLoaded : 0,
    emptyCell:
      empty !== null
        ? puzzleCellObjArr.at(empty)
        : puzzleCellObjArr.at(lastElementIndex),
  };

  animateDrag = new AnimateDrag(
    puzzleListElement,
    [...puzzleCellObjArr],
    puzzleItemObjArr,
    prop
  );
  puzzleCellObjArr.at(lastElementIndex).nestedId = null;
  puzzleItemObjArr[findLast(puzzleItemObjArr)].item.classList.add('hide');
  puzzleListItem.forEach((item, key) => {
    item.addEventListener('mousedown', (e) => {
      clickHandler(e, item);
    });
    item.addEventListener('touchstart', (e) => {
      clickHandler(e, item);
      console.log('TOUCH FIRED');
    });
  });

  window.addEventListener('resize', windowListener);
  setBlinkTransition();
};

setGame();
