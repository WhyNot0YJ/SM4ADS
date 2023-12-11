import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("@/views/Main.vue"),
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("@/views/Home.vue"),
      },
      {
        path: "/myProject",
        name: "MyProject",
        component: () => import("@/views/MyProject.vue"),
      },
      {
        path: "/selectDiagram",
        name: "SelectDiagram",
        component: () => import("@/views/SelectDiagram.vue"),
      },
    ],
  },
  {
    path: "/diagram",
    redirect: "/diagram/requirementDiagram",
    children: [
      {
        path: "requirementDiagram",
        name: "RequirementDiagram",
        component: () => import("@/views/RequirementDiagram.vue"),
      },
      {
        path: "blockDefinitionDiagram",
        name: "BlockDefinitionDiagram",
        component: () => import("@/views/BlockDefinitionDiagram.vue"),
      },
      {
        path: "internalBlockDiagram",
        name: "InternalBlockDiagram",
        component: () => import("@/views/InternalBlockDiagram.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

//路由前置守卫
router.beforeEach(async (to, from, next) => {
  next();
});

export default router;
