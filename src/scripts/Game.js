import Wheel from './Wheel.js'
import Player from './Player.js'
import data from '../data.js'
import helper from './helper.js'
import domUpdates from './domUpdates.js'
import BonusWheel from './BonusWheel.js'

class Game {
  constructor() {
    this.round = 1;
    this.players = [];
    this.currentPlayer = 0;
    this.wheel = [];
    this.puzzleBank = [];
    this.currentPuzzle = [];
  }

  startGame() {
    this.wheel.createSpaces();
    this.createPuzzleBank();
  }

  createPlayers(playerNames) {
    playerNames.forEach((name) => {
      let player = new Player(name)
      this.players.push(player)
    })
  }

  createPuzzleBank() {
    let randomIndex = helper.getRandomInt(0, 23);
    let puzzleOne = data.puzzles.one_word_answers.puzzle_bank[randomIndex];
    let puzzleTwo = data.puzzles.two_word_answers.puzzle_bank[randomIndex];
    let puzzleThree = data.puzzles.three_word_answers.puzzle_bank[randomIndex];
    let puzzleFour = data.puzzles.four_word_answers.puzzle_bank[randomIndex];
    let bonusPuzzle = data.puzzles.four_word_answers.puzzle_bank[randomIndex + 1];

    this.puzzleBank.push(puzzleOne, puzzleTwo, puzzleThree, puzzleFour, bonusPuzzle);
    this.createPuzzleArray();
  }

  createPuzzleArray() {
    let currentRoundCategory = this.puzzleBank[0].category;
    let puzzleLetters = this.puzzleBank[0].correct_answer.toUpperCase().split('');
    domUpdates.displayPuzzle(currentRoundCategory, puzzleLetters);
    this.currentPuzzle = puzzleLetters;
  }

  switchPlayerTurn() {
    domUpdates.vowelDisableClicks();
    domUpdates.consonantDisableClicks();
    if (this.currentPlayer < 2) {
      this.currentPlayer++
    } else {
      this.currentPlayer = 0
    }
    domUpdates.highlightCurrentPlayer(this.currentPlayer);
  }


  increaseRound() {
    if (this.round < 4) {
      this.round++;
    } 
    else {
      this.bonusRound();
    }
    this.puzzleBank.shift();
    domUpdates.removePuzzle();
    this.createPuzzleArray();
    this.players.sort((playerA, playerB) => {
      return playerB.roundCoins - playerA.roundCoins;
    });
    const mappedPlayerNames = this.players.map((player)=> {
      return player.name
    });
    this.updatePlayerDisplays(mappedPlayerNames);
    domUpdates.reinstateLetterBank();
   
  }

  updatePlayerDisplays(mappedPlayerNames) {
    domUpdates.displayPlayerNames(mappedPlayerNames);
    this.players[0].updateWinnerCoins(this.players[0].roundCoins);
    this.players.forEach((player) => {
      player.updateAllRoundCoins();
      domUpdates.updateScoreDisplay(player.name, player.roundCoins, player.totalCoins);
    });
  }

  bonusRound() {
    this.wheel = new BonusWheel();
    this.wheel.createSpaces();
    this.players.sort((playerA, playerB) => {
      return playerB.totalCoins - playerA.totalCoins;
    });
    const mappedPlayerNames = this.players.map((player)=> {
      return player.name
    });
    this.players = [this.players[0]];
    this.currentPlayer = 0;
    domUpdates.highlightCurrentPlayer(0);
  }
  
}
export default Game;
