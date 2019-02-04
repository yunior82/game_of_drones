import { moves } from './moves.json';

export function getWinner(player1Choice, player2Choice, player_1, player_2) {
    
    var winner = 0; //means that no player wins a round
    if (player1Choice === player2Choice) winner = 3 //means a draw
    moves.forEach(function(move, i) {
        if ( move.move === player2Choice && move.kills === player1Choice ) { winner = player_2 } //means that player2 wins
        if ( move.move === player1Choice && move.kills === player2Choice ) { winner = player_1 } //means that player1 wins
    })
    return winner;
  }
