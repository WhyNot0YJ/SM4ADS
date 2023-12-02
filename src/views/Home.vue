<template>
  <div>
    <el-button @click="push('/diagram')">新建需求图</el-button>
    <el-upload ref="uploadRef" class="upload-demo" :auto-upload="false" :on-change="getFile" :show-file-list="false">
      <template #trigger>
        <el-button type="primary">打开需求图</el-button>
      </template>
    </el-upload>
  </div>
</template>

<script setup lang='ts'>
import router from "@/router";
import { UploadFile } from 'element-plus'
import { useRouter } from "vue-router"
import { useDiagramStore } from '@/stores/diagram'
import { readJson } from '@/utils/index'
const { push } = useRouter()
const diagramStore = useDiagramStore()
const getFile = async (file: UploadFile) => {
  if (!file.name.endsWith('.json')) {
    alert("请上传JSON文件")
  } else {
    diagramStore.file = await readJson(file.raw as File) as Object
    router.push({
      name: 'RequirementDiagram',
    })
  }
}
</script>

<style lang='less'></style>
