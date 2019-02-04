import React, { Component } from 'react';
import axios from "axios";
import './Start.css';

class Start extends Component {
    constructor () {
        super();
        this.state = {
            player_1: '',
            player_2: ''
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.putPlayersToDB = this.putPlayersToDB.bind(this);
    }

    handleInputChange(e) {
        const {value, name} = e.target;
        this.setState({
          [name]: value
        });
    }

    putPlayersToDB = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/api/putPlayerData", {
            player_1: this.state.player_1,
            player_2: this.state.player_2
        })
        .then(function (response) {
            console.log(response);
            window.location = "/";
        });
    };

    render() {
        return (
            <div className="row">
                <div className="col-sm-12 col-md-6 col-lg-6 col-md-col-xl-6 mb-md-0 mb-sm-4 mb-4 tm-site-header-col">
                    <div className="tm-site-header">
                        <h1 className="mb-4">GAME OF DRONES</h1>
                        <img src="img/underline.png" alt="underline" className="img-fluid mb-4" />
                        <p>Hi UruIT. See you soon...!</p>
                    </div>                        
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 tm-index-form">
                    <form className="tm-start-form">
                        <p className="tm-index-form-text">Enter Players Names</p>
                        <input
                            type="text"
                            name="player_1"
                            className="form-control tm-index-form-inputs"
                            placeholder="Player 1"
                            onChange={this.handleInputChange}
                            required/>
                        <input
                            type="text"
                            name="player_2"
                            className="form-control tm-index-form-inputs"
                            placeholder="Player 2"
                            onChange={this.handleInputChange}
                            required/>
                        <button type="submit" onClick={this.putPlayersToDB} className="btn tm-index-form-button">Start</button>
                    </form>
                                                
                </div>
            </div>
        )
    }
}

export default Start;