import { useState } from 'react';
import './App.css';

function App() {
  const [title, setTitle] = useState(['백준 10424번 문제 풀이', 'git 공부 팁', '파이썬 특징'])
  return (
    <div className='App'>
      <div className='black-nav'>
        <span>
          JuhanLog
        </span>
      </div>
      <div className='list'>
        <h4>{title[0]}</h4>
        <div>12월 25일 발행</div>
      </div>
      <div className='list'>
        <h4>{title[1]}</h4>
        <div>12월 25일 발행</div>
      </div>
      <div className='list'>
        <h4>{title[2]}</h4>
        <div>12월 25일 발행</div>
      </div>
    </div>
  );
}

export default App;
