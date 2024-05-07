from flask import Flask, render_template, request
import json
from flask_cors import CORS
import numpy as np
import cv2 
from math import floor
from flask_socketio import SocketIO, emit
from io import StringIO, BytesIO
import base64
from PIL import Image
import  cvzone
from minio import Minio
import mediapipe as mp

# BGRA
ALPHA_CHANNEL_IDX = 3

app = Flask(__name__)
# CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# shirtMap = {}
# pantMap = {}

SHIRT_TYPE = 1
PANT_TYPE = 2
SPEC_TYPE = 3

productPathMap = {
    SHIRT_TYPE: './static/assets/shirts/{productNo}.png',
    PANT_TYPE: './static/assets/pants/{productNo}.png',
    SPEC_TYPE: './static/assets/specs/{productNo}.png'
}
# minioUrl = 'localhost:9000'
minioUrl = 'minio:9000'
minioClient = Minio(minioUrl,
    access_key="user",
    secret_key="password",
    secure=False
)

def getMinioProduct(productType, productNo):
    productBucket = 'products'
    fileName = '{productType}/{productNo}'.format(productType=productType, productNo=productNo)
    
    try:
        data = minioClient.get_object(productBucket, fileName)
        return data.read()
    except Exception as e:
        print('Error while fetching product from minio', e)
        return None

# Format:
# (ProductType, ProductNo) -> (ProductImage, ClothMask, NonClothMask)
productMap = {}
 
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5)       
        
def getProduct(productType, productNo):

    tupleKey = (productType, productNo)
    
    if tupleKey in productMap:
        return productMap[tupleKey]
    else:
        productFileLocalPath = productPathMap[productType].format(productNo=productNo)
        productImage = cv2.imread(productFileLocalPath, cv2.IMREAD_UNCHANGED)
        if productImage is None:
            # We try getting it from minio
            
            productImage = getMinioProduct(productType, productNo)
            
            if productImage is None:
                print('Product not found from Minio as well')
                return None
            
            productImage = cv2.imdecode(np.frombuffer(productImage, np.uint8), cv2.IMREAD_UNCHANGED)
            
            
        
        # extract pixels which are non transparent
        clothPixels = productImage[:,:,ALPHA_CHANNEL_IDX] > 0
        clothAreaMasked = np.zeros((productImage.shape[0], productImage.shape[1]), dtype=np.uint8)
        clothAreaMasked[clothPixels] = 255
        nonClothAreaMasked = cv2.bitwise_not(clothAreaMasked)

        productImageWithoutAlpha = productImage[:,:,0:3]
        productMap[tupleKey] = (productImageWithoutAlpha, clothAreaMasked, nonClothAreaMasked)
    
        # cv2.imshow('ProductImage', productImageWithoutAlpha)
        # cv2.imshow('ProductMask', clothAreaMasked)
        # cv2.imshow('ProductNonMask', nonClothAreaMasked)
        # print('Product Shape:', productImage.shape)
        # print('Masked Shape:', clothAreaMasked.shape)
        # print('Non Masked Shape:', nonClothAreaMasked.shape)
        # print('tupleKey', tupleKey)
        # print(productMap[tupleKey])
        
        # cv2.waitKey(0)
        return productMap[tupleKey]

def getPant(pantNo):
    return getProduct(PANT_TYPE, pantNo)   

def getShirt(shirtNo):
    return getProduct(SHIRT_TYPE, shirtNo)

def getSpec(specNo):
    return getProduct(SPEC_TYPE, specNo)

    
def predict(shirtNo, pantNo, specNo,  base64Image, isShirtSelected, isPantSelected, isSpecSelected, isSkeletonShown):

    try:
        sbuf = StringIO()
        sbuf.write(base64Image)

        # decode and convert into image
        b = BytesIO(base64.b64decode(base64Image))
        pimg = Image.open(b)

        ## converting RGB to BGR, as opencv standards
        img = cv2.cvtColor(np.array(pimg), cv2.COLOR_RGB2BGR)

        rgbImg = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        # origshirtHeight, origshirtWidth = shirtImg.shape[:2]
        
        
        # imgarr=["./static/assets/pants/1.png",'./static/assets/pants/2.png']
        #i=input("Enter the pant number you want to try")
        # imgpant = cv2.imread(imgarr[pantNo-1],1)
        # imgpant=imgpant[:,:,0:3]#original img in bgr
        # pantgray = cv2.cvtColor(imgpant,cv2.COLOR_BGR2GRAY) #grayscale conversion
        # if i==1:
        # ret, orig_mask = cv2.threshold(pantgray,100 , 255, cv2.THRESH_BINARY) #there may be some issues with image threshold...depending on the color/contrast of image
        # orig_mask_inv = cv2.bitwise_not(orig_mask)
        # else:
        #     ret, orig_mask = cv2.threshold(pantgray,50 , 255, cv2.THRESH_BINARY)
        #     orig_mask_inv = cv2.bitwise_not(orig_mask)
        # origpantHeight, origpantWidth = imgpant.shape[:2]
        

        face_cascade=cv2.CascadeClassifier('haarcascade_frontalface_default.xml')


        gray=cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
        faces=face_cascade.detectMultiScale(gray,1.3,5)
        
        if len(faces) == 0:
            return base64Image
        
        # Detect skeloton Pose using mediaPipe
        results = pose.process(rgbImg)
        if results.pose_landmarks is None:
            return base64Image
        
        landmarks = results.pose_landmarks.landmark
        
        # draw skeleton on the frame
        mpConnections = mp_pose.POSE_CONNECTIONS
            
        #GET Coordinates of shoulders
        left_shoulder = (int(landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER].x * rgbImg.shape[1]),
                                int(landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER].y * rgbImg.shape[0]))
        right_shoulder = (int(landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER].x * rgbImg.shape[1]),
                            int(landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER].y * rgbImg.shape[0]))

        left_hip = (int(landmarks[mp_pose.PoseLandmark.LEFT_HIP].x * rgbImg.shape[1]),
            int(landmarks[mp_pose.PoseLandmark.LEFT_HIP].y * rgbImg.shape[0]))
        right_hip = (int(landmarks[mp_pose.PoseLandmark.RIGHT_HIP].x * rgbImg.shape[1]),
                        int(landmarks[mp_pose.PoseLandmark.RIGHT_HIP].y * rgbImg.shape[0]))
        
        left_ankle = (int(landmarks[mp_pose.PoseLandmark.LEFT_ANKLE].x * rgbImg.shape[1]),
                        int(landmarks[mp_pose.PoseLandmark.LEFT_ANKLE].y * rgbImg.shape[0]))
        right_ankle = (int(landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE].x * rgbImg.shape[1]),
                        int(landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE].y * rgbImg.shape[0]))
        
        leastLeft = min(left_shoulder[0], right_shoulder[0], left_hip[0], right_hip[0])
        leastTop = min(left_shoulder[1], right_shoulder[1], left_hip[1], right_hip[1])
        maxRight = max(left_shoulder[0], right_shoulder[0], left_hip[0], right_hip[0])
        maxBottom = max(left_shoulder[1], right_shoulder[1], left_hip[1], right_hip[1])  
        
        for (x,y,w,h) in faces:
            
            if(isSkeletonShown):
                cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)    
            
            faceBottomY = y+h
            topMostShoulderY = min(left_shoulder[1], right_shoulder[1])
            
            faceShoulderYMiddle = abs(topMostShoulderY - faceBottomY) // 2
            
            additionFactor = faceShoulderYMiddle
        
            # print('FaceBottomY:', faceBottomY)
            # print('TopMostShoulderY:', topMostShoulderY)
            # print('FaceShoulderYMiddle:', faceShoulderYMiddle)
            # print('AdditionFactor:', additionFactor)
            
            
            if(isSpecSelected):
                # specs are not dynamic right now
                specOverlay = cv2.imread('./static/assets/specs/{specNo}.png'.format(specNo=specNo), cv2.IMREAD_UNCHANGED)
                specOverlayResize = cv2.resize(specOverlay,(w,int(h*0.8)))
                cvzone.overlayPNG(img, specOverlayResize, [x, y])
            

            if(isPantSelected):  
                
                pantTuple = getPant(pantNo)
                if pantTuple is None:
                    print('Pant not found')
                    return base64Image
                
                pantImg = pantTuple[0]
                pantPixels = pantTuple[1]
                nonPantPixels = pantTuple[2]
                
                # if pantNo==1:
                #     pantXLeft = x-w
                #     pantXRight =pantXLeft+3*w
                #     pantYTop = y+5*h
                #     pantYBottom = y+h*10
                # elif pantNo==2:
                #     pantXLeft = x-w/2
                #     pantXRight =pantXLeft+2*w
                #     pantYTop = y+4*h
                #     pantYBottom = y+h*9
                # else :
                
                # OLD DO NOT DELETE
                # pantXLeft = x-w/2
                # pantXRight =pantXLeft+5*w/2
                # pantYTop = y+5*h
                # pantYBottom = y+h*14
                # OLD DO NOT DELETE OVER
                
                pantXLeft  = leastLeft-additionFactor
                pantXRight = maxRight+additionFactor
                pantYTop = min(left_hip[1], right_hip[1])
                pantYBottom = max(left_ankle[1], right_ankle[1])
                
                #two cases:
                """
                close to camera: image will be to big
                so face ke x+w ke niche hona chahiye warna dont render at all
                """
                if pantXLeft < 0:
                    pantXLeft = 0 #top left ke bahar
                if pantXRight > img.shape[1]:
                    pantXRight =img.shape[1] #bottom right ke bahar
                if pantYBottom > img.shape[0] :
                    pantYBottom =img.shape[0] #nichese bahar
                if pantYTop > img.shape[0] :
                    pantYTop =img.shape[0] #nichese bahar
                if pantYTop==pantYBottom:
                    pantYTop=0
                temp=0
                if pantYTop>pantYBottom:
                    temp=pantYTop
                    pantYTop=pantYBottom
                    pantYBottom=temp
                    
                #if face's bottom most coordinate is above the pant's top most coordinate, 
                # then dont render the pant
                if y+h < pantYTop: 
                    # pantYTop = 0
                    # pantYBottom = 0
                
                # Re-calculate the width and height of the pant image(to resize the image when it wud be pasted)
                    pantXLeft = int(pantXLeft)
                    pantXRight = int(pantXRight)
                    pantYTop = int(pantYTop)
                    pantYBottom = int(pantYBottom)
                    pantWidth = int(abs(pantXRight - pantXLeft))
                    pantHeight = int(abs(pantYBottom - pantYTop))
                    #cv2.rectangle(img,(x1,y1),(x2,y2),(255,0,0),2)
                    # Re-size the original image and the masks to the pant sizes
                    
                    # print("pantWidth", pantWidth)
                    # print("pantHeight", pantHeight)
                    # print("pantXLeft", pantXLeft)
                    # print("pantXRight", pantXRight)
                    # print("pantYTop", pantYTop)
                    # print("pantYBottom", pantYBottom)
                    # print("pantImg", pantImg.shape)
                    # print("pantPixels", pantPixels.shape)
                    # print("nonPantPixels", nonPantPixels.shape)
                    
                    pant = cv2.resize(pantImg, (pantWidth,pantHeight), interpolation = cv2.INTER_AREA)
                    pantAreaMask = cv2.resize(pantPixels, (pantWidth,pantHeight), interpolation = cv2.INTER_AREA)
                    nonPantAreaMask = cv2.resize(nonPantPixels, (pantWidth,pantHeight), interpolation = cv2.INTER_AREA)

                    ROIPant = img[pantYTop:pantYBottom, pantXLeft:pantXRight]

                    # print("ROIPant", ROIPant.shape)
                    # print("pant", pant.shape)
                    # print("pantAreaMask", pantAreaMask.shape)
                    # print("nonPantAreaMask", nonPantAreaMask.shape)
                    ROI_nonPantArea = cv2.bitwise_and(ROIPant,ROIPant,mask = nonPantAreaMask)
                    ROI_pantArea = cv2.bitwise_and(pant,pant,mask = pantAreaMask)
                    ROIJointOrigImageNPant = cv2.add(ROI_nonPantArea,ROI_pantArea)
                    
                    img[pantYTop:pantYBottom, pantXLeft:pantXRight] = ROIJointOrigImageNPant
                    
                        # place the joined image, saved to dst back over the original image
                    # top=img[0:y,0:resizewidth]
                    # bottom=img[y+h:resizeheight,0:resizewidth]
                    # midleft=img[y:y+h,0:x]
                    # midright=img[y:y+h,x+w:resizewidth]
                    # blurvalue=5
                    # top=cv2.GaussianBlur(top,(blurvalue,blurvalue),0)
                    # bottom=cv2.GaussianBlur(bottom,(blurvalue,blurvalue),0)
                    # midright=cv2.GaussianBlur(midright,(blurvalue,blurvalue),0)
                    # midleft=cv2.GaussianBlur(midleft,(blurvalue,blurvalue),0)
                    # img[0:y,0:resizewidth]=top
                    # img[y+h:resizeheight,0:resizewidth]=bottom
                    # img[y:y+h,0:x]=midleft
                    # img[y:y+h,x+w:resizewidth]=midright
                    
                    img[pantYTop:pantYBottom, pantXLeft:pantXRight] = ROIJointOrigImageNPant


            if(isShirtSelected):
                
                shirtTuple = getShirt(shirtNo)
                if shirtTuple is None:
                    print('Shirt not found')
                    return base64Image
                
                shirtImg = shirtTuple[0]
                shirtPixels = shirtTuple[1]
                nonShirtPixels = shirtTuple[2]
                
                # shirtWidth =  3 * w  #approx wrt face width
                # shirtHeight = shirtWidth * origshirtHeight / origshirtWidth #preserving aspect ratio of original image..
                
                # print("HELLO HELLO")
                # Center the shirt..just random calculations..
                
                # OLD DO NOT DELETE
                # shirtXLeft = x-w
                # shirtXRight =shirtXLeft+3*w
                # shirtYTop = y+h
                # shirtYBottom = shirtYTop+h*4
                # OLD DO NOT DELETE OVER
                
                # NEW MP LOGIC
                facehoulderMidpoint = leastTop-2*additionFactor
                shirtYTop = min(facehoulderMidpoint, min(left_shoulder[1], right_shoulder[1]))
                shirtYBottom = maxBottom+2*additionFactor
                shirtXLeft = leastLeft-2*additionFactor
                shirtXRight = maxRight+2*additionFactor
                
                # print(f'shirtYTop: {shirtYTop}, shirtYBottom: {shirtYBottom}, shirtXLeft: {shirtXLeft}, shirtXRight: {shirtXRight}')
                # NEW MP LOGIC OVER
                
                # Check for clipping(whetehr x1 is coming out to be negative or not..)

                if shirtXLeft < 0:
                    shirtXLeft = 0
                if shirtXRight > img.shape[1]:
                    shirtXRight =img.shape[1]
                if shirtYBottom > img.shape[0] :
                    shirtYBottom =img.shape[0]
                temp=0
                if shirtYTop>shirtYBottom:
                    temp=shirtYTop
                    shirtYTop=shirtYBottom
                    shirtYBottom=temp

                
                shirtYTop = int(shirtYTop)
                shirtYBottom = int(shirtYBottom)
                shirtXLeft = int(shirtXLeft)
                shirtXRight = int(shirtXRight)
                shirtWidth = int(abs(shirtXRight - shirtXLeft))
                shirtHeight = int(abs(shirtYBottom - shirtYTop))

                # Re-size the original image and the masks to the shirt sizes
                shirt = cv2.resize(shirtImg, (shirtWidth,shirtHeight), interpolation = cv2.INTER_AREA)
                shirtAreaMask = cv2.resize(shirtPixels, (shirtWidth,shirtHeight), interpolation = cv2.INTER_AREA)
                nonShirtAreaMask = cv2.resize(nonShirtPixels, (shirtWidth,shirtHeight), interpolation = cv2.INTER_AREA)
                
                # cv2.imshow('ShirtResized', shirt)
                # cv2.imshow('ShirtMaskResized', shirtAreaMask)
                # cv2.imshow('NonShirtMaskResized', nonShirtAreaMask)
                
                # cv2.waitKey(0)
                
                # print("MUAHAHAHA")
                
                ROIShirt = img[shirtYTop:shirtYBottom, shirtXLeft:shirtXRight]
                # print("ROIShirt", ROIShirt.shape)
                # print("shirt", shirt.shape)
                # print("shirtAreaMask", shirtAreaMask.shape)
                # print("nonShirtAreaMask", nonShirtAreaMask.shape)
                # cv2.waitKey(0)
                ROI_nonShirtArea = cv2.bitwise_and(ROIShirt,ROIShirt,mask = nonShirtAreaMask)

                ROI_shirtArea = cv2.bitwise_and(shirt,shirt,mask = shirtAreaMask)

                ROIJointOrigImageNShirt = cv2.add(ROI_nonShirtArea,ROI_shirtArea)
                img[shirtYTop:shirtYBottom, shirtXLeft:shirtXRight] = ROIJointOrigImageNShirt # place the joined image, saved to dst back over the original image

            
            
            break
            

        if(isSkeletonShown):
            for connection in mpConnections:
                start_point = (int(landmarks[connection[0]].x * rgbImg.shape[1]),
                            int(landmarks[connection[0]].y * rgbImg.shape[0]))
                end_point = (int(landmarks[connection[1]].x * rgbImg.shape[1]),
                            int(landmarks[connection[1]].y * rgbImg.shape[0]))
                cv2.line(img, start_point, end_point, (0, 255, 0), 2)
                
            
            cv2.circle(img, right_shoulder, 5, (0, 0, 255), -1)
            cv2.circle(img, left_shoulder, 5, (0, 0, 255), -1)
            cv2.circle(img, left_hip, 5, (0, 0, 255), -1)
            cv2.circle(img, right_hip, 5, (0, 0, 255), -1)
        
            
        imgencode = cv2.imencode('.jpg', img)[1]
        stringData = base64.b64encode(imgencode).decode('utf-8')
        return stringData
    except Exception as e:
        print('Error in prediction')
        return base64Image

@socketio.on('videoFrameRaw')
def handleFromFromFe(data, shirtno, pantno, specNo, isShirtSelected, isPantSelected, isSpecSelected, isSkeletonShown, sessionId):
    
    sessionIdStr = str(sessionId)
    processedFrame = predict(shirtno, pantno, specNo, data, isShirtSelected, isPantSelected, isSpecSelected, isSkeletonShown)
    emit('videoFrameProcessed', (processedFrame, sessionIdStr))

@socketio.on('PING')
def handlerPing(sessionId):
    print('PING received at streamer')
    sessionIdStr = str(sessionId)
    emit('PONG', sessionIdStr)


def serverRun():
    socketio.run(app, host='0.0.0.0',debug=True,port=5000, allow_unsafe_werkzeug=True)
    
def manualRun():
    camera = cv2.VideoCapture(0)
    
    while True:
        ret, frame = camera.read()
        
        frameencode = cv2.imencode('.jpg', frame)[1]
        frameBase64 = base64.b64encode(frameencode).decode('utf-8')
        
        base64FrameProcessed = predict(1, 2, 1, frameBase64, True, True, False, False)
        
        processedFrame = cv2.imdecode(np.frombuffer(base64.b64decode(base64FrameProcessed), np.uint8), cv2.IMREAD_COLOR)
        
        # show the frame
        cv2.imshow("Frame", processedFrame)
        
        # stop on 'q' key
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
        

def showImage():
    
    img = cv2.imread('./static/assets/shirts/shirt1.png', cv2.IMREAD_UNCHANGED)
    print(img)
    print(img.shape)
    
    # extract pixels which are non transparent
    clothPixels = img[:,:,3] > 0
    nonClothPixels = img[:,:,3] == 0
    
    greenBg = np.zeros((img.shape[0], img.shape[1], 4), dtype=np.uint8)
    greenBg[:] = (0, 255, 0, 1)
    
    # apply mask
    greenBg[clothPixels] = img[clothPixels]
    
    redBg = np.zeros((img.shape[0], img.shape[1], 4), dtype=np.uint8)
    redBg[:] = (0, 0, 255, 1)
    redBg[nonClothPixels] = img[nonClothPixels]
    
    
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    ret, clothMask = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY)
    ret, clothMaskInv = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV)
    
    cv2.imshow('Image', img)
    cv2.imshow('Mask', clothMask)
    cv2.imshow('MaskInv', clothMaskInv)
    
    cv2.imshow('GreenImage', greenBg)
    cv2.imshow('RedImage', redBg)
    cv2.waitKey(0)
    
    
    
    # RETR_FLOODFILL
    # img = cv2.imread('./static/assets/shirt6.png')
    # gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # ret, thresh = cv2.threshold(gray, 127, 255, 0)
    
    # #adaptive thresholding
    # thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 3, 2)
    
    
    
    # contours, hierarchy = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    
    # biggestContour = max(contours, key=cv2.contourArea)
    
    # print(len(contours))
    # print(len(hierarchy))
    
    # draw biggest contour
    # cv2.drawContours(img, [biggestContour], -1, (0, 255, 0), thickness=cv2.FILLED)
    
    
    # for i in range(len(contours)):
    #     # cv2.drawContours(img, contours, i, (0, 255, 0), 3)
    #     cv2.drawContours(img, contours, -1, color=(0, 255, 0), thickness=cv2.FILLED)
    #     break
        
    #     # floofill the countours
        # cv2.floodFill(img, None, (0, 0), (0, 255, 0))
        
    # cv2.imshow('Contours', img)
    # cv2.waitKey(0)
    
if __name__ == '__main__':
    # check cmd args
    import sys
    if len(sys.argv) > 1:
        if sys.argv[1] == 'manual':
            manualRun()
        elif sys.argv[1] == 'server':
            serverRun()
        elif sys.argv[1] == 'image':
            showImage()
    else:
        serverRun()