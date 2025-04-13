import React from "react";

export default function Map({ taxonId }) {
  return (
    <div style={{ width: "100%", height: "600px" }}>
      <iframe
        title="Folium Map"
        src={`http://localhost:5000/map/${taxonId}`} // Dynamically loads the map for the given taxonId
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0 }}
      />
    </div>
  );
}
