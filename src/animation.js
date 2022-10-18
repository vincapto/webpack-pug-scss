class AnimateDrag {
  isDraggable = false;
  puzzleRowLength = 4;
  puzzleLength = 16;
  movesCount = 0;
  movesCountElement;
  grabAnimationClass = [['move-grab'], ['move-transition']];
  transitionListClass = 'move-list-item';
  elementInitialState = { x: 0, y: 0 };
  startPosition = { x: 0, y: 0, offsetTop: 0, initialId: 0 };
  dragElement = null;
  dragArea = null;
  dragDropZone = [];
  dragElementList = [];
  startCell = {};
  Axis = false;
  startParent;
  shiftMouseParent = 0;
  cellFrame = {};
  saveList = [];

  getDivideRest(num) {
    const div = this.puzzleRowLength;
    switch ((num + 1) % div) {
      case 0:
        return [num - 1];
      case 1:
        return [num + 1];
      default:
        return [num - 1, num + 1];
    }
  }

  getAvailableCells(key) {
    const arr = [];
    if (key + this.puzzleRowLength <= this.puzzleLength)
      arr.push(key + this.puzzleRowLength);
    if (key - this.puzzleRowLength >= 0) arr.push(key - this.puzzleRowLength);
    arr.push(...this.getDivideRest(key));
    return arr;
  }

  constructor(dragArea, dragDropZone, dragElementList) {
    this.dragArea = dragArea;
    this.dragDropZone = dragDropZone;
    this.dragElementList = dragElementList;
  }

  setTransitionClass(listClass, grabClass) {
    this.transitionListClass = listClass;
    this.grabAnimationClass = grabClass;
  }

  checkSequence() {
    const sortedList = this.dragElementList.sort((a, b) => {
      return a.id - b.id;
    });
    console.table(sortedList);
    this.saveList = sortedList;
    sortedList.some((a, key) => {
      return a.id === this.dragDropZone[key];
    });
  }

  setInitInitialState() {
    this.elementInitialState = {
      x: this.dragElement.offsetLeft,
      y: dragElement.offsetTop,
    };
  }

  setStartPosition(mouseDown) {
    const entry = this.getDifference(
      { x: mouseDown.clientX, y: mouseDown.clientY },
      this.dragArea
    );
    entry.y +=
      this.dragElement.offsetTop - this.dragElement.style.top.replace('px', '');
    this.startPosition = this.getDifference(entry, this.dragElement);
    this.startPosition.offsetTop = this.dragElement.offsetTop;
    this.Axis = this.getAxis(
      mouseDown,
      this.getDifference(
        { x: mouseDown.clientX, y: mouseDown.clientY },
        this.dragArea
      )
    );
    this.startParent = this.findDragElement().parentId;
    this.setDraggableBorders(mouseDown);
    this.startCell = this.getDistanceRectCoord(
      this.getParentCell().item,
      this.dragElement
    );
    this.cellFrame = this.getAvailableCoord(this.getParentCell());
    this.isDraggable = true;
  }

  getParentCell(index = this.startParent) {
    return this.dragDropZone[index];
  }

  setElementPosition(element, { x, y }) {
    element.style.left = x + 'px';
    element.style.top = y + 'px';
  }

  toggleElementClass(
    item,
    reverse = false,
    [add, remove] = this.grabAnimationClass
  ) {
    [add, remove] = !reverse ? [add, remove] : [remove, add];
    item.classList.add(...add);
    item.classList.remove(...remove);
  }
  getDifference(pos, item) {
    return { x: pos.x - item.offsetLeft, y: pos.y - item.offsetTop };
  }

  checkElementCrossing(arr, element) {
    const filtered = arr.filter(({ zone: drop }) => {
      return this.checkIsCrossing(element, zone);
    });
    return filtered.length !== 0 ? filtered[0].id : null;
  }

  checkIsCrossing(element, drop) {
    return (
      element.top > drop.top - element.height / 2 &&
      element.bottom - element.height / 2 < drop.bottom &&
      element.left > drop.left - element.width / 2 &&
      element.right - element.width / 2 < drop.right
    );
  }

  setSingleTransition(element, className = this.transitionListClass) {
    element.item.classList.add(className);
    element.item.addEventListener('transitionend', () => {
      element.item.classList.remove(className);
    });
  }

  checkIsContainsTransition(element, className = this.transitionListClass) {
    return element.item.classList.contains(className);
  }

  findDragElement() {
    return this.dragElementList.find((a) => a.item === this.dragElement);
  }

  getDistanceRectCoord(...param) {
    return {
      x: this.getDistanceRect(...param, 'left'),
      y: this.getDistanceRect(...param),
    };
  }

  getDistanceRect(cell, element, prop = 'top') {
    return (
      cell.getBoundingClientRect()[prop] -
      element.getBoundingClientRect()[prop] +
      Number(element.style[prop].replace('px', ''))
    );
  }

  setEmptyCell() {}

  getAxis(e) {
    return {
      x:
        e.clientY > this.emptyCell.item.getBoundingClientRect().top &&
        e.clientY < this.emptyCell.item.getBoundingClientRect().bottom,
      y:
        e.clientX > this.emptyCell.item.getBoundingClientRect().left &&
        e.clientX < this.emptyCell.item.getBoundingClientRect().right,
    };
  }

  getAvailableCoord(currentCell) {
    const cell = currentCell.item.getBoundingClientRect();
    const emptyCell = this.emptyCell.item.getBoundingClientRect();
    return {
      left: cell.left <= emptyCell.left ? cell.left : emptyCell.left,
      right: cell.right >= emptyCell.right ? cell.right : emptyCell.right,
      top: cell.top <= emptyCell.top ? cell.top : emptyCell.top,
      bottom: cell.bottom >= emptyCell.bottom ? cell.bottom : emptyCell.bottom,
    };
  }

  checkAvailablePoints(coord, frame, axis) {
    return axis
      ? coord.top > frame.top && coord.bottom < frame.bottom
      : coord.left > frame.left && coord.right < frame.right;
  }

  moveDragElement(mouseEvent, cell = {}) {
    if (this.isDraggable) {
      const currentPoint = this.getDifference(
        { x: mouseEvent.clientX, y: mouseEvent.clientY },
        this.dragArea
      );
      const position = this.Axis.x
        ? { x: currentPoint.x - this.startPosition.x, y: this.startCell.y }
        : this.Axis.y
        ? { x: this.startCell.x, y: currentPoint.y - this.startPosition.y }
        : null;
      const positionSubShift = {
        left: mouseEvent.clientX - this.shiftMouseParent.left,
        right: mouseEvent.clientX + this.shiftMouseParent.right,
        top: mouseEvent.y - this.shiftMouseParent.top,
        bottom: mouseEvent.clientY + this.shiftMouseParent.bottom,
      };

      if (
        position !== null &&
        this.checkAvailablePoints(positionSubShift, this.cellFrame, this.Axis.y)
      )
        this.setElementPosition(this.dragElement, position);
    }
  }

  watchCrossingList(mouseEvent) {
    const drag = this.findDragElement();
    this.moveDragElement(mouseEvent);
    const collision = this.dragDropZone.filter(({ item }) => {
      return (
        this.checkIsCrossing(
          this.dragElement.getBoundingClientRect(),
          item.getBoundingClientRect()
        ) && this.dragElement !== item
      );
    })[0];
    if (collision && this.isDraggable) {
      if (collision.nestedId !== null) return;
      const parentId = drag.parentId;
      collision.nestedId = drag.id;
      drag.parentId = collision.id;
      this.getParentCell(parentId).nestedId = null;
    }
  }

  setDefaultPosition(loadList = []) {
    const isLoaded = loadList.length !== 0;
    this.dragElementList.forEach((item, key) => {
      const parentId = isLoaded ? loadList[key] : key;
      this.setElementPosition(
        item.item,
        this.getDistanceRectCoord(this.getParentCell(parentId).item, item.item)
      );
    });
  }

  setResizePosition() {
    this.dragElementList.forEach((item, key) => {
      this.setElementPosition(
        item.item,
        this.getDistanceRectCoord(
          this.getParentCell(item.parentId).item,
          item.item
        )
      );
    });
  }

  setDraggableBorders(mouseDown) {
    const boundaries = this.getParentCell().item.getBoundingClientRect();
    this.shiftMouseParent = {
      left: mouseDown.clientX - boundaries.left - 10,
      right: boundaries.right - mouseDown.clientX - 10,
      bottom: boundaries.bottom - mouseDown.clientY - 10,
      top: mouseDown.clientY - boundaries.top - 10,
    };
  }

  dropListener = (e) => {
    e.preventDefault();
    if (this.isDraggable) {
      this.dropDragElement();
    }
  };

  removeMouseUpListener = (e) => {
    e.preventDefault();
    this.triggerMouseEvent(this.dragElement, 'mouseup');
    this.dragElement.removeEventListener('mouseup', this.dropListener);
  };

  startDragElementList(mouseDown, target) {
    this.dragElement = target;
    mouseDown.preventDefault();
    this.setStartPosition(mouseDown);
    this.dragArea.addEventListener('mousemove', (mouseMove) => {
      if (
        !this.getAvailableCells(this.emptyCell.id).includes(this.startParent)
      ) {
        // console.log('_____-------NOU');
        return;
      }
      // console.log('AVALIBALE');
      this.watchCrossingList(mouseMove);
    });
    this.dragElement.addEventListener('mouseleave', this.dropListener, {
      once: true,
    });
    this.dragElement.addEventListener('mouseup', this.dropListener, {
      once: true,
    });
  }

  triggerMouseEvent(node, eventType) {
    console.log('MOVING');
    let clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent(eventType, true, true);
    node.dispatchEvent(clickEvent);
    // this.dragElement.removeEventListener('mouseup', this.mouseUpListener, true);
  }

  dropDragElement() {
    this.isDraggable = false;
    const element = this.findDragElement();
    const topShift = this.getDistanceRectCoord(
      this.getParentCell(element.parentId).item,
      this.dragElement
    );
    this.setElementPosition(this.dragElement, topShift);
    this.setSingleTransition(this.findDragElement());
    // console.log(this.emptyCell.id);
    // console.table(this.dragElementList);
    this.checkSequence();
    if (element.parentId !== this.startParent) {
      this.emptyCell = this.getParentCell();
      this.getParentCell().nestedId = null;
      this.movesCount++;
      this.movesCountElement(this.movesCount);
    }
  }
}

export { AnimateDrag };
