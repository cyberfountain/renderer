export type DiffResult = {
  delete: {
    type: "delete";
    key: string;
  }[];
  insert: {
    type: "insert";
    key: string;
    value: unknown;
    beforeKey: string | null;
  }[];
  move: {
    type: "move";
    key: string;
    beforeKey: string | null;
  }[];
};

type InputDiffArray = {
  key: string;
}[];

/**
 * Diff two arrays of objects (each having a unique `key`)
 * and return an object with operations grouped by type.
 * reasonably fast: 10k elements 5-6ms 1k 3ms
 * on normal size lists expected in apps negligible overhead of sub millisecond
 */
export const diff = (
  oldArr: InputDiffArray,
  newArr: InputDiffArray,
): DiffResult => {
  const oldLen = oldArr.length;
  const newLen = newArr.length;
  // eslint-disable-next-line no-null/no-null
  const oldKeyIndex = Object.create(null);
  let i;
  let key;
  let k;

  // Build a mapping from key to index for oldArr.
  for (i = 0; i < oldLen; i++) {
    key = oldArr[i].key;
    oldKeyIndex[key] = i;
  }

  // Build newIndices, seq (for computing the LIS), posMap, and newKeys in one pass.
  const newIndices = new Array(newLen);
  const seq = [];
  const posMap = [];
  // eslint-disable-next-line no-null/no-null
  const newKeys = Object.create(null);

  for (i = 0; i < newLen; i++) {
    const item = newArr[i],
      k = item.key;
    newKeys[k] = true;
    const oldIndex = oldKeyIndex[k];
    if (oldIndex === undefined) {
      newIndices[i] = -1;
    } else {
      newIndices[i] = oldIndex;
      seq.push(oldIndex);
      posMap.push(i);
    }
  }

  // Compute the Longest Increasing Subsequence (LIS) indices.
  const lisSeqIndices = computeLIS(seq);
  // Instead of a Set, use a Boolean array for "keep" marks.
  const keep = new Array(newLen);
  for (i = 0; i < newLen; i++) {
    keep[i] = false;
  }
  const lisLen = lisSeqIndices.length;
  for (i = 0; i < lisLen; i++) {
    keep[posMap[lisSeqIndices[i]]] = true;
  }

  // Group operations into separate arrays.
  const opsDelete = [],
    opsInsert = [],
    opsMove = [];

  // Deletions: any key in oldArr that isn't in newArr.
  for (i = 0; i < oldLen; i++) {
    k = oldArr[i].key;
    if (newKeys[k] !== true) {
      opsDelete.push({ type: "delete" as const, key: k });
    }
  }

  // Insertions and Moves.
  for (i = 0; i < newLen; i++) {
    k = newArr[i].key;
    // Compute beforeKey once per iteration.
    // eslint-disable-next-line no-null/no-null
    const beforeKey = i + 1 < newLen ? newArr[i + 1].key : null;
    if (newIndices[i] === -1) {
      opsInsert.push({
        type: "insert" as const,
        key: k,
        value: newArr[i],
        beforeKey: beforeKey,
      });
    } else if (!keep[i]) {
      opsMove.push({ type: "move" as const, key: k, beforeKey: beforeKey });
    }
  }

  return {
    delete: opsDelete,
    insert: opsInsert,
    move: opsMove,
  };
};

/**
 * Compute the Longest Increasing Subsequence (LIS) of an array.
 * Returns an array of indices (into the input array) forming the LIS.
 * Runs in O(n log n) time.
 */
const computeLIS = (arr: number[]): number[] => {
  const n = arr.length;
  const p = new Array(n);
  const result = [];
  let i;
  let low;
  let high;
  let mid;

  for (i = 0; i < n; i++) {
    low = 0;
    high = result.length;
    // Binary search for the insertion point.
    while (low < high) {
      mid = (low + high) >>> 1;
      if (arr[result[mid]] < arr[i]) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    if (low === result.length) {
      result.push(i);
    } else {
      result[low] = i;
    }
    p[i] = low > 0 ? result[low - 1] : -1;
  }

  const lisLen = result.length;
  const lis = new Array(lisLen);
  let k = result[lisLen - 1];
  for (i = lisLen - 1; i >= 0; i--) {
    lis[i] = k;
    k = p[k];
  }
  return lis;
};

// if cache array empty skip diffing - initial render
// if new array empty skip diffing
// if inserts are === to the length of new array just tear it down
// maybe a high end percentage let's 90% change and long list just tear it down and rerender ??
// what thosecriteria whould be waht is a long list 1k 2k 10k :shrug:
// same with deletes
// inserts possibly just renderListItem append at given point instead of appending child
// render array cache just replace every time
//
// initial render loop over all
// diff sequence ?? :
//  1. deletes
//  2. moves
//  3. inserts
//
//  operate on listCache for deletes and moves
//  when deleting remove from cache
//  itterate over cache and trigger update
//  perform insert - renderListItem before a given child instead of container append :thinking:
//  I think I want the whole rendering procudure to happen here not in TemplateHole :thinking:
//
//  This has to be written modular so I can unit test this, this is critical part
const diffProcedure = (newArr: any): any => {
  // Call this renderList I guess ??
  // entry point data I need
  // cache access given by passing a parentElement
};
