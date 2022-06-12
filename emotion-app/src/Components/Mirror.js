import React, { Component } from 'react';
import axios from 'axios'

export default class Mirror extends Component {
	constructor(props) {
		super(props);
		(function () {
			//var apiUrl = 'wereta.es:3001'
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
			var start_button = null;
			var emotions_button = null;
			var file_input = null;
			var compare_button = null;
			var picture_taken = false;
			var celebrity_canvas = null;

			function start_up() {
				video = document.getElementById('video');
				canvas = document.getElementById('canvas');
				celebrity_canvas = document.getElementById('canvas-celebrity');
				start_button = document.getElementById('startbutton');
				emotions_button = document.getElementById('emotions_button');
				file_input = document.getElementById('inputfile');
				compare_button = document.getElementById('comparebutton');


				navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(function (stream) {
					video.srcObject = stream;
					video.play();
				}).catch(function (err) {
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

				start_button.addEventListener('click', function (ev) {
					take_picture();
					ev.preventDefault();
				}, false);
				emotions_button.addEventListener('click', function (ev) {
					extract_emotions();
					ev.preventDefault();
				}, false);
				compare_button.addEventListener('click', function (ev){
					//First u need to take the picture, then select file to compare with and lastly u can click this button
					if(picture_taken && file_input.files.length > 0){
						compare_faces();
					}else{
						console.log("Please choose a file and take a picture first :D");
					}
					ev.preventDefault();
				}, false);
				clear_photo();
				
			file_input.onchange = function() {
				console.log("dodano plik");
				const file    = file_input.files[0]; // get the file
				const blobURL = URL.createObjectURL(file);
				const img     = new Image();
				img.src       = blobURL;
			  
				img.onerror = function () {
				  URL.revokeObjectURL(this.src);
				  // Handle the failure properly
				  console.log("Cannot load image");
				};
				img.onload = function () {
					//height = video.videoHeight / (video.videoWidth / width);
					console.log(img.height);
					var height = img.height / (img.width / 320);
					celebrity_canvas.setAttribute('width', width);
					celebrity_canvas.setAttribute('height', height);
					URL.revokeObjectURL(this.src);
					const ctx     = celebrity_canvas.getContext("2d");
					ctx.drawImage(img, 0, 0, width, height);
				}
			}
			}


			function clear_photo() {
				// Fill the photo with an indication that none has been
				// captured.
				var context = canvas.getContext('2d');
				context.fillStyle = "#AAA";
				context.fillRect(0, 0, canvas.width, canvas.height);
			}

			// Capture a photo by fetching the current contents of the video
			// and drawing it into a canvas, then converting that to a PNG
			// format data URL. By drawing it on an offscreen canvas and then
			// drawing that to the screen, we can change its size and/or apply
			// other changes before drawing it.

			function take_picture() {
				var context = canvas.getContext('2d');
				if (width && height) {
					canvas.width = width;
					canvas.height = height;
					context.drawImage(video, 0, 0, width, height);
					picture_taken = true;
				} else {
					clear_photo();
				}
			}

			function extract_emotions() {
				if (width && height) {
					canvas.toBlob(function (blob) {
						const form_data = new FormData();
						form_data.append('image_file', blob);
						axios.post(`https://api.wereta.es/emotions/`, form_data, {
							headers: {
								'content-type': 'image/png'
							}
						}).then(function (response) {
							//Tu mamy JSON z wynikiem analizy obrazka z kamery
							var bar_anger = document.getElementById("bar_anger");
							bar_anger.style.width = 100.0 * response.data.anger + "%";
							var bar_contempt = document.getElementById("bar_contempt");
							bar_contempt.style.width = 100.0 * response.data.contempt + "%";
							var bar_disgust = document.getElementById("bar_disgust");
							bar_disgust.style.width = 100.0 * response.data.disgust + "%";
							var bar_fear = document.getElementById("bar_fear");
							bar_fear.style.width = 100.0 * response.data.fear + "%";
							var bar_happiness = document.getElementById("bar_happiness");
							bar_happiness.style.width = 100.0 * response.data.happiness + "%";
							var bar_neutral = document.getElementById("bar_neutral");
							bar_neutral.style.width = 100.0 * response.data.neutral + "%";
							var bar_sadness = document.getElementById("bar_sadness");
							bar_sadness.style.width = 100.0 * response.data.sadness + "%";
							var bar_surprise = document.getElementById("bar_surprise");
							bar_surprise.style.width = 100.0 * response.data.surprise + "%";
						}).catch(function (error) {
							console.log(error);
						});
					});
				} else {
					clear_photo();
				}
			}
			


			function compare_faces() {
				const form_data = new FormData();
				form_data.append('actor_face_file', file_input.files[0]);
				canvas.toBlob(function (blob) {
					form_data.append('user_face_file', blob, 'uploaded2.png');
					axios.post(`https://api.wereta.es/compare/`, form_data, {
						headers: {
							'content-type': 'image/png'
						}
					}).then(function (response) {
						//Tu mamy JSON z wynikiem porównania wybranego pliku z naszym zrobionym zdjęciem
						var similarity_result = document.getElementById("similarity_result");
						if(response.data.confidence){
							similarity_result.innerHTML = "Similarity: " + (100.0 * response.data.confidence).toFixed(0) + "%";
						}else{
							similarity_result.innerHTML = "Similarity: error";
						}
					}).catch(function (error) {
						console.log(error);
					});
				});
			}
			window.addEventListener('load', start_up, false);
		})();
	}

	render() {
		return (
			<div style={{padding: '20px 0px 0px 0px'}}>
				<div className="camera">
					<video id="video">Video stream not available.</video>
					<br/>
					<button id="startbutton">Take photo</button>
					<br/>
					<button id="emotions_button">Extract emotions</button>
					<br/>
				<canvas id="canvas">
				</canvas>
					<br/>
					Comparing photos
					<br/>
					<button id="comparebutton">Compare us</button>
					<br/>
					<input type='file' id='inputfile' />
				</div>
				<canvas id="canvas-celebrity">
				</canvas>
			</div>
		)
	}
}
