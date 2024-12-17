/**
 * @param {character[][]} grid
 * @return {number}
 */

const { functions } = require("lodash");

var board = [
  ["X", "X", "X", "X"],
  ["X", "O", "O", "X"],
  ["X", "X", "O", "X"],
  ["X", "O", "X", "X"],
];

var visited = [];
var dy = [-1, 0, 0, 1];
var dx = [0, 1, -1, 0];

var solve = function (board) {
  var n = board.length;
  var m = board[0].length;
  visited = Array.from({ length: n }, () => Array(m).fill(false));

  // Check first and last columns
  for (var i = 0; i < n; i++) {
    if (!visited[i][0] && board[i][0] === "O") {
      dfs(i, 0, n, m, board);
    }
    if (!visited[i][m - 1] && board[i][m - 1] === "O") {
      dfs(i, m - 1, n, m, board);
    }
  }

  // Check first and last rows
  for (var j = 0; j < m; j++) {
    if (!visited[0][j] && board[0][j] === "O") {
      dfs(0, j, n, m, board);
    }
    if (!visited[n - 1][j] && board[n - 1][j] === "O") {
      dfs(n - 1, j, n, m, board);
    }
  }

  // Change all unvisited 'O's to 'X'
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < m; j++) {
      if (!visited[i][j] && board[i][j] === "O") {
        board[i][j] = "X";
      }
    }
  }

  return board;
};

var dfs = function (i, j, n, m, grid) {
  visited[i][j] = true;
  for (var k = 0; k < 4; k++) {
    var i1 = i + dx[k];
    var j1 = j + dy[k];

    if (
      i1 >= 0 &&
      i1 < n &&
      j1 >= 0 &&
      j1 < m &&
      !visited[i1][j1] &&
      grid[i1][j1] === "O"
    ) {
      dfs(i1, j1, n, m, grid);
    }
  }
};

var matrix = [
  [1, 1, 1],
  [1, 0, 1],
  [1, 1, 1],
];

var setZeroes = function (matrix) {
  var checkHang = [];
  var checkCot = [];
  var n = matrix.length;
  var m = matrix[0].length;
  for (var i = 0; i < n; i++) {
    checkHang[i] = true;
  }
  for (var j = 0; j < m; j++) {
    checkCot[j] = true;
  }

  for (var i = 0; i < n; i++) {
    for (var j = 0; j < m; j++) {
      if (matrix[i][j] === 0) {
        checkHang[i] = false;
        checkCot[j] = false;
      }
    }
  }
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < m; j++) {
      if (checkHang[i] != true || checkCot[j] != true) {
        matrix[i][j] = 0;
      }
    }
  }
  return matrix;
};
var S = [60, 40, 69, 65, 55, 86, 81, 3, 99, 83, 6, 70, 80, 2, 66, 98];

//Thuật toán sắp quicksort
//Độ phức tạp trung bình O(nlog(n))
//Trường hợp tệ nhất O(n2)
var sort = function(s) {
  var n = s.length;
  var leftArray = [];
  var RightArray = [];
  var pivot = s[n - 1];
  
  //Dựa trên giá trị pivot chia thành 2 mảng leftArray và RightArray
  for (var i = 0; i < n; i++) {
    if (s[i] <= pivot) {
      leftArray.push(s[i]);
    } else {
      RightArray.push(s[i]);
    }
  }

  //đệ quy để sắp xếp với 2 mảng leftArray và leftArray
  return [...sort(leftArray), pivot, ...sort(leftArray)];
};

// Tìm mang có tổng lớn nhất
var matrix1 = function (a) {
  var n = a.length
  var max = -1000;
  var array = []; 

  for(var i = 0;i<n;i++){
    if(total[a[i]] > max ){
      max = a[i]
      array = a[i];
    }
  }
  return array
}

// Tìm mảng có tồn tại 1 và 99
var matrix2 = function (a) {
  var n = a.length
  var array = []; 

  for(var i = 0;i<n;i++){
    if(exist[a[i]]){
      array.push[a[i]];
    }
  }
  return array
}

//Tìm tổng các phần tử
var total = function (a) {
  var n = a.length
  var tong = 0;
  for(var i = 0;i<n;i++){
    tong+=a[i];
  }
  return tong;
}

//Kiểm tra sư tồn tại 1 và 99
var exist = function (a) {
  if(a.include(1) && a.include(99))
    return true
  return false
}

var FindSnt = function (s){
  var array = []
  for(var i = 0;i<10;i++){
    for(var j = 0;j<10;j++){
      if(snt(s[i][j])){
        array.push(s[i][j])
      }
    }
  }

  return array
}

var snt = function (s){
  if(s <= 2) return true;
  for(var i = 2;i<=Math.sqrt(s);i++){
    if(s%i == 0) return false
  }
  return true
}

a = [1,2,5,2]
b = [9,8,7,7]

console.log([...a,...b])

