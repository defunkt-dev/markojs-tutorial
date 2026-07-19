import App from "./app.marko";

// The third argument, "afterbegin", places the app just inside #app but
// BEFORE the note that's already there. (Try "beforeend" and reload to see
// it land below the note instead.)
const instance = App.mount({ name: "Ada" }, document.getElementById("app"), "afterbegin");

document.getElementById("rename").onclick = () => {
  instance.update({ name: "Grace" });
};

document.getElementById("remove").onclick = () => {
  instance.destroy();
};
