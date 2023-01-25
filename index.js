(function () {
  const game = {
    xTurn: true,
    xState: [],
    oState: [],
    players: [],
    winningStates: [
      // rows
      ["0", "1", "2"],
      ["3", "4", "5"],
      ["6", "7", "8"],
      // columns
      ["0", "3", "6"],
      ["1", "4", "7"],
      ["2", "5", "8"],
      // diagonals
      ["0", "4", "8"],
      ["2", "4", "6"]
    ]
  };

  const playerNameElem = document.querySelector(".player-one .player-name");
  const changePlayerNameBtn = document.getElementById("change-name");
  changePlayerNameBtn.addEventListener("click", changePlayerName);

  function changePlayerName() {
    const playerName = window.prompt("What is your name?");
    game.players[0] = playerName;
    playerNameElem.innerHTML = playerName;
    document.getElementById("turn").innerHTML = `${playerName}'s`;
  }

  game.players[0] = "Unknown";
  game.players[1] = "Computer";

  document.addEventListener("click", playOnClick);
  displayTurn();

  restart();

  function displayTurn() {
    document.querySelector("#turn").innerText = game.xTurn
      ? `${game.players[0]}'s`
      : `${game.players[1]}'s`;
  }

  function autoPlay() {
    const gridCells = Array.from(document.querySelectorAll(".grid-cell"));

    const unfilledCells = gridCells.filter((cell) => {
      return !cell.classList.contains("disabled");
    });

    let selectedCell;
    let selectedCellValue;

    if (!game.xTurn) {
      selectedCellValue = getEasyWinCell();
      if (selectedCellValue) {
        const selector = `div[data-value="${selectedCellValue}"]`;
        selectedCell = document.querySelector(selector);
      }
    }

    if (!selectedCellValue) {
      const randomCellSelect = Math.floor(Math.random() * unfilledCells.length);
      selectedCell = unfilledCells[randomCellSelect];
      selectedCellValue = selectedCell.dataset.value;
    }

    game.oState.push(selectedCellValue);
    selectedCell.classList.add(game.xTurn ? "x" : "o");
    selectedCell.classList.add("disabled");

    const gameWon = checkForWin();
    if (gameWon) return;
    const isDraw = checkForDraw();
    if (isDraw) return;

    game.xTurn = !game.xTurn;
    displayTurn();
  }

  function getEasyWinCell() {
    const cornerCells = ["0", "2", "6", "8"];
    if (!game.xState.includes("4") && !game.oState.includes("4")) {
      return "4";
    }

    if (
      cornerCells.every(
        (c) => !game.xState.includes(c) && !game.oState.includes(c)
      )
    ) {
      return cornerCells[Math.floor(Math.random() * cornerCells.length)];
    }

    for (let winningState of game.winningStates) {
      const filledCells = winningState.filter((s) => {
        return game.xTurn ? game.xState.includes(s) : game.oState.includes(s);
      });

      if (filledCells.length === 2) {
        const unfilledCell = winningState.find((s) => !game.oState.includes(s));
        console.log({ unfilledCell });
        if (!game.xState.includes(unfilledCell)) {
          return unfilledCell;
        }
      }
    }

    for (let winningState of game.winningStates) {
      let xFilledCells = winningState.filter((s) => game.xState.includes(s));
      if (xFilledCells.length === 2) {
        const unfilledCell = winningState.find((s) => !game.xState.includes(s));
        if (!game.oState.includes(unfilledCell)) {
          return unfilledCell;
        }
      }
    }

    for (let winningState of game.winningStates) {
      const filledCells = winningState.filter((s) => {
        return game.xTurn ? game.xState.includes(s) : game.oState.includes(s);
      });

      if (filledCells.length === 1) {
        const availableCells = winningState.filter((s) => {
          return !game.oState.includes(s) && !game.xState.includes(s);
        });
        if (availableCells.length) {
          for (let cell of availableCells) {
            if (!game.xState.includes(cell) && !game.oState.includes(cell)) {
              return cell;
            }
          }
        }
      }
    }
  }

  function playOnClick(event) {
    const { target } = event;
    const isCall = target.classList.contains("grid-cell");
    if (!isCall) return;
    const isDisabled = target.classList.contains("disabled");

    if (isCall && !isDisabled) {
      const cellValue = target.dataset.value;
      if (game.xTurn) {
        game.xState.push(cellValue);
      } else {
        game.oState.push(cellValue);
      }

      target.classList.add("disabled");
      target.classList.add(game.xTurn ? "x" : "o");

      game.xTurn = !game.xTurn;
      displayTurn();
    }

    const gameWon = checkForWin();
    if (gameWon) return;
    const isDraw = checkForDraw();
    if (isDraw) return;
    setTimeout(autoPlay, 1000);
  }

  function checkForDraw() {
    if (!document.querySelectorAll(".grid-cell:not(.disabled)").length) {
      document.querySelector(".game-over").classList.add("visible");
      document.querySelector(".game-over-text").textContent = "Draw";
      return true;
    }
  }

  function checkForWin() {
    for (let i = 0; i < game.winningStates.length; i++) {
      const winningState = game.winningStates[i];
      const xWins = winningState.every((val) => game.xState.includes(val));
      const oWins = winningState.every((val) => game.oState.includes(val));

      if (xWins || oWins) {
        document
          .querySelectorAll(".grid-cell")
          .forEach((cell) => cell.classList.add("disabled"));
        document.querySelector(".game-over").classList.add("visible");
        document.querySelector(".game-over-text").textContent = xWins
          ? game.players[0] + " wins!"
          : game.players[1] + " wins!";

        return true;
      }
    }
  }

  function restart() {
    document.querySelector(".restart").addEventListener("click", () => {
      document.querySelector(".game-over").classList.remove("visible");
      document.querySelectorAll(".grid-cell").forEach((cell) => {
        cell.classList.remove("disabled", "x", "o");
      });

      resetGame();
      displayTurn();
    });
  }

  function resetGame() {
    game.xTurn = true;
    game.xState = [];
    game.oState = [];
  }
})();
