import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
/**
 * 
 * @param {Props inlcude Value and Onclick which are being passed in from the Board Class} props 
 * This function creates a square represented by a button 
 * When the button is pressed it calls the onclick function from Board
 * and passes in value from board
 */
function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  /**
   * The Class Board is a react component and renders a board of 9 Squares
   * It has two main functions renderSquare and render
   */
  class Board extends React.Component {
      /**
       * 
       * @param {i represents the location of the square and is passed in in the render function} i 
       * this.props is referring to the Game class in the return statement 
       * and the values being passed to Board
       * 
       */
    renderSquare(i) {
      return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  /**
   * The render Statement renders the board and all 9 squares 
   * the divs have classNames of board-row which refers the Custom CSS in index CSS
   */
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
  

  /**
   * The Game class handles all the logic for tic tac toe
   * It has a constructor which establishes a state and various state variables
   * Other functions include the handleClick, jumpTo and render
   */
  class Game extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
          //history is a list of the board values after each move
        history: [ 
          {
            squares: Array(9).fill(null)
          }
        ],
        //stepNumber is incremented with each move to be able to back trace to a specific move
        stepNumber: 0,
        //xIsNext is used to determine which player is up
        xIsNext: true
      };
    }
  
    /**
     * 
     * @param {i is the location of the square being clicked} i 
     * 
     */
    handleClick(i) {
        /** 
         * history is checks the state history of squares and determines if step number  
         * is still the total history or if the user wanted to go back to a previous move
         * If the user wanted to go back history changes to everything before that destinated move
         */
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      //current is the current board 
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      //checks if their is a winner or if the square is already taken
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      //Places and x or o on square location 
      squares[i] = this.state.xIsNext ? "X" : "O";
      //sets state history to contain updated squares, stepnumber, and boolean for X / O
      this.setState({
        history: history.concat([
          {
            squares: squares
          }
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      });
    }
    
    /**
     * 
     * @param {is the step the user whats to go back to} step 
     */
    jumpTo(step) {
        //reset stepnumber in state and who is up
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
      });
    }
  
    /**
     * render determine what shows up in the game
     * 
     */
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      //winner call calculateWinner which checks if a player has won and returns the player
      const winner = calculateWinner(current.squares);
      //moves returns a list of buttons that will call jumpTo which changes the history of sqaures
      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move :
          'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });
  
      let status;
      if (winner) {
        status = "Winner: " + winner;
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
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
  
  // ========================================
  
  ReactDOM.render(<Game />, document.getElementById("root"));
  
  function calculateWinner(squares) {
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
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  