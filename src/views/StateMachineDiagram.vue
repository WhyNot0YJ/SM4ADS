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
import { class_diagram_radius } from "@/components/CustomNode/index"
import { original_state, failure_state, state, hazardous_event } from "@/components/CustomNode/StateMachineDiagram/index"
import { trigger } from "@/components/CustomEdge/stateMachineDiagram"
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
const form = reactive(
    {
        name: '',
        type: '',
        value: ''
    }
)
const rules = reactive({
    name: [
        { required: true, message: 'Please input name', trigger: 'blur' },
    ],
    type: [{ required: true, message: 'Please input type', trigger: 'blur' },]
})
const properties = ref([])
const clearForm = () => {
    Object.keys(form).forEach(key => {
        form[key] = ''
    })
}
const clearProperties = () => {
    properties.value = []
}
const addProperty = () => {
    properties.value.push(cloneDeep(form))
    clearForm()
}
const removeProperty = (index) => {
    properties.value.splice(index, 1)
}
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
            type: 'class_diagram_radius',
            properties: {
                title: 'Region',
                type: 'Region'
            },
            label: 'Region',
            icon: 'src/assets/svg/圆角矩形.svg',
        },
        {
            type: 'state',
            label: 'State',
            icon: 'src/assets/svg/state.svg',
        },
        {
            type: 'original_state',
            label: 'Original State',
            icon: 'src/assets/svg/originalState.svg',
        },
        {
            type: 'failure_state',
            label: 'Failure State',
            icon: 'src/assets/svg/failureState.svg',
        },
        {
            type: 'hazardous_event',
            label: 'Hazardous Event',
            properties: {
                type: 'Hazardous Event',
                title: 'Hazardous Event'
            },
            icon: 'src/assets/svg/矩形.svg',
        },
        {
            label: 'trigger',
            icon: 'src/assets/svg/trigger.svg',
            callback: () => {
                lf.setDefaultEdgeType("trigger");
                selectedEdgeType = 'trigger'
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
        //hazardous event自动连接一个failure state
        if (data.type === 'hazardous_event') {
            const sourceNodeId = data.id
            const targetNodeId = lf.addNode({
                type: 'failure_state',
                x: data.x + 180,
                y: data.y + 100,
            }).id
            lf.addEdge({
                type: 'trigger',
                sourceNodeId,
                targetNodeId
            })
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
    lf.batchRegister([class_diagram_radius, original_state, failure_state, state, hazardous_event, trigger])
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
