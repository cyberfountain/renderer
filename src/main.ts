import { html, render } from "./renderer";

const random = (): any => (Math.random() + 1).toString(36).substring(7);

let someName = random();

const listLength = 100;

const list = Array.from({ length: listLength }, () => ({ name: random() }));

const template = (): any => {
  return html`<div>${someName} ${someName} ${someName}</div>
    <div>
      <ul>
        ${list.map(
          (el) =>
            html`<li>
              ${el.name}
              <ul>
                ${list.map((el) => html`<li>${el.name}</li>`)}
              </ul>
            </li>`,
        )}
      </ul>
    </div>`;
};

const container = document.getElementById("app");

render(template(), container);

const run = (): void => {
  someName = random();
  render(template(), container);
  requestAnimationFrame(run);
};

run();
