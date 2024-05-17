if (self["_"] === undefined) {
  importScripts("https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js");
}
const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43];

class ShuffleRings {
  rings;
  select;
  constructor(size) {
    this.rings = [];
    this.select = [];
    this.addPatch(size);
    this.addRings(size);
  }

  addPatch(size) {
    const half = Math.floor(size / 2);
    const tengen = xy2pos(half, half, size);
    let r = 2;
    const patch = patch3x3(tengen, size);
    const patchShuffles = [];
    const numPatch = primes[r++];
    for (let i = 0; i < numPatch; i++) {
      patchShuffles.push(_.shuffle(patch));
    }
    this.rings.push(patchShuffles);
    this.select.push(0);
  }

  addRings(size) {
    const half = Math.floor(size / 2);
    for (let n = half - 2; n >= 0; n--) {
      const nth = nthLine(n, size);
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