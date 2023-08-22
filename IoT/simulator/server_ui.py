# -*- coding: utf-8 -*-

################################################################################
## Form generated from reading UI file 'server.ui'
##
## Created by: Qt User Interface Compiler version 6.4.2
##
## WARNING! All changes made in this file will be lost when recompiling UI file!
################################################################################

from PySide2.QtCore import (QCoreApplication, QDate, QDateTime, QLocale,
    QMetaObject, QObject, QPoint, QRect,
    QSize, QTime, QUrl, Qt)
from PySide2.QtGui import (QBrush, QColor, QConicalGradient, QCursor,
    QFont, QFontDatabase, QGradient, QIcon,
    QImage, QKeySequence, QLinearGradient, QPainter,
    QPalette, QPixmap, QRadialGradient, QTransform)
from PySide2.QtWidgets import (QApplication, QGroupBox, QMainWindow, QMenuBar,
    QPushButton, QSizePolicy, QStatusBar, QWidget)

class Ui_MainWindow(object):
    def setupUi(self, MainWindow):
        if not MainWindow.objectName():
            MainWindow.setObjectName(u"MainWindow")
        MainWindow.resize(800, 600)
        self.centralwidget = QWidget(MainWindow)
        self.centralwidget.setObjectName(u"centralwidget")
        self.groupBox = QGroupBox(self.centralwidget)
        self.groupBox.setObjectName(u"groupBox")
        self.groupBox.setGeometry(QRect(200, 150, 491, 361))
        self.btn_up = QPushButton(self.groupBox)
        self.btn_up.setObjectName(u"btn_up")
        self.btn_up.setGeometry(QRect(300, 160, 81, 71))
        self.btn_left = QPushButton(self.groupBox)
        self.btn_left.setObjectName(u"btn_left")
        self.btn_left.setGeometry(QRect(210, 250, 81, 71))
        self.btn_right = QPushButton(self.groupBox)
        self.btn_right.setObjectName(u"btn_right")
        self.btn_right.setGeometry(QRect(390, 250, 81, 71))
        self.btn_down = QPushButton(self.groupBox)
        self.btn_down.setObjectName(u"btn_down")
        self.btn_down.setGeometry(QRect(300, 250, 81, 71))
        self.btn_shift = QPushButton(self.groupBox)
        self.btn_shift.setObjectName(u"btn_shift")
        self.btn_shift.setGeometry(QRect(20, 170, 81, 71))
        self.btn_ctrl = QPushButton(self.groupBox)
        self.btn_ctrl.setObjectName(u"btn_ctrl")
        self.btn_ctrl.setGeometry(QRect(20, 250, 81, 71))
        self.btn_socket_connect = QPushButton(self.centralwidget)
        self.btn_socket_connect.setObjectName(u"btn_socket_connect")
        self.btn_socket_connect.setGeometry(QRect(360, 60, 161, 61))
        self.btn_start_signal = QPushButton(self.centralwidget)
        self.btn_start_signal.setObjectName(u"btn_start_signal")
        self.btn_start_signal.setGeometry(QRect(540, 60, 121, 61))
        MainWindow.setCentralWidget(self.centralwidget)
        self.menubar = QMenuBar(MainWindow)
        self.menubar.setObjectName(u"menubar")
        self.menubar.setGeometry(QRect(0, 0, 800, 26))
        MainWindow.setMenuBar(self.menubar)
        self.statusbar = QStatusBar(MainWindow)
        self.statusbar.setObjectName(u"statusbar")
        MainWindow.setStatusBar(self.statusbar)

        self.retranslateUi(MainWindow)
        self.btn_up.clicked.connect(MainWindow.keyUp)
        self.btn_down.clicked.connect(MainWindow.keyDown)
        self.btn_left.clicked.connect(MainWindow.keyLeft)
        self.btn_right.clicked.connect(MainWindow.keyRight)
        self.btn_shift.clicked.connect(MainWindow.keyShift)
        self.btn_ctrl.clicked.connect(MainWindow.keyCtrl)
        self.btn_socket_connect.clicked.connect(MainWindow.socketConnect)
        self.btn_start_signal.clicked.connect(MainWindow.startSignal)

        QMetaObject.connectSlotsByName(MainWindow)
    # setupUi

    def retranslateUi(self, MainWindow):
        MainWindow.setWindowTitle(QCoreApplication.translate("MainWindow", u"MainWindow", None))
        self.groupBox.setTitle(QCoreApplication.translate("MainWindow", u"Key Event", None))
        self.btn_up.setText(QCoreApplication.translate("MainWindow", u"Up", None))
        self.btn_left.setText(QCoreApplication.translate("MainWindow", u"Left", None))
        self.btn_right.setText(QCoreApplication.translate("MainWindow", u"Right", None))
        self.btn_down.setText(QCoreApplication.translate("MainWindow", u"Down", None))
        self.btn_shift.setText(QCoreApplication.translate("MainWindow", u"Shift", None))
        self.btn_ctrl.setText(QCoreApplication.translate("MainWindow", u"Ctrl", None))
        self.btn_socket_connect.setText(QCoreApplication.translate("MainWindow", u"Socket Connect", None))
        self.btn_start_signal.setText(QCoreApplication.translate("MainWindow", u"Start Signal", None))
    # retranslateUi

