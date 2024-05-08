function executeBookmarklet(element) {
    var filePath = element.getAttribute('data-file-paths');
  
    fetch(filePath)
      .then(function(response) {
        return response.text();
      })
      .then(function(data) {
        // Execute the bookmarklet code
        eval(data.trim());
      })
      .catch(function(error) {
        console.error('Error reading file:', error);
      });
  }