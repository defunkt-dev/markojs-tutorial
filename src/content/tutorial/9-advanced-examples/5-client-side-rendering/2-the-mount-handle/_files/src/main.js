import App from "./app.marko";

// The third argument, "afterbegin", places the app just inside #app but
// BEFORE the note that's already there. (Try "beforeend" and reload to see
// it land below the note instead.)
const instance = App.mount({ name: "Ada" }, document.getElementById("app"), "afterbegin");

// TODO: the buttons in index.html don't do anything yet. Wire them to the
// mount handle:
//   #rename -> instance.update({ name: "..." })   feed new input
//   #remove -> instance.destroy()                  tear the app down
