export type DiffResult = {
  delete: {
    type: "delete";
    key: string;
  }[];
  insert: {
    type: "insert";
    key: string;
    value: unknown;
    beforeKey?: string;
  }[];
  move: {
    type: "move";
    key: string;
    beforeKey?: string;
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
    const beforeKey = i + 1 < newLen ? newArr[i + 1].key : undefined;
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
