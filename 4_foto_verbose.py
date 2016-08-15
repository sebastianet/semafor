#! /usr/bin/env python

import numpy
print "### NUMPY version I have is " + numpy.__version__

import cv2
print "### OPENCV version I have is " + cv2.__version__

# Fer una foto amb la webcam i posar-la en un fitxer.
# Canviem els parametres i mostrem els resultants

# Documentacio
#     http://docs.opencv.org/2.4/modules/highgui/doc/reading_and_writing_images_and_video.html

# to debug this code, use
#      python  -m pdb  3-v-en-color.py

import time
timestr = time.strftime("%Y%m%d_%H%M%S")
print timestr

szShortFN = 'webcam_' + timestr + '.jpeg' 
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
    sys.stderr.write('could not connect to camera! \n')
    sys.exit(1)

    print '>>> do VideoCapture::open()'  
    bRC = cap.open( 0 )
    print '+++ open() bRC is (' + str(bRC) + ').'

# try using own values
iW = 320
iH = 240

print '>>> set Width ('+ str(iW) +'), H ('+ str(iH) +').'
cap.set( cv2.cv.CV_CAP_PROP_FRAME_WIDTH, iW )     # 1280 1024 800 640 320
cap.set( cv2.cv.CV_CAP_PROP_FRAME_HEIGHT, iH )    # 1024  800 600 480 240
cv2.waitKey( 3000 )

# 1_sem.js uses 320 x 240 ;
# Logitech + 800 x 600 -> width (640), height (480)

if ( cap.isOpened() ):
    
    for count in range(0,5):

        print '>>> ('+ str(count) +') Capture a frame using cap.read()'
        ret, frame = cap.read()  # VideoCapture::read returns a Boolean and a Numpy

        if ret:     # proceed only if we have a frame

            # first, display some frame values
        
            frC = 0
            frW = int ( cap.get(3) ) # width, float to integer  
            frH = int ( cap.get(4) ) # height, float to integer
            # frC = int ( cap.get(7) ) # CV_CAP_PROP_FRAME_COUNT "7"
            print '+++ got frame num (' + str(frC) + '), width (' + str(frW) + '), height (' + str(frH) + ').'
            
            print 'Size {' + str(frame.size) + '}, type {' + str(frame.dtype) + '}, shape {' + str(frame.shape) + '}.'

            cv2.waitKey(200)                # wait N mseg

            if ( count == 4 ):
                print '>>> Write frame into file (' + szFN + ') using imWrite()'
                cv2.imwrite ( szFN, frame )

                # cv2.imwrite ( szFN, frame, [cv2.cv.CV_IMWRITE_PNG_COMPRESSION, 0] )
                # cv2.imwrite ( szFN, frame, [cv2.cv.CV_IMWRITE_JPEG_QUALITY, 50] )
       
        else:
            print '--- VideoCapture::read no ha anat be'

print '>>> exit.'

# When everything done, release the capture
cap.release()                                # close the already opened camera

