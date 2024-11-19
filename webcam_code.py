import cv2
import ollama

# Open the webcam
# cap = cv2.VideoCapture(0)

# # Capture a frame
# ret, frame = cap.read()
# print("finished Image capture")

# # Save the image
# cv2.imwrite('image.jpg', frame)
# print("Wrote image to a file")

# cap.release()
# print("asking llama")

response = ollama.chat(
    model='llama3.2-vision',
    messages=[{
        'role': 'user',
        'content': 'What is in this image?',
        'images': ['image.jpg']
    }]
)

print(response)

