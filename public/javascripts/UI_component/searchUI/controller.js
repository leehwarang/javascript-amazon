class Controller {
  constructor({ searchView, autoCompleteView, recentSearchView, config }) {
    this.data;
    this.searchView = searchView;
    this.autoCompleteView = autoCompleteView;
    this.recentSearchView = recentSearchView;
    this.config = config;

    this.currentMode;
    this.modeType = {
      focusing: "focusing",
      blured: "blured",
      pending: "pending",
      entering: "entering",
      completing: "completing"
    };
  }

  init() {
    this.initController();
    this.initSearchView();
    this.initAutoCompleteView();
    this.initRecentSearchView();
  }

  setCurrentMode(changedmode) {
    this.currentMode = changedmode;
  }

  initController() {
    this.setCurrentMode(this.modeType.pending);

    document.addEventListener("keydown", e => {
      if (this.currentMode === this.modeType.focusing) {
        this.recentSearchView.setHighlightStatus(e.code);
      } else if (this.currentMode === this.modeType.entering) {
        this.autoCompleteView.setHighlightStatus(e.code);
      }
    });
  }

  initSearchView() {
    this.searchViewHandler = this.searchViewHandler.bind(this);
    this.searchView.init(this.searchViewHandler, this.modeType);
  }

  initAutoCompleteView() {
    this.autoCompleteHandler = this.autoCompleteHandler.bind(this);
    this.autoCompleteView.init(this.autoCompleteHandler);
  }

  initRecentSearchView() {
    this.recentSearchViewHandler = this.recentSearchViewHandler.bind(this);
    this.recentSearchView.init(this.recentSearchViewHandler);
  }

  makeSuggestionArr(jsonData) {
    const suggestions = jsonData.body.suggestions;
    const arr = suggestions.reduce((acc, cur) => {
      acc.push(cur.value);
      return acc;
    }, []);
    return arr;
  }

  async requestJsonData(url) {
    try {
      const response = await fetch(url);
      const jsonData = await response.json();

      if (jsonData.statusCode === 404) throw new Error("FAILED_TO_FETCH.");
      if (jsonData.statusCode !== 200)
        throw new Error(`STATUS_CODE : ${jsonData.statusCode}`);
      const suggestionArr = this.makeSuggestionArr(jsonData);
      this.autoCompleteView.makeModalContent(suggestionArr);
    } catch (error) {
      console.log(error);
    }
  }

  searchViewHandler(changedmode, inputStr = "") {
    this.setCurrentMode(changedmode);

    const mapFunc = {
      entering: inputStr => {
        this.recentSearchView.hideModalWindow();
        this.requestJsonData(`${this.config.baseUrl}${inputStr}`);
      },

      completing: () => {
        this.autoCompleteView.initHighlightIndex();
        this.recentSearchView.saveRecentKeyword(inputStr);
      },

      pending: () => {
        this.autoCompleteView.hideModalWindow();
      },

      focusing: () => {
        this.recentSearchView.makeModalContent();
      },

      blured: () => {
        this.autoCompleteView.hideModalWindow();
        this.recentSearchView.hideModalWindow();
      }
    };

    mapFunc[changedmode](inputStr);
  }

  autoCompleteHandler(selectedKeyword) {
    this.searchView.updateSearchKeyword(selectedKeyword);
  }

  recentSearchViewHandler(selectedKeyword = "") {
    if (!selectedKeyword) {
      this.setCurrentMode(this.modeType.pending);
      this.autoCompleteView.hideModalWindow();
      this.searchView.removeSearchKeyword();
    } else {
      this.searchView.updateSearchKeyword(selectedKeyword);
    }
  }
}

export default Controller;
