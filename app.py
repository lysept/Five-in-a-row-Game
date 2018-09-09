from flask import Flask, render_template, request, redirect, url_for
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.config['DEBUG'] = True
# socket_io = SocketIO(app)

board = []
is_end = False
player = True


def init_board():
    for _ in range(20):
        board.append([0] * 19)


def check_win(x, y, offensive):
    if offensive:
        color = 1
    else:
        color = 2
    # horizontal
    min_j = max(y-4, 0)
    max_j = min(y+5, 20)
    count = 0
    for j in range(min_j, max_j):
        if board[x][j] == color:
            count = count + 1
            if count == 5:
                is_end = True
                return True
        else:
            count = 0
    # vertical
    min_i = max(x-4, 0)
    max_i = min(x+5, 20)
    count = 0
    for i in range(min_i, max_i):
        if board[i][y] == color:
            count = count + 1
            if count == 5:
                is_end = True
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
        if board[i][j] == color:
            count = count + 1
            if count == 5:
                is_end = True
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
        if board[i][j] == color:
            count = count + 1
            if count == 5:
                is_end = True
                return True
        else:
            count = 0
    return False


@app.route('/')
def index():
    # print(board)
    # return render_template("index.html", board=board)
    return render_template("index.html")


@app.route('/move')
def move():
    if is_end:
        return "false"
    i = int(request.args.get('i'))
    j = int(request.args.get('j'))
    offensive = request.args.get('offensive')
    if board[i][j] == 0:
        if offensive == "true":
            board[i][j] = 1
            if check_win(i, j, True):
                return "true|1"
        else:
            board[i][j] = 2
            if check_win(i, j, False):
                return "true|2"
        return "true|0"
    else:
        return "false"

#
# @socket_io.on('move')
# def handle_move(data):
#     # emit('move response', data, broadcast=True)
#     print(data)
#

#
# @socket_io.on('my event')
# def handle_message(message):
#     print('received message: ' + message)


# @app.route('/dataFromAjax')
# def dataFromAjax():
#     test = request.args.get('mydata')
#     print(test)
#     return 'dataFromAjax'


if __name__ == '__main__':
    init_board()
    app.run(debug=True)
    # socket_io.run(app)