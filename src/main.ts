import { html, render } from "./renderer";

const random = (): any => (Math.random() + 1).toString(36).substring(7);

let someName = random();

const listLength = 100;

const list = Array.from({ length: listLength }, () => ({ name: random() }));

const onClick = (): void => {
  console.log("OMG");
};

const template = (): any => {
  return html`
    <div>${someName} ${someName} ${someName}</div>
    <button id="btn" @click="${onClick}">Click me</button>
  `;
};

const container = document.getElementById("app");

render(template(), container);

const run = (): void => {
  someName = random();
  render(template(), container);
  requestAnimationFrame(run);
};

// run();

(window as any).render = (): void => {
  someName = random();
  render(template(), container);
};
