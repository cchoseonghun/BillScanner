video = document.getElementById('video');
canvas = document.getElementById('canvas');
photo = document.getElementById('photo');
startbutton = document.getElementById('startbutton');

const handleTest = () => {
  getMedia();
}

function getMedia() {
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

startbutton.addEventListener(
  "click",
  (ev) => {
    takepicture();
    ev.preventDefault();
  },
  false,
);

function takepicture() {
  const context = canvas.getContext("2d");
  const width = 400;
  const height = 400;
  canvas.width = width;
  canvas.height = height;
  context.drawImage(video, 0, 0, width, height);

  const data = canvas.toDataURL("image/png");
  photo.setAttribute("src", data);
}

