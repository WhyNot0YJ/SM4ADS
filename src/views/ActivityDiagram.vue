<template>
    <div class="container" ref="container"></div>
    <el-drawer v-model="showDrawer" direction="rtl" :with-header="true" title="编辑节点">
       <EditProperties :propertiesTmp="propertiesTmp"></EditProperties>
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
import { DndPanel, Menu, Control, SelectionSelect, Snapshot, lfJson2Xml, lfXml2Json } from "@logicflow/extension";
import { PolylineEdge, PolylineEdgeModel } from "@logicflow/core";
import { svg, class_diagram } from "@/components/CustomNode/index"
import { risk_propagation, initial, activity_final, flow_final, decision_node, merge_node, fork_node, join_node } from "@/components/CustomNode/ActivityDiagram/index"
import { object_flow, control_flow } from "@/components/CustomEdge/activityDiagram"
import "@logicflow/extension/lib/style/index.css";
import { exportJson } from "@/utils/index"
import { useDiagramStore } from '@/stores/diagram'
import { cloneDeep } from 'lodash'
import EditProperties from '@/components/EditProperties.vue'
let lf = null
const container = ref(null)
const showDrawer = ref(false)
const currentNode = ref(null)
let propertiesTmp = null
let selectedEdgeType = ''
const router = useRouter()
let currentPropertyId = null

onMounted(() => {
    lf = new LogicFlow({
        container: container.value,
        grid: true,
        keyboard: {
            enabled: true,
        },
        // 注册组件
        plugins: [Menu, Control, SelectionSelect, DndPanel, Snapshot]
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
            type: 'risk_propagation',
            properties: {
                title: 'Risk Propagation',
                type: 'Risk Propagation'
            },
            label: 'Risk Propagation',
            icon: 'src/assets/svg/圆角矩形.svg',
        },
        {
            type: 'initial',
            label: 'Initial',
            icon: 'src/assets/svg/initial.svg',
        },
        {
            type: 'activity_final',
            label: 'Activity Final',
            icon: 'src/assets/svg/activityFinal.svg',
        },
        {
            type: 'flow_final',
            label: 'Flow Final',
            icon: 'src/assets/svg/flowFinal.svg',
        },
        {
            type: 'decision_node',
            label: 'Decision Node',
            icon: 'src/assets/svg/decisionNode.svg',
        },
        {
            type: 'merge_node',
            label: 'Merge Node',
            icon: 'src/assets/svg/mergeNode.svg',
        },
        {
            type: 'fork_node',
            label: 'Fork Node',
            icon: 'src/assets/svg/forkNode.svg',
        },
        {
            type: 'join_node',
            label: 'Join Node',
            icon: 'src/assets/svg/joinNode.svg',
        },

        {
            label: 'object flow',
            icon: 'src/assets/svg/objectFlow.svg',
            callback: () => {
                lf.setDefaultEdgeType("object_flow");
                selectedEdgeType = 'object_flow'
            }
        },
        {
            label: 'control flow',
            icon: 'src/assets/svg/controlFlow.svg',
            callback: () => {
                lf.setDefaultEdgeType("control_flow");
                selectedEdgeType = 'control_flow'
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
    lf.on("node:dnd-add", ({ data }) => {
        if (data.type == 'class_diagram') {
            currentPropertyId = data.id
            dialogVisible.value = true
        }
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
}
const saveProperties = () => {
    lf.setProperties(currentNode.value.id, JSON.parse(JSON.stringify(propertiesTmp)))
    showDrawer.value = false
}
const registerCustomNode = () => {
    lf.batchRegister([risk_propagation, initial, activity_final, svg, class_diagram, object_flow, control_flow, flow_final, decision_node, merge_node, fork_node, join_node])
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
    border-radius: 4px;
}


.uml-wrapper,
.class-wrapper {
    position: relative;
    word-wrap: break-word;
    background-color: #fff;

    .uml-head,
    .class-head {
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

    .port {
        width: 20px;
        height: 20px;
        border: 1px solid #000;
        background-color: white;
        position: absolute;
        text-align: center;
    }

    .pleft {
        top: calc(50% - 10px);
        left: -10px;
    }

    .pright {
        top: calc(50% - 10px);
        right: -10px;
    }

    .ptop {
        top: -10px;
        left: calc(50% - 10px);
    }

    .pbottom {
        bottom: -10px;
        left: calc(50% - 10px)
    }
}

.property {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 20px;

}

.svg-wrapper {
    width: 100%;
    height: 100%;

    img {
        width: 100%;
        height: 100%;
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
</style>
