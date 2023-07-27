const cropped = document.querySelector('#cropped');
const output = document.createElement('canvas');

let save_default;
let detectedData;

const handleDrop = (e) => {
  e.preventDefault()
  const tempImagePath = URL.createObjectURL(e.dataTransfer.files[0]);
  document.querySelector('#uploaded').src = tempImagePath;
  setCropper();
}

const handleChange = (e) => {
  const tempImagePath = URL.createObjectURL(e.target.files[0]);
  document.querySelector('#uploaded').src = tempImagePath;
  showCropper();
}

const setCropper = () => {
  document.querySelector('#area-input').classList.add('d-none');
  document.querySelector('#btn-reset').classList.remove('d-none');
  document.querySelector('#area-cropper').classList.remove('d-none');

  const cropper = new Cropper(document.querySelector("#uploaded"), {
    data: {
      width: 370,
      height: 370,
    },
  });

  document.querySelector('#btn-crop').onclick = function () {
    const croppedCanvasDataUrl = cropper.getCroppedCanvas().toDataURL();
    cropped.src = croppedCanvasDataUrl;
    save_default = croppedCanvasDataUrl;
    detectText('Default', save_default);

  document.querySelector('#area-cropper').classList.add('d-none');
  document.querySelector('#area-output').classList.remove('d-none');
  };
}

const detectText = (type, dataUrl) => {
  document.querySelector('#area-user h3').innerHTML = 'Result: ' + type;
  document.querySelector('#area-user textarea').value = 'Loading...';

  fetch(dataUrl)
  .then(response => response.blob())
  .then(blob => {
    Tesseract.recognize(
      URL.createObjectURL(blob), 
      'kor+eng', 
      { logger: m => {
        if (m.status == 'recognizing text') {
          progress_value = (m.progress).toFixed(2) * 100;
          document.querySelector('#area-user .progress-bar').style.width = progress_value + '%';
        }
      } }
    ).catch (err => {
      console.error(err);
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
      detectedData = lines.map((line) => {
        return { data: line }
      })
      document.querySelector('#area-user textarea').value = lines.join('\n');
    })
  });
}

const excelDownloadFn = () => {
  const type = document.querySelector('#area-user select').value;

  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sheet1');

    sheet.columns = [
      {header: type, key: 'data'},
    ]

    // detectedData = [ { data: 'detected line' } ]
    detectedData.map((row) => {
      sheet.addRow(row);
    });
 
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `BillScanner.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    })
  } catch(error) {
    console.error(error);
  }
}

const setDefault = () => {
  cropped.src = save_default;
  detectText('Default', save_default);
}

const setGrayscale = () => {
  let src = cv.imread(cropped);
  let dst = new cv.Mat();

  cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
  cv.imshow(output, dst);

  const changedDataURL = output.toDataURL();
  cropped.src = changedDataURL;
  detectText('Grayscale', changedDataURL);

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
  detectText('OTSU', changedDataURL);

  src.delete(); 
  dst.delete(); 
}

const reset = () => {
  location.reload();
}

const showCropper = () => {
  setCropper();
  document.querySelector('#area-upload').style.display = 'none';
}

// camera
const videoElement = document.querySelector('#area-camera video');

const setCamera = () => {
  document.querySelectorAll('#area-how button')[0].classList.add('active');
  document.querySelectorAll('#area-how button')[1].classList.remove('active');
  
  document.querySelector('#area-camera').classList.remove('d-none');
  document.querySelector('#area-upload').classList.add('d-none');

  // navigator.mediaDevices
  // .getUserMedia({ video: true, audio: false })
  // .then((stream) => {
  //   videoElement.srcObject = stream;
  //   videoElement.play();
  // })
  // .catch((err) => {
  //   console.error(err);
  // });
}

const setInput = () => {
  document.querySelectorAll('#area-how button')[0].classList.remove('active');
  document.querySelectorAll('#area-how button')[1].classList.add('active');
  
  document.querySelector('#area-camera').classList.add('d-none');
  document.querySelector('#area-upload').classList.remove('d-none');

  videoElement.srcObject = null;
}

const takePicture = () => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext("2d");
  const width = 1024;
  const height = 540;
  canvas.width = width;
  canvas.height = height;
  context.drawImage(videoElement, 0, 0, width, height);

  document.querySelector('#uploaded').src = canvas.toDataURL();
  showCropper();
}

const changeResultType = () => {
  document.querySelector('#area-user .progress-bar').style.width = '0%';

  const type = document.querySelector('#area-user select').value;
  switch (type) {
    case 'Default':
      setDefault();
      break;
    case 'Grayscale':
      setGrayscale();
      break;
    case 'OTSU':
      setThresholding();
      break;
  }
}

var Module = {
  // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
  onRuntimeInitialized() {
    console.log('OpenCV.js is ready.');
  }
};