import React, { Component } from 'react';
import './Bars.css';

export default class Bars extends Component {
    render() {
        return (
            <div>
                <div id="my_bars">
                    anger
                    <div id="bar_anger" className="my_bar"></div>
                    contempt
                    <div id="bar_contempt" className="my_bar"></div>
                    disgust
                    <div id="bar_disgust" className="my_bar"></div>
                    fear
                    <div id="bar_fear" className="my_bar"></div>
                    happiness
                    <div id="bar_happiness" className="my_bar"></div>
                    neutral
                    <div id="bar_neutral" className="my_bar"></div>
                    sadness
                    <div id="bar_sadness" className="my_bar"></div>
                    surprise
                    <div id="bar_surprise" className="my_bar"></div>
                </div>
            </div>
        )
    }
}
