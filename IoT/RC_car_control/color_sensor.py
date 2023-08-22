import RPi.GPIO as GPIO
import time

class COLOR:

    def __init__(self, color_s2, color_s3, color_signal):

        try:
            GPIO.setmode(GPIO.BCM)

            GPIO.setup(color_signal, GPIO.IN, pull_up_down=GPIO.PUD_UP)
            GPIO.setup(color_s2, GPIO.OUT)
            GPIO.setup(color_s3, GPIO.OUT)

            self.color_s2 = color_s2
            self.color_s3 = color_s3
            self.color_signal = color_signal
            self.error = 0

        except Exception as e:
            self.error = 1
            
            print('Color Sensor Error :', e)

    def color_sensing(self):
        # color

        color_cycles = 20

        # Red
        GPIO.output(self.color_s2, GPIO.LOW)
        GPIO.output(self.color_s3, GPIO.LOW)

        start = time.time()

        for impulse_count in range(color_cycles):
            GPIO.wait_for_edge(self.color_signal, GPIO.FALLING)
        
        duration = time.time() - start  # seconds to rn for loop
        red = color_cycles / duration

        # Blue
        GPIO.output(self.color_s2, GPIO.LOW)
        GPIO.output(self.color_s3, GPIO.HIGH)
        # time.sleep(0.1)

        start = time.time()

        for impulse_count in range(color_cycles):
            GPIO.wait_for_edge(self.color_signal, GPIO.FALLING)

        duration = time.time() - start  # seconds to rn for loop
        blue = color_cycles / duration

        # Green
        GPIO.output(self.color_s2, GPIO.HIGH)
        GPIO.output(self.color_s3, GPIO.HIGH)
        # time.sleep(0.1)

        start = time.time()

        for impulse_count in range(color_cycles):
            GPIO.wait_for_edge(self.color_signal, GPIO.FALLING)

        duration = time.time() - start  # seconds to rn for loop
        green = color_cycles / duration
        
        color_rgb = [int(red), int(green), int(blue)]
        
        return color_rgb

    def is_passing_gate(self):
        while True:
            self.color_sensing()