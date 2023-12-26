<template>
    <div class="container" ref="container"></div>
    <el-drawer v-model="showDrawer" direction="rtl" :with-header="true" title="编辑节点">
        <EditProperties :propertiesTmp='propertiesTmp'></EditProperties>
        <div>
            <el-button @click="saveProperties">保存</el-button>
        </div>
    </el-drawer>
</template>
<script setup>
import LogicFlow from "@logicflow/core";
import "@logicflow/core/dist/style/index.css";
import { reactive, ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { DndPanel, Menu, Control, SelectionSelect, Snapshot, lfJson2Xml, lfXml2Json, Group } from "@logicflow/extension";
import { PolylineEdge, PolylineEdgeModel } from "@logicflow/core";
import { class_diagram_radius, svg } from "@/components/CustomNode/index"
import { rect_radius, rect_dasharray, cnn, fmea, object_perception, perception, custom_group } from "@/components/CustomNode/BlockDefinitionDiagram/index"
import { generalization, dependency, aggregation, composition } from "@/components/CustomEdge/blockDefinitionDiagram"
import "@logicflow/extension/lib/style/index.css";
import { exportJson } from "@/utils/index"
import { useDiagramStore } from '@/stores/diagram'
import EditProperties from '@/components/EditProperties.vue'
let lf = null
const container = ref(null)
const showDrawer = ref(false)
const currentNode = ref(null)
let propertiesTmp = null
let selectedEdgeType = ''
const router = useRouter()

onMounted(() => {
    lf = new LogicFlow({
        container: container.value,
        grid: true,
        keyboard: {
            enabled: true,
        },
        // 注册组件
        plugins: [Menu, Control, SelectionSelect, DndPanel, Snapshot, Group]
    });
    initDndPanel()
    initControl()
    initMenu()
    initListener()
    registerCustomNode()
    lf.render(useDiagramStore().getFile);
    useDiagramStore().clearFile()
})


const initDndPanel = () => {
    lf.extension.dndPanel.setPatternItems([
        {
            label: 'select area',
            icon: 'src/assets/svg/选区.svg',
            callback: () => {
                lf.extension.selectionSelect.openSelectionSelect();
                //框选，选一次之后就关闭框选
                lf.once('selection:selected', () => {
                    lf.extension.selectionSelect.closeSelectionSelect();
                });
            }
        },
        {
            type: 'rect_radius',
            label: 'rounded rect',
            icon: 'src/assets/svg/圆角矩形.svg',
        },
        {
            type: 'rect_dasharray',
            label: 'dashed rect',
            icon: 'src/assets/svg/虚线矩形.svg',
        },
        {
            type: 'class_diagram_radius',
            label: 'component',
            properties: {
                title: 'component',
                type: 'component'
            },
            icon: 'src/assets/svg/圆角矩形.svg',
        },
        {
            type: 'class_diagram_radius',
            label: 'location',
            properties: {
                title: 'location',
                type: 'AI Component'
            },
            icon: 'src/assets/svg/AIcomponent.svg',
        },
        {
            type: 'class_diagram_radius',
            properties: {
                title: 'control',
                type: 'AI Component'
            },
            label: 'control',
            icon: 'src/assets/svg/AIcomponent.svg',
        },
        {
            type: 'class_diagram_radius',
            properties: {
                title: 'planning',
                type: 'AI Component',
            },
            label: 'planning',
            icon: 'src/assets/svg/AIcomponent.svg',
        },
        {
            type: 'object_perception',
            properties: {
                title: 'perception',
                type: 'AI Component',
            },
            label: 'perception',
            icon: 'src/assets/svg/AIcomponent.svg',
        },

        {
            type: 'cnn',
            properties: {
                title: 'CNN',
                iconClass: 'AI-component',
                type: 'CNN',
            },
            label: 'CNN',
            icon: 'src/assets/svg/AIcomponent.svg',
        },
        {
            type: 'fmea',
            properties: {
                title: 'FMEA',
                type: 'FMEA',
            },
            label: 'FMEA',
            icon: 'src/assets/svg/圆角矩形.svg',
        },
        {
            type: 'custom_group',
            label: 'group',
            icon: 'src/assets/svg/虚线矩形.svg',
        },
        {
            type: 'perception',
            label: 'perception',
            properties: {
                iconClass: 'AI-component',
            },
            icon: 'src/assets/svg/perception.svg',
        },
        {
            type: 'svg',
            text: 'lane',
            properties: {
                src: 'src/assets/svg/lane.svg'
            },
            label: 'lane',
            icon: 'src/assets/svg/lane.svg',
        },
        {
            type: 'svg',
            text: 'camera',
            properties: {
                src: 'src/assets/svg/camera.svg'
            },
            label: 'camera',
            icon: 'src/assets/svg/camera.svg',
        },
        {
            type: 'svg',
            text: 'car',
            properties: {
                src: 'src/assets/svg/car.svg'
            },
            label: 'car',
            icon: 'src/assets/svg/car.svg',
        },
        {
            type: 'svg',
            text: 'cyclist',
            properties: {
                src: 'src/assets/svg/cyclist.svg'
            },
            label: 'cyclist',
            icon: 'src/assets/svg/cyclist.svg',
        },
        {
            type: 'svg',
            text: 'gps',
            properties: {
                src: 'src/assets/svg/gps.svg'
            },
            label: 'gps',
            icon: 'src/assets/svg/gps.svg',
        },
        {
            type: 'svg',
            text: 'hdmap',
            properties: {
                src: 'src/assets/svg/hdmap.svg'
            },
            label: 'hdmap',
            icon: 'src/assets/svg/hdmap.svg',
        },
        {
            type: 'svg',
            text: 'imu',
            properties: {
                src: 'src/assets/svg/imu.svg'
            },
            label: 'imu',
            icon: 'src/assets/svg/imu.svg',
        },
        {
            type: 'svg',
            text: 'lidar',
            properties: {
                src: 'src/assets/svg/lidar.svg'
            },
            label: 'lidar',
            icon: 'src/assets/svg/lidar.svg',
        },
        {
            type: 'svg',
            text: 'pedestrian',
            properties: {
                src: 'src/assets/svg/pedestrian.svg'
            },
            label: 'pedestrian',
            icon: 'src/assets/svg/pedestrian.svg',
        },
        {
            type: 'svg',
            text: 'radar',
            properties: {
                src: 'src/assets/svg/radar.svg'
            },
            label: 'radar',
            icon: 'src/assets/svg/radar.svg',
        },
        {
            type: 'svg',
            text: 'trafficlight',
            properties: {
                src: 'src/assets/svg/trafficlight.svg'
            },
            label: 'trafficlight',
            icon: 'src/assets/svg/trafficlight.svg',
        },
        {
            type: 'svg',
            text: 'truck',
            properties: {
                src: 'src/assets/svg/truck.svg'
            },
            label: 'truck',
            icon: 'src/assets/svg/truck.svg',
        },
        {
            label: 'polyline',
            icon: 'src/assets/svg/polyline.svg',
            callback: () => {
                lf.setDefaultEdgeType("polyline");
                selectedEdgeType = 'polyline'
            }
        },
        {
            label: 'generalization',
            icon: 'src/assets/svg/generalization.svg',
            callback: () => {
                lf.setDefaultEdgeType("generalization");
                selectedEdgeType = 'generalization'
            }
        },
        {
            label: 'dependency',
            icon: 'src/assets/svg/dependency.svg',
            callback: () => {
                lf.setDefaultEdgeType("dependency");
                selectedEdgeType = 'dependency'
            }
        },
        {
            label: 'aggregation',
            icon: 'src/assets/svg/aggregation.svg',
            callback: () => {
                lf.setDefaultEdgeType("aggregation");
                selectedEdgeType = 'aggregation'
            }
        },
        {
            label: 'composition',
            icon: 'src/assets/svg/composition.svg',
            callback: () => {
                lf.setDefaultEdgeType("composition");
                selectedEdgeType = 'composition'
            }
        },
    ]);
}
const initControl = () => {
    lf.extension.control.addItem({
        key: 'mini-export-xml',
        iconClass: "if-control-export-xml",
        title: "",
        text: "导出json",
        onClick: (lf, ev) => {
            const obj = lf.getGraphData()
            exportJson(obj, 'diagram')
        }
    });
    lf.extension.control.addItem({
        key: 'mini-export-img',
        iconClass: "if-control-export-img",
        title: "",
        text: "导出图片",
        onClick: (lf, ev) => {
            lf.getSnapshot();
        },
    });
    lf.extension.control.addItem({
        key: 'mini-home',
        iconClass: "if-control-home",
        title: "",
        text: "首页",
        onClick: (lf, ev) => {
            router.push('/home')
        },
    });
}
const initMenu = () => {
    lf.extension.menu.addMenuConfig({
        nodeMenu: [
            {
                text: "编辑属性",
                callback: (node) => {
                    currentNode.value = node
                    propertiesTmp = JSON.parse(JSON.stringify(node.properties))
                    showDrawer.value = true
                }
            }
        ]

    });
}
const initListener = () => {
    lf.on("connection:not-allowed", ({ msg }) => {
        msg && ElMessage.error(msg)
    });
    lf.on("anchor:drop", ({ _, __, nodeModel, edgeModel }) => {

        const targetNode = lf.getNodeModelById(edgeModel.targetNodeId)
        // if (nodeModel.type == 'functional_safety_requirement') {
        //     if (!(selectedEdgeType == 'dependency_refine' && targetNode.type == 'safety_goal')) {
        //         lf.deleteEdge(edgeModel.id)
        //         ElMessage.error('safety goal 与 functional safety requirement之间的关系只能是refine')
        //     }
        // }
    })

    // lf.on("node:dnd-add", ({ data }) => {
    //     //ObjectPerception自动连接一个ANN
    //     if (data.type === 'object_perception') {
    //         const sourceNodeId = data.id
    //         const targetNodeId = lf.addNode({
    //             type: 'ann',
    //             x: data.x + 180,
    //             y: data.y + 100,
    //             properties: {
    //                 title: 'ANN',
    //                 iconClass: 'AI-component',
    //                 type: 'ANN',
    //             },
    //         }).id
    //         lf.addEdge({
    //             type: 'composition',
    //             sourceNodeId,
    //             targetNodeId
    //         })
    //     }
    // });
}
const saveProperties = () => {
    lf.setProperties(currentNode.value.id, JSON.parse(JSON.stringify(propertiesTmp)))
    showDrawer.value = false
}
const registerCustomNode = () => {
    lf.batchRegister([class_diagram_radius, custom_group, svg, rect_radius, rect_dasharray, cnn, fmea, object_perception, perception, generalization, dependency, aggregation, composition])
}

</script>

<style lang="less">
.container {
    width: 100%;
    height: 100%;
}

.el-tree {
    --el-tree-node-content-height: 40px;

    .el-tree-node__content {
        align-items: center;
    }
}


.leaf-node,
.parent-node {
    display: inline-block;

}

.uml-wrapper {
    border: 1px;
    border-radius: 4px;
    position: relative;
    word-wrap: break-word;
    background-color: #fff;

    .uml-head {
        text-align: center;
        line-height: 39px;
    }

    .icon {
        position: absolute;
        left: 2px;
        top: 2px;
        height: 32px;
        width: 32px;
    }

    .AI-component {
        width: 32px;
        height: 32px;
        background-image: url('../assets/svg/AIComp.svg');
    }
}


.svg-wrapper {
    height: 100%;
    width: 100%;

    img {
        height: 100%;
        width: 100%;
    }
}

/* 遮罩层 */
.el-overlay {
    background-color: transparent;
}

.if-control-export-xml {
    background-image: url('../assets/svg/export.svg');
}

.if-control-export-img {
    background-image: url('../assets/svg/img.svg');
}

.if-control-home {
    background-image: url('../assets/svg/home.svg');
}

.lf-dnd-shape {
    background-size: contain;
}
</style>
