import cv2

cap = cv2.VideoCapture(0)  # Try index 0, 1, 2, etc.
ret, frame = cap.read()
print("finished Image capture")

# Save the image
cv2.imwrite('Test_image.jpg', frame)
cap.release()
cv2.destroyAllWindows()
