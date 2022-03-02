import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
  
//   render() {
//     return (
//       <button 
//         className="square" 
//         onClick={() => {this.props.onClick()}}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }

function Square(props) {
  return (
    <button className='square' onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
//board onclick came from game jsx argument
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => {this.props.onClick(i)}}
      />
    );
  }

  render() {

    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleClick(i) {

    const history = this.state.history.slice(0, this.state.stepNumber + 1) 
    //throw away any future history aftre stepping back in time
    const current = history[history.length-1]
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) return
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{
        squares:squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  jumpTo(historyIndex) {
    this.setState({
      stepNumber: historyIndex,
      xIsNext: (historyIndex % 2) === 0
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)


    // we dont care about historyValue for now, so it is ignored
    const moves = history.map((historyValue, historyIndex) => {
      const description = historyIndex ?
        'Go to move #' + historyIndex :
        'Go to game start'
      return (

        //for historyIndex, React treats item index as a unique key to determine if it shld re-render components. Recommended to use unique key instead. It is safe in this case, bcoz moves r never re-ordered/deleted/inserted

        <li key={historyIndex}>
          <button onClick={()=> this.jumpTo(historyIndex)}>{description}</button>
        </li>
      )
    })

    let status;
    if (winner) {
      status = `The winner is ${winner}`
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]
  for (let i=0; i<lines.length; i++) {
    const [a,b,c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

