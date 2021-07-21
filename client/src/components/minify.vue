<template>
  <div class="div">
    <h1>Minimizer</h1>
    <div class="info__block">
      <p>
        Minify your <span>Html</span>, <span>CSS</span>. or <span>JS</span> code simply. All you need is to upload your file and click
        "Compress", and then the program will do everything by itself. You will
        get clean and optimized code, without spaces, empty lines and
        unnecessary data. Enjoy!
      </p>
    </div>

    <div class="code__input__block">
      <div class="upload__btn">
        <div>
          <div class="ipt__block">
            <input
              type="file"
              name="upload"
              ref="uploadFile"
              @change="getFileBtn"
            />
            <label for="upload" class="upload"><p>upload</p></label>
          </div>
          <div v-if="!inputValue">
            <p>or</p>
            <p>paste your code here</p>
          </div>
          <div v-else-if="inputValue">
            <button
              class="compress__btn compress__2"
              @click="sendCodeToServer"
              title="press to minify"
            >
              compress
            </button>
          </div>
        </div>
      </div>

      <div class="code__block">
        <div class="format__block" v-if="minifyData">
          <div>
            <label for="html">html</label>
            <input
              type="radio"
              name="html"
              value="html"
              v-model="selectFormat"
            />

            <label for="css">| css</label>
            <input type="radio" name="css" value="css" v-model="selectFormat" />

            <label for="js">| js</label>
            <input type="radio" name="js" value="js" v-model="selectFormat" />
          </div>
          <div v-if="err">
            <p>you have not chosen a format</p>
          </div>
        </div>
        <textarea
          name="code"
          v-model="minifyData"
          @input="closeBtns"
        ></textarea>
        <div class="copy__save" v-if="savBtn" ref="saveBlock">
          <button class="copy" @click="copyCode" title="Скопировать в буфер">
            copy
          </button>
          <button class="save" @click="downloadFile" title="Сохранить файл">
            <a href="" id="a">save</a>
          </button>
        </div>
        <div class="copy__complete" ref="complete">
          <p>copy <img src="../assets/check.svg" alt="" /></p>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      codeFile: {},
      inputValue: false,
      minifyData: "",
      format: "",
      selectFormat: "",
      err: false,
      fileUrl: "",
      savBtn: false,
    };
  },
  methods: {
    getFileBtn() {
      let input = document.querySelector(".upload");
      input.classList.add("file__ready");

      const file = this.$refs.uploadFile.files[0];
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        this.codeFile = reader.result;
        this.inputValue = true;
      };
    },
    sendCodeToServer() {
      if (this.minifyData && !this.selectFormat) {
        this.err = true;
      } else {
        fetch("http://localhost:2030/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userCode: this.codeFile,
            selectFormat: this.selectFormat,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            this.minifyData = data.minify;
            this.format = data.format;
            this.fileUrl = data.url;

            this.savBtn = true;

            setTimeout(() => {
              this.scrollToSave();
            }, 100);
          });
      }
    },
    downloadFile() {
      const a = document.getElementById("a");
      const file = new Blob([this.minifyData], { type: "text/plain" });
      a.href = URL.createObjectURL(file);
      a.download = `${this.fileUrl}`;
    },
    closeBtns() {
      this.savBtn = false;
    },
    copyCode() {
      window.navigator.clipboard.writeText(this.minifyData);
      this.showComplete();
    },
    showComplete() {
      const complete = this.$refs.complete;

      complete.style.display = "block";
      complete.style.top = "-60px";

      setTimeout(() => {
        complete.style.opacity = 1;
        complete.style.top = 0;
      }, 100);

      setTimeout(() => {
        complete.style.opacity = 0;
        complete.style.top = 0;
      }, 1000);
    },
    scrollToSave() {
      this.$refs.saveBlock.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    },
  },
  watch: {
    minifyData() {
      if (this.minifyData.length > 0) {
        this.inputValue = true;
        this.codeFile = this.minifyData;
      } else {
        this.inputValue = false;
      }
    },
    selectFormat() {
      this.selectFormat ? (this.err = false) : (this.err = true);
    },
  },
};
</script>



<style>
a {
  text-decoration: none;
  color: azure;
}
.info__block {
  width: 70%;
  margin: 0 auto;
  text-align: left;
}
.info__block p span {
  font-weight: bold;
}

.upload__btn {
  padding: 35px 0 15px 0;
}

.upload__btn p {
  margin: 5px;
}

input[name="upload"] {
  opacity: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  position: relative;
  cursor: pointer;
}

.ipt__block {
  width: 120px;
  margin: 0 auto;
  position: relative;
  height: 46px;
}

label {
  cursor: pointer;
}

.upload {
  font-size: 1.4rem;
  padding: 5px 15px;
  cursor: pointer;
  outline: none;
  position: absolute;
  left: 0;
  z-index: -1;
  border: 2px solid #38b2ac;
  color: #38b2ac;
  transition: 0.4s linear;
  width: 87px;
}

.file__ready {
  color: azure;
  background-color: #38b2ac;
}

.compress__btn,
.copy,
.save {
  border: none;
  background: #38b2ac;
  color: azure;
  font-size: 1.4rem;
  padding: 5px 15px;
  width: 120px;
  height: 45px;
  margin: 0 auto;
  cursor: pointer;
}

.copy,
.save {
  width: 100px;
  margin: 5px 20px;
}

.compress__2 {
  width: 125px;
  margin: 20px 0;
  cursor: pointer;
}

textarea[name="code"] {
  width: 50%;
  height: 400px;
  outline: none;
}

.format__block {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  flex-direction: column;
}

.format__block p {
  color: rgb(255, 96, 96);
}

.copy__complete img {
  width: 15px;
}

.copy__save {
  padding: 30px 0;
}

.copy__complete {
  position: fixed;
  left: 0;
  right: 0;
  width: 90px;
  margin: 0 auto;
  top: -60px;
  opacity: 0;
  display: none;
  transition: 0.4s linear;
}

.copy__complete p {
  background: cadetblue;
  color: azure;
  padding: 5px 0px;
  font-size: 1.2rem;
}
</style>