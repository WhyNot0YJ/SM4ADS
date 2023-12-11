<template>
    <div class="container" ref="container"></div>
    <el-drawer v-model="showDrawer" direction="rtl" :with-header="true" title="编辑节点">
        <el-tree :data="treeData" node-key="id" default-expand-all :expand-on-click-node="false">
            <template #default="{ node, data }">
                <span class="leaf-node" v-if="data.isLeaf">
                    {{ data.label }} :
                    <el-input v-model="data.value" placeholder="Please input" style="width: 120px;"
                        @input="(value) => handleInput(value, data)" />
                </span>
                <span v-else class="parent-node">
                    {{ data.label }}
                </span>
            </template>
        </el-tree>
        <div>
            <el-button @click="saveProperties">保存</el-button>
        </div>
    </el-drawer>
    <el-dialog v-model="dialogVisible" title="创建property" width="50%" :before-close="deleteProperty">
        <div v-for="property, index in properties" :key="index" class="property">
            {{ property.name }}{{ property.type ? ':' + property.type : '' }}
            {{ property.value ? '=' + property.value : '' }}
            <el-button @click="removeProperty(index)">
                <el-icon>
                    <Close />
                </el-icon>
            </el-button>
        </div>
        <el-form :model="form" label-width="120px" :rules="rules">
            <el-form-item label="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="type">
                <el-input v-model="form.type"></el-input>
            </el-form-item>
            <el-form-item label="value">
                <el-input v-model="form.value"></el-input>
            </el-form-item>
        </el-form>
        <div style="text-align: center;">
            <el-button @click="addProperty">
                <el-icon>
                    <Plus />
                </el-icon>
                添加属性
            </el-button>
        </div>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="deleteProperty">Cancel</el-button>
                <el-button type="primary" @click="createProperty">
                    Confirm
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
import LogicFlow from "@logicflow/core";
import "@logicflow/core/dist/style/index.css";
import { reactive, ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { DndPanel, Menu, Control, SelectionSelect, Snapshot, lfJson2Xml, lfXml2Json } from "@logicflow/extension";
import { PolylineEdge, PolylineEdgeModel } from "@logicflow/core";
import { class_diagram_radius, svg, class_diagram } from "@/components/CustomNode/index"
import { } from "@/components/CustomNode/InternalBlockDiagram/index"
import { equal_connector, bidirection_connector, unidirection_connector } from "@/components/CustomEdge/internalBlockDiagram"
import { generalization, dependency, aggregation, composition } from "@/components/CustomEdge/blockDefinitionDiagram"
import "@logicflow/extension/lib/style/index.css";
import { exportJson } from "@/utils/index"
import { useDiagramStore } from '@/stores/diagram'
import { cloneDeep } from 'lodash'

let lf = null
const container = ref(null)
const showDrawer = ref(false)
const currentNode = ref(null)
let propertiesTmp = null
let selectedEdgeType = ''
const treeData = reactive([])
const router = useRouter()
const dialogVisible = ref(false)
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
            label: 'component',
            properties: {
                title: 'component',
                type: 'component'
            },
            icon: 'src/assets/svg/圆角矩形.svg',
        },
        {
            type: 'class_diagram_radius',
            label: 'AI Component',
            properties: {
                title: 'AI Component',
                iconClass: 'AI-component',
                type: 'AI Component'
            },
            icon: 'src/assets/svg/AIcomponent.svg',
        },
        {
            type: 'svg',
            properties: {
                src: 'src/assets/svg/syncBar.svg'
            },
            label: 'Synchronous barrier',
            icon: 'src/assets/svg/syncBar.svg',
        },
        {
            type: 'svg',
            properties: {
                src: 'src/assets/svg/legVeri.svg'
            },
            label: 'Legal verification',
            icon: 'src/assets/svg/legVeri.svg',
        },
        {
            type: 'svg',
            properties: {
                src: 'src/assets/svg/disp.svg'
            },
            label: 'Dispatcher',
            icon: 'src/assets/svg/disp.svg',
        },
        {
            type: 'svg',
            properties: {
                src: 'src/assets/svg/mSelect.svg'
            },
            label: 'Multi-selector',
            icon: 'src/assets/svg/mSelect.svg',
        },
        {
            type: 'class_diagram',
            label: 'property',
            properties: {
                title: 'property',
                type: 'property'
            },
            icon: 'src/assets/svg/矩形.svg',
        },
        {
            label: 'item flow',
            icon: 'src/assets/svg/itemFlow.svg',
            callback: () => {
                lf.setDefaultEdgeType("polyline");
                selectedEdgeType = 'polyline'
            }
        },
        {
            label: 'equal connector',
            icon: 'src/assets/svg/connector.svg',
            callback: () => {
                lf.setDefaultEdgeType("equal_connector");
                selectedEdgeType = 'equal_connector'
            }
        },
        {
            label: 'bidirecion connector',
            icon: 'src/assets/svg/connector.svg',
            callback: () => {
                lf.setDefaultEdgeType("bidirection_connector");
                selectedEdgeType = 'bidirection_connector'
            }
        },
        {
            label: 'unidirecion connector',
            icon: 'src/assets/svg/connector.svg',
            callback: () => {
                lf.setDefaultEdgeType("unidirection_connector");
                selectedEdgeType = 'unidirection_connector'
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
                    initTreeInput(propertiesTmp)
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
const initTreeInput = (prop) => {
    //构造treeData，写一个递归函数
    const whiteList = ['nodeSize', 'iconClass', 'type', 'src']
    function convertObjectToTreeArray(obj) {
        function traverse(input) {
            const treeArray = [];

            for (const [key, value] of Object.entries(input)) {
                const node = { id: key, label: key };
                if (whiteList.indexOf(key) != -1) {//解决resize后出现nodeSize问题
                    continue;
                }
                if (typeof value === 'object' && value !== null) {
                    node.value = undefined
                    node.children = traverse(value);
                    node.isLeaf = false
                } else {
                    node.value = value
                    node.isLeaf = true
                }
                treeArray.push(node);
            }

            return treeArray;
        }
        return traverse(obj);

    }

    //每次清空treeData
    treeData.length = 0
    convertObjectToTreeArray(prop).forEach(item => {
        treeData.push(item)
    })

}
const handleInput = (value, node) => {
    node.value = value
    //修改properties
    const setValueByKey = (obj, key, value) => {
        Object.entries(obj).forEach(([prop, val]) => {
            if (prop === key) {
                obj[prop] = value;
            } else if (typeof val === 'object' && val !== null) {
                setValueByKey(val, key, value);
            }
        });
    };
    //同步propertiesTmp数据
    setValueByKey(propertiesTmp, node.label, value)
}
const saveProperties = () => {
    lf.setProperties(currentNode.value.id, JSON.parse(JSON.stringify(propertiesTmp)))
    showDrawer.value = false
}
const registerCustomNode = () => {
    lf.batchRegister([class_diagram_radius, svg, class_diagram, equal_connector, bidirection_connector, unidirection_connector])
}
const createProperty = () => {
    //构建properties
    const nodeProperties = {}
    properties.value.forEach(item => {
        nodeProperties[`${item.name} : ${item.type}`] = item.value
    })
    console.log(nodeProperties)
    lf.setProperties(currentPropertyId, nodeProperties)
    dialogVisible.value = false
}
const deleteProperty = () => {
    dialogVisible.value = false
    lf.deleteNode(currentPropertyId)
    clearForm()
    clearProperties()
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

.outline {
    border: 1px red solid
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
    border: 1px solid #000;
    position: relative;
    word-wrap: break-word;
    background-color: #fff;

    .uml-head,
    .class-head {
        text-align: center;
        border-bottom: 1px solid #000;
        line-height: 40px;
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
