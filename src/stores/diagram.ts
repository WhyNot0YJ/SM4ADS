import { defineStore } from "pinia";

export const useDiagramStore = defineStore("diagram", {
  state: () => {
    return { file: {} };
  },
  getters: {
    getFile(state) {
      return state.file;
    },
  },
  actions: {
    clearFile() {
      this.file = {};
    },
  },
});
