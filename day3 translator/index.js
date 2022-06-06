const fromText = document.querySelector(".from-text");
selectTag = document.querySelectorAll("select");
translateBrn = document.querySelector("button");
toText = document.querySelector(".to-text");
exchangeIcon = document.querySelector(".exchange");
icons = document.querySelectorAll(".row i");

selectTag.forEach((tag, id) => {
  for (const country_code in countries) {
    let selected;
    if (id == 0 && country_code == "en-GB") {
      selected = "selected";
    } else if (id == 1 && country_code == "fa-IR") {
      selected = "selected";
    }

    let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
  }
});

exchangeIcon.addEventListener("click", () => {
  let tempText = fromText.value,
    tempLang = selectTag[0].value;
  fromText.value = toText.value;
  toText.value = tempText;
  selectTag[0].value = selectTag[1].value;
  selectTag[1].value = tempLang;
});

translateBrn.addEventListener("click", () => {
  let text = fromText.value;
  let from = selectTag[0].value;
  let to = selectTag[1].value;
  if (!text) return;
  to.setAttribute("placeholder", "translating...");
  let url = `https://api.mymemory.translated.net/get?q=${text}&langpair=${from}|${to}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let translatedText = data.responseData.translatedText;
      toText.value = translatedText;
      to.setAttribute("placeholder", "translating...");
    });
});

icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    if (!fromText.value || !toText.value) return;
    if (target.classList.contains("fa-copy")) {
      if (target.id == "from") {
        navigator.clipboard.writeText(fromText.value);
      } else {
        navigator.clipboard.writeText(toText.value);
      }
    } else {
      let utterance;
      if (target.id == "from") {
        utterance = new SpeechSynthesisUtterance(fromText.value);
        utterance.lang = selectTag[0].value;
      } else {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTag[1].value;
      }
      speechSynthesis.speak(utterance);
    }
  });
});
