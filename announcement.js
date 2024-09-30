let announcementContainer;
let lastAnnouncementDate;

// Function to check if the announcement should be shown
function shouldShowAnnouncement() {
    const storedDate = localStorage.getItem('lastAnnouncementDate');
    const stopAlerts = localStorage.getItem('stopAlerts') === 'true';
    
    if (!storedDate || storedDate !== lastAnnouncementDate) {
        return true;
    }
    
    return !stopAlerts;
}

// Fetch the announcement content from the external HTML file
fetch('announcement.html')
    .then(response => response.text())
    .then(data => {
        // Create a new div element to hold the announcement
        announcementContainer = document.createElement('div');
        announcementContainer.innerHTML = data;

        // Extract the announcement date
        const announcementDateElement = announcementContainer.querySelector('.announcement-content p:nth-child(2)');
        lastAnnouncementDate = announcementDateElement.textContent.split(': ')[1];

        // Check if the announcement should be shown
        if (shouldShowAnnouncement()) {
            // Insert the announcement at the top of the body
            document.body.insertBefore(announcementContainer, document.body.firstChild);

            // Add a click event listener to the close button
            const closeButton = announcementContainer.querySelector('#close');
            closeButton.addEventListener('click', () => {
                announcementContainer.style.display = 'none';
            });

            // Add event listener to the checkbox
            const stopAlertsCheckbox = announcementContainer.querySelector('#stopAlerts');
            stopAlertsCheckbox.addEventListener('change', (event) => {
                localStorage.setItem('stopAlerts', event.target.checked);
            });

            // Store the current announcement date
            localStorage.setItem('lastAnnouncementDate', lastAnnouncementDate);

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
        }
    })
    //j
    .catch(error => console.error('Error fetching announcement:', error));