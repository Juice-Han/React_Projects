import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import {produce} from "immer"
import "./App.css";

function App() {
  const [text, setText] = useState("");
  let c = [
    {
      id: 1,
      comment: "hi",
    },
    {
      id: 2,
      comment: "hey",
    }
  ];
  
  const d = produce(c, draft => {
    draft[1].comment = "bye";
  });
  console.log('hi')
  console.log(c === d)
  return (
    <>
      <input
        id="1"
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></input>
    </>
  );
}

export default App;
