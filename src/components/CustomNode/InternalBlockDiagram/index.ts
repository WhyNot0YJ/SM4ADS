import { whiteList, initArray } from "../index";
import { HtmlResize } from "@logicflow/extension";
import { h } from "@logicflow/core";
//近似类图
class PortComponentModel extends HtmlResize.model {
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
        port: {
          left: {
            leftPortType: "n",
          },
          right: {
            rightPortType: "n",
          },
          top: {
            topPortType: "n",
          },
          bottom: {
            bottomPortType: "n",
          },
        },
      });
    } else {
      this.setProperties(data.properties);
    }
    const rule = {
      message: "只允许Port锚点连出",
      validate: (
        sourceNode: any,
        targetNode: any,
        sourceAnchor: any,
        targetAnchor: any
      ) => {
        console.log(sourceAnchor);
        const port = sourceNode.properties.port;
        if (port) {
          return port[sourceAnchor.name][`${sourceAnchor.name}PortType`] !== "n";
        }
        return true;
      },
    };
    this.sourceRules.push(rule);
  }
  setAttributes() {
    this.text.editable = false;
  }
  getDefaultAnchor() {
    const { width, height, x, y, id } = this;
    return [
      {
        x: x - width / 2,
        y,
        name: "left",
        id: `${id}_1`,
      },
      {
        x: x + width / 2,
        y,
        name: "right",
        id: `${id}_3`,
      },
      {
        x: x,
        y: y - height / 2,
        name: "bottom",
        id: `${id}_2`,
      },
      {
        x: x,
        y: y + height / 2,
        name: "top",
        id: `${id}_4`,
      },
    ];
  }
}

class PortComponent extends HtmlResize.view {
  setHtml(rootEl: HTMLElement) {
    const { properties } = this.props.model;
    const { left, right, bottom, top } = properties.port;
    const propertiesStr = initArray(properties)
      .map((item: any) => {
        return `<div>${item.key} : ${item.value}</div>`;
      })
      .join("");
    let portStr = "";
    //生成portStr
    switch (left.leftPortType) {
      case "n": {
        break;
      }
      case "f": {
        portStr += `<div class="port pleft">f1</div>`;
        break;
      }
      case "p": {
        portStr += `<div class="port pleft">p1</div>`;
        break;
      }
    }
    switch (right.rightPortType) {
      case "n": {
        break;
      }
      case "f": {
        portStr += `<div class="port pright">f3</div>`;
        break;
      }
      case "p": {
        portStr += `<div class="port pright">p3</div>`;
        break;
      }
    }
    switch (bottom.bottomPortType) {
      case "n": {
        break;
      }
      case "f": {
        portStr += `<div class="port pbottom">f2</div>`;
        break;
      }
      case "p": {
        portStr += `<div class="port pbottom">p2</div>`;
        break;
      }
    }
    switch (top.topPortType) {
      case "n": {
        break;
      }
      case "f": {
        portStr += `<div class="port ptop">f4</div>`;
        break;
      }
      case "p": {
        portStr += `<div class="port ptop">p4</div>`;
        break;
      }
    }
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
          ${portStr}
        </div>
      `;
    el.innerHTML = html;
    el.style.width = `${this.props.model.width - 2}px`;
    el.style.height = `${this.props.model.height - 2}px`;
    // 需要先把之前渲染的子节点清除掉。
    rootEl.innerHTML = "";
    rootEl.appendChild(el);
  }
  getAnchorShape(anchorData: any) {
    const { x, y, type } = anchorData;
    return h("rect", {
      x: x - 10,
      y: y - 10,
      width: 20,
      height: 20,
      fill: "transparent",
    });
  }
}

export const port_component = {
  type: "port_component",
  view: PortComponent,
  model: PortComponentModel,
};
