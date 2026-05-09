window.PageForge = window.PageForge || {};

(function setupDragDrop(PageForge) {
  var PLACEHOLDER_IMAGE =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540">' +
        '<defs>' +
          '<linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">' +
            '<stop offset="0%" stop-color="#24324f"/>' +
            '<stop offset="100%" stop-color="#6b97ff"/>' +
          "</linearGradient>" +
        "</defs>" +
        '<rect width="960" height="540" fill="url(#bg)"/>' +
        '<circle cx="182" cy="142" r="54" fill="rgba(255,255,255,0.15)"/>' +
        '<circle cx="748" cy="124" r="82" fill="rgba(255,255,255,0.12)"/>' +
        '<rect x="150" y="336" width="660" height="94" rx="20" fill="rgba(255,255,255,0.1)"/>' +
        '<text x="480" y="260" text-anchor="middle" fill="#f8fbff" font-family="Arial, sans-serif" font-size="40">Image Placeholder</text>' +
      "</svg>"
    );

  function createUniqueId() {
    return "pf-" + Date.now() + "-" + Math.random().toString(16).slice(2, 8);
  }

  function createBlockMarkup(type) {
    var templates = {
      heading:
        '<h1 data-field="primary" contenteditable="true" spellcheck="false">Your headline goes here</h1>',
      paragraph:
        '<p data-field="primary" contenteditable="true" spellcheck="false">Add a paragraph to explain your section, product, or offer.</p>',
      button:
        '<a class="pf-button-link" data-field="primary" data-link-field="href" href="#action" contenteditable="true" spellcheck="false">Click here</a>',
      image:
        '<img class="pf-image-media" data-image-field="src" src="' + PLACEHOLDER_IMAGE + '" alt="Placeholder image">' +
        '<figcaption data-field="primary" contenteditable="true" spellcheck="false">Image caption</figcaption>',
      hero:
        '<span class="pf-hero-badge">Featured</span>' +
        '<h1 data-field="primary" contenteditable="true" spellcheck="false">Build beautiful pages with drag and drop.</h1>' +
        '<p class="pf-hero-copy">Use a strong intro, supporting copy, and a focused call to action to guide visitors through your page.</p>' +
        '<a class="pf-button-link" data-link-field="href" href="#learn-more">Learn more</a>',
      card:
        '<img class="pf-image-media" data-image-field="src" src="' + PLACEHOLDER_IMAGE + '" alt="Card image">' +
        '<p class="pf-card-meta">Featured Card</p>' +
        '<h3 data-field="primary" contenteditable="true" spellcheck="false">Showcase a feature or service.</h3>' +
        '<p>Use cards to highlight details in a clear, structured format.</p>' +
        '<a class="pf-button-link" data-link-field="href" href="#details">View details</a>',
      navbar:
        '<a class="pf-navbar-brand" data-field="primary" data-navbar-role="brand" href="#">Lumio One</a>' +
        '<button class="pf-navbar-toggle" aria-label="Toggle navigation">☰</button>' +
        '<div class="pf-navbar-menu">' +
          '<a data-navbar-role="link-1" href="#features">Features</a>' +
          '<a data-navbar-role="link-2" href="#materials">Materials</a>' +
          '<a data-navbar-role="link-3" href="#reviews">Reviews</a>' +
          '<a class="pf-navbar-cta" data-navbar-role="cta" href="#buy">Buy</a>' +
        "</div>",
      footer:
        '<strong data-field="primary" data-footer-role="brand">PageForge Studio</strong>' +
        '<p class="pf-footer-description" data-footer-role="description">Build offline. Export cleanly. Publish anywhere.</p>' +
        '<div class="pf-footer-links">' +
          '<a class="pf-footer-link" data-footer-role="link-1" href="#about">About</a>' +
          '<a class="pf-footer-link" data-footer-role="link-2" href="#privacy">Privacy</a>' +
          '<a class="pf-footer-link" data-footer-role="link-3" href="#contact">Contact</a>' +
        '</div>' +
        '<p class="pf-footer-copyright" data-footer-role="copyright">Copyright 2026 PageForge Studio. All rights reserved.</p>',
      contact:
        '<h3 data-field="primary" contenteditable="true" spellcheck="false">Let\'s start your next project.</h3>' +
        '<form class="pf-form-grid">' +
          '<input type="text" placeholder="Your name">' +
          '<input type="email" placeholder="Email address">' +
          '<textarea placeholder="Tell us about your idea"></textarea>' +
          '<button class="pf-button-link" type="button">Send message</button>' +
        "</form>",
      divider: '<hr class="pf-divider-line">',
      spacer: '<div class="pf-spacer-fill" data-field="primary" contenteditable="true" spellcheck="false" style="min-height: 72px;">Spacer</div>'
    };

    return templates[type] || "";
  }

  function createBlockElement(type) {
    var blockId = createUniqueId();
    var block = document.createElement(type === "navbar" ? "div" : "article");
    var shell = document.createElement("div");
    var navbar = null;
    var contentMarkup = createBlockMarkup(type);
    var shellClassMap = {
      heading: "pf-block__content pf-edit-surface",
      paragraph: "pf-block__content pf-edit-surface",
      button: "pf-block__content pf-edit-surface",
      image: "pf-image-frame pf-edit-surface",
      hero: "pf-hero-shell pf-edit-surface",
      card: "pf-card-shell pf-edit-surface",
      footer: "pf-footer-shell pf-edit-surface",
      contact: "pf-contact-shell pf-edit-surface",
      divider: "pf-block__content pf-edit-surface",
      spacer: "pf-block__content pf-edit-surface"
    };
    var labelMap = {
      heading: "Heading",
      paragraph: "Paragraph",
      button: "Button",
      image: "Image",
      hero: "Hero Section",
      card: "Card",
      navbar: "Navbar",
      footer: "Footer",
      contact: "Contact Form",
      divider: "Divider",
      spacer: "Spacer"
    };

    block.className = type === "navbar" ? "editable-element" : "pf-block editable-element pf-" + type;
    block.setAttribute("draggable", "true");
    block.dataset.type = type;
    block.dataset.id = blockId;
    block.dataset.blockId = blockId;
    block.dataset.blockType = type;

    // Keep the visible drag handle separate from the editable content shell.
    if (type === "navbar") {
      block.innerHTML = '<div class="element-header"><span>Navbar</span><span>Drag to reorder</span></div>';
    } else {
      block.innerHTML =
        '<div class="pf-block__handle"><strong>' +
        (labelMap[type] || "Block") +
        "</strong><span>Drag to reorder</span></div>";
    }

    shell.className = shellClassMap[type] || "pf-block__content pf-edit-surface";
    shell.innerHTML = contentMarkup;

    if (type === "button") {
      shell.style.textAlign = "left";
    }

    if (type === "image") {
      var figure = document.createElement("figure");
      figure.className = shell.className;
      figure.innerHTML = contentMarkup;
      block.appendChild(figure);
      return block;
    }

    if (type === "hero" || type === "card" || type === "contact") {
      var section = document.createElement("section");
      section.className = shell.className;
      section.innerHTML = contentMarkup;
      block.appendChild(section);
      return block;
    }

    if (type === "navbar") {
      navbar = document.createElement("nav");
      navbar.className = "pf-navbar";
      navbar.innerHTML = contentMarkup;
      block.appendChild(navbar);
      return block;
    }

    if (type === "footer") {
      var footer = document.createElement("footer");
      footer.className = shell.className;
      footer.innerHTML = contentMarkup;
      block.appendChild(footer);
      return block;
    }

    block.appendChild(shell);
    return block;
  }

  function createDragDrop(options) {
    var canvas = options.canvas;
    var dropzone = options.dropzone;
    var library = options.library;
    var onBlockAdded = options.onBlockAdded || function noop() {};
    var onCanvasChanged = options.onCanvasChanged || function noop() {};

    var dropPlaceholder = document.createElement("div");
    var dragState = {
      sourceType: null,
      templateType: null,
      blockId: null
    };

    dropPlaceholder.className = "drop-placeholder";

    function getCanvasBlocks() {
      return Array.from(canvas.querySelectorAll(".editable-element"));
    }

    function getBlockById(blockId) {
      return canvas.querySelector('[data-id="' + blockId + '"]');
    }

    function clearPlaceholder() {
      if (dropPlaceholder.parentNode) {
        dropPlaceholder.parentNode.removeChild(dropPlaceholder);
      }
    }

    function clearSelection() {
      getCanvasBlocks().forEach(function removeSelectedState(block) {
        block.classList.remove("selected", "is-selected");
      });
    }

    // One selected element at a time keeps the editor state predictable.
    function selectBlock(block) {
      clearSelection();

      if (block) {
        block.classList.add("selected", "is-selected");
      }
    }

    function refreshEmptyState() {
      var emptyState = canvas.querySelector(".empty-state");

      if (getCanvasBlocks().length === 0) {
        if (!emptyState) {
          canvas.innerHTML = '<p class="empty-state">Drag elements here to start building</p>';
        }
        return;
      }

      if (emptyState) {
        emptyState.remove();
      }
    }

    function ensurePlaceholderPosition(pointerY) {
      var blocks = getCanvasBlocks().filter(function excludeDragging(block) {
        return !block.classList.contains("is-dragging");
      });
      var nextBlock = blocks.find(function findNextBlock(block) {
        var rect = block.getBoundingClientRect();
        return pointerY < rect.top + rect.height / 2;
      });

      if (nextBlock) {
        canvas.insertBefore(dropPlaceholder, nextBlock);
      } else {
        canvas.appendChild(dropPlaceholder);
      }
    }

    function addBlockFromTemplate(templateType, insertBeforeNode) {
      var emptyState = canvas.querySelector(".empty-state");
      var block = createBlockElement(templateType);

      if (emptyState) {
        emptyState.remove();
      }

      if (insertBeforeNode && insertBeforeNode.parentNode === canvas) {
        canvas.insertBefore(block, insertBeforeNode);
      } else {
        canvas.appendChild(block);
      }

      selectBlock(block);
      onBlockAdded(block);
      onCanvasChanged();
      return block;
    }

    function moveExistingBlock(block, insertBeforeNode) {
      if (!block) {
        return;
      }

      if (insertBeforeNode && insertBeforeNode.parentNode === canvas) {
        canvas.insertBefore(block, insertBeforeNode);
      } else {
        canvas.appendChild(block);
      }

      selectBlock(block);
      onCanvasChanged();
    }

    library.addEventListener("dragstart", function handleLibraryDragStart(event) {
      var item = event.target.closest("[data-template]");

      if (!item) {
        return;
      }

      dragState.sourceType = "library";
      dragState.templateType = item.dataset.template;
      dragState.blockId = null;
      document.body.classList.add("is-dragging");
      event.dataTransfer.effectAllowed = "copy";
      event.dataTransfer.setData("text/plain", item.dataset.template);
    });

    library.addEventListener("dragend", function handleLibraryDragEnd() {
      document.body.classList.remove("is-dragging");
      dropzone.classList.remove("drag-over");
      clearPlaceholder();
    });

    library.addEventListener("click", function handleLibraryClick(event) {
      var item = event.target.closest("[data-template]");

      if (!item) {
        return;
      }

      addBlockFromTemplate(item.dataset.template);
    });

    canvas.addEventListener("click", function handleCanvasSelection(event) {
      var block = event.target.closest(".editable-element");

      if (!block) {
        clearSelection();
        refreshEmptyState();
        return;
      }

      selectBlock(block);
    });

    canvas.addEventListener("dragstart", function handleCanvasDragStart(event) {
      var block = event.target.closest(".editable-element");

      if (!block) {
        return;
      }

      dragState.sourceType = "canvas";
      dragState.templateType = null;
      dragState.blockId = block.dataset.id;
      block.classList.add("is-dragging");
      document.body.classList.add("is-dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", block.dataset.id);
    });

    canvas.addEventListener("dragend", function handleCanvasDragEnd() {
      var draggingBlock = canvas.querySelector(".is-dragging");

      if (draggingBlock) {
        draggingBlock.classList.remove("is-dragging");
      }

      document.body.classList.remove("is-dragging");
      dropzone.classList.remove("drag-over");
      clearPlaceholder();
      refreshEmptyState();
    });

    dropzone.addEventListener("dragover", function handleDragOver(event) {
      event.preventDefault();
      dropzone.classList.add("drag-over");
      ensurePlaceholderPosition(event.clientY);
    });

    dropzone.addEventListener("dragleave", function handleDragLeave(event) {
      if (!dropzone.contains(event.relatedTarget)) {
        dropzone.classList.remove("drag-over");
      }
    });

    dropzone.addEventListener("drop", function handleDrop(event) {
      event.preventDefault();
      dropzone.classList.remove("drag-over");

      var insertBeforeNode = dropPlaceholder.parentNode ? dropPlaceholder : null;

      if (dragState.sourceType === "library" && dragState.templateType) {
        addBlockFromTemplate(dragState.templateType, insertBeforeNode);
      }

      if (dragState.sourceType === "canvas" && dragState.blockId) {
        moveExistingBlock(getBlockById(dragState.blockId), insertBeforeNode);
      }

      var draggingBlock = canvas.querySelector(".is-dragging");

      if (draggingBlock) {
        draggingBlock.classList.remove("is-dragging");
      }

      document.body.classList.remove("is-dragging");
      dragState.sourceType = null;
      dragState.templateType = null;
      dragState.blockId = null;
      clearPlaceholder();
      refreshEmptyState();
    });

    refreshEmptyState();

    return {
      addBlockFromTemplate: addBlockFromTemplate,
      clearSelection: clearSelection,
      refreshEmptyState: refreshEmptyState,
      selectBlock: selectBlock
    };
  }

  PageForge.createDragDrop = createDragDrop;
})(window.PageForge);
