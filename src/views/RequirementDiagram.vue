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
</template>
<script setup>
import LogicFlow from "@logicflow/core";
import "@logicflow/core/dist/style/index.css";
import { reactive, ref, onMounted } from "vue"
import { OperationDesignCondition } from "@/components/CustomNode/index"
import { DndPanel, Menu, Control, SelectionSelect, Snapshot, lfJson2Xml, lfXml2Json } from "@logicflow/extension";
import { RectNode, RectNodeModel, PolylineEdge, PolylineEdgeModel } from "@logicflow/core";
import { roundedRect, odc, hara, safty_goal, functional_safty_requirement } from "@/components/CustomNode/index"
import { containment, dependency_copy, dependency_derive, dependency_satisfy, dependency_refine } from "@/components/CustomEdge/index"
import "@logicflow/extension/lib/style/index.css";
import { exportJson } from "@/utils/index"
import { useDiagramStore } from '@/stores/diagram'
let lf = null
const container = ref(null)
const showDrawer = ref(false)
const currentNode = ref(null)
let propertiesTmp = null
let selectedEdgeType = ''
const treeData = reactive([])

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
            type: 'roundedRect',
            text: 'design constraint',
            label: 'design constraint',
            icon: 'src/assets/svg/圆角矩形.svg',
        },
        {
            type: 'roundedRect',
            text: 'funtional requirement',
            label: 'funtional requirement',
            icon: 'src/assets/svg/圆角矩形.svg',
        },
        {
            type: 'safty_goal',
            text: 'safty goal',
            label: 'safty goal',
            icon: 'src/assets/svg/圆角矩形.svg',
        },
        {
            type: 'functional_safty_requirement',
            text: 'functional safty requirement',
            label: 'functional safty requirement',
            icon: 'src/assets/svg/圆角矩形.svg',
        },
        {
            type: 'odc',
            text: 'ODC',
            label: 'ODC',
            icon: 'src/assets/svg/圆角矩形.svg',
        },
        {
            type: 'hara',
            text: 'HARA',
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
        ElMessage.error(msg)
    });
    lf.on("anchor:drop", ({ _, __, nodeModel, edgeModel }) => {

        const targetNode = lf.getNodeModelById(edgeModel.targetNodeId)
        if (nodeModel.type == 'safty_goal') {
            if (!(selectedEdgeType == 'dependency_refine' && targetNode.type == 'functional_safty_requirement')) {
                lf.deleteEdge(edgeModel.id)
                ElMessage.error('safty goal只能用refine连线到 functional_safty_requirement')
            }
        }
    })
}
const initTreeInput = (prop) => {
    //构造treeData，写一个递归函数
    function convertObjectToTreeArray(obj) {
        function traverse(input) {
            const treeArray = [];

            for (const [key, value] of Object.entries(input)) {
                const node = { id: key, label: key };
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
    lf.batchRegister([roundedRect, odc, hara, safty_goal, functional_safty_requirement, containment, dependency_copy, dependency_derive, dependency_satisfy, dependency_refine])
}

</script>

<style>
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
</style>
