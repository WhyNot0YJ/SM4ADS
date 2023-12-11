import { ClassDiagramRadius, ClassDiagramRadiusModel, whiteList } from "../index";
import { FMEAType, ANNType, ObjectPerceptionType } from "./type";
//FMEA
class FMEAModel extends ClassDiagramRadiusModel {
  initNodeData(data: any) {
    super.initNodeData(data);
    let num = 0;
    whiteList.forEach((item) => {
      data.properties.hasOwnProperty(item) && num++;
    });
    if (Object.keys(data.properties).length === num) {
      this.setProperties(new FMEAType());
    } else {
      this.setProperties(data.properties);
    }
  }
}
class FMEA extends ClassDiagramRadius {}
export const fmea = {
  type: "fmea",
  model: FMEAModel,
  view: FMEA,
};

//ANN
class ANNModel extends ClassDiagramRadiusModel {
  initNodeData(data: any) {
    super.initNodeData(data);
    let num = 0;
    whiteList.forEach((item) => {
      data.properties.hasOwnProperty(item) && num++;
    });
    if (Object.keys(data.properties).length === num) {
      this.setProperties(new ANNType());
    } else {
      this.setProperties(data.properties);
    }
  }
}
class ANN extends ClassDiagramRadius {}
export const ann = {
  type: "ann",
  model: ANNModel,
  view: ANN,
};

//ObjectPerception
class ObjectPerceptionModel extends ClassDiagramRadiusModel {
  initNodeData(data: any) {
    super.initNodeData(data);
    let num = 0;
    whiteList.forEach((item) => {
      data.properties.hasOwnProperty(item) && num++;
    });
    if (Object.keys(data.properties).length === num) {
      this.setProperties(new ObjectPerceptionType());
    } else {
      this.setProperties(data.properties);
    }
  }
}
class ObjectPerception extends ClassDiagramRadius {}
export const object_perception = {
  type: "object_perception",
  model: ObjectPerceptionModel,
  view: ObjectPerception,
};
