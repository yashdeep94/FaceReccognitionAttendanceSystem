import cv2

cap=cv2.VideoCapture(0)

count = 0
while True:
    ret,test_img=cap.read()
    if not ret :
        continue
    # save frame as JPG file
    cv2.imwrite("frame%d.jpg" % count, test_img)
    count += 1
    resized_img = cv2.resize(test_img, (1000, 700))
    cv2.imshow('face detection Tutorial ',resized_img)
    #wait until 'q' key is pressed
    if cv2.waitKey(10) == ord('q'):
        break


cap.release()
cv2.destroyAllWindows
