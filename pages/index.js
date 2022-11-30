import { useState } from "react";
import { load } from "@webcontainer/api";

let container = null;
const containerPromise = new Promise((resolve) => {
  if (typeof window !== "undefined") {
    window.requestIdleCallback(async () => {
      const WebContainer = await load();
      container = await WebContainer.boot();
      container.on("error", ({ message }) => console.error(message));
      resolve(container);
      console.log("container ready");
    });
  }
});

async function runLine(line, output) {
  await containerPromise;
  const [command, ...args] = line.split(" ");
  const process = await container.run({ command, args }, { output });
}

export default function Page() {
  const [line, setLine] = useState(
    "npx create-next-app --use-npm --no-eslint --js ."
  );
  const [output, setOutput] = useState("");

  function appendOutput(text) {
    setOutput((output) => output + text);
  }

  return (
    <div>
      <input
        value={line}
        onChange={(e) => setLine(e.target.value)}
        style={{ width: 400 }}
      />
      <button onClick={() => runLine(line, appendOutput)}>Run</button>
      <br />
      <div>Output:</div>
      <pre
        style={{
          width: "90vw",
          height: "80vh",
          overflow: "auto",
          background: "#222",
          color: "white",
        }}
      >
        {output}
      </pre>
    </div>
  );
}
