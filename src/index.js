import './styles/index.scss';
import { AnimateDrag } from './animation.js';

const createPuzzleItem = (className = '', order = 0) => {
  return `
    <div class='puzzle__item${className}' data-order=${order}>
    ${order}
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

const arrayLength = 9;
function shuffleArray(arrayLength) {
  const array = Array(arrayLength)
    .fill(0)
    .map((_, key) => key);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const shuffledArray = shuffleArray(arrayLength - 1);

const puzzleListArr = createPuzzleItemCell(arrayLength);
puzzleListArr[0] = createPuzzleCell(
  [...createPuzzleItemList(shuffledArray)],
  0
);
const puzzleListElement = document.querySelector('.puzzle__list');
puzzleListElement.innerHTML = [...puzzleListArr].toString().replaceAll(',', '');

const puzzleListItem = document.querySelectorAll('.puzzle__item');
const puzzleListCell = document.querySelectorAll('.puzzle__cell');

const puzzleItemObjArr = [...puzzleListItem].map((item, key) => {
  return { item, parentId: key, id: Number(item.dataset.order) };
});

const puzzleCellObjArr = [...puzzleListCell].map((item, key) => {
  const nested = puzzleItemObjArr[key] ? puzzleItemObjArr[key].id : null;
  return { item, nestedId: nested, id: key };
});

// console.table(puzzleItemObjArr);
// console.table(puzzleCellObjArr);

const animateDrag = new AnimateDrag(
  puzzleListElement,
  [...puzzleCellObjArr],
  puzzleItemObjArr
);
puzzleCellObjArr.at(-1).nestedId = null;
animateDrag.emptyCell = puzzleCellObjArr.at(-1);

animateDrag.setDefaultPosition();
animateDrag.puzzleRowLength = 3;
animateDrag.puzzleLength = 9;
puzzleListItem.forEach((item, key) => {
  // item.style.zIndex = key;
  // console.log('INITIAL ID START', animateDrag.startPosition.initialId);
  console.log(item);
  item.addEventListener('mousedown', (e) => {
    console.log('CLIVK');
    animateDrag.startDragElementList(e, item);
  });
  item.addEventListener('resize', (e) => {
    animateDrag.startDragElementList(e, item);
    // console.log(item);
  });
});

window.addEventListener('resize', function (event) {
  // do stuff here
});

const obj = {
  first: 1,
  second: 2,
  // third,
};

if (obj) {
  console.log('OBJ', obj);
  if (!!obj.first) console.log('PROP', obj.first);
  if (obj?.third) console.log('PROP', obj?.third);
  // if (obj?.first) console.log('PROP', obj.second);
}
