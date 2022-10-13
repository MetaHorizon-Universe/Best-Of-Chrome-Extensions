document.getElementById('submit').addEventListener("click", recognizeImage);
document.getElementById("image-upload").addEventListener("change", handleUpload);

function handleUpload(event) {
  const image = document.getElementById("image-url");
  image.value = URL.createObjectURL(event.target.files[0]);
}

async function recognizeImage() {
  const image = document.getElementById("image-url").value;

  const options = {
    "workerBlobURL": false,
    "workerPath": "tesseract/tesseract-worker-3.0.2.js",
    "langPath": "tesseract/eng.traineddata-4.0.0-best.gz",
    "corePath": "tesseract/tesseract-core-3.0.2.wasm.js",
  }

  const result = await Tesseract.recognize(image, "eng", options)
  const { data: { text } } = result;

  console.log(text)

  if (text) {
    document.getElementById("image-text").innerText = text;
    document.getElementById("result-wrapper").style.display = "block";
  }
}
  