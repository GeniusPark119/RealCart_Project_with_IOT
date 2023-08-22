import sys
import time
import threading
import socket
import time
import base64
import sys
import os
import json
from datetime import datetime
import threading
import RPi.GPIO as GPIO
from PySide2.QtWidgets import *
from PySide2.QtCore import *
from RC_car_ui import Ui_MainWindow
from DC_motor import DC_MOTOR
from servo_motor import SERVO_MOTOR
from color_sensor import COLOR
from client_socket import ClientSocket

class recv_thread(QThread):
    def __init__(self):
        QThread.__init__(self)
        self.mutex = QMutex()
    
    def run(self):
        global win, flag_up, flag_down, flag_shift, flag_left, flag_right, flag_release, flag_ctrl

        while True:
            recv_data = win.client.recvData()

            # Socket 연결이 끊겼을 경우,
            if recv_data == 0:
                print('socket disconnected')
                break
            
            # 입력 데이터
            key_up = 38
            key_down = 40
            key_shift = 32
            key_up_release = 42
            key_down_release = 43
            key_left = 37
            key_right = 39
            key_release = 41
            key_ctrl = 17            
            start_signal = 49
                 
            self.mutex.lock()   
            if (recv_data == key_up): flag_up = True
            if (recv_data == key_down): flag_down = True
            if (recv_data == key_up_release): flag_up = False
            if (recv_data == key_down_release): flag_down = False
            if (recv_data == key_shift): flag_shift = True
            if (recv_data == key_left): flag_left = True
            if (recv_data == key_right): flag_right = True
            if (recv_data == key_release): flag_release = True
            if (recv_data == key_ctrl): flag_ctrl = True             
            if (recv_data == start_signal) : win.startSignal()

            win.print_recv_data(recv_data)
            self.mutex.unlock()

    def stop(self):
        pass


class MyApp(QMainWindow, Ui_MainWindow):
    def __init__(self):
        global car_model, car_no, car_speed, car_gate, left, right, center
        global TCP_IP, TCP_PORT, str_gate1, str_gate2, str_gate3, str_gate4
        global dc_enable, dc_input_1, dc_input_2, servo_pin, color_s2, color_s3, color_signal
        global car_speed_limit, car_boost_speed_limit

        super().__init__()
        self.ui = Ui_MainWindow()
        self.ui.setupUi(self)

        self.ui.lb_model_param.setText(car_model)
        self.ui.lb_car_no_param.setText(car_no)
        self.ui.lb_speed_param.setText(str(car_speed))
        self.ui.lb_gate_param.setText(str(car_gate))
        self.ui.le_ip.setText(TCP_IP)
        self.ui.le_port.setText(str(TCP_PORT))
        self.ui.le_gate1.setText(str_gate1)
        self.ui.le_gate2.setText(str_gate2)
        self.ui.le_gate3.setText(str_gate3)
        self.ui.le_gate4.setText(str_gate4)
        
        self.ui.le_dc_enable.setText(str(dc_enable))
        self.ui.le_dc_input1.setText(str(dc_input_1))
        self.ui.le_dc_input2.setText(str(dc_input_2))
        self.ui.le_servo_pin.setText(str(servo_pin))
        self.ui.le_speed_limit_speed.setText(str(car_speed_limit))
        self.ui.le_speed_limit_boost_limit.setText(str(car_boost_speed_limit))
        self.ui.le_handle_left.setText(str(left))
        self.ui.le_handle_center.setText(str(center))
        self.ui.le_handle_right.setText(str(right))
        self.ui.le_color_s2.setText(str(color_s2))
        self.ui.le_color_s3.setText(str(color_s3))
        self.ui.le_color_signal.setText(str(color_signal))
        
        self.ui.lb_motor_param.setText("Disconnect")
        self.ui.lb_motor_param.setStyleSheet("Color : red")
        self.ui.lb_socket_param.setText("Disconnect")
        self.ui.lb_socket_param.setStyleSheet("Color : red")
        self.ui.btn_motor_disconnect.setEnabled(False)
        self.ui.btn_socket_disconnect.setEnabled(False)
        self.ui.btn_ready.setEnabled(False)
        self.ui.btn_start.setEnabled(False)
        self.ui.btn_finish.setEnabled(False)
        
        self.send_timer_working = False

        self.color_timer = QTimer(self)
        self.color_timer.setInterval(50)
        self.color_timer.timeout.connect(self.color_sensing)

        self.send_timer = QTimer(self)
        self.send_timer.setInterval(200)
        self.send_timer.timeout.connect(self.data_sending)

        self.race_timer = QTimer(self)
        self.race_timer.setInterval(100)
        self.race_timer.timeout.connect(self.racing)

        self.handling_timer = QTimer(self)
        self.handling_timer.setInterval(100)
        self.handling_timer.timeout.connect(self.handling)

        self.boost_timer = QTimer(self)
        self.boost_timer.setInterval(5000)
        self.boost_timer.timeout.connect(self.boosting)


    def readySignal(self):
        global car_status
        
        # Motor와 Socket 연결 확인
        if (self.ui.lb_socket_param.text() == "Disconnect" or self.ui.lb_motor_param.text() == "Disconnect"):
            self.print_log('Please Connect Motor/Socket')
            return
        
        # Car 상태 Ready로 세팅
        car_status = 1
        self.ui.lb_status_param.setText('Ready')
        
        # Socket을 통해 Ready 신호 보내기
        temp_data = self.data_json()        
        self.client.sendData(temp_data)
        self.print_send_data(temp_data)
                
        # 주행 Timer 실행
        self.race_timer.start()
        self.handling_timer.start()
        self.send_timer.start()
        
        # UI Setting
        self.ui.btn_ready.setEnabled(False)
        self.ui.btn_start.setEnabled(True)
        self.ui.btn_finish.setEnabled(False)
        
        self.print_log('Completed sending Ready Signal')
        
        
    def startSignal(self):
        global  car_gate, car_status

        # Car Gate 세팅
        car_gate = 1
        car_status = 3
        self.ui.lb_gate_param.setText(str(car_gate))
        
        # send_timer 실행
        self.send_timer_working = True

        # UI Setting
        self.ui.btn_ready.setEnabled(False)
        self.ui.btn_start.setEnabled(False)
        self.ui.btn_finish.setEnabled(True)
        
        self.print_log('Racing Start...')
        
        
    def finishSignal(self):
        global car_status, car_gear, car_speed
        
        # 속도 멈추기
        car_speed = 0
        car_gear.drive(0)
        
        # 주행 Timer 종료
        self.race_timer.stop()
        self.handling_timer.stop()
        self.send_timer.stop()

        # Car Status 변경
        car_status = 2
        self.ui.lb_status_param.setText('Finish')
        temp_data = self.data_json()
        self.client.sendData(temp_data)
        self.print_send_data(temp_data)
        
        # UI Setting
        self.ui.btn_ready.setEnabled(True)
        self.ui.btn_start.setEnabled(False)
        self.ui.btn_finish.setEnabled(False)
                
        self.print_log('Racing is finished')


    def motorConnect(self):
        global dc_enable, dc_input_1, dc_input_2, servo_pin, color_s2, color_s3, color_signal
        global car_gear, car_handle, car_color
        
        # DC motor Setting
        car_gear = DC_MOTOR(dc_enable, dc_input_1, dc_input_2)
        
        if (car_gear.error == 0):
            self.print_log('DC motor GPIO Pin Setting Complete')
        else:
            self.print_log('DC motor GPIO Pin Setting Fail')
            return
        
        # Servo motor Setting
        car_handle = SERVO_MOTOR(servo_pin)
        
        if (car_handle.error == 0):
            self.print_log('SERVO motor GPIO Pin Setting Complete')
        else:
            self.print_log('SERVO motor GPIO Pin Setting Fail')
            return
        
        # Color Sensor Setting
        car_color = COLOR(color_s2, color_s3, color_signal)
        
        if (car_color.error == 0):
            self.print_log('Color Sensor GPIO Pin Setting Complete')
        else:
            self.print_log('Color Sensor GPIO Pin Setting Fail')
            return
        
        # Color Sensing
        self.color_timer.start()
        self.print_log('Color Sensing...')

        # UI Setting
        self.print_log('Motor Connect Success')
        self.ui.lb_motor_param.setText('Connect')
        self.ui.lb_motor_param.setStyleSheet("Color : green")
        
        self.ui.btn_motor_connect.setEnabled(False)
        self.ui.btn_motor_disconnect.setEnabled(True)
            
            
    def motorDisconnect(self):
        global car_color, car_gear, car_handle

        # Color Sensing Stop
        self.color_timer.stop()
        self.print_log('Color Sensing Stop')

        # GPIO Pin Cleanup
        del car_color
        del car_gear
        del car_handle    
        GPIO.cleanup()
        self.print_log('GPIO Pin Cleanup Done')

        # UI Setting
        self.print_log('Motor Disconnect')
        self.ui.lb_motor_param.setText('Disconnect')
        self.ui.lb_motor_param.setStyleSheet("Color : red")
        
        self.ui.btn_motor_connect.setEnabled(True)
        self.ui.btn_motor_disconnect.setEnabled(False)
        
    
    def socketConnect(self):        
        # IP 주소와 Port 넘버
        TCP_IP = self.ui.le_ip.text()
        TCP_PORT = int(self.ui.le_port.text())
        
        # motor 연결 여부 확인
        if (self.ui.lb_motor_param.text() == "Disconnect"):
            self.print_log('Sensor/Motor GPIO Pin Setting is not finished')
            self.print_log('please click the Motor Connect')
            return                
        
        # Client Socket 연결
        self.client = ClientSocket(TCP_IP, TCP_PORT)
        self.client.connectServer()

        # Client Socket 실패
        if self.client.error == 1:
            self.print_log('client Connect Fail')
            return

        # 데이터 수신 쓰레드 실행        
        self.recv_th = recv_thread()
        self.recv_th.start()

        # UI Setting
        self.print_log('Socket Connect Success')
        self.ui.lb_socket_param.setText('Connect')
        self.ui.lb_socket_param.setStyleSheet("Color : green")
        
        self.ui.btn_socket_connect.setEnabled(False)
        self.ui.btn_socket_disconnect.setEnabled(True)
        self.ui.btn_ready.setEnabled(True)
        self.ui.btn_start.setEnabled(False)
        self.ui.btn_finish.setEnabled(False)     
                

    def socketDisconnect(self):
        # 데이터 송신 타이머 종료
        self.send_timer.stop()

        # 레이싱 타이머 종료
        self.race_timer.stop()

        # Socket Disconnect
        self.client.disconnectServer()
        self.print_log('Socket disconnected')
                
        # 데이터 수신 쓰레드 종료
        self.recv_th.stop()
        
        # UI Setting
        self.print_log('Socket Disconnect')
        self.ui.lb_socket_param.setText('Disconnect')
        self.ui.lb_socket_param.setStyleSheet("Color : red")
        
        self.ui.btn_socket_connect.setEnabled(True)
        self.ui.btn_socket_disconnect.setEnabled(False)
        self.ui.btn_ready.setEnabled(False)
        self.ui.btn_start.setEnabled(False)
        self.ui.btn_finish.setEnabled(False)
               
    def colorMatching(self):
        global color_rgb, init_data
        
        if (self.ui.lb_motor_param.text() == "Disconnect"):
            self.print_log('Please Connect motor')
            return
        
        data_count = int(self.ui.sb_color_count.text())
        offset = int(self.ui.sb_color_offset.text())
        
        min_red = 987654321
        max_red = 0
        min_green = 987654321
        max_green = 0
        min_blue = 987654321
        max_blue = 0
        
        while (data_count):
            min_red = min(min_red, color_rgb[0])
            max_red = max(max_red, color_rgb[0])
            min_green = min(min_green, color_rgb[1])
            max_green = max(max_green, color_rgb[1])
            min_blue = min(min_blue, color_rgb[2])
            max_blue = max(max_blue, color_rgb[2])
            
            data_count -= 1
            time.sleep(0.01)
        
        min_red -= offset
        max_red += offset
        min_green -= offset
        max_green += offset
        min_blue -= offset
        max_blue += offset
        
        temp_no = self.ui.sb_gate.value()
        gate = [min_red, max_red, min_green, max_green, min_blue, max_blue]
        
        str_gate = "{0},{1},{2},{3},{4},{5}".format(min_red, max_red, min_green, max_green, min_blue, max_blue)
        
        if (temp_no == 1):
            self.ui.le_gate1.setText(str_gate)
            init_data['Gate1'] = str_gate
        elif (temp_no == 2):
            self.ui.le_gate2.setText(str_gate)
            init_data['Gate2'] = str_gate
        elif (temp_no == 3):
            self.ui.le_gate3.setText(str_gate)
            init_data['Gate3'] = str_gate
        elif (temp_no == 4):
            self.ui.le_gate4.setText(str_gate)
            init_data['Gate4'] = str_gate
        
        with open('RC_car.json', 'w', encoding='utf-8') as temp_file:
            json.dump(init_data, temp_file, indent="\t")
        
        self.print_log("gate {0} Color Matching is finished".format(temp_no))
        
    
    def dcMotorPinSettingSave(self):
        global init_data, dc_enable, dc_input_1, dc_input_2
        
        dc_enable = int(self.ui.le_dc_enable.text())
        dc_input_1 = int(self.ui.le_dc_input1.text())
        dc_input_2 = int(self.ui.le_dc_input2.text())
        
        init_data['DC_enable'] = dc_enable
        init_data['DC_input1'] = dc_input_1
        init_data['DC_input2'] = dc_input_2
        
        with open('RC_car.json', 'w', encoding='utf-8') as temp_file:
            json.dump(init_data, temp_file, indent="\t")
        
        QMessageBox.information(self, "DC Motor Pin Setting", "DC motor Pin data has been saved")
        
    
    def servoMotorPinSettingSave(self):
        global init_data, servo_pin
        
        servo_pin = int(self.ui.le_servo_pin.text())
        
        init_data['Servo_pin'] = servo_pin
        
        with open('RC_car.json', 'w', encoding='utf-8') as temp_file:
            json.dump(init_data, temp_file, indent="\t")
        
        QMessageBox.information(self, "Servo Motor Pin Setting", "Servo motor Pin data has been saved")
        
    
    def speedLimitSave(self):
        global init_data, car_speed_limit, car_boost_speed_limit
        
        car_speed_limit = int(self.ui.le_speed_limit_speed.text())
        car_boost_speed_limit = int(self.ui.le_speed_limit_boost_limit.text())
        
        init_data['Speed_limit'] = car_speed_limit
        init_data['Boost_speed_limit'] = car_boost_speed_limit
        
        with open('RC_car.json', 'w', encoding='utf-8') as temp_file:
            json.dump(init_data, temp_file, indent="\t")
        
        QMessageBox.information(self, "Speed Limit Setting", "Speed limit data has been saved")
    
    
    def handleSave(self):
        global init_data, left, center, right
        
        left = float(self.ui.le_handle_left.text())
        center = float(self.ui.le_handle_center.text())
        right = float(self.ui.le_handle_right.text())
        
        init_data['Handle_left'] = left
        init_data['Handle_center'] = center
        init_data['Handle_right'] = right
        
        with open('RC_car.json', 'w', encoding='utf-8') as temp_file:
            json.dump(init_data, temp_file, indent="\t")
        
        QMessageBox.information(self, "Handle Data Save", "Handle data has been saved")
        
        
    def colorSensorPinSetting(self):
        global init_data, color_s2, color_s3, color_signal
        
        color_s2 = int(self.ui.le_color_s2.text())
        color_s3 = int(self.ui.le_color_s3.text())
        color_signal = int(self.ui.le_color_signal.text())
        
        init_data['Color_s2'] = color_s2
        init_data['Color_s3'] = color_s3
        init_data['Color_signal'] = color_signal
        
        with open('RC_car.json', 'w', encoding='utf-8') as temp_file:
            json.dump(init_data, temp_file, indent="\t")
        
        QMessageBox.information(self, "Color Sensor Pin Setting", "COlor Sensor Pin data has been saved")
        
        
    def closeEvent(self, event):            
        quit_msg = "Do you want to close this window?"
        reply = QMessageBox.question(self, 'Message', quit_msg, QMessageBox.Yes, QMessageBox.No)
        
        if reply == QMessageBox.Yes:
            self.socketDisconnect()
            self.motorDisconnect()            
            event.accept()
        else:
            event.ignore()
    

    def color_sensing(self):
        global str_gate1, str_gate2, str_gate3, str_gate4
        global car_gate, color_rgb, car_cur_gate
        
        arr_gate1 = self.ui.le_gate1.text().split(',')
        arr_gate2 = self.ui.le_gate2.text().split(',')
        arr_gate3 = self.ui.le_gate3.text().split(',')
        arr_gate4 = self.ui.le_gate4.text().split(',')

        color_rgb = car_color.color_sensing()
        self.print_rgb(color_rgb)

        if (int(arr_gate1[0]) <= color_rgb[0] <= int(arr_gate1[1]) and int(arr_gate1[2]) <= color_rgb[1] <= int(arr_gate1[3]) and int(arr_gate1[4]) <= color_rgb[2] <= int(arr_gate1[5])):
            car_cur_gate = 0
            
            if car_gate == 4:
                car_gate = 1
                win.ui.lb_gate_param.setText(str(car_gate))
                self.finishSignal()
                
        elif (int(arr_gate2[0]) <= color_rgb[0] <= int(arr_gate2[1]) and int(arr_gate2[2]) <= color_rgb[1] <= int(arr_gate2[3]) and int(arr_gate2[4]) <= color_rgb[2] <= int(arr_gate2[5])):
            car_cur_gate = 1
            if car_gate == 1:
                car_gate = 2
                win.ui.lb_gate_param.setText(str(car_gate))
                
        elif (int(arr_gate3[0]) <= color_rgb[0] <= int(arr_gate3[1]) and int(arr_gate3[2]) <= color_rgb[1] <= int(arr_gate3[3]) and int(arr_gate3[4]) <= color_rgb[2] <= int(arr_gate3[5])):
            car_cur_gate = 2
            
            if car_gate == 2:
                car_gate = 3
                win.ui.lb_gate_param.setText(str(car_gate))
                
        elif (int(arr_gate4[0]) <= color_rgb[0] <= int(arr_gate4[1]) and int(arr_gate4[2]) <= color_rgb[1] <= int(arr_gate4[3]) and int(arr_gate4[4]) <= color_rgb[2] <= int(arr_gate4[5])):
            car_cur_gate = 3
            
            if car_gate == 3:
                car_gate = 4
                win.ui.lb_gate_param.setText(str(car_gate))


    def data_sending(self):
        if self.send_timer_working == False: return
        
        temp_data = self.data_json()
        self.client.sendData(temp_data)
        self.print_send_data(temp_data)


    def racing(self):
        global car_gear, car_speed, car_speed_limit, car_top_speed, car_boost_speed_limit
        global flag_up, flag_down, flag_shift, flag_ctrl, flag_boost

        if flag_up:
            car_speed += 10
            if (car_speed > car_top_speed): car_speed = car_top_speed
    
        elif flag_down:
            car_speed -= 10
            if (car_speed < -car_top_speed): car_speed = -car_top_speed
    
        elif flag_shift:
            car_speed = 0
            flag_shift = False

        elif flag_ctrl and flag_boost == False:
            flag_boost = True
            car_top_speed = car_boost_speed_limit
            self.boost_timer.start()

        else:
            car_speed *= 0.9
        
        car_speed = int(car_speed)
        car_gear.drive(car_speed)
        self.ui.lb_speed_param.setText(str(car_speed))


    def handling(self):
        global flag_left, flag_right, flag_release
        global left, center, right

        if flag_left:
            car_handle.steering(left)
            flag_left = False
    
        if flag_right:
            car_handle.steering(right)
            flag_right = False
    
        if flag_release:
            car_handle.steering(center)
            flag_release = False

    
    def boosting(self):
        global flag_boost, car_speed_limit, car_top_speed

        flag_boost = False
        car_top_speed = car_speed_limit
        self.boost_timer.stop()
            
    def data_json(self):
        global car_no, car_speed, car_cur_gate, car_status
        timestamp = round(time.time() * 1000)
        json_data = f"{{\"carNum\": {car_no}, \"timestamp\": {timestamp}, \"speed\" : {car_speed}, \"gateNo\" : {car_cur_gate}, \"status\" : {car_status} }}"
        return json_data

    def print_log(self, msg):
        global date


        temp_msg = datetime.now().strftime('%Y-%m-%d %H:%M:%S') + " " + msg
        temp_file = "./log/"+ date + "_log.txt"

        if not os.path.isdir('./log'):
            os.mkdir('./log')

        f = open(temp_file,'a')
        f.write(temp_msg + '\n')
        f.close()

        print(temp_msg)
        self.ui.tb_log.append(temp_msg)


    def print_recv_data(self, data):
        temp_data = datetime.now().strftime('%Y-%m-%d %H:%M:%S') + " " + str(data)
        self.ui.tb_recv_data.append(temp_data)
        
        
    def print_send_data(self, data):
        temp_data = datetime.now().strftime('%Y-%m-%d %H:%M:%S') + " " + str(data)
        self.ui.tb_send_data.append(temp_data)


    def print_rgb(self, color_rgb):
        color_data = "{0}, {1}, {2}".format(color_rgb[0], color_rgb[1], color_rgb[2])
        self.ui.lb_rgb_param.setText(color_data)
    

if __name__ == "__main__":
    
    ############### Global Variable ###############
    json_file = open('RC_car.json', 'r')
    init_data = json.load(json_file)
    
    lock = threading.Lock()

    date = str(datetime.now().strftime('%Y-%m-%d'))

    car_model = init_data['Model']
    car_no = init_data['Car_No']
    car_speed_limit = init_data['Speed_limit']
    car_boost_speed_limit = init_data['Boost_speed_limit']
    car_top_speed = car_speed_limit
    car_speed = 0
    car_gate = 0
    car_status = 0
    car_cur_gate = 0    
    
    TCP_IP = init_data['IP']
    TCP_PORT = init_data['Port']
    str_gate1 = init_data['Gate1']
    str_gate2 = init_data['Gate2']
    str_gate3 = init_data['Gate3']
    str_gate4 = init_data['Gate4']
    
    left = init_data['Handle_left']
    center = init_data['Handle_center']
    right = init_data['Handle_right']
    
    dc_enable = init_data['DC_enable']
    dc_input_1 = init_data['DC_input1']
    dc_input_2 = init_data['DC_input2']

    servo_pin = init_data['Servo_pin']

    color_s2 = init_data['Color_s2']
    color_s3 = init_data['Color_s3']
    color_signal = init_data['Color_signal']

    tflag_gate_sensing = False
    tflag_driving = False
    tflag_handling = False
    tflag_recv_data = False
    
    flag_motor_connect = False
    
    flag_up = False
    flag_down = False
    flag_left = False
    flag_right = False
    flag_shift = False
    flag_ctrl = False
    flag_release = False
    
    flag_start = False
    flag_boost = False
    
    ############### Global Variable ###############
    
    ############### QT GUI ###############
    app = QApplication()
    win = MyApp()
    win.show()
    app.exec_()
    ############### QT GUI ###############