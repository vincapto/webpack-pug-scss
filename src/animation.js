class AnimateDrag {
  isDraggable = false;
  puzzleRowLength = 4;
  puzzleLength = 16;
  movesCount = 0;
  movesCountElement;
  grabAnimationClass = [['move-grab'], ['move-transition']];
  transitionListClass = 'move-list-item';
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
  callVictory;
  transitionGoing = false;
  isMoved = false;

  constructor(dragArea, dragDropZone, dragElementList, prop) {
    this.dragArea = dragArea;
    this.dragDropZone = dragDropZone;
    this.dragElementList = dragElementList;

    this.updateProps(prop);
  }

  updateProps(prop) {
    console.log(prop.emptyCell, prop.loadedGame);
    this.movesCountElement = prop.movesCountElement;
    this.resetCount(prop.movesLoaded);
    this.emptyCell = prop.emptyCell;
    this.setDefaultPosition(prop.loadedGame);
    this.puzzleRowLength = prop.puzzleRowLength;
    this.puzzleLength = prop.arrayLength;
    this.callVictory = prop.callVictory;
    this.checkSequence();
  }

  resetCount(init = 0) {
    this.movesCountElement(init);
    this.movesCount = init;
    console.log('CALL RESET', this.movesCount);
  }

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

  setTransitionClass(listClass, grabClass) {
    this.transitionListClass = listClass;
    this.grabAnimationClass = grabClass;
  }

  checkSequence() {
    const sortedList = this.dragElementList.sort((a, b) => {
      return a.id - b.id;
    });
    this.saveList = sortedList;
    console.table(sortedList);
  }

  isSolved() {
    const order = this.dragElementList.filter((a) => {
      if (a.id !== this.dragElementList.length - 1) {
        return a.parentId === a.id;
      } else return false;
    });
    return order.length === this.dragElementList.length - 1;
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

  getDifference(pos, item) {
    return { x: pos.x - item.offsetLeft, y: pos.y - item.offsetTop };
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
      this.transitionGoing = false;
    });
  }

  findDragElement(id = null) {
    return id !== null
      ? this.dragElementList.find((a) => a.id === id)
      : this.dragElementList.find((a) => a.item === this.dragElement);
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

  moveDragElement(Event, cell = {}) {
    const mouseEvent = Event?.touches ? Event?.touches[0] : Event;
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
        top: mouseEvent.clientY - this.shiftMouseParent.top,
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
      this.swapCell(drag, collision);
      // const parentId = drag.parentId;
      // collision.nestedId = drag.id;
      // drag.parentId = collision.id;
      // this.getParentCell(parentId).nestedId = null;
    }
  }

  swapCell(drag, collision) {
    const parentId = drag.parentId;
    collision.nestedId = drag.id;
    drag.parentId = collision.id;
    this.getParentCell(parentId).nestedId = null;
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
    console.log(`%c UP LISTENER`, 'font-size:25px; color:red;');
    if (this.isDraggable) {
      this.dropDragElement();
    } else this.removeMouseUpListener();
  };

  removeMouseUpListener = () => {
    this.dragElement.removeEventListener('mouseup', this.dropListener);
    this.dragElement.removeEventListener('mouseleave', this.dropListener);
    this.dragArea.removeEventListener('mousemove', this.moveHandler);
    this.dragArea.removeEventListener('touchmove', this.moveHandler);
    this.dragArea.removeEventListener('touchcancel', this.dropListener);
    this.dragArea.removeEventListener('touchend', this.dropListener);
  };

  moveHandler = (mouseMove) => {
    console.log(`%c MOVE LISTENER`, 'font-size:25px; color:red;');
    this.isMoved = true;
    if (!this.getAvailableCells(this.emptyCell.id).includes(this.startParent)) {
      return;
    }
    this.watchCrossingList(mouseMove);
  };

  startDragElementList(Event, target) {
    console.log('START');
    if (this.transitionGoing) return;
    this.dragElement = target;
    Event.preventDefault();
    const mouseDown = Event?.touches ? Event?.touches[0] : Event;
    if (!this.possibleMoves()) {
      console.log('Cancel move');
      return;
    }
    this.setStartPosition(mouseDown);

    this.dragArea.addEventListener('touchmove', this.moveHandler);
    this.dragElement.addEventListener('touchcancel', this.dropListener, {
      once: true,
    });
    this.dragElement.addEventListener('touchend', this.dropListener, {
      once: true,
    });

    this.dragArea.addEventListener('mousemove', this.moveHandler);
    this.dragElement.addEventListener('mouseleave', this.dropListener, {
      once: true,
    });
    this.dragElement.addEventListener('mouseup', this.dropListener, {
      once: true,
    });
  }

  getAvailableMoves = (position) => {
    const length = this.dragElementList.length;
    const row = Math.sqrt(length);
    const direction = [row, -row];
    (position + 1) % this.row !== 0 ? direction.push(1) : 0;
    position % this.row !== 0 ? direction.push(-1) : 0;
    return direction
      .map((a) => {
        console.log(a + position);
        return a + position;
      })
      .filter((b) => b >= 0 && b < length);
  };

  possibleMoves() {
    const moves = this.getAvailableMoves(this.emptyCell.id);
    return moves.includes(this.findDragElement().parentId);
  }

  dropDragElement() {
    this.isDraggable = false;
    this.transitionGoing = true;
    const element = this.findDragElement();
    if (!this.isMoved) this.swapCell(element, this.emptyCell);
    const topShift = this.getDistanceRectCoord(
      this.getParentCell(element.parentId).item,
      this.dragElement
    );
    this.isMoved = false;
    this.setElementPosition(this.dragElement, topShift);
    this.setSingleTransition(this.findDragElement());
    this.checkSequence();
    if (element.parentId !== this.startParent) {
      this.emptyCell = this.getParentCell();
      this.getParentCell().nestedId = null;
      this.movesCount++;
      this.movesCountElement(this.movesCount);
      this.callVictory(this.isSolved());
      this.removeMouseUpListener();
    } else this.removeMouseUpListener();
  }
}

export { AnimateDrag };
