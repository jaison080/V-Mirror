# from flask import Flask, render_template, request
# import json
# from flask_cors import CORS
import numpy as np
import cv2 
# from math import floor


def predict():

    cv2.waitKey(1)
    cap=cv2.VideoCapture(0)
    while True:

        face_cascade=cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

        ret,img=cap.read()
       
        height = img.shape[0]
        width = img.shape[1]
        #img = cv2.resize(img[:,:,0:3],(1000,1000), interpolation = cv2.INTER_AREA)
        cv2.namedWindow("img",cv2.WINDOW_NORMAL)
        # cv2.setWindowProperty('img',cv2.WND_PROP_FULLSCREEN,cv2.cv.CV_WINDOW_FULLSCREEN)
        cv2.resizeWindow("img", (int(width*3/2), int(height*3/2)))
        gray=cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
        faces=face_cascade.detectMultiScale(gray,1.3,5)

        for (x,y,w,h) in faces:
            cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)
            cv2.rectangle(img,(x+w+50,y+h),(x-50,y+h+400),(255,255,255),2)            
            break
        cv2.imshow("img",img)
        if cv2.waitKey(100) == ord('q'):
            break

    cap.release()                           
    cv2.destroyAllWindows()   


predict()
