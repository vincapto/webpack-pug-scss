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

const createPuzzleItemList = (length = 15) => {
  return Array(length)
    .fill(0)
    .map((a, index) => {
      return createPuzzleItem('', index);
    });
};

const puzzleListArr = createPuzzleItemCell(16);
puzzleListArr[0] = createPuzzleCell([...createPuzzleItemList(15)], 0);
const puzzleListElement = document.querySelector('.puzzle__list');
puzzleListElement.innerHTML = [...puzzleListArr].toString().replaceAll(',', '');

const puzzleListItem = document.querySelectorAll('.puzzle__item');
const puzzleListCell = document.querySelectorAll('.puzzle__cell');

const puzzleItemObjArr = [...puzzleListItem].map((item, key) => {
  return { item, parentId: key, id: key };
});
const puzzleCellObjArr = [...puzzleListCell].map((item, key) => {
  return { item, nestedId: key, id: key };
});

console.log(puzzleCellObjArr);

const animateDrag = new AnimateDrag(puzzleListElement, [...puzzleCellObjArr], puzzleItemObjArr);
puzzleCellObjArr.at(-1).nestedId = null;
animateDrag.emptyCell = puzzleCellObjArr.at(-1);

animateDrag.setDefaultPosition();
puzzleListItem.forEach((item, key) => {
  // item.style.zIndex = key;
  // console.log('INITIAL ID START', animateDrag.startPosition.initialId);
  item.addEventListener('mousedown', (e) => {
    console.log(item);
    animateDrag.startDragElementList(e, item);
  });
});
