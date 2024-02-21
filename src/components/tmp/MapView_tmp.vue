// File: src/components/MapView.vue

<template>
  <div class="geo-system">
    <div id="map" class="map-container"></div>
    <div class="status-bar">
      纬度: {{ currentPosition.lat.toFixed(5) }}°,
      经度: {{ currentPosition.lng.toFixed(5) }}°,
      Zoom: {{ currentZoom }}
      &nbsp;&nbsp;&nbsp;&nbsp;
    </div>
  </div>
  <MainMenu @data-load-request="handleDataLoad" />
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MainMenu from './MainMenu.vue'; // Make sure the path is correct

export default {
  name: 'MapView',
  components: {
    MainMenu
  },
  data() {
    return {
      map: null,
      layerControl: null,
      currentZoom: 8, // 默认缩放级别，根据需要调整
      currentPosition: { lat: 0, lng: 0 },
      baseLayers: {
        OSM: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          // attribution: '© OpenStreetMap contributors'
        }),
        Topo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
          maxZoom: 17,
          // attribution: '© OpenTopoMap contributors'
        }),
        Satellite: L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoieXVrdW44MCIsImEiOiJjbHIyNmNrbDAweW83MnhsbWVsMDM0MDI3In0.twJQOS07PF5XQ76xl2MimA', {
          maxZoom: 19,
          // attribution: '© Satellite contributors'
        }),
        // Add more base layers as needed
      },
    };
  },
  mounted() {
    this.initMap();
    this.addBaseLayers();
    this.addLayerControl();
    this.registerMapEvents();
    // this.addGeoServerWMSLayer();
    // 添加 GeoServer WFS 图层
    // this.addGeoServerWFSLayer();
  },
  methods: {
    initMap() {
      this.map = L.map('map', {
        center: [30.186377, 98.853130], // Adjust the center as needed
        zoom: 8,
        layers: [this.baseLayers.OSM], // Default layer
        zoomControl: false // This will hide the zoom control
      });
    },
    addBaseLayers() {
      // The layers are already initialized in the data object
    },
    addLayerControl() {
      this.layerControl = L.control.layers(this.baseLayers, null, {
        position: 'topright',
      }).addTo(this.map);
    },
    registerMapEvents() {
      this.map.on('mousemove', (e) => {
        this.currentPosition = e.latlng;
      });
      this.map.on('zoomend', () => {
        this.currentZoom = this.map.getZoom();
      });
      // Add other events here as necessary
    },

    handleDataLoad(dataType) {
      switch (dataType) {
        case 'vector':
          this.addGeoServerWFSLayer();
          break;
        case 'remoteSensing':
          this.addGeoServerWFSLayer('remoteSensingLayer', 'remote_sensing_data');
          break;
        case 'insar':
          this.addGeoServerWFSLayer('insarLayer', 'insar_data');
          break;
        default:
          console.error('Unknown data type requested:', dataType);
      }
    },
    addGeoServerWFSLayer() {
      // 川藏研究区 GeoServer WFS 服务的 URL
      const cz_railway_area = 'http://localhost:8080/geoserver/chuanzang/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=chuanzang%3Acz_railway_area&maxFeatures=50&outputFormat=application%2Fjson';
      fetch(cz_railway_area)
        .then(response => response.json())
        .then(data => {
          // 使用 GeoJSON 数据创建一个图层
          const geoJsonLayer = L.geoJSON(data, {
            // 这里可以根据需要定义样式
            style: feature => ({
              color: '#000000', // 设置边框为黑色
              weight: 2, // 默认线宽
              fillColor: feature.properties.fillColor || '#000000', // 修改为黑色
              fillOpacity: 0, // 设置填充透明
            }),
          });

          // 将图层添加到图层控制器中
          this.layerControl.addOverlay(geoJsonLayer, '川藏线研究区');
        })
        .catch(error => {
          console.error('Error fetching the WFS data: ', error);
        });
      // 川藏线 GeoServer WFS 服务的 URL
      const railway = 'http://localhost:8080/geoserver/chuanzang/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=chuanzang%3Arailway&maxFeatures=50&outputFormat=application%2Fjson';
      fetch(railway)
        .then(response => response.json())
        .then(data => {
          const railwayLayer = L.geoJSON(data, {
            // Apply a static style to the railway line
            style: {
              color: '#000000', // Black color for the railway line
              weight: 3, // Slightly thicker line for visibility
              dashArray: '15, 10, 5, 10', // Dash pattern to mimic railway tracks: long dash, gap, short dash, gap
              fillOpacity: 0 // Ensure there's no fill
            },
            onEachFeature: (feature, layer) => {
              // Define interactions here if needed, such as click events
              // Since 'feature' is used here, it won't cause a linting warning
              layer.on('click', () => {
                console.log(feature);
                this.onFeatureClick(feature);
              });
            }
          });

          // Add the railway layer to the map
          this.layerControl.addOverlay(railwayLayer, 'Railway');
        })
        .catch(error => {
          console.error('Error fetching the WFS data: ', error);
        });
      // 川藏线5km缓冲区 GeoServer WFS 服务的 URL
      const cz_railway_buffer = 'http://localhost:8080/geoserver/chuanzang/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=chuanzang%3Abuffer_5km&maxFeatures=50&outputFormat=application%2Fjson';
      fetch(cz_railway_buffer)
        .then(response => response.json())
        .then(data => {
          // 使用 GeoJSON 数据创建一个图层
          const geoJsonLayer = L.geoJSON(data, {
            // 这里可以根据需要定义样式
            style: feature => ({
              color: '#FF0000', // 设置边框为红色
              weight: 2, // 默认线宽
              fillColor: feature.properties.fillColor || '#000000', // 修改为黑色
              fillOpacity: 0, // 设置填充透明
              dashArray: '5, 5' // This will create a dashed pattern with 5px dashes and 5px gaps
            }),
            onEachFeature: (feature, layer) => {
              // Define interactions here if needed, such as click events
              // Since 'feature' is used here, it won't cause a linting warning
              layer.on('click', () => {
                this.onFeatureClick(feature);
              });
            }
          });
          // 将图层添加到图层控制器中
          this.layerControl.addOverlay(geoJsonLayer, '川藏线5km缓冲区');
        })
        .catch(error => {
          console.error('Error fetching the WFS data: ', error);
        });
      // 川藏线20km缓冲区 GeoServer WFS 服务的 URL
      const cz_railway_buffer_20km = 'http://localhost:8080/geoserver/chuanzang/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=chuanzang%3Abuffer_20km&maxFeatures=50&outputFormat=application%2Fjson';
      fetch(cz_railway_buffer_20km)
        .then(response => response.json())
        .then(data => {
          // 使用 GeoJSON 数据创建一个图层
          const geoJsonLayer = L.geoJSON(data, {
            // 这里可以根据需要定义样式
            style: feature => ({
              color: '#FFA500', // 设置边框为橙色
              weight: 2, // 默认线宽
              fillColor: feature.properties.fillColor || '#000000', // 修改为黑色
              fillOpacity: 0, // 设置填充透明
              dashArray: '5, 5' // This will create a dashed pattern with 5px dashes and 5px gaps
            }),
            onEachFeature: (feature, layer) => {
              // Define interactions here if needed, such as click events
              // Since 'feature' is used here, it won't cause a linting warning
              layer.on('click', () => {
                this.onFeatureClick(feature);
              });
            }
          });
          // 将图层添加到图层控制器中
          this.layerControl.addOverlay(geoJsonLayer, '川藏线20km缓冲区');
        })
        .catch(error => {
          console.error('Error fetching the WFS data: ', error);
        });
      // 研究区滑坡样本点 GeoServer WFS 服务的 URL
      const landslide_sample = 'http://localhost:8080/geoserver/chuanzang/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=chuanzang%3Alandslide_sample&outputFormat=application%2Fjson'; // Removed maxFeatures=50
      fetch(landslide_sample)
        .then(response => response.json())
        .then(data => {
          // 使用 GeoJSON 数据创建一个图层
          const geoJsonLayer = L.geoJSON(data, {
            // 这里可以根据需要定义样式
            style: feature => ({
              color: '#FF0000', // 设置边框为红色
              weight: 2, // 默认线宽
              fillColor: feature.properties.fillColor || '#000000', // 修改为黑色
              fillOpacity: 0, // 设置填充透明
            }),
            onEachFeature: (feature, layer) => {
              // Define interactions here if needed, such as click events
              // Since 'feature' is used here, it won't cause a linting warning
              layer.on('click', () => {
                this.onFeatureClick(feature);
              });
            }
          });
          // 将图层添加到图层控制器中
          this.layerControl.addOverlay(geoJsonLayer, 'Landslide Sample');
        })
        .catch(error => {
          console.error('Error fetching the WFS data: ', error);
        });
    },
    // addGeoServerWMSLayer() {
    //   const wmsLayer = L.tileLayer.wms("http://localhost:8080/geoserver/wms", {
    //     layers: 'chuanzang:cz_railway_area',
    //     format: 'image/png',
    //     transparent: true,
    //     version: '1.3.0'
    //   });
    //   // Optional: Keep track of the WMS layer in the component's data
    //   // This allows for easier manipulation (e.g., toggling) later on
    //   this.wmsLayer = wmsLayer;
    // },
  }
}
</script>
  
<style scoped>
.geo-system {
  position: relative;
  height: 100vh;
}

.map-container {
  height: calc(100%);
  /* Adjust height for status bar */
}

.status-bar {
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 25px;
  /* Adjust as necessary */
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  /* Semi-transparent black */
  color: white;
  padding: 2px 2px;
  justify-content: flex-end;
  align-items: center;
  font-size: 16px;
  z-index: 1000;
  /* Adjust as necessary */
}

/* Scoped styles with deep selector to target layer control items */
::v-deep .leaflet-control-layers-selector {
  text-align: center;
  /* Aligns text to the left */
}

/* Fix for the layer labels if needed */
::v-deep .leaflet-control-layers label {
  display: flex;
  align-items: center;
  text-align: left;
}

/* Additional styles can be added here if needed for finer adjustments */
</style>
  