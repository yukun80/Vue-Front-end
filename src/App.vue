// File: src/App.vue

<template>
  <div id="app">
    <!-- <MainMenu @load-data="handleLoadData" /> -->
    <MapView />
    <LegendComponent />
    <!-- <InfPanel :selected-landslide="selectedLandslide" /> -->
  </div>
</template>

<script>

// import MainMenu from './components/MainMenu.vue';
import MapView from './components/MapView.vue';
import LegendComponent from './components/LegendComponent.vue';

export default {
  name: 'App',
  components: {
    // MainMenu,
    MapView,
    LegendComponent,
  },
  data() {
    return {
    };
  },
  methods: {
    // handleLoadData(dataType) {
    //   // Use the dataType to determine which data to load
    //   // and then call a method on the MapView component
    //   this.$refs.mapView.addLayer(dataType);
    // }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #273c51;
  margin-top: 0px;
}
</style>
