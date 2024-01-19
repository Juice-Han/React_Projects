import { useState, useReducer } from "react";
import "./App.css";

type ActionType = {
  type : string;
  number: number;
}
function countReducer(oldCount : number, action: ActionType) : number{
  if(action.type === 'DOWN'){
    return oldCount - action.number;
  }else if(action.type === 'RESET'){
    return 0;
  }else{
    return oldCount + action.number;
  }
}

function App() {
  const [value, setValue] = useState(1)
  function down(){
    countDispatch({type: 'DOWN', number: value});
  }
  function reset(){
    countDispatch({type: 'RESET', number: value});
  }
  function up(){
    countDispatch({type: 'UP', number: value});
  }

  const [count, countDispatch] = useReducer(countReducer, 0);

  function changeInput(e : React.ChangeEvent<HTMLInputElement>){
    setValue(Number(e.target.value))

  }

  return(
    <div className="calc_container">
      <button onClick={down}>-</button>
      <button onClick={reset}>0</button>
      <button onClick={up}>+</button>
      <span>{count}</span>
      <input value={value} onChange={(e) => changeInput(e)}/>
    </div>
  )
}

export default App;
