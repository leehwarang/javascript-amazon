import Controller from "./controller.js";
import SearchView from "./searchView.js";
import AutoCompleteView from "./autoCompleteView.js";
import RecentSearchView from "./recentSearchView.js";
import config from "./config.js";

export default function loadSearchUI() {
  const searchView = new SearchView([".search-form", ".btn-search"]);
  const autoCompleteView = new AutoCompleteView(".modal-autocomplete");
  const recentSearchView = new RecentSearchView(".modal-recent");

  const controller = new Controller({
    searchView,
    autoCompleteView,
    recentSearchView,
    config
  });

  window.addEventListener("DOMContentLoaded", () => {
    controller.init();
  });
}
