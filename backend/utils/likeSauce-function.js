//Function to find the index of an array
function findIndexInArray(array, userId) {
  if (array.length > 0) {
    let index = array.findIndex((cell) => cell === userId);
    console.log(
      "\n Index: " + index + "\n Tableau: " + array + "\n userId: " + userId
    );
    return index;
  }
  return -1;
}

module.exports = findIndexInArray;
