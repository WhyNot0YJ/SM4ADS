<template>
  <el-carousel trigger="click" height="200px">
    <el-carousel-item>
      <h3 class="carousel-img">{{ "Modeling轮播图片占位" }}</h3>
    </el-carousel-item>
    <el-carousel-item>
      <h3 class="carousel-img">{{ "Simulation轮播图片占位" }}</h3>
    </el-carousel-item>
    <el-carousel-item>
      <h3 class="carousel-img">{{ "Verification轮播图片占位" }}</h3>
    </el-carousel-item>
  </el-carousel>
  <div class="card-wrapper">
    <el-row>
      <el-col :span="8" class="card">
        <el-card :body-style="{ padding: '0px' }" shadow="never">
          <img src="@/assets/img/card1.png" class="image" />
          <div class="card-body">
            <div class="title">智能系统建模</div>
            <div class="description">Intelligent System Modeling</div>
            <div class="more-description">这里是关于智能系统建模的介绍，但是因为现在我还没有文案，所以这部分需要之后替换。为保证美观，请尽量保持各模块介绍部分文字量相近。</div>
            <div class="link-selection">
              <div class="link-text" @click="router.push('/myProject')">工具</div>
            </div>
          </div>

        </el-card>
      </el-col>
      <el-col :span="8" class="card">
        <el-card :body-style="{ padding: '0px' }" shadow="never">
          <img src="@/assets/img/card2.png" class="image" />
          <div class="card-body">
            <div class="title">数据预处理</div>
            <div class="description">Data Preprocessing</div>
            <div class="more-description">这里是关于数据预处理模块的介绍，但是因为现在我还没有文案，所以这部分需要之后替换。为保证美观，请尽量保持各模块介绍部分文字量相近。</div>
            <div class="link-selection">
              <div class="link-text">文档</div>
              <div class="link-divider">|</div>
              <div class="link-text">示例</div>
            </div>
          </div>

        </el-card>
      </el-col>
      <el-col :span="8" class="card">
        <el-card :body-style="{ padding: '0px' }" shadow="never">
          <img src="@/assets/img/card1.png" class="image" />
          <div class="card-body">
            <div class="title">自动驾驶场景建模
              Autonomous</div>
            <div class="description">Intelligent System Modeling</div>
            <div class="more-description">这里是关于自动驾驶场景建模的介绍，但是因为现在我还没有文案，所以这部分需要之后替换。为保证美观，请尽量保持各模块介绍部分文字量相近。</div>
            <div class="link-selection">
              <div class="link-text">文档</div>
              <div class="link-divider">|</div>
              <div class="link-text">示例</div>
            </div>
          </div>

        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8" class="card">
        <el-card :body-style="{ padding: '0px' }" shadow="never">
          <img src="@/assets/img/card4.png" class="image" />
          <div class="card-body">
            <div class="title">自动驾驶决策生成</div>
            <div class="description">Autonomous Driving Decision Making</div>
            <div class="more-description">这里是关于自动驾驶决策生成模块的介绍，但是因为现在我还没有文案，所以这部分需要之后替换。为保证美观，请尽量保持各模块介绍部分文字量相近。</div>
            <div class="link-selection">
              <div class="link-text">文档</div>
              <div class="link-divider">|</div>
              <div class="link-text">示例</div>
            </div>
          </div>

        </el-card>
      </el-col>
      <el-col :span="8" class="card">
        <el-card :body-style="{ padding: '0px' }" shadow="never">
          <img src="@/assets/img/card5.png" class="image" />
          <div class="card-body">
            <div class="title">仿真与验证</div>
            <div class="description">Simulation and Verification</div>
            <div class="more-description">这里是关于仿真与验证模块的介绍，但是因为现在我还没有文案，所以这部分需要之后替换。为保证美观，请尽量保持各模块介绍部分文字量相近。</div>
            <div class="link-selection">
              <div class="link-text">文档</div>
              <div class="link-divider">|</div>
              <div class="link-text">示例</div>
            </div>
          </div>

        </el-card>
      </el-col>
      <el-col :span="8" class="card">
        <el-card :body-style="{ padding: '0px' }" shadow="never">
          <img src="@/assets/img/card6.png" class="image" />
          <div class="card-body">
            <div class="title">案例研究</div>
            <div class="description">ICase Study</div>
            <div class="more-description">这里是关于案例研究模块的介绍，但是因为现在我还没有文案，所以这部分需要之后替换。为保证美观，请尽量保持各模块介绍部分文字量相近。</div>
            <div class="link-selection">
              <div class="link-text">文档</div>
              <div class="link-divider">|</div>
              <div class="link-text">示例</div>
            </div>
          </div>

        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang='ts'>
import { useRouter } from 'vue-router';
const router = useRouter()
</script>

<style lang='less'>
.el-carousel {
  .carousel-img {
    height: 200px;
    color: rgb(255, 255, 255);
    line-height: 200px;
    text-align: center;
    background: rgb(54, 77, 121);
  }
}

.card-wrapper {
  padding: 24px 160px;

  .card {
    padding: 0 16px;

    .el-card {
      border: none;

      .image {
        width: 100%;
        aspect-ratio: 4 / 3;
      }

      .card-body {
        font-size: 15px;
        padding: 24px 24px 24px 0;

        .title {
          font-size: 20px;
          color: #000;
          cursor: pointer;
          margin-bottom: 8px;
        }

        .description {
          font-size: 15px;
          color: #000;
          cursor: pointer;
        }

        .more-description {
          margin-top: 14px;
        }

        .link-selection {
          padding-top: 14px;
          display: flex;

          .link-text {
            color: #364D79;
            cursor: pointer;
          }
        }

        .link-divider {
          margin: 0 6px;
        }
      }


    }
  }
}
</style>
