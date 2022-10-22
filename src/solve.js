// f(n)=g(x) + h(x)
//h - number of missplaced
//g(x) - distance from root
// 0, 1, 2,
// 3, 4, 5,
// 6, 7, null;

// 0, 2, 4,
// 3, 7, null,
// 6, 5, 1;

export class Solution {
  constructor(goal, shuffledInitial, row, length) {
    this.goal = goal;
    this.row = row;
    this.length = length;
    this.shuffledInitial = shuffledInitial;
    this.result = [];
    console.log(this.goal, this.shuffledInitial);
  }
  printPuzzle = (arr) => {
    return arr.reduce((acc, next, key) => {
      return (key + 1) % this.row === 0 ? `${acc} ${next}\n` : `${acc} ${next}`;
    }, '');
  };

  getAvailableMoves = (position) => {
    const direction = [this.row, -this.row];
    (position + 1) % this.row !== 0 ? direction.push(1) : 0;
    position % this.row !== 0 ? direction.push(-1) : 0;
    return direction
      .map((a) => a + position)
      .filter((b) => b >= 0 && b < this.length);
  };

  getEmptyCell = (arr) => {
    console.log('GET EMPOTY', arr);
    return arr.indexOf(this.goal.length - 1);
  };

  checkMisplacedCount = (shuffle) => {
    return shuffle.reduce((acc, next, key) => {
      return this.goal[key] !== next ? acc + 1 : acc;
    }, 0);
  };

  checkMisplacedCount = (shuffle) => {
    return shuffle.reduce((acc, next, key) => {
      return this.goal[key] !== next ? acc + 1 : acc;
    }, 0);
  };

  swapEmpty = (arr, empty, position) => {
    const buff = [...arr];
    [buff[empty], buff[position]] = [buff[position], buff[empty]];
    return [buff, empty];
  };

  manhattanDistance = (current, destination) => {
    if (current === destination) return 0;
    const min = Math.min(current, destination);
    const max = Math.max(current, destination);
    const dy = Math.floor(
      Math.ceil(max / this.row) - Math.ceil(min / this.row)
    );
    const dx = Math.abs(max - dy * this.row - min);
    return dx + dy;
  };

  countWeight = (shuffle, deep = 0) => {
    const sum = shuffle
      .map((a, k) => {
        return this.manhattanDistance(shuffle.indexOf(k), k);
      })
      .reduce((acc, next) => acc + next);
    return this.checkMisplacedCount(shuffle) + sum;
  };

  getBranch = (shuffle, empty) => {
    const path = [];
    const branch = this.getAvailableMoves(empty).map((a) => {
      const swap = this.swapEmpty(shuffle, empty, a);
      path.push(swap[1]);
      return swap[0];
    });
    return [branch, path];
  };

  startSearch() {
    return this.starSearch(
      this.shuffledInitial,
      this.getEmptyCell(this.shuffledInitial),
      0,
      this.countWeight(this.shuffledInitial, 0),
      [],
      []
    );
  }

  starSearch = (shuffle, empty, deep, initWeight, memo, path) => {
    console.log('DEEEP', deep);
    const [branchList, newPath] = this.getBranch(shuffle, empty);
    let bestMove = [];
    let bestWeight = Infinity;

    const some = branchList
      .map((a, key) => {
        return {
          value: this.countWeight(a, deep),
          key,
          path: newPath[key],
        };
      })
      .sort((a, b) => a.value - b.value);
    let best = [];

    let flag = false;
    let last = [];
    let count = 0;
    while (this.result.length === 0) {
      best = some[count];
      bestWeight = best.value;
      bestMove = branchList[best.key];
      console.log('BEST WEIGHT', bestWeight);
      // console.log(printPuzzle(bestMove));
      if (memo.includes(bestMove.map((a) => String(a)).join(''))) {
        flag = false;
        return [];
      }
      if (bestWeight === 0 || deep > 50) {
        console.log('COMPLETED-----------------', this.printPuzzle(bestMove));
        flag = true;
        this.result = bestMove;
        return bestMove;
      } else
        last = this.starSearch(
          bestMove,
          this.getEmptyCell(bestMove),
          deep + 1,
          bestWeight.value,
          [...memo, bestMove.map((a) => String(a)).join('')],
          [...path, some[count].path]
        );
      flag = last.length !== 0;
      count++;
    }
    return last;
  };
}

// const goal = [0, 1, 2, 3, 4, 5, 6, 7, 8];
// const row = 3;
// const length = 9;
// const shuffledInitial = [0, 2, 4, 3, 7, 8, 6, 5, 1];

// const sol = new Solution(
//   [0, 1, 2, 3, 4, 5, 6, 7, 8],
//   [0, 2, 4, 3, 7, 8, 6, 5, 1],
//   3,
//   9
// );

// console.log(sol.startSearch());

// console.log(getEmptyCell(shuffledInitial));
// console.log(
//   'YOU GOT MAIL',
//   starSearch(
//     [0, 2, 4, 3, 7, 8, 6, 5, 1],
//     getEmptyCell([0, 2, 4, 3, 7, 8, 6, 5, 1]),
//     0,
//     countWeight([0, 2, 4, 3, 7, 8, 6, 5, 1], 0),
//     [],
//     []
//   )
// );
