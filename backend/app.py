from flask import Flask

app = Flask(__name__)


#TODO: direct to search page
@app.route('/')
def hello():
    return 'Hello, World!'


#TODO: main function to run the code to get the information we need. We can use auxillary functions, but this function returns all the information the animal page will use including the data.
@app.route('/animal/<animal_name>')
def animal_search(animal_name):
    
