import App from "./app.marko";

const instance = App.mount({ name: "Ada" }, document.getElementById("app"));

// TODO: the buttons in index.html don't do anything yet. Wire them to the
// mount handle:
//   #rename  -> instance.update({ name: "..." })   feed new input
//   #remove  -> instance.destroy()                  tear the app down
