import cv2 


def predict():

    cv2.waitKey(1)
    cap=cv2.VideoCapture(0)
    while True:

        imgshirt = cv2.imread('shirt1.png',1) #original img in bgr
        shirtgray = cv2.cvtColor(imgshirt,cv2.COLOR_BGR2GRAY) #grayscale conversion
        ret, orig_masks = cv2.threshold(shirtgray,0 , 255, cv2.THRESH_BINARY) #there may be some issues with image threshold...depending on the color/contrast of image
        orig_masks_inv = cv2.bitwise_not(orig_masks)
        origshirtHeight, origshirtWidth = imgshirt.shape[:2]

        face_cascade=cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

        ret,img=cap.read()
       
        height = img.shape[0]
        width = img.shape[1]
        resizewidth = int(width*3/2)
        resizeheight = int(height*3/2)
        cv2.namedWindow("img",cv2.WINDOW_NORMAL)
        cv2.resizeWindow("img", (int(width*3/2), int(height*3/2)))
        gray=cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
        faces=face_cascade.detectMultiScale(gray,1.3,5)

        for (x,y,w,h) in faces:
            cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)
            cv2.rectangle(img,(x+w+50,y+h),(x-50,y+h+400),(255,255,255),2)

            #..................SHIRT...................

            shirtWidth =  3 * w  #approx wrt face width
            shirtHeight = shirtWidth * origshirtHeight / origshirtWidth #preserving aspect ratio of original image..
            # Center the shirt.
            x1s = x-w
            x2s =x1s+3*w
            y1s = y+h
            y2s = y1s+h*4
            # Check for clipping(whether x1 is coming out to be negative or not..)

            if x1s < 0:
                x1s = 0
            if x2s > img.shape[1]:
                x2s =img.shape[1]
            if y2s > img.shape[0] :
                y2s =img.shape[0]
            temp=0
            if y1s>y2s:
                temp=y1s
                y1s=y2s
                y2s=temp
            
            # Re-calculate the width and height of the shirt image(to resize the image when it would be pasted)
            shirtWidth = int(abs(x2s - x1s))
            shirtHeight = int(abs(y2s - y1s))
            y1s = int(y1s)
            y2s = int(y2s)
            x1s = int(x1s)
            x2s = int(x2s)
            
            # Re-size the original image and the masks to the shirt sizes
            shirt = cv2.resize(imgshirt, (shirtWidth,shirtHeight), interpolation = cv2.INTER_AREA) #resize all,the masks you made,the originla image,everything
            mask = cv2.resize(orig_masks, (shirtWidth,shirtHeight), interpolation = cv2.INTER_AREA)
            masks_inv = cv2.resize(orig_masks_inv, (shirtWidth,shirtHeight), interpolation = cv2.INTER_AREA)
            # take ROI for shirt from background equal to size of shirt image
            rois = img[y1s:y2s, x1s:x2s]
                # roi_bg contains the original image only where the shirt is not
                # in the region that is the size of the shirt.
            num=rois
            roi_bgs = cv2.bitwise_and(rois,num,mask = masks_inv)
            # roi_fg contains the image of the shirt only where the shirt is
            roi_fgs = cv2.bitwise_and(shirt,shirt,mask = mask)
            # join the roi_bg and roi_fg
            dsts = cv2.add(roi_bgs,roi_fgs)
            img[y1s:y2s, x1s:x2s] = dsts # place the joined image, saved to dst back over the original image
            # print "blurring"
            
            break
        cv2.imshow("img",img)
        if cv2.waitKey(100) == ord('q'):
            break

    cap.release()                           
    cv2.destroyAllWindows()                 


predict()
