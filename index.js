const COLUMN_COUNT = 7;
const ROW_COUNT = 6;
const PLAYERS_TYPES = { HUMAN: "HUMAN", CPU: "CPU" };
const PLAYERS_COLORS = { RED: { class: "red" }, YELLOW: { class: "yellow" } };

let playerManger, game;

document.addEventListener("DOMContentLoaded", load);
function load() {
    playerManger = new PlayerManger([
        new Player(1, "Red", PLAYERS_COLORS.RED, PLAYERS_TYPES.HUMAN),
        new Player(2, "Yellow", PLAYERS_COLORS.YELLOW, PLAYERS_TYPES.HUMAN),
    ]);
    paintHome();
}

//#region EVENTS

const onClickPlayButton = () => {
    game = new Game(playerManger, COLUMN_COUNT, ROW_COUNT);
    paintGame();
    if (game.players.getCurrentPlayer().type === PLAYERS_TYPES.CPU) {
        cpuPlay(game.gameBoard, game.players.getCurrentPlayer());
    }
};

const onChangePlayerType = (playerId, playerType) => {
    playerManger.setPlayerType(playerId, playerType);
    paintHome();
};

const onClickInsertPlayerToken = (columnIndex) => {
    game.insertCurrentPlayerTokenInColumn(columnIndex);
    paintGame();
    if (
        !game.gameOver &&
        game.players.getCurrentPlayer().type === PLAYERS_TYPES.CPU
    ) {
        cpuPlay(game.gameBoard, game.players.getCurrentPlayer());
    }
};

const onClickResetButton = () => {
    game = new Game(playerManger, COLUMN_COUNT, ROW_COUNT);
    paintGame();
    if (game.players.getCurrentPlayer().type === PLAYERS_TYPES.CPU) {
        cpuPlay(game.gameBoard, game.players.getCurrentPlayer());
    }
};

const onClickHomeButton = () => {
    paintHome();
};

//#endregion

//#region PAINT FUNCTIONS

const paintHome = () => {
    let html = `<div>${getPaintTitleConnect4()}</div>`;
    html += `<div class="player-cards-container">
    ${getPaintPlayerConfigurationCard(playerManger.players[0])}
    ${getPaintPlayerConfigurationCard(playerManger.players[1])}
    </div>`;
    html += `<div class="flex-grow-1 flex-center-content">${getPaintPlayButton()}</div>`;
    document.querySelector("#mainContainer").innerHTML = html;
};

const getPaintTitleConnect4 = () => {
    return `<h1 class="title">Connect 4</h1>`;
};

const getPaintPlayButton = () => {
    let html = `<button class="play-button" onclick="onClickPlayButton()">PLAY</button>`;
    return html;
};

const getPaintPlayerConfigurationCard = (player) => {
    let html = `<div class="player-card ${player.color.class}">
        <div class="token-container">${getPaintSvgById(
            "token",
            `token ${player.color.class}`
        )}</div>
        <div class="player-name">${player.name}</div>
        <div class="player-type-container">
            <button ${
                player.type === PLAYERS_TYPES.HUMAN ? "class='enabled'" : ""
            } 
            onclick="onChangePlayerType(${player.id}, '${
        PLAYERS_TYPES.HUMAN
    }')">HUMAN</button>
            <button ${
                player.type === PLAYERS_TYPES.CPU ? "class='enabled'" : ""
            }
             onclick="onChangePlayerType(${player.id}, '${
        PLAYERS_TYPES.CPU
    }')">CPU</button>
        </div>   
  </div>`;
    return html;
};

const paintGame = () => {
    let html = getPaintInfoContainer();
    html += `<div class="flex-grow-1">`;
    html += getPaintGameBoard(
        game.gameBoard.board,
        game.players.getCurrentPlayer(),
        game.gameOver
    );
    html += getPaintNavPanelSmallDevice();
    html += `</div>`;
    document.querySelector("#mainContainer").innerHTML = html;
};

const getPaintPlayerGameCard = (player) => {
    let html = `<div class="player-card d-flex">
      <div>
        <div>${player.name}</div>
      </div>
      <div>${getPaintSvgById("token", player.color.class)}</div>
  </div>`;
    return html;
};

const getPaintInfoContainer = () => {
    if (game.gameOver && game.winnerPlayer) {
        let html = `<div class="turn-panel ${game.winnerPlayer.color.class}">`;
        html += getPaintWinnerPlayer(game.winnerPlayer);
        html += `<div class="nav-buttons-panel">${getPaintNavButtons()}</div>`;
        html += `</div>`;
        return html;
    }

    if (game.gameOver && game.draw) {
        let html = `<div class="turn-panel draw">DRAW!!!`;
        html += `<div class="nav-buttons-panel">${getPaintNavButtons()}</div>`;
        html += `</div>`;
        return html;
    }

    let html = `<div class="turn-panel ${
        game.players.getCurrentPlayer().color.class
    }">`;
    html += getPaintPlayerTurn(game.players.getCurrentPlayer());
    html += `<div class="nav-buttons-panel">${getPaintNavButtons()}</div>`;
    html += `</div>`;
    return html;
};

const getPaintWinnerPlayer = (player) => {
    let html = `
    <div class="d-flex">
      <div class="crown-container"><svg viewBox="0 0 50 30"><use href="#crown" x="0" y="-10" /></svg></div>
      <div>${player.name.toUpperCase()} WIN !!!</div>
      <div class="crown-container"><svg viewBox="0 0 50 30"><use href="#crown" x="0" y="-10" /></svg></div>
    </div>`;
    return html;
};

const getPaintPlayerTurn = (player) => {
    let html = `<div class="text-border">${player.name.toUpperCase()} TURN</div>`;
    return html;
};

const getPaintNavButtons = () => {
    let html = `<button class="nav-button" onclick="onClickHomeButton()">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M575.8 255.5C575.8 273.5 560.8 287.6 543.8 287.6H511.8L512.5 447.7C512.5 450.5 512.3 453.1 512 455.8V472C512 494.1 494.1 512 472 512H456C454.9 512 453.8 511.1 452.7 511.9C451.3 511.1 449.9 512 448.5 512H392C369.9 512 352 494.1 352 472V384C352 366.3 337.7 352 320 352H256C238.3 352 224 366.3 224 384V472C224 494.1 206.1 512 184 512H128.1C126.6 512 125.1 511.9 123.6 511.8C122.4 511.9 121.2 512 120 512H104C81.91 512 64 494.1 64 472V360C64 359.1 64.03 358.1 64.09 357.2V287.6H32.05C14.02 287.6 0 273.5 0 255.5C0 246.5 3.004 238.5 10.01 231.5L266.4 8.016C273.4 1.002 281.4 0 288.4 0C295.4 0 303.4 2.004 309.5 7.014L564.8 231.5C572.8 238.5 576.9 246.5 575.8 255.5L575.8 255.5z"/></svg>
  </button>
  <button class="nav-button" onclick="onClickResetButton()">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 16c-17.67 0-32 14.31-32 32v74.09C392.1 66.52 327.4 32 256 32C161.5 32 78.59 92.34 49.58 182.2c-5.438 16.81 3.797 34.88 20.61 40.28c16.89 5.5 34.88-3.812 40.3-20.59C130.9 138.5 189.4 96 256 96c50.5 0 96.26 24.55 124.4 64H336c-17.67 0-32 14.31-32 32s14.33 32 32 32h128c17.67 0 32-14.31 32-32V48C496 30.31 481.7 16 464 16zM441.8 289.6c-16.92-5.438-34.88 3.812-40.3 20.59C381.1 373.5 322.6 416 256 416c-50.5 0-96.25-24.55-124.4-64H176c17.67 0 32-14.31 32-32s-14.33-32-32-32h-128c-17.67 0-32 14.31-32 32v144c0 17.69 14.33 32 32 32s32-14.31 32-32v-74.09C119.9 445.5 184.6 480 255.1 480c94.45 0 177.4-60.34 206.4-150.2C467.9 313 458.6 294.1 441.8 289.6z"/></svg>
  </button>`;
    return html;
};

const getPaintNavPanelSmallDevice = () => {
    let html = `<div class="nav-buttons-panel-small-device">`;
    html += getPaintNavButtons();
    html += `</div>`;
    return html;
};

const getPaintGameBoard = (board, currentPlayer, gameOver) => {
    let html = `<div class="game-board blue">`;
    html += `<div class="cell">${getPaintSvgById(
        "topLeftCorner",
        "board-color"
    )}</div>`;
    html += getPaintInsertTokenButtonsRow(board, currentPlayer, gameOver);
    html += `<div class="cell">${getPaintSvgById(
        "topRightCorner",
        "board-color"
    )}</div>`;
    html += `<div class="vertical-section">${repeatBoardSvgHtmlString(
        ROW_COUNT,
        "leftBorder"
    )}</div>`;
    html += getPaintGameBoardCellsPanel(board);
    html += `<div class="vertical-section">${repeatBoardSvgHtmlString(
        ROW_COUNT,
        "rightBorder"
    )}</div>`;
    html += `<div class="cell">${getPaintSvgById(
        "bottomLeftCorner",
        "board-color"
    )}</div>`;
    html += `<div class="horizontal-section">${repeatBoardSvgHtmlString(
        COLUMN_COUNT,
        "bottomBorder"
    )}</div>`;
    html += `<div class="cell">${getPaintSvgById(
        "bottomRightCorner",
        "board-color"
    )}</div>`;
    html += `</div>`;
    return html;
};

const getPaintInsertTokenButtonsRow = (board, currentPlayer, gameOver) => {
    let html = `<div class="horizontal-section">`;
    for (let columnIndex = 0; columnIndex < COLUMN_COUNT; columnIndex++) {
        let freePositions = board.some(
            (item) => item.column === columnIndex && item.player === null
        );
        html += `<div class="cell">`;
        html += getPaintSvgById("topBackBorder", "board-color");
        html += getPaintSvgById("topFrontBorder", "board-color");
        if (
            currentPlayer.type !== PLAYERS_TYPES.CPU &&
            freePositions &&
            !gameOver
        ) {
            html += `<div><button class="button-insert-token" onclick="onClickInsertPlayerToken(${columnIndex})">`;
            html += getPaintSvgById("buttonInsert", null, "no-focus");
            html += getPaintSvgById(
                "buttonInsertFocus",
                null,
                `focus ${currentPlayer.color.class}`
            );
            html += `</button></div>`;
        }
        html += `</div>`;
    }
    html += `</div>`;
    return html;
};

const getPaintGameBoardCellsPanel = (board) => {
    let html = `<div class="game-panel">`;
    let gameBoardObjectsForPaint = sortGameBoardObjectsByRowAndColumn(board);
    gameBoardObjectsForPaint.forEach((gameBoardCell) => {
        html += htmlPaintGameBoardCell(gameBoardCell);
    });
    html += `</div>`;
    return html;
};

const sortGameBoardObjectsByRowAndColumn = (board) => {
    return [...board].sort((item1, item2) => {
        if (item1.row < item2.row) return 1;
        if (item1.row > item2.row) return -1;
        if (item1.column > item2.column) return 1;
        if (item1.column < item2.column) return -1;
        return 0;
    });
};

const htmlPaintGameBoardCell = (gameBoardCell) => {
    let html = `<div class="cell">`;
    html += getPaintSvgById("backCell", "board-color");
    if (gameBoardCell.player) {
        html += getPaintSvgById(
            "token",
            `token ${gameBoardCell.player.color.class}`
        );
    }
    html += getPaintSvgById("frontCell", "board-color");
    if (gameBoardCell.isPartOfLine) {
        html += getPaintSvgById("crown");
    }
    html += `</div>`;
    return html;
};

const repeatBoardSvgHtmlString = (count, svgId) => {
    const htmlElements = [];
    for (let index = 0; index < count; index++) {
        htmlElements.push(
            `<div class="cell">${getPaintSvgById(svgId, "board-color")}</div>`
        );
    }
    return htmlElements.join("");
};

const getPaintSvgById = (svgId, classSvgUse, classDiv) => {
    let classSvgUseString = classSvgUse ? `class="${classSvgUse}"` : "";
    let classDivString = classDiv ? `class="${classDiv}"` : "";
    return `<div ${classDivString}><svg viewBox="0 0 50 50"><use href="#${svgId}" ${classSvgUseString} x="0" y="0" /></svg></div>`;
};

//#endregion

//#region CPU

const cpuPlay = (gameBoard, player) => {
    const freeGameBoardCells = gameBoard.getFirstFreeGameBoardCellInColumns();

    const positionsForCompleteLines =
        getGameObjectCellsToSearchPartialLines(gameBoard);
    const positionsForWin = positionsForCompleteLines.filter(
        (position) => position.playerId === player.id
    );
    const positionsForLose = positionsForCompleteLines.filter(
        (position) => position.playerId !== player.id
    );

    let playColumnIndex = null;

    if (positionsForWin.length > 0 && Math.floor(Math.random() * 100) > 20) {
        // calcular que posiciones se pueden rellenar de las libres
        let playsForWin = comparePositionsAndGetMatching(
            freeGameBoardCells,
            positionsForWin
        );
        if (playsForWin.length > 0) {
            const objectIndex = Math.floor(
                Math.random() * (playsForWin.length - 1)
            );
            playColumnIndex = playsForWin[objectIndex].column;
        }
    }

    if (
        !playColumnIndex &&
        positionsForLose.length > 0 &&
        Math.floor(Math.random() * 100) > 20
    ) {
        // calcular que posiciones se pueden rellenar de las libres
        let playsForLose = comparePositionsAndGetMatching(
            freeGameBoardCells,
            positionsForLose
        );
        if (playsForLose.length > 0) {
            const objectIndex = Math.floor(
                Math.random() * (playsForLose.length - 1)
            );
            playColumnIndex = playsForLose[objectIndex].column;
        }
    }

    if (!playColumnIndex) {
        const objectIndex = Math.floor(
            Math.random() * (freeGameBoardCells.length - 1)
        );
        playColumnIndex = freeGameBoardCells[objectIndex].column;
    }
    game.insertCurrentPlayerTokenInColumn(playColumnIndex);
    paintGame();
};

const comparePositionsAndGetMatching = (
    freeGameBoardCells,
    positionsToCompare
) => {
    const equalPositions = [];
    freeGameBoardCells.forEach((gameBoardCell) => {
        if (
            positionsToCompare.some(
                (position) =>
                    gameBoardCell.column === position.column &&
                    gameBoardCell.row === position.row
            )
        ) {
            equalPositions.push(gameBoardCell);
        }
    });
    return equalPositions;
};

const getGameObjectCellsToSearchPartialLines = (gameBoard) => {
    const directionsFunctions = [
        {
            startPositions: () => gameBoard.getHorizontalStartPositions(),
            getLineCells: (position) =>
                gameBoard.getHorizontalGameBoardsCellsByPosition(position[1]),
        },
        {
            startPositions: () => gameBoard.getVerticalStartPositions(),
            getLineCells: (position) =>
                gameBoard.getVerticalGameBoardsCellsByPosition(position[0]),
        },
        {
            startPositions: () => gameBoard.getUpwardDiagonalStartPositions(),
            getLineCells: (position) =>
                gameBoard.getUpwardDiagonalGameBoardsCellsByPosition(
                    position[0],
                    position[1]
                ),
        },
        {
            startPositions: () => gameBoard.getDownwardDiagonalStartPositions(),
            getLineCells: (position) =>
                gameBoard.getDownwardDiagonalGameBoardsCellsByPosition(
                    position[0],
                    position[1]
                ),
        },
    ];

    let positionsForCompleteLines = [];
    directionsFunctions.forEach((directionFunction, index) => {
        let positions = getPositionsThatCompleteLinesByDirection(
            directionFunction.startPositions,
            directionFunction.getLineCells
        );
        positionsForCompleteLines = positionsForCompleteLines.concat(positions);
    });

    return positionsForCompleteLines;
};

const getPositionsThatCompleteLinesByDirection = (
    getStartPositions,
    getGameBoardsCellByPosition
) => {
    let positionsForCompleteLines = [];
    const startPositions = getStartPositions();
    startPositions.forEach((startPosition) => {
        const directionGameBoardCells =
            getGameBoardsCellByPosition(startPosition);
        const positions = getPositionsThatCompleteLines(
            directionGameBoardCells
        );
        positionsForCompleteLines = positionsForCompleteLines.concat(positions);
    });
    return positionsForCompleteLines;
};

const getPositionsThatCompleteLines = (directionGameBoardCells) => {
    const positions = [];
    for (let index = 0; index < directionGameBoardCells.length - 3; index++) {
        let range = directionGameBoardCells.slice(index, index + 4);
        if (
            range.filter((gameBoardCell) => gameBoardCell.player === null)
                .length !== 1
        ) {
            continue;
        }
        let playerNotNull = range.find((item) => item.player !== null).player;
        if (
            range.some(
                (gameBoardCell) =>
                    gameBoardCell.player &&
                    gameBoardCell.player.id !== playerNotNull.id
            )
        ) {
            continue;
        }
        const positionForLine = range.find(
            (gameBoardCell) => gameBoardCell.player === null
        );
        if (
            !positions.some(
                (position) =>
                    positionForLine.column === position.column &&
                    positionForLine.row === position.row
            )
        ) {
            positions.push({
                playerId: playerNotNull.id,
                column: positionForLine.column,
                row: positionForLine.row,
            });
        }
    }
    return positions;
};

//#endregion

class Player {
    constructor(id, name, color, type) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.type = type;
    }
}

class PlayerManger {
    currentPlayerIndex = 0;
    constructor(players) {
        this.players = players;
    }

    getCurrentPlayer = () => {
        return this.players[this.currentPlayerIndex];
    };

    getPlayerById = (playerId) => {
        return this.players.find((player) => player.id === playerId);
    };

    setPlayerType = (playerId, playerType) => {
        this.players.find((player) => player.id === playerId).type = playerType;
        if (this.players.every((player) => player.type === PLAYERS_TYPES.CPU)) {
            this.players.find((player) => player.id !== playerId).type =
                PLAYERS_TYPES.HUMAN;
        }
    };

    changeCurrentPlayerToNextPlayer = () => {
        this.currentPlayerIndex < this.players.length - 1
            ? this.currentPlayerIndex++
            : (this.currentPlayerIndex = 0);
    };

    setRandomCurrentPlayer = () => {
        this.currentPlayerIndex = Math.floor(
            Math.random() * this.players.length
        );
    };
}

class GameBoardCell {
    player = null;
    isPartOfLine = false;
    constructor(column, row) {
        this.column = column;
        this.row = row;
    }
}

class GameBoard {
    constructor(columnsCount, rowsCount) {
        this.columnsCount = columnsCount;
        this.rowsCount = rowsCount;
        this.board = this.createNewBoard(columnsCount, rowsCount);
    }

    createNewBoard = (columns, rows) => {
        let newBoard = [];
        for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
            for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
                newBoard.push(new GameBoardCell(columnIndex, rowIndex));
            }
        }
        return newBoard;
    };

    getFirstFreeGameBoardCellInColumns = () => {
        const firstFreeCellInColumns = [];
        for (let column = 0; column < this.columnsCount; column++) {
            const gameBoardCell =
                this.getFirstFreeGameBoardCellInColumn(column);
            if (gameBoardCell) {
                firstFreeCellInColumns.push(gameBoardCell);
            }
        }
        return firstFreeCellInColumns;
    };

    getFirstFreeGameBoardCellInColumn = (columnIndex) => {
        let foundGameBoardCell = this.board.find(
            (gameBoardCell) =>
                gameBoardCell.column === columnIndex &&
                gameBoardCell.player === null
        );
        return foundGameBoardCell;
    };

    insertPlayerTokenByPosition = (columnIndex, rowIndex, player) => {
        let index = this.board.findIndex(
            (gameBoardCell) =>
                gameBoardCell.column === columnIndex &&
                gameBoardCell.row === rowIndex
        );
        if (index !== -1) {
            this.board[index].player = player;
        }
    };

    getIfSomeLineIsComplete = () => {
        return this.board.some((gameBoardCell) => gameBoardCell.isPartOfLine);
    };

    checkCompleteLinesByPosition = (columnIndex, rowIndex, player) => {
        let gameBoardCellsInLines = [];
        const directionsFunctions = [
            () => this.getHorizontalGameBoardsCellsByPosition(rowIndex),
            () => this.getVerticalGameBoardsCellsByPosition(columnIndex),
            () =>
                this.getUpwardDiagonalGameBoardsCellsByPosition(
                    columnIndex,
                    rowIndex
                ),
            () =>
                this.getDownwardDiagonalGameBoardsCellsByPosition(
                    columnIndex,
                    rowIndex
                ),
        ];
        directionsFunctions.forEach((directionFunction) => {
            const gameBoardCellsByDirection = directionFunction();
            const gameBoardsCellWithLine =
                this.searchLineInGameBoardDirectionCells(
                    gameBoardCellsByDirection,
                    player
                );
            gameBoardCellsInLines = gameBoardCellsInLines.concat(
                gameBoardsCellWithLine
            );
        });

        if (gameBoardCellsInLines.length > 0) {
            this.board = this.checkAsLineCompleteGameObjects(
                gameBoardCellsInLines
            );
        }
    };

    searchLineInGameBoardDirectionCells = (gameBoardDirectionCells, player) => {
        let lines = [];
        let elementsOfLine = [];
        gameBoardDirectionCells.forEach((gameBoardCell) => {
            if (gameBoardCell.player && gameBoardCell.player.id === player.id) {
                elementsOfLine.push(gameBoardCell);
            } else {
                if (elementsOfLine.length > 3) {
                    // Es una linea de 4 o mas
                    lines = lines.concat(elementsOfLine);
                }
                elementsOfLine = [];
            }
        });

        if (elementsOfLine.length > 3) {
            lines = lines.concat(elementsOfLine);
        }
        return lines;
    };

    getHorizontalGameBoardsCellsByPosition = (rowIndex) => {
        return this.board.filter(
            (gameBoardCell) => gameBoardCell.row === rowIndex
        );
    };

    getVerticalGameBoardsCellsByPosition = (columnIndex) => {
        return this.board.filter(
            (gameBoardCell) => gameBoardCell.column === columnIndex
        );
    };

    getUpwardDiagonalGameBoardsCellsByPosition = (columnIndex, rowIndex) => {
        return this.board.filter(
            (gameBoardCell) =>
                gameBoardCell.column - gameBoardCell.row ===
                columnIndex - rowIndex
        );
    };

    getDownwardDiagonalGameBoardsCellsByPosition = (columnIndex, rowIndex) => {
        return this.board.filter(
            (gameBoardCell) =>
                gameBoardCell.column + gameBoardCell.row ===
                columnIndex + rowIndex
        );
    };

    checkAsLineCompleteGameObjects = (gameBoardCellsInLines) => {
        return this.board.map((gameBoardCell) => {
            if (
                gameBoardCellsInLines.some(
                    (gameBoardCellInLine) =>
                        gameBoardCellInLine.column === gameBoardCell.column &&
                        gameBoardCellInLine.row === gameBoardCell.row
                )
            ) {
                return { ...gameBoardCell, isPartOfLine: true };
            }
            return gameBoardCell;
        });
    };

    getHorizontalStartPositions = () => {
        const positions = [];
        for (let rowIndex = 0; rowIndex < this.rowsCount; rowIndex++) {
            positions.push([0, rowIndex]);
        }
        return positions;
    };

    getVerticalStartPositions = () => {
        const positions = [];
        for (
            let columnIndex = 0;
            columnIndex < this.columnsCount;
            columnIndex++
        ) {
            positions.push([columnIndex, 0]);
        }
        return positions;
    };

    getUpwardDiagonalStartPositions = () => {
        const positions = [];
        for (let rowIndex = 0; rowIndex < this.rowsCount - 3; rowIndex++) {
            positions.push([0, rowIndex]);
        }
        for (
            let columnIndex = 1;
            columnIndex < this.columnsCount - 3;
            columnIndex++
        ) {
            positions.push([columnIndex, 0]);
        }
        return positions;
    };

    getDownwardDiagonalStartPositions = () => {
        const positions = [];
        for (let rowIndex = this.rowsCount - 1; rowIndex > 2; rowIndex--) {
            positions.push([0, rowIndex]);
        }
        for (
            let columnIndex = 1;
            columnIndex < this.columnsCount - 3;
            columnIndex++
        ) {
            positions.push([columnIndex, this.rowsCount - 1]);
        }
        return positions;
    };
}

class Game {
    gameOver = false;
    winnerPlayer = null;
    draw = false;
    constructor(players, columnsCount, rowsCount) {
        this.columnsCount = columnsCount;
        this.rowsCount = rowsCount;
        this.players = players;
        this.players.setRandomCurrentPlayer();
        this.gameBoard = this.getNewGameBoard();
    }

    insertCurrentPlayerTokenInColumn = (columnIndex) => {
        const firstFreeGameBoardCell =
            this.gameBoard.getFirstFreeGameBoardCellInColumn(columnIndex);
        if (!firstFreeGameBoardCell) return;

        this.gameBoard.insertPlayerTokenByPosition(
            firstFreeGameBoardCell.column,
            firstFreeGameBoardCell.row,
            this.players.getCurrentPlayer()
        );

        this.gameBoard.checkCompleteLinesByPosition(
            firstFreeGameBoardCell.column,
            firstFreeGameBoardCell.row,
            this.players.getCurrentPlayer()
        );

        if (this.gameBoard.getIfSomeLineIsComplete()) {
            this.gameOver = true;
            this.winnerPlayer = this.players.getCurrentPlayer();
            return;
        }

        if (this.gameBoard.getFirstFreeGameBoardCellInColumns().length === 0) {
            this.gameOver = true;
            this.draw = true;
            return;
        }

        this.players.changeCurrentPlayerToNextPlayer();
    };

    getNewGameBoard = () => {
        return new GameBoard(this.columnsCount, this.rowsCount);
    };
}
