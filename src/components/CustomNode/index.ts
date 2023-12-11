import { RectResize, HtmlResize } from "@logicflow/extension";
// import { h } from "@logicflow/core";
export const whiteList = ["nodeSize", "title", "iconClass", "type"];
//圆角矩形
// class ClassDiagramModel extends RectResize.model {
//   initNodeData(data: any) {
//     super.initNodeData(data);
//     //如果是空对象则
//     if (Object.keys(data.properties).length === 1) {
//       this.setProperties({
//         description: "",
//       });
//     } else {
//       this.setProperties(data.properties);
//     }
//   }
// }
// class ClassDiagram extends RectResize.view {
//   private getLabelShape() {
//     const { model } = this.props;
//     const { x, y, width, height } = model;
//     const style = model.getNodeStyle();

//     return h(
//       "svg",
//       {
//         x: x - width / 2 + 5,
//         y: y - height / 2 + 5,
//         width: 25,
//         height: 25,
//         viewBox: "0 0 1274 1024",
//       },
//       h("path", {
//         fill: style.stroke,
//         d: "M655.807326 287.35973m-223.989415 0a218.879 218.879 0 1 0 447.978829 0 218.879 218.879 0 1 0-447.978829 0ZM1039.955839 895.482975c-0.490184-212.177424-172.287821-384.030443-384.148513-384.030443-211.862739 0-383.660376 171.85302-384.15056 384.030443L1039.955839 895.482975z",
//       })
//     );
//   }
//   getResizeShape() {
//     const { model } = this.props;
//     const { x, y, width, height, radius, properties } = model;
//     const style = model.getNodeStyle();
//     return h("g", {}, [
//       h("rect", {
//         ...style,
//         x: x - width / 2,
//         y: y - height / 2,
//         rx: radius,
//         ry: radius,
//         width,
//         height,
//       }),
//       this.getLabelShape(),
//     ]);
//   }
// }
// export const rounded_rect = {
//   type: "rounded_rect",
//   model: ClassDiagramModel,
//   view: ClassDiagram,
// };

//生成propertis数组
const initArray = (prop: any) => {
  //构造treeData，写一个递归函数
  function convertObjectToArray(obj: Object) {
    const treeArray: Array<Object> = [];
    function traverse(input: Object) {
      for (const [key, value] of Object.entries(input)) {
        const node = { key, value };
        if (whiteList.indexOf(key) != -1) {
          continue;
        }
        if (typeof value === "object" && value !== null) {
          traverse(value);
        } else if (value) {
          treeArray.push(node);
        }
      }

      return treeArray;
    }
    return traverse(obj);
  }

  return convertObjectToArray(prop);
};
//近似类图
export class ClassDiagramRadiusModel extends HtmlResize.model {
  initNodeData(data: any) {
    super.initNodeData(data);
    this.width = 300;
    this.height = 80;
    let num = 0;
    whiteList.forEach((item) => {
      data.properties.hasOwnProperty(item) && num++;
    });
    if (Object.keys(data.properties).length === num) {
      this.setProperties({
        description: "",
      });
    } else {
      this.setProperties(data.properties);
    }
  }
  setAttributes() {
    this.text.editable = false;
  }
}

export class ClassDiagramRadius extends HtmlResize.view {
  setHtml(rootEl: HTMLElement) {
    const { properties } = this.props.model;
    const propertiesStr = initArray(properties)
      .map((item: any) => {
        return `<div>${item.key} : ${item.value}</div>`;
      })
      .join("");
    const el = document.createElement("div");
    el.className = "uml-wrapper";
    const html = `
      <div>
        <div class="${properties.iconClass || ""} icon"></div>
        <div class="uml-head">
          <div>《${properties.type}》</div> 
          <div>${properties.title}</div>
        </div>
        <div class="uml-body">
         ${propertiesStr}
        </div>
      </div>
    `;
    el.innerHTML = html;
    el.style.width = `${this.props.model.width - 2}px`;
    el.style.height = `${this.props.model.height - 2}px`;
    // 需要先把之前渲染的子节点清除掉。
    rootEl.innerHTML = "";
    rootEl.appendChild(el);
  }
}

export const class_diagram_radius = {
  type: "class_diagram_radius",
  model: ClassDiagramRadiusModel,
  view: ClassDiagramRadius,
};

//渲染一个svg图
export class SvgModel extends HtmlResize.model {
  initNodeData(data: any) {
    super.initNodeData(data);
    this.width = 80;
    this.height = 80;
  }
  setAttributes() {
    this.text.editable = false;
  }
}

export class Svg extends HtmlResize.view {
  setHtml(rootEl: HTMLElement) {
    const { properties } = this.props.model;
    const el = document.createElement("div");
    el.className = "svg-wrapper";
    const html = `
      <img src='${properties.src}'>
    `;
    el.innerHTML = html;
    // 需要先把之前渲染的子节点清除掉。
    rootEl.innerHTML = "";
    rootEl.appendChild(el);
  }
}

export const svg = {
  type: "svg",
  model: SvgModel,
  view: Svg,
};

//类图
export class ClassDiagramModel extends HtmlResize.model {
  initNodeData(data: any) {
    super.initNodeData(data);
    this.width = 300;
    this.height = 80;
    let num = 0;
    whiteList.forEach((item) => {
      data.properties.hasOwnProperty(item) && num++;
    });
    if (Object.keys(data.properties).length === num) {
      this.setProperties({
        description: "",
      });
    } else {
      this.setProperties(data.properties);
    }
  }
  setAttributes() {
    this.text.editable = false;
  }
}

export class ClassDiagram extends HtmlResize.view {
  setHtml(rootEl: HTMLElement) {
    const { properties } = this.props.model;
    const propertiesStr = initArray(properties)
      .map((item: any) => {
        return `<div>${item.key} = ${item.value}</div>`;
      })
      .join("");
    const el = document.createElement("div");
    el.className = "class-wrapper";
    const html = `
      <div>
        <div class="class-head">
          <span>${properties.title}:</span>
          <span>${properties.type}</span> 
        </div>
        <div class="class-body">
         ${propertiesStr}
        </div>
      </div>
    `;
    el.innerHTML = html;
    el.style.width = `${this.props.model.width - 2}px`;
    el.style.height = `${this.props.model.height - 2}px`;
    // 需要先把之前渲染的子节点清除掉。
    rootEl.innerHTML = "";
    rootEl.appendChild(el);
  }
}

export const class_diagram = {
  type: "class_diagram",
  model: ClassDiagramModel,
  view: ClassDiagram,
};
