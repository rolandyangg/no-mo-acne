import os
from clarifai.rest import ClarifaiApp
from flask import Flask, request, render_template

myAI = ClarifaiApp(api_key=os.environ['decc6840c2984eedafb77262b5382802'])
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('/index.html', len=0)

