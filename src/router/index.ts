import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("@/views/Home.vue"),
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
