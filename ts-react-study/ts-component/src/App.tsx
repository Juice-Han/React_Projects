import { useState, useReducer } from "react";
import "./App.css";

type ActionType = {
  type : string;
  value : number;
}

function reducer(oldCount: number, action: ActionType): number {
  switch (action.type) {
    case "INCREMENT":
      return oldCount + action.value;
    case "DECREMENT":
      return oldCount - action.value;
    case "RESET":
      return 0;
    default:
      return oldCount;
  }
}

function App() {
  const [value, setValue] = useState(1);
  const [count, dispatchCount] = useReducer(reducer, 1);
  
  const increment = () => {
    dispatchCount({type : 'INCREMENT', value: value});
  }
  const decrement = () => {
    dispatchCount({type : 'DECREMENT', value: value});
  }
  const reset = () => {
    dispatchCount({type: 'RESET', value: value});
  }

  return (
    <div>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>0</button>
      <button onClick={increment}>+</button>
      <span>{count}</span>
      <input value={value} onChange={(e) => setValue(Number(e.target.value))}/>
    </div>
  );
}

export default App;
