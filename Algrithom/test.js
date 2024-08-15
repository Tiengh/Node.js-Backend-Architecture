const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function optimalStrategy(n) {
    while (n > 0) {
        let take;
        if (n % 4 !== 0) {
            take = n % 4;
        } else {
            take = 1;  // Nếu tổng số que là bội số của 4, bạn lấy 1 que và chờ đợi sai lầm của đối thủ
        }
        n -= take;
        console.log(`A lấy ${take} que, còn lại ${n} que.`);
        if (n === 0) {
            console.log("A thắng!");
            break;
        }
        let opponentTake = parseInt(await askQuestion("Đối thủ (B) lấy 1, 2 hoặc 3 que: "));
        n -= opponentTake;
        console.log(`B lấy ${opponentTake} que, còn lại ${n} que.`);
        if (n === 0) {
            console.log("B thắng!");
            break;
        }
    }
    rl.close();
}

// Ví dụ chạy:
optimalStrategy(100);
