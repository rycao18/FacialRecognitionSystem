#!/usr/bin/python
import cv2
import os,sys
import math


def getFace(imgPath, cPath):
    image = cv2.imread(imgPath)
    # Create the haar cascade
    faceCascade = cv2.CascadeClassifier(cPath)
    # Read the image
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # Detect faces in the image
    faces = faceCascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30), flags = cv2.cv.CV_HAAR_SCALE_IMAGE)
    area = [0,0]
    for i in faces:
        if i[2]*i[3] > area[1]:
            area[1] = i[2]*i[3]
            area[0] = i
    return faces[0]#area[0]
def getEyes(imgPath, cPath, face):
    image = cv2.imread(imgPath)
    # Create the haar cascade
    eyeCascade = cv2.CascadeClassifier(cPath)
    # Read the image
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    roi = gray[face[1]:face[1]+face[3], face[0]:face[0]+face[2]]
    
    left_roi = gray[face[1]: int(face[1]+(.6)*face[3]), face[0]:int(face[0]+(.5)*face[2])]
    right_roi = gray[face[1]: int(face[1]+face[3]*(.6)), int(face[0]+(.5)*face[2]):int(face[0]+face[2])]
    # Detect faces in the image
    leyes = eyeCascade.detectMultiScale(left_roi)
    leyes = leyes[0].tolist()
    reyes = eyeCascade.detectMultiScale(right_roi)
    reyes = reyes[0].tolist()
    reyes[0] += int(face[2]*0.5)
    
    teyes = [leyes,reyes]
    return teyes
def getNose(imgPath, cPath, face, eyes, bridge):
    image = cv2.imread(imgPath)
    
    # Create the haar cascade
    noseCascade = cv2.CascadeClassifier(cPath)
    # Read the image
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    roi = gray[face[1]+bridge[1]:face[1]+int((face[3]+bridge[1])/1.8), face[0]+eyes[0][0]:face[0]+eyes[1][0]+eyes[1][2]]
    nose = noseCascade.detectMultiScale(roi)[0]
    return nose
    
def findCenter(array):
    centers = []
    for i in array:
        x = int(i[0] + (.5)*(i[2]))
        y = int(i[1] + (.5)*(i[3]))
        centers.append([x,y])
    return centers
    
#finds the center between eyes. this is the bridge of nose position
def findBridge(center_eye):
    bridge_x = (center_eye[0][0] + center_eye[1][0])/2
    bridge_y = (center_eye[0][1]+center_eye[1][1])/2
    return [bridge_x,bridge_y]
   
def imgInfo(imgDirectory): 
    eyedis = []
    left_eyewidth = []
    right_eyewidth = []
    noseheight = []
    for imgDir in imgDirectory:
        faces = getFace(imgDir, "./faceclassifier.xml")
        eyes = getEyes(imgDir, "./eyeclassifier.xml", faces)
        image = open(imgDir)
        center_eyes = findCenter(eyes)
        bridge = findBridge(center_eyes)
        nose = getNose(imgDir, "./noseclassifier2.xml", faces, eyes, bridge)
        center_nose = findCenter([nose])[0]
        eyedis.append(abs(math.sqrt(abs(center_eyes[1][0]-center_eyes[0][0])**2+abs(center_eyes[1][1]-center_eyes[0][1])**2))/faces[2])
        left_eyewidth.append((eyes[0][2]+eyes[0][3])/2.0/faces[2])
        right_eyewidth.append((eyes[1][2]+eyes[1][3])/2.0/faces[2])
        noseheight.append(math.sqrt(abs(center_nose[0]-bridge[0])**2+abs(center_nose[1]-bridge[1])**2)/faces[3])
        
    ret1 = (eyedis[0]+eyedis[1]+eyedis[2]+eyedis[3]+eyedis[4])/5.0
    ret2 = (left_eyewidth[0]+left_eyewidth[1]+left_eyewidth[2]+left_eyewidth[3]+left_eyewidth[4])/5.0
    ret3 = (right_eyewidth[0]+right_eyewidth[1]+right_eyewidth[2]+right_eyewidth[3]+right_eyewidth[4])/5.0
    ret4 = (noseheight[0]+noseheight[1]+noseheight[2]+noseheight[3]+noseheight[4])/5.0
    print str(ret1)+","+str(ret2)+","+str(ret3)+","+str(ret4)

#for (x, y
#    cv2.rectangle(image, (x, y), (x+w, y+h), (0, 255, 0), 2)
#cv2.imshow("Faces found" ,image)
#cv2.waitKey(0)
total = sys.argv[1:6]
imgInfo(total)

#image = sys.stdin.read()
