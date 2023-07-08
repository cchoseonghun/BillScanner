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
    document.querySelector('#cropped').src = croppedCanvasDataUrl;
    detectText(croppedCanvasDataUrl);
  };
}

const detectText = (dataUrl) => {
  document.querySelector('.cropper-area').style.display = 'none';
  document.querySelector('.result-area').style.display = 'block';

  document.querySelector('.result-area h3').innerHTML = '인식중...';
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
        .map((line) => line.trim().replace(/\s/g, '')
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

let save_default;
let save_otsu;
const thresholding = (type) => {
  const cropped = document.querySelector('#cropped');
  save_default = cropped.src;
  const output = document.createElement('canvas');

  let src = cv.imread(cropped);
  let dst = new cv.Mat();

  cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
  switch(type) {
    case 'OTSU': 
      cv.threshold(dst, dst, 177, 200, cv.THRESH_OTSU);
      break;
  }
  cv.imshow(output, dst);
  cropped.src = output.toDataURL();

  src.delete(); 
  dst.delete(); 
}

const test = () => {  // default로
  const cropped = document.querySelector('#cropped');
  save_otsu = cropped.src;
  cropped.src = save_default;
}

const test2 = () => {  // 다시 otsu로
  const cropped = document.querySelector('#cropped');
  save_default = cropped.src;
  cropped.src = save_otsu;
}

var Module = {
  // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
  onRuntimeInitialized() {
    // document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
    console.log('OpenCV.js is ready.');
  }
};