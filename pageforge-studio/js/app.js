window.PageForge = window.PageForge || {};

(function bootstrapApp(PageForge) {
  var PREVIEW_WIDTHS = {
    desktop: "100%",
    tablet: "768px",
    mobile: "390px"
  };

  function syncNavbarState(root, shouldCloseMenus) {
    var navbars = [];

    if (!root) {
      return;
    }

    if (root.matches && root.matches(".pf-navbar")) {
      navbars.push(root);
    }

    navbars = navbars.concat(Array.from(root.querySelectorAll(".pf-navbar")));

    navbars.forEach(function syncNavbar(navbar) {
      var toggle = navbar.querySelector(".pf-navbar-toggle");
      var isOpen;

      if (!toggle) {
        return;
      }

      if (shouldCloseMenus) {
        navbar.classList.remove("is-menu-open");
        navbar.classList.remove("is-open");
      }

      isOpen = navbar.classList.contains("is-menu-open") || navbar.classList.contains("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggle.setAttribute("aria-haspopup", "true");
    });
  }

  function setNavbarMenuState(navbar, shouldOpen) {
    var toggle;

    if (!navbar) {
      return;
    }

    toggle = navbar.querySelector(".pf-navbar-toggle");
    navbar.classList.toggle("is-menu-open", Boolean(shouldOpen));
    navbar.classList.toggle("is-open", Boolean(shouldOpen));

    if (toggle) {
      toggle.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
      toggle.setAttribute("aria-haspopup", "true");
    }
  }

  function buildCleanCanvasHtml(canvas) {
    var clone = canvas.cloneNode(true);

    Array.from(clone.querySelectorAll(".pf-block, .editable-element")).forEach(function cleanBlock(block) {
      block.classList.remove("is-selected", "selected", "is-dragging");
      PageForge.assignBlockMetadata(block);

      if (block.classList.contains("pf-navbar")) {
        setNavbarMenuState(block, false);
      }
    });

    var emptyState = clone.querySelector(".empty-state");

    if (emptyState) {
      emptyState.remove();
    }

    return clone.innerHTML;
  }

  function buildProjectState(elements) {
    return {
      name: elements.projectNameInput.value.trim() || "pageforge-studio-home",
      updatedAt: new Date().toISOString(),
      canvasHtml: buildCleanCanvasHtml(elements.canvas)
    };
  }

  function setStatus(elements, message) {
    elements.statusBadge.textContent = message;
  }

  function createToastManager(region) {
    function show(title, message) {
      if (!region) {
        return;
      }

      var toast = document.createElement("div");
      var titleNode = document.createElement("strong");
      var messageNode = document.createElement("span");

      toast.className = "toast";
      titleNode.textContent = title;
      messageNode.textContent = message;
      toast.appendChild(titleNode);
      toast.appendChild(messageNode);
      region.appendChild(toast);

      requestAnimationFrame(function revealToast() {
        toast.classList.add("is-visible");
      });

      window.setTimeout(function hideToast() {
        toast.classList.remove("is-visible");

        window.setTimeout(function removeToast() {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 220);
      }, 2600);
    }

    return {
      show: show
    };
  }

  function isTypingTarget(target) {
    if (!target) {
      return false;
    }

    return (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT" ||
      target.isContentEditable
    );
  }

  function seedStarterPage(elements, dragDrop) {
    elements.canvas.innerHTML = "";
    PageForge.buildStarterPage().forEach(function appendBlock(block) {
      elements.canvas.appendChild(block);
    });
    dragDrop.refreshEmptyState();
  }

  function replaceCanvasWithBlocks(elements, dragDrop, editor, blocks) {
    elements.canvas.innerHTML = "";

    blocks.forEach(function appendBlock(block) {
      elements.canvas.appendChild(block);
    });

    syncNavbarState(elements.canvas, true);
    dragDrop.refreshEmptyState();

    if (blocks[0]) {
      editor.selectBlock(blocks[0]);
    } else {
      editor.clearSelection();
    }
  }

  function setPreviewMode(elements, mode) {
    var previewWidth = PREVIEW_WIDTHS[mode] || PREVIEW_WIDTHS.desktop;

    elements.canvasViewport.dataset.preview = mode;
    elements.canvasViewport.classList.remove("preview-desktop", "preview-tablet", "preview-mobile");
    elements.canvasViewport.classList.add("preview-" + mode);
    elements.canvasViewport.style.width = previewWidth;
    elements.canvasViewport.style.maxWidth = "100%";
    elements.canvasViewport.style.marginLeft = "auto";
    elements.canvasViewport.style.marginRight = "auto";
    elements.canvas.classList.remove("canvas-preview-desktop", "canvas-preview-tablet", "canvas-preview-mobile");
    elements.canvas.classList.add("canvas-preview-" + mode);

    elements.previewButtons.forEach(function toggleState(button) {
      var isActive = button.dataset.previewMode === mode;

      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    if (elements.canvas) {
      syncNavbarState(elements.canvas, !isCompactNavbarMode(elements));
    }
  }

  function isCompactNavbarMode(elements) {
    if (window.matchMedia("(max-width: 760px)").matches) {
      return true;
    }

    return (
      elements.canvas.classList.contains("canvas-preview-tablet") ||
      elements.canvas.classList.contains("canvas-preview-mobile")
    );
  }

  function prepareLoadedBlocks(canvas) {
    Array.from(canvas.querySelectorAll(".pf-block, .editable-element")).forEach(function prepareBlock(block) {
      if (!block.dataset.blockId) {
        PageForge.assignBlockMetadata(block);
      } else {
        block.setAttribute("draggable", "true");
        block.classList.add("editable-element");
        block.dataset.id = block.dataset.id || block.dataset.blockId;
        block.dataset.type = block.dataset.type || block.dataset.blockType || "";
      }
    });
  }

  function loadProjectIntoCanvas(elements, dragDrop, editor, project) {
    if (project && project.canvasHtml) {
      elements.canvas.innerHTML = project.canvasHtml;
      prepareLoadedBlocks(elements.canvas);
      editor.normalizeCanvas();
      syncNavbarState(elements.canvas, true);
      elements.projectNameInput.value = project.name || "pageforge-studio-home";
      setStatus(elements, "Project loaded");
    } else {
      seedStarterPage(elements, dragDrop);
      setStatus(elements, "New blank project");
    }

    dragDrop.refreshEmptyState();
    editor.clearSelection();
  }

  document.addEventListener("DOMContentLoaded", function initializePageForge() {
    var elements = {
      library: document.getElementById("blockLibrary"),
      canvas: document.getElementById("canvas"),
      dropzone: document.getElementById("canvasDropzone"),
      canvasViewport: document.getElementById("canvasViewport"),
      projectNameInput: document.getElementById("projectNameInput"),
      statusBadge: document.getElementById("statusBadge"),
      newProjectBtn: document.getElementById("newProjectBtn"),
      saveProjectBtn: document.getElementById("saveProjectBtn"),
      loadProjectBtn: document.getElementById("loadProjectBtn"),
      exportHtmlBtn: document.getElementById("exportHtmlBtn"),
      previewButtons: Array.from(document.querySelectorAll("[data-preview-mode]")),
      pageTemplateButtons: Array.from(document.querySelectorAll("[data-page-template]")),
      toastRegion: document.getElementById("toastRegion"),
      inspectorForm: document.getElementById("inspectorForm"),
      editorHelperText: document.getElementById("editorHelperText"),
      blockTypeField: document.getElementById("blockTypeField"),
      textContentInput: document.getElementById("textContentInput"),
      fontSizeInput: document.getElementById("fontSizeInput"),
      textColorInput: document.getElementById("textColorInput"),
      backgroundColorInput: document.getElementById("backgroundColorInput"),
      paddingInput: document.getElementById("paddingInput"),
      marginInput: document.getElementById("marginInput"),
      radiusInput: document.getElementById("radiusInput"),
      widthInput: document.getElementById("widthInput"),
      heightInput: document.getElementById("heightInput"),
      alignInput: document.getElementById("alignInput"),
      linkInput: document.getElementById("linkInput"),
      headingTextInput: document.getElementById("headingTextInput"),
      headingTagInput: document.getElementById("headingTagInput"),
      headingLinkUrlInput: document.getElementById("headingLinkUrlInput"),
      headingFontSizeInput: document.getElementById("headingFontSizeInput"),
      headingFontWeightInput: document.getElementById("headingFontWeightInput"),
      headingTextColorInput: document.getElementById("headingTextColorInput"),
      headingAlignInput: document.getElementById("headingAlignInput"),
      headingLineHeightInput: document.getElementById("headingLineHeightInput"),
      headingLetterSpacingInput: document.getElementById("headingLetterSpacingInput"),
      headingMarginInput: document.getElementById("headingMarginInput"),
      headingPaddingInput: document.getElementById("headingPaddingInput"),
      paragraphTextInput: document.getElementById("paragraphTextInput"),
      paragraphFontSizeInput: document.getElementById("paragraphFontSizeInput"),
      paragraphFontWeightInput: document.getElementById("paragraphFontWeightInput"),
      paragraphTextColorInput: document.getElementById("paragraphTextColorInput"),
      paragraphAlignInput: document.getElementById("paragraphAlignInput"),
      paragraphLineHeightInput: document.getElementById("paragraphLineHeightInput"),
      paragraphLetterSpacingInput: document.getElementById("paragraphLetterSpacingInput"),
      paragraphMaxWidthInput: document.getElementById("paragraphMaxWidthInput"),
      paragraphMarginInput: document.getElementById("paragraphMarginInput"),
      paragraphPaddingInput: document.getElementById("paragraphPaddingInput"),
      footerBrandTextInput: document.getElementById("footerBrandTextInput"),
      footerDescriptionTextInput: document.getElementById("footerDescriptionTextInput"),
      footerCopyrightTextInput: document.getElementById("footerCopyrightTextInput"),
      footerLink1TextInput: document.getElementById("footerLink1TextInput"),
      footerLink1UrlInput: document.getElementById("footerLink1UrlInput"),
      footerLink2TextInput: document.getElementById("footerLink2TextInput"),
      footerLink2UrlInput: document.getElementById("footerLink2UrlInput"),
      footerLink3TextInput: document.getElementById("footerLink3TextInput"),
      footerLink3UrlInput: document.getElementById("footerLink3UrlInput"),
      footerBackgroundColorInput: document.getElementById("footerBackgroundColorInput"),
      footerTextColorInput: document.getElementById("footerTextColorInput"),
      footerLinkColorInput: document.getElementById("footerLinkColorInput"),
      footerPaddingInput: document.getElementById("footerPaddingInput"),
      footerRadiusInput: document.getElementById("footerRadiusInput"),
      footerAlignInput: document.getElementById("footerAlignInput"),
      buttonElementTextInput: document.getElementById("buttonElementTextInput"),
      buttonElementUrlInput: document.getElementById("buttonElementUrlInput"),
      buttonOpenInNewTabInput: document.getElementById("buttonOpenInNewTabInput"),
      buttonBackgroundColorInput: document.getElementById("buttonBackgroundColorInput"),
      buttonTextColorInput: document.getElementById("buttonTextColorInput"),
      buttonPaddingSpecialInput: document.getElementById("buttonPaddingSpecialInput"),
      buttonRadiusSpecialInput: document.getElementById("buttonRadiusSpecialInput"),
      buttonWidthSpecialInput: document.getElementById("buttonWidthSpecialInput"),
      buttonAlignSpecialInput: document.getElementById("buttonAlignSpecialInput"),
      imageUrlInput: document.getElementById("imageUrlInput"),
      imageElementUrlInput: document.getElementById("imageElementUrlInput"),
      imageAltTextInput: document.getElementById("imageAltTextInput"),
      imageCaptionTextInput: document.getElementById("imageCaptionTextInput"),
      imageWidthInput: document.getElementById("imageWidthInput"),
      imageHeightSpecialInput: document.getElementById("imageHeightSpecialInput"),
      imageObjectFitInput: document.getElementById("imageObjectFitInput"),
      imageRadiusSpecialInput: document.getElementById("imageRadiusSpecialInput"),
      heroBadgeTextInput: document.getElementById("heroBadgeTextInput"),
      heroHeadingTextInput: document.getElementById("heroHeadingTextInput"),
      heroParagraphTextInput: document.getElementById("heroParagraphTextInput"),
      heroButtonTextInput: document.getElementById("heroButtonTextInput"),
      heroButtonUrlInput: document.getElementById("heroButtonUrlInput"),
      heroBackgroundColorInput: document.getElementById("heroBackgroundColorInput"),
      heroHeadingColorInput: document.getElementById("heroHeadingColorInput"),
      heroParagraphColorInput: document.getElementById("heroParagraphColorInput"),
      heroButtonBackgroundColorInput: document.getElementById("heroButtonBackgroundColorInput"),
      heroButtonTextColorInput: document.getElementById("heroButtonTextColorInput"),
      heroAlignInput: document.getElementById("heroAlignInput"),
      cardLabelTextInput: document.getElementById("cardLabelTextInput"),
      cardTitleTextInput: document.getElementById("cardTitleTextInput"),
      cardDescriptionTextInput: document.getElementById("cardDescriptionTextInput"),
      cardButtonTextInput: document.getElementById("cardButtonTextInput"),
      cardButtonUrlInput: document.getElementById("cardButtonUrlInput"),
      cardBackgroundColorInput: document.getElementById("cardBackgroundColorInput"),
      cardTitleColorInput: document.getElementById("cardTitleColorInput"),
      cardTextColorInput: document.getElementById("cardTextColorInput"),
      cardButtonBackgroundColorInput: document.getElementById("cardButtonBackgroundColorInput"),
      cardRadiusInput: document.getElementById("cardRadiusInput"),
      cardPaddingInput: document.getElementById("cardPaddingInput"),
      navbarBrandTextInput: document.getElementById("navbarBrandTextInput"),
      navbarBrandUrlInput: document.getElementById("navbarBrandUrlInput"),
      navbarLink1TextInput: document.getElementById("navbarLink1TextInput"),
      navbarLink1UrlInput: document.getElementById("navbarLink1UrlInput"),
      navbarLink2TextInput: document.getElementById("navbarLink2TextInput"),
      navbarLink2UrlInput: document.getElementById("navbarLink2UrlInput"),
      navbarLink3TextInput: document.getElementById("navbarLink3TextInput"),
      navbarLink3UrlInput: document.getElementById("navbarLink3UrlInput"),
      navbarLink4TextInput: document.getElementById("navbarLink4TextInput"),
      navbarLink4UrlInput: document.getElementById("navbarLink4UrlInput"),
      navbarCtaTextInput: document.getElementById("navbarCtaTextInput"),
      navbarCtaUrlInput: document.getElementById("navbarCtaUrlInput"),
      navbarBackgroundColorInput: document.getElementById("navbarBackgroundColorInput"),
      navbarLinkColorInput: document.getElementById("navbarLinkColorInput"),
      navbarCtaBackgroundColorInput: document.getElementById("navbarCtaBackgroundColorInput"),
      navbarCtaTextColorInput: document.getElementById("navbarCtaTextColorInput"),
      contactFormTitleInput: document.getElementById("contactFormTitleInput"),
      contactFormDescriptionInput: document.getElementById("contactFormDescriptionInput"),
      contactFormNamePlaceholderInput: document.getElementById("contactFormNamePlaceholderInput"),
      contactFormEmailPlaceholderInput: document.getElementById("contactFormEmailPlaceholderInput"),
      contactFormMessagePlaceholderInput: document.getElementById("contactFormMessagePlaceholderInput"),
      contactFormButtonTextInput: document.getElementById("contactFormButtonTextInput"),
      contactFormBackgroundColorInput: document.getElementById("contactFormBackgroundColorInput"),
      contactFormInputBackgroundColorInput: document.getElementById("contactFormInputBackgroundColorInput"),
      contactFormInputTextColorInput: document.getElementById("contactFormInputTextColorInput"),
      contactFormButtonBackgroundColorInput: document.getElementById("contactFormButtonBackgroundColorInput"),
      contactFormButtonTextColorInput: document.getElementById("contactFormButtonTextColorInput"),
      contactFormBorderRadiusInput: document.getElementById("contactFormBorderRadiusInput"),
      contactFormPaddingInput: document.getElementById("contactFormPaddingInput"),
      contactFormWidthInput: document.getElementById("contactFormWidthInput"),
      dividerWidthInput: document.getElementById("dividerWidthInput"),
      dividerHeightInput: document.getElementById("dividerHeightInput"),
      dividerColorInput: document.getElementById("dividerColorInput"),
      dividerStyleInput: document.getElementById("dividerStyleInput"),
      dividerMarginTopInput: document.getElementById("dividerMarginTopInput"),
      dividerMarginBottomInput: document.getElementById("dividerMarginBottomInput"),
      dividerAlignInput: document.getElementById("dividerAlignInput"),
      spacerHeightInput: document.getElementById("spacerHeightInput"),
      spacerBackgroundColorInput: document.getElementById("spacerBackgroundColorInput"),
      spacerRadiusInput: document.getElementById("spacerRadiusInput"),
      spacerMarginTopInput: document.getElementById("spacerMarginTopInput"),
      spacerMarginBottomInput: document.getElementById("spacerMarginBottomInput"),
      deleteBlockBtn: document.getElementById("deleteBlockBtn"),
      duplicateBlockBtn: document.getElementById("duplicateBlockBtn"),
      moveUpBlockBtn: document.getElementById("moveUpBlockBtn"),
      moveDownBlockBtn: document.getElementById("moveDownBlockBtn")
    };

    var dragDrop = null;
    var toast = createToastManager(elements.toastRegion);

    function autosave(statusMessage, shouldToast) {
      if (dragDrop) {
        dragDrop.refreshEmptyState();
      }

      PageForge.storage.saveProject(buildProjectState(elements));
      setStatus(elements, statusMessage || "Saved locally");

      if (shouldToast) {
        toast.show("Project updated", statusMessage || "Saved locally.");
      }
    }

    function saveProject(message) {
      PageForge.storage.saveProject(buildProjectState(elements));
      setStatus(elements, message || "Project saved");
      toast.show("Project saved", message || "Your latest changes are stored in this browser.");
    }

    function exportProject() {
      var projectName = elements.projectNameInput.value.trim() || "pageforge-studio-home";
      var html = PageForge.exporter.createExportMarkup(projectName, elements.canvas);

      PageForge.exporter.downloadHtml(projectName, html);
      setStatus(elements, "Standalone HTML exported");
      toast.show("Export ready", "Downloaded my-website.html for offline use.");
    }

    var editor = PageForge.createEditor({
      canvas: elements.canvas,
      form: elements.inspectorForm,
      helperText: elements.editorHelperText,
      blockTypeField: elements.blockTypeField,
      textContentInput: elements.textContentInput,
      fontSizeInput: elements.fontSizeInput,
      textColorInput: elements.textColorInput,
      backgroundColorInput: elements.backgroundColorInput,
      paddingInput: elements.paddingInput,
      marginInput: elements.marginInput,
      radiusInput: elements.radiusInput,
      widthInput: elements.widthInput,
      heightInput: elements.heightInput,
      alignInput: elements.alignInput,
      linkInput: elements.linkInput,
      headingTextInput: elements.headingTextInput,
      headingTagInput: elements.headingTagInput,
      headingLinkUrlInput: elements.headingLinkUrlInput,
      headingFontSizeInput: elements.headingFontSizeInput,
      headingFontWeightInput: elements.headingFontWeightInput,
      headingTextColorInput: elements.headingTextColorInput,
      headingAlignInput: elements.headingAlignInput,
      headingLineHeightInput: elements.headingLineHeightInput,
      headingLetterSpacingInput: elements.headingLetterSpacingInput,
      headingMarginInput: elements.headingMarginInput,
      headingPaddingInput: elements.headingPaddingInput,
      paragraphTextInput: elements.paragraphTextInput,
      paragraphFontSizeInput: elements.paragraphFontSizeInput,
      paragraphFontWeightInput: elements.paragraphFontWeightInput,
      paragraphTextColorInput: elements.paragraphTextColorInput,
      paragraphAlignInput: elements.paragraphAlignInput,
      paragraphLineHeightInput: elements.paragraphLineHeightInput,
      paragraphLetterSpacingInput: elements.paragraphLetterSpacingInput,
      paragraphMaxWidthInput: elements.paragraphMaxWidthInput,
      paragraphMarginInput: elements.paragraphMarginInput,
      paragraphPaddingInput: elements.paragraphPaddingInput,
      footerBrandTextInput: elements.footerBrandTextInput,
      footerDescriptionTextInput: elements.footerDescriptionTextInput,
      footerCopyrightTextInput: elements.footerCopyrightTextInput,
      footerLink1TextInput: elements.footerLink1TextInput,
      footerLink1UrlInput: elements.footerLink1UrlInput,
      footerLink2TextInput: elements.footerLink2TextInput,
      footerLink2UrlInput: elements.footerLink2UrlInput,
      footerLink3TextInput: elements.footerLink3TextInput,
      footerLink3UrlInput: elements.footerLink3UrlInput,
      footerBackgroundColorInput: elements.footerBackgroundColorInput,
      footerTextColorInput: elements.footerTextColorInput,
      footerLinkColorInput: elements.footerLinkColorInput,
      footerPaddingInput: elements.footerPaddingInput,
      footerRadiusInput: elements.footerRadiusInput,
      footerAlignInput: elements.footerAlignInput,
      buttonElementTextInput: elements.buttonElementTextInput,
      buttonElementUrlInput: elements.buttonElementUrlInput,
      buttonOpenInNewTabInput: elements.buttonOpenInNewTabInput,
      buttonBackgroundColorInput: elements.buttonBackgroundColorInput,
      buttonTextColorInput: elements.buttonTextColorInput,
      buttonPaddingSpecialInput: elements.buttonPaddingSpecialInput,
      buttonRadiusSpecialInput: elements.buttonRadiusSpecialInput,
      buttonWidthSpecialInput: elements.buttonWidthSpecialInput,
      buttonAlignSpecialInput: elements.buttonAlignSpecialInput,
      imageUrlInput: elements.imageUrlInput,
      imageElementUrlInput: elements.imageElementUrlInput,
      imageAltTextInput: elements.imageAltTextInput,
      imageCaptionTextInput: elements.imageCaptionTextInput,
      imageWidthInput: elements.imageWidthInput,
      imageHeightSpecialInput: elements.imageHeightSpecialInput,
      imageObjectFitInput: elements.imageObjectFitInput,
      imageRadiusSpecialInput: elements.imageRadiusSpecialInput,
      heroBadgeTextInput: elements.heroBadgeTextInput,
      heroHeadingTextInput: elements.heroHeadingTextInput,
      heroParagraphTextInput: elements.heroParagraphTextInput,
      heroButtonTextInput: elements.heroButtonTextInput,
      heroButtonUrlInput: elements.heroButtonUrlInput,
      heroBackgroundColorInput: elements.heroBackgroundColorInput,
      heroHeadingColorInput: elements.heroHeadingColorInput,
      heroParagraphColorInput: elements.heroParagraphColorInput,
      heroButtonBackgroundColorInput: elements.heroButtonBackgroundColorInput,
      heroButtonTextColorInput: elements.heroButtonTextColorInput,
      heroAlignInput: elements.heroAlignInput,
      cardLabelTextInput: elements.cardLabelTextInput,
      cardTitleTextInput: elements.cardTitleTextInput,
      cardDescriptionTextInput: elements.cardDescriptionTextInput,
      cardButtonTextInput: elements.cardButtonTextInput,
      cardButtonUrlInput: elements.cardButtonUrlInput,
      cardBackgroundColorInput: elements.cardBackgroundColorInput,
      cardTitleColorInput: elements.cardTitleColorInput,
      cardTextColorInput: elements.cardTextColorInput,
      cardButtonBackgroundColorInput: elements.cardButtonBackgroundColorInput,
      cardRadiusInput: elements.cardRadiusInput,
      cardPaddingInput: elements.cardPaddingInput,
      navbarBrandTextInput: elements.navbarBrandTextInput,
      navbarBrandUrlInput: elements.navbarBrandUrlInput,
      navbarLink1TextInput: elements.navbarLink1TextInput,
      navbarLink1UrlInput: elements.navbarLink1UrlInput,
      navbarLink2TextInput: elements.navbarLink2TextInput,
      navbarLink2UrlInput: elements.navbarLink2UrlInput,
      navbarLink3TextInput: elements.navbarLink3TextInput,
      navbarLink3UrlInput: elements.navbarLink3UrlInput,
      navbarLink4TextInput: elements.navbarLink4TextInput,
      navbarLink4UrlInput: elements.navbarLink4UrlInput,
      navbarCtaTextInput: elements.navbarCtaTextInput,
      navbarCtaUrlInput: elements.navbarCtaUrlInput,
      navbarBackgroundColorInput: elements.navbarBackgroundColorInput,
      navbarLinkColorInput: elements.navbarLinkColorInput,
      navbarCtaBackgroundColorInput: elements.navbarCtaBackgroundColorInput,
      navbarCtaTextColorInput: elements.navbarCtaTextColorInput,
      contactFormTitleInput: elements.contactFormTitleInput,
      contactFormDescriptionInput: elements.contactFormDescriptionInput,
      contactFormNamePlaceholderInput: elements.contactFormNamePlaceholderInput,
      contactFormEmailPlaceholderInput: elements.contactFormEmailPlaceholderInput,
      contactFormMessagePlaceholderInput: elements.contactFormMessagePlaceholderInput,
      contactFormButtonTextInput: elements.contactFormButtonTextInput,
      contactFormBackgroundColorInput: elements.contactFormBackgroundColorInput,
      contactFormInputBackgroundColorInput: elements.contactFormInputBackgroundColorInput,
      contactFormInputTextColorInput: elements.contactFormInputTextColorInput,
      contactFormButtonBackgroundColorInput: elements.contactFormButtonBackgroundColorInput,
      contactFormButtonTextColorInput: elements.contactFormButtonTextColorInput,
      contactFormBorderRadiusInput: elements.contactFormBorderRadiusInput,
      contactFormPaddingInput: elements.contactFormPaddingInput,
      contactFormWidthInput: elements.contactFormWidthInput,
      dividerWidthInput: elements.dividerWidthInput,
      dividerHeightInput: elements.dividerHeightInput,
      dividerColorInput: elements.dividerColorInput,
      dividerStyleInput: elements.dividerStyleInput,
      dividerMarginTopInput: elements.dividerMarginTopInput,
      dividerMarginBottomInput: elements.dividerMarginBottomInput,
      dividerAlignInput: elements.dividerAlignInput,
      spacerHeightInput: elements.spacerHeightInput,
      spacerBackgroundColorInput: elements.spacerBackgroundColorInput,
      spacerRadiusInput: elements.spacerRadiusInput,
      spacerMarginTopInput: elements.spacerMarginTopInput,
      spacerMarginBottomInput: elements.spacerMarginBottomInput,
      deleteButton: elements.deleteBlockBtn,
      duplicateButton: elements.duplicateBlockBtn,
      moveUpButton: elements.moveUpBlockBtn,
      moveDownButton: elements.moveDownBlockBtn,
      onChange: function handleEditorChange() {
        autosave("Element updated");
      },
      onStructureChange: function handleEditorStructureChange() {
        syncNavbarState(elements.canvas, false);
        autosave("Canvas updated");
      }
    });

    dragDrop = PageForge.createDragDrop({
      canvas: elements.canvas,
      dropzone: elements.dropzone,
      library: elements.library,
      onBlockAdded: function handleBlockAdded(block) {
        syncNavbarState(block, true);
        editor.selectBlock(block);
        setStatus(elements, "Element added");
        toast.show("Element added", "New block dropped into the canvas.");
      },
      onCanvasChanged: function handleCanvasChanged() {
        dragDrop.refreshEmptyState();
        autosave("Canvas updated");
      }
    });

    loadProjectIntoCanvas(elements, dragDrop, editor, PageForge.storage.loadProject());
    setPreviewMode(elements, "desktop");
    editor.refresh();
    toast.show("Workspace ready", "Use the sidebar to add blocks or load a template.");

    elements.canvas.addEventListener("click", function handleCanvasClick(event) {
      var toggle = event.target.closest(".pf-navbar-toggle");
      var menuLink = event.target.closest(".pf-navbar-menu a");

      if (toggle && elements.canvas.contains(toggle)) {
        setNavbarMenuState(toggle.closest(".pf-navbar"), !toggle.closest(".pf-navbar").classList.contains("is-menu-open"));
      } else if (menuLink && elements.canvas.contains(menuLink) && isCompactNavbarMode(elements)) {
        setNavbarMenuState(menuLink.closest(".pf-navbar"), false);
      }

      var block = editor.closestBlock(event.target);
      editor.selectBlock(block);
      setStatus(elements, block ? "Element selected" : "Canvas ready");
    });

    window.addEventListener("resize", function handleNavbarResize() {
      if (!isCompactNavbarMode(elements)) {
        syncNavbarState(elements.canvas, true);
      }
    });

    elements.newProjectBtn.addEventListener("click", function handleNewProject() {
      var shouldReset = window.confirm("Start a new project? Unsaved layout changes in the canvas will be cleared.");

      if (!shouldReset) {
        return;
      }

      seedStarterPage(elements, dragDrop);
      editor.clearSelection();
      autosave("New project created", true);
    });

    elements.saveProjectBtn.addEventListener("click", function handleSaveProject() {
      saveProject("Project saved");
    });

    elements.loadProjectBtn.addEventListener("click", function handleLoadProject() {
      loadProjectIntoCanvas(elements, dragDrop, editor, PageForge.storage.loadProject());
      toast.show("Project loaded", "Restored the saved project into the builder.");
    });

    elements.exportHtmlBtn.addEventListener("click", function handleExportHtml() {
      exportProject();
    });

    elements.previewButtons.forEach(function bindPreview(button) {
      button.addEventListener("click", function handlePreviewMode() {
        setPreviewMode(elements, button.dataset.previewMode);
        setStatus(elements, "Preview: " + button.dataset.previewMode);
        toast.show("Preview updated", "Switched to " + button.dataset.previewMode + " mode.");
      });
    });

    elements.pageTemplateButtons.forEach(function bindPageTemplate(button) {
      button.addEventListener("click", function handlePageTemplate() {
        var templateName = button.dataset.pageTemplate;
        var templateLabel = PageForge.pageTemplates[templateName]
          ? PageForge.pageTemplates[templateName].label
          : templateName;
        var shouldReplace = window.confirm(
          'Load the "' + templateLabel + '" template? This will replace the current canvas content.'
        );

        if (!shouldReplace) {
          return;
        }

        replaceCanvasWithBlocks(elements, dragDrop, editor, PageForge.buildPageTemplate(templateName));
        autosave(templateLabel + " loaded", true);
      });
    });

    elements.projectNameInput.addEventListener("input", function handleProjectNameChange() {
      setStatus(elements, "Project file renamed");
    });

    elements.projectNameInput.addEventListener("change", function handleProjectNameCommit() {
      saveProject("Project file name saved");
    });

    document.addEventListener("keydown", function handleShortcuts(event) {
      var isModifierSave = (event.ctrlKey || event.metaKey) && !event.shiftKey;

      if (isModifierSave && event.key.toLowerCase() === "s") {
        event.preventDefault();
        saveProject("Project saved with shortcut");
        return;
      }

      if (isModifierSave && event.key.toLowerCase() === "e") {
        event.preventDefault();
        exportProject();
        return;
      }

      if (event.key === "Escape") {
        editor.clearSelection();
        setStatus(elements, "Selection cleared");
        toast.show("Selection cleared", "No element is currently selected.");
        return;
      }

      if ((event.key === "Delete" || event.key === "Backspace") && !isTypingTarget(event.target)) {
        if (editor.deleteSelected()) {
          event.preventDefault();
          setStatus(elements, "Element deleted");
          toast.show("Element removed", "The selected element was deleted.");
        }
        return;
      }
    });
  });
})(window.PageForge);
