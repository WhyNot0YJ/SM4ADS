<script setup>
import { defineProps, reactive, watch } from 'vue'
const treeData = reactive([])
const props = defineProps({
    propertiesTmp: Object
})
const initTreeInput = (prop) => {
    //构造treeData，写一个递归函数
    const whiteList = ['nodeSize', 'iconClass', 'type']
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

watch(() => props.propertiesTmp, (newVal, oldVal) => {
    initTreeInput(newVal)
}, {
    immediate: true
})

const handleInput = (value, node) => {
    node.value = value
    console.log(value, node)
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
    setValueByKey(props.propertiesTmp, node.label, value)
}
</script>
<template>
    <el-tree :data="treeData" node-key="id" default-expand-all :expand-on-click-node="false">
        <template #default="{ node, data }">
            <span class="leaf-node" v-if="data.isLeaf">
                <template v-if="data.label === 'backgroundColor'">
                    {{ data.label }} :
                    <el-color-picker v-model="data.value" @change="(value) => handleInput(value, data)" />
                </template>
                <template v-else-if="data.label === 'textColor'">
                    {{ data.label }} :
                    <el-color-picker v-model="data.value" @change="(value) => handleInput(value, data)" />
                </template>
                <template v-else-if="data.label === 'borderColor'">
                    {{ data.label }} :
                    <el-color-picker v-model="data.value" @change="(value) => handleInput(value, data)" />
                </template>
                <template v-else-if="data.label === 'dashed'">
                    {{ data.label }} :
                    <el-switch v-model="data.value" @change="(value) => handleInput(value, data)" />
                </template>
                <template v-else>
                    {{ data.label }} :
                    <el-input v-model="data.value" placeholder="Please input" style="width: 120px;"
                        @input="(value) => handleInput(value, data)" />
                </template>

            </span>
            <span v-else class="parent-node">
                {{ data.label }}
            </span>
        </template>
    </el-tree>
</template>