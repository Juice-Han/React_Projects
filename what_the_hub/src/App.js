import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [wiseSaying, setWiseSaying] = useState('')
  async function getAdvice(){
    const res = await axios.get('https://api.adviceslip.com/advice')
    setWiseSaying(res.data['slip']['advice'])
  }
  return (
    <div className='app'>
      <button onClick={getAdvice}>명언 가져와!</button>
      <div className='wiseSaying-container'>
        <div id='wiseSaying'>{wiseSaying}</div>
      </div>
    </div>
  );
}

export default App;
