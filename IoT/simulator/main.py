from PySide2.QtWidgets import *
from server_ui import Ui_MainWindow
import socket
import threading
import time
from pynput import keyboard

def on_press(key):
    if (key == keyboard.Key.up):
        client_socket.send('&'.encode())
    
    if (key == keyboard.Key.down):
        client_socket.send('('.encode())
    
    if (key == keyboard.Key.left):
        client_socket.send('%'.encode())
    
    if (key == keyboard.Key.right):
        client_socket.send('\''.encode())
        
    if (key == keyboard.Key.shift):
        client_socket.send(' '.encode())
    
    if (key == keyboard.Key.ctrl):
        temp_char = chr(17)
        client_socket.send(temp_char.encode())

def on_release(key):
    if (key == keyboard.Key.left):
        client_socket.send(')'.encode())
        
    if (key == keyboard.Key.right):
        client_socket.send(')'.encode())

    if (key == keyboard.Key.up):
        client_socket.send('*'.encode())

    if (key == keyboard.Key.down):
        client_socket.send('+'.encode())
        
    # print('Key %s released' %key)
    if key == keyboard.Key.esc:
        return False

def key_event():
    with keyboard.Listener(on_press=on_press, on_release=on_release) as listener:
        listener.join()

# 쓰레드에서 실행되는 코드입니다.
# 접속한 클라이언트마다 새로운 쓰레드가 생성되어 통신을 하게 됩니다
def threaded(client_socket, addr):
    print(">> Connected by:", addr[0], ':', addr[1])
    
    # 클라이언트가 접속을 끊을 때 까지 반복합니다.
    while True:

        try:
            # 데이터가 수신되면 클라이언트에 다시 전송합니다.
            data = client_socket.recv(1024)

            if not data:
                print(">> Disconnected by" + addr[0], ":", addr[1])
                break

            print(data.decode())

        except ConnectionResetError as e:
            print('>> Disconneted by' + addr[0], ':', addr[1])
            break

    if client_socket in client_sockets:
        client_sockets.remove(client_socket)
        print('remove client list:', len(client_sockets))

    client_socket.close()

def socket_connect():
    global server_socket, client_socket
    # 클라이언트가 접속하면 accept 함수에서 새로운 소켓을 리턴합니다.
    # 새로운 쓰레드에서 해당 소켓을 사용하여 통신을 하게 됩니다.
    try:
        while True:
            print('>> Wait')

            client_socket, addr = server_socket.accept()
            client_sockets.append(client_socket)
            
            print('recv_thread start')
            recv_thread = threading.Thread(target=threaded, args=(client_socket, addr))
            recv_thread.start()

            print('recv_thread starting...')
            
            print('send_thread start')
            send_thread = threading.Thread(target=key_event)
            send_thread.start()
            
            print('send_thread starting...')
            #start_new_thread(threaded, (client_socket, addr))
            #start_new_thread(key_event)
            print('참가자 수:', len(client_sockets))
            

    except Exception as e:
            print('Error :', e)

    finally:
        server_socket.close()

class MyApp(QMainWindow, Ui_MainWindow):
    def __init__(self):
        super().__init__()
        self.ui = Ui_MainWindow()
        self.ui.setupUi(self)
    
    def socketConnect(self):
        global client_sockets, server_socket
        # 서버 IP 및 열어줄 포트
        HOST = '127.0.0.1'
        PORT = 8081
        
        client_sockets = [] # 서버에 접속한 클라이언트 목록
        
        # 서버 소켓 생성
        print('>> Server Start')
        server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server_socket.bind((HOST, PORT))
        server_socket.listen()
        
        socket_connect_thread = threading.Thread(target=socket_connect)
        socket_connect_thread.start()

    def keyUp(self):
        global client_socket
        client_socket.send('&'.encode())

    def keyDown(self):
        global client_socket
        client_socket.send('('.encode())

    def keyLeft(self):
        global client_socket
        client_socket.send('%'.encode())

    def keyRight(self):
        global client_socket
        client_socket.send('\''.encode())

    def keyCtrl(self):
        global client_socket
        temp_char = chr(17)
        client_socket.send(temp_char.encode())

    def keyShift(self):
        global client_socket
        client_socket.send(' '.encode())
    
    def startSignal(self):
        client_socket.send('1'.encode())

if __name__=="__main__":
    app = QApplication()
    win = MyApp()
    win.show()
    app.exec_()