from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.config['DEBUG'] = True
socketio = SocketIO(app)

board = []
winner = 0
player_num = 0
turn = 1


def init_board():
    global board
    global winner
    global turn
    turn = 1
    winner = 0
    for _ in range(20):
        board.append([0] * 19)


def check_win(x, y, player):
    global board
    global winner
    # horizontal
    min_j = max(y-4, 0)
    max_j = min(y+5, 20)
    count = 0
    for j in range(min_j, max_j):
        if board[x][j] == player:
            count = count + 1
            if count == 5:
                winner = player
                return True
        else:
            count = 0
    # vertical
    min_i = max(x-4, 0)
    max_i = min(x+5, 20)
    count = 0
    for i in range(min_i, max_i):
        if board[i][y] == player:
            count = count + 1
            if count == 5:
                winner = player
                return True
        else:
            count = 0
    # diagonal \
    min_i = x-4
    max_i = x+5
    min_j = y-4
    max_j = y+5
    count = 0
    for i, j in zip(range(min_i, max_i), range(min_j, max_j)):
        if i < 0 or j < 0:
            continue
        if i > 19 or j > 19:
            break
        if board[i][j] == player:
            count = count + 1
            if count == 5:
                winner = player
                return True
        else:
            count = 0
    # diagonal /
    min_i = x - 5
    max_i = x + 4
    min_j = y - 4
    max_j = y + 5
    for i, j in zip(range(max_i, min_i, -1), range(min_j, max_j)):
        if i > 19 or j < 0:
            continue
        if i < 0 or j > 19:
            break
        if board[i][j] == player:
            count = count + 1
            if count == 5:
                winner = player
                return True
        else:
            count = 0
    return False


@app.route('/')
def index():
    init_board()
    return render_template("index.html")


@socketio.on('connect')
def connect():
    global player_num
    if player_num < 2:
        player_num = player_num + 1
        emit('player', player_num)
    else:
        emit('player', 'false')


@socketio.on('restart')
def restart():
    global player_num
    global board
    init_board()


@socketio.on('move')
def move(data):
    global player_num
    global board
    global winner
    global turn
    if player_num != 2:
        return
    if winner != 0:
        return
    i = data.get('i')
    j = data.get('j')
    current_player = data.get('player')
    if current_player != turn:
        return
    if board[i][j] != 0:
        return
    else:
        socketio.emit('draw', data, broadcast=True)
        board[i][j] = current_player
        if turn == 1:
            turn = 2
        else:
            turn = 1
        if check_win(i, j, current_player):
            socketio.emit('win', current_player, broadcast=True)
            return


if __name__ == '__main__':
    init_board()
    socketio.run(app)
