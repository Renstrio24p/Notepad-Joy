const sanitizeInput = (input: string): string => {
  const element = document.createElement("div");
  element.innerText = input;
  return element.innerHTML;
};

export const useAnchorSingle = (
  element: HTMLAnchorElement,
  href: string,
  ariaLabel: string,
  className?: string,
  childElement?: HTMLElement
) => {
  if (!element) return;

  // Sanitize input values
  const sanitizedHref = sanitizeInput(href);
  const sanitizedAriaLabel = sanitizeInput(ariaLabel);
  const sanitizedClassName = className ? sanitizeInput(className) : undefined;

  // Set sanitized attributes
  element.setAttribute("href", sanitizedHref);
  element.setAttribute("aria-label", sanitizedAriaLabel);

  if (sanitizedClassName) {
    element.className = sanitizedClassName;
  }

  // Handle child elements if provided
  if (childElement) {
    element.innerHTML = ""; // Clear existing content
    element.appendChild(childElement); // Append new child
  }

  // Click event listener for navigation
  element.addEventListener("click", e => {
    e.preventDefault(); // Prevent default anchor behavior
    const target = e.currentTarget as HTMLAnchorElement;
    const href = target.getAttribute("href");
    if (href) {
      const scrollPosition = window.scrollY; // Capture current scroll position
      window.scrollTo(0, 0); // Scroll to top
      window.history.pushState({ scrollPosition }, "", href); // Update history
      const navEvent = new PopStateEvent("popstate");
      window.dispatchEvent(navEvent); // Trigger navigation event
    }
  });

  // Handle back/forward navigation
  window.addEventListener("popstate", e => {
    const state = e.state as { scrollPosition?: number };
    if (state && state.scrollPosition !== undefined) {
      window.scrollTo(0, state.scrollPosition); // Restore scroll position
    }
  });
};
