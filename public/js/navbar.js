class CustomNavbar extends HTMLElement {
  constructor() {
    super();

    // Create a template for the navbar
    const template = document.createElement("template");
    template.innerHTML = `
      <nav class="bg-gray-800">
        <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div class="relative flex h-16 items-center justify-between">
            <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                id="mobile-menu-button"
                type="button"
                class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span class="sr-only">Open main menu</span>
                <svg
                  id="menu-icon-open"
                  class="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>

                <svg
                  id="menu-icon-close"
                  class="hidden h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div class="flex flex-shrink-0 items-center">
                <img
                  class="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                  alt="Your Company"
                />
              </div>
              <div class="hidden sm:ml-6 sm:block">
                <div class="flex space-x-4">
                  <a
                    href="/"
                    class="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                    aria-current="page"
                    >Home</a
                  >
                  <a
                    href="/about"
                    class="text-white px-3 py-2 rounded-md text-sm font-medium"
                    >About</a
                  >
                  <a
                    href="/hobbies"
                    class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >Hobbies</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="sm:hidden hidden" id="mobile-menu">
          <div class="space-y-1 px-2 pb-3 pt-2">
            <a
              href="/"
              class="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
              aria-current="page"
              >Home</a>
            <a
              href="/about"
              class="block rounded-md px-3 py-2 text-base font-medium text-white"
              >About</a>
            <a
              href="/hobbies"
              class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >Hobbies</a>
          </div>
        </div>
      </nav>
    `;

    // Append the template content directly to the light DOM (main document)
    this.appendChild(template.content.cloneNode(true));

    // Attach event listeners for the mobile menu functionality
    const mobileMenuButton = this.querySelector("#mobile-menu-button");
    const mobileMenu = this.querySelector("#mobile-menu");
    const menuIconOpen = this.querySelector("#menu-icon-open");
    const menuIconClose = this.querySelector("#menu-icon-close");

    mobileMenuButton.addEventListener("click", () => {
      const isMenuOpen = mobileMenu.classList.contains("hidden");
      mobileMenu.classList.toggle("hidden", !isMenuOpen);

      menuIconOpen.classList.toggle("hidden", isMenuOpen);
      menuIconClose.classList.toggle("hidden", !isMenuOpen);
    });
  }
}

// Define the custom element
customElements.define("custom-navbar", CustomNavbar);
