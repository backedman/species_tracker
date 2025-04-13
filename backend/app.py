from flask import Flask,jsonify
import requests
import json
import pandas as pd

app = Flask(__name__)
df = pd.read_csv('data/filtered_species_with_conservation_status.csv')
taxon_dict = dict(zip(df['taxon_id'], df['name']))




#TODO: direct to search page
@app.route('/')
def hello():
    return 'Hello, World!'



#TODO: main function to run the code to get the information we need. We can use auxillary functions, but this function returns all the information the animal page will use including the data.
@app.route('/animal/<animal_name>')

def animal_search(animal_name):
    suggest_species(animal_name)

def suggest_species(query, max_results=5):
    query = query.lower()
    matches = [
        {"name": name, "taxon_id": taxon_id}
        for name, taxon_id in taxon_dict.items()
        if query in name.lower()
    ]
    return matches[:max_results]

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
   #preferred_common_name (name), iconic_taxon_name (genus), name (species), wikipedia_url
    url = f'https://api.inaturalist.org/v1/taxa/{taxon_id}?order=desc&order_by=observations_count'
    response = requests.get(url)
    ob = response.json()

   # Handle unexpected responses
    if response.status_code != 200 or 'results' not in ob:
        return jsonify({'error': 'API request failed or malformed response'}), 500

    if ob.get("total_results", 0) == 0:
        return jsonify({'error': 'No results found'}), 404
    
    try:
        name = ob['results'][0]['preferred_common_name']
        genus = ob['results'][0]['iconic_taxon_name']
        species = ob['results'][0]['name']
        wikipedia_url = ob['results'][0]['wikipedia_url']
        return jsonify({'name': name, 
                        'genus': genus,
                        'species': species,
                        'wikipedia_url': wikipedia_url})
    except (KeyError, IndexError):
        return jsonify({'error': 'Info not available for this taxon'}), 404
    

@app.route('/map/<taxon_id>')
def map_dist(taxon_id):
    import folium
    from folium.utilities import JsCode
    from folium.features import GeoJsonPopup
    from folium.plugins.timeline import Timeline, TimelineSlider
    import pandas as pd

    # Load the cluster data
    df = pd.read_csv("data/taxon_grid_clusters_by_year.csv")
    df["taxon_id"] = df["taxon_id"].astype(float).astype(int)

    TAXON_FILTER = int(taxon_id)
    filtered_df = df[df["taxon_id"] == TAXON_FILTER]

    if filtered_df.empty:
        return f"No data found for taxon_id={TAXON_FILTER}"
    else:
        # Build GeoJSON features with start and end properties for the timeline.
        features = []
        for _, row in filtered_df.iterrows():
            year = int(row["year"])
            start_time = f"{year}-01-01T00:00:00"
            end_time = f"{year}-12-31T23:59:59"
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [row["centroid_lon"], row["centroid_lat"]]
                },
                "properties": {
                    "start": start_time,
                    "end": end_time,
                    "popup": f"Year: {year}<br>Count: {row['cluster_count']}",
                    "cluster_count": row["cluster_count"]
                }
            }
            features.append(feature)
        
        geojson_data = {
            "type": "FeatureCollection",
            "features": features
        }
        
        # Center map on the mean coordinates
        center_lat = filtered_df["centroid_lat"].mean()
        center_lon = filtered_df["centroid_lon"].mean()
        m = folium.Map(location=[center_lat, center_lon], zoom_start=3, tiles="cartodbpositron")
        
        # Create a Timeline layer with a custom style and pointToLayer function that draws circles.
        timeline = Timeline(
            geojson_data,
            style=JsCode("""
                function(data) {
                    return {
                        fillColor: 'blue',
                        color: 'blue',
                        weight: 1,
                        opacity: 0.6,
                        fillOpacity: 0.6
                    };
                }
            """),
            pointToLayer=JsCode("""
                function(feature, latlng) {
                    return L.circleMarker(latlng, {
                        radius: Math.max(2, Math.min(Math.sqrt(feature.properties.cluster_count), 10))
                    });
                }
            """)
        ).add_to(m)
        
        GeoJsonPopup(fields=['popup'], labels=False).add_to(timeline)
        
        # Add the TimelineSlider control.
        TimelineSlider(
            auto_play=False,
            show_ticks=True,
            enable_keyboard_controls=True,
            playback_duration=30000  # Duration in milliseconds (30 seconds)
        ).add_timelines(timeline).add_to(m)
        
        # Inject custom JavaScript to set the slider’s initial value to the most recent year (2024)
        # Here we assume that the timeline slider is rendered as a noUiSlider on an element with the class 'timeline-slider'
        # and we convert the desired date to a numeric timestamp.
        most_recent_time = "2024-12-31T23:59:59"
        custom_js = f"""
        <script>
        document.addEventListener('DOMContentLoaded', function() {{
            // Wait a moment to ensure the slider has been created
            setTimeout(function(){{
                // Adjust the selector if needed based on your generated HTML structure
                var sliderDiv = document.querySelectorAll('.timeline-slider')[0];
                if(sliderDiv && sliderDiv.noUiSlider) {{
                    // Convert the desired time to a numeric timestamp
                    var defaultTime = new Date("{most_recent_time}").getTime();
                    sliderDiv.noUiSlider.set(defaultTime);
                }}
            }}, 1500);
        }});
        </script>
        """
        from folium import Element
        m.get_root().html.add_child(Element(custom_js))
        
        # Return the map HTML directly instead of saving to a file.
        print('here')
        return m.get_root().render()


@app.route('/population/<taxon_id>')
def pop_project(taxon_id):
    pass