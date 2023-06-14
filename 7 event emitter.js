const EventEmitter = require("node:events");
const emitter = new EventEmitter();

emitter.on("event", (value) => {
  console.log("event is called and a value is passed : " + value);
});
emitter.on("event", () => {
  console.log("multiple eventlisteners can be defined,but runs synchronously");
});

emitter.emit("event", 12);

//used for delaying a function so that it can be executed after something, by calling emit method
