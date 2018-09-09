$(document).ready(function(){
    // let socket = io.connect('http://127.0.0.1:5000');
    // socket.on('connect', function(){
    //    socket.emit('my event', {data: 'I\'m connected!'});
    // });
    const chess = document.getElementById('chess');
    const chessContext = chess.getContext('2d');
    const gameInfo = document.getElementById('gameInfo');
    const chessBoard = [];
    let isEnd = false;
    let offensive = true;
    const initBoard = (board) => {
        for (let i = 0; i < 20; i++) {
            board[i] = [];
            for (let j = 0; j < 20; j++) {
                board[i][j] = 0;
            }
        }
    };
    initBoard(chessBoard);

    const img = new Image();
    img.src = "../static/background.jpg";
    img.onload = () => {
        chessContext.drawImage(img, 0, 0, 600, 600);
        chessContext.strokeStyle = "#aaa";
        for (let i = 0; i < 20; i++) {
            chessContext.moveTo(15, 15 + i * 30);
			chessContext.lineTo(585, 15 + i * 30);
			chessContext.stroke();
			chessContext.moveTo(15 + i * 30, 15);
			chessContext.lineTo(15 + i * 30, 585);
			chessContext.stroke();
        }
    };
    
    const chessMove = (i, j, offensive) => {
        chessContext.beginPath();
        chessContext.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
        chessContext.closePath();
        if (offensive) {
            chessContext.fillStyle = "black"
        } else {
            chessContext.fillStyle = "white"
        }
        chessContext.fill();
    };
    
    const checkWin = (x, y, offensive) => {
        if (offensive) {
            color = 1;
        } else {
            color = 2;
        }
        // horizontal
        minJ = Math.max(y - 4, 0);
        maxJ = Math.min(y + 5, 20);
        count = 0;
        for (let j = minJ; j < maxJ; j++) {
            if (chessBoard[x][j] == color) {
                count++;
                if (count == 5)
                    return true;
            } else {
                count = 0;
            }
        }
    
        // vertical
        minI = Math.max(x - 4, 0);
        maxI = Math.min(x + 5, 20);
        count = 0;
        for (let i = minI; i < maxI; i++) {
            if (chessBoard[i][y] == color) {
                count++;
                if (count == 5)
                    return true;
            } else {
                count = 0;
            }
        }
        // diagonal
        minI = x - 4;
        maxI = x + 5;
        minJ = y - 4;
        maxJ = y + 5;
        count = 0;
        for (let i = minI, j = minJ; i < maxI && j < maxJ; i++, j++) {
            if (i < 0 || j < 0) {
                continue;
            }
            if (i > 19 || j > 19) {
                break;
            }
            if (chessBoard[i][j] == color) {
                count++;
                if (count == 5)
                    return true;
            } else {
                count = 0;
            }
        }
        // diagonal /
        minI = x - 4;
        maxI = x + 4;
        minJ = y - 4;
        maxJ = y + 4;
        count = 0;
        for (let i = maxI, j = minJ; i >= minI && j <= maxJ; i-- , j++) {
            if (i > 19 || j < 0) {
                continue;
            }
            if (i < 0 || j > 19) {
                break;
            }
            if (chessBoard[i][j] == color) {
                count++;
                if (count == 5)
                    return true;
            } else {
                count = 0;
            }
        }
        return false
    };

    chess.onclick = (e) => {
        alert("move!");
        if (isEnd) {
            return;
        }
        let x = e.offsetX;
        let y = e.offsetY;
        let i = Math.floor(x / 30);
        let j = Math.floor(y / 30);
        console.log("move");
        $.ajax({url:"/dataFromAjax", data:{"mydata": "test data"},success:function(data){
         alert(data);
      }});
        if (chessBoard[i][j] == 0) {
            chessMove(i, j, offensive);
            if (offensive) {
                chessBoard[i][j] = 1;
                gameInfo.innerText = 'Waiting for white to move..';
            } else {
                chessBoard[i][j] = 2;
                gameInfo.innerText = 'Waiting for black to move..';
            }
            if (checkWin(i, j, offensive)) {
                isEnd = true;
                if (offensive) {
                    gameInfo.innerText = 'Black won! Gameover. Refresh to restart!';
                } else {
                    gameInfo.innerText = 'White won! Gameover. Refresh to restart!';
                }
            }
            offensive = !offensive;
        }

        // $.get('/move', (data) => {
        //     // ...
        //
        // })
    }
});

