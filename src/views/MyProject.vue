<template>
    <div class="my-project">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
            <el-breadcrumb-item>My Project</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="title">My Project</div>
        <el-dialog v-model="dialogVisible" title="Add Project" width="50%">
            <el-form :model="form" label-width="140px" :rules="rules">
                <el-form-item label="Project Name" prop="projectName">
                    <el-input v-model="form.projectName" />
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
        <div class="project-list">
            <el-tooltip effect="dark" content="Press to add a new project!" placement="top">
                <div class="add" @click="dialogVisible = true">
                    <img src="@/assets/svg/add.svg" alt="">
                </div>
            </el-tooltip>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useDiagramStore } from '@/stores/diagram';
const diagramStore = useDiagramStore()
const router = useRouter()
const dialogVisible = ref(false)
const form = reactive({
    projectName: '',
    author: '',
    description: ''
})
const rules = reactive({
    projectName: [
        { required: true, message: 'Please input project name', trigger: 'blur' },
    ],
})

const handleSubmit = () => {
    diagramStore.project = form
    router.push('/selectDiagram')
}
</script>

<style lang='less' scoped>
.my-project {
    margin: 24px 64px;

    .title {
        margin-top: 12px;
        font-size: 48px;
        font-weight: bold;
    }

    .project-list {
        display: flex;

        .add {
            margin-top: 36px;
        }
    }
}

:deep(.el-overlay) {
    background-color: var(--el-overlay-color-lighter) !important;
}
</style>
