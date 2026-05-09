window.PageForge = window.PageForge || {};

(function setupEditor(PageForge) {
  var BLOCK_TEXT_SELECTORS = {
    hero: "[data-field='primary'], h1, p",
    card: "[data-field='primary'], h3, p",
    navbar: "[data-field='primary'], .pf-navbar-brand",
    footer: "[data-field='primary'], strong, p",
    contact: "[data-field='primary'], h3, p",
    "contact-form": "[data-field='primary'], h3, p"
  };

  var BLOCKS_USING_GROUP_STYLE_TARGET = {
    hero: true,
    card: true,
    navbar: true,
    footer: true,
    contact: true,
    "contact-form": true
  };

  var TYPE_CONTROL_VISIBILITY = {
    heading: { heading: true },
    paragraph: { paragraph: true },
    button: { buttonElement: true },
    image: { imageElement: true },
    hero: { hero: true },
    card: { card: true },
    navbar: { navbar: true },
    footer: { footer: true },
    contact: { contactForm: true },
    "contact-form": { contactForm: true },
    divider: { divider: true },
    spacer: { spacer: true }
  };

  function closestBlock(element) {
    return element ? element.closest(".editable-element, .pf-block") : null;
  }

  function normalizeColor(colorValue, fallback) {
    if (!colorValue || colorValue === "transparent" || colorValue === "rgba(0, 0, 0, 0)") {
      return fallback || "#ffffff";
    }

    var temporary = document.createElement("div");
    temporary.style.color = colorValue;
    document.body.appendChild(temporary);

    var computed = getComputedStyle(temporary).color;
    temporary.remove();

    var rgb = computed.match(/\d+/g);

    if (!rgb || rgb.length < 3) {
      return fallback || "#ffffff";
    }

    return (
      "#" +
      rgb
        .slice(0, 3)
        .map(function mapChannel(value) {
          return Number(value).toString(16).padStart(2, "0");
        })
        .join("")
    );
  }

  function createUniqueBlockId() {
    return "pf-" + Date.now() + "-" + Math.random().toString(16).slice(2, 8);
  }

  function createEditor(options) {
    var canvas = options.canvas;
    var form = options.form;
    var helperText = options.helperText;
    var blockTypeField = options.blockTypeField;
    var textContentInput = options.textContentInput;
    var fontSizeInput = options.fontSizeInput;
    var textColorInput = options.textColorInput;
    var backgroundColorInput = options.backgroundColorInput;
    var paddingInput = options.paddingInput;
    var marginInput = options.marginInput;
    var radiusInput = options.radiusInput;
    var widthInput = options.widthInput;
    var heightInput = options.heightInput;
    var alignInput = options.alignInput;
    var linkInput = options.linkInput;
    var headingTextInput = options.headingTextInput;
    var headingTagInput = options.headingTagInput;
    var headingLinkUrlInput = options.headingLinkUrlInput;
    var headingFontSizeInput = options.headingFontSizeInput;
    var headingFontWeightInput = options.headingFontWeightInput;
    var headingTextColorInput = options.headingTextColorInput;
    var headingAlignInput = options.headingAlignInput;
    var headingLineHeightInput = options.headingLineHeightInput;
    var headingLetterSpacingInput = options.headingLetterSpacingInput;
    var headingMarginInput = options.headingMarginInput;
    var headingPaddingInput = options.headingPaddingInput;
    var paragraphTextInput = options.paragraphTextInput;
    var paragraphFontSizeInput = options.paragraphFontSizeInput;
    var paragraphFontWeightInput = options.paragraphFontWeightInput;
    var paragraphTextColorInput = options.paragraphTextColorInput;
    var paragraphAlignInput = options.paragraphAlignInput;
    var paragraphLineHeightInput = options.paragraphLineHeightInput;
    var paragraphLetterSpacingInput = options.paragraphLetterSpacingInput;
    var paragraphMaxWidthInput = options.paragraphMaxWidthInput;
    var paragraphMarginInput = options.paragraphMarginInput;
    var paragraphPaddingInput = options.paragraphPaddingInput;
    var footerBrandTextInput = options.footerBrandTextInput;
    var footerDescriptionTextInput = options.footerDescriptionTextInput;
    var footerCopyrightTextInput = options.footerCopyrightTextInput;
    var footerLink1TextInput = options.footerLink1TextInput;
    var footerLink1UrlInput = options.footerLink1UrlInput;
    var footerLink2TextInput = options.footerLink2TextInput;
    var footerLink2UrlInput = options.footerLink2UrlInput;
    var footerLink3TextInput = options.footerLink3TextInput;
    var footerLink3UrlInput = options.footerLink3UrlInput;
    var footerBackgroundColorInput = options.footerBackgroundColorInput;
    var footerTextColorInput = options.footerTextColorInput;
    var footerLinkColorInput = options.footerLinkColorInput;
    var footerPaddingInput = options.footerPaddingInput;
    var footerRadiusInput = options.footerRadiusInput;
    var footerAlignInput = options.footerAlignInput;
    var buttonElementTextInput = options.buttonElementTextInput;
    var buttonElementUrlInput = options.buttonElementUrlInput;
    var buttonOpenInNewTabInput = options.buttonOpenInNewTabInput;
    var buttonBackgroundColorInput = options.buttonBackgroundColorInput;
    var buttonTextColorInput = options.buttonTextColorInput;
    var buttonPaddingSpecialInput = options.buttonPaddingSpecialInput;
    var buttonRadiusSpecialInput = options.buttonRadiusSpecialInput;
    var buttonWidthSpecialInput = options.buttonWidthSpecialInput;
    var buttonAlignSpecialInput = options.buttonAlignSpecialInput;
    var imageUrlInput = options.imageUrlInput;
    var imageElementUrlInput = options.imageElementUrlInput;
    var imageAltTextInput = options.imageAltTextInput;
    var imageCaptionTextInput = options.imageCaptionTextInput;
    var imageWidthInput = options.imageWidthInput;
    var imageHeightSpecialInput = options.imageHeightSpecialInput;
    var imageObjectFitInput = options.imageObjectFitInput;
    var imageRadiusSpecialInput = options.imageRadiusSpecialInput;
    var heroBadgeTextInput = options.heroBadgeTextInput;
    var heroHeadingTextInput = options.heroHeadingTextInput;
    var heroParagraphTextInput = options.heroParagraphTextInput;
    var heroButtonTextInput = options.heroButtonTextInput;
    var heroButtonUrlInput = options.heroButtonUrlInput;
    var heroBackgroundColorInput = options.heroBackgroundColorInput;
    var heroHeadingColorInput = options.heroHeadingColorInput;
    var heroParagraphColorInput = options.heroParagraphColorInput;
    var heroButtonBackgroundColorInput = options.heroButtonBackgroundColorInput;
    var heroButtonTextColorInput = options.heroButtonTextColorInput;
    var heroAlignInput = options.heroAlignInput;
    var cardLabelTextInput = options.cardLabelTextInput;
    var cardTitleTextInput = options.cardTitleTextInput;
    var cardDescriptionTextInput = options.cardDescriptionTextInput;
    var cardButtonTextInput = options.cardButtonTextInput;
    var cardButtonUrlInput = options.cardButtonUrlInput;
    var cardBackgroundColorInput = options.cardBackgroundColorInput;
    var cardTitleColorInput = options.cardTitleColorInput;
    var cardTextColorInput = options.cardTextColorInput;
    var cardButtonBackgroundColorInput = options.cardButtonBackgroundColorInput;
    var cardRadiusInput = options.cardRadiusInput;
    var cardPaddingInput = options.cardPaddingInput;
    var navbarBrandTextInput = options.navbarBrandTextInput;
    var navbarBrandUrlInput = options.navbarBrandUrlInput;
    var navbarLink1TextInput = options.navbarLink1TextInput;
    var navbarLink1UrlInput = options.navbarLink1UrlInput;
    var navbarLink2TextInput = options.navbarLink2TextInput;
    var navbarLink2UrlInput = options.navbarLink2UrlInput;
    var navbarLink3TextInput = options.navbarLink3TextInput;
    var navbarLink3UrlInput = options.navbarLink3UrlInput;
    var navbarLink4TextInput = options.navbarLink4TextInput;
    var navbarLink4UrlInput = options.navbarLink4UrlInput;
    var navbarCtaTextInput = options.navbarCtaTextInput;
    var navbarCtaUrlInput = options.navbarCtaUrlInput;
    var navbarBackgroundColorInput = options.navbarBackgroundColorInput;
    var navbarLinkColorInput = options.navbarLinkColorInput;
    var navbarCtaBackgroundColorInput = options.navbarCtaBackgroundColorInput;
    var navbarCtaTextColorInput = options.navbarCtaTextColorInput;
    var contactFormTitleInput = options.contactFormTitleInput;
    var contactFormDescriptionInput = options.contactFormDescriptionInput;
    var contactFormNamePlaceholderInput = options.contactFormNamePlaceholderInput;
    var contactFormEmailPlaceholderInput = options.contactFormEmailPlaceholderInput;
    var contactFormMessagePlaceholderInput = options.contactFormMessagePlaceholderInput;
    var contactFormButtonTextInput = options.contactFormButtonTextInput;
    var contactFormBackgroundColorInput = options.contactFormBackgroundColorInput;
    var contactFormInputBackgroundColorInput = options.contactFormInputBackgroundColorInput;
    var contactFormInputTextColorInput = options.contactFormInputTextColorInput;
    var contactFormButtonBackgroundColorInput = options.contactFormButtonBackgroundColorInput;
    var contactFormButtonTextColorInput = options.contactFormButtonTextColorInput;
    var contactFormBorderRadiusInput = options.contactFormBorderRadiusInput;
    var contactFormPaddingInput = options.contactFormPaddingInput;
    var contactFormWidthInput = options.contactFormWidthInput;
    var dividerWidthInput = options.dividerWidthInput;
    var dividerHeightInput = options.dividerHeightInput;
    var dividerColorInput = options.dividerColorInput;
    var dividerStyleInput = options.dividerStyleInput;
    var dividerMarginTopInput = options.dividerMarginTopInput;
    var dividerMarginBottomInput = options.dividerMarginBottomInput;
    var dividerAlignInput = options.dividerAlignInput;
    var spacerHeightInput = options.spacerHeightInput;
    var spacerBackgroundColorInput = options.spacerBackgroundColorInput;
    var spacerRadiusInput = options.spacerRadiusInput;
    var spacerMarginTopInput = options.spacerMarginTopInput;
    var spacerMarginBottomInput = options.spacerMarginBottomInput;
    var deleteButton = options.deleteButton;
    var duplicateButton = options.duplicateButton;
    var moveUpButton = options.moveUpButton;
    var moveDownButton = options.moveDownButton;
    var onChange = options.onChange || function noop() {};
    var onStructureChange = options.onStructureChange || onChange;

    var selectedBlock = null;
    var customControlGroups = {
      text: form.querySelector('[data-editor-control="text"]'),
      align: form.querySelector('[data-editor-control="align"]'),
      link: form.querySelector('[data-editor-control="link"]'),
      heading: form.querySelector('[data-editor-control="heading"]'),
      paragraph: form.querySelector('[data-editor-control="paragraph"]'),
      footer: form.querySelector('[data-editor-control="footer"]'),
      buttonElement: form.querySelector('[data-editor-control="button-element"]'),
      image: form.querySelector('[data-editor-control="image"]'),
      imageElement: form.querySelector('[data-editor-control="image-element"]'),
      hero: form.querySelector('[data-editor-control="hero"]'),
      card: form.querySelector('[data-editor-control="card"]'),
      navbar: form.querySelector('[data-editor-control="navbar"]'),
      contactForm: form.querySelector('[data-editor-control="contact-form"]'),
      divider: form.querySelector('[data-editor-control="divider"]'),
      spacer: form.querySelector('[data-editor-control="spacer"]')
    };
    var sharedFieldGroups = {
      fontSize: fontSizeInput ? fontSizeInput.closest(".field-group") : null,
      textColor: textColorInput ? textColorInput.closest(".field-group") : null,
      backgroundColor: backgroundColorInput ? backgroundColorInput.closest(".field-group") : null,
      padding: paddingInput ? paddingInput.closest(".field-group") : null,
      margin: marginInput ? marginInput.closest(".field-group") : null,
      radius: radiusInput ? radiusInput.closest(".field-group") : null,
      width: widthInput ? widthInput.closest(".field-group") : null,
      height: heightInput ? heightInput.closest(".field-group") : null
    };
    var navbarLink4Row = navbarLink4TextInput ? navbarLink4TextInput.closest(".field-row") : null;

    function getBlockType(block) {
      return block ? block.dataset.blockType || block.dataset.type || "" : "";
    }

    function getPrimaryField(block) {
      var blockType = getBlockType(block);
      var selector = BLOCK_TEXT_SELECTORS[blockType];

      if (selector) {
        return block.querySelector(selector);
      }

      return block ? block.querySelector("[data-field='primary']") : null;
    }

    function getLinkField(block) {
      return block ? block.querySelector("[data-link-field]") : null;
    }

    function getHeadingField(block) {
      if (!block || getBlockType(block) !== "heading") {
        return null;
      }

      return block.querySelector("[data-field='primary'], h1, h2, h3, h4");
    }

    function getHeadingLink(block) {
      var heading = getHeadingField(block);
      var link;

      if (!heading) {
        return null;
      }

      link = heading.closest("a");
      return link && block.contains(link) ? link : null;
    }

    function getParagraphField(block) {
      if (!block || getBlockType(block) !== "paragraph") {
        return null;
      }

      return block.querySelector("[data-field='primary'], p");
    }

    function getFooterField(block, role) {
      if (!block || getBlockType(block) !== "footer") {
        return null;
      }

      if (role === "brand") {
        return block.querySelector('[data-footer-role="brand"], [data-field="primary"], strong');
      }

      if (role === "description") {
        return block.querySelector('[data-footer-role="description"], .pf-footer-description');
      }

      if (role === "copyright") {
        return block.querySelector('[data-footer-role="copyright"], .pf-footer-copyright');
      }

      if (role === "link-1" || role === "link-2" || role === "link-3") {
        return block.querySelector('[data-footer-role="' + role + '"]');
      }

      return null;
    }

    function replaceHeadingTag(block, tagName) {
      var heading = getHeadingField(block);
      var nextHeading;

      if (!heading || !/^h[1-4]$/i.test(tagName) || heading.tagName.toLowerCase() === tagName.toLowerCase()) {
        return heading;
      }

      nextHeading = document.createElement(tagName.toLowerCase());
      Array.from(heading.attributes).forEach(function copyAttribute(attribute) {
        nextHeading.setAttribute(attribute.name, attribute.value);
      });
      nextHeading.innerHTML = heading.innerHTML;
      heading.replaceWith(nextHeading);
      return nextHeading;
    }

    function setHeadingLink(block, href) {
      var heading = getHeadingField(block);
      var existingLink = getHeadingLink(block);
      var nextLink;

      if (!heading) {
        return;
      }

      if (href) {
        if (!existingLink) {
          nextLink = document.createElement("a");
          nextLink.className = "pf-heading-link";
          nextLink.setAttribute("data-link-field", "href");
          nextLink.style.color = "inherit";
          nextLink.style.textDecoration = "none";
          nextLink.style.display = "inline-block";
          heading.replaceWith(nextLink);
          nextLink.appendChild(heading);
          existingLink = nextLink;
        }

        existingLink.setAttribute("href", href);
        return;
      }

      if (existingLink) {
        existingLink.replaceWith(heading);
      }
    }

    function getNavbarField(block, role) {
      return block ? block.querySelector('[data-navbar-role="' + role + '"]') : null;
    }

    function getHeroField(block, role) {
      if (!block) {
        return null;
      }

      if (role === "badge") {
        return block.querySelector(".pf-hero-badge");
      }

      if (role === "heading") {
        return block.querySelector("[data-field='primary'], .pf-hero-shell h1, h1");
      }

      if (role === "paragraph") {
        return block.querySelector(".pf-hero-copy");
      }

      if (role === "button") {
        return block.querySelector(".pf-button-link");
      }

      return null;
    }

    function getCardField(block, role) {
      if (!block) {
        return null;
      }

      if (role === "label") {
        return block.querySelector(".pf-card-meta");
      }

      if (role === "title") {
        return block.querySelector("[data-field='primary'], .pf-card-shell h3, h3");
      }

      if (role === "description") {
        return block.querySelector(".pf-card-shell p:not(.pf-card-meta)");
      }

      if (role === "button") {
        return block.querySelector(".pf-button-link");
      }

      return null;
    }

    function isContactBlockType(type) {
      return type === "contact" || type === "contact-form";
    }

    function getContactField(block, role) {
      var contactForm;

      if (!block || !isContactBlockType(getBlockType(block))) {
        return null;
      }

      contactForm = block.querySelector('[data-contact-role="form"], .pf-form-grid');

      if (role === "title") {
        return block.querySelector('[data-contact-role="title"], [data-field="primary"], .pf-contact-shell h3, h3');
      }

      if (role === "description") {
        return (
          block.querySelector('[data-contact-role="description"]') ||
          block.querySelector(".pf-contact-shell > p")
        );
      }

      if (role === "form") {
        return contactForm;
      }

      if (role === "name") {
        return (
          block.querySelector('[data-contact-role="name"]') ||
          block.querySelector('.pf-form-grid input[type="text"]')
        );
      }

      if (role === "email") {
        return (
          block.querySelector('[data-contact-role="email"]') ||
          block.querySelector('.pf-form-grid input[type="email"]')
        );
      }

      if (role === "message") {
        return block.querySelector('[data-contact-role="message"], .pf-form-grid textarea');
      }

      if (role === "button") {
        return (
          block.querySelector('[data-contact-role="button"]') ||
          (contactForm ? contactForm.querySelector("button") : null)
        );
      }

      return null;
    }

    function getNavbarElement(block) {
      var directNavbar;

      if (!block) {
        return null;
      }

      if (block.matches && block.matches("nav.pf-navbar")) {
        return block;
      }

      directNavbar = Array.from(block.children || []).find(function findDirectNavbar(child) {
        return child.matches && child.matches("nav.pf-navbar");
      });

      return directNavbar || block.querySelector("nav.pf-navbar");
    }

    function getNavbarContentChildren(navbar) {
      if (!navbar) {
        return [];
      }

      return Array.from(navbar.children);
    }

    function hasCanonicalNavbarStructure(block) {
      var navbar;
      var contentChildren;
      var menuChildren;
      var wrapperChildren;

      if (!block || getBlockType(block) !== "navbar") {
        return false;
      }

      navbar = getNavbarElement(block);

      if (!navbar || block === navbar) {
        return false;
      }

      wrapperChildren = Array.from(block.children);

      if (
        wrapperChildren.length !== 2 ||
        !wrapperChildren[0].matches(".element-header") ||
        wrapperChildren[1] !== navbar
      ) {
        return false;
      }

      contentChildren = getNavbarContentChildren(navbar);

      if (contentChildren.length !== 3) {
        return false;
      }

      if (
        !contentChildren[0].matches("a.pf-navbar-brand") ||
        !contentChildren[1].matches("button.pf-navbar-toggle") ||
        !contentChildren[2].matches("div.pf-navbar-menu")
      ) {
        return false;
      }

      if (!getNavbarField(block, "brand") || !getNavbarField(block, "cta")) {
        return false;
      }

      menuChildren = Array.from(contentChildren[2].children);

      if (menuChildren.length < 4) {
        return false;
      }

      return menuChildren.every(function isAnchor(link) {
        return link.matches("a");
      });
    }

    function ensureNavbarStructure(block) {
      var replacement;
      var replacementNavbar;
      var styleSource;
      var blockStyleSource;
      var brandSource;
      var ctaSource;
      var menuSources;
      var defaults;
      var menuItems;
      var brandText;
      var brandHref;
      var ctaText;
      var ctaHref;
      var menuMarkup;
      var menuItemCount;

      if (!block || getBlockType(block) !== "navbar") {
        return block;
      }

      if (hasCanonicalNavbarStructure(block)) {
        return block;
      }

      styleSource = getNavbarElement(block) || block.querySelector(".pf-navbar-shell, .pf-edit-surface") || block;
      blockStyleSource = block.getAttribute("style") || "";
      brandSource =
        getNavbarField(block, "brand") ||
        block.querySelector(".pf-navbar-brand-link") ||
        block.querySelector(".pf-navbar-brand a") ||
        block.querySelector(".pf-navbar-brand");
      ctaSource = getNavbarField(block, "cta") || block.querySelector(".pf-navbar-cta");
      menuSources = Array.from(
        block.querySelectorAll(".pf-navbar-links a, .pf-navbar-menu a, nav > a, .pf-navbar a")
      ).filter(function excludeBrandAndCta(link) {
        return link !== brandSource && link !== ctaSource && !link.classList.contains("pf-navbar-cta");
      });
      defaults = [
        { text: "Features", href: "#features" },
        { text: "Materials", href: "#materials" },
        { text: "Reviews", href: "#reviews" },
        { text: "Contact", href: "#contact" }
      ];

      brandText = brandSource ? brandSource.textContent.trim() : "Lumio One";
      brandHref = brandSource ? brandSource.getAttribute("href") || "#" : "#";
      ctaText = ctaSource ? ctaSource.textContent.trim() : "Buy";
      ctaHref = ctaSource ? ctaSource.getAttribute("href") || "#buy" : "#buy";
      menuItemCount = Math.max(3, Math.min(menuSources.length, 4));
      menuItems = defaults.slice(0, menuItemCount).map(function mapMenuItem(item, index) {
        var source = menuSources[index];

        return {
          text: source ? source.textContent.trim() : item.text,
          href: source ? source.getAttribute("href") || item.href : item.href,
          style: source ? source.getAttribute("style") || "" : ""
        };
      });

      replacement = document.createElement("div");
      replacement.className = "editable-element";
      replacement.dataset.type = "navbar";
      replacement.dataset.blockType = "navbar";
      replacement.dataset.id = block.dataset.id || createUniqueBlockId();
      replacement.dataset.blockId = block.dataset.blockId || replacement.dataset.id;
      replacement.setAttribute("draggable", "true");

      if (block.classList.contains("selected") || block.classList.contains("is-selected")) {
        replacement.classList.add("selected", "is-selected");
      }

      if (block !== styleSource && blockStyleSource) {
        replacement.setAttribute("style", blockStyleSource);
      } else if (block.style && block.style.margin) {
        replacement.style.margin = block.style.margin;
      }

      replacement.innerHTML = '<div class="element-header"><span>Navbar</span><span>Drag to reorder</span></div>';
      replacementNavbar = document.createElement("nav");
      replacementNavbar.className = "pf-navbar";

      if (styleSource && styleSource.getAttribute("style")) {
        replacementNavbar.setAttribute("style", styleSource.getAttribute("style"));
      }

      if (block === styleSource && block.style && block.style.margin) {
        replacementNavbar.style.margin = "";
      }

      menuMarkup = menuItems
        .map(function createMenuLink(item, index) {
          return (
            '<a data-navbar-role="link-' +
            (index + 1) +
            '" href="' +
            (item.href || "#") +
            '"' +
            (item.style ? ' style="' + item.style + '"' : "") +
            ">" +
            item.text +
            "</a>"
          );
        })
        .join("");

      replacementNavbar.insertAdjacentHTML(
        "beforeend",
        '<a class="pf-navbar-brand" data-field="primary" data-navbar-role="brand" href="' +
          brandHref +
          '"' +
          (brandSource && brandSource.getAttribute("style") ? ' style="' + brandSource.getAttribute("style") + '"' : "") +
          ">" +
          brandText +
          "</a>" +
          '<button class="pf-navbar-toggle" aria-label="Toggle navigation">☰</button>' +
          '<div class="pf-navbar-menu">' +
            menuMarkup +
            '<a class="pf-navbar-cta" data-navbar-role="cta" href="' +
            ctaHref +
            '"' +
            (ctaSource && ctaSource.getAttribute("style") ? ' style="' + ctaSource.getAttribute("style") + '"' : "") +
            ">" +
            ctaText +
            "</a>" +
          "</div>"
      );
      replacement.appendChild(replacementNavbar);

      block.replaceWith(replacement);
      return replacement;
    }

    function hasCanonicalFooterStructure(block) {
      var footerShell;
      var footerLinks;

      if (!block || getBlockType(block) !== "footer") {
        return false;
      }

      footerShell = block.querySelector("footer.pf-footer-shell");
      footerLinks = block.querySelector(".pf-footer-links");

      return Boolean(
        footerShell &&
          getFooterField(block, "brand") &&
          getFooterField(block, "description") &&
          getFooterField(block, "copyright") &&
          footerLinks &&
          getFooterField(block, "link-1") &&
          getFooterField(block, "link-2") &&
          getFooterField(block, "link-3")
      );
    }

    function ensureFooterStructure(block) {
      var footerShell;
      var shellStyle;
      var brandSource;
      var descriptionSource;
      var copyrightSource;
      var paragraphs;
      var linkSources;
      var defaults;
      var brandText;
      var descriptionText;
      var copyrightText;
      var existingHandle;

      if (!block || getBlockType(block) !== "footer") {
        return block;
      }

      if (hasCanonicalFooterStructure(block)) {
        return block;
      }

      footerShell = block.querySelector("footer.pf-footer-shell, footer.pf-edit-surface, footer, .pf-footer-shell, .pf-edit-surface") || block;
      shellStyle = footerShell && footerShell.getAttribute ? footerShell.getAttribute("style") || "text-align: left;" : "text-align: left;";
      brandSource = getFooterField(block, "brand") || block.querySelector("strong");
      paragraphs = Array.from(block.querySelectorAll("p"));
      descriptionSource =
        getFooterField(block, "description") ||
        paragraphs.find(function findDescription(paragraph) {
          return !/copyright|all rights/i.test(paragraph.textContent || "");
        });
      copyrightSource =
        getFooterField(block, "copyright") ||
        paragraphs.find(function findCopyright(paragraph) {
          return /copyright|all rights/i.test(paragraph.textContent || "");
        });
      linkSources = Array.from(block.querySelectorAll(".pf-footer-links a, a[data-footer-role], footer a"));
      defaults = [
        { role: "link-1", text: "About", href: "#about" },
        { role: "link-2", text: "Privacy", href: "#privacy" },
        { role: "link-3", text: "Contact", href: "#contact" }
      ];

      brandText = brandSource ? brandSource.textContent.trim() : "PageForge Studio";
      descriptionText = descriptionSource
        ? descriptionSource.textContent.trim()
        : "Build offline. Export cleanly. Publish anywhere.";
      copyrightText = copyrightSource
        ? copyrightSource.textContent.trim()
        : "Copyright 2026 PageForge Studio. All rights reserved.";
      existingHandle = block.querySelector(".pf-block__handle");

      Array.from(block.children).forEach(function removeFooterChildren(child) {
        if (child !== existingHandle) {
          child.remove();
        }
      });

      footerShell = document.createElement("footer");
      footerShell.className = "pf-footer-shell pf-edit-surface";
      footerShell.setAttribute("style", shellStyle);
      footerShell.innerHTML =
        '<strong data-field="primary" data-footer-role="brand">' +
        brandText +
        "</strong>" +
        '<p class="pf-footer-description" data-footer-role="description">' +
        descriptionText +
        "</p>" +
        '<div class="pf-footer-links">' +
        defaults
          .map(function mapFooterLink(item, index) {
            var source = linkSources[index];
            var sourceStyle = source ? source.getAttribute("style") || "" : "";

            return (
              '<a class="pf-footer-link" data-footer-role="' +
              item.role +
              '" href="' +
              (source ? source.getAttribute("href") || item.href : item.href) +
              '"' +
              (sourceStyle ? ' style="' + sourceStyle + '"' : "") +
              ">" +
              (source ? source.textContent.trim() : item.text) +
              "</a>"
            );
          })
          .join("") +
        "</div>" +
        '<p class="pf-footer-copyright" data-footer-role="copyright">' +
        copyrightText +
        "</p>";

      if (brandSource && brandSource.getAttribute("style")) {
        footerShell.querySelector('[data-footer-role="brand"]').setAttribute("style", brandSource.getAttribute("style"));
      }

      if (descriptionSource && descriptionSource.getAttribute("style")) {
        footerShell
          .querySelector('[data-footer-role="description"]')
          .setAttribute("style", descriptionSource.getAttribute("style"));
      }

      if (copyrightSource && copyrightSource.getAttribute("style")) {
        footerShell
          .querySelector('[data-footer-role="copyright"]')
          .setAttribute("style", copyrightSource.getAttribute("style"));
      }

      block.appendChild(footerShell);
      return block;
    }

    function ensureContactFormStructure(block) {
      var shell;
      var titleField;
      var descriptionField;
      var formField;
      var nameField;
      var emailField;
      var messageField;
      var buttonField;

      if (!block || !isContactBlockType(getBlockType(block))) {
        return block;
      }

      block.dataset.blockType = "contact-form";
      block.dataset.type = "contact-form";
      shell = getStyleTarget(block);

      titleField = getContactField(block, "title");
      descriptionField = getContactField(block, "description");
      formField = getContactField(block, "form");
      nameField = getContactField(block, "name");
      emailField = getContactField(block, "email");
      messageField = getContactField(block, "message");
      buttonField = getContactField(block, "button");

      if (titleField) {
        titleField.setAttribute("data-contact-role", "title");
      }

      if (descriptionField) {
        descriptionField.setAttribute("data-contact-role", "description");
      }

      if (formField) {
        formField.setAttribute("data-contact-role", "form");
      }

      if (nameField) {
        nameField.setAttribute("data-contact-role", "name");
      }

      if (emailField) {
        emailField.setAttribute("data-contact-role", "email");
      }

      if (messageField) {
        messageField.setAttribute("data-contact-role", "message");
      }

      if (buttonField) {
        buttonField.setAttribute("data-contact-role", "button");
      }

      if (shell && shell !== block && shell.style.width && !block.style.width) {
        block.style.width = shell.style.width;
        shell.style.width = "";
      }

      return block;
    }

    function getImageField(block) {
      return block ? block.querySelector("[data-image-field]") : null;
    }

    function getImageCaptionField(block) {
      return block ? block.querySelector("figcaption") : null;
    }

    function getDividerField(block) {
      return block ? block.querySelector(".pf-divider-line") : null;
    }

    function getSpacerField(block) {
      return block ? block.querySelector(".pf-spacer-fill") : null;
    }

    function getDividerAlignment(target) {
      var computedStyle;

      if (!target) {
        return "left";
      }

      computedStyle = getComputedStyle(target);

      if (computedStyle.marginLeft === "auto" && computedStyle.marginRight === "auto") {
        return "center";
      }

      if (computedStyle.marginLeft === "auto") {
        return "right";
      }

      return "left";
    }

    function setDividerAlignment(target, alignment) {
      if (!target) {
        return;
      }

      if (alignment === "center") {
        target.style.marginLeft = "auto";
        target.style.marginRight = "auto";
        return;
      }

      if (alignment === "right") {
        target.style.marginLeft = "auto";
        target.style.marginRight = "0";
        return;
      }

      target.style.marginLeft = "0";
      target.style.marginRight = "auto";
    }

    function getStyleTarget(block) {
      var blockType = getBlockType(block);

      if (!block) {
        return null;
      }

      if (BLOCKS_USING_GROUP_STYLE_TARGET[blockType]) {
        if (blockType === "navbar") {
          return getNavbarElement(block) || block;
        }

        return block.querySelector(".pf-edit-surface") || block;
      }

      return block.querySelector(".pf-edit-surface") || block;
    }

    function getVisualTarget(block) {
      if (!block) {
        return null;
      }

      if (block.dataset.blockType === "button") {
        return getLinkField(block);
      }

      if (block.dataset.blockType === "image") {
        return getImageField(block);
      }

      if (block.dataset.blockType === "spacer") {
        return block.querySelector(".pf-spacer-fill");
      }

      if (block.dataset.blockType === "divider") {
        return block.querySelector(".pf-divider-line");
      }

      return getStyleTarget(block);
    }

    function getTextTarget(block) {
      return getPrimaryField(block) || getStyleTarget(block);
    }

    function getTemplateLabel(block) {
      var type = getBlockType(block);

      if (!type) {
        return "Unknown";
      }

      return PageForge.templates[type] ? PageForge.templates[type].label : type;
    }

    function usesGroupStyleTarget(block) {
      return Boolean(BLOCKS_USING_GROUP_STYLE_TARGET[getBlockType(block)]);
    }

    function getControlVisibility(block) {
      return TYPE_CONTROL_VISIBILITY[getBlockType(block)] || {};
    }

    function setDisabledState(element, disabled) {
      if (!element) {
        return;
      }

      element.disabled = disabled;
    }

    function setHelperText(selected) {
      if (!helperText) {
        return;
      }

      helperText.textContent = selected ? "Editing the selected element." : "Select an element to edit it.";
    }

    function getStyleValue(target, propertyName) {
      if (!target) {
        return "";
      }

      return target.style[propertyName] || getComputedStyle(target)[propertyName] || "";
    }

    function refreshActionAvailability() {
      var hasSelection = Boolean(selectedBlock);
      var previousBlock = hasSelection ? selectedBlock.previousElementSibling : null;
      var nextBlock = hasSelection ? selectedBlock.nextElementSibling : null;

      setDisabledState(deleteButton, !hasSelection);
      setDisabledState(duplicateButton, !hasSelection);
      setDisabledState(moveUpButton, !previousBlock);
      setDisabledState(moveDownButton, !nextBlock);
    }

    function toggleFieldAvailability(block) {
      var controlVisibility = getControlVisibility(block);
      var primaryField = getPrimaryField(block);
      var linkField = getLinkField(block);
      var imageField = getImageField(block);
      var hasSelection = Boolean(block);
      var hasHeading = hasSelection && getBlockType(block) === "heading";
      var hasParagraph = hasSelection && getBlockType(block) === "paragraph";
      var hasFooter = hasSelection && getBlockType(block) === "footer";
      var hasButtonElement = hasSelection && getBlockType(block) === "button";
      var hasImageElement = hasSelection && getBlockType(block) === "image";
      var hasHero = hasSelection && getBlockType(block) === "hero";
      var hasCard = hasSelection && getBlockType(block) === "card";
      var hasNavbar = hasSelection && getBlockType(block) === "navbar";
      var hasContactForm = hasSelection && isContactBlockType(getBlockType(block));
      var hasDivider = hasSelection && getBlockType(block) === "divider";
      var hasSpacer = hasSelection && getBlockType(block) === "spacer";
      var hasNavbarLink4 = hasNavbar && Boolean(getNavbarField(block, "link-4"));

      if (customControlGroups.text) {
        customControlGroups.text.hidden = !(hasSelection && controlVisibility.text && primaryField);
      }

      if (customControlGroups.align) {
        customControlGroups.align.hidden = !(hasSelection && controlVisibility.align);
      }

      if (customControlGroups.link) {
        customControlGroups.link.hidden = !(hasSelection && controlVisibility.link && linkField);
      }

      if (customControlGroups.heading) {
        customControlGroups.heading.hidden = !(hasSelection && controlVisibility.heading && hasHeading);
      }

      if (customControlGroups.paragraph) {
        customControlGroups.paragraph.hidden = !(hasSelection && controlVisibility.paragraph && hasParagraph);
      }

      if (customControlGroups.footer) {
        customControlGroups.footer.hidden = !(hasSelection && controlVisibility.footer && hasFooter);
      }

      if (customControlGroups.buttonElement) {
        customControlGroups.buttonElement.hidden = !(hasSelection && controlVisibility.buttonElement && linkField);
      }

      if (customControlGroups.image) {
        customControlGroups.image.hidden = !(hasSelection && controlVisibility.image && imageField);
      }

      if (customControlGroups.imageElement) {
        customControlGroups.imageElement.hidden = !(hasSelection && controlVisibility.imageElement && imageField);
      }

      if (customControlGroups.hero) {
        customControlGroups.hero.hidden = !(hasSelection && controlVisibility.hero);
      }

      if (customControlGroups.card) {
        customControlGroups.card.hidden = !(hasSelection && controlVisibility.card);
      }

      if (customControlGroups.navbar) {
        customControlGroups.navbar.hidden = !(hasSelection && controlVisibility.navbar);
      }

      if (customControlGroups.contactForm) {
        customControlGroups.contactForm.hidden = !(hasSelection && controlVisibility.contactForm && hasContactForm);
      }

      if (customControlGroups.divider) {
        customControlGroups.divider.hidden = !(hasSelection && controlVisibility.divider && hasDivider);
      }

      if (customControlGroups.spacer) {
        customControlGroups.spacer.hidden = !(hasSelection && controlVisibility.spacer && hasSpacer);
      }

      if (navbarLink4Row) {
        navbarLink4Row.hidden = !hasNavbarLink4;
      }

      Object.keys(sharedFieldGroups).forEach(function toggleSharedField(key) {
        if (sharedFieldGroups[key]) {
          sharedFieldGroups[key].hidden =
            hasHeading || hasParagraph || hasFooter || hasContactForm || hasDivider || hasSpacer;
        }
      });

      setDisabledState(
        textContentInput,
        !primaryField || hasHeading || hasParagraph || hasFooter || hasContactForm || hasDivider || hasSpacer
      );
      setDisabledState(
        fontSizeInput,
        !primaryField || hasHeading || hasParagraph || hasFooter || hasContactForm || hasDivider || hasSpacer
      );
      setDisabledState(
        textColorInput,
        !primaryField || hasHeading || hasParagraph || hasFooter || hasContactForm || hasDivider || hasSpacer
      );
      setDisabledState(
        linkInput,
        !(controlVisibility.link && linkField) || hasHeading || hasParagraph || hasFooter || hasContactForm || hasDivider || hasSpacer
      );
      setDisabledState(headingTextInput, !hasHeading);
      setDisabledState(headingTagInput, !hasHeading);
      setDisabledState(headingLinkUrlInput, !hasHeading);
      setDisabledState(headingFontSizeInput, !hasHeading);
      setDisabledState(headingFontWeightInput, !hasHeading);
      setDisabledState(headingTextColorInput, !hasHeading);
      setDisabledState(headingAlignInput, !hasHeading);
      setDisabledState(headingLineHeightInput, !hasHeading);
      setDisabledState(headingLetterSpacingInput, !hasHeading);
      setDisabledState(headingMarginInput, !hasHeading);
      setDisabledState(headingPaddingInput, !hasHeading);
      setDisabledState(paragraphTextInput, !hasParagraph);
      setDisabledState(paragraphFontSizeInput, !hasParagraph);
      setDisabledState(paragraphFontWeightInput, !hasParagraph);
      setDisabledState(paragraphTextColorInput, !hasParagraph);
      setDisabledState(paragraphAlignInput, !hasParagraph);
      setDisabledState(paragraphLineHeightInput, !hasParagraph);
      setDisabledState(paragraphLetterSpacingInput, !hasParagraph);
      setDisabledState(paragraphMaxWidthInput, !hasParagraph);
      setDisabledState(paragraphMarginInput, !hasParagraph);
      setDisabledState(paragraphPaddingInput, !hasParagraph);
      setDisabledState(footerBrandTextInput, !hasFooter);
      setDisabledState(footerDescriptionTextInput, !hasFooter);
      setDisabledState(footerCopyrightTextInput, !hasFooter);
      setDisabledState(footerLink1TextInput, !hasFooter);
      setDisabledState(footerLink1UrlInput, !hasFooter);
      setDisabledState(footerLink2TextInput, !hasFooter);
      setDisabledState(footerLink2UrlInput, !hasFooter);
      setDisabledState(footerLink3TextInput, !hasFooter);
      setDisabledState(footerLink3UrlInput, !hasFooter);
      setDisabledState(footerBackgroundColorInput, !hasFooter);
      setDisabledState(footerTextColorInput, !hasFooter);
      setDisabledState(footerLinkColorInput, !hasFooter);
      setDisabledState(footerPaddingInput, !hasFooter);
      setDisabledState(footerRadiusInput, !hasFooter);
      setDisabledState(footerAlignInput, !hasFooter);
      setDisabledState(buttonElementTextInput, !hasButtonElement);
      setDisabledState(buttonElementUrlInput, !hasButtonElement);
      setDisabledState(buttonOpenInNewTabInput, !hasButtonElement);
      setDisabledState(buttonBackgroundColorInput, !hasButtonElement);
      setDisabledState(buttonTextColorInput, !hasButtonElement);
      setDisabledState(buttonPaddingSpecialInput, !hasButtonElement);
      setDisabledState(buttonRadiusSpecialInput, !hasButtonElement);
      setDisabledState(buttonWidthSpecialInput, !hasButtonElement);
      setDisabledState(buttonAlignSpecialInput, !hasButtonElement);
      setDisabledState(imageUrlInput, !(controlVisibility.image && imageField));
      setDisabledState(imageElementUrlInput, !hasImageElement);
      setDisabledState(imageAltTextInput, !hasImageElement);
      setDisabledState(imageCaptionTextInput, !hasImageElement);
      setDisabledState(imageWidthInput, !hasImageElement);
      setDisabledState(imageHeightSpecialInput, !hasImageElement);
      setDisabledState(imageObjectFitInput, !hasImageElement);
      setDisabledState(imageRadiusSpecialInput, !hasImageElement);
      setDisabledState(backgroundColorInput, !block || hasHeading || hasParagraph || hasFooter || hasDivider || hasSpacer);
      setDisabledState(paddingInput, !block || hasHeading || hasParagraph || hasFooter || hasDivider || hasSpacer);
      setDisabledState(marginInput, !block || hasHeading || hasParagraph || hasFooter || hasDivider || hasSpacer);
      setDisabledState(radiusInput, !block || hasHeading || hasParagraph || hasFooter || hasDivider || hasSpacer);
      setDisabledState(widthInput, !block || hasHeading || hasParagraph || hasFooter || hasDivider || hasSpacer);
      setDisabledState(heightInput, !block || hasHeading || hasParagraph || hasFooter || hasDivider || hasSpacer);
      setDisabledState(
        alignInput,
        !(hasSelection && controlVisibility.align) || hasHeading || hasParagraph || hasFooter || hasDivider || hasSpacer
      );
      setDisabledState(heroBadgeTextInput, !hasHero);
      setDisabledState(heroHeadingTextInput, !hasHero);
      setDisabledState(heroParagraphTextInput, !hasHero);
      setDisabledState(heroButtonTextInput, !hasHero);
      setDisabledState(heroButtonUrlInput, !hasHero);
      setDisabledState(heroBackgroundColorInput, !hasHero);
      setDisabledState(heroHeadingColorInput, !hasHero);
      setDisabledState(heroParagraphColorInput, !hasHero);
      setDisabledState(heroButtonBackgroundColorInput, !hasHero);
      setDisabledState(heroButtonTextColorInput, !hasHero);
      setDisabledState(heroAlignInput, !hasHero);
      setDisabledState(cardLabelTextInput, !hasCard);
      setDisabledState(cardTitleTextInput, !hasCard);
      setDisabledState(cardDescriptionTextInput, !hasCard);
      setDisabledState(cardButtonTextInput, !hasCard);
      setDisabledState(cardButtonUrlInput, !hasCard);
      setDisabledState(cardBackgroundColorInput, !hasCard);
      setDisabledState(cardTitleColorInput, !hasCard);
      setDisabledState(cardTextColorInput, !hasCard);
      setDisabledState(cardButtonBackgroundColorInput, !hasCard);
      setDisabledState(cardRadiusInput, !hasCard);
      setDisabledState(cardPaddingInput, !hasCard);
      setDisabledState(navbarBrandTextInput, !hasNavbar);
      setDisabledState(navbarBrandUrlInput, !hasNavbar);
      setDisabledState(navbarLink1TextInput, !hasNavbar);
      setDisabledState(navbarLink1UrlInput, !hasNavbar);
      setDisabledState(navbarLink2TextInput, !hasNavbar);
      setDisabledState(navbarLink2UrlInput, !hasNavbar);
      setDisabledState(navbarLink3TextInput, !hasNavbar);
      setDisabledState(navbarLink3UrlInput, !hasNavbar);
      setDisabledState(navbarLink4TextInput, !hasNavbarLink4);
      setDisabledState(navbarLink4UrlInput, !hasNavbarLink4);
      setDisabledState(navbarCtaTextInput, !hasNavbar);
      setDisabledState(navbarCtaUrlInput, !hasNavbar);
      setDisabledState(navbarBackgroundColorInput, !hasNavbar);
      setDisabledState(navbarLinkColorInput, !hasNavbar);
      setDisabledState(navbarCtaBackgroundColorInput, !hasNavbar);
      setDisabledState(navbarCtaTextColorInput, !hasNavbar);
      setDisabledState(contactFormTitleInput, !hasContactForm);
      setDisabledState(contactFormDescriptionInput, !hasContactForm);
      setDisabledState(contactFormNamePlaceholderInput, !hasContactForm);
      setDisabledState(contactFormEmailPlaceholderInput, !hasContactForm);
      setDisabledState(contactFormMessagePlaceholderInput, !hasContactForm);
      setDisabledState(contactFormButtonTextInput, !hasContactForm);
      setDisabledState(contactFormBackgroundColorInput, !hasContactForm);
      setDisabledState(contactFormInputBackgroundColorInput, !hasContactForm);
      setDisabledState(contactFormInputTextColorInput, !hasContactForm);
      setDisabledState(contactFormButtonBackgroundColorInput, !hasContactForm);
      setDisabledState(contactFormButtonTextColorInput, !hasContactForm);
      setDisabledState(contactFormBorderRadiusInput, !hasContactForm);
      setDisabledState(contactFormPaddingInput, !hasContactForm);
      setDisabledState(contactFormWidthInput, !hasContactForm);
      setDisabledState(dividerWidthInput, !hasDivider);
      setDisabledState(dividerHeightInput, !hasDivider);
      setDisabledState(dividerColorInput, !hasDivider);
      setDisabledState(dividerStyleInput, !hasDivider);
      setDisabledState(dividerMarginTopInput, !hasDivider);
      setDisabledState(dividerMarginBottomInput, !hasDivider);
      setDisabledState(dividerAlignInput, !hasDivider);
      setDisabledState(spacerHeightInput, !hasSpacer);
      setDisabledState(spacerBackgroundColorInput, !hasSpacer);
      setDisabledState(spacerRadiusInput, !hasSpacer);
      setDisabledState(spacerMarginTopInput, !hasSpacer);
      setDisabledState(spacerMarginBottomInput, !hasSpacer);
    }

    function clearForm() {
      blockTypeField.value = "None selected";
      textContentInput.value = "";
      fontSizeInput.value = "";
      textColorInput.value = "#f5f7fb";
      backgroundColorInput.value = "#171d29";
      paddingInput.value = "";
      marginInput.value = "";
      radiusInput.value = "";
      widthInput.value = "";
      heightInput.value = "";
      alignInput.value = "left";
      linkInput.value = "";
      headingTextInput.value = "";
      headingTagInput.value = "h1";
      headingLinkUrlInput.value = "";
      headingFontSizeInput.value = "";
      headingFontWeightInput.value = "";
      headingTextColorInput.value = "#17202c";
      headingAlignInput.value = "left";
      headingLineHeightInput.value = "";
      headingLetterSpacingInput.value = "";
      headingMarginInput.value = "";
      headingPaddingInput.value = "";
      paragraphTextInput.value = "";
      paragraphFontSizeInput.value = "";
      paragraphFontWeightInput.value = "";
      paragraphTextColorInput.value = "#516074";
      paragraphAlignInput.value = "left";
      paragraphLineHeightInput.value = "";
      paragraphLetterSpacingInput.value = "";
      paragraphMaxWidthInput.value = "";
      paragraphMarginInput.value = "";
      paragraphPaddingInput.value = "";
      footerBrandTextInput.value = "";
      footerDescriptionTextInput.value = "";
      footerCopyrightTextInput.value = "";
      footerLink1TextInput.value = "";
      footerLink1UrlInput.value = "";
      footerLink2TextInput.value = "";
      footerLink2UrlInput.value = "";
      footerLink3TextInput.value = "";
      footerLink3UrlInput.value = "";
      footerBackgroundColorInput.value = "#0f1521";
      footerTextColorInput.value = "#eaf0fb";
      footerLinkColorInput.value = "#9eb0ca";
      footerPaddingInput.value = "";
      footerRadiusInput.value = "";
      footerAlignInput.value = "left";
      buttonElementTextInput.value = "";
      buttonElementUrlInput.value = "";
      buttonOpenInNewTabInput.checked = false;
      buttonBackgroundColorInput.value = "#3f6ff5";
      buttonTextColorInput.value = "#f9fbff";
      buttonPaddingSpecialInput.value = "";
      buttonRadiusSpecialInput.value = "";
      buttonWidthSpecialInput.value = "";
      buttonAlignSpecialInput.value = "left";
      imageUrlInput.value = "";
      imageElementUrlInput.value = "";
      imageAltTextInput.value = "";
      imageCaptionTextInput.value = "";
      imageWidthInput.value = "";
      imageHeightSpecialInput.value = "";
      imageObjectFitInput.value = "cover";
      imageRadiusSpecialInput.value = "";
      heroBadgeTextInput.value = "";
      heroHeadingTextInput.value = "";
      heroParagraphTextInput.value = "";
      heroButtonTextInput.value = "";
      heroButtonUrlInput.value = "";
      heroBackgroundColorInput.value = "#0f1726";
      heroHeadingColorInput.value = "#f5f8ff";
      heroParagraphColorInput.value = "#d2dcf0";
      heroButtonBackgroundColorInput.value = "#3f6ff5";
      heroButtonTextColorInput.value = "#f9fbff";
      heroAlignInput.value = "left";
      cardLabelTextInput.value = "";
      cardTitleTextInput.value = "";
      cardDescriptionTextInput.value = "";
      cardButtonTextInput.value = "";
      cardButtonUrlInput.value = "";
      cardBackgroundColorInput.value = "#ffffff";
      cardTitleColorInput.value = "#17202c";
      cardTextColorInput.value = "#516074";
      cardButtonBackgroundColorInput.value = "#3f6ff5";
      cardRadiusInput.value = "";
      cardPaddingInput.value = "";
      navbarBrandTextInput.value = "";
      navbarBrandUrlInput.value = "";
      navbarLink1TextInput.value = "";
      navbarLink1UrlInput.value = "";
      navbarLink2TextInput.value = "";
      navbarLink2UrlInput.value = "";
      navbarLink3TextInput.value = "";
      navbarLink3UrlInput.value = "";
      navbarLink4TextInput.value = "";
      navbarLink4UrlInput.value = "";
      navbarCtaTextInput.value = "";
      navbarCtaUrlInput.value = "";
      navbarBackgroundColorInput.value = "#0f1521";
      navbarLinkColorInput.value = "#a7b5cc";
      navbarCtaBackgroundColorInput.value = "#3f6ff5";
      navbarCtaTextColorInput.value = "#f9fbff";
      contactFormTitleInput.value = "";
      contactFormDescriptionInput.value = "";
      contactFormNamePlaceholderInput.value = "";
      contactFormEmailPlaceholderInput.value = "";
      contactFormMessagePlaceholderInput.value = "";
      contactFormButtonTextInput.value = "";
      contactFormBackgroundColorInput.value = "#ffffff";
      contactFormInputBackgroundColorInput.value = "#ffffff";
      contactFormInputTextColorInput.value = "#17202c";
      contactFormButtonBackgroundColorInput.value = "#3f6ff5";
      contactFormButtonTextColorInput.value = "#f9fbff";
      contactFormBorderRadiusInput.value = "";
      contactFormPaddingInput.value = "";
      contactFormWidthInput.value = "";
      dividerWidthInput.value = "";
      dividerHeightInput.value = "";
      dividerColorInput.value = "#1f2937";
      dividerStyleInput.value = "solid";
      dividerMarginTopInput.value = "";
      dividerMarginBottomInput.value = "";
      dividerAlignInput.value = "left";
      spacerHeightInput.value = "";
      spacerBackgroundColorInput.value = "#eff4ff";
      spacerRadiusInput.value = "";
      spacerMarginTopInput.value = "";
      spacerMarginBottomInput.value = "";
      setHelperText(false);
    }

    function setSelectedBlock(block) {
      if (selectedBlock) {
        selectedBlock.classList.remove("is-selected", "selected");
      }

      selectedBlock = block || null;

      if (selectedBlock) {
        selectedBlock = ensureNavbarStructure(selectedBlock);
        selectedBlock = ensureFooterStructure(selectedBlock);
        selectedBlock = ensureContactFormStructure(selectedBlock);
        selectedBlock.classList.add("is-selected", "selected");
      }

      syncForm();
    }

    function syncForm() {
      if (!selectedBlock) {
        clearForm();
        toggleFieldAvailability(null);
        refreshActionAvailability();
        return;
      }

      var primaryField = getPrimaryField(selectedBlock);
      var linkField = getLinkField(selectedBlock);
      var headingField = getHeadingField(selectedBlock);
      var headingLinkField = getHeadingLink(selectedBlock);
      var paragraphField = getParagraphField(selectedBlock);
      var footerBrandField = getFooterField(selectedBlock, "brand");
      var footerDescriptionField = getFooterField(selectedBlock, "description");
      var footerCopyrightField = getFooterField(selectedBlock, "copyright");
      var footerLink1Field = getFooterField(selectedBlock, "link-1");
      var footerLink2Field = getFooterField(selectedBlock, "link-2");
      var footerLink3Field = getFooterField(selectedBlock, "link-3");
      var imageField = getImageField(selectedBlock);
      var imageCaptionField = getImageCaptionField(selectedBlock);
      var dividerField = getDividerField(selectedBlock);
      var spacerField = getSpacerField(selectedBlock);
      var heroBadgeField = getHeroField(selectedBlock, "badge");
      var heroHeadingField = getHeroField(selectedBlock, "heading");
      var heroParagraphField = getHeroField(selectedBlock, "paragraph");
      var heroButtonField = getHeroField(selectedBlock, "button");
      var cardLabelField = getCardField(selectedBlock, "label");
      var cardTitleField = getCardField(selectedBlock, "title");
      var cardDescriptionField = getCardField(selectedBlock, "description");
      var cardButtonField = getCardField(selectedBlock, "button");
      var navbarBrandField = getNavbarField(selectedBlock, "brand");
      var navbarLink1Field = getNavbarField(selectedBlock, "link-1");
      var navbarLink2Field = getNavbarField(selectedBlock, "link-2");
      var navbarLink3Field = getNavbarField(selectedBlock, "link-3");
      var navbarLink4Field = getNavbarField(selectedBlock, "link-4");
      var navbarCtaField = getNavbarField(selectedBlock, "cta");
      var contactTitleField = getContactField(selectedBlock, "title");
      var contactDescriptionField = getContactField(selectedBlock, "description");
      var contactNameField = getContactField(selectedBlock, "name");
      var contactEmailField = getContactField(selectedBlock, "email");
      var contactMessageField = getContactField(selectedBlock, "message");
      var contactButtonField = getContactField(selectedBlock, "button");
      var styleTarget = getStyleTarget(selectedBlock);
      var visualTarget = getVisualTarget(selectedBlock) || styleTarget;
      var textTarget = getTextTarget(selectedBlock);
      var computedStyle = getComputedStyle(styleTarget);
      var computedVisual = getComputedStyle(visualTarget);
      var computedText = getComputedStyle(textTarget);
      var computedNavbarStyle = getComputedStyle(styleTarget);
      var computedNavbarLink =
        (navbarLink1Field && getComputedStyle(navbarLink1Field)) ||
        (navbarCtaField && getComputedStyle(navbarCtaField));
      var computedNavbarCta = navbarCtaField ? getComputedStyle(navbarCtaField) : null;
      var computedHeading = headingField ? getComputedStyle(headingField) : null;
      var computedParagraph = paragraphField ? getComputedStyle(paragraphField) : null;
      var computedFooterStyle = getBlockType(selectedBlock) === "footer" ? getComputedStyle(styleTarget) : null;
      var computedFooterBrand = footerBrandField ? getComputedStyle(footerBrandField) : null;
      var computedFooterLink =
        (footerLink1Field && getComputedStyle(footerLink1Field)) ||
        (footerLink2Field && getComputedStyle(footerLink2Field)) ||
        (footerLink3Field && getComputedStyle(footerLink3Field));
      var computedHeroStyle = getBlockType(selectedBlock) === "hero" ? getComputedStyle(styleTarget) : null;
      var computedHeroHeading = heroHeadingField ? getComputedStyle(heroHeadingField) : null;
      var computedHeroParagraph = heroParagraphField ? getComputedStyle(heroParagraphField) : null;
      var computedHeroButton = heroButtonField ? getComputedStyle(heroButtonField) : null;
      var computedCardStyle = getBlockType(selectedBlock) === "card" ? getComputedStyle(styleTarget) : null;
      var computedCardTitle = cardTitleField ? getComputedStyle(cardTitleField) : null;
      var computedCardDescription = cardDescriptionField ? getComputedStyle(cardDescriptionField) : null;
      var computedCardButton = cardButtonField ? getComputedStyle(cardButtonField) : null;
      var computedButtonLink = getBlockType(selectedBlock) === "button" && linkField ? getComputedStyle(linkField) : null;
      var computedContactStyle = isContactBlockType(getBlockType(selectedBlock)) ? getComputedStyle(styleTarget) : null;
      var computedContactInput =
        (contactNameField && getComputedStyle(contactNameField)) ||
        (contactEmailField && getComputedStyle(contactEmailField)) ||
        (contactMessageField && getComputedStyle(contactMessageField));
      var computedContactButton = contactButtonField ? getComputedStyle(contactButtonField) : null;
      var computedDivider = dividerField ? getComputedStyle(dividerField) : null;
      var computedSpacer = spacerField ? getComputedStyle(spacerField) : null;

      blockTypeField.value = getTemplateLabel(selectedBlock);
      textContentInput.value = primaryField ? primaryField.textContent.trim() : "";
      fontSizeInput.value = primaryField ? getStyleValue(primaryField, "fontSize") : "";
      textColorInput.value = normalizeColor(computedText.color, "#f5f7fb");
      backgroundColorInput.value = normalizeColor(computedVisual.backgroundColor, "#171d29");
      paddingInput.value = getStyleValue(styleTarget, "padding");
      marginInput.value = selectedBlock.style.margin || getComputedStyle(selectedBlock).margin;
      radiusInput.value = getStyleValue(visualTarget, "borderRadius") || computedVisual.borderRadius;
      widthInput.value = visualTarget.style.width || "";
      heightInput.value = visualTarget.style.height || "";
      alignInput.value = styleTarget.style.textAlign || computedStyle.textAlign || "left";
      linkInput.value = linkField ? linkField.getAttribute("href") || "" : "";
      headingTextInput.value = getBlockType(selectedBlock) === "heading" && headingField ? headingField.textContent.trim() : "";
      headingTagInput.value =
        getBlockType(selectedBlock) === "heading" && headingField ? headingField.tagName.toLowerCase() : "h1";
      headingLinkUrlInput.value =
        getBlockType(selectedBlock) === "heading" && headingLinkField ? headingLinkField.getAttribute("href") || "" : "";
      headingFontSizeInput.value =
        getBlockType(selectedBlock) === "heading" && headingField
          ? headingField.style.fontSize || (computedHeading ? computedHeading.fontSize : "") || ""
          : "";
      headingFontWeightInput.value =
        getBlockType(selectedBlock) === "heading" && headingField
          ? headingField.style.fontWeight || (computedHeading ? computedHeading.fontWeight : "") || ""
          : "";
      headingTextColorInput.value = normalizeColor(computedHeading ? computedHeading.color : "", "#17202c");
      headingAlignInput.value =
        getBlockType(selectedBlock) === "heading"
          ? styleTarget.style.textAlign || computedStyle.textAlign || "left"
          : "left";
      headingLineHeightInput.value =
        getBlockType(selectedBlock) === "heading" && headingField
          ? headingField.style.lineHeight || (computedHeading ? computedHeading.lineHeight : "") || ""
          : "";
      headingLetterSpacingInput.value =
        getBlockType(selectedBlock) === "heading" && headingField
          ? headingField.style.letterSpacing || (computedHeading ? computedHeading.letterSpacing : "") || ""
          : "";
      headingMarginInput.value =
        getBlockType(selectedBlock) === "heading" ? selectedBlock.style.margin || getComputedStyle(selectedBlock).margin : "";
      headingPaddingInput.value =
        getBlockType(selectedBlock) === "heading"
          ? styleTarget.style.padding || computedStyle.padding || ""
          : "";
      paragraphTextInput.value = getBlockType(selectedBlock) === "paragraph" && paragraphField ? paragraphField.textContent.trim() : "";
      paragraphFontSizeInput.value =
        getBlockType(selectedBlock) === "paragraph" && paragraphField
          ? paragraphField.style.fontSize || (computedParagraph ? computedParagraph.fontSize : "") || ""
          : "";
      paragraphFontWeightInput.value =
        getBlockType(selectedBlock) === "paragraph" && paragraphField
          ? paragraphField.style.fontWeight || (computedParagraph ? computedParagraph.fontWeight : "") || ""
          : "";
      paragraphTextColorInput.value = normalizeColor(computedParagraph ? computedParagraph.color : "", "#516074");
      paragraphAlignInput.value =
        getBlockType(selectedBlock) === "paragraph"
          ? styleTarget.style.textAlign || computedStyle.textAlign || "left"
          : "left";
      paragraphLineHeightInput.value =
        getBlockType(selectedBlock) === "paragraph" && paragraphField
          ? paragraphField.style.lineHeight || (computedParagraph ? computedParagraph.lineHeight : "") || ""
          : "";
      paragraphLetterSpacingInput.value =
        getBlockType(selectedBlock) === "paragraph" && paragraphField
          ? paragraphField.style.letterSpacing || (computedParagraph ? computedParagraph.letterSpacing : "") || ""
          : "";
      paragraphMaxWidthInput.value =
        getBlockType(selectedBlock) === "paragraph" && paragraphField
          ? paragraphField.style.maxWidth || (computedParagraph ? computedParagraph.maxWidth : "") || ""
          : "";
      paragraphMarginInput.value =
        getBlockType(selectedBlock) === "paragraph"
          ? selectedBlock.style.margin || getComputedStyle(selectedBlock).margin
          : "";
      paragraphPaddingInput.value =
        getBlockType(selectedBlock) === "paragraph"
          ? styleTarget.style.padding || computedStyle.padding || ""
          : "";
      footerBrandTextInput.value = footerBrandField ? footerBrandField.textContent.trim() : "";
      footerDescriptionTextInput.value = footerDescriptionField ? footerDescriptionField.textContent.trim() : "";
      footerCopyrightTextInput.value = footerCopyrightField ? footerCopyrightField.textContent.trim() : "";
      footerLink1TextInput.value = footerLink1Field ? footerLink1Field.textContent.trim() : "";
      footerLink1UrlInput.value = footerLink1Field ? footerLink1Field.getAttribute("href") || "" : "";
      footerLink2TextInput.value = footerLink2Field ? footerLink2Field.textContent.trim() : "";
      footerLink2UrlInput.value = footerLink2Field ? footerLink2Field.getAttribute("href") || "" : "";
      footerLink3TextInput.value = footerLink3Field ? footerLink3Field.textContent.trim() : "";
      footerLink3UrlInput.value = footerLink3Field ? footerLink3Field.getAttribute("href") || "" : "";
      footerBackgroundColorInput.value = normalizeColor(computedFooterStyle ? computedFooterStyle.backgroundColor : "", "#0f1521");
      footerTextColorInput.value = normalizeColor(computedFooterBrand ? computedFooterBrand.color : "", "#eaf0fb");
      footerLinkColorInput.value = normalizeColor(computedFooterLink ? computedFooterLink.color : "", "#9eb0ca");
      footerPaddingInput.value =
        getBlockType(selectedBlock) === "footer"
          ? styleTarget.style.padding || (computedFooterStyle ? computedFooterStyle.padding : "") || ""
          : "";
      footerRadiusInput.value =
        getBlockType(selectedBlock) === "footer"
          ? styleTarget.style.borderRadius || (computedFooterStyle ? computedFooterStyle.borderRadius : "") || ""
          : "";
      footerAlignInput.value =
        getBlockType(selectedBlock) === "footer"
          ? styleTarget.style.textAlign || (computedFooterStyle ? computedFooterStyle.textAlign : "") || "left"
          : "left";
      buttonElementTextInput.value = getBlockType(selectedBlock) === "button" && linkField ? linkField.textContent.trim() : "";
      buttonElementUrlInput.value = getBlockType(selectedBlock) === "button" && linkField ? linkField.getAttribute("href") || "" : "";
      buttonOpenInNewTabInput.checked =
        getBlockType(selectedBlock) === "button" && linkField ? linkField.getAttribute("target") === "_blank" : false;
      buttonBackgroundColorInput.value = normalizeColor(
        computedButtonLink ? computedButtonLink.backgroundColor : "",
        "#3f6ff5"
      );
      buttonTextColorInput.value = normalizeColor(computedButtonLink ? computedButtonLink.color : "", "#f9fbff");
      buttonPaddingSpecialInput.value = getBlockType(selectedBlock) === "button" && linkField ? linkField.style.padding || "" : "";
      buttonRadiusSpecialInput.value =
        getBlockType(selectedBlock) === "button" && linkField
          ? linkField.style.borderRadius || (computedButtonLink ? computedButtonLink.borderRadius : "") || ""
          : "";
      buttonWidthSpecialInput.value = getBlockType(selectedBlock) === "button" && linkField ? linkField.style.width || "" : "";
      buttonAlignSpecialInput.value =
        getBlockType(selectedBlock) === "button"
          ? styleTarget.style.textAlign || computedStyle.textAlign || "left"
          : "left";
      imageUrlInput.value = imageField ? imageField.getAttribute("src") || "" : "";
      imageElementUrlInput.value = imageField ? imageField.getAttribute("src") || "" : "";
      imageAltTextInput.value = imageField ? imageField.getAttribute("alt") || "" : "";
      imageCaptionTextInput.value = imageCaptionField ? imageCaptionField.textContent.trim() : "";
      imageWidthInput.value = imageField ? imageField.style.width || "" : "";
      imageHeightSpecialInput.value = imageField ? imageField.style.height || "" : "";
      imageObjectFitInput.value = imageField ? imageField.style.objectFit || getComputedStyle(imageField).objectFit || "cover" : "cover";
      imageRadiusSpecialInput.value = imageField ? imageField.style.borderRadius || getComputedStyle(imageField).borderRadius || "" : "";
      heroBadgeTextInput.value = heroBadgeField ? heroBadgeField.textContent.trim() : "";
      heroHeadingTextInput.value = heroHeadingField ? heroHeadingField.textContent.trim() : "";
      heroParagraphTextInput.value = heroParagraphField ? heroParagraphField.textContent.trim() : "";
      heroButtonTextInput.value = heroButtonField ? heroButtonField.textContent.trim() : "";
      heroButtonUrlInput.value = heroButtonField ? heroButtonField.getAttribute("href") || "" : "";
      heroBackgroundColorInput.value = normalizeColor(computedHeroStyle ? computedHeroStyle.backgroundColor : "", "#0f1726");
      heroHeadingColorInput.value = normalizeColor(computedHeroHeading ? computedHeroHeading.color : "", "#f5f8ff");
      heroParagraphColorInput.value = normalizeColor(
        computedHeroParagraph ? computedHeroParagraph.color : "",
        "#d2dcf0"
      );
      heroButtonBackgroundColorInput.value = normalizeColor(
        computedHeroButton ? computedHeroButton.backgroundColor : "",
        "#3f6ff5"
      );
      heroButtonTextColorInput.value = normalizeColor(computedHeroButton ? computedHeroButton.color : "", "#f9fbff");
      heroAlignInput.value =
        getBlockType(selectedBlock) === "hero"
          ? styleTarget.style.textAlign || (computedHeroStyle ? computedHeroStyle.textAlign : "") || "left"
          : "left";
      cardLabelTextInput.value = cardLabelField ? cardLabelField.textContent.trim() : "";
      cardTitleTextInput.value = cardTitleField ? cardTitleField.textContent.trim() : "";
      cardDescriptionTextInput.value = cardDescriptionField ? cardDescriptionField.textContent.trim() : "";
      cardButtonTextInput.value = cardButtonField ? cardButtonField.textContent.trim() : "";
      cardButtonUrlInput.value = cardButtonField ? cardButtonField.getAttribute("href") || "" : "";
      cardBackgroundColorInput.value = normalizeColor(computedCardStyle ? computedCardStyle.backgroundColor : "", "#ffffff");
      cardTitleColorInput.value = normalizeColor(computedCardTitle ? computedCardTitle.color : "", "#17202c");
      cardTextColorInput.value = normalizeColor(computedCardDescription ? computedCardDescription.color : "", "#516074");
      cardButtonBackgroundColorInput.value = normalizeColor(
        computedCardButton ? computedCardButton.backgroundColor : "",
        "#3f6ff5"
      );
      cardRadiusInput.value =
        getBlockType(selectedBlock) === "card"
          ? styleTarget.style.borderRadius || (computedCardStyle ? computedCardStyle.borderRadius : "") || ""
          : "";
      cardPaddingInput.value =
        getBlockType(selectedBlock) === "card"
          ? styleTarget.style.padding || (computedCardStyle ? computedCardStyle.padding : "") || ""
          : "";
      navbarBrandTextInput.value = navbarBrandField ? navbarBrandField.textContent.trim() : "";
      navbarBrandUrlInput.value = navbarBrandField ? navbarBrandField.getAttribute("href") || "" : "";
      navbarLink1TextInput.value = navbarLink1Field ? navbarLink1Field.textContent.trim() : "";
      navbarLink1UrlInput.value = navbarLink1Field ? navbarLink1Field.getAttribute("href") || "" : "";
      navbarLink2TextInput.value = navbarLink2Field ? navbarLink2Field.textContent.trim() : "";
      navbarLink2UrlInput.value = navbarLink2Field ? navbarLink2Field.getAttribute("href") || "" : "";
      navbarLink3TextInput.value = navbarLink3Field ? navbarLink3Field.textContent.trim() : "";
      navbarLink3UrlInput.value = navbarLink3Field ? navbarLink3Field.getAttribute("href") || "" : "";
      navbarLink4TextInput.value = navbarLink4Field ? navbarLink4Field.textContent.trim() : "";
      navbarLink4UrlInput.value = navbarLink4Field ? navbarLink4Field.getAttribute("href") || "" : "";
      navbarCtaTextInput.value = navbarCtaField ? navbarCtaField.textContent.trim() : "";
      navbarCtaUrlInput.value = navbarCtaField ? navbarCtaField.getAttribute("href") || "" : "";
      navbarBackgroundColorInput.value = normalizeColor(computedNavbarStyle.backgroundColor, "#0f1521");
      navbarLinkColorInput.value = normalizeColor(computedNavbarLink ? computedNavbarLink.color : "", "#a7b5cc");
      navbarCtaBackgroundColorInput.value = normalizeColor(
        computedNavbarCta ? computedNavbarCta.backgroundColor : "",
        "#3f6ff5"
      );
      navbarCtaTextColorInput.value = normalizeColor(computedNavbarCta ? computedNavbarCta.color : "", "#f9fbff");
      contactFormTitleInput.value = contactTitleField ? contactTitleField.textContent.trim() : "";
      contactFormDescriptionInput.value = contactDescriptionField ? contactDescriptionField.textContent.trim() : "";
      contactFormNamePlaceholderInput.value = contactNameField ? contactNameField.getAttribute("placeholder") || "" : "";
      contactFormEmailPlaceholderInput.value = contactEmailField ? contactEmailField.getAttribute("placeholder") || "" : "";
      contactFormMessagePlaceholderInput.value = contactMessageField ? contactMessageField.getAttribute("placeholder") || "" : "";
      contactFormButtonTextInput.value = contactButtonField ? contactButtonField.textContent.trim() : "";
      contactFormBackgroundColorInput.value = normalizeColor(
        computedContactStyle ? computedContactStyle.backgroundColor : "",
        "#ffffff"
      );
      contactFormInputBackgroundColorInput.value = normalizeColor(
        computedContactInput ? computedContactInput.backgroundColor : "",
        "#ffffff"
      );
      contactFormInputTextColorInput.value = normalizeColor(
        computedContactInput ? computedContactInput.color : "",
        "#17202c"
      );
      contactFormButtonBackgroundColorInput.value = normalizeColor(
        computedContactButton ? computedContactButton.backgroundColor : "",
        "#3f6ff5"
      );
      contactFormButtonTextColorInput.value = normalizeColor(
        computedContactButton ? computedContactButton.color : "",
        "#f9fbff"
      );
      contactFormBorderRadiusInput.value =
        isContactBlockType(getBlockType(selectedBlock))
          ? styleTarget.style.borderRadius || (computedContactStyle ? computedContactStyle.borderRadius : "") || ""
          : "";
      contactFormPaddingInput.value =
        isContactBlockType(getBlockType(selectedBlock))
          ? styleTarget.style.padding || (computedContactStyle ? computedContactStyle.padding : "") || ""
          : "";
      contactFormWidthInput.value =
        isContactBlockType(getBlockType(selectedBlock))
          ? selectedBlock.style.width || (styleTarget ? styleTarget.style.width || "" : "")
          : "";
      dividerWidthInput.value =
        getBlockType(selectedBlock) === "divider"
          ? dividerField.style.width || (computedDivider ? computedDivider.width : "") || ""
          : "";
      dividerHeightInput.value =
        getBlockType(selectedBlock) === "divider"
          ? dividerField.style.borderTopWidth || (computedDivider ? computedDivider.borderTopWidth : "") || ""
          : "";
      dividerColorInput.value = normalizeColor(computedDivider ? computedDivider.borderTopColor : "", "#1f2937");
      dividerStyleInput.value =
        getBlockType(selectedBlock) === "divider"
          ? dividerField.style.borderTopStyle || (computedDivider ? computedDivider.borderTopStyle : "") || "solid"
          : "solid";
      dividerMarginTopInput.value =
        getBlockType(selectedBlock) === "divider"
          ? dividerField.style.marginTop || (computedDivider ? computedDivider.marginTop : "") || ""
          : "";
      dividerMarginBottomInput.value =
        getBlockType(selectedBlock) === "divider"
          ? dividerField.style.marginBottom || (computedDivider ? computedDivider.marginBottom : "") || ""
          : "";
      dividerAlignInput.value = getBlockType(selectedBlock) === "divider" ? getDividerAlignment(dividerField) : "left";
      spacerHeightInput.value =
        getBlockType(selectedBlock) === "spacer"
          ? spacerField.style.height || spacerField.style.minHeight || (computedSpacer ? computedSpacer.height : "") || ""
          : "";
      spacerBackgroundColorInput.value = normalizeColor(
        computedSpacer ? computedSpacer.backgroundColor : "",
        "#eff4ff"
      );
      spacerRadiusInput.value =
        getBlockType(selectedBlock) === "spacer"
          ? spacerField.style.borderRadius || (computedSpacer ? computedSpacer.borderRadius : "") || ""
          : "";
      spacerMarginTopInput.value =
        getBlockType(selectedBlock) === "spacer"
          ? selectedBlock.style.marginTop || getComputedStyle(selectedBlock).marginTop || ""
          : "";
      spacerMarginBottomInput.value =
        getBlockType(selectedBlock) === "spacer"
          ? selectedBlock.style.marginBottom || getComputedStyle(selectedBlock).marginBottom || ""
          : "";

      setHelperText(true);
      toggleFieldAvailability(selectedBlock);
      refreshActionAvailability();
    }

    function updateSelected(mutator) {
      if (!selectedBlock) {
        return;
      }

      mutator(selectedBlock);
      syncForm();
      onChange();
    }

    function assignFreshMetadata(block) {
      var newId = createUniqueBlockId();

      if (!block) {
        return null;
      }

      block.dataset.id = newId;
      block.dataset.blockId = newId;
      block.setAttribute("draggable", "true");
      block.classList.remove("selected", "is-selected", "is-dragging");
      return block;
    }

    function bindInput(input, handler) {
      input.addEventListener("input", function handleInput() {
        updateSelected(function mutate(block) {
          handler(block, input.value);
        });
      });
    }

    bindInput(textContentInput, function handleTextContent(block, value) {
      var field = getPrimaryField(block);

      if (field) {
        field.textContent = value || " ";
      }
    });

    bindInput(fontSizeInput, function handleFontSize(block, value) {
      var field = getPrimaryField(block);

      if (field) {
        field.style.fontSize = value;
      }
    });

    bindInput(textColorInput, function handleTextColor(block, value) {
      var field = getPrimaryField(block);
      var styleTarget = getStyleTarget(block);

      if (field) {
        field.style.color = value;
      }

      if (styleTarget && usesGroupStyleTarget(block)) {
        styleTarget.style.color = value;
      }
    });

    bindInput(backgroundColorInput, function handleBackgroundColor(block, value) {
      var target = getVisualTarget(block) || getStyleTarget(block);

      if (!target) {
        return;
      }

      if (target.tagName === "HR") {
        target.style.borderTopColor = value;
        return;
      }

      target.style.backgroundColor = value;
    });

    bindInput(paddingInput, function handlePadding(block, value) {
      var target = getStyleTarget(block);

      if (target) {
        target.style.padding = value;
      }
    });

    bindInput(marginInput, function handleMargin(block, value) {
      block.style.margin = value;
    });

    bindInput(radiusInput, function handleRadius(block, value) {
      var target = getVisualTarget(block) || getStyleTarget(block);

      if (!target) {
        return;
      }

      if (target.tagName !== "HR") {
        target.style.borderRadius = value;
      }
    });

    bindInput(widthInput, function handleWidth(block, value) {
      var target = getVisualTarget(block) || getStyleTarget(block);

      if (target) {
        target.style.width = value;
      }
    });

    bindInput(heightInput, function handleHeight(block, value) {
      var target = getVisualTarget(block) || getStyleTarget(block);

      if (target) {
        target.style.height = value;
      }
    });

    alignInput.addEventListener("change", function handleAlignChange() {
      updateSelected(function mutate(block) {
        var target = getStyleTarget(block);

        if (target) {
          target.style.textAlign = alignInput.value;
        }
      });
    });

    bindInput(linkInput, function handleLink(block, value) {
      var linkField = getLinkField(block);

      if (linkField) {
        linkField.setAttribute("href", value || "#");
      }
    });

    function bindHeadingInput(input, property) {
      input.addEventListener("input", function handleHeadingInput() {
        updateSelected(function mutateHeading(block) {
          var heading = getHeadingField(block);
          var styleTarget = getStyleTarget(block);

          if (getBlockType(block) !== "heading" || !heading) {
            return;
          }

          if (property === "text") {
            heading.textContent = input.value || " ";
            return;
          }

          if (property === "link") {
            setHeadingLink(block, input.value.trim());
            return;
          }

          if (property === "fontSize") {
            heading.style.fontSize = input.value;
            return;
          }

          if (property === "fontWeight") {
            heading.style.fontWeight = input.value;
            return;
          }

          if (property === "textColor") {
            heading.style.color = input.value;
            return;
          }

          if (property === "lineHeight") {
            heading.style.lineHeight = input.value;
            return;
          }

          if (property === "letterSpacing") {
            heading.style.letterSpacing = input.value;
            return;
          }

          if (property === "margin") {
            block.style.margin = input.value;
            return;
          }

          if (property === "padding" && styleTarget) {
            styleTarget.style.padding = input.value;
          }
        });
      });
    }

    function bindParagraphInput(input, property) {
      input.addEventListener("input", function handleParagraphInput() {
        updateSelected(function mutateParagraph(block) {
          var paragraph = getParagraphField(block);
          var styleTarget = getStyleTarget(block);

          if (getBlockType(block) !== "paragraph" || !paragraph) {
            return;
          }

          if (property === "text") {
            paragraph.textContent = input.value || " ";
            return;
          }

          if (property === "fontSize") {
            paragraph.style.fontSize = input.value;
            return;
          }

          if (property === "fontWeight") {
            paragraph.style.fontWeight = input.value;
            return;
          }

          if (property === "textColor") {
            paragraph.style.color = input.value;
            return;
          }

          if (property === "lineHeight") {
            paragraph.style.lineHeight = input.value;
            return;
          }

          if (property === "letterSpacing") {
            paragraph.style.letterSpacing = input.value;
            return;
          }

          if (property === "maxWidth") {
            paragraph.style.maxWidth = input.value;
            return;
          }

          if (property === "margin") {
            block.style.margin = input.value;
            return;
          }

          if (property === "padding" && styleTarget) {
            styleTarget.style.padding = input.value;
          }
        });
      });
    }

    function bindFooterInput(input, role, property) {
      input.addEventListener("input", function handleFooterInput() {
        updateSelected(function mutateFooter(block) {
          var target = getFooterField(block, role);
          var styleTarget = getStyleTarget(block);
          var textTargets;
          var linkTargets;

          if (getBlockType(block) !== "footer") {
            return;
          }

          if (property === "text" && target) {
            target.textContent = input.value || " ";
            return;
          }

          if (property === "href" && target) {
            target.setAttribute("href", input.value || "#");
            return;
          }

          if (property === "backgroundColor" && styleTarget) {
            styleTarget.style.backgroundColor = input.value;
            styleTarget.style.backgroundImage = "none";
            return;
          }

          if (property === "textColor") {
            textTargets = ["brand", "description", "copyright"]
              .map(function mapFooterText(roleName) {
                return getFooterField(block, roleName);
              })
              .filter(Boolean);

            if (styleTarget) {
              styleTarget.style.color = input.value;
            }

            textTargets.forEach(function applyFooterTextColor(node) {
              node.style.color = input.value;
            });
            return;
          }

          if (property === "linkColor") {
            linkTargets = ["link-1", "link-2", "link-3"]
              .map(function mapFooterLink(roleName) {
                return getFooterField(block, roleName);
              })
              .filter(Boolean);

            linkTargets.forEach(function applyFooterLinkColor(node) {
              node.style.color = input.value;
            });
            return;
          }

          if (property === "padding" && styleTarget) {
            styleTarget.style.padding = input.value;
            return;
          }

          if (property === "radius" && styleTarget) {
            styleTarget.style.borderRadius = input.value;
            return;
          }

          if (property === "align" && styleTarget) {
            styleTarget.style.textAlign = input.value;
          }
        });
      });
    }

    function bindButtonElementInput(input, property) {
      input.addEventListener("input", function handleButtonElementInput() {
        updateSelected(function mutateButton(block) {
          var linkField = getLinkField(block);
          var styleTarget = getStyleTarget(block);

          if (!linkField || getBlockType(block) !== "button") {
            return;
          }

          if (property === "text") {
            linkField.textContent = input.value || " ";
            return;
          }

          if (property === "href") {
            linkField.setAttribute("href", input.value || "#");
            return;
          }

          if (property === "backgroundColor") {
            linkField.style.backgroundColor = input.value;
            linkField.style.backgroundImage = "none";
            return;
          }

          if (property === "color") {
            linkField.style.color = input.value;
            return;
          }

          if (property === "padding") {
            linkField.style.padding = input.value;
            return;
          }

          if (property === "radius") {
            linkField.style.borderRadius = input.value;
            return;
          }

          if (property === "width") {
            linkField.style.width = input.value;
            return;
          }

          if (property === "align" && styleTarget) {
            styleTarget.style.textAlign = input.value;
          }
        });
      });
    }

    bindHeadingInput(headingTextInput, "text");
    bindHeadingInput(headingLinkUrlInput, "link");
    bindHeadingInput(headingFontSizeInput, "fontSize");
    bindHeadingInput(headingFontWeightInput, "fontWeight");
    bindHeadingInput(headingTextColorInput, "textColor");
    bindHeadingInput(headingLineHeightInput, "lineHeight");
    bindHeadingInput(headingLetterSpacingInput, "letterSpacing");
    bindHeadingInput(headingMarginInput, "margin");
    bindHeadingInput(headingPaddingInput, "padding");

    headingTagInput.addEventListener("change", function handleHeadingTagChange() {
      updateSelected(function mutateHeading(block) {
        if (getBlockType(block) === "heading") {
          replaceHeadingTag(block, headingTagInput.value);
        }
      });
    });

    headingAlignInput.addEventListener("change", function handleHeadingAlignChange() {
      updateSelected(function mutateHeading(block) {
        var styleTarget = getStyleTarget(block);

        if (getBlockType(block) === "heading" && styleTarget) {
          styleTarget.style.textAlign = headingAlignInput.value;
        }
      });
    });

    bindParagraphInput(paragraphTextInput, "text");
    bindParagraphInput(paragraphFontSizeInput, "fontSize");
    bindParagraphInput(paragraphFontWeightInput, "fontWeight");
    bindParagraphInput(paragraphTextColorInput, "textColor");
    bindParagraphInput(paragraphLineHeightInput, "lineHeight");
    bindParagraphInput(paragraphLetterSpacingInput, "letterSpacing");
    bindParagraphInput(paragraphMaxWidthInput, "maxWidth");
    bindParagraphInput(paragraphMarginInput, "margin");
    bindParagraphInput(paragraphPaddingInput, "padding");

    paragraphAlignInput.addEventListener("change", function handleParagraphAlignChange() {
      updateSelected(function mutateParagraph(block) {
        var styleTarget = getStyleTarget(block);

        if (getBlockType(block) === "paragraph" && styleTarget) {
          styleTarget.style.textAlign = paragraphAlignInput.value;
        }
      });
    });

    bindFooterInput(footerBrandTextInput, "brand", "text");
    bindFooterInput(footerDescriptionTextInput, "description", "text");
    bindFooterInput(footerCopyrightTextInput, "copyright", "text");
    bindFooterInput(footerLink1TextInput, "link-1", "text");
    bindFooterInput(footerLink1UrlInput, "link-1", "href");
    bindFooterInput(footerLink2TextInput, "link-2", "text");
    bindFooterInput(footerLink2UrlInput, "link-2", "href");
    bindFooterInput(footerLink3TextInput, "link-3", "text");
    bindFooterInput(footerLink3UrlInput, "link-3", "href");
    bindFooterInput(footerBackgroundColorInput, "brand", "backgroundColor");
    bindFooterInput(footerTextColorInput, "brand", "textColor");
    bindFooterInput(footerLinkColorInput, "link-1", "linkColor");
    bindFooterInput(footerPaddingInput, "brand", "padding");
    bindFooterInput(footerRadiusInput, "brand", "radius");

    footerAlignInput.addEventListener("change", function handleFooterAlignChange() {
      updateSelected(function mutateFooter(block) {
        var styleTarget = getStyleTarget(block);

        if (getBlockType(block) === "footer" && styleTarget) {
          styleTarget.style.textAlign = footerAlignInput.value;
        }
      });
    });

    bindInput(imageUrlInput, function handleImage(block, value) {
      var imageField = getImageField(block);

      if (imageField) {
        imageField.setAttribute("src", value || imageField.getAttribute("src"));
      }
    });

    bindButtonElementInput(buttonElementTextInput, "text");
    bindButtonElementInput(buttonElementUrlInput, "href");
    bindButtonElementInput(buttonBackgroundColorInput, "backgroundColor");
    bindButtonElementInput(buttonTextColorInput, "color");
    bindButtonElementInput(buttonPaddingSpecialInput, "padding");
    bindButtonElementInput(buttonRadiusSpecialInput, "radius");
    bindButtonElementInput(buttonWidthSpecialInput, "width");

    buttonAlignSpecialInput.addEventListener("change", function handleButtonAlign() {
      updateSelected(function mutateButton(block) {
        var styleTarget = getStyleTarget(block);

        if (getBlockType(block) === "button" && styleTarget) {
          styleTarget.style.textAlign = buttonAlignSpecialInput.value;
        }
      });
    });

    buttonOpenInNewTabInput.addEventListener("change", function handleButtonTarget() {
      updateSelected(function mutateButton(block) {
        var linkField = getLinkField(block);

        if (!linkField || getBlockType(block) !== "button") {
          return;
        }

        if (buttonOpenInNewTabInput.checked) {
          linkField.setAttribute("target", "_blank");
          linkField.setAttribute("rel", "noopener noreferrer");
          return;
        }

        linkField.removeAttribute("target");
        linkField.removeAttribute("rel");
      });
    });

    function bindImageElementInput(input, property) {
      input.addEventListener("input", function handleImageElementInput() {
        updateSelected(function mutateImage(block) {
          var imageField = getImageField(block);
          var captionField = getImageCaptionField(block);

          if (!imageField || getBlockType(block) !== "image") {
            return;
          }

          if (property === "src") {
            imageField.setAttribute("src", input.value || imageField.getAttribute("src"));
            return;
          }

          if (property === "alt") {
            imageField.setAttribute("alt", input.value || "");
            return;
          }

          if (property === "caption" && captionField) {
            captionField.textContent = input.value || " ";
            return;
          }

          if (property === "width") {
            imageField.style.width = input.value;
            return;
          }

          if (property === "height") {
            imageField.style.height = input.value;
            return;
          }

          if (property === "radius") {
            imageField.style.borderRadius = input.value;
            return;
          }

          if (property === "objectFit") {
            imageField.style.objectFit = input.value;
          }
        });
      });
    }

    function bindHeroInput(input, role, property) {
      input.addEventListener("input", function handleHeroInput() {
        updateSelected(function mutateHero(block) {
          var target = getHeroField(block, role);

          if (!target || getBlockType(block) !== "hero") {
            return;
          }

          if (property === "text") {
            target.textContent = input.value || " ";
            return;
          }

          if (property === "href") {
            target.setAttribute("href", input.value || "#");
            return;
          }

          if (property === "color") {
            target.style.color = input.value;
            return;
          }

          if (property === "backgroundColor") {
            target.style.backgroundColor = input.value;
            target.style.backgroundImage = "none";
          }
        });
      });
    }

    function bindCardInput(input, role, property) {
      input.addEventListener("input", function handleCardInput() {
        updateSelected(function mutateCard(block) {
          var target = getCardField(block, role);
          var styleTarget = getStyleTarget(block);

          if (getBlockType(block) !== "card") {
            return;
          }

          if (property === "text" && target) {
            target.textContent = input.value || " ";
            return;
          }

          if (property === "href" && target) {
            target.setAttribute("href", input.value || "#");
            return;
          }

          if (property === "backgroundColor" && styleTarget) {
            styleTarget.style.backgroundColor = input.value;
            styleTarget.style.backgroundImage = "none";
            return;
          }

          if (property === "titleColor" && target) {
            target.style.color = input.value;
            return;
          }

          if (property === "textColor" && target) {
            target.style.color = input.value;
            return;
          }

          if (property === "buttonBackgroundColor" && target) {
            target.style.backgroundColor = input.value;
            target.style.backgroundImage = "none";
            return;
          }

          if (property === "radius" && styleTarget) {
            styleTarget.style.borderRadius = input.value;
            return;
          }

          if (property === "padding" && styleTarget) {
            styleTarget.style.padding = input.value;
          }
        });
      });
    }

    function bindNavbarInput(input, role, property) {
      input.addEventListener("input", function handleNavbarInput() {
        updateSelected(function mutateNavbar(block) {
          var target = getNavbarField(block, role);

          if (!target || getBlockType(block) !== "navbar") {
            return;
          }

          if (property === "text") {
            target.textContent = input.value || " ";
            return;
          }

          if (property === "href") {
            target.setAttribute("href", input.value || "#");
            return;
          }

          if (property === "backgroundColor") {
            target.style.backgroundColor = input.value;
            return;
          }

          if (property === "color") {
            target.style.color = input.value;
          }
        });
      });
    }

    function bindContactFormInput(input, property) {
      input.addEventListener("input", function handleContactFormInput() {
        updateSelected(function mutateContactForm(block) {
          var blockType = getBlockType(block);
          var shell = getStyleTarget(block);
          var nameField = getContactField(block, "name");
          var emailField = getContactField(block, "email");
          var messageField = getContactField(block, "message");
          var buttonField = getContactField(block, "button");
          var textFields;

          if (!isContactBlockType(blockType)) {
            return;
          }

          if (property === "title") {
            var titleField = getContactField(block, "title");

            if (titleField) {
              titleField.textContent = input.value || " ";
            }
            return;
          }

          if (property === "description") {
            var descriptionField = getContactField(block, "description");

            if (descriptionField) {
              descriptionField.textContent = input.value || " ";
            }
            return;
          }

          if (property === "namePlaceholder" && nameField) {
            nameField.setAttribute("placeholder", input.value || "");
            return;
          }

          if (property === "emailPlaceholder" && emailField) {
            emailField.setAttribute("placeholder", input.value || "");
            return;
          }

          if (property === "messagePlaceholder" && messageField) {
            messageField.setAttribute("placeholder", input.value || "");
            return;
          }

          if (property === "buttonText" && buttonField) {
            buttonField.textContent = input.value || " ";
            return;
          }

          if (property === "backgroundColor" && shell) {
            shell.style.backgroundColor = input.value;
            shell.style.backgroundImage = "none";
            return;
          }

          if (property === "inputBackgroundColor") {
            textFields = [nameField, emailField, messageField].filter(Boolean);
            textFields.forEach(function applyInputBackground(field) {
              field.style.backgroundColor = input.value;
              field.style.backgroundImage = "none";
            });
            return;
          }

          if (property === "inputTextColor") {
            textFields = [nameField, emailField, messageField].filter(Boolean);
            textFields.forEach(function applyInputTextColor(field) {
              field.style.color = input.value;
            });
            return;
          }

          if (property === "buttonBackgroundColor" && buttonField) {
            buttonField.style.backgroundColor = input.value;
            buttonField.style.backgroundImage = "none";
            return;
          }

          if (property === "buttonTextColor" && buttonField) {
            buttonField.style.color = input.value;
            return;
          }

          if (property === "radius") {
            textFields = [nameField, emailField, messageField, buttonField].filter(Boolean);

            if (shell) {
              shell.style.borderRadius = input.value;
            }

            textFields.forEach(function applyRadius(field) {
              field.style.borderRadius = input.value;
            });
            return;
          }

          if (property === "padding" && shell) {
            shell.style.padding = input.value;
            return;
          }

          if (property === "width") {
            if (shell && shell !== block) {
              shell.style.width = "";
            }

            block.style.width = input.value;
          }
        });
      });
    }

    function bindDividerInput(input, property) {
      input.addEventListener("input", function handleDividerInput() {
        updateSelected(function mutateDivider(block) {
          var dividerField = getDividerField(block);

          if (!dividerField || getBlockType(block) !== "divider") {
            return;
          }

          if (property === "width") {
            dividerField.style.width = input.value;
            return;
          }

          if (property === "height") {
            dividerField.style.height = "0";
            dividerField.style.borderTopWidth = input.value;
            return;
          }

          if (property === "color") {
            dividerField.style.borderTopColor = input.value;
            return;
          }

          if (property === "style") {
            dividerField.style.borderTopStyle = input.value;
            return;
          }

          if (property === "marginTop") {
            dividerField.style.marginTop = input.value;
            return;
          }

          if (property === "marginBottom") {
            dividerField.style.marginBottom = input.value;
          }
        });
      });
    }

    function bindSpacerInput(input, property) {
      input.addEventListener("input", function handleSpacerInput() {
        updateSelected(function mutateSpacer(block) {
          var spacerField = getSpacerField(block);

          if (!spacerField || getBlockType(block) !== "spacer") {
            return;
          }

          if (property === "height") {
            spacerField.style.height = input.value;
            spacerField.style.minHeight = input.value;
            return;
          }

          if (property === "backgroundColor") {
            spacerField.style.backgroundColor = input.value;
            spacerField.style.backgroundImage = "none";
            return;
          }

          if (property === "radius") {
            spacerField.style.borderRadius = input.value;
            return;
          }

          if (property === "marginTop") {
            block.style.marginTop = input.value;
            return;
          }

          if (property === "marginBottom") {
            block.style.marginBottom = input.value;
          }
        });
      });
    }

    navbarBrandTextInput.addEventListener("input", function handleNavbarBrandText() {
      updateSelected(function mutateNavbar(block) {
        var brand = getNavbarField(block, "brand");

        if (brand) {
          brand.textContent = navbarBrandTextInput.value || " ";
        }
      });
    });

    navbarBrandUrlInput.addEventListener("input", function handleNavbarBrandUrl() {
      updateSelected(function mutateNavbar(block) {
        var brand = getNavbarField(block, "brand");

        if (brand) {
          brand.setAttribute("href", navbarBrandUrlInput.value || "#");
        }
      });
    });

    bindNavbarInput(navbarLink1TextInput, "link-1", "text");
    bindNavbarInput(navbarLink1UrlInput, "link-1", "href");
    bindNavbarInput(navbarLink2TextInput, "link-2", "text");
    bindNavbarInput(navbarLink2UrlInput, "link-2", "href");
    bindNavbarInput(navbarLink3TextInput, "link-3", "text");
    bindNavbarInput(navbarLink3UrlInput, "link-3", "href");
    bindNavbarInput(navbarLink4TextInput, "link-4", "text");
    bindNavbarInput(navbarLink4UrlInput, "link-4", "href");
    bindNavbarInput(navbarCtaTextInput, "cta", "text");
    bindNavbarInput(navbarCtaUrlInput, "cta", "href");

    bindHeroInput(heroBadgeTextInput, "badge", "text");
    bindHeroInput(heroHeadingTextInput, "heading", "text");
    bindHeroInput(heroParagraphTextInput, "paragraph", "text");
    bindHeroInput(heroButtonTextInput, "button", "text");
    bindHeroInput(heroButtonUrlInput, "button", "href");
    bindHeroInput(heroHeadingColorInput, "heading", "color");
    bindHeroInput(heroParagraphColorInput, "paragraph", "color");
    bindHeroInput(heroButtonBackgroundColorInput, "button", "backgroundColor");
    bindHeroInput(heroButtonTextColorInput, "button", "color");

    heroBackgroundColorInput.addEventListener("input", function handleHeroBackground() {
      updateSelected(function mutateHero(block) {
        var shell = getStyleTarget(block);

        if (getBlockType(block) === "hero" && shell) {
          shell.style.backgroundColor = heroBackgroundColorInput.value;
          shell.style.backgroundImage = "none";
        }
      });
    });

    heroAlignInput.addEventListener("change", function handleHeroAlign() {
      updateSelected(function mutateHero(block) {
        var shell = getStyleTarget(block);

        if (getBlockType(block) === "hero" && shell) {
          shell.style.textAlign = heroAlignInput.value;
        }
      });
    });

    bindCardInput(cardLabelTextInput, "label", "text");
    bindCardInput(cardTitleTextInput, "title", "text");
    bindCardInput(cardDescriptionTextInput, "description", "text");
    bindCardInput(cardButtonTextInput, "button", "text");
    bindCardInput(cardButtonUrlInput, "button", "href");
    bindCardInput(cardBackgroundColorInput, "backgroundColor", "backgroundColor");
    bindCardInput(cardTitleColorInput, "title", "titleColor");
    bindCardInput(cardTextColorInput, "description", "textColor");
    bindCardInput(cardButtonBackgroundColorInput, "button", "buttonBackgroundColor");
    bindCardInput(cardRadiusInput, "title", "radius");
    bindCardInput(cardPaddingInput, "title", "padding");

    bindImageElementInput(imageElementUrlInput, "src");
    bindImageElementInput(imageAltTextInput, "alt");
    bindImageElementInput(imageCaptionTextInput, "caption");
    bindImageElementInput(imageWidthInput, "width");
    bindImageElementInput(imageHeightSpecialInput, "height");
    bindImageElementInput(imageRadiusSpecialInput, "radius");

    imageObjectFitInput.addEventListener("change", function handleImageObjectFit() {
      updateSelected(function mutateImage(block) {
        var imageField = getImageField(block);

        if (imageField && getBlockType(block) === "image") {
          imageField.style.objectFit = imageObjectFitInput.value;
        }
      });
    });

    navbarBackgroundColorInput.addEventListener("input", function handleNavbarBackground() {
      updateSelected(function mutateNavbar(block) {
        var shell = getStyleTarget(block);

        if (getBlockType(block) === "navbar" && shell) {
          shell.style.backgroundColor = navbarBackgroundColorInput.value;
        }
      });
    });

    navbarLinkColorInput.addEventListener("input", function handleNavbarLinkColor() {
      updateSelected(function mutateNavbar(block) {
        var links = block.querySelectorAll(".pf-navbar-menu a:not(.pf-navbar-cta)");

        if (getBlockType(block) !== "navbar") {
          return;
        }

        Array.from(links).forEach(function applyLinkColor(link) {
          link.style.color = navbarLinkColorInput.value;
        });
      });
    });

    navbarCtaBackgroundColorInput.addEventListener("input", function handleNavbarCtaBackground() {
      updateSelected(function mutateNavbar(block) {
        var cta = getNavbarField(block, "cta");

        if (cta && getBlockType(block) === "navbar") {
          cta.style.backgroundColor = navbarCtaBackgroundColorInput.value;
          cta.style.backgroundImage = "none";
        }
      });
    });

    navbarCtaTextColorInput.addEventListener("input", function handleNavbarCtaTextColor() {
      updateSelected(function mutateNavbar(block) {
        var cta = getNavbarField(block, "cta");

        if (cta && getBlockType(block) === "navbar") {
          cta.style.color = navbarCtaTextColorInput.value;
        }
      });
    });

    bindContactFormInput(contactFormTitleInput, "title");
    bindContactFormInput(contactFormDescriptionInput, "description");
    bindContactFormInput(contactFormNamePlaceholderInput, "namePlaceholder");
    bindContactFormInput(contactFormEmailPlaceholderInput, "emailPlaceholder");
    bindContactFormInput(contactFormMessagePlaceholderInput, "messagePlaceholder");
    bindContactFormInput(contactFormButtonTextInput, "buttonText");
    bindContactFormInput(contactFormBackgroundColorInput, "backgroundColor");
    bindContactFormInput(contactFormInputBackgroundColorInput, "inputBackgroundColor");
    bindContactFormInput(contactFormInputTextColorInput, "inputTextColor");
    bindContactFormInput(contactFormButtonBackgroundColorInput, "buttonBackgroundColor");
    bindContactFormInput(contactFormButtonTextColorInput, "buttonTextColor");
    bindContactFormInput(contactFormBorderRadiusInput, "radius");
    bindContactFormInput(contactFormPaddingInput, "padding");
    bindContactFormInput(contactFormWidthInput, "width");

    bindDividerInput(dividerWidthInput, "width");
    bindDividerInput(dividerHeightInput, "height");
    bindDividerInput(dividerColorInput, "color");
    bindDividerInput(dividerMarginTopInput, "marginTop");
    bindDividerInput(dividerMarginBottomInput, "marginBottom");

    dividerStyleInput.addEventListener("change", function handleDividerStyleChange() {
      updateSelected(function mutateDivider(block) {
        var dividerField = getDividerField(block);

        if (!dividerField || getBlockType(block) !== "divider") {
          return;
        }

        dividerField.style.borderTopStyle = dividerStyleInput.value;
      });
    });

    dividerAlignInput.addEventListener("change", function handleDividerAlignChange() {
      updateSelected(function mutateDivider(block) {
        var dividerField = getDividerField(block);

        if (!dividerField || getBlockType(block) !== "divider") {
          return;
        }

        setDividerAlignment(dividerField, dividerAlignInput.value);
      });
    });

    bindSpacerInput(spacerHeightInput, "height");
    bindSpacerInput(spacerBackgroundColorInput, "backgroundColor");
    bindSpacerInput(spacerRadiusInput, "radius");
    bindSpacerInput(spacerMarginTopInput, "marginTop");
    bindSpacerInput(spacerMarginBottomInput, "marginBottom");

    function duplicateSelected() {
      if (!selectedBlock) {
        return false;
      }

      var clone = assignFreshMetadata(selectedBlock.cloneNode(true));

      if (selectedBlock.nextSibling) {
        canvas.insertBefore(clone, selectedBlock.nextSibling);
      } else {
        canvas.appendChild(clone);
      }

      setSelectedBlock(clone);
      onStructureChange();
      return true;
    }

    function deleteSelected() {
      if (!selectedBlock) {
        return false;
      }

      var blockToRemove = selectedBlock;
      setSelectedBlock(null);
      blockToRemove.remove();
      onStructureChange();
      return true;
    }

    function moveSelectedUp() {
      if (!selectedBlock || !selectedBlock.previousElementSibling) {
        return false;
      }

      canvas.insertBefore(selectedBlock, selectedBlock.previousElementSibling);
      syncForm();
      onStructureChange();
      return true;
    }

    function moveSelectedDown() {
      if (!selectedBlock || !selectedBlock.nextElementSibling) {
        return false;
      }

      var nextBlock = selectedBlock.nextElementSibling;

      if (nextBlock.nextElementSibling) {
        canvas.insertBefore(selectedBlock, nextBlock.nextElementSibling);
      } else {
        canvas.appendChild(selectedBlock);
      }

      syncForm();
      onStructureChange();
      return true;
    }

    deleteButton.addEventListener("click", deleteSelected);
    duplicateButton.addEventListener("click", duplicateSelected);
    moveUpButton.addEventListener("click", moveSelectedUp);
    moveDownButton.addEventListener("click", moveSelectedDown);

    clearForm();
    toggleFieldAvailability(null);
    refreshActionAvailability();

    return {
      closestBlock: closestBlock,
      getSelectedBlock: function getSelectedBlock() {
        return selectedBlock;
      },
      deleteSelected: deleteSelected,
      duplicateSelected: duplicateSelected,
      moveSelectedUp: moveSelectedUp,
      moveSelectedDown: moveSelectedDown,
      selectBlock: setSelectedBlock,
      normalizeCanvas: function normalizeCanvas() {
        Array.from(canvas.querySelectorAll('[data-block-type="navbar"], [data-type="navbar"], nav.pf-navbar')).forEach(
          function normalizeNavbar(block) {
            ensureNavbarStructure(block);
          }
        );
        Array.from(canvas.querySelectorAll('[data-block-type="footer"]')).forEach(function normalizeFooter(block) {
          ensureFooterStructure(block);
        });
        Array.from(canvas.querySelectorAll('[data-block-type="contact"], [data-type="contact"], [data-block-type="contact-form"], [data-type="contact-form"]')).forEach(function normalizeContactForm(block) {
          ensureContactFormStructure(block);
        });
      },
      refresh: syncForm,
      clearSelection: function clearSelection() {
        setSelectedBlock(null);
      }
    };
  }

  PageForge.createEditor = createEditor;
})(window.PageForge);
