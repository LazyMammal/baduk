const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43];

class ShuffleRings {
  rings;
  select;
  constructor(board) {
    this.rings = [];
    this.select = [];
    this.addPatch(board);
    this.addRings(board);
  }

  addPatch(board) {
    const size = board.size;
    const half = Math.floor(size / 2);
    const tengen = board.xy2pos(half, half);
    const patch = board.patch3x3(tengen);
    const patchShuffles = [];
    const numPatch = primes[2];
    for (let i = 0; i < numPatch; i++) {
      patchShuffles.push(_.shuffle(patch));
    }
    this.rings.push(patchShuffles);
    this.select.push(0);
  }

  addRings(board) {
    const size = board.size;
    let r = 3;
    const half = Math.floor(size / 2);
    for (let n = half - 2; n >= 0; n--) {
      const nth = board.nthLine(n);
      const nthShuffles = [];
      const numNth = primes[r++];
      for (let i = 0; i < numNth; i++) {
        nthShuffles.push(_.shuffle(nth));
      }
      this.rings.push(nthShuffles);
      this.select.push(0);
    }
  }

  getMoveOrder() {
    const moves = [];
    for (let n = 0; n < this.rings.length; n++) {
      moves.push(this.rings[n][this.select[n]]);
      if (++this.select[n] >= this.rings[n].length) {
        this.select[n] = 0;
      }
    }
    return moves.flat();
  }
}