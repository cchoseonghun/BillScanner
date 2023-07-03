const handleDrop = (e) => {
  e.preventDefault()
  const tempImagePath = URL.createObjectURL(e.dataTransfer.files[0]);
  document.querySelector('#uploaded').src = tempImagePath;
  setCropper();
}

const handleChange = (e) => {
  const tempImagePath = URL.createObjectURL(e.target.files[0]);
  document.querySelector('#uploaded').src = tempImagePath;
  setCropper();
}

const setCropper = () => {
  const cropper = new Cropper(document.querySelector("#uploaded"), {
  });
  document.querySelector('#cropBtn').onclick = function () {
    document.querySelector('#cropped').src = cropper.getCroppedCanvas().toDataURL()
  };
}

// let imgElement = document.getElementById('imageSrc');
// let inputElement = document.getElementById('fileInput');

// inputElement.addEventListener('change', (e) => {
//   imgElement.src = URL.createObjectURL(e.target.files[0]);
// }, false);

// imgElement.onload = function () {
//   let src = cv.imread(imgElement);
//   let testImgElement = document.getElementById('templImageSrc');
//   let templ = cv.imread(testImgElement);
//   let dst = new cv.Mat();
//   let mask = new cv.Mat();
//   cv.matchTemplate(src, templ, dst, cv.TM_CCOEFF, mask);
//   let result = cv.minMaxLoc(dst, mask);
//   let maxPoint = result.maxLoc;
//   let rect = new cv.Rect(maxPoint.x, maxPoint.y, templ.cols, src.rows - maxPoint.y);
//   dst = src.roi(rect);
//   cv.cvtColor(dst, dst, cv.COLOR_RGBA2GRAY);
//   cv.threshold(dst, dst, 177, 200, cv.THRESH_OTSU);
//   cv.imshow('canvasOutput', dst);
//   src.delete(); dst.delete(); mask.delete();
// };

// var Module = {
//   // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
//   onRuntimeInitialized() {
//     document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
//   }
// };