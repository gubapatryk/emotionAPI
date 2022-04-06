import React, { Component } from 'react';
import axios from 'axios'
import './Bars.css';

export default class Bars extends Component {
    render() {
        return (
            <div>
                <div id="myBars">
                    anger
                    <div id="barAnger" className="myBar"></div>
                    contempt
                    <div id="barContempt" className="myBar"></div>
                    disgust
                    <div id="barDisgust" className="myBar"></div>
                    fear
                    <div id="barFear" className="myBar"></div>
                    happiness
                    <div id="barHappiness" className="myBar"></div>
                    neutral
                    <div id="barNeutral" className="myBar"></div>
                    sadness
                    <div id="barSadness" className="myBar"></div>
                    surprise
                    <div id="barSurprise" className="myBar"></div>
                </div>
            </div>
        )
    }
}
