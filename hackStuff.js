// Get all the buttons and draggable text elements
const navBarButtons = document.querySelectorAll('.allButton');

// Object to store the hacks for each button
const hacks = {};

navBarButtons.forEach(button => {
  const buttonId = button.id;

  // Get the file paths for the current button
  const filePathsString = button.getAttribute('data-file-paths');
  const textFilePaths = filePathsString.split(',');

  // Add a click event listener to the button
  button.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default button click behavior
  });

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

          // If all files have been read, update the draggable text and store the hack
          if (i === textFilePaths.length - 1) {
            const correspondingDraggableText = document.querySelector(`#${buttonId} .draggableText`);
            correspondingDraggableText.textContent = 'Drag me!';

            // Store the hack in the hacks object
            hacks[buttonId] = combinedText.trim();

            // Set the data transfer type to a custom format
            event.dataTransfer.setData('application/x-custom-data', combinedText.trim());
          }
        })
        .catch(error => {
          console.error(`Error reading ${filePath}:`, error);
        });
    }
  });
});

// Example usage of the hacks object
console.log(hacks);
