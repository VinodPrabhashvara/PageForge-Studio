window.PageForge = window.PageForge || {};

(function setupTemplates(PageForge) {
  var placeholderImage =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700">' +
        '<defs>' +
          '<linearGradient id="g" x1="0" x2="1" y1="0" y2="1">' +
            '<stop offset="0%" stop-color="#1f2c46"/>' +
            '<stop offset="100%" stop-color="#6f9bff"/>' +
          "</linearGradient>" +
        "</defs>" +
        '<rect width="1200" height="700" fill="url(#g)"/>' +
        '<circle cx="230" cy="180" r="86" fill="rgba(255,255,255,0.16)"/>' +
        '<circle cx="930" cy="150" r="120" fill="rgba(255,255,255,0.12)"/>' +
        '<rect x="120" y="410" width="960" height="150" rx="26" fill="rgba(255,255,255,0.1)"/>' +
        '<text x="600" y="330" fill="#f6f9ff" font-family="Arial, sans-serif" font-size="62" text-anchor="middle">PageForge Studio</text>' +
        '<text x="600" y="395" fill="#d5e2ff" font-family="Arial, sans-serif" font-size="28" text-anchor="middle">Replace this placeholder with your own image URL</text>' +
      "</svg>"
    );

  var templateDefinitions = {
    heading: {
      label: "Heading",
      html:
        '<article class="pf-block pf-heading" data-block-type="heading">' +
          '<div class="pf-block__handle"><strong>Heading</strong><span>Drag to reorder</span></div>' +
          '<div class="pf-block__content pf-edit-surface">' +
            '<h2 data-field="primary" style="font-size: 2.25rem; color: rgb(23, 32, 44);">Bring clarity to your headline in seconds.</h2>' +
          "</div>" +
        "</article>"
    },
    paragraph: {
      label: "Paragraph",
      html:
        '<article class="pf-block pf-paragraph" data-block-type="paragraph">' +
          '<div class="pf-block__handle"><strong>Paragraph</strong><span>Drag to reorder</span></div>' +
          '<div class="pf-block__content pf-edit-surface">' +
            '<p data-field="primary" style="font-size: 1rem; color: rgb(81, 96, 116);">Use this paragraph block to explain your offer, introduce a section, or reinforce the message around a call to action.</p>' +
          "</div>" +
        "</article>"
    },
    button: {
      label: "Button",
      html:
        '<article class="pf-block pf-button" data-block-type="button">' +
          '<div class="pf-block__handle"><strong>Button</strong><span>Drag to reorder</span></div>' +
          '<div class="pf-block__content pf-edit-surface" style="text-align: left;">' +
            '<a class="pf-button-link" data-field="primary" data-link-field="href" href="#get-started">Get started</a>' +
          "</div>" +
        "</article>"
    },
    image: {
      label: "Image",
      html:
        '<article class="pf-block pf-image" data-block-type="image">' +
          '<div class="pf-block__handle"><strong>Image</strong><span>Drag to reorder</span></div>' +
          '<figure class="pf-image-frame pf-edit-surface">' +
            '<img class="pf-image-media" data-image-field="src" src="' + placeholderImage + '" alt="Placeholder image">' +
            '<figcaption data-field="primary" style="font-size: 1rem; color: rgb(90, 104, 124);">Add a caption or a quick note for this visual.</figcaption>' +
          "</figure>" +
        "</article>"
    },
    hero: {
      label: "Hero Section",
      html:
        '<article class="pf-block pf-hero" data-block-type="hero">' +
          '<div class="pf-block__handle"><strong>Hero Section</strong><span>Drag to reorder</span></div>' +
          '<section class="pf-hero-shell pf-edit-surface" style="text-align: left;">' +
            '<span class="pf-hero-badge">Launch Faster</span>' +
            '<h1 data-field="primary" style="font-size: 3rem; color: rgb(245, 248, 255);">Design a confident first impression without touching a framework.</h1>' +
            '<p class="pf-hero-copy">Pair a clear headline with supporting proof and a strong call to action to shape a landing page that feels intentional.</p>' +
            '<a class="pf-button-link" data-link-field="href" href="#learn-more">Learn more</a>' +
          "</section>" +
        "</article>"
    },
    card: {
      label: "Card",
      html:
        '<article class="pf-block pf-card" data-block-type="card">' +
          '<div class="pf-block__handle"><strong>Card</strong><span>Drag to reorder</span></div>' +
          '<section class="pf-card-shell pf-edit-surface" style="text-align: left;">' +
            '<p class="pf-card-meta">Featured Offer</p>' +
            '<h3 data-field="primary" style="font-size: 1.75rem; color: rgb(23, 32, 44);">Create polished feature cards for products or services.</h3>' +
            '<p>Use cards to spotlight a value proposition, pricing plan, case study, or onboarding step in a format that stays easy to scan.</p>' +
            '<a class="pf-button-link" data-link-field="href" href="#details">View details</a>' +
          "</section>" +
        "</article>"
    },
    navbar: {
      label: "Navbar",
      html:
        '<div class="editable-element" data-block-type="navbar" data-type="navbar">' +
          '<div class="element-header"><span>Navbar</span><span>Drag to reorder</span></div>' +
          '<nav class="pf-navbar">' +
            '<a class="pf-navbar-brand" data-field="primary" data-navbar-role="brand" href="#" style="font-size: 1.05rem; color: rgb(246, 249, 255);">Lumio One</a>' +
            '<button class="pf-navbar-toggle" aria-label="Toggle navigation">☰</button>' +
            '<div class="pf-navbar-menu">' +
              '<a data-navbar-role="link-1" href="#features">Features</a>' +
              '<a data-navbar-role="link-2" href="#materials">Materials</a>' +
              '<a data-navbar-role="link-3" href="#reviews">Reviews</a>' +
              '<a class="pf-navbar-cta" data-navbar-role="cta" href="#buy">Buy</a>' +
            "</div>" +
          "</nav>" +
        "</div>"
    },
    footer: {
      label: "Footer",
      html:
        '<article class="pf-block pf-footer" data-block-type="footer">' +
          '<div class="pf-block__handle"><strong>Footer</strong><span>Drag to reorder</span></div>' +
          '<footer class="pf-footer-shell pf-edit-surface" style="text-align: left;">' +
            '<strong data-field="primary" data-footer-role="brand" style="font-size: 1.05rem; color: rgb(234, 240, 251);">PageForge Studio</strong>' +
            '<p class="pf-footer-description" data-footer-role="description">Build offline. Export cleanly. Publish anywhere.</p>' +
            '<div class="pf-footer-links">' +
              '<a class="pf-footer-link" data-footer-role="link-1" href="#about">About</a>' +
              '<a class="pf-footer-link" data-footer-role="link-2" href="#privacy">Privacy</a>' +
              '<a class="pf-footer-link" data-footer-role="link-3" href="#contact">Contact</a>' +
            '</div>' +
            '<p class="pf-footer-copyright" data-footer-role="copyright">Copyright 2026 PageForge Studio. All rights reserved.</p>' +
          "</footer>" +
        "</article>"
    },
    contact: {
      label: "Contact Form",
      html:
        '<article class="pf-block pf-contact" data-block-type="contact-form">' +
          '<div class="pf-block__handle"><strong>Contact Form</strong><span>Drag to reorder</span></div>' +
          '<section class="pf-contact-shell pf-edit-surface" style="text-align: left;">' +
            '<h3 data-field="primary" data-contact-role="title" style="font-size: 1.8rem; color: rgb(23, 32, 44);">Start the conversation with a simple contact form.</h3>' +
            '<p data-contact-role="description">Collect interest, project briefs, or follow-up requests with a section that already feels production ready.</p>' +
            '<form class="pf-form-grid" data-contact-role="form">' +
              '<input data-contact-role="name" type="text" placeholder="Your name">' +
              '<input data-contact-role="email" type="email" placeholder="Email address">' +
              '<textarea data-contact-role="message" placeholder="Tell us about your project"></textarea>' +
              '<button class="pf-button-link" data-contact-role="button" type="button">Send message</button>' +
            "</form>" +
          "</section>" +
        "</article>"
    },
    "contact-form": {
      label: "Contact Form",
      html:
        '<article class="pf-block pf-contact" data-block-type="contact-form">' +
          '<div class="pf-block__handle"><strong>Contact Form</strong><span>Drag to reorder</span></div>' +
          '<section class="pf-contact-shell pf-edit-surface" style="text-align: left;">' +
            '<h3 data-field="primary" data-contact-role="title" style="font-size: 1.8rem; color: rgb(23, 32, 44);">Start the conversation with a simple contact form.</h3>' +
            '<p data-contact-role="description">Collect interest, project briefs, or follow-up requests with a section that already feels production ready.</p>' +
            '<form class="pf-form-grid" data-contact-role="form">' +
              '<input data-contact-role="name" type="text" placeholder="Your name">' +
              '<input data-contact-role="email" type="email" placeholder="Email address">' +
              '<textarea data-contact-role="message" placeholder="Tell us about your project"></textarea>' +
              '<button class="pf-button-link" data-contact-role="button" type="button">Send message</button>' +
            "</form>" +
          "</section>" +
        "</article>"
    },
    divider: {
      label: "Divider",
      html:
        '<article class="pf-block pf-divider" data-block-type="divider">' +
          '<div class="pf-block__handle"><strong>Divider</strong><span>Drag to reorder</span></div>' +
          '<div class="pf-block__content pf-edit-surface">' +
            '<hr class="pf-divider-line">' +
          "</div>" +
        "</article>"
    },
    spacer: {
      label: "Spacer",
      html:
        '<article class="pf-block pf-spacer" data-block-type="spacer">' +
          '<div class="pf-block__handle"><strong>Spacer</strong><span>Drag to reorder</span></div>' +
          '<div class="pf-block__content pf-edit-surface">' +
            '<div class="pf-spacer-fill" data-field="primary" style="font-size: 0.95rem; color: rgb(118, 131, 154); min-height: 72px;">Spacer</div>' +
          "</div>" +
        "</article>"
    }
  };

  function createUniqueId() {
    return "pf-" + Date.now() + "-" + Math.random().toString(16).slice(2, 8);
  }

  function createElementFromHTML(html) {
    var wrapper = document.createElement("template");
    wrapper.innerHTML = html.trim();
    return wrapper.content.firstElementChild;
  }

  function assignBlockMetadata(block) {
    var blockId = createUniqueId();
    var blockType = block.dataset.blockType || block.dataset.type || "";

    block.dataset.blockId = blockId;
    block.dataset.id = blockId;
    block.dataset.type = blockType;
    block.setAttribute("draggable", "true");
    block.classList.add("editable-element");
    return block;
  }

  function createBlock(type) {
    var definition = templateDefinitions[type];

    if (!definition) {
      throw new Error("Unknown template type: " + type);
    }

    return assignBlockMetadata(createElementFromHTML(definition.html));
  }

  function setText(block, selector, value) {
    var target = block.querySelector(selector);

    if (target) {
      target.textContent = value;
    }
  }

  function setMarkup(block, selector, value) {
    var target = block.querySelector(selector);

    if (target) {
      target.innerHTML = value;
    }
  }

  function setLink(block, selector, label, href) {
    var target = block.querySelector(selector);

    if (target) {
      target.textContent = label;
      target.setAttribute("href", href);
    }
  }

  function setImage(block, src, alt, caption) {
    var image = block.querySelector("[data-image-field='src']");
    var text = block.querySelector("[data-field='primary']");

    if (image) {
      image.setAttribute("src", src);
      image.setAttribute("alt", alt);
    }

    if (text) {
      text.textContent = caption;
    }
  }

  function applyStyles(block, selector, styles) {
    var target = selector ? block.querySelector(selector) : block;

    if (!target) {
      return;
    }

    Object.keys(styles).forEach(function applyStyle(key) {
      target.style[key] = styles[key];
    });
  }

  function setExportSection(block, sectionName, tone) {
    if (!block) {
      return;
    }

    block.dataset.exportSection = sectionName;
    block.dataset.exportTone = tone;
  }

  function buildPortfolioTemplate() {
    var navbar = createBlock("navbar");
    var hero = createBlock("hero");
    var intro = createBlock("paragraph");
    var projectOne = createBlock("card");
    var projectTwo = createBlock("card");
    var projectThree = createBlock("card");
    var showcase = createBlock("image");
    var contact = createBlock("contact");
    var footer = createBlock("footer");

    setLink(navbar, '[data-navbar-role="brand"]', "Avery Lane Studio", "#home");
    setLink(navbar, '[data-navbar-role="link-1"]', "Work", "#work");
    setLink(navbar, '[data-navbar-role="link-2"]', "Services", "#services");
    setLink(navbar, '[data-navbar-role="link-3"]', "Journal", "#journal");
    setLink(navbar, '[data-navbar-role="cta"]', "Book a call", "#book-call");

    setText(hero, ".pf-hero-badge", "Portfolio Template");
    setText(hero, "[data-field='primary']", "Portfolio sites that make creative work feel premium.");
    setText(
      hero,
      ".pf-hero-copy",
      "Present photography, branding, and selected client stories inside a calm, editorial layout that feels intentional on every screen."
    );
    setLink(hero, ".pf-button-link", "View selected work", "#selected-work");
    applyStyles(hero, ".pf-hero-shell", {
      background:
        "radial-gradient(circle at top right, rgba(227, 174, 123, 0.24), transparent 34%), linear-gradient(145deg, rgb(20, 24, 35) 0%, rgb(55, 39, 34) 100%)"
    });

    setText(
      intro,
      "[data-field='primary']",
      "I help founders, fashion labels, and lifestyle brands translate visual identity into polished digital experiences with clear structure and strong storytelling."
    );
    applyStyles(intro, ".pf-edit-surface", {
      backgroundColor: "rgb(250, 247, 242)",
      borderRadius: "24px",
      padding: "32px"
    });
    applyStyles(intro, "[data-field='primary']", {
      fontSize: "1.08rem",
      lineHeight: "1.8",
      color: "rgb(82, 75, 67)"
    });

    setImage(
      showcase,
      placeholderImage,
      "Editorial portfolio placeholder",
      "Featured campaign: Editorial product portraits, motion snippets, and launch assets for a seasonal collection."
    );

    setText(projectOne, ".pf-card-meta", "Case Study 01");
    setText(projectOne, "[data-field='primary']", "Brand storytelling for an independent fragrance label.");
    setText(projectOne, ".pf-card-shell p:last-of-type", "A grounded launch page built to spotlight imagery, copy rhythm, and campaign credibility.");
    setLink(projectOne, ".pf-button-link", "Open project", "#project-one");

    setText(projectTwo, ".pf-card-meta", "Case Study 02");
    setText(projectTwo, "[data-field='primary']", "A fashion portfolio that keeps the work at the center.");
    setText(projectTwo, ".pf-card-shell p:last-of-type", "Flexible modular sections for lookbooks, editorials, and campaign-level storytelling.");
    setLink(projectTwo, ".pf-button-link", "Open project", "#project-two");

    setText(projectThree, ".pf-card-meta", "Case Study 03");
    setText(projectThree, "[data-field='primary']", "Creative direction site for a studio moving into premium clients.");
    setText(projectThree, ".pf-card-shell p:last-of-type", "Quiet, confident layouts that let credentials, stills, and proof-of-work land clearly.");
    setLink(projectThree, ".pf-button-link", "Open project", "#project-three");

    setText(contact, "[data-field='primary']", "Booking a creative partner for your next launch?");
    setText(
      contact,
      ".pf-contact-shell p",
      "Share your project window, visual direction, and deliverables, and turn this section into a polished inquiry experience."
    );

    setText(footer, "[data-field='primary']", "Avery Lane Studio");
    setText(footer, ".pf-footer-shell p", "Portfolio template for photographers, designers, and visual storytellers.");

    setExportSection(navbar, "portfolio-nav", "dark");
    setExportSection(hero, "portfolio-intro", "dark");
    setExportSection(intro, "portfolio-intro", "dark");
    setExportSection(showcase, "portfolio-showcase", "light");
    setExportSection(projectOne, "portfolio-projects", "muted");
    setExportSection(projectTwo, "portfolio-projects", "muted");
    setExportSection(projectThree, "portfolio-projects", "muted");
    setExportSection(contact, "portfolio-cta", "dark");
    setExportSection(footer, "portfolio-footer", "dark");

    applyStyles(intro, ".pf-edit-surface", {
      backgroundColor: "transparent",
      borderRadius: "0",
      padding: "0 0 12px"
    });
    applyStyles(intro, "[data-field='primary']", {
      color: "rgb(216, 224, 238)",
      maxWidth: "62ch"
    });
    applyStyles(contact, ".pf-contact-shell", {
      background: "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
      borderRadius: "28px"
    });
    applyStyles(contact, '[data-contact-role="title"]', {
      color: "rgb(245, 248, 255)"
    });
    applyStyles(contact, '[data-contact-role="description"]', {
      color: "rgb(201, 213, 233)"
    });

    return [navbar, hero, intro, showcase, projectOne, projectTwo, projectThree, contact, footer];
  }

  function buildBusinessTemplate() {
    var navbar = createBlock("navbar");
    var hero = createBlock("hero");
    var proof = createBlock("paragraph");
    var serviceOne = createBlock("card");
    var serviceTwo = createBlock("card");
    var serviceThree = createBlock("card");
    var contact = createBlock("contact");
    var footer = createBlock("footer");

    setLink(navbar, '[data-navbar-role="brand"]', "Northstar Advisory", "#home");
    setLink(navbar, '[data-navbar-role="link-1"]', "Services", "#services");
    setLink(navbar, '[data-navbar-role="link-2"]', "Process", "#process");
    setLink(navbar, '[data-navbar-role="link-3"]', "Results", "#results");
    setLink(navbar, '[data-navbar-role="cta"]', "Start now", "#book-call");

    setText(hero, ".pf-hero-badge", "Business Landing Page");
    setText(hero, "[data-field='primary']", "Turn interested visitors into booked strategy calls.");
    setText(
      hero,
      ".pf-hero-copy",
      "Use a clear offer, proof-driven messaging, and a focused call to action to guide founders from curiosity to consultation."
    );
    setLink(hero, ".pf-button-link", "Book a strategy session", "#book-call");
    applyStyles(hero, ".pf-hero-shell", {
      background:
        "radial-gradient(circle at top right, rgba(111, 202, 172, 0.24), transparent 34%), linear-gradient(145deg, rgb(14, 25, 39) 0%, rgb(18, 59, 62) 100%)"
    });

    setText(
      proof,
      "[data-field='primary']",
      "Built for consultants, agencies, and service-led businesses that need sharper positioning, faster lead capture, and a cleaner conversion path."
    );
    applyStyles(proof, ".pf-edit-surface", {
      backgroundColor: "rgb(245, 250, 249)",
      borderRadius: "24px",
      padding: "30px"
    });

    setText(serviceOne, ".pf-card-meta", "Offer Clarity");
    setText(serviceOne, "[data-field='primary']", "Explain exactly what you do in seconds.");
    setText(serviceOne, ".pf-card-shell p:last-of-type", "Use this section to simplify your value proposition and remove friction from the first scroll.");
    setLink(serviceOne, ".pf-button-link", "See how it works", "#offer");

    setText(serviceTwo, ".pf-card-meta", "Lead Capture");
    setText(serviceTwo, "[data-field='primary']", "Direct visitors toward one strong conversion path.");
    setText(serviceTwo, ".pf-card-shell p:last-of-type", "Move from passive page visits to inquiry-ready conversations with stronger structure and CTA placement.");
    setLink(serviceTwo, ".pf-button-link", "Review the flow", "#leads");

    setText(serviceThree, ".pf-card-meta", "Trust Signals");
    setText(serviceThree, "[data-field='primary']", "Build credibility with outcomes, testimonials, and process.");
    setText(serviceThree, ".pf-card-shell p:last-of-type", "Swap this content for client proof, measurable results, and the delivery process behind your service.");
    setLink(serviceThree, ".pf-button-link", "Show proof", "#results");

    setText(contact, "[data-field='primary']", "Let’s map the next version of your lead funnel.");
    setText(
      contact,
      ".pf-contact-shell p",
      "Use this form as your call booking handoff, discovery request, or short project intake with fast follow-up."
    );

    setText(footer, "[data-field='primary']", "Northstar Advisory");
    setText(footer, ".pf-footer-shell p", "Business landing page template for consultants, studios, and service brands.");

    setExportSection(navbar, "business-nav", "dark");
    setExportSection(hero, "business-intro", "dark");
    setExportSection(proof, "business-intro", "dark");
    setExportSection(serviceOne, "business-services", "muted");
    setExportSection(serviceTwo, "business-services", "muted");
    setExportSection(serviceThree, "business-services", "muted");
    setExportSection(contact, "business-cta", "dark");
    setExportSection(footer, "business-footer", "dark");

    applyStyles(proof, ".pf-edit-surface", {
      backgroundColor: "transparent",
      borderRadius: "0",
      padding: "0 0 8px"
    });
    applyStyles(proof, "[data-field='primary']", {
      color: "rgb(214, 230, 227)",
      maxWidth: "62ch"
    });
    applyStyles(contact, ".pf-contact-shell", {
      background: "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
      borderRadius: "28px"
    });
    applyStyles(contact, '[data-contact-role="title"]', {
      color: "rgb(245, 248, 255)"
    });
    applyStyles(contact, '[data-contact-role="description"]', {
      color: "rgb(201, 223, 220)"
    });

    return [navbar, hero, proof, serviceOne, serviceTwo, serviceThree, contact, footer];
  }

  function buildProductTemplate() {
    var navbar = createBlock("navbar");
    var hero = createBlock("hero");
    var productShot = createBlock("image");
    var summary = createBlock("paragraph");
    var featureOne = createBlock("card");
    var featureTwo = createBlock("card");
    var featureThree = createBlock("card");
    var buyButton = createBlock("button");
    var footer = createBlock("footer");

    setLink(navbar, '[data-navbar-role="brand"]', "Lumio One", "#home");
    setLink(navbar, '[data-navbar-role="link-1"]', "Features", "#features");
    setLink(navbar, '[data-navbar-role="link-2"]', "Materials", "#materials");
    setLink(navbar, '[data-navbar-role="link-3"]', "Reviews", "#reviews");
    setLink(navbar, '[data-navbar-role="cta"]', "Buy", "#buy");

    setText(hero, ".pf-hero-badge", "Product Page Template");
    setText(hero, "[data-field='primary']", "A product story built for focus, comfort, and conversion.");
    setText(
      hero,
      ".pf-hero-copy",
      "Launch a hardware or digital product with a confident headline, high-contrast visuals, and modular sections for features and buying cues."
    );
    setLink(hero, ".pf-button-link", "Pre-order now", "#buy-now");
    applyStyles(hero, ".pf-hero-shell", {
      background:
        "radial-gradient(circle at top right, rgba(143, 189, 255, 0.24), transparent 34%), linear-gradient(145deg, rgb(13, 18, 29) 0%, rgb(29, 41, 64) 100%)"
    });

    setImage(
      productShot,
      placeholderImage,
      "Product preview placeholder",
      "Swap this placeholder for a sharp product render, lifestyle image, or UI mockup to anchor the story visually."
    );

    setText(
      summary,
      "[data-field='primary']",
      "Use this template for launch pages, waitlists, or direct-to-consumer products where design needs to make the product feel credible before the visitor reads every detail."
    );

    setText(featureOne, ".pf-card-meta", "Feature 01");
    setText(featureOne, "[data-field='primary']", "Adaptive lighting tuned for work sessions.");
    setText(featureOne, ".pf-card-shell p:last-of-type", "Show how the product improves daily use with clear utility, not vague marketing language.");
    setLink(featureOne, ".pf-button-link", "Read feature", "#feature-one");

    setText(featureTwo, ".pf-card-meta", "Feature 02");
    setText(featureTwo, "[data-field='primary']", "Materials and finish that feel premium on the desk.");
    setText(featureTwo, ".pf-card-shell p:last-of-type", "Use this space for materials, engineering choices, packaging details, or compatibility notes.");
    setLink(featureTwo, ".pf-button-link", "Read feature", "#feature-two");

    setText(featureThree, ".pf-card-meta", "Feature 03");
    setText(featureThree, "[data-field='primary']", "Conversion-ready modules for pricing, social proof, and urgency.");
    setText(featureThree, ".pf-card-shell p:last-of-type", "Replace this section with reviews, launch perks, guarantees, or a fast path toward checkout.");
    setLink(featureThree, ".pf-button-link", "Read feature", "#feature-three");

    setText(buyButton, "[data-field='primary']", "Reserve your unit");
    setLink(buyButton, ".pf-button-link", "Reserve your unit", "#buy-now");
    applyStyles(buyButton, ".pf-edit-surface", { textAlign: "center", padding: "34px" });

    setText(footer, "[data-field='primary']", "Lumio One");
    setText(footer, ".pf-footer-shell p", "Product page template for launches, waitlists, and polished direct-to-consumer releases.");

    setExportSection(navbar, "product-nav", "dark");
    setExportSection(hero, "product-story", "dark");
    setExportSection(productShot, "product-story", "dark");
    setExportSection(summary, "product-story", "dark");
    setExportSection(featureOne, "product-features", "light");
    setExportSection(featureTwo, "product-features", "light");
    setExportSection(featureThree, "product-features", "light");
    setExportSection(buyButton, "product-cta", "dark");
    setExportSection(footer, "product-footer", "dark");

    applyStyles(summary, ".pf-edit-surface", {
      backgroundColor: "transparent",
      borderRadius: "0",
      padding: "0 0 8px"
    });
    applyStyles(summary, "[data-field='primary']", {
      color: "rgb(210, 220, 240)",
      maxWidth: "64ch"
    });
    applyStyles(buyButton, ".pf-edit-surface", {
      textAlign: "center",
      padding: "12px 0 0",
      backgroundColor: "transparent"
    });

    return [navbar, hero, productShot, summary, featureOne, featureTwo, featureThree, buyButton, footer];
  }

  var pageTemplateBuilders = {
    portfolio: buildPortfolioTemplate,
    business: buildBusinessTemplate,
    product: buildProductTemplate
  };

  function buildPageTemplate(name) {
    var builder = pageTemplateBuilders[name];

    if (!builder) {
      throw new Error("Unknown page template: " + name);
    }

    return builder();
  }

  function buildStarterPage() {
    return [];
  }

  PageForge.templates = templateDefinitions;
  PageForge.pageTemplates = {
    portfolio: { label: "Portfolio" },
    business: { label: "Business Landing Page" },
    product: { label: "Product Page" }
  };
  PageForge.placeholderImage = placeholderImage;
  PageForge.assignBlockMetadata = assignBlockMetadata;
  PageForge.createBlock = createBlock;
  PageForge.buildPageTemplate = buildPageTemplate;
  PageForge.buildStarterPage = buildStarterPage;
})(window.PageForge);
