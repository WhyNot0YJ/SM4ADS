import { RectResize } from "@logicflow/extension";

//圆角矩形
class RoundedRectModel extends RectResize.model {
  initNodeData(data: any) {
    super.initNodeData(data);
    //如果是空对象则
    if (JSON.stringify(data.properties) === "{}") {
      this.setProperties({
        description: "",
      });
    } else {
      this.setProperties(data.properties);
    }
    this.radius = 8;
  }
}
class RoundedRect extends RectResize.view {}
export const roundedRect = {
  type: "roundedRect",
  model: RoundedRectModel,
  view: RoundedRect,
};

//ODC
class FunctionState {
  loc: string = "";
  per: string = "";
  dm_p: string = "";
  con: string = "";
  v2x: string = "";
  stor: string = "";
}
class VehicleState {
  speed: string = "";
  function: FunctionState = new FunctionState();
}

class HumanState {
  driver: string = "";
  passenger: string = "";
}
class StaticEntity {
  road: string = "";
  lane: string = "";
  sign: string = "";
  infrastucre: string = "";
  zone: string = "";
}
class DynamicEntity {
  situation: string = "";
  tp: string = "";
  ntp: string = "";
}
class Environment {
  weather: string = "";
  illumination: string = "";
  temperature: number = 0;
  moisture: number = 0;
  communication: number = 0;
}
class OperationDesignDomain {
  static: StaticEntity = new StaticEntity();
  dynamic: DynamicEntity = new DynamicEntity();
  env: Environment = new Environment();
}
export class OperationDesignCondition {
  domain: OperationDesignDomain = new OperationDesignDomain();
  h_state: HumanState = new HumanState();
  v_state: VehicleState = new VehicleState();
  condition: string = "";
}
class ODCModel extends RoundedRectModel {
  initNodeData(data: any) {
    super.initNodeData(data);
    if (JSON.stringify(data.properties) === "{}") {
      this.setProperties(this.setProperties(new OperationDesignCondition()));
    } else {
      this.setProperties(data.properties);
    }
  }
}
class ODC extends RoundedRect {}
export const odc = {
  type: "odc",
  model: ODCModel,
  view: ODC,
};

//HARA
class HARAType {
  Hazard: string = "";
  s: string = "";
  e: string = "";
  c: string = "";
  level: string = "";
}

class HARAModel extends RoundedRectModel {
  initNodeData(data: any) {
    super.initNodeData(data);
    if (JSON.stringify(data.properties) === "{}") {
      this.setProperties(this.setProperties(new HARAType()));
    } else {
      this.setProperties(data.properties);
    }
  }
}
class HARA extends RoundedRect {}
export const hara = {
  type: "hara",
  model: HARAModel,
  view: HARA,
};

//SaftyGoal
class SafetyGoalModel extends RoundedRectModel {
  initNodeData(data: any) {
    super.initNodeData(data);
    const rule1 = {
      message: "safty goal 的下一个节点只能是 functional safty requirement",
      validate: (_: any, targetNode: any) => {
        return targetNode.type === "functional_safty_requirement";
      },
    };
    const rule2 = {
      message: "safty goal 的下一个节点只能是 functional safty requirement",
      validate: (_: any, targetNode: any) => {
        return targetNode.type === "functional_safty_requirement";
      },
    };
    this.sourceRules.push(rule1);
    this.sourceRules.push(rule2);
  }
}
class SaftyGoal extends RoundedRect {}
export const safty_goal = {
  type: "safty_goal",
  model: SafetyGoalModel,
  view: SaftyGoal,
};

//FunctionalSaftyRequirement
class FunctionalSaftyRequirementModel extends RoundedRectModel {
  initNodeData(data: any) {
    super.initNodeData(data);
  }
}
class FunctionalSaftyRequirement extends RoundedRect {}
export const functional_safty_requirement = {
  type: "functional_safty_requirement",
  model: FunctionalSaftyRequirementModel,
  view: FunctionalSaftyRequirement,
};
