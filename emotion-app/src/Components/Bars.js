import React, { Component } from 'react';
import './Bars.css';

export default class Bars extends Component {
    render() {
        return (
            <div>
                <div id="my_bars">
                    anger
                    <div class="meter">
                        <span id="bar_anger" class="bar"></span></div>
                    contempt
                    <div class="meter">
                        <span id="bar_contempt" class="bar"></span></div>
                    disgust
                    <div class="meter">
                        <span id="bar_disgust" class="bar"></span></div>
                    fear
                    <div class="meter">
                        <span id="bar_fear" class="bar"></span></div>
                    happiness
                    <div class="meter">
                        <span id="bar_happiness" class="bar"></span></div>
                    neutral
                    <div class="meter">
                        <span id="bar_neutral" class="bar"></span></div>
                    sadness
                    <div class="meter">
                        <span id="bar_sadness" class="bar"></span></div>
                    surprise
                    <div class="meter">
                        <span id="bar_surprise" class="bar"></span></div>
                </div>
            </div>
        )
    }
}
