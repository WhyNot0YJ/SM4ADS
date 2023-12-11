<template>
    <el-header>
        <div class="logo"><img src="@/assets/img/logo.jpg" alt=""></div>

        <div class="text">Trustworthy AI in CPS：Modeling, Simulation and Verification</div>
        <div class="btn">
            <el-button>Register</el-button>
            <el-button>Login</el-button>
        </div>
    </el-header>
    <router-view></router-view>
</template>

<script setup lang='ts'>

</script>

<style lang='less'>
.el-header {
    background-color: #001529;
    height: 64px;
    padding: 0 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .text {
        color: #fff;
        font-size: 30px;
        font-weight: 400;
        text-align: center;
    }

    .logo {
        width: 36px;
        height: 36px;
        margin: 16px 0 16px 0;

        img {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
