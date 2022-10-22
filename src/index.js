import './styles/index.scss';
import { Solution } from './solve';
import { getBody } from './body';
const body = document.querySelector('body');
body.innerHTML = getBody();

import {
  startCount,
  getEndTime,
  stopCount,
  clearCount,
  getIntervalState,
  getTotal,
  Timer,
} from './timer';
import { AnimateDrag } from './animation.js';

let seconds = document.querySelector('.seconds');

function showTimeCallback(str) {
  // console.log('CALL STR', str);
  seconds.innerHTML = str;
}

const timer = new Timer(showTimeCallback);

const createPuzzleItem = (className = '', order = 0) => {
  return `
    <div class='puzzle__item${className}' data-order=${order}>
    <p>${order + 1}</p>
    </div>
  `;
};

const createPuzzleCell = (element = '', order = '') => {
  return `
    <div class='puzzle__cell data-order=${order}'>
    ${element}
    </div>
  `;
};
const createPopup = (time, moves) => {
  return `
    <div class='popup'>
    <p>«Hooray! You solved the puzzle in <b>${time}</b> and <b>${moves}</b> moves!»</p>
    <p>click anywhere to close</p>
    </div>
  `;
};

const createLeaderBoard = (list) => {
  const result =
    list.length !== 0
      ? list.map((a, key) => {
          return `
      <div class='leaderItem'>
      <span>${key + 1}. ${a.time} moves - ${a.count}</span>      
      </div>
      `;
        })
      : ['Board is empty'];
  return `
    <div class='popup'>
    <h3>Leader board</h3>
    <ul class="scoreBoard">
      ${result.join('')}
    </ul>
      <p>click anywhere to close</p>
      </div>
    `;
};

const createPuzzleItemCell = (length = 16) => {
  return Array(length)
    .fill(0)
    .map((a, index) => {
      return createPuzzleCell('', index);
    });
};

const createPuzzleItemList = (array) => {
  return array.map((a) => {
    return createPuzzleItem('', a);
  });
};

const selectSize = document.querySelector('.controlSelect');
const shuffleButton = document.querySelector('.controlShuffle');
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

let animateDrag = null;
let solutionShuffle = [];

let saveListItems = [];
moveSound.playbackRate = 1.4;

saveButton.addEventListener('click', () => {
  saveGame('');
});

loadButton.addEventListener('click', () => {
  loadGame('');
});

function playAudio() {
  soundCheck.checked ? moveSound.play() : 0;
}

let arrayLength = 9;

selectSize.addEventListener('change', (event) => {
  arrayLength = event.target.value ** 2;
  setGame();
  console.log(arrayLength);
});

shuffleButton.addEventListener('click', (event) => {
  console.log('SHUFFLE');
  setGame();
  timer.clearCount();
  // startCount();
});
resetButton.addEventListener('click', (event) => {
  console.log('RESET');
  // setGame();
  // startCount();
  timer.startCount();
});

modal.addEventListener('click', () => {
  modal.classList.remove('activeModal');
  callVictory();
});

infoButton.addEventListener('click', (event) => {
  console.log('RUN SOLUTION');
  // modal.classList.toggle('activeModal');
  showModal(false);
  // const solution = new Solution(
  //   Array(arrayLength)
  //     .fill(0)
  //     .map((_, key) => key),
  //   solutionShuffle,
  //   Math.sqrt(arrayLength),
  //   arrayLength
  // );
  // solution.startSearch();
});

function fisherShuffle(arr) {
  let i = arr.length;
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
  const flag = false;
  let shuffled = [];
  while (true) {
    shuffled = fisherShuffle(array);
    // console.log('SHUFFLED', shuffled);
    // console.log('SOLVABLE', !isSolvableLess(shuffled));
    // console.log(
    //   'SOLVABLE INITIAL',
    //   !isSolvableLess([0, 1, 2, 3, 4, 5, 6, 7, 8])
    // );
    console.log('SOLVABLE WRONG', !isSolvableLess([0, 8, 1, 2, 3, 4, 5, 7, 6]));
    if (!isSolvableLess(shuffled)) {
      solutionShuffle = shuffled;
      // const solve = new Solution([0, 1, 2, 3, 4, 5, 6, 7, 8], shuffled, 3, 9);
      // console.log(solve.startSearch());
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

var tileCount = arrayLength;

function countInversions(i, j) {
  var inversions = 0;
  var tileNum = j * tileCount + i;
  var lastTile = tileCount * tileCount;
  var tileValue = boardParts[i][j].y * tileCount + boardParts[i][j].x;
  for (var q = tileNum + 1; q < lastTile; ++q) {
    var k = q % tileCount;
    var l = Math.floor(q / tileCount);

    var compValue = boardParts[k][l].y * tileCount + boardParts[k][l].x;
    if (tileValue > compValue && tileValue != lastTile - 1) {
      ++inversions;
    }
  }
  return inversions;
}

function sumInversions() {
  var inversions = 0;
  for (var j = 0; j < tileCount; ++j) {
    for (var i = 0; i < tileCount; ++i) {
      inversions += countInversions(i, j);
    }
  }
  return inversions;
}

function isSolvableExample(width, height, emptyRow) {
  if (width % 2 == 1) {
    return sumInversions() % 2 == 0;
  } else {
    return (sumInversions() + height - emptyRow) % 2 == 0;
  }
}

const isSolvableLess = (arr) => {
  //для каждого элемента массива
  let kDisorder = 0;
  let len = arr.length - 1;
  // console.log('COUNTRING', arr);
  for (let i = 0; i <= len; i++) {
    //узнаём сколько предшествующих элементов больше текущего
    for (let j = i + 1; j <= len; j++) {
      //если один из предыдущих элементов больше - накручиваем счетчик
      if (arr[j] == len || arr[i] == len) continue;
      // console.log(j, i, arr[j], arr[i]);
      // console.log(`i=${i} el=${arr[i]} | j=${j} el=${arr[j]}`);
      if (arr[j] < arr[i]) {
        // console.log('PASS', arr[i], arr[j]);
        kDisorder++;
      }
    }
  }

  const blank = Math.floor(arr.indexOf(len) / Math.sqrt(arrayLength));
  // console.log(`%cCOUNT ${arr} ${kDisorder}`, 'font-size:30px');
  // console.log('BLANK --------', blank);
  //если сумма вышла четной - комбинация имеет решение
  return arr.length % 2 !== 0
    ? kDisorder % 2 !== 0
    : (kDisorder + blank) % 2 === 0;
};

const isSolvable = (arr) => {
  //для каждого элемента массива
  let kDisorder = 0;
  let len = arr.length - 1;
  for (let i = 0; i < len; i++) {
    //узнаём сколько предшествующих элементов больше текущего
    for (let j = i + 1; j >= 0; j--) {
      //если один из предыдущих элементов больше - накручиваем счетчик
      if (arr[j] > arr[i]) {
        if (arr[j] !== len && arr[i] !== len) {
          console.log(arr[i], arr[j]);
          kDisorder++;
        }
      }
    }
  }

  //если сумма вышла четной - комбинация имеет решение
  return kDisorder % 2 === 0;
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

const saveGame = (itemList) => {
  if (animateDrag.saveList.length !== null) {
    const sort = animateDrag.saveList.map((a) => {
      return a.parentId;
    });
    console.log('EMPTY', animateDrag.emptyCell, animateDrag.movesCount);
    localStorage.setItem('itemList', JSON.stringify(sort));
    localStorage.setItem('timer', JSON.stringify(timer.getTotal()));
    localStorage.setItem('moves', JSON.stringify(animateDrag.movesCount));
    localStorage.setItem('row', JSON.stringify(Math.sqrt(arrayLength)));
    localStorage.setItem('emptyCell', JSON.stringify(animateDrag.emptyCell.id));
    // savedModal.classList.remove('hide');
    showSmallModal();
  }
};

function showSmallModal(message = 'Game Saved!') {
  savedModal.innerHTML = message;
  savedModal.classList.add('active');
  savedModal.addEventListener('transitionend', () => {
    savedModal.classList.remove('active');
  });
}

const loadGame = () => {
  const loaded = JSON.parse(localStorage.getItem('itemList'));
  if (!loaded) {
    showSmallModal('NO SAVED GAME');
    return;
  }
  const emptyCell = JSON.parse(localStorage.getItem('emptyCell'));
  const movesLoaded = JSON.parse(localStorage.getItem('moves'));
  const total = JSON.parse(localStorage.getItem('timer'));
  const row = JSON.parse(localStorage.getItem('row'));
  selectSize.value = row;
  arrayLength = row ** 2;
  puzzleListElement.classList.add('blinkList');

  puzzleListElement.addEventListener('transitionend', () => {
    puzzleListElement.classList.remove('blinkList');
  });
  timer.setTotal(total);
  showTimeCallback(timer.getEndTime());
  timer.stopCount();
  console.log(emptyCell);
  setGame(loaded, emptyCell, movesLoaded);
};

let showCount = 0;

const changeMoveElement = (count) => {
  showCount = count;
  movesCountElement.innerHTML = `Moves ${count}`;
};

const setGame = (loadedGame = [], empty = null, movesLoaded = null) => {
  const shuffledArray =
    loadedGame.length !== 0
      ? Array(arrayLength)
          .fill(0)
          .map((_, key) => key)
      : shuffleArray(arrayLength);

  console.table(shuffledArray);
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

  const findLast = (list) => {
    const element = list.find((a) => a.id === arrayLength - 1);
    return list.indexOf(element);
  };

  console.log('GAME SET');
  const puzzleItemObjArr = [...puzzleListItem].map((item, key) => {
    const isLoaded = loadedGame.length !== 0;
    const parentId = isLoaded ? loadedGame[key] : key;
    return { item, parentId: parentId, id: Number(item.dataset.order) };
  });

  const puzzleCellObjArr = [...puzzleListCell].map((item, key) => {
    const nested = puzzleItemObjArr[key] ? puzzleItemObjArr[key].id : null;
    return { item, nestedId: puzzleItemObjArr[key].id, id: key };
  });

  const lastElementIndex =
    loadedGame.length !== 0 ? empty : findLast(puzzleItemObjArr);

  animateDrag = new AnimateDrag(
    puzzleListElement,
    [...puzzleCellObjArr],
    puzzleItemObjArr
  );

  animateDrag.movesCountElement = changeMoveElement;
  movesLoaded ? animateDrag.resetCount(movesLoaded) : animateDrag.resetCount();
  puzzleCellObjArr.at(lastElementIndex).nestedId = null;
  puzzleItemObjArr[findLast(puzzleItemObjArr)].item.classList.add('hide');

  animateDrag.emptyCell = empty
    ? puzzleCellObjArr.at(empty)
    : puzzleCellObjArr.at(lastElementIndex);

  console.log('SET EMPTY', animateDrag.emptyCell);
  animateDrag.setDefaultPosition(loadedGame);
  animateDrag.puzzleRowLength = Math.sqrt(arrayLength);
  animateDrag.puzzleLength = arrayLength;
  animateDrag.callVictory = callVictory;
  animateDrag.saveGameList();
  puzzleListItem.forEach((item, key) => {
    item.addEventListener('mousedown', (e) => {
      clickHandler(e, item);
    });
    item.addEventListener('touchstart', (e) => {
      clickHandler(e, item);
      console.log('TOUCH FIRED');
    });
  });

  function clickHandler(e, item) {
    if (!timer.getIntervalState()) {
      timer.fireCount();
      console.log('FIIRED');
    }
    playAudio();
    animateDrag.startDragElementList(e, item);
    // movesCountElement.innerHTML = animateDrag.movesCount;
    if (checkVictory(puzzleItemObjArr)) {
      animateDrag.resetCount();
      showModal();
    }
  }

  // infoButton.addEventListener('click', () => {
  //   console.log('BACK');
  //   animateDrag.moveSolution();
  // });

  window.addEventListener('resize', function (event) {
    if (puzzleListElement.clientWidth < 1100) {
      animateDrag.setResizePosition();
      console.log('LESS');
    } else console.log('more');
  });
};
// console.log(browser);
function victoryPopup() {
  return createPopup(timer.getEndTime(), showCount);
}

function showModal(victory = false) {
  if (victory) {
    timer.stopCount();
    modal.classList.toggle('activeModal');
    modal.innerHTML = createPopup(timer.getEndTime(), showCount);
    saveLeaderBoard({
      time: timer.getEndTime(),
      count: showCount,
      total: timer.getTotal(),
    });
  } else {
    modal.classList.toggle('activeModal');
    modal.innerHTML = createLeaderBoard(loadLeaderBoard());
  }
}

function callVictory(flag) {
  if (flag) showModal(true);
}

setGame();
