/**
  Utilities for this and that.
**/


function vecDist(a, b){
  return dist(a[0], a[1], b[0], b[1]);
}


/**
  Find the smallest value in an array.
*/
function findMin(arr){
  var smallest = arr[0];
  var i;
  
  for(i = 1; i < arr.length; i++){
    if(arr[i] < smallest){
      smallest = arr[i];
    }
  }
  return smallest;
}


/**
  Find the largest value in the array
  
**/
function findMax(arr){
  var largest = arr[0];
  var i;
  
  for(i = 1; i < arr.length; i++){
    if(arr[i] > largest){
      largest = arr[i];
    }
  }
  return largest;
}

/**
 * Calculate the average value in an array.
 *
 * @param arr
 * @return {Number}
 */
function findAverage(arr){
  var average = 0;

  for(var i in arr){
    average += arr[i];
  }
  average /= arr.length;

  return average;
}

/**
 * Find the average vector in an array
 * Useful for finding the centroid in a list of vertices.
 *
 * @param arr - Expected to be single dimensional [x,y,x,y,x,y....]
 * @return {Array} 2-element array containing the average vector
 */
function findAverageVector(arr){
  var average = [0, 0];
  var i;
  for(i = 0; i < arr.length; i += 2){
     average[0] += arr[i];
     average[1] += arr[i + 1];
  }

  average[0] /= arr.length/2;
  average[1] /= arr.length/2;

  return average;
}


function putVertsInPixels(arr){
  var copy = [];
  for(var i in arr){
    copy.push([arr[i][0] * 30, arr[i][1] * 30])
  }
  return copy;
}

function cloneVertices(arr){
  var copy = [];
  for(var i in arr){
    copy.push([arr[i][0], arr[i][1]])
  }
  return copy;
}

/**
 *
 * @param arr
 * @param elementCount
 *
 * [ [0,1], [0,2]]
 *
 */
function getCenter(arr){
  var sum = [0, 0];
  var numVectors = arr.length;

  for(var i in arr){
    sum[0] += arr[i][0];
    sum[1] += arr[i][1];
  }

  return [sum[0]/numVectors, sum[1]/numVectors];
}

/**
 *
 * @param min
 * @param max
 * @return {Number}
 */
function getRandomNumber(min, max){
  return (Math.random() * (max -min)) + min;
}

