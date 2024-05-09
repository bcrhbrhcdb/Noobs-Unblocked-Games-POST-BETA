let announcementContainer;

// Fetch the announcement content from the external HTML file
fetch('announcement.html') // Use a relative file path to the announcement.html file
  .then(response => response.text())
  .then(data => {
    // Create a new div element to hold the announcement
    announcementContainer = document.createElement('div');
    announcementContainer.innerHTML = data;

    // Insert the announcement at the top of the body
    document.body.insertBefore(announcementContainer, document.body.firstChild);

    // Add a click event listener to the close button
    const closeButton = announcementContainer.querySelector('#close');
    closeButton.addEventListener('click', () => {
      announcementContainer.style.display = 'none';
    });
  })
  .catch(error => console.error('Error fetching announcement:', error));
 