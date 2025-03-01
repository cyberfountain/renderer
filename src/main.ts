import { html, render } from "./renderer";
import { condition, repeat } from "./renderer/src/directives";

const random = (): any => (Math.random() + 1).toString(36).substring(7);

let someName = random();

const listLength = 10000;

const initList = (count: number): any =>
  Array.from({ length: count }, () => ({
    name: random(),
  }));

let list = initList(listLength);

const names = [
  { name: "Adam" },
  { name: "Bella" },
  { name: "Charlie" },
  { name: "Diana" },
  { name: "Ethan" },
  { name: "Fiona" },
  { name: "George" },
  { name: "Hannah" },
  { name: "Ian" },
  { name: "Julia" },
  { name: "Kevin" },
  { name: "Liam" },
  { name: "Mia" },
  { name: "Noah" },
  { name: "Olivia" },
];

const insertAtRandomIndex = (array: unknown[], value: unknown): any => {
  const randomIndex = Math.floor(Math.random() * (array.length + 1));
  const newArray = array.slice();
  newArray.splice(randomIndex, 0, value);
  return newArray;
};

const onClick = (): void => {
  console.log("OMG");
};

const deleteRandomElement = (arr: unknown[]): void => {
  if (!Array.isArray(arr) || arr.length === 0) {
    return;
  }

  arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
};

const swapRandomElements = (arr: unknown[]) => {
  if (!Array.isArray(arr) || arr.length < 2) {
    return;
  }

  const index1 = Math.floor(Math.random() * arr.length);
  let index2 = Math.floor(Math.random() * arr.length);
  while (index1 === index2) {
    index2 = Math.floor(Math.random() * arr.length);
  }

  [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
};

let cond = true;

const ref = { value: "Hello There!" };

const template = (): any => {
  return html`
    <div data-test="123" />
    <app-cutom-element />
    ${ref.value}
    <input name="${random()}" ~model=${ref} />
    <hr />
    ${repeat(list, (val, index) => html`<div>${val.name} ${index}</div>`)}
    <hr />
    <button id="btn" :test=${random()} name=${random()} @click=${onClick}>
      Click me
    </button>
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

(window as any).deleteRandom = (): void => {
  deleteRandomElement(list);
  render(template(), container);
};

(window as any).swapRandom = (): void => {
  swapRandomElements(list);
  render(template(), container);
};

(window as any).insertRandom = (): void => {
  list = insertAtRandomIndex(list, { name: random() });
  render(template(), container);
};

(window as any).toggle = (): void => {
  cond = !cond;
  render(template(), container);
};
