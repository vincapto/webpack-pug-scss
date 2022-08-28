class AnimateDrag {
  isDraggable = false;
  grabAnimationClass = [['move-grab'], ['move-transition']];
  transitionListClass = 'move-list-item';
  elementInitialState = { x: 0, y: 0 };
  startPosition = { x: 0, y: 0, offsetTop: 0, initialId: 0 };
  dragElement = null;
  dragArea = null;
  dragDropZone = [];
  dragElementList = [];

  constructor(dragArea, dragDropZone, dragElementList) {
    this.dragArea = dragArea;
    this.dragDropZone = dragDropZone;
    this.dragElementList = dragElementList;
  }

  setTransitionClass(listClass, grabClass) {
    this.transitionListClass = listClass;
    this.grabAnimationClass = grabClass;
  }

  resetState() {
    this.dragElement = null;
    this.dragDropZone = [];
    this.dragArea = null;
    this.startPosition = { x: 0, y: 0 };
  }

  setInitInitialState() {
    this.elementInitialState = { x: this.dragElement.offsetLeft, y: dragElement.offsetTop };
  }
  setStartPosition(mouse) {
    const entry = this.getDifference({ x: mouse.clientX, y: mouse.clientY }, this.dragArea);
    entry.y += this.dragElement.offsetTop - this.dragElement.style.top.replace('px', '');
    this.startPosition = this.getDifference(entry, this.dragElement);
    this.startPosition.offsetTop = this.dragElement.offsetTop;
  }
  setElementPosition(element, { x, y }) {
    element.style.left = x + 'px';
    element.style.top = y + 'px';
  }

  toggleElementClass(item, reverse = false, [add, remove] = this.grabAnimationClass) {
    [add, remove] = !reverse ? [add, remove] : [remove, add];
    item.classList.add(...add);
    item.classList.remove(...remove);
  }
  getDifference(pos, item) {
    return { x: pos.x - item.offsetLeft, y: pos.y - item.offsetTop };
  }

  dropDragElement() {
    const dragDropZoneArr = [...this.dragDropZone].map((a, key) => ({ id: key, zone: a.getBoundingClientRect() }));
    const id = this.checkElementCrossing(dragDropZoneArr, this.dragElement.getBoundingClientRect());
    const collision = id !== null ? this.dragDropZone[id] : null;
    if (collision !== null)
      this.setElementPosition(this.dragElement, {
        x: collision.offsetLeft,
        y: collision.offsetTop - this.startPosition.offsetTop,
      });
    else this.setElementPosition(this.dragElement, this.elementInitialState);
  }

  checkElementCrossing(arr, element) {
    const filtered = arr.filter(({ zone: drop }) => {
      // return element.top > drop.top - element.height / 2 && element.bottom - element.height / 2 < drop.bottom;
      return (
        element.top > drop.top - element.height / 2 &&
        element.bottom - element.height / 2 < drop.bottom &&
        element.left > drop.left - element.width / 2 &&
        element.right - element.width / 2 < drop.right
      );
    });
    return filtered.length !== 0 ? filtered[0].id : null;
  }

  // moveDragElement(mouseEvent, cell = {}) {
  //   if (this.isDraggable) {
  //     const currentPoint = this.getDifference({ x: mouseEvent.clientX, y: mouseEvent.clientY }, this.dragArea);
  //     this.setElementPosition(this.dragElement, {
  //       x: currentPoint.x - this.startPosition.x,
  //       y: currentPoint.y - this.startPosition.y,
  //     });
  //   }
  // }
  moveDragElement(mouseEvent, cell = {}) {
    if (this.isDraggable) {
      const currentPoint = this.getDifference({ x: mouseEvent.clientX, y: mouseEvent.clientY }, this.dragArea);
      // const axis = this.getAxis(mouseEvent, currentPoint);
      // console.log(axis);
      const position = this.Axis.x
        ? { x: currentPoint.x - this.startPosition.x, y: this.startCell.y }
        : this.Axis.y
        ? { y: currentPoint.y - this.startPosition.y, x: this.startCell.x }
        : null;
      if (position !== null) this.setElementPosition(this.dragElement, position);
    }
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

  getDragElement() {
    return this.dragElementList.filter((a) => a.item === this.dragElement)[0].id;
  }

  getDistanceRectCoord(...param) {
    return { x: this.getDistanceRect(...param, 'left'), y: this.getDistanceRect(...param) };
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
    console.log('CALLED');
    const cell = this.getDistanceRectCoord(this.emptyCell.item, this.dragElement);
    const diff = this.getDifference({ x: e.clientX, y: e.clientY }, this.dragArea);
    console.log('EMPTY', this.emptyCell);
    return {
      x:
        e.clientY > this.emptyCell.item.getBoundingClientRect().top &&
        e.clientY < this.emptyCell.item.getBoundingClientRect().bottom,
      y:
        e.clientX > this.emptyCell.item.getBoundingClientRect().left &&
        e.clientX < this.emptyCell.item.getBoundingClientRect().right,
    };
  }

  watchCrossingList() {
    const dragId = this.getDragElement();
    const drag = this.dragElementList[dragId];
    const element = this.dragElement.getBoundingClientRect();
    const collision = this.dragDropZone.filter(({ item }) => {
      return this.checkIsCrossing(element, item.getBoundingClientRect()) && this.dragElement !== item;
    })[0];
    if (collision && this.isDraggable) {
      if (collision.nestedId !== null) return;
      // console.log(collision.item);
      // if (this.checkIsContainsTransition(collision)) return;
      const parentId = drag.parentId;
      collision.nestedId = drag.id;
      drag.parentId = collision.id;
      this.dragDropZone[parentId].nestedId = null;

      // if (!this.checkIsContainsTransition(collision)) {

      // console.log(elementRect - cellBOund);
      // console.log(coordPos);
      if (true) {
        // this.setElementPosition(drag.item, { x: xRect - xCell, y: yRect - yCell + style });
        // this.setSingleTransition(collision);
      }
    }
  }

  setDefaultPosition() {
    this.dragElementList.forEach((item, key) => {
      this.setElementPosition(item.item, this.getDistanceRectCoord(this.dragDropZone[key].item, item.item));
    });
  }

  deleteElement(deleteId) {
    this.dragElementList
      .filter((a) => a.id !== deleteId && a.id > deleteId)
      .forEach((element) => {
        element.parentId--;
        this.setElementPosition(element.item, {
          x: this.dragDropZone[element.parentId].offsetLeft,
          y: this.getDistanceRect(this.dragDropZone[element.parentId], element.item),
        });
        this.setSingleTransition(element);
      });
  }
  startCell = {};
  Axis = false;
  startParent;
  startDragElementList(mouseDown, target) {
    this.dragElement = target;
    const startId = this.dragElementList.filter((a) => a.item === this.dragElement)[0].id;
    const currentPoint = this.getDifference({ x: mouseDown.clientX, y: mouseDown.clientY }, this.dragArea);
    this.Axis = this.getAxis(mouseDown, currentPoint);
    console.log('AXIS', this.Axis);
    this.startParent = this.dragElementList[startId].parentId;
    // console.log('START PARENT', startParent);
    this.startCell = this.getDistanceRectCoord(this.dragDropZone[this.startParent].item, this.dragElement);
    mouseDown.preventDefault();
    this.isDraggable = true;
    this.setStartPosition(mouseDown);
    this.dragArea.addEventListener('mousemove', (mouseMove) => {
      this.moveDragElement(mouseMove);
      this.watchCrossingList();
      this.dragElement.addEventListener('mouseup', (mouseUp) => {
        if (this.isDraggable) {
          this.isDraggable = false;
          const id = this.dragElementList.filter((a) => a.item === this.dragElement)[0].id;
          const parent = this.dragElementList[id].parentId;
          const topShift = this.getDistanceRectCoord(this.dragDropZone[parent].item, this.dragElement);
          this.setElementPosition(this.dragElement, topShift);
          this.setSingleTransition(this.dragElementList[id]);

          this.emptyCell = this.dragDropZone[this.startParent];
          this.dragDropZone[this.startParent].nestedId = null;
          console.log('DRAGGED', this.dragElementList[id]);
          console.log('START PARENT DROP', this.startParent);
          console.log('EMPTY AFTER', this.emptyCell);
        }
      });
    });
  }

  startDrag(mouseDown, target) {
    mouseDown.preventDefault();
    this.dragElement = target;
    this.isDraggable = true;
    this.toggleElementClass(this.dragElement);
    this.setStartPosition(mouseDown);

    this.dragArea.addEventListener('mousemove', (mouseMove) => {
      this.moveDragElement(mouseMove);

      this.dragElement.addEventListener('mouseup', (mouseUp) => {
        mouseUp.preventDefault();
        this.toggleElementClass(this.dragElement, true);
        if (this.isDraggable) {
          this.dropDragElement();
          this.isDraggable = false;
        }
      });
    });
  }
}

export { AnimateDrag };
