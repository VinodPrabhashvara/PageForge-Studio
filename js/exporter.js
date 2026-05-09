window.PageForge = window.PageForge || {};

(function setupExporter(PageForge) {
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function removeBuilderAttributes(node) {
    var classNamesToRemove;

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    classNamesToRemove = [
      "selected",
      "editable-element",
      "is-selected",
      "is-dragging",
      "pf-block",
      "pf-edit-surface",
      "pf-block__content"
    ];

    classNamesToRemove.forEach(function removeClassName(className) {
      node.classList.remove(className);
    });

    node.removeAttribute("draggable");
    node.removeAttribute("contenteditable");
    node.removeAttribute("spellcheck");
    Array.from(node.attributes).forEach(function removeBuilderData(attribute) {
      if (/^data-/i.test(attribute.name)) {
        node.removeAttribute(attribute.name);
      }
    });

    if (!node.className) {
      node.removeAttribute("class");
    }

    Array.from(node.children).forEach(removeBuilderAttributes);
  }

  function stripBuilderHandles(root) {
    Array.from(root.querySelectorAll(".pf-block__handle, .element-header")).forEach(function removeHandle(handle) {
      handle.remove();
    });
  }

  function addFriendlyFormNotes(root) {
    Array.from(root.querySelectorAll(".pf-form-grid")).forEach(function enhanceForm(form) {
      var submitButton = form.querySelector("button");

      if (submitButton) {
        submitButton.setAttribute("type", "submit");
      }

      if (!form.querySelector(".pf-form-note")) {
        var note = document.createElement("p");
        note.className = "pf-form-note";
        note.textContent = "This demo form works on the frontend only and does not send data anywhere.";
        form.appendChild(note);
      }
    });
  }

  function cleanupStyleAttribute(node) {
    if (node && node.getAttribute && node.getAttribute("style") === "") {
      node.removeAttribute("style");
    }
  }

  function normalizeExportInlineStyles(root, blockType) {
    var navbar;

    if (!root || root.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    if (blockType === "navbar") {
      navbar = root.matches(".pf-navbar") ? root : root.querySelector(".pf-navbar");

      if (navbar) {
        navbar.style.removeProperty("background");
        navbar.style.removeProperty("background-color");
        navbar.style.removeProperty("border");
        navbar.style.removeProperty("border-radius");
        navbar.style.removeProperty("box-shadow");
        cleanupStyleAttribute(navbar);

        Array.from(navbar.querySelectorAll(".pf-navbar-brand, .pf-navbar-menu, .pf-navbar-menu a, .pf-navbar-toggle")).forEach(function normalizeNavbarText(node) {
          node.style.removeProperty("color");
          cleanupStyleAttribute(node);
        });
      }
    }
  }

  function getExportBlockType(block) {
    if (!block) {
      return "";
    }

    return block.dataset.blockType || block.dataset.type || "";
  }

  function getExportSectionKey(block, index) {
    var blockType = getExportBlockType(block);
    var tone = getExportSectionTone(block, blockType);

    if (block && block.dataset && block.dataset.exportSection) {
      return block.dataset.exportSection;
    }

    if (blockType === "navbar") {
      return "pf-auto-navbar-" + tone;
    }

    if (blockType === "hero") {
      return "pf-auto-hero-" + tone;
    }

    if (blockType === "footer") {
      return "pf-auto-footer-" + tone;
    }

    if (blockType === "card") {
      return "pf-auto-cards-" + tone;
    }

    if (blockType === "contact-form" || blockType === "contact") {
      return "pf-auto-contact-" + tone;
    }

    if (blockType === "button") {
      return "pf-auto-button-" + tone;
    }

    return "pf-auto-content-" + tone;
  }

  function getExportSectionTone(block, blockType) {
    if (block && block.dataset && block.dataset.exportTone) {
      return block.dataset.exportTone;
    }

    if (blockType === "hero" || blockType === "navbar" || blockType === "footer") {
      return "dark";
    }

    if (blockType === "card" || blockType === "contact-form" || blockType === "contact") {
      return "muted";
    }

    return "light";
  }

  function getSectionClassName(block, blockType) {
    return "pf-section pf-section-" + getExportSectionTone(block, blockType);
  }

  function createSectionWrapper(block, blockType, sectionKey) {
    var section = document.createElement("section");
    var container = document.createElement("div");

    section.className = getSectionClassName(block, blockType);
    section.classList.add("pf-section-reveal");
    container.className = "pf-container";
    section.appendChild(container);
    return section;
  }

  function cloneCleanCanvasContent(canvas) {
    var exportWrapper = document.createElement("div");
    exportWrapper.className = "page-content";

    // Clone only the website blocks so the exported file contains no builder UI.
    var currentSectionKey = "";
    var currentSection = null;
    var currentContainer = null;

    Array.from(canvas.querySelectorAll(".pf-block, .editable-element")).forEach(function cloneBlock(block, index) {
      var blockType = getExportBlockType(block);
      var sectionKey = getExportSectionKey(block, index);
      var navbar;
      var isNavbarWrapper =
        block.matches &&
        block.matches(".editable-element[data-type='navbar'], .editable-element[data-block-type='navbar']");
      
      if (block.matches && block.matches(".pf-navbar")) {
        navbar = block;
      } else if (block.children) {
        navbar = Array.from(block.children).find(function findDirectNavbar(child) {
          return child.matches && child.matches(".pf-navbar");
        }) || block.querySelector(".pf-navbar");
      }

      var clone = isNavbarWrapper && navbar ? navbar.cloneNode(true) : block.cloneNode(true);

      removeBuilderAttributes(clone);
      stripBuilderHandles(clone);
      addFriendlyFormNotes(clone);
      normalizeExportInlineStyles(clone, blockType);

      if (clone.classList.contains("pf-navbar")) {
        clone.classList.remove("is-menu-open");
        clone.classList.remove("is-open");

        if (clone.querySelector(".pf-navbar-toggle")) {
          clone.querySelector(".pf-navbar-toggle").setAttribute("aria-expanded", "false");
          clone.querySelector(".pf-navbar-toggle").setAttribute("aria-haspopup", "true");
        }
      }

      if (!currentSection || currentSectionKey !== sectionKey) {
        currentSection = createSectionWrapper(block, blockType, sectionKey);
        currentContainer = currentSection.querySelector(".pf-container");
        currentSectionKey = sectionKey;
        exportWrapper.appendChild(currentSection);
      }

      if (blockType === "card") {
        var cardGrid = currentContainer.querySelector(".pf-card-grid");

        if (!cardGrid) {
          cardGrid = document.createElement("div");
          cardGrid.className = "pf-card-grid";
          currentContainer.appendChild(cardGrid);
        }

        cardGrid.appendChild(clone);
        return;
      }

      currentContainer.appendChild(clone);
    });

    if (!exportWrapper.children.length) {
      exportWrapper.innerHTML =
        '<section class="empty-export">' +
          "<h1>Your page is empty</h1>" +
          "<p>Add blocks in PageForge Studio before exporting your standalone website.</p>" +
        "</section>";
    }

    return exportWrapper;
  }

  function getExportStyles() {
    return (
      "*,*::before,*::after{box-sizing:border-box;}" +
      "html{scroll-behavior:smooth;}" +
      "html,body{margin:0;min-height:100%;}" +
      "body{font-family:'Trebuchet MS','Segoe UI',sans-serif;color:#17202c;background:#fff;}" +
      ".page-content{max-width:none;width:100%;margin:0;padding:0;display:block;}" +
      ".page-content>*{margin:0;}" +
      ".pf-section{width:100%;}" +
      ".pf-section-light{background:#fff;color:#17202c;}" +
      ".pf-section-dark{background:#0f1521;color:#f6f9ff;}" +
      ".pf-section-muted{background:#f5f8fc;color:#17202c;}" +
      ".pf-container{width:min(1120px,calc(100% - 40px));margin:0 auto;}" +
      ".pf-container>* + *{margin-top:24px;}" +
      ".pf-section-reveal{opacity:1;transform:none;}" +
      "body.has-export-motion .pf-section-reveal{opacity:0;transform:translateY(28px);transition:opacity .7s ease,transform .7s ease;}" +
      "body.has-export-motion .pf-section-reveal.is-visible{opacity:1;transform:translateY(0);}" +
      ".empty-export{padding:64px 28px;border-radius:24px;background:#fff;text-align:center;box-shadow:0 14px 28px rgba(10,18,30,.08);}" +
      ".empty-export h1{margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;}" +
      ".empty-export p{margin:0;color:#5a687c;line-height:1.7;}" +
      ".page-content article,.pf-navbar{display:block;width:100%;max-width:none;box-sizing:border-box;border:0;border-radius:0;background:transparent;box-shadow:none;overflow:visible;}" +
      ".pf-heading>div,.pf-paragraph>div,.pf-button>div,.pf-divider>div,.pf-spacer>div,.pf-hero-shell,.pf-card-shell,.pf-footer-shell,.pf-contact-shell{padding:72px clamp(20px,4vw,56px);}" +
      ".pf-heading>div,.pf-paragraph>div,.pf-button>div,.pf-divider>div,.pf-spacer>div{padding:32px clamp(20px,4vw,56px);}" +
      ".page-content h1,.page-content h2,.page-content h3,.page-content p,.page-content figure,.pf-navbar p{margin:0;}" +
      ".pf-hero,.pf-image,.pf-paragraph,.pf-heading,.pf-button,.pf-contact,.pf-footer,.pf-card,.pf-divider,.pf-spacer{display:block;width:100%;margin:0;}" +
      ".pf-heading h2,.pf-hero h1{font-family:Georgia,'Times New Roman',serif;letter-spacing:-.04em;}" +
      ".pf-heading h2{font-size:2.25rem;line-height:1.08;}" +
      ".pf-paragraph p,.pf-card p,.pf-footer p,.pf-contact p{color:#516074;line-height:1.7;}" +
      ".pf-section-dark p,.pf-section-dark .pf-navbar-menu,.pf-section-dark .pf-footer-description,.pf-section-dark .pf-footer-copyright,.pf-section-dark .pf-footer-link{color:inherit;}" +
      ".pf-button>div{text-align:left;}" +
      ".pf-button-link{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 24px;border-radius:999px;background:linear-gradient(135deg,#3f6ff5 0%,#77a4ff 100%);color:#f9fbff;text-decoration:none;font-weight:700;border:0;cursor:pointer;box-shadow:0 14px 30px rgba(63,111,245,.24);transition:transform .2s ease,box-shadow .2s ease,filter .2s ease,background-color .2s ease;}" +
      ".pf-button-link:hover{transform:translateY(-2px);box-shadow:0 18px 36px rgba(63,111,245,.3);filter:saturate(1.05);}" +
      ".pf-button-link:active{transform:translateY(0);box-shadow:0 10px 20px rgba(63,111,245,.22);}" +
      ".pf-image-frame{padding:0;margin:0;border-radius:24px;overflow:hidden;background:#fff;transition:transform .24s ease,box-shadow .24s ease;}" +
      ".pf-image-frame:hover{transform:translateY(-4px);box-shadow:0 20px 40px rgba(15,23,38,.12);}" +
      ".pf-image-media{width:100%;min-height:260px;display:block;object-fit:cover;background:#dbe4f5;}" +
      ".pf-image figcaption{padding:24px clamp(20px,4vw,56px) 28px;color:#5a687c;background:#fff;}" +
      ".pf-hero-shell{display:grid;gap:18px;align-content:center;min-height:72vh;width:100%;margin:0;border-radius:0;background:radial-gradient(circle at top right,rgba(91,140,255,.18),transparent 34%),linear-gradient(145deg,#0f1726 0%,#1c2940 100%);color:#f5f8ff;}" +
      ".pf-hero-badge{display:inline-flex;align-items:center;width:fit-content;padding:8px 14px;border-radius:999px;background:rgba(255,255,255,.08);color:#b8cbff;font-size:.82rem;letter-spacing:.08em;text-transform:uppercase;}" +
      ".pf-hero h1{font-size:3rem;line-height:1.02;}" +
      ".pf-hero-copy{color:#d2dcf0;max-width:58ch;}" +
      ".pf-card-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;align-items:stretch;}" +
      ".pf-card-grid>*{margin:0;}" +
      ".pf-card-shell{display:grid;gap:12px;border-radius:24px;background:linear-gradient(180deg,#fff 0%,#f4f7ff 100%);box-shadow:0 18px 40px rgba(15,23,38,.08);transition:transform .24s ease,box-shadow .24s ease,border-color .24s ease;}" +
      ".pf-card-shell:hover{transform:translateY(-6px);box-shadow:0 26px 48px rgba(15,23,38,.14);}" +
      ".pf-card-shell h3,.pf-contact-shell h3{font-family:Georgia,'Times New Roman',serif;font-size:1.7rem;letter-spacing:-.03em;}" +
      ".pf-card-meta{color:#6c7890;font-size:.92rem;}" +
      ".pf-section-dark .pf-navbar,.pf-section-dark .pf-footer-shell{background:transparent;}" +
      ".pf-navbar{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;width:100%;box-sizing:border-box;border-radius:0;background:#0f1521;color:#f6f9ff;padding:24px 0;}" +
      ".pf-navbar-brand{color:inherit;text-decoration:none;font-weight:700;letter-spacing:.02em;}" +
      ".pf-navbar-toggle{display:none;align-items:center;justify-content:center;min-width:44px;min-height:44px;align-self:center;padding:0;border:1px solid rgba(255,255,255,.12);border-radius:14px;background:rgba(255,255,255,.06);color:inherit;font-size:1.15rem;cursor:pointer;transition:transform .2s ease,background-color .2s ease,border-color .2s ease;}" +
      ".pf-navbar-toggle:hover{transform:translateY(-1px);background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.2);}" +
      ".pf-navbar-toggle:active{transform:translateY(0);}" +
      ".pf-navbar-menu{display:flex;gap:18px;align-items:center;flex-wrap:wrap;margin-left:auto;color:#a7b5cc;font-size:.95rem;}" +
      ".pf-navbar-menu a{color:inherit;text-decoration:none;transition:color .2s ease,opacity .2s ease,transform .2s ease;}" +
      ".pf-navbar-menu a:hover{color:#fff;opacity:1;transform:translateY(-1px);}" +
      ".pf-navbar-menu a:active{transform:translateY(0);}" +
      ".pf-navbar-cta{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:0 18px;border-radius:999px;background:linear-gradient(135deg,#3f6ff5 0%,#77a4ff 100%);color:#f9fbff;font-weight:700;}" +
      ".pf-section-dark .pf-navbar-brand,.pf-section-dark .pf-navbar-menu,.pf-section-dark .pf-navbar-menu a:not(.pf-navbar-cta),.pf-section-dark .pf-navbar-toggle{color:#eef4ff !important;}" +
      ".pf-section-dark .pf-navbar-menu{color:#c8d4ea !important;}" +
      ".pf-section-dark .pf-navbar-menu a:hover:not(.pf-navbar-cta),.pf-section-dark .pf-navbar-brand:hover{color:#fff !important;}" +
      ".pf-footer-shell{display:grid;gap:12px;border-radius:0;background:#0f1521;color:#eaf0fb;}" +
      ".pf-footer-shell p,.pf-footer-description,.pf-footer-copyright{color:#9eb0ca;}" +
      ".pf-footer-links{display:flex;flex-wrap:wrap;gap:14px 18px;}" +
      ".pf-footer-link{color:#9eb0ca;text-decoration:none;transition:color .2s ease,opacity .2s ease;}" +
      ".pf-footer-link:hover{color:#fff;opacity:1;}" +
      ".pf-contact-shell{display:grid;gap:16px;border-radius:0;background:linear-gradient(180deg,#fff 0%,#f5f8ff 100%);}" +
      ".pf-form-grid{display:grid;gap:12px;}" +
      ".pf-form-grid input,.pf-form-grid textarea{width:100%;border:1px solid rgba(23,32,44,.12);border-radius:14px;padding:14px 16px;background:#fff;color:#17202c;font:inherit;}" +
      ".pf-form-grid textarea{min-height:120px;resize:vertical;}" +
      ".pf-form-note{margin:0;color:#6b7a8f;font-size:.92rem;line-height:1.6;}" +
      ".pf-form-status{margin:0;padding:12px 14px;border-radius:14px;background:rgba(66,199,138,.12);color:#1d6b47;font-size:.92rem;line-height:1.5;}" +
      ".pf-divider-line{width:100%;border:0;border-top:2px solid rgba(17,25,40,.14);margin:0;}" +
      ".pf-spacer-fill{min-height:72px;display:grid;place-items:center;border-radius:16px;border:1px dashed rgba(17,25,40,.18);background:#eff4ff;color:#76839a;}" +
      "@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto;}body.has-export-motion .pf-section-reveal{opacity:1;transform:none;transition:none;}.pf-button-link,.pf-card-shell,.pf-image-frame,.pf-navbar-menu a,.pf-footer-link,.pf-navbar-toggle{transition:none;}.pf-button-link:hover,.pf-card-shell:hover,.pf-image-frame:hover,.pf-navbar-menu a:hover,.pf-navbar-toggle:hover{transform:none;}}" +
      "@media (max-width:980px){.pf-card-grid{grid-template-columns:repeat(2,1fr);}}" +
      "@media (max-width:760px){.pf-container{width:min(1120px,calc(100% - 36px));}.pf-container>* + *{margin-top:18px;}.pf-heading>div,.pf-paragraph>div,.pf-button>div,.pf-divider>div,.pf-spacer>div,.pf-hero-shell,.pf-card-shell,.pf-footer-shell,.pf-contact-shell{padding:56px 18px;}.pf-heading>div,.pf-paragraph>div,.pf-button>div,.pf-divider>div,.pf-spacer>div{padding:24px 18px;}.pf-navbar{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;padding:20px 0;}.pf-navbar-toggle{display:inline-flex;margin-left:auto;}.pf-navbar-menu{display:none;flex-direction:column;align-items:flex-start;gap:12px;width:100%;margin-top:16px;margin-left:0;}.pf-navbar.is-menu-open .pf-navbar-menu,.pf-navbar.is-open .pf-navbar-menu{display:flex;}.pf-navbar-menu a,.pf-navbar-cta{width:100%;}.pf-hero-shell{min-height:60vh;}.pf-card-grid{grid-template-columns:1fr;gap:18px;}.pf-hero h1{font-size:2.35rem;}}" 
    );
  }

  function getExportScript() {
    return (
      "var prefersReducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;" +
      "function syncNavbars(shouldCloseMenus){" +
        "document.querySelectorAll('.pf-navbar').forEach(function(navbar){" +
          "var toggle=navbar.querySelector('.pf-navbar-toggle');" +
          "var isOpen;" +
          "if(!toggle){return;}" +
          "if(shouldCloseMenus){navbar.classList.remove('is-menu-open');navbar.classList.remove('is-open');}" +
          "isOpen=navbar.classList.contains('is-menu-open')||navbar.classList.contains('is-open');" +
          "toggle.setAttribute('aria-expanded',isOpen?'true':'false');" +
          "toggle.setAttribute('aria-haspopup','true');" +
        "});" +
      "}" +
      "function setNavbarMenuState(navbar,shouldOpen){" +
        "var toggle;" +
        "if(!navbar){return;}" +
        "toggle=navbar.querySelector('.pf-navbar-toggle');" +
        "navbar.classList.toggle('is-menu-open',!!shouldOpen);" +
        "navbar.classList.toggle('is-open',!!shouldOpen);" +
        "if(toggle){" +
          "toggle.setAttribute('aria-expanded',shouldOpen?'true':'false');" +
          "toggle.setAttribute('aria-haspopup','true');" +
        "}" +
      "}" +
      "function initSectionReveal(){" +
        "var sections=document.querySelectorAll('.pf-section-reveal');" +
        "if(prefersReducedMotion){sections.forEach(function(section){section.classList.add('is-visible');});return;}" +
        "document.body.classList.add('has-export-motion');" +
        "if(!('IntersectionObserver' in window)){sections.forEach(function(section,index){window.setTimeout(function(){section.classList.add('is-visible');},index*70);});return;}" +
        "var observer=new IntersectionObserver(function(entries){" +
          "entries.forEach(function(entry){" +
            "if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}" +
          "});" +
        "},{threshold:.16,rootMargin:'0px 0px -40px 0px'});" +
        "sections.forEach(function(section,index){" +
          "if(index===0){section.classList.add('is-visible');}" +
          "observer.observe(section);" +
        "});" +
      "}" +
      "function handleSmoothScroll(event){" +
        "var link=event.target.closest('a[href^=\"#\"]');" +
        "var targetId;" +
        "var target;" +
        "if(!link){return;}" +
        "targetId=link.getAttribute('href');" +
        "if(!targetId||targetId==='#'){return;}" +
        "target=document.querySelector(targetId);" +
        "if(!target){return;}" +
        "event.preventDefault();" +
        "target.scrollIntoView({behavior:prefersReducedMotion?'auto':'smooth',block:'start'});" +
        "if(window.history&&window.history.pushState){window.history.pushState(null,'',targetId);}" +
        "if(window.matchMedia('(max-width: 760px)').matches){" +
          "var nav=link.closest('.pf-navbar');" +
          "if(nav){setNavbarMenuState(nav,false);}" +
        "}" +
      "}" +
      "function initForms(){" +
        "document.querySelectorAll('.pf-form-grid').forEach(function(form){" +
          "form.addEventListener('submit',function(event){" +
            "var status=form.querySelector('.pf-form-status');" +
            "event.preventDefault();" +
            "if(status){status.remove();}" +
            "status=document.createElement('p');" +
            "status.className='pf-form-status';" +
            "status.textContent='Thanks for your message. This exported demo is frontend-only, so no data was sent.';" +
            "form.appendChild(status);" +
          "});" +
        "});" +
      "}" +
      "syncNavbars(true);" +
      "initSectionReveal();" +
      "document.addEventListener('click',function(event){" +
        "var toggle=event.target.closest('.pf-navbar-toggle');" +
        "var menuLink=event.target.closest('.pf-navbar-menu a');" +
        "if(toggle){" +
          "event.preventDefault();" +
          "setNavbarMenuState(toggle.closest('.pf-navbar'),!(toggle.closest('.pf-navbar').classList.contains('is-menu-open')||toggle.closest('.pf-navbar').classList.contains('is-open')));" +
        "}else{" +
          "handleSmoothScroll(event);" +
          "if(menuLink&&window.matchMedia('(max-width: 760px)').matches){" +
            "setNavbarMenuState(menuLink.closest('.pf-navbar'),false);" +
          "}" +
        "}" +
      "});" +
      "window.addEventListener('resize',function(){" +
        "if(!window.matchMedia('(max-width: 760px)').matches){syncNavbars(true);}" +
      "});" +
      "initForms();"
    );
  }

  function createExportMarkup(projectName, canvas) {
    var safeProjectName = escapeHtml(projectName || "My Website");
    var exportWrapper = cloneCleanCanvasContent(canvas);

    // Build a complete standalone document so the export can be opened offline
    // by double-clicking the downloaded HTML file.
    return (
      "<!DOCTYPE html>" +
      '<html lang="en">' +
      "<head>" +
      '<meta charset="UTF-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
      "<title>" + safeProjectName + "</title>" +
      "<style>" + getExportStyles() + "</style>" +
      "</head>" +
      "<body>" +
      exportWrapper.outerHTML +
      "<script>" + getExportScript() + "</script>" +
      "</body>" +
      "</html>"
    );
  }

  function downloadHtml(projectName, html) {
    var blob = new Blob([html], { type: "text/html;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");

    // Blob URLs let us generate a full HTML file in the browser and download it
    // without any server or build tooling.
    link.href = url;
    link.download = "my-website.html";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  PageForge.exporter = {
    createExportMarkup: createExportMarkup,
    downloadHtml: downloadHtml
  };
})(window.PageForge);
