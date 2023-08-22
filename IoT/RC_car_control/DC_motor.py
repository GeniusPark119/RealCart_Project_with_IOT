import RPi.GPIO as GPIO

class DC_MOTOR:
    
    def __init__(self, enable, input_1, input_2):
        
        try:
            GPIO.setmode(GPIO.BCM)
        
            GPIO.setup(enable,GPIO.OUT)
            GPIO.setup(input_1, GPIO.OUT)
            GPIO.setup(input_2, GPIO.OUT)
        
            self.pwm = GPIO.PWM(enable, 100)
            self.enable = enable
            self.input_1 = input_1
            self.input_2 = input_2
            self.error = 0
            
            self.pwm.start(0)
                    
        except Exception as e:
            self.error = 1
            print('DC MOTOR ERROR :', e)

    def motor_control(self, speed, stat):
        
        high = 1
        low = 0
        
        stop = 0
        forward = 1
        backward = 2
        
        try:
            self.pwm.ChangeDutyCycle(speed)

            if stat == forward:
                GPIO.output(self.input_1, high)
                GPIO.output(self.input_2, low)

            elif stat == backward:
                GPIO.output(self.input_1, low)
                GPIO.output(self.input_2, high)

            elif stat == stop:
                GPIO.output(self.input_1, low)
                GPIO.output(self.input_2, low)
        
        except:
            print('DC_motor.motor_control Error')
    
    def drive(self, speed):
        
        stop = 0
        forward = 1
        backward = 2
        
        try:
            if (0 < speed <= 100):
                self.motor_control(speed, forward)
        
            elif (speed == 0):
               self. motor_control(0, stop)
        
            elif (-100 <= speed < 0):
                self.motor_control(-speed, backward)
                
        except:
            print('DC_MOTOR.drive Error')
        