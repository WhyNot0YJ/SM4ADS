import { PolylineEdge, PolylineEdgeModel, h } from "@logicflow/core";

//Associate
class AssociateModel extends PolylineEdgeModel {}
class Associate extends PolylineEdge {}
export const associate = {
  type: "associate",
  view: Associate,
  model: AssociateModel,
};

//Dependency
class DependencyModel extends PolylineEdgeModel {
  setAttributes() {
    this.updateText("");
  }
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    style.strokeDasharray = "4 4";
    return style;
  }
}
class Dependency extends PolylineEdge {
  getEndArrow() {
    const { model } = this.props;
    const { stroke, strokeWidth } = model.getArrowStyle();
    const pathAttr = {
      fill: "none",
      stroke: stroke,
      strokeWidth: strokeWidth,
    };
    // 半箭
    return h("path", {
      ...pathAttr,
      d: "M -8 -8 L 0 0 M -8 8 L 0 0",
    });
  }
}
export const dependency = {
  type: "dependency",
  view: Dependency,
  model: DependencyModel,
};

//Extend
class ExtendModel extends PolylineEdgeModel {
  setAttributes() {
    this.updateText("《extend》");
  }
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    style.strokeDasharray = "4 4";
    return style;
  }
}
class Extend extends PolylineEdge {
  getEndArrow() {
    const { model } = this.props;
    const { stroke, strokeWidth } = model.getArrowStyle();
    const pathAttr = {
      fill: "none",
      stroke: stroke,
      strokeWidth: strokeWidth,
    };
    // 半箭
    return h("path", {
      ...pathAttr,
      d: "M -8 -8 L 0 0 M -8 8 L 0 0",
    });
  }
}
export const extend = {
  type: "extend",
  view: Extend,
  model: ExtendModel,
};

//Include
class IncludeModel extends PolylineEdgeModel {
  setAttributes() {
    this.updateText("《extend》");
  }
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    style.strokeDasharray = "4 4";
    return style;
  }
}
class Include extends PolylineEdge {
  getEndArrow() {
    const { model } = this.props;
    const { stroke, strokeWidth } = model.getArrowStyle();
    const pathAttr = {
      fill: "none",
      stroke: stroke,
      strokeWidth: strokeWidth,
    };
    // 半箭
    return h("path", {
      ...pathAttr,
      d: "M -8 -8 L 0 0 M -8 8 L 0 0",
    });
  }
}
export const include = {
  type: "include",
  view: Include,
  model: IncludeModel,
};
//Generalization
class GeneralizatioinModel extends PolylineEdgeModel {
  setAttributes() {}
  getEdgeStyle() {
    return super.getEdgeStyle();
  }
}
class Generalizatioin extends PolylineEdge {
  getEndArrow() {
    const { model } = this.props;
    const { stroke, strokeWidth } = model.getArrowStyle();
    const pathAttr = {
      fill: "white",
      stroke: stroke,
      strokeWidth: strokeWidth,
    };
    // 半圆
    return h("path", {
      ...pathAttr,
      d: "M 0 0 -10 -5 -10 5 z",
    });
  }
}
export const generalization = {
  type: "generalization",
  view: Generalizatioin,
  model: GeneralizatioinModel,
};
