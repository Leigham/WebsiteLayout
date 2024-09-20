class CustomNavbar extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    try {
      // Fetch the external HTML template
      const response = await fetch("/public/components/navbar.html");

      if (!response.ok) {
        throw new Error(
          `Failed to load navbar template: ${response.statusText}`
        );
      }

      const templateText = await response.text();

      // Insert the fetched HTML into the light DOM
      this.innerHTML = templateText;

      // Attach event listeners after the HTML is loaded
      this.attachEventListeners();

      // Highlight the active link based on the 'active-page' attribute
      this.highlightActiveLink();
    } catch (error) {
      console.error(error);
      this.innerHTML = `<p class="text-red-500">Failed to load navbar.</p>`;
    }
  }

  attachEventListeners() {
    const menuButton = this.querySelector("#menu-button");
    const closeButton = this.querySelector("#close-menu-button");
    const mobileMenu = this.querySelector("#mobile-menu");
    const menuIcon = this.querySelector("#menu-icon");

    if (menuButton && mobileMenu && menuIcon && closeButton) {
      console.log(
        "Menu button, mobile menu, menu icon, and close button found."
      );

      // Open menu when clicking the menu button
      menuButton.addEventListener("click", (event) => {
        console.log("Menu button clicked");
        event.stopPropagation();

        const isMenuOpen = mobileMenu.classList.contains("hidden");
        console.log("Is menu open before toggle:", isMenuOpen);

        mobileMenu.classList.toggle("hidden", !isMenuOpen);
        menuButton.setAttribute("aria-expanded", String(isMenuOpen));

        if (isMenuOpen) {
          menuIcon.setAttribute("d", "M6 18L18 6M6 6l12 12"); // X Icon
        } else {
          menuIcon.setAttribute("d", "M4 6h16M4 12h16M4 18h16"); // Hamburger Icon
        }

        console.log("Menu Open after toggle:", isMenuOpen);
      });

      // Close the menu when clicking the close button
      closeButton.addEventListener("click", (event) => {
        console.log("Close button clicked");
        event.stopPropagation();

        mobileMenu.classList.add("hidden");
        menuButton.setAttribute("aria-expanded", "false");
        menuIcon.setAttribute("d", "M4 6h16M4 12h16M4 18h16");

        console.log("Menu closed via close button");
      });

      // Optional: Close the menu when clicking outside
      document.addEventListener("click", (event) => {
        const isClickInside =
          menuButton.contains(event.target) ||
          mobileMenu.contains(event.target) ||
          closeButton.contains(event.target);

        if (!isClickInside && !mobileMenu.classList.contains("hidden")) {
          console.log("Closing menu by clicking outside");
          mobileMenu.classList.add("hidden");
          menuButton.setAttribute("aria-expanded", "false");
          menuIcon.setAttribute("d", "M4 6h16M4 12h16M4 18h16");
        }
      });
    } else {
      console.error(
        "Menu button, mobile menu, menu icon, or close button not found."
      );
    }
  }

  highlightActiveLink() {
    const activePage = this.getAttribute("active-page");

    if (!activePage) return;

    const links = this.querySelectorAll("#mobile-menu a, .md\\:flex a");

    links.forEach((link) => {
      // Remove active classes
      link.classList.remove("active-link");
      link.classList.add(
        "p-2",
        "rounded-lg",
        "hover:text-blue-500",
        "transition-colors",
        "duration-300",
        "opacity-90"
      );
    });

    // Find the link matching activePage
    const activeLink = Array.from(links).find(
      (link) =>
        console.log(link.textContent.trim().toLowerCase()) ||
        link.textContent.trim().toLowerCase() === activePage.toLowerCase()
    );
    console.log("Active link:", activeLink);
    if (activeLink) {
      // make the active link stand out
      activeLink.classList.add("scale-110");
    }
  }

  static get observedAttributes() {
    return ["active-page"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "active-page" && oldValue !== newValue) {
      this.highlightActiveLink();
    }
  }
}

// Define the custom element
customElements.define("custom-navbar", CustomNavbar);
