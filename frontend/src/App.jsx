import { useEffect, useMemo, useState } from "react";
import "./App.css";

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function calcWinner(board) {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}

function isDraw(board) {
  return board.every(Boolean);
}

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem("ttt_score");
    return saved ? JSON.parse(saved) : { X: 0, O: 0, D: 0 };
  });

  const { winner, line } = useMemo(() => calcWinner(board), [board]);
  const draw = !winner && isDraw(board);

  useEffect(() => {
    localStorage.setItem("ttt_score", JSON.stringify(score));
  }, [score]);

  useEffect(() => {
    if (winner) {
      setScore((s) => ({ ...s, [winner]: s[winner] + 1 }));
    } else if (draw) {
      setScore((s) => ({ ...s, D: s.D + 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner, draw]);

  function handleMove(i) {
    if (board[i] || winner) return;

    setBoard((prev) => {
      const next = [...prev];
      next[i] = xIsNext ? "X" : "O";
      return next;
    });
    setXIsNext((v) => !v);
  }

  function resetRound() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  function resetAll() {
    resetRound();
    setScore({ X: 0, O: 0, D: 0 });
    localStorage.removeItem("ttt_score");
  }

  const status = winner
    ? `Ganó ${winner}`
    : draw
    ? "Empate"
    : `Turno: ${xIsNext ? "X" : "O"}`;

  return (
    <div className="page">
      <div className="bgGlow" aria-hidden="true" />

      <header className="top">
        <div>
          <p className="kicker">Proyecto · Frontend</p>
          <h1 className="title">Tic-Tac-Toe</h1>
          <p className="subtitle">UI moderna, accesible y responsive.</p>
        </div>

        <div className="scoreCard" role="group" aria-label="Marcador">
          <div className="scoreItem">
            <span className="scoreLabel">X</span>
            <span className="scoreValue">{score.X}</span>
          </div>
          <div className="scoreItem">
            <span className="scoreLabel">O</span>
            <span className="scoreValue">{score.O}</span>
          </div>
          <div className="scoreItem">
            <span className="scoreLabel">Empates</span>
            <span className="scoreValue">{score.D}</span>
          </div>
        </div>
      </header>

      <main className="card">
        <div className="row">
          <div className="status" aria-live="polite">
            <span className={`badge ${winner ? "win" : draw ? "draw" : ""}`}>
              {status}
            </span>
          </div>

          <div className="actions">
            <button className="btn ghost" onClick={resetRound}>
              Nueva ronda
            </button>
            <button className="btn" onClick={resetAll}>
              Reiniciar todo
            </button>
          </div>
        </div>

        <div className="board" role="grid" aria-label="Tablero Tic-Tac-Toe">
          {board.map((cell, i) => {
            const isWinningCell = line.includes(i);
            return (
              <button
                key={i}
                className={`cell ${cell ? "filled" : ""} ${
                  isWinningCell ? "winCell" : ""
                }`}
                onClick={() => handleMove(i)}
                disabled={Boolean(winner) || Boolean(cell)}
                role="gridcell"
                aria-label={`Celda ${i + 1} ${cell ? `con ${cell}` : "vacía"}`}
              >
                <span className={`mark ${cell === "X" ? "x" : cell === "O" ? "o" : ""}`}>
                  {cell}
                </span>
              </button>
            );
          })}
        </div>

        <p className="hint">
          Tip: podés jugar rápido — cuando hay ganador se resalta la línea.
        </p>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} · Maira</span>
      </footer>
    </div>
  );
}
