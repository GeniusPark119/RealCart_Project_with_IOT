import threading
import socket

class ClientSocket:
    
    def __init__(self, ip, port):
        self.TCP_SERVER_IP = ip
        self.TCP_SERVER_PORT = port
        self.connectCount = 0
        self.error = 0

    def connectServer(self):
        try:
            print('connecting server...')
            self.sock = socket.socket()
            self.sock.connect((self.TCP_SERVER_IP, self.TCP_SERVER_PORT))
            print(
                u'Client socket is connected with Server socket [ TCP_SERVER_IP: ' + self.TCP_SERVER_IP + ', TCP_SERVER_PORT: ' + str(
                    self.TCP_SERVER_PORT) + ' ]')
            self.connectCount = 0
            self.error = 0

            print('Server is connected')

        except Exception as e:
            print('server connect fail')
            print(e)
            self.connectCount += 1
            self.error = 1
            
            if self.connectCount == 10:
                print(u'Connect fail %d times. exit program' % (self.connectCount))
            else:
                print(u'%d times try to connect with server' % (self.connectCount))
                self.connectServer()

    def sendData(self, data):             
        try:            
            connect_result = self.sock.connect_ex((self.TCP_SERVER_IP, self.TCP_SERVER_PORT))
            
            if not connect_result:
                print('Socket is broken')
                print('you can\'t send data')
                self.error = 1
                return
            
            if not data:
                print('there is no send data')
                self.error = 2
                return
            
            self.sock.send(data.encode().ljust(100))

            print('Data has been sent')

        except Exception as e:
            print('send Data Error')
            print(e)
            self.error = 3
            self.sock.close()


    def recvData(self):
        try:
            print('receiving Data...')
            data = self.sock.recv(1)

            if not data:
                print('there is no receive data')
                return 0
            
            recv_data = int.from_bytes(data, byteorder='little')

            print('Data received')
            return recv_data
        
        except Exception as e:
            print('recv Data Error')
            print(e)

    def disconnectServer(self):
        self.sock.close()