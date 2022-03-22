import React, { Component } from 'react';
import axios from 'axios'
import './Bars.css';

export default class Bars extends Component {
    render() {
        return (
            <div>
                <p>Bars component. XD</p>
                <div id="myBars">
                    happy
                    <div id="barHappy" className="myBar"></div>
                    sad z jabłkami
                    <div id="barSad" className="myBar"></div>
                    confused
                    <div id="barConfused" className="myBar"></div>
                </div>
            </div>
        )
    }
}
