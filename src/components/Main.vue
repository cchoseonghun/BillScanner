<template>
  <div>
    <div class="header">
      <h2>디아블로4 사설경매장 - 으뜸</h2>
      <a href="https://github.com/cchoseonghun">Github</a>
    </div>
    <hr />
    
    <div class="content">
      <section class="cropper-area">
        <div class="input-div" @drop="handleDrop">
          <p>여기로 이미지를 드래그하거나 <strong>클릭</strong>하세요.</p>
          <input ref="inputRef" type="file" class="file" @change="handleChange" accept="image/*"/>
        </div>
        
        <div class="img-cropper">
          <vue-cropper ref="cropperRef" :src="uploadedImage"/>
        </div>
        <div class="actions">
          <a href="#" role="button" @click.prevent="reset">Reset</a>
          <a href="#" role="button" @click.prevent="cropImage">Crop</a>
        </div>

        <textarea v-model="data" />
      </section>

      <section class="preview-area">
        <p>인식된 사진</p>
        <div class="cropped-image">
          <img v-if="croppedImage" :src="croppedImage" alt="Cropped Image"/>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
  components: {
    VueCropper,
  },
  setup() {
    const inputRef = ref(null);
    const cropperRef = ref(null);
    const uploadedImage = ref('');
    const croppedImage = ref('');
    const data = ref('');

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
      data.value = '인식된 이미지 데이터';
    };

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
      data, 
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

.content {
  display: flex;
  justify-content: space-between;
}

.cropper-area {
  width: 614px;
}

.actions {
  margin-top: 1rem;
}

.actions a {
  display: inline-block;
  padding: 5px 15px;
  background: #0062CC;
  color: white;
  text-decoration: none;
  border-radius: 3px;
  margin-right: 1rem;
  margin-bottom: 1rem;
}

.preview-area {
  width: 307px;
}

.preview-area p {
  font-size: 1.25rem;
  margin: 0;
  margin-bottom: 1rem;
}

.preview-area p:last-of-type {
  margin-top: 1rem;
}

.cropped-image img {
  max-width: 100%;
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
</style>