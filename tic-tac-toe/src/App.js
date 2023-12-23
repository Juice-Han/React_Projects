import './App.css';
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return <button className="square" onClick={onSquareClick}>{value}</button>
}

function Board({xIsNext,squares,onPlay}) {

  function handleClick(i){
    if(squares[i] || calculateWinner(squares)){
      return;
    }
    const nextSquares = squares.slice();
    if(xIsNext){
      nextSquares[i] = "X";
    }else{
      nextSquares[i] = "O";
    }
    onPlay(nextSquares)
  }

  const winner = calculateWinner(squares);
  let status;
  if(winner){
    status = 'Winner: ' + winner;
  }else{
    status = 'Next Player: ' + (xIsNext ? 'X' : 'O');
  }

  let boardSquares = []
  for(let i=0; i<3; i++){
    let boardRow = []
    for(let j = 0; j<3; j++){
      boardRow.push(<Square key={3*i+j}value={squares[3*i+j]} onSquareClick={() => handleClick(3*i+j)}/>)
    }
    boardSquares.push(<div className='board-row' key={i}>{boardRow}</div>)
  }
  
  return (
    <>
      <div className='status'>{status}</div>
      <div>
        {boardSquares}
      </div>
    </>
  );
}

export default function Game(){
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isChecked, setIsChecked] = useState(false)
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0

  function handlePlay(nextSquares){
    const nextHistory = [...history.slice(0, currentMove+1), nextSquares]
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }
  let moves
  if(!isChecked){
    moves = history.map((squares,move) => {
      let description;
      
      if (move !== currentMove){
        if (move > 0){
          description = 'Go to move #' + move;
        }else{
          description = 'Go to game start';
        }
        return(
          <li key={move}>
            <button onClick={() => jumpTo(move)}>{description}</button>
          </li>
        )
      }else{
        description = 'You are at move #' + move
        return(
          <li key={move}>
            <div>{description}</div>
          </li>
        )
      }
    })
  }else{
    moves = history.slice(0).reverse().map((squares,move) => {
      let description;
      
      if(move === 0){
        description = 'You are at move #' + (history.length - move -1)
        return(
          <li key={move}>
            <div>{description}</div>
          </li>
        )
      }else{
        if(move === history.length -1){
          description = 'Go to game start'
        }else{
          description = 'Go to move #' + (history.length - move -1)
        }
        return(
          <li key={move}>
            <button onClick={() => jumpTo(history.length - move - 1)}>{description}</button>
          </li>
        )
      }
    })
  }
  
  function sortMoves(isChecked){
    setIsChecked(!isChecked)
  }

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className='game-info'>
        <ol>{moves}</ol>
        {isChecked ? <button onClick={() => sortMoves(isChecked)}>sort ascending</button> : <button onClick={() => sortMoves(isChecked)}>sort descending</button>}
      </div>
    </div>
  )
}

function calculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++){
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return squares[a];
    }
  }
  return null;
}