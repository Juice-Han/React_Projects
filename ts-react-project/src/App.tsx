import React, {useState} from 'react';
import Library from './Library';
import { Data } from './model/library';
import './App.css';

let data = {
  name : 'Juhan Library',
  address : 'Incheon',
  since : 2000,
  books : [
    {name : 'Harry Potter', status : 'O'},
    {name : 'Peter Pan', status : 'X'},
  ]
}

const App : React.FC = ()=> {

  return (
    <div className="App">
      <Library data={data}/>
    </div>
  );
}

export default App;
