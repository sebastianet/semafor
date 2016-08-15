import numpy
# print "### NUMPY version I have is " + numpy.__version__

import cv2
# print "### CV2 version I have is " + cv2.__version__

# to debug this code, use
#      python  -m pdb  3-v-en-color.py

# Fer una foto amb la webcam i posar-la en un fitxer.
# Es crida des "1_sem.js"
# Imprimim el nom del fitxer que sera el parametre de tornada
# No imprimim res mes

import time
timestr = time.strftime("%Y%m%d_%H%M%S")
# print timestr

szShortFN = 'webcam_' + timestr + '.png' 
# print 'Filename (' + szShortFN + ').'

szFN = '/home/pi/semafor/public/images/webcam/' + szShortFN 
# print 'Large Filename (' + szFN + ').'

# print '>>> do VideoCapture()'
cap = cv2.VideoCapture( 0 ) 
if not cap:
    print '--- no trobo la webcam'
    sys.exit(1)

if not cap.isOpened() :
#     print '>>> do VideoCapture::open()'             # http://docs.opencv.org/2.4/modules/highgui/doc/reading_and_writing_images_and_video.html
    bRC = cap.open( 0 )
#     print '+++ open() bRC is (' + str(bRC) + ').'

# try using own values
# print '>>> set W 320, H 240.'
# cap.set( 3, 640 )     # 1280 1024 800 640 320
# cap.set( 4, 480 )     # 1024  800 600 480 240
# cv2.waitKey( 3000 )

if ( cap.isOpened() ):
    
#     print '>>> Capture a frame using cap.read()'
    ret, frame = cap.read()  # VideoCapture::read returns a Boolean and a Numpy

    if ret:     # proceed only if we have a frame

        # first, display some frame values
        
        frC = 0
        frW = int ( cap.get(3) ) # width, float to integer  - 640 fixe
        frH = int ( cap.get(4) ) # height, float to integer - 480 fixe
#        frC = int ( cap.get(7) ) # CV_CAP_PROP_FRAME_COUNT "7" - see http://docs.opencv.org/2.4/modules/highgui/doc/reading_and_writing_images_and_video.html
#         print '+++ got frame num (' + str(frC) + '), width (' + str(frW) + '), height (' + str(frH) + ').'
        
#         print 'Size {' + str(frame.size) + '}, type {' + str(frame.dtype) + '}, shape {' + str(frame.shape) + '}.'

        cv2.waitKey(500)                # wait 500 ms

#         print '>>> Write frame into file (' + szFN + ') using imWrite()'
        print szFN
        cv2.imwrite ( szFN, frame )
        
    else:
        print '--- VideoCapture::read no ha anat be'

# print '>>> exit.'

# When everything done, release the capture
cap.release()                                # close the already opened camera

