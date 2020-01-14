from flask import Flask
import os

app = Flask(__name__, static_folder='./build', static_url_path='/')

@app.route('/')
def index():
    return app.send_static_file('index.html')
    
if __name__ == '__main__':
    app.run(port=8765, use_reloader=True)