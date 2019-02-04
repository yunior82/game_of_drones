import React, { Component } from 'react';
import axios from "axios";
import './Game.css';

// Moves config
import { moves } from '../utils/moves.json';
// get winner tool
import { getWinner } from '../utils/winner.js';

var scores = [];
class Game extends Component {
    constructor () {
        super();
        this.state = {
            player_1: '',
            player_2: '',
            move: '',
            moves,
            round: 1,
            actual_player: '',
            player_moves: [],
            score: [], //Array with Score table
            games: '',
            showFinalMessage: null,
            winner: 'aaaa'
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        //this.handleSubmit = this.handleSubmit.bind(this);
        this.putMoveToDB = this.putMoveToDB.bind(this);
        this.handleMoveChange = this.handleMoveChange.bind(this);
        this.resolveRound = this.resolveRound.bind(this);
        this.handlePlayAgain = this.handlePlayAgain.bind(this);
    }

    handleInputChange(e) {
        const {value, name} = e.target;
        this.setState({
          [name]: value
        });
    }

    handleMoveChange(e) {
        const {value, name} = e.target;
        this.setState({
            [name]: value
        });
    }

    componentDidMount() {
        this.getDataFromDb();
        let that=this;
        fetch("http://localhost:3001/api/getScoreData")
            .then(data => data.json() )
            .then(function (data) {
                that.setState({
                    score: data.data
                });
                scores = data.data;
                that.componentScore();
            });
    }

    getDataFromDb = () => {
        fetch("http://localhost:3001/api/getData")
          .then(data => data.json())
          .then(res => {
              this.setState({ player_1: res.data[0].player_1, player_2: res.data[0].player_2 })
                if (this.state.actual_player === '') {
                    this.setState({ actual_player: this.state.player_1 });
                } else {
                    this.setState({ actual_player: this.state.player_2 });
                }
            });
    };

    // resolve the round after a player move
    resolveRound = (e) => {

        e.preventDefault();
        var move = this.state.move
        if (this.state.player_moves.length === 0) {
            this.setState({
                player_moves: [...this.state.player_moves, move],
                actual_player: this.state.player_2
            });

        } else {

            const result = getWinner( this.state.player_moves[0], move, this.state.player_1, this.state.player_2 );
            if ( result === 0 || result === 3 ) {
                this.setState({
                    player_moves: [],
                    actual_player: this.state.player_1
                });
                this.getScoreData();
                this.setRoundWinnerMessage('No player win the round!');
            }else{

                this.setState({
                    player_moves: [],
                })
                
                this.putMoveToDB(this.state.round, result);
            }
        }
    };

    getScoreData = () => {
        fetch("http://localhost:3001/api/getScoreData")
            .then(data => data.json())
            .then(res => console.log( res.data ));
    };

    
    putMoveToDB (round, winner) {
        
        let that=this;
        axios.post("http://localhost:3001/api/putRoundData", {
            round: round,
            winner
        })
        .then(function (res) {
            fetch("http://localhost:3001/api/getScoreData")
            .then(data => data.json() )
            .then(function (data) {
                that.setState({
                    score: res.data.data
                });
                scores = res.data.data;
                
                if ( scores.length > 2 ){
                    that.getGameWinner(winner);
                }else{ 
                    that.setRoundWinnerMessage('Player: '+winner+' wins!');
                }
                that.componentScore();
                that.setState({
                    round: round+1,
                    actual_player: that.state.player_1
                })
                
            });
        });
    };

    setRoundWinnerMessage(message) {
        
        window.setTimeout(function () {
            document.getElementById('message_div').innerHTML = '<div className="tm-copyright-text">'+message+'</div>';
            window.setTimeout(function () {
                document.getElementById('message_div').innerHTML = "";
            }, 2000);
        }, 0);
    }

    getGameWinner(winner) {
        var player_rounds = 0;
        scores.map((game, i)=>{
            if (game.winner === winner) {
                player_rounds++;
            }
        })
        if ( player_rounds === 3){
            this.setState({
                showFinalMessage: winner,
                winner: winner
            })
            return 'winner';
        }else{
            this.setRoundWinnerMessage('Player: '+winner+' wins!');
        }

    }

    componentScore() {
        if ( scores.length !== 0 ){

            this.games = scores.map((game, i)=>{
                return (
                  <tr key={i}>
                    <td>{game.round}</td>
                    <td>{game.winner}</td>
                  </tr>
                )
            })
        }
    }

    

    handlePlayAgain(e) {

        axios.delete("http://localhost:3001/api/delDB", {})
        .then(function (res) {
            window.location = "/";
        });

    }

   
    render() {
        const moves = this.state.moves.map((move) => {
            return (
              <option key={move.move} value={move.move}>{move.move}</option>
            )
        })

        return (
            <div>
            <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 tm-index-form tm-game-form">
                    <form>
                        <p className="tm-game-form-text-header">Round: { this.state.round }</p>
                        <p className="tm-game-form-text-header">Player: {this.state.actual_player}</p>
                        <label className="control-label" htmlFor="move">Select move: </label>
                        <select
                            style={{height: 50}}
                            name="move"
                            className="form-control tm-index-form-inputs tm-game-select"
                            onChange={this.handleMoveChange}
                        >
                        {moves}
                        </select>
                        <button type="submit" onClick={this.resolveRound} className="btn tm-index-form-button" >Ok</button>
                    </form>
                    </div>
                    
                    <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 tm-index-form tm-game-table" >
                        <p className="tm-game-form-text-header">Score</p>
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Round</th>
                                <th>Winner</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.games}
                            </tbody>
                        </table>
                    </div>
                    
            </div>
            <form >
            <p id="message_div" className="tm-game-form-text-header"></p>
            <div style={{display: this.state.showFinalMessage ? 'block' : 'none' }} className="tm-game-form-text-header"><h1>We have a WINNER!!</h1> <br /> {this.state.winner} is the new EMPEROR! <br /> <button type="button" onClick={this.handlePlayAgain} className="btn tm-index-form-button">Play Again</button></div>
            </form>
        </div>

        )
    }
}

export default Game;