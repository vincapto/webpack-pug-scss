import './styles/index.scss';
import { startCount, clearCount } from './timer';
import { AnimateDrag } from './animation.js';

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
const resetButton = document.querySelector('.controlReset');
const saveButton = document.querySelector('.controlSave');
const loadButton = document.querySelector('.controlLoad');
// const infoButton = document.querySelector('.controlInfo');
const movesCountElement = document.querySelector('.movesCount');
const soundCheck = document.querySelector('#soundCheck');
const moveSound = document.getElementById('myAudio');

let animateDrag = null;

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

let arrayLength = 16;

selectSize.addEventListener('change', (event) => {
  arrayLength = event.target.value ** 2;
  setGame();
  console.log(arrayLength);
});

resetButton.addEventListener('click', (event) => {
  console.log('RESET');
  setGame();
  startCount();
});

function fisherShuffle(arr) {
  let i = arr.length;
  while (--i > 0) {
    let randIndex = Math.floor(Math.random() * (i + 1));
    [arr[randIndex], arr[i]] = [arr[i], arr[randIndex]];
    console.log(i + 1, randIndex + 1);
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
    if (isSolvable(shuffled)) return shuffled;
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
  //для каждого элемента массива
  for (var kDisorder = 0, i = 1, len = arr.length - 1; i < len; i++) {
    //узнаём сколько предшествующих элементов больше текущего
    for (var j = i - 1; j >= 0; j--) {
      //если один из предыдущих элементов больше - накручиваем счетчик
      if (arr[j] > arr[i]) {
        kDisorder++;
      }
    }
  }

  //если сумма вышла четной - комбинация имеет решение
  return !(kDisorder % 2);
};

const puzzleListElement = document.querySelector('.puzzle__list');

const setGridStyle = (count = 3) => {
  return `grid-template-columns: repeat(${count}, 1fr);
    grid-template-rows: repeat(${count}, 1fr);font-size:${90 / count}px;`;
};

const saveGame = (itemList) => {
  if (animateDrag.saveList.length !== null) {
    const sort = animateDrag.saveList.map((a) => {
      return a.parentId;
    });
    console.log('EMPTY', animateDrag.emptyCell);
    localStorage.setItem('itemList', JSON.stringify(sort));
    localStorage.setItem('timer', JSON.stringify(getTimerValue));
    localStorage.setItem('moves', JSON.stringify(animateDrag.movesCount));
    localStorage.setItem('emptyCell', JSON.stringify(animateDrag.emptyCell.id));
  }
};

const loadGame = () => {
  const loaded = JSON.parse(localStorage.getItem('itemList'));
  const emptyCell = JSON.parse(localStorage.getItem('emptyCell'));
  console.log(emptyCell);
  setGame(loaded, emptyCell);
};

const changeMoveElement = (count) => {
  movesCountElement.innerHTML = `Moves ${count}`;
};

const setGame = (loadedGame = [], empty = null) => {
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

  puzzleCellObjArr.at(lastElementIndex).nestedId = null;
  puzzleItemObjArr[findLast(puzzleItemObjArr)].item.classList.add('hide');

  animateDrag.emptyCell = empty
    ? puzzleCellObjArr.at(empty)
    : puzzleCellObjArr.at(lastElementIndex);

  console.log('SET EMPTY', animateDrag.emptyCell);
  animateDrag.setDefaultPosition(loadedGame);
  animateDrag.puzzleRowLength = Math.sqrt(arrayLength);
  animateDrag.puzzleLength = arrayLength;
  puzzleListItem.forEach((item, key) => {
    item.addEventListener('mousedown', (e) => {
      playAudio();
      animateDrag.startDragElementList(e, item);
      // movesCountElement.innerHTML = animateDrag.movesCount;
      if (checkVictory(puzzleItemObjArr)) {
        alert('VICTORY');
      }
    });
  });

  // infoButton.addEventListener('click', () => {
  //   console.log('BACK');
  //   animateDrag.moveSolution();
  // });

  window.addEventListener('resize', function (event) {
    if (puzzleListElement.clientWidth < 1100) {
      console.log('LESS');
      animateDrag.setResizePosition();
    } else console.log('more');
  });
};

setGame();
