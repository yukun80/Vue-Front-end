// File: src/components/MainMenu.vue

<template>
    <div class="menu-component">
        <!-- System Name or Logo -->
        <div class="menu-item logo" @click="refreshPage">
            <img src="../../public/logo.png" alt="System Logo" style="width: 45px; height: auto;">
        </div>
        <div class="system-name">
            <h1>典型地质灾害风险人工智能早期识别系统</h1>
        </div>
        <!-- Data Loading Menu -->
        <div class="menu-item" @mouseover="hoverMenu = 'data'" @mouseleave="hoverMenu = null">
            <!-- <i class="icon-data-loading"></i> -->
            <span>数据加载</span>
            <ul class="submenu" v-show="hoverMenu === 'data'">
                <!-- Submenu items for data loading go here -->
                <div class="submenu-item" @click="addLayerToMap('optical')">光学遥感数据</div>
                <div class="submenu-item" @click="addLayerToMap('sar')">SAR遥感数据</div>
                <div class="submenu-item" @click="addLayerToMap('vector')">研究区矢量数据</div>
                <div class="submenu-item" @click="addLayerToMap('dem')">DEM数据</div>
                <div class="submenu-item" @click="addLayerToMap('insar')">InSAR形变结果数据</div>
            </ul>
        </div>
        <!-- Data Loading Menu -->
        <div class="menu-item" @mouseover="hoverMenu = 'sample'" @mouseleave="hoverMenu = null">
            <!-- <i class="icon-data-loading"></i> -->
            <span>样本数据集</span>
            <ul class="submenu" v-show="hoverMenu === 'sample'">
                <!-- Submenu items for data loading go here -->
                <div class="submenu-item" @click="addSampleToMap('cz')">川藏线20km缓冲区样本</div>
            </ul>
        </div>
        <!-- Calculation Tools Menu -->
        <div class="menu-item" @mouseover="hoverMenu = 'calculation'" @mouseleave="hoverMenu = null">
            <!-- <i class="icon-calc-tools"></i> -->
            <span>计算工具</span>
            <div class="submenu" v-show="hoverMenu === 'calculation'">
                <!-- Submenu items for calculation tools go here -->
                <div class="submenu-item" @click="calculate('slope')">坡度计算</div>
                <div class="submenu-item" @click="calculate('aspect')">坡向计算</div>
                <div class="submenu-item" @click="calculate('v2r')">矢量转栅格</div>
                <div class="submenu-item" @click="calculate('r2v')">栅格转矢量</div>
            </div>
        </div>

        <!-- Disaster Identification Menu -->
        <div class="menu-item" @mouseover="hoverMenu = 'disaster'" @mouseleave="hoverMenu = null">
            <!-- <i class="icon-disaster-id"></i> -->
            <span>地质灾害检测</span>
            <div class="submenu" v-show="hoverMenu === 'disaster'">
                <!-- Submenu items for disaster identification go here -->
                <div class="submenu-item" @click="runDisasterModel('optical')">光学遥感模型</div>
                <div class="submenu-item" @click="runDisasterModel('insar')">InSAR检测模型</div>
                <div class="submenu-item" @click="runDisasterModel('sync')">综合检测模型</div>
            </div>
        </div>
        <div class="menu-item" @mouseover="hoverMenu = 'analysis'" @mouseleave="hoverMenu = null">
            <!-- <i class="icon-property-sheet"></i> -->
            <span>定量分析</span>
            <!-- <div class="submenu" v-show="hoverMenu === 'analysis'">
                <div class="submenu-item" @click="togglePropertySheet">显示属性表</div>
            </div> -->
        </div>
    </div>
</template>
  
<script>


export default {
    name: 'MainMenu',
    emits: ['load-data', 'load-sample', 'calculate-tool', 'run-model', 'show-property-sheet'],
    data() {
        return {
            hoverMenu: null // Tracks which menu item is being hovered over
        };
    },
    // Add methods or additional data properties as needed
    methods: {
        refreshPage() {
            window.location.reload();
        },
        addLayerToMap(dataType) {
            // Communicates with the MapView component to add a layer
            this.$emit('load-data', dataType);
        },
        addSampleToMap(dataType) {
            // Communicates with the MapView component to add a layer
            this.$emit('load-sample', dataType);
        },
        calculate(method) {
            // Placeholder for slope calculation functionality
            this.$emit('calculate-tool', method);
        },
        runDisasterModel(modelId) {
            // Placeholder for running disaster model calculations
            this.$emit('run-model', modelId);
        },
        togglePropertySheet() {
            // Emit an event to the parent component to show the property sheet
            this.$emit('toggle-property-sheet');
        },
    },
};
</script>
  
<style scoped>
/* 菜单栏 */
.menu-component {
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background-color: rgba(44, 62, 80, 0.7);
    backdrop-filter: blur(5px);
    color: white;
    padding: 0.5rem;
    z-index: 1000;
    /* Make sure it's above the map layers */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    /* Add some shadow for depth */
}


/* 菜单按钮选项 */
.menu-item {
    display: flex;
    align-items: center;
    margin-left: 2rem;
    position: relative;
    cursor: pointer;
    font-size: 1rem;
    /* Use rem for scalability */
    font-family: "Microsoft YaHei", sans-serif;
    /* Fallback to sans-serif */
    transition: background-color 0.3s ease, transform 0.2s ease;
    font-size: 20px;
}

/* 系统logo */
.logo {
    /* Use a webfont for icons or background-image for SVG/PNG icons */
    margin-left: 18px;
}

/* 系统名称设计 */
.system-name {
    margin-left: 1rem;
    font-size: 1rem;
    /* 修改字体大小 */
    font-family: "Microsoft YaHei", sans-serif;
    /* Fallback to sans-serif */
    /* Additional styles for better appearance on small screens */
}

/* 子菜单设计 */
.submenu {
    display: none;
    /* Initial state, will be overridden by v-show */
    position: absolute;
    left: 0;
    top: 100%;
    min-width: 120px;
    /* Set a minimum width for the submenu */
    background-color: rgba(44, 62, 80, 0.8);
    transition: background-color 0.3s ease, transform 0.2s ease;
    /* Add transform to the transition */
    backdrop-filter: blur(5px);
    padding: 0.75rem 1rem;
    border-radius: 0.2rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(5px);
    cursor: pointer;
    font-size: 18px;
    white-space: nowrap;
    /* Prevent text wrapping */
    /* Change cursor to pointer to indicate clickable items */
}

.submenu-item {
    /* ... existing styles ... */
    text-align: left;
    /* Ensure text aligns to the left */
    padding: 0.75rem 1rem;
    /* Increased padding for larger click area */
    display: block;
    /* Display as block to fill the width of the submenu */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    /* ... */
}

.menu-item:hover .submenu {
    display: block;
    /* Show the submenu on hover */
    opacity: 1;
    visibility: visible;
    transform: translateY(0px);
    transition-delay: 1s;
    /* Remove delay for immediate appearance on hover */

}

.menu-item:hover,
.submenu-item:focus {
    background-color: #3e5770;
    outline: none;
    /* Remove focus outline, add custom focus styles if needed */
}



.submenu-item:active {
    transform: scale(0.95);
    /* Slightly scale down the item when clicked */
    background-color: #506680;
    /* Change background color to give feedback */
}
</style>
  