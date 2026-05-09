window.PageForge = window.PageForge || {};

(function setupStorage(PageForge) {
  var STORAGE_KEY = "pageforge-studio-project";

  function saveProject(project) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  }

  function loadProject() {
    var raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch (error) {
      console.warn("Unable to parse saved project.", error);
      return null;
    }
  }

  function clearProject() {
    localStorage.removeItem(STORAGE_KEY);
  }

  PageForge.storage = {
    saveProject: saveProject,
    loadProject: loadProject,
    clearProject: clearProject,
    storageKey: STORAGE_KEY
  };
})(window.PageForge);
