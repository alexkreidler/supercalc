import React, { useState } from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import styles from "./editor.module.css";
import cn from "classnames";
import { evaluate, round, simplify } from "mathjs";
// import { parse } from "path";

const examples = [
  `3*7
3/4
3^2
`,
  `a = 5; b = 7;
a/6+b*3
`,
  `f(x,a)=a*cos(x)
f(pi, 3)`,
  `(4/(sqrt(3)+i))^3*((-sqrt(2)+i*sqrt(6))/(-1-i))^2


r(m, t) = m*(cos(t)+i*sin(t))

k = 6
t = (-pi/3)+2pi*k/5
x = r(2, t)
x^5`,
  `k = 1
z = asin((1-sqrt(31))/6)/2 + k pi

f(x) = 3cos(4x)+2sin(2x)+2

f(z)`
];
function App() {
  let [precision, setPrecision] = useState(3);
  let [text, setText] = useState("");

  function parse(i) {
    if (typeof i === "string" || typeof i === "boolean") {
      return <p>{i.toString()}</p>;
    }
    if (typeof i === "number") {
      return <p>{round(i, precision)}</p>;
    }
    if (typeof i === "object" && i.value) {
      return <p>{i.value}</p>;
    }
    if (typeof i === "object" && i._data) {
      return <p>{i._data.toString()}</p>;
    }
    if (typeof i === "function") {
      return (
        <p>{`function ${i.syntax ? i.syntax : `${i.name.toString()}()`}`}</p>
      );
    } else {
      return <p>{i.toString()}</p>;
    }
  }

  function renderRes(s) {
    try {
      let res = evaluate(s);
      console.log(res);
      if (res === undefined) {
        return <p>Nothing here yet</p>;
      }
      if (!res.entries) {
        return <p>{parse(res)}</p>;
      }
      return res.entries.map(i => {
        return parse(i);
      });
    } catch (error) {
      console.log(error);
      return (
        <div>
          <h3>Error</h3>
          <p>{error.toString()}</p>
        </div>
      );
    }
  }

  function smpl() {
    let z = [];
    for (let line of text.split("\n")) {
      try {
        let r = simplify(line);

        if (!r || !r.fn) {
          continue;
        }
        z.push(r.toString());
      } catch (error) {
        console.log(error);
      }
    }
    setText(z.join("\n"));
  }
  function example(n) {
    setText(examples[n]);
  }
  return (
    <div className="App">
      <div className="headings">
        <h1>SuperCalc</h1>
        <p>Start editing to see some magic happen!</p>
      </div>
      <div className={styles.split}>
        <div className={styles.pane}>
          <h3>Input</h3>
          <textarea
            className={styles.text}
            value={text}
            onChange={e => {
              setText(e.target.value);
            }}
          />
        </div>
        <div className={cn(styles.pane)}>
          <h3>Ouput</h3>
          <div className={styles.output}>{renderRes(text)}</div>
        </div>
      </div>
      <div className={styles.tools}>
        <button onClick={smpl}>Simplify</button>
      </div>
      <div className={styles.examples}>
        <h2>Examples</h2>
        <ul>
          {examples.map((e, i) => (
            <li>
              <a key={i} onClick={() => example(i)}>
                Load Example {i + 1}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Options</h2>
        <p>Precision</p>
        <input value={precision} onChange={e => setPrecision(e.target.value)} />
      </div>
      <div>
        <h2>Docs</h2>
        <p>
          Copyright &copy; {new Date().getFullYear()} Alex Kreidler. Available
          on Github.
        </p>
        <p />
        <p>
          Built with <a href="https://reactjs.org/">React</a> and{" "}
          <a href="https://mathjs.org">Math.js</a>. Inspired by{" "}
          <a href="https://numi.io/">Numi</a>.
        </p>
        <p>
          Math expression/language documentation is{" "}
          <a href="https://mathjs.org/docs/expressions/syntax.html">here</a>,
          and the function reference is{" "}
          <a href="https://mathjs.org/docs/reference/functions.html">here</a>.
        </p>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
