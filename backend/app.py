from flask import Flask,jsonify,Response
import requests
import json
import pandas as pd
import numpy as np
import plotly.graph_objects as go
from statsmodels.nonparametric.smoothers_lowess import lowess
from scipy.interpolate import PchipInterpolator
from scipy.optimize import curve_fit



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

    print("random")

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
        status = ob['results'][0].get("conservation_status", "Safe")
        status = "Threatened" if status != "Safe" else "Safe"
        print(status)
        print("here3")
        return jsonify({'name': name, 
                        'genus': genus,
                        'status' : status,
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

@app.route('/graph/<taxon_id>')
def graph(taxon_id):

    TAXON_FILTER = taxon_id

    # Read the CSV and cast taxon_id as int
    df = pd.read_csv("data/taxon_grid_clusters_by_year.csv")
    df["taxon_id"] = df["taxon_id"].astype(float).astype(int)

    taxon_id = int(taxon_id)
    taxon_df = df[df["taxon_id"] == taxon_id]

    filtered_df = taxon_df

    # Step 1: Aggregate & interpolate population
    yearly_population = filtered_df.groupby("year")["cluster_count"].sum().reset_index()
    yearly_population.rename(columns={"cluster_count": "population"}, inplace=True)
    full_years = pd.DataFrame({"year": range(yearly_population["year"].min(), 2031)})
    merged = full_years.merge(yearly_population, on="year", how="left")
    merged["interpolated"] = merged["population"].isna()
    merged["population"] = merged["population"].interpolate(method="linear")

    # Step 2: LOWESS smoothing
    x_obs = merged.loc[merged["year"] <= 2020, "year"]
    y_obs = merged.loc[merged["year"] <= 2020, "population"]
    lowess_result = lowess(endog=y_obs, exog=x_obs, frac=0.3, return_sorted=False)

    # Step 3: Forecasting using slope decay
    x_arr = x_obs.values
    y_arr = lowess_result
    recent_slopes = np.diff(y_arr[-4:]) / np.diff(x_arr[-4:])
    avg_slope = np.mean(recent_slopes)

    forecast_years = np.arange(2021, 2031)
    decay = np.linspace(1.0, 0.2, len(forecast_years))
    forecast_values = [y_arr[-1] + avg_slope * decay[0]]
    for i in range(1, len(forecast_years)):
        next_val = forecast_values[-1] + avg_slope * decay[i]
        forecast_values.append(max(next_val, 0))

    forecast_years = np.concatenate([[2020], forecast_years])
    forecast_values = np.concatenate([[y_arr[-1]], forecast_values])

    # Step 4: Plot with Plotly
    fig = go.Figure()

    y_obs = merged.loc[merged["year"] <= 2020, "population"].round().astype(int)

    # Original data points
    fig.add_trace(go.Scatter(
        x=x_obs,
        y=y_obs,
        mode="markers",
        marker=dict(color="black"),
        name="Data"
    ))

    # Smoothed + forecast line
    fig.add_trace(go.Scatter(
        x=np.concatenate([x_arr, forecast_years[1:]]),
        y=np.concatenate([y_arr, forecast_values[1:]]),
        mode="lines",
        line=dict(color="red", dash="dash"),
        name="Prediction Line"
    ))

    # Interpolated 2021–2024 points
    missing_years = np.arange(2021, 2025)
    missing_values = np.interp(missing_years, forecast_years, forecast_values)
    missing_values = np.round(missing_values).astype(int)
    fig.add_trace(go.Scatter(
        x=missing_years,
        y=missing_values,
        mode="markers",
        marker=dict(color="black", symbol="circle"),
        name="Data"
    ))

    # Layout & interactivity
    fig.update_layout(
        title=f"Population Forecast with Interpolated 2021–2024 Transition (Taxon {TAXON_FILTER})",
        xaxis_title="Year",
        yaxis_title="Total Population",
        template="plotly_white",
        hovermode="x unified",
        legend=dict(x=0.01, y=0.99),
    )

    # Show in notebook or browser
    return Response(fig.to_html(full_html=True, include_plotlyjs='cdn'), mimetype="text/html")


if __name__ == '__main__':
    app.run(debug=True)