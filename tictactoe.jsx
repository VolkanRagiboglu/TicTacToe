const win = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const checkPlayerTurn = (gameState) => {
  return gameState.player;
};

const isSuperset = (set, subset) => {
  for (let elem of subset) {
    if (!set.has(elem)) {
      return false;
    }
  }
  return true;
};

const checkForWinner = (gameState) => {
  if (gameState.length < 5) return "No Winner Yet";

  const playerMoves = {
    0: gameState.filter((item) => item.player === 0).map((item) => item.id),
    1: gameState.filter((item) => item.player === 1).map((item) => item.id),
  };

  const isWinner = (player) =>
    win.some((item) => isSuperset(new Set(playerMoves[player]), new Set(item)));

  if (isWinner(0)) return "Player O";
  if (isWinner(1)) return "Player X";

  return "No Winner Yet";
};

const Square = ({ takeTurn, id, reset }) => {
  const mark = ["O", "X", "+"];
  const [filled, setFilled] = React.useState(false);
  const [tik, setTik] = React.useState(2);

  React.useEffect(() => {
    setFilled(false);
    setTik(2);
  }, [reset]);

  return (
    <button
      className={tik === 1 ? "red" : "white"}
      onClick={() => {
        setTik(takeTurn(id));
        setFilled(true);
      }}
    >
      <h1>{mark[tik]}</h1>
    </button>
  );
};

const Scoreboard = ({ scores }) => {
  return (
    <div id="scoreboard" style={{ fontSize: "1.5em" }}>
      <h2>Scoreboard</h2>
      <p>Player O: {scores[0]}</p>
      <p>Player X: {scores[1]}</p>
    </div>
  );
};

const Board = () => {
  const initialPlayer = 1;
  const initialGameState = [];
  const [player, setPlayer] = React.useState(initialPlayer);
  const [gameState, setGameState] = React.useState(initialGameState);
  const [reset, setReset] = React.useState(false);
  const [scores, setScores] = React.useState([0, 0]);

  const status =
    checkForWinner(gameState) !== "No Winner Yet"
      ? `Winner is ${checkForWinner(gameState)}`
      : `Next Player: ${player === 0 ? "Player O" : "Player X"}`;

  const takeTurn = (id) => {
    setGameState([...gameState, { id: id, player: player }]);
    setPlayer((player + 1) % 2);
    return player;
  };

  const resetGame = () => {
    setPlayer(initialPlayer);
    setGameState(initialGameState);
    setReset((prevReset) => !prevReset);
  };

  const updateScores = () => {
    const winner = checkForWinner(gameState);
    if (winner === "Player O") {
      setScores([scores[0] + 1, scores[1]]);
    } else if (winner === "Player X") {
      setScores([scores[0], scores[1] + 1]);
    }
  };

  React.useEffect(() => {
    updateScores();
  }, [gameState]);

  const renderSquare = (i) => {
    return <Square takeTurn={takeTurn} id={i} reset={reset}></Square>;
  };

  return (
    <div className="game-board">
      <div className="grid-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="grid-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="grid-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <div id="info">
        <h1 id="turn">{status}</h1>
        <button onClick={resetGame}>Reset Game</button>
      </div>
      <Scoreboard scores={scores} />
    </div>
  );
};

const Game = () => {
  return (
    <div className="game">
      <Board></Board>
    </div>
  );
};

ReactDOM.render(<Game />, document.getElementById("root"));
