import numpy
print "### NUMPY version I have is " + numpy.__version__

import cv2
print "### CV2 version I have is " + cv2.__version__

# to debug this code, use
#      python  -m pdb  3-v-en-color.py

# Fer una foto amb la webcam i posar-la en un fitxer.
# Canviem els parametres i mostrem els resultants

import time
timestr = time.strftime("%Y%m%d_%H%M%S")
print timestr

szShortFN = 'webcam_' + timestr + '.png' 
print 'Filename (' + szShortFN + ').'

szFN = '/home/pi/semafor/public/images/webcam/' + szShortFN 
print 'Large Filename (' + szFN + ').'

print '>>> do VideoCapture()'
cap = cv2.VideoCapture( 0 ) 
if not cap:
    print '--- no trobo la webcam'
    sys.exit(1)

if not cap.isOpened() :
    print '>>> do VideoCapture::open()'             # http://docs.opencv.org/2.4/modules/highgui/doc/reading_and_writing_images_and_video.html
    bRC = cap.open( 0 )
    print '+++ open() bRC is (' + str(bRC) + ').'

# try using own values
iW = 800
iH = 600
print '>>> set W ('+ str(iW) +'), H ('+ str(iH) +').'
cap.set( 3, iW )     # 1280 1024 800 640 320
cap.set( 4, iH )     # 1024  800 600 480 240
cv2.waitKey( 3000 )

# Logitech + 800 x 600 -> width (640), height (480)

if ( cap.isOpened() ):
    
    print '>>> Capture a frame using cap.read()'
    ret, frame = cap.read()  # VideoCapture::read returns a Boolean and a Numpy

    if ret:     # proceed only if we have a frame

        # first, display some frame values
        
        frC = 0
        frW = int ( cap.get(3) ) # width, float to integer  - 640 fixe
        frH = int ( cap.get(4) ) # height, float to integer - 480 fixe
        frC = int ( cap.get(7) ) # CV_CAP_PROP_FRAME_COUNT "7" - see http://docs.opencv.org/2.4/modules/highgui/doc/reading_and_writing_images_and_video.html
        print '+++ got frame num (' + str(frC) + '), width (' + str(frW) + '), height (' + str(frH) + ').'
        
        print 'Size {' + str(frame.size) + '}, type {' + str(frame.dtype) + '}, shape {' + str(frame.shape) + '}.'

        cv2.waitKey(500)                # wait 500 ms

        print '>>> Write frame into file (' + szFN + ') using imWrite()'
        cv2.imwrite ( szFN, frame )
        
    else:
        print '--- VideoCapture::read no ha anat be'

print '>>> exit.'

# When everything done, release the capture
cap.release()                                # close the already opened camera

