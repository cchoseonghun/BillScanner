<template>
  <div>
    <div class="header">
      <h2>디아블로4 사설경매장</h2>
      <a href="https://github.com/cchoseonghun">Github</a>
    </div>
    
    <div class="content">
      <div class="cropper-area">
        <div class="input-div" @drop="handleDrop">
          <p>여기로 이미지를 드래그하거나 <strong>클릭</strong>하세요.</p>
          <input ref="inputRef" type="file" class="file" @change="handleChange" accept="image/*"/>
        </div>
        
        <div class="img-cropper">
          <vue-cropper ref="cropperRef" :src="uploadedImage"/>
        </div>
        <div class="actions">
          <button @click.prevent="reset">Reset</button>
          <button @click.prevent="cropImage">Crop</button>
        </div>
      </div>
  
      <div class="user-area">
        <section class="preview-area">
          <h3>인식된 사진</h3>
          <div class="cropped-image">
            <img v-if="croppedImage" :src="croppedImage" alt="Cropped Image"/>
          </div>
        </section>

        <section class="input-area">
          <textarea>hi</textarea>
        </section>
        
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import Tesseract from 'tesseract.js';

export default {
  components: {
    VueCropper,
  },
  setup() {
    const inputRef = ref(null);
    const uploadedImage = ref('');
    const cropperRef = ref(null);
    const croppedImage = ref('');
    // const log = ref({status: 'default', progress: 0});

    const handleChange = (e) => {
      const file = e.target.files[0];
      if (typeof FileReader === 'function') {
        const reader = new FileReader();
        reader.onload = (event) => {
          uploadedImage.value = event.target.result;
          cropperRef.value.cropper.replace(event.target.result);
        };
        reader.readAsDataURL(file);
        showImage();
      } else {
        alert('FileReader API를 지원하지 않습니다.');
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (typeof FileReader === 'function') {
        const reader = new FileReader();
        reader.onload = (event) => {
          uploadedImage.value = event.target.result;
          cropperRef.value.cropper.replace(event.target.result);
        };
        reader.readAsDataURL(file);
        showImage();
      } else {
        alert('FileReader API를 지원하지 않습니다.');
      }
    };

    const showImage = () => {
      document.querySelector('.input-div').style.display = 'none';
    }

    const cropImage = () => {
      croppedImage.value = cropperRef.value.cropper.getCroppedCanvas().toDataURL();
      detectText();
    };

    const detectText = () => {
      fetch(croppedImage.value)
      .then(response => response.blob())
      .then(blob => {
        const blobURL = URL.createObjectURL(blob);

        Tesseract.recognize(
          blobURL, 
          'kor', 
          { logger: m => 
            console.log(m) 
          }
        ).catch (err => {
          console.error(err);
        }).then(({ data: { text } }) => { 
          const lines = text
            .split('\n')
            .map((line) => 
              line.trim()
              .replace(/\s/g, '')
              .replace('＊', '')
              .replace('ㆍ', '')
            )
            .filter((line) => line !== "");
          document.querySelector('.input-area textarea').value = lines.join('\n');
        })
      });
    }

    const reset = () => {
      // cropperRef.value.cropper.reset();
      document.querySelector('.input-div').style.display = 'flex';

      cropperRef.value = null;
      uploadedImage.value = '';
      croppedImage.value = '';
    };

    return {
      inputRef, 
      cropperRef, 
      uploadedImage, 
      croppedImage, 
      handleChange, 
      handleDrop, 
      cropImage, 
      reset, 
    }
  }, 
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
body {
  font-family: Arial, Helvetica, sans-serif;
  width: 1024px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0 5px 0;
}

.header h2 {
  margin: 0;
}

.header a {
  text-decoration: none;
  color: black;
}

.input-div {
  width: 100%;
  height: 200px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: 2px dotted black;
  background-color: white;
  position: relative;
}

.file {
  width: 100%;
  height: 100%;
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.cropper-area {
  width: 100%;
}

.actions {
  margin-top: 1rem;
}

.user-area {
  display: flex;
  /* justify-content: space-between; */
}

.preview-area {
  width: 40%;
}

/* .cropped-image img { */
.preview-area div img {
  max-width: 100%;
}

.input-area textarea {
  width: 300px;
  height: 300px;
}
</style>