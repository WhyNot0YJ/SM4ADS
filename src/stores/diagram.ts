import { defineStore } from "pinia";

export const useDiagramStore = defineStore("diagram", {
  state: () => {
    return {
      file: {},
      project: {
        projectName: "",
        author: "",
        description: "",
      },
      diagram: {
        diagramName: "",
        author: "",
        description: "",
      },
    };
  },
  getters: {
    getFile(state) {
      return state.file;
    },
    getProjectName(state) {
      return state.project.projectName;
    },
    getDiagramName(state) {
      return state.project.projectName;
    },
  },
  actions: {
    clearFile() {
      this.file = {};
    },
  },
});
