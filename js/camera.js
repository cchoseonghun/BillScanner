const video = document.querySelector('.camera-area video');

const setCamera = () => {
  navigator.mediaDevices
  .getUserMedia({ video: true, audio: false })
  .then((stream) => {
    video.srcObject = stream;
    video.play();
  })
  .catch((err) => {
    console.error(err);
  });
}

const takePicture = () => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext("2d");
  const width = 1024;
  const height = 540;
  canvas.width = width;
  canvas.height = height;
  context.drawImage(video, 0, 0, width, height);

  document.querySelector('#uploaded').src = canvas.toDataURL();
  showCropper();
}

