import React from 'react';
import styled, {css} from 'styled-components';
import './App.css';

function App() {
  return (
    <div className="App">
      <Circle color={'red'} color2White={true}>
        <div className='text'>
          text
        </div>
      </Circle>
    </div>
  );
}

interface CircleProps {
  color : string;
  color2White : boolean
}

const Circle = styled.div<CircleProps>`
  width: 5rem;
  height: 5rem;
  background: ${props => props.color || 'black'};
  border-radius: 50%;
  position: relative;
  color: ${props => {
    if(props.color2White) return 'white'
    else return 'black'
  }};
`

const whiteText = css`
  color: white;
  font-size: 14px;
`

export default App;