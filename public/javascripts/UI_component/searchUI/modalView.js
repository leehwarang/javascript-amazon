import { $ } from "../../Utills/mylibrary.js";

class ModalView {
  constructor(inputTag) {
    this.modal = $(inputTag);
    this.notify;
    this.currentHighlightIndex;
    this.config = {
      className: "highlight",
      unselectedColor: "white",
      selectedColor: "#eee",
      upDirection: -1,
      downDirection: 1,
      initHighlightIndex: -1
    };
  }

  init(func) {
    this.notify = func;
    this.initHighlightIndex();
    this.hideModalWindow();
  }

  showModalWindow() {
    this.modal.style.display = `block`;
  }

  hideModalWindow() {
    this.modal.style.display = `none`;
  }

  initHighlightIndex() {
    this.currentHighlightIndex = this.config.initHighlightIndex;
  }

  removeChildAll() {
    while (this.modal.hasChildNodes()) {
      this.modal.removeChild(this.modal.firstChild);
    }
  }

  setAttribute() {
    const _arr = [...this.modal.children];

    _arr.forEach((v, i) => {
      _arr[i].setAttribute(this.config.attrName, i);
    });
  }

  initHighlight() {
    const modal = this.modal;
    const firstChild = modal.firstChild;

    firstChild.classList.add(this.config.className);
    this.initHighlightIndex();
  }

  submitAutoCompleteData() {
    this.hideModalWindow();
    this.initHighlightIndex();

    let arr = [...this.modal.children];
    let target;
    arr.forEach(el => {
      if (el.classList.contains(this.config.className)) {
        target = el;
      }
    });
    let targetText = target.innerHTML;
    this.notify(targetText);
  }

  getLastIndex() {
    const lastItem = this.modal.lastChild;
    let lastIndex = lastItem.getAttribute(this.config.attrName);
    lastIndex = Number(lastIndex);
    return lastIndex;
  }

  addHighlight() {
    this.modal.children[this.currentHighlightIndex].classList.add(
      this.config.className
    );
    this.modal.children[
      this.currentHighlightIndex
    ].style.backgroundColor = this.config.selectedColor;
  }

  removeHighlight() {
    this.modal.children[this.currentHighlightIndex].classList.remove(
      this.config.className
    );
    this.modal.children[
      this.currentHighlightIndex
    ].style.backgroundColor = this.config.unselectedColor;
  }

  highlightIndexisFirst() {
    return this.currentHighlightIndex === this.config.initHighlightIndex;
  }

  highlightIndexisLast(lastIndex) {
    return this.currentHighlightIndex === lastIndex;
  }

  execArrowUp(reset = false, lastIndex) {
    this.removeHighlight();

    if (reset) this.currentHighlightIndex = lastIndex;
    else this.currentHighlightIndex += this.config.upDirection;

    if (this.highlightIndexisFirst()) this.initHighlightIndex();
    else this.addHighlight();
  }

  execArrowDown(reset = false) {
    this.removeHighlight();
    if (reset) this.currentHighlightIndex = 0;
    else this.currentHighlightIndex += this.config.downDirection;
    this.addHighlight();
  }

  setHighlightStatus(keyCode) {
    if (keyCode === "Enter") {
      this.submitAutoCompleteData();
      return;
    }

    const lastIndex = this.getLastIndex();

    if (this.highlightIndexisFirst()) {
      this.currentHighlightIndex += this.config.downDirection;
      if (keyCode === "ArrowUp") this.execArrowUp(true, lastIndex);
      if (keyCode === "ArrowDown") this.addHighlight();
    } else if (this.highlightIndexisLast(lastIndex)) {
      if (keyCode === "ArrowUp") this.execArrowUp();
      if (keyCode === "ArrowDown") this.execArrowDown(true);
    } else {
      if (keyCode === "ArrowUp") this.execArrowUp();
      else if (keyCode === "ArrowDown") this.execArrowDown();
    }
  }
}

export default ModalView;
