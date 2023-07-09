const cropped = document.querySelector('#cropped');
const output = document.createElement('canvas');

let save_default;

const handleDrop = (e) => {
  e.preventDefault()
  const tempImagePath = URL.createObjectURL(e.dataTransfer.files[0]);
  document.querySelector('#uploaded').src = tempImagePath;
  setCropper();
  document.querySelector('.input-div').style.display = 'none';
}

const handleChange = (e) => {
  const tempImagePath = URL.createObjectURL(e.target.files[0]);
  document.querySelector('#uploaded').src = tempImagePath;
  setCropper();
  document.querySelector('.input-div').style.display = 'none';
}

const setCropper = () => {
  const cropper = new Cropper(document.querySelector("#uploaded"), {
    data: {
      width: 370,
      height: 370,
    },
  });

  document.querySelector('#cropBtn').onclick = function () {
    const croppedCanvasDataUrl = cropper.getCroppedCanvas().toDataURL();
    cropped.src = croppedCanvasDataUrl;
    save_default = croppedCanvasDataUrl;
    detectText(save_default);

    document.querySelector('.cropper-area').style.display = 'none';
    document.querySelector('.result-area').style.display = 'block';
  };
}

const detectText = (dataUrl) => {
  document.querySelector('.result-area h3').innerHTML = '인식중...';
  document.querySelector('.result-area textarea').value = '';

  fetch(dataUrl)
  .then(response => response.blob())
  .then(blob => {
    Tesseract.recognize(
      URL.createObjectURL(blob), 
      'kor', 
      { logger: m => {
        if (m.status == 'recognizing text') {
          progress_value = (m.progress).toFixed(2) * 100;
          document.querySelector('.result-area progress').value = progress_value;
        }
      } }
    ).catch (err => {
      console.error(err);
      document.querySelector('.result-area h3').innerHTML = '인식실패';
    }).then(({ data: { text } }) => { 
      const lines = text
        .split('\n')
        .map((line) => line.trim()
          .replace(/\s/g, '')
          .replace('＊', '')
          .replace('ㆍ', '')
          .replace('ㅣ', '')
          .replace('|', '')
          .replace('、', '')
        )
        .filter((line) => line !== "");
      document.querySelector('.result-area textarea').value = lines.join('\n');
      document.querySelector('.result-area h3').innerHTML = '인식완료';
    })
  });
}

const setDefault = () => {
  cropped.src = save_default;
  detectText(save_default);
}

const setGrayscale = () => {

  let src = cv.imread(cropped);
  let dst = new cv.Mat();

  cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
  cv.imshow(output, dst);

  const changedDataURL = output.toDataURL();
  cropped.src = changedDataURL;
  detectText(changedDataURL);

  src.delete(); 
  dst.delete(); 
}

const setThresholding = () => {
  let src = cv.imread(cropped);
  let dst = new cv.Mat();

  cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
  cv.threshold(dst, dst, 177, 200, cv.THRESH_OTSU);
  cv.imshow(output, dst);

  const changedDataURL = output.toDataURL();
  cropped.src = changedDataURL;
  detectText(changedDataURL);

  src.delete(); 
  dst.delete(); 
}

var Module = {
  // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
  onRuntimeInitialized() {
    console.log('OpenCV.js is ready.');
  }
};