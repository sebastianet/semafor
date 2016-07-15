import cv2
import sys

# 0 = primera webcam
cap = cv2.VideoCapture(0)
if not cap:
    print 'no trobo la webcam'
    sys.exit(1)

while(cap.isOpened()):

    ret, frame = cap.read()

#    imggray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#    cv2.imshow('webcam', imggray)

    cv2.imshow('webcam', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        print 'adeu'
        break

cap.release()
cv2.destroyAllWindows()
