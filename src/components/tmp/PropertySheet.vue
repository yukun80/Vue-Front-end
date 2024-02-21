// File: src/components/PropertySheet.vue


<template>
  <div class="property-sheet" v-if="visible">
    <h2>属性信息</h2>
    <!-- Display attributes here -->
    <!-- This will be a loop through attribute data -->
    <div v-for="(value, key) in attributes" :key="key">
      {{ key }}: {{ value }}
    </div>
  </div>
</template>
  
<script>
export default {
  name: 'PropertySheet',
  props: {
    visible: Boolean,
    attributes: Object // The attribute data for the selected WFS layer
  }
};
</script>
  
<style scoped>
.property-sheet {
  position: absolute;
  top: 50px;
  right: 10px;
  width: 300px;
  /* Adjust width as needed */
  background: rgb(36, 40, 40);
  padding: 15px;
  border-radius: 5px;
  border-left: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  /* ... additional styling ... */
}

.attribute {
  margin-bottom: 5px;
}

.attribute strong {
  margin-right: 5px;
}
</style>
  