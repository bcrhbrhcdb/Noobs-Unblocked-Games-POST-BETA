function executeBookmarklet(element) {
    var filePath = element.getAttribute('data-file-paths');
  
    fetch(filePath)
      .then(function(response) {
        return response.text();
      })
      .then(function(data) {
        // Update the link's href with the bookmarklet code
        element.href = data.trim();
      })
      .catch(function(error) {
        console.error('Error reading file:', error);
      });
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    var bookmarkletLinks = document.querySelectorAll('a[data-file-paths]');
  
    bookmarkletLinks.forEach(function(link) {
      link.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default link behavior
        executeBookmarklet(this);
      });
    });
  });