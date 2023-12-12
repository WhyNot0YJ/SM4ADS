<template>
  <div class="container">
    <el-menu default-active="RequirementDiagram" class="menu" @select="handleSelect">
      <el-sub-menu index="1">
        <template #title>
          <span>Model-driven Modeling</span>
        </template>
        <el-menu-item index="RequirementDiagram">Requirement Diagram</el-menu-item>
        <el-sub-menu index="2">
          <template #title>Behavior Diagram</template>
          <el-menu-item index="ActivityDiagram">Activity Diagram</el-menu-item>
          <el-menu-item index="SequenceDiagram">Sequence Diagram</el-menu-item>
          <el-menu-item index="StateMachineDiagram">State Machine Diagram</el-menu-item>
          <el-menu-item index="UseCaseDiagram">Use Case Diagram</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>Structure Diagram</template>
          <el-menu-item index="BlockDefinitionDiagram">Block Definition Diagram</el-menu-item>
          <el-menu-item index="InternalBlockDiagram">Internal Block Diagram</el-menu-item>
          <el-menu-item index="PackageDiagram">Package Diagram</el-menu-item>
          <el-menu-item index="ArtificialNeuralNetworkDiagram">Artificial Neural Network Diagram</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
    </el-menu>
    <div class="select-diagram">
      <div class="header">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/myProject' }">My Project</el-breadcrumb-item>
          <el-breadcrumb-item>{{ diagramStore.getProjectName }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-upload class="upload-demo" :limit="1" :auto-upload="false" :show-file-list="false" :on-change="getFile">
          <template #trigger>
            <el-button type="primary">Select Json</el-button>
          </template>
        </el-upload>
      </div>

      <el-dialog v-model="dialogVisible" title="Add Diagram" width="50%">
        <el-form :model="form" label-width="140px" :rules="rules">
          <el-form-item label="Diagram Name" prop="diagramName">
            <el-input v-model="form.diagramName" />
          </el-form-item>
          <el-form-item label="Author">
            <el-input v-model="form.author" />
          </el-form-item>
          <el-form-item label="Description">
            <el-input v-model="form.description" type="textarea" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="handleSubmit">
              Submit
            </el-button>
          </span>
        </template>
      </el-dialog>
      <div class="diagram-list">
        <el-tooltip effect="dark" content="Press to add a new diagram!" placement="top">
          <div class="add" @click="dialogVisible = true">
            <img src="@/assets/svg/add.svg" alt="">
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>
  
<script setup lang='ts'>
import { ref, reactive } from 'vue'
import { UploadFile } from 'element-plus'
import { useRouter } from "vue-router"
import { useDiagramStore } from '@/stores/diagram'
import { readJson } from '@/utils/index'
const { push } = useRouter()
const diagramStore = useDiagramStore()

const getFile = async (file: UploadFile) => {
  console.log(file)
  if (!file.name.endsWith('.json')) {
    alert("请上传JSON文件")
  } else {
    diagramStore.file = await readJson(file.raw as File) as Object
    push({
      name: diagramType.value
    })
  }
}
const dialogVisible = ref(false)
const form = reactive({
  diagramName: '',
  author: '',
  description: ''
})
const rules = reactive({
  diagramName: [
    { required: true, message: 'Please input project name', trigger: 'blur' },
  ],
})

const diagramType = ref('RequirementDiagram')
const handleSelect = (index: string) => {
  diagramType.value = index
}
const handleSubmit = () => {
  diagramStore.diagram = form
  push({
    name: diagramType.value
  })
  dialogVisible.value = false
}
</script>
  
<style lang='less' scoped>
.container {
  display: flex;
  min-height: calc(100vh - 64px);
  background-color: rgb(240, 242, 245);

  .menu {
    min-height: calc(100vh - 64px);
  }

  :deep(.el-menu) {
    flex: 0 0 250px;
    width: 250px;
    height: 100%;
    border-right: 0px;
    background: rgb(250, 250, 250);

    .el-menu-item.is-active {
      background-color: #e6f7ff;
      border-right: 3px solid var(--el-menu-active-color);
    }

    .select-diagram {
      background-color: #f0f2f5
    }
  }

  .select-diagram {
    flex: 1;

    margin: 32px 64px;


    .diagram-list {
      display: flex;

      .add {
        margin: 64px 64px 64px 0
      }
    }

    .header {
      display: flex;
      justify-content: space-between;
    }
  }

  :deep(.el-overlay) {
    background-color: var(--el-overlay-color-lighter) !important;
  }
}
</style>
  