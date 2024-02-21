<template>
  <div class="property-sheet">
    <h2>属性表</h2>
    <table>
      <thead>
        <tr>
          <!-- Generate table headers dynamically from the keys of the first feature's properties -->
          <th v-for="(value, key) in featureKeys" :key="key">
            {{ key }}
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Generate table rows for each feature -->
        <tr v-for="(feature, index) in features" :key="index">
          <!-- Generate table cells for each property -->
          <td v-for="(value, key) in feature.properties" :key="key">
            {{ value }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'PropertySheet',
  data() {
    return {
      features: [], // Array to store the features from GeoJSON
      featureKeys: [] // Array to store the keys of the properties for table headers
    };
  },
  created() {
    this.loadGeoJsonData();
  },
  methods: {
    loadGeoJsonData() {
      const geoJsonUrl = 'http://localhost:8080/geoserver/chuanzang/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=chuanzang%3Alandslide_sample&outputFormat=application%2Fjson';

      fetch(geoJsonUrl)
        .then(response => response.json())
        .then(data => {
          this.features = data.features;
          if (data.features.length > 0) {
            // Assume all features have the same properties structure
            this.featureKeys = Object.keys(data.features[0].properties);
          }
        })
        .catch(error => {
          console.error('Error fetching the GeoJSON data:', error);
        });
    }
  }
};
</script>

<style>
/* Add styles for your property sheet here */
.property-sheet {
  /* Sample styling, adjust as needed */
  margin: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.property-sheet h2 {
  text-align: center;
}

.property-sheet table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.property-sheet th,
.property-sheet td {
  text-align: left;
  padding: 8px;
  border: 1px solid #ddd;
}

.property-sheet th {
  background-color: #f2f2f2;
}
</style>