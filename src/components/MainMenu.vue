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
        <!-- Sample Loading Menu -->
        <div class="menu-item" @mouseover="hoverMenu = 'sample'" @mouseleave="hoverMenu = null">
            <!-- <i class="icon-data-loading"></i> -->
            <span>样本数据集</span>
            <ul class="submenu" v-show="hoverMenu === 'sample'">
                <!-- Submenu items for data loading go here -->
                <div class="submenu-item" @click="addSampleToMap('optical')">光学样本数据集</div>
                <div class="submenu-item" @click="addSampleToMap('insar')">InSAR样本数据集</div>
            </ul>
        </div>
        <!-- Calculation Tools Menu -->
        <div class="menu-item" @mouseover="hoverMenu = 'calculation'" @mouseleave="hoverMenu = null">
            <!-- <i class="icon-calc-tools"></i> -->
            <span>计算工具</span>
            <div class="submenu" v-show="hoverMenu === 'calculation'">
                <!-- Submenu items for calculation tools go here -->
                <div class="submenu-item" @click="openCalculatePanel('slope')">坡度计算</div>
                <div class="submenu-item" @click="openCalculatePanel('aspect')">坡向计算</div>
                <div class="submenu-item" @click="openCalculatePanel('v2r')">矢量转栅格</div>
                <div class="submenu-item" @click="openCalculatePanel('r2v')">栅格转矢量</div>
            </div>
        </div>
        <!-- Disaster Identification Menu -->
        <div class="menu-item" @mouseover="hoverMenu = 'disaster'" @mouseleave="hoverMenu = null">
            <!-- <i class="icon-disaster-id"></i> -->
            <span>地质灾害检测</span>
            <div class="submenu" v-show="hoverMenu === 'disaster'">
                <!-- Submenu items for disaster identification go here -->
                <div class="submenu-item" @click="openDisasterPanel('optical')">光学遥感模型</div>
                <div class="submenu-item" @click="openDisasterPanel('insar')">InSAR检测模型</div>
                <div class="submenu-item" @click="openDisasterPanel('sync')">综合检测模型</div>
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

    <!-- <div class="submenu-panel" :class="{ 'visible': calculatePanel.visible || disasterPanel.visible }"> -->
    <!-- 栅格分析面板 -->
    <div class="calculate-panel" v-bind:class="{ visible: calculatePanel.visible }">
        <!-- 根据 selectedTool 显示不同内容 -->
        <div v-if="calculatePanel.selectedTool === 'slope'">
            <h2>坡度计算</h2>
        </div>
        <div v-if="calculatePanel.selectedTool === 'aspect'">
            <h2>坡向计算</h2>
        </div>
        <div v-if="calculatePanel.selectedTool === 'v2r'">
            <h2>矢量转栅格</h2>
        </div>
        <div v-if="calculatePanel.selectedTool === 'r2v'">
            <h2>栅格转矢量</h2>
        </div>
        <!-- 公共面板内容 -->
        <div class="input-data">
            <label for="inputData">输入数据:</label>
            <select v-model="selectedLayer">
                <option v-for="layer in layers" :key="layer.name" :value="layer.name">
                    {{ layer.name }}
                </option>
            </select>
        </div>
        <div class="save-location">
            <label for="saveLocation">保存位置:</label>
            <select>
                <!-- 数据库选项列表 -->
                <option value="CZ_Vector">CZ_Vector</option>
                <option value="CZ_Raster">CZ_Raster</option>
            </select>
        </div>
        <!-- 添加输入保存栅格数据集名称的文本框 -->
        <div class="input-data">
            <label for="inputData">保存名称:</label>
            <input type="text" name="inputData" id="inputData" />
        </div>
        <div class="checkbox-option">
            <input type="checkbox" checked />
            <label for="addToProject">是否加载到当前项目中</label>
        </div>
        <div class="button-group">
            <button class="btn btn-primary" @click="calculate(calculatePanel.selectedTool)">运行</button>
            <button class="btn btn-secondary" @click="closeCalculatePanel">取消</button>
        </div>
    </div>
    <!-- 灾害检测面板 -->
    <div class="disaster-panel" v-bind:class="{ visible: disasterPanel.visible }">
        <!-- 根据 selectedTool 显示不同内容 -->
        <div v-if="disasterPanel.selectedTool === 'optical'">
            <h2>光学滑坡检测</h2>
        </div>
        <div v-if="disasterPanel.selectedTool === 'insar'">
            <h2>InSAR滑坡检测</h2>
        </div>
        <div v-if="disasterPanel.selectedTool === 'sync'">
            <h2>多源综合检测</h2>
        </div>
        <!-- 公共面板内容 -->
        <div class="input-data">
            <label for="inputData">输入数据:</label>
            <select v-model="selectedLayer" @change="addNewSelect">
                <option v-for="layer in layers" :key="layer.name" :value="layer.name">
                    {{ layer.name }}
                </option>
            </select>
        </div>
        <div v-for="(select, index) in additionalSelects" :key="index" class="input-data">
            <label :for="'inputData' + index">输入数据 {{ index + 1 }}:</label>
            <select v-model="select.selected" @change="addNewSelect">
                <option v-for="layer in layers" :key="layer.name" :value="layer.name">
                    {{ layer.name }}
                </option>
            </select>
        </div>
        <div class="save-location">
            <label for="saveLocation">保存位置:</label>
            <select>
                <!-- 数据库选项列表 -->
                <option value="CZ_Vector">CZ_Vector</option>
                <option value="CZ_Raster">CZ_Raster</option>
            </select>
        </div>
        <!-- 添加输入保存栅格数据集名称的文本框 -->
        <div class="input-data">
            <label for="inputData">保存名称:</label>
            <input type="text" name="inputData" id="inputData" />
        </div>
        <div class="checkbox-option">
            <input type="checkbox" checked />
            <label for="addToProject">是否加载到当前项目中</label>
        </div>
        <div class="button-group">
            <button class="btn btn-primary" @click="runDisasterModel(disasterPanel.selectedTool)">运行</button>
            <button class="btn btn-secondary" @click="closeDisasterPanel">取消</button>
        </div>
    </div>
    <!-- </div> -->
</template>
  
<script>


export default {
    name: 'MainMenu',
    emits: ['load-data', 'load-sample', 'calculate-tool', 'run-model', 'show-property-sheet'],
    props: {
        layers: Array, // An array of layers to choose from
    },
    // 此处可以添加方法和数据
    data() {
        return {
            hoverMenu: null, // Tracks which menu item is being hovered over
            selectedLayer: '', // The currently selected layer
            additionalSelects: [],
            calculatePanel: {
                visible: false,
                selectedTool: null,
            },
            disasterPanel: {
                visible: false,
                selectedTool: null,
            },
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
        // 计算面板
        calculate(method) {
            // Placeholder for slope calculation functionality
            this.$emit('calculate-tool', method);
        },
        openCalculatePanel(method) {
            this.calculatePanel.selectedTool = method;
            this.calculatePanel.visible = true;
            // console.log(this.calculatePanel.visible);
            // this.$emit('calculate-tool', method);
        },
        closeCalculatePanel() {
            this.calculatePanel.visible = false;
            this.calculatePanel.selectedTool = null;
        },
        // 滑坡检测面板
        runDisasterModel(method) {
            // Placeholder for running disaster model calculations
            this.$emit('run-model', method);
        },
        addNewSelect() {
            this.additionalSelects.push({ selected: '' });
        },
        openDisasterPanel(method) {
            this.disasterPanel.selectedTool = method;
            this.disasterPanel.visible = true;
        },
        closeDisasterPanel() {
            this.disasterPanel.visible = false;
            this.disasterPanel.selectedTool = null;
        },
        togglePropertySheet() {
            // Emit an event to the parent component to show the property sheet
            this.$emit('toggle-property-sheet');
        },
    },
    watch: {
        // selectedLayer: {
        //     immediate: true,
        // }
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

/* 操作面板 */
.calculate-panel {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    overflow-y: auto;
    padding-top: 50px;
    padding-bottom: 50px;

    /* 位置设置 */
    left: 0;
    right: 80%;
    top: 61px;
    bottom: 3.3dvh;
    z-index: 500;

    /* 颜色风格 */
    background-color: rgba(44, 62, 80, 0.7);
    backdrop-filter: blur(5px);
    /* 背景模糊效果 */
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);

    /* higher than menu-component */
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    /* padding: 1rem; */
    /* 内边距 */
    /* 文字样式 */
    color: white;
}

/* Ensure the visibility class applies to the correct container */
.calculate-panel.visible {
    transform: translateX(0);
}

/* 让select元素填充父容器 */
.calculate-panel select {
    width: 50%;
}

.calculate-panel button {
    width: 40%;
}

.calculate-panel input[type="text"] {
    width: 50%;
}

.disaster-panel {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    overflow-y: auto;
    padding-top: 20px;
    padding-bottom: 30px;

    /* 位置设置 */
    left: 0;
    right: 80%;
    top: 61px;
    bottom: 3.3dvh;
    z-index: 500;

    /* 颜色风格 */
    background-color: rgba(44, 62, 80, 0.7);
    backdrop-filter: blur(5px);
    /* 背景模糊效果 */
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);

    /* higher than menu-component */
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    /* padding: 1rem; */
    /* 内边距 */
    /* 文字样式 */
    color: white;
}

.disaster-panel.visible {
    transform: translateX(0);
}

.disaster-panel select {
    width: 50%;
}

.disaster-panel button {
    width: 40%;
}

.disaster-panel input[type="text"] {
    width: 50%;
}

/* 设置计算工具面板样式 */
.input-data {
    display: flex;
    /* 启用 flex 布局 */
    justify-content: space-between;
    /* 在两端对齐元素 */
    align-items: center;
    /* 垂直居中对齐 */
    /* 设置宽度 */
    width: 70%;
    /* 设置元素的宽度 */
}

.save-location {
    display: flex;
    /* 启用 flex 布局 */
    justify-content: space-between;
    /* 在两端对齐元素 */
    align-items: center;
    /* 垂直居中对齐 */
    /* 设置宽度 */
    width: 70%;
}

.button-group {
    display: flex;
    /* 启用 flex 布局 */
    justify-content: space-between;
    /* 在两端对齐元素 */
    align-items: center;
    /* 垂直居中对齐 */
    /* 设置宽度 */
    width: 70%;
}
</style>
  