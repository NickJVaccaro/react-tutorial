import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  let classes = "square " + props.extraClass;
  return (
    <button className={ classes } onClick={ props.onClick }>
      { props.value }
    </button>
  );
}
  
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
      winner: null
    };
  }

  renderSquare(i) {
    let extraClass = "";
    if (this.props.winner && this.props.winner.includes(i, 0)) {
      extraClass = "square-win";
    }

    console.log(this.props.winner);
    return (
      <Square 
        key={ i }
        value={ this.props.squares[i] }
        onClick={ () => this.props.onClick(i) }
        extraClass={ extraClass }
      />
    )
  }

  createBoardSquares() {
    let table = [];

    for(let i = 0; i < 3; i++) {
      let children = [];
      for(let j = 0; j < 3; j++) {
        children.push(this.renderSquare((i * 3) + j));
      }
      table.push(<div key={ i } className="board-row">{children}</div>);
    }

    return table;
  }

  render() {
    return (
      <div>
        {this.createBoardSquares()}
      </div>
    );
  }
}
  
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        col: 0,
        row: 0
      }],
      stepNumber: 0,
      xIsNext: true,
      isReverse: false
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if(calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{
        squares: squares,
        col: (i % 3) + 1,
        row: (i / 3) + 1
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  reverseMoves() {
    const newReverse = !this.state.isReverse;
    this.setState({
      isReverse: newReverse
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' (' + step.col + ',' + Math.floor(step.row) + ')' :
        'Go to game start';
      return (
        <li key={move}>
          <button 
            onClick = { () => this.jumpTo(move) }
            style = { this.state.stepNumber === move ? {fontWeight: 'bold'} : {} }>
              {desc}
          </button>
        </li>
      );
    });

    if (this.state.isReverse) {
      moves.reverse();
    }

    let status;
    if (winner) {
      status = 'Winner: ' + current.squares[winner[0]];
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = { current.squares }
            onClick = { (i) => this.handleClick(i) }
            winner = { winner }
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <button onClick = { () => this.reverseMoves() }>Reverse Move Order</button>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}
  
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}