import { useState } from 'react';
import './App.css';

function App() {
  const [title, setTitle] = useState(['백준 10424번 문제 풀이', 'git 공부 팁', '파이썬 특징'])
  function getTemperature(){
    let num = document.getElementById('tipNum').value
    fetch('https://cat-fact.herokuapp.com/facts')
      .then((response) => response.json())
      .then((data) =>
      document.getElementById('catTip').innerHTML = data[num]['text']
      )
  }
  return (
    <div className='App'>
      <div className='black-nav'>
        <span>
          JuhanLog
        </span>
      </div>
      <input id='tipNum' type='number' value=""></input>
      <button onClick={getTemperature}>꿀팁 받아오기(0~4까지 입력)</button>
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
      <div className='list'>
        <h4>고양이를 사랑하는 사람들을 위한 꿀팁</h4>
        <div id='catTip'></div>
      </div>
    </div>
  );
}

export default App;
