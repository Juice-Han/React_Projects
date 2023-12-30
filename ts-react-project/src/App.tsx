import React, {useState} from 'react';
import Library from './Library';
import { Information } from './model/library';
import './App.css';

let data : Information = {
  name : 'Juhan Library',
  address : 'Incheon',
  since : 2000,
  books : [
    {name : 'Harry Potter', status : 'O'},
    {name : 'Peter Pan', status : 'X'},
  ]
}

const App : React.FC = ()=> {

  const [myLibrary, setMyLibrary] = useState<Information>(data)
  return (
    <div className="App">
      <Library info={myLibrary}/>
    </div>
  );
}

export default App;
