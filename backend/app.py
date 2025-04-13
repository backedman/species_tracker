from flask import Flask,jsonify
import requests
import json

app = Flask(__name__)


#TODO: direct to search page
@app.route('/')
def hello():
    return 'Hello, World!'


#TODO: main function to run the code to get the information we need. We can use auxillary functions, but this function returns all the information the animal page will use including the data.
@app.route('/animal/<animal_name>')
def animal_search(animal_name):

    pass

@app.route('/image/<taxon_id>')
def get_img(taxon_id):
    url = f'https://api.inaturalist.org/v1/taxa/{taxon_id}?order=desc&order_by=observations_count'
    response = requests.get(url)
    ob = response.json()

    # Handle unexpected responses
    if response.status_code != 200 or 'results' not in ob:
        return jsonify({'error': 'API request failed or malformed response'}), 500

    if ob.get("total_results", 0) == 0:
        return jsonify({'error': 'No results found'}), 404

    try:
        image_url = ob['results'][0]['default_photo']['url']
        return jsonify({'image_url': image_url})
    except (KeyError, IndexError):
        return jsonify({'error': 'Image not available for this taxon'}), 404

@app.route('/info/<taxon_id>')
def info(taxon_id):
    