import Game from './scripts/Game.js';
import domUpdates from './scripts/domUpdates.js';
import Wheel from './scripts/Wheel.js'
import $ from 'jquery';
import jQuery from 'jquery';
window.$ = jQuery;

import './css/base.css';
import './css/reset.css';

import './images/shroom-guy-bubble.png'

let wheel;
let game; 
 
$('.js-start-button').on('click', (e) => {
  e.preventDefault();
  let newPlayers = domUpdates.updatePlayerNames();
  game = new Game();
  wheel = new Wheel();
  game.wheel = wheel;
  game.startGame();
  game.createPlayers(newPlayers);
  $('.js-splash-page').addClass('hide');
});

$('.js-exit-btn').on('click', () => {
  location.reload();
});

$('.js-spin-btn').on('click', () => {
  wheel.spin();
  $('.current-space-container').empty().append(wheel.currentSpace);
  if (wheel.currentSpace === 'BANKRUPT') {
    game.players[game.currentPlayer].roundCoins = 0;
    domUpdates.updateScoreDisplay(game.players[game.currentPlayer].name, 0);
    game.switchPlayerTurn();
  } else if (wheel.currentSpace === 'LOSE A TURN') {
    game.switchPlayerTurn();
  } else {
    $('.js-buy-vowel').removeClass('disable-clicks');
    $('.consonant').removeClass('disable-clicks');
    $('.js-solve-btn').removeClass('disable-clicks');
    alert('Please select a letter or buy a vowel');
  }
});

$('.letters-in-bank').on('click', (e) => {
  console.log(game.players);
  console.log(game.players[game.currentPlayer])
    game.players[game.currentPlayer].checkPlayerLetter(game.currentPuzzle, e.target.innerText, wheel.currentSpace);
    let areLettersHidden = domUpdates.revealLetter(e.target.innerText.trim());
    if (!areLettersHidden) {
      $('.js-solve-btn').addClass('disable-clicks');
      $('.js-buy-vowel').addClass('disable-clicks');
      game.increaseRound();
    } else if ($(e.target).hasClass('letters-in-bank')) {
      $(e.target).addClass('hidden-letter'); 
      game.switchPlayerTurn();
    }
});


$('.js-buy-vowel').on('click', () => {
  if (game.players[game.currentPlayer].roundCoins >= 100) {
    $('.vowel').removeClass('disable-clicks');
    alert('Please select a vowel');
    game.players[game.currentPlayer].roundCoins -= 100;
  } else if (game.players[game.currentPlayer].roundCoins < 100) {
    alert('You need 100 coins to buy a vowel');
  }
});

$('.solve-btn').on('click', () => {
  domUpdates.appendEntryBox()
});

$('.submit-guess-btn').on('click', (e) => {
  e.preventDefault()
  let inputValue = $('.solve-puzzle-input').val()
  game.players[game.currentPlayer].checkSolutionInput(game.currentPuzzle, inputValue)
  $('.solve-pop-up').addClass('hide')
});
