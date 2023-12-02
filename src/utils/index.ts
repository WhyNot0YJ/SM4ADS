import { saveAs } from "file-saver";
export const exportJson = (
  data: Object,
  filename: string,
  callback: Function = () => {}
) => {
  const str = JSON.stringify(data);
  const blob = new Blob([str]);
  //要下载的数据 以及前端自定义命名
  saveAs(blob, `${filename}.json`);
  callback();
};

export const readJson = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      try {
        const content = event.target?.result;
        const jsonObject = JSON.parse(content as string);
        resolve(jsonObject); // 将解析后的 JSON 对象作为 Promise 的解决值
      } catch (error) {
        reject(error); // 如果解析失败，将错误作为 Promise 的拒绝值
      }
    };

    reader.onerror = function (event) {
      reject(event.target?.error); // 如果发生错误，将错误作为 Promise 的拒绝值
    };

    reader.readAsText(file);
  });
};
