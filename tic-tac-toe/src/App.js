import './App.css';
import { useState } from 'react';

function Square({value, onSquareClick, style}) {
  return <button className="square" onClick={onSquareClick} style={style}>{value}</button>
}

function Board({xIsNext,squares,onPlay,historyLength, addRowsAndCols}) {

  function handleClick(row, col){
    if(squares[3*row+col] || calculateWinner(squares)){
      return;
    }
    const nextSquares = squares.slice();
    if(xIsNext){
      nextSquares[3*row+col] = "X";
    }else{
      nextSquares[3*row+col] = "O";
    }
    addRowsAndCols(row,col)
    onPlay(nextSquares)
  }
  const winner = calculateWinner(squares);
  let status;
  if(winner){
    status = 'Winner: ' + squares[winner[0]];
  }else{
    if(historyLength === 10){
      status = 'Draw'
    }else{
      status = 'Next Player: ' + (xIsNext ? 'X' : 'O');
    }
  }
  let colorRed = {
    color: "red"
  }
  let colorBlack = {
    color: "black"
  }
  let boardSquares = []
  for(let row=0; row<3; row++){
    let boardRow = []
    for(let col = 0; col<3; col++){
      let index = 3*row+col
      if(winner && (index === winner[0] || index === winner[1] || index === winner[2])){
        boardRow.push(<Square key={3*row+col} value={squares[3*row+col]} onSquareClick={() => handleClick(row, col)} style={colorRed}/>)
      }else{
        boardRow.push(<Square key={3*row+col} value={squares[3*row+col]} onSquareClick={() => handleClick(row, col)} style={colorBlack}/>)
      }
    }
    boardSquares.push(<div className='board-row' key={row}>{boardRow}</div>)
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
  const [rowsAndCols, setRowsAndCols] = useState(Array(9).fill(null))
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
  function addRowsAndCols(row,col){
    let cpRowsAndCols = rowsAndCols.slice(0)
    cpRowsAndCols[currentMove+1] = [row,col]
    console.log(cpRowsAndCols)
    setRowsAndCols(cpRowsAndCols)
  }
  let moves
  if(!isChecked){
    moves = history.map((squares,move) => {
      let description;
      if (move !== currentMove){
        if (move > 0){
          description = 'Go to move # (' + rowsAndCols[move][0] + ', ' + rowsAndCols[move][1] + ')';
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
          description = 'Go to move # (' + rowsAndCols[history.length - move -1][0] + ', ' + rowsAndCols[history.length - move -1][1] + ')'
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
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} historyLength={history.length} addRowsAndCols={addRowsAndCols}/>
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
      return lines[i];
    }
  }
  return null;
}