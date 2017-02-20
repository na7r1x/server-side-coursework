function removeFromArray(arr, index) {
  var splicedArr = arr.slice(0);
  splicedArr.splice(index, 1);
  return splicedArr;

};

module.exports.removeFromArray = removeFromArray;
