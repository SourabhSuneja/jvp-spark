(function() {
  // Function to set or update the viewport meta tag
  function setViewport() {
    let viewportTag = document.querySelector("meta[name=viewport]");

    const newContent = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";

    if (viewportTag) {
      // If tag exists, update its content
      viewportTag.setAttribute("content", newContent);
    } else {
      // If tag doesn't exist, create and append it
      viewportTag = document.createElement("meta");
      viewportTag.setAttribute("name", "viewport");
      viewportTag.setAttribute("content", newContent);
      document.head.appendChild(viewportTag);
    }
  }

  // Run the function on DOM content load
  // Use 'DOMContentLoaded' to ensure <head> is available
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setViewport);
  } else {
    // DOM is already loaded
    setViewport();
  }
})();
