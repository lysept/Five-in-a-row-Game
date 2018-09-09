$(document).ready(function() {
    let player, me;
    const chess = document.getElementById('chess');
    const chessContext = chess.getContext('2d');
    const gameInfo = document.getElementById('gameInfo');
    let isEnd = false;
    let socket = io.connect('http://127.0.0.1:5000');
    socket.on('connect', function() {
        console.log('connected');
    });
    socket.on('player', function(data){
        console.log('player'+data);
        player = data;
        if (player == 1){
            me = true;
            gameInfo.innerText = 'Time to move..';
        }
        else if (player == 2){
            me = false;
            gameInfo.innerText = 'Waiting for other play to move..';
        }
        else{
            gameInfo.innerText = 'Too many players. Watching the game..';
        }
    });

    const drawChessBoard = () => {
        const img = new Image();
        img.src = '../static/background.jpg';
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
    };

    drawChessBoard();
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

    chess.onclick = (e) => {
        if (player == 'false'){
            return
        }
        if (isEnd) {
            return;
        }
        if (!me) {
            return;
        }
        let x = e.offsetX;
        let y = e.offsetY;
        let i = Math.floor(x / 30);
        let j = Math.floor(y / 30);
        socket.emit('move', {i: i, j: j, player: player});
    };

    socket.on('draw', function(data){
        console.log(data);
        let drawI = data["i"];
        let drawJ = data["j"];
        let color = data["player"];
        if (color == '1'){
            chessMove(drawI, drawJ, true)
        }
        else{
            chessMove(drawI, drawJ, false)
        }
        me = !me;
        if (me){
            gameInfo.innerText = 'Time to move..';
        }
        else {
            gameInfo.innerText = 'Waiting for other play to move..';
        }
    });

    socket.on('win', function(data){
        console.log(data);
        isEnd = true;
        if ((data == '1' && player == 1) || (data == '2' && player == 2)) {
            gameInfo.innerText = 'You Won! Congrats!';
        } else {
            gameInfo.innerText = 'You Lose. But Never Give Up :)';
        }
    });
});