import React, { Component } from 'react';
import axios from 'axios'

export default class Mirror extends Component {

    constructor(props) {
        super(props);
        (function () {
            // The width and height of the captured photo. We will set the
            // width to the value defined here, but the height will be
            // calculated based on the aspect ratio of the input stream.

            var width = 320;    // We will scale the photo width to this
            var height = 0;     // This will be computed based on the input stream

            // |streaming| indicates whether or not we're currently streaming
            // video from the camera. Obviously, we start at false.

            var streaming = false;

            // The various HTML elements we need to configure or control. These
            // will be set by the startup() function.

            var video = null;
            var canvas = null;
            var startbutton = null;
            var arrowbutton = null;

            function startup() {
                video = document.getElementById('video');
                canvas = document.getElementById('canvas');
                startbutton = document.getElementById('startbutton');
                arrowbutton = document.getElementById('arrowbutton');

                navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                    .then(function (stream) {
                        video.srcObject = stream;
                        video.play();
                    })
                    .catch(function (err) {
                        console.log("An error occurred: " + err);
                    });

                video.addEventListener('canplay', function (ev) {
                    if (!streaming) {
                        height = video.videoHeight / (video.videoWidth / width);

                        // Firefox currently has a bug where the height can't be read from
                        // the video, so we will make assumptions if this happens.

                        if (isNaN(height)) {
                            height = width / (4 / 3);
                        }

                        video.setAttribute('width', width);
                        video.setAttribute('height', height);
                        canvas.setAttribute('width', width);
                        canvas.setAttribute('height', height);
                        streaming = true;
                    }
                }, false);

                startbutton.addEventListener('click', function (ev) {
                    takepicture();
                    ev.preventDefault();
                }, false);

                arrowbutton.addEventListener('click', function (ev) {
                    drawarrows();
                    ev.preventDefault();
                }, false);

                clearphoto();
            }

            // Fill the photo with an indication that none has been
            // captured.

            function clearphoto() {
                var context = canvas.getContext('2d');
                context.fillStyle = "#AAA";
                context.fillRect(0, 0, canvas.width, canvas.height);

                var data = canvas.toDataURL('image/png');
            }

            // Capture a photo by fetching the current contents of the video
            // and drawing it into a canvas, then converting that to a PNG
            // format data URL. By drawing it on an offscreen canvas and then
            // drawing that to the screen, we can change its size and/or apply
            // other changes before drawing it.

            function takepicture() {
                var context = canvas.getContext('2d');
                if (width && height) {
                    canvas.width = width;
                    canvas.height = height;
                    context.drawImage(video, 0, 0, width, height);

                    var data = canvas.toDataURL('image/png');
                    canvas.toBlob(function (blob) {
                        const formData = new FormData();
                        formData.append('file', blob);
                        axios.post('http://localhost:3001/images/', formData,
                            {
                                headers: {
                                    'content-type': 'image/png'
                                }
                            })
                            .then(function (response) {
                            //Tu mamy JSON z wynikiem analizy obrazka z kamery
                                console.log(response.data);
                                var happyBar = document.getElementById("barHappy");
                                happyBar.style.width = response.data.score.happy + "%";
                                var sadBar = document.getElementById("barSad");
                                sadBar.style.width = response.data.score.sad + "%";
                                var confusedBar = document.getElementById("barConfused");
                                confusedBar.style.width = response.data.score.confused + "%";
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    });
                } else {
                    clearphoto();
                }
            }

            function canvas_arrow(context, fromx, fromy, tox, toy) {
                var headlen = 4; // length of head in pixels
                var dx = tox - fromx;
                var dy = toy - fromy;
                var angle = Math.atan2(dy, dx);
                context.moveTo(fromx, fromy);
                context.lineTo(tox, toy);
                context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
                context.moveTo(tox, toy);
                context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
            }

            function drawarrows() {
                var context = canvas.getContext('2d');
                if (width && height) {
                    canvas.width = width;
                    canvas.height = height;
                    context.drawImage(video, 0, 0, width, height);

                    var data = canvas.toDataURL('image/png');
                    canvas.toBlob(function (blob) {
                        const formData = new FormData();
                        formData.append('file', blob);
                        axios.post('http://localhost:3001/images/', formData,
                            {
                                headers: {
                                    'content-type': 'image/png'
                                }
                            })
                            .then(function (response) {
                            //Tu mamy JSON z wynikiem analizy obrazka z kamery
                                console.log(response.data.arrows);
                                context.beginPath();
                                for (var i = 0; i < response.data.arrows.length; i++) {
                                    var arrow = response.data.arrows[i];
                                    canvas_arrow(context, arrow[0], arrow[1], arrow[2], arrow[3]);
                                }
                                context.stroke();
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    });
                } else {
                    clearphoto();
                }
            }

            // Set up our event listener to run the startup process
            // once loading is complete.
            window.addEventListener('load', startup, false);
        })();
    }

    render() {
        return (
            <div>
                <p>Camera component.</p>
                <div className="camera">
                    <video id="video">Video stream not available.</video>
                    <p/>
                    <button id="startbutton">Take photo</button>
                    <button id="arrowbutton">Draw arrows</button>
                </div>
                <canvas id="canvas">
                </canvas>
            </div>
        )
    }
}
