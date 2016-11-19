from PIL import Image
#from pytesser import *
from pytesseract import *

image_file = '2.png'
im = Image.open(image_file)
text = pytesseract.image_to_string(im)
#text = pytesseract.image_file_to_string(image_file)
#text = pytesseract.image_file_to_string(image_file, graceful_errors=True)
print "=====output=======\n"
print text