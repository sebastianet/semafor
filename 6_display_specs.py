import numpy as np 
print "### NUMPY version I have is " + np.__version__

import cv2
print "### openCV version I have is " + cv2.__version__

# to debug this code, use
#      python  -m pdb  name.py

print '>>> do VideoCapture()'
cap = cv2.VideoCapture( 0 )                     # "video source selection" window comes up
if not cap:
    print '--- no trobo la webcam'
    sys.exit(1)

print '>>> Create a window using namedWindow()'
cv2.namedWindow( "camera", 0 )                  # cv2.WINDOW_AUTOSIZE - use cv2.WINDOW_NORMAL to be able to resize window
cv2.waitKey( 2000 )

if not cap.isOpened() :

    print '>>> do VideoCapture::open()'             # http://docs.opencv.org/2.4/modules/highgui/doc/reading_and_writing_images_and_video.html
    bRC = cap.open( 0 )                             # "video source selection" window comes up
    print '+++ open() bRC is (' + str(bRC) + ').'

# try using own values
# print '>>> set W 320, H 240.'
# cap.set( 3, 640 )     # 1280 1024 800 640 320
# cap.set( 4, 480 )     # 1024  800 600 480 240
# cv2.waitKey( 3000 )

while( cap.isOpened() ):
    
    # Capture frame-by-frame
    print '>>> Capture frame-by-frame using cap.read()'
    ret, frame = cap.read()  # VideoCapture::read returns a Boolean and a Numpy

    if ret:     # proceed only if we have a frame

        # first, display some frame values
        
        frW = int ( cap.get(3) ) # width, float to integer  - 640 fixe
        frH = int ( cap.get(4) ) # height, float to integer - 480 fixe
        frC = int ( cap.get(7) ) # CV_CAP_PROP_FRAME_COUNT "7" - see http://docs.opencv.org/2.4/modules/highgui/doc/reading_and_writing_images_and_video.html
        print '+++ got frame num (' + str(frC) + '), width (' + str(frW) + '), height (' + str(frH) + ').'
        
        print 'Size {' + str(frame.size) + '}, type {' + str(frame.dtype) + '}, shape {' + str(frame.shape) + '}.'

        for x in range( 0, 19 ) :
            frINT = int ( cap.get( x ) ) ;
            print "Idx (%2d) is (%d)." % (x, frINT )        

        # w500 : WxH 640x480, Size 921600, type uint8.
        # Modify it to 320x240 : ret = cap.set(3,320) and ret = cap.set(4,240)
            
        # last, display the resulting frame
    
        print '>>> Display resulting frame with imShow()'

        cv2.imshow( "camera", frame )  # This function should be followed by waitKey function for specified milliseconds. Otherwise, it won't display the image.
        
        cv2.waitKey( 5000 )            # wait 5 sg
        
    else:
        print '--- VideoCapture::read no ha anat be'

    print '>>> Done - exit.'
    break  # in case we write to a file
        
    if cv2.waitKey( 10 ) & 0xFF == ord( 'q' ):
        break

print '>>> CAP not Opened() - exit.'

# When everything done, release the capture
cap.release()                                # close the already opened camera

cv2.destroyAllWindows()

#  0. CV_CAP_PROP_POS_MSEC       Current position of the video file in milliseconds.
#  1. CV_CAP_PROP_POS_FRAMES     0-based index of the frame to be decoded/captured next.
#  2. CV_CAP_PROP_POS_AVI_RATIO  Relative position of the video file
#  3. CV_CAP_PROP_FRAME_WIDTH    Width of the frames in the video stream.
#  4. CV_CAP_PROP_FRAME_HEIGHT   Height of the frames in the video stream.
#  5. CV_CAP_PROP_FPS            Frame rate.
#  6. CV_CAP_PROP_FOURCC         4-character code of codec.
#  7. CV_CAP_PROP_FRAME_COUNT    Number of frames in the video file.
#  8. CV_CAP_PROP_FORMAT         Format of the Mat objects returned by retrieve() .
#  9. CV_CAP_PROP_MODE           Backend-specific value indicating the current capture mode.
# 10. CV_CAP_PROP_BRIGHTNESS     Brightness of the image (only for cameras).
# 11. CV_CAP_PROP_CONTRAST       Contrast of the image (only for cameras).
# 12. CV_CAP_PROP_SATURATION     Saturation of the image (only for cameras).
# 13. CV_CAP_PROP_HUE            Hue of the image (only for cameras).
# 14. CV_CAP_PROP_GAIN           Gain of the image (only for cameras).
# 15. CV_CAP_PROP_EXPOSURE       Exposure (only for cameras).
# 16. CV_CAP_PROP_CONVERT_RGB    Boolean flags indicating whether images should be converted to RGB.
# 17. CV_CAP_PROP_WHITE_BALANCE  Currently unsupported
# 18. CV_CAP_PROP_RECTIFICATION  Rectification flag for stereo cameras (note: only supported by DC1394 v 2.x backend currently)

