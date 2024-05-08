navBarButtons.forEach(button => {
  const buttonId = button.id;

  // Get the file paths for the current button
  const filePathsString = button.getAttribute('data-file-paths');
  const textFilePaths = filePathsString.split(',');

  // Add a dragstart event listener to the button
  button.addEventListener('dragstart', event => {
    let combinedText = '';

    // Loop through the text file paths
    for (let i = 0; i < textFilePaths.length; i++) {
      const filePath = textFilePaths[i];

      // Read the contents of each text file
      fetch(filePath)
        .then(response => response.text())
        .then(textContent => {
          // Append the text content to the combinedText variable
          combinedText += textContent + '\n';

          // If all files have been read, set the data transfer type and text
          if (i === textFilePaths.length - 1) {
            // Set the data transfer type to 'text/uri-list' to create a bookmark
            event.dataTransfer.setData('text/uri-list', combinedText.trim());
            event.dataTransfer.setData('text/plain', combinedText.trim());
            button.textContent = 'Drag me!';

            // Store the hack in the hacks object
            hacks[buttonId] = combinedText.trim();
          }
        })
        .catch(error => {
          console.error(`Error reading ${filePath}:`, error);
        });
    }
  });
});