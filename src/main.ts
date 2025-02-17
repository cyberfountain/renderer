import { html, render } from "./renderer";
import { repeat } from "./renderer/src/directives";

const random = (): any => (Math.random() + 1).toString(36).substring(7);

let someName = random();

const listLength = 10;

const initList = (count: number): any =>
  Array.from({ length: count }, () => ({
    name: random(),
  }));

let list = initList(listLength);

const onClick = (): void => {
  console.log("OMG");
};

const template = (): any => {
  return html`
    <div>${someName}</div>
    <div>
      <ul>
        ${repeat(list, (val, index) => html`<li>${val.name} ${index}</li>`)}
      </ul>
    </div>
    <button id="btn" @click="${onClick}">Click me</button>
  `;
};

const container = document.getElementById("app");

render(template(), container);

const run = (): void => {
  someName = random();
  list[0].name = random();
  list[3].name = random();
  render(template(), container);
  requestAnimationFrame(run);
};

// run();

(window as any).render = (): void => {
  someName = random();
  render(template(), container);
};

(window as any).empty = (): void => {
  someName = random();
  list = [];
  render(template(), container);
};

(window as any).changeSize = (): void => {
  someName = random();
  list = initList(5);
  render(template(), container);
};
