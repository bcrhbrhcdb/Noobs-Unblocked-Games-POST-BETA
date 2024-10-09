document.addEventListener('DOMContentLoaded', function() {
    var bookmarkletLinks = document.querySelectorAll('a[data-file-paths]');

    bookmarkletLinks.forEach(function(link) {
      var filePath = link.getAttribute('data-file-paths');

      fetch(filePath)
        .then(function(response) {
          return response.text();
        })
        .then(function(data) {
          // Find the hidden <p> element within the link
          var hiddenCodeElement = link.querySelector('p.hiddenCode');
          hiddenCodeElement.textContent = data.trim();

          // Update the link's href with the bookmarklet code
          link.href = data.trim();
        })
        .catch(function(error) {
          console.error('Error reading file:', error);
        });
    });
  });
