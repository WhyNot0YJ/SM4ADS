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
import { DndPanel, Menu, Control, SelectionSelect, Snapshot, lfJson2Xml, lfXml2Json } from "@logicflow/extension";
import { PolylineEdge, PolylineEdgeModel } from "@logicflow/core";
import { class_diagram_radius } from "@/components/CustomNode/index"
import { odc, hara, safety_goal, functional_safety_requirement } from "@/components/CustomNode/RequirementDiagram/index"
import { containment, dependency_copy, dependency_derive, dependency_satisfy, dependency_refine } from "@/components/CustomEdge/requirementDiagram"
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
        plugins: [Menu, Control, SelectionSelect, DndPanel, Snapshot]
    });
    initDndPanel()
    initControl()
    initMenu()
    initListener()
    registerCustomNode()
    console.log(useDiagramStore().getFile)
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
            type: 'class_diagram_radius',
            label: 'design constraint',
            properties: {
                title: 'design constraint',
                type: 'design constraint'
            },
            icon: 'src/assets/svg/圆角矩形.svg',
        },
        {
            type: 'class_diagram_radius',
            label: 'funtional requirement',
            properties: {
                title: 'funtional requirement',
                type: 'funtional requirement'
            },
            icon: 'src/assets/svg/圆角矩形.svg',
        },
        {
            type: 'safety_goal',
            properties: {
                title: 'safety goal',
                type: 'safety goal'
            },
            label: 'safety goal',
            icon: 'src/assets/svg/圆角矩形.svg',
        },
        {
            type: 'functional_safety_requirement',
            properties: {
                title: 'functional safety requirement',
                type: 'FSR'
            },
            label: 'FSR',
            icon: 'src/assets/svg/圆角矩形.svg',
        },
        {
            type: 'odc',
            properties: {
                title: 'ODC',
                type: 'ODC'
            },
            label: 'ODC',
            icon: 'src/assets/svg/圆角矩形.svg',
        },
        {
            type: 'hara',
            properties: {
                title: 'HARA',
                type: 'HARA'
            },
            label: 'HARA',
            icon: 'src/assets/svg/圆角矩形.svg',
        },
        {
            label: 'containment',
            icon: 'src/assets/svg/containment.svg',
            callback: () => {
                lf.setDefaultEdgeType("containment");
                selectedEdgeType = 'containment'
            }
        },
        {
            label: 'copy',
            icon: 'src/assets/svg/dependency.svg',
            callback: () => {
                lf.setDefaultEdgeType("dependency_copy");
                selectedEdgeType = 'dependency_copy'
            }
        },
        {
            label: 'derive',
            icon: 'src/assets/svg/dependency.svg',
            callback: () => {
                lf.setDefaultEdgeType("dependency_derive");
                selectedEdgeType = 'dependency_derive'
            }
        },
        {
            label: 'satisfy',
            icon: 'src/assets/svg/dependency.svg',
            callback: () => {
                lf.setDefaultEdgeType("dependency_satisfy");
                selectedEdgeType = 'dependency_satisfy'
            }
        },
        {
            label: 'refine',
            icon: 'src/assets/svg/dependency.svg',
            callback: () => {
                lf.setDefaultEdgeType("dependency_refine")
                selectedEdgeType = 'dependency_refine'
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
        ElMessage.error(msg)
    });
    lf.on("anchor:drop", ({ _, __, nodeModel, edgeModel }) => {

        const targetNode = lf.getNodeModelById(edgeModel.targetNodeId)
        if (nodeModel.type == 'functional_safety_requirement' && targetNode.type == 'safety_goal') {
            if (selectedEdgeType !== 'dependency_refine') {
                lf.deleteEdge(edgeModel.id)
                ElMessage.error('safety goal 与 functional safety requirement之间的关系只能是refine')
            }
        }
    })
}

const saveProperties = () => {
    lf.setProperties(currentNode.value.id, JSON.parse(JSON.stringify(propertiesTmp)))
    showDrawer.value = false
}
const registerCustomNode = () => {
    lf.batchRegister([class_diagram_radius, odc, hara, safety_goal, functional_safety_requirement, containment, dependency_copy, dependency_derive, dependency_satisfy, dependency_refine])
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
    position: relative;
    word-wrap: break-word;

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
        width: 24px;
        height: 24px;
        background-image: url('../assets/svg/AI.svg');
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
@/components/CustomEdge/requirementDiagram.ts@/components/CustomNode/RequirementDiagram/requirementDiagram