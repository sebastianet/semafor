import cv2
print "### CV2 version I have is " + cv2.__version__

import sys
print "### SYS version I have is " + str(sys.version_info[0]) + "." + str(sys.version_info[1]) + "." + str(sys.version_info[2])

# Abans de engegar, fer "export DISPLAY=:0" o "export DISPLAY=192.168.1.36:0.0"
# La sortida es cap al HDMI o cap el Xming al W500 

# 0 = primera webcam
cap = cv2.VideoCapture(0)
if not cap:
    print '--- no trobo la webcam'
    sys.exit(1)

while(cap.isOpened()):

    ret, frame = cap.read()

#    imggray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#    cv2.imshow('webcam', imggray)

    cv2.imshow('webcam', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        print '>>> adeu'
        break

cap.release()
cv2.destroyAllWindows()
