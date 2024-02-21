<template>
  <div class="data-load-submenu">
    <ul class="data-options">
      <li @click="loadData('vector')">矢量数据</li>
      <li @click="loadData('remoteSensing')">多源遥感数据</li>
      <li @click="loadData('insar')">InSAR数据</li>
    </ul>
  </div>
</template>
  
<script>
export default {
  name: 'DataLoad',
  emits: ['load-data'],
  methods: {
    loadData(type) {
      // Emit an event with the type of data to load, which will be handled by the parent
      this.$emit('load-data', type);
    },
  },
};
</script>
  
<style scoped>
.data-load-submenu {
  background-color: #34495e;
  border-radius: 0.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.data-options {
  list-style: none;
  padding: 0;
  margin: 0;
}

.data-options li {
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: white;
  transition: background-color 0.3s ease;

  /* Highlight the item on hover */
  &:hover {
    background-color: #3b5998;
  }
}
</style>
  