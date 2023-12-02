import { PolylineEdge, PolylineEdgeModel, h } from "@logicflow/core";

//包含关系
class ContainmentModel extends PolylineEdgeModel {
  setAttributes() {}
  getEdgeStyle() {
    return super.getEdgeStyle();
  }
}
class Containment extends PolylineEdge {
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
      d: "M -8 0 A 8 8 0 0 0 8 0 M 0 -8 A 8 8 0 0 0 0 8 M -5 -5 L 5 5 M 5 -5 L -5 5",
    });
  }
}
export const containment = {
  type: "containment",
  view: Containment,
  model: ContainmentModel,
};


//依赖关系-重用
class DependencyCopyModel extends PolylineEdgeModel {
  setAttributes() {
      this.updateText('copy')
  }
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    style.strokeDasharray = "4 4";
    return style;
  }
}
class DependencyCopy extends PolylineEdge {
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
      d: "M -8 -8 L 8 8 M 8 -8 L -8 8",
    });
  }
}
export const dependency_copy = {
  type: "dependency_copy",
  view: DependencyCopy,
  model: DependencyCopyModel,
};

//依赖关系-精华
class DependencyDeriveModel extends PolylineEdgeModel {
  setAttributes() {
    this.updateText('derive')
}
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    style.strokeDasharray = "4 4";
    return style;
  }
}
class DependencyDerive extends PolylineEdge {
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
      d: "M -8 -8 L 8 8 M 8 -8 L -8 8",
    });
  }
}
export const dependency_derive = {
  type: "dependency_derive",
  view: DependencyDerive,
  model: DependencyDeriveModel,
};
//依赖关系-满足
class DependencySatisfyModel extends PolylineEdgeModel {
  setAttributes() {
    this.updateText('satisfy')
}
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    style.strokeDasharray = "4 4";
    return style;
  }
}
class DependencySatisfy extends PolylineEdge {
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
      d: "M -8 -8 L 8 8 M 8 -8 L -8 8",
    });
  }
}
export const dependency_satisfy = {
  type: "dependency_satisfy",
  view: DependencySatisfy,
  model: DependencySatisfyModel,
};

//依赖关系-精华
class DependencyRefineModel extends PolylineEdgeModel {
  setAttributes() {
    this.updateText('refine')
}
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    style.strokeDasharray = "4 4";
    return style;
  }
}
class DependencyRefine extends PolylineEdge {
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
      d: "M -8 -8 L 8 8 M 8 -8 L -8 8",
    });
  }
}
export const dependency_refine = {
  type: "dependency_refine",
  view: DependencyRefine,
  model: DependencyRefineModel,
};
