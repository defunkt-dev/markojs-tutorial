import App from "./app.marko";

const instance = App.mount({ name: "Ada" }, document.getElementById("app"));

document.getElementById("rename").onclick = () => {
  instance.update({ name: "Grace" });
};

document.getElementById("remove").onclick = () => {
  instance.destroy();
};
