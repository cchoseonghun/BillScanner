const cropped = document.querySelector('#cropped');
const output = document.createElement('canvas');

let save_default;
let detectedData;

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
  showCropper();
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
    detectText('기본값', save_default);

    document.querySelector('.cropper-area').style.display = 'none';
    document.querySelector('.user-area').style.display = 'flex';
  };
}

const detectText = (type, dataUrl) => {
  document.querySelector('.result-area h3').innerHTML = type;
  document.querySelector('.result-area textarea').value = '인식중...';

  fetch(dataUrl)
  .then(response => response.blob())
  .then(blob => {
    Tesseract.recognize(
      URL.createObjectURL(blob), 
      'kor+eng', 
      { logger: m => {
        if (m.status == 'recognizing text') {
          progress_value = (m.progress).toFixed(2) * 100;
          document.querySelector('.result-area progress').value = progress_value;
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
      document.querySelector('.result-area textarea').value = lines.join('\n');
    })
  });
}

const excelDownloadFn = () => {
  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('시트1');

    sheet.columns = [
      {header: '데이터', key: 'data'},
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
  detectText('기본값', save_default);
}

const setGrayscale = () => {
  let src = cv.imread(cropped);
  let dst = new cv.Mat();

  cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
  cv.imshow(output, dst);

  const changedDataURL = output.toDataURL();
  cropped.src = changedDataURL;
  detectText('grayscale', changedDataURL);

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
  detectText('threshold - OTSU', changedDataURL);

  src.delete(); 
  dst.delete(); 
}

const reset = () => {
  location.reload();
}

const showCropper = () => {
  setCropper();
  document.querySelector('.input-div').style.display = 'none';
  document.querySelector('.camera-area').style.display = 'none';
}

var Module = {
  // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
  onRuntimeInitialized() {
    console.log('OpenCV.js is ready.');
  }
};