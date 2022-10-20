const msg = new SpeechSynthesisUtterance();
let voices = [];
const voicesDropdown = document.querySelector('[name="voice"]');
const options = document.querySelectorAll(
  '[type="range"], [name="text"]'
);
const speakButton = document.querySelector("#speak");
const stopButton = document.querySelector("#stop");
msg.text = document.querySelector("textarea").value;

function populatevoice() {
  voices = this.getVoices();
  //console.log(voices);
  voicesDropdown.innerHTML = voices
    .map((voice) => {
      // console.log(voice);
      return `<option value="${voice.name}">${voice.name} (${voice.lang}</option>`;
    })
    .join("");
}

function setvoice() {
  //   console.log(this.value);
  msg.voice = voices.find((voice) => this.value === voice.name);
  toggle();
}

function toggle(startover = true) {
  speechSynthesis.cancel();
  if (startover) speechSynthesis.speak(msg);
}

function speakchange() {
  msg[this.name] = this.value;
  toggle();
}
speechSynthesis.addEventListener("voiceschanged", populatevoice);
voicesDropdown.addEventListener("change", setvoice);
options.forEach((option) =>
  option.addEventListener("change", speakchange)
);
speakButton.addEventListener("click", toggle);
stopButton.addEventListener("click", () => toggle(false));