function processData(input) {
    var max = 1;
    for (var i = 0; i < input; i++) {
        max = max * 10;
    }

    var min = 9 / 10;
    for (var i = 0; i < input; i++) {
        min = min * 10;
    }

    // min sẽ là số nhỏ nhất có 'input' chữ số
    min = max - min;

    var Snt = getSnt(max);
    for (var i = min; i < max; i++) {
        if (Snt.includes(i)) {
            console.log(i);
        }
    }
}

// Hàm tìm các số nguyên tố <= x (Sàng Eratosthenes)
var getSnt = function (x) {
    var a = [];
    for (var i = 0; i <= x; i++) {
        a[i] = true;
    }
    a[0] = false;
    a[1] = false;

    for (var i = 2; i * i <= x; i++) {
        if (a[i]) {
            for (var j = i * i; j <= x; j += i) {
                a[j] = false;
            }
        }
    }

    var Snt = [];
    for (var i = 2; i <= x; i++) {
        if (a[i]) Snt.push(i); 
    }
    return Snt;
};

// Gọi thử hàm
processData(1);

var lines = input.trim().split('\n');

var n = parseInt(lines[0]); 
var arr = lines[1].trim().split(' ').map(Number); 
var x = parseInt(lines[2]); 

 var found = false;
 if(arr.includes(x)) {
    found = true;
 } ;

console.log(found);

function processData(input) {
    
    let lines = input.trim().split('\n');
    let namHienTai = new Date().getFullYear();

    
    for (let i = 1; i < lines.length; i += 2) {
        let namSinh = parseInt(lines[i + 1].trim()); 
        let tuoi = namHienTai - namSinh;
        console.log(tuoi);
    }
}