let announcementContainer;

// Fetch the announcement content from the external HTML file
fetch('announcement.html')
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

    // Get the clock elements
    const timeElement = announcementContainer.querySelector('#time');
    const dateElement = announcementContainer.querySelector('#date');
    const dayElement = announcementContainer.querySelector('#day');

    // Update the clock function
    function updateTime() {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}:${seconds}`;
      timeElement.textContent = timeString;

      const dateString = now.toDateString();
      dateElement.textContent = dateString;

      const dayString = now.toLocaleString('default', { weekday: 'long' });
      dayElement.textContent = dayString;
    }

    // Call the updateTime function initially and set an interval
    updateTime();
    setInterval(updateTime, 1000);
  })
  .catch(error => console.error('Error fetching announcement:', error));