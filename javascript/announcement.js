let announcementContainer;
let lastAnnouncementDate;

function loadAnnouncement() {
    const hideAnnouncements = localStorage.getItem('hideAnnouncements') === 'true';
    lastAnnouncementDate = localStorage.getItem('lastAnnouncementDate');

    fetch('announcement.html')
        .then(response => response.text())
        .then(data => {
            announcementContainer = document.createElement('div');
            announcementContainer.innerHTML = data;

            const announcementDateElement = announcementContainer.querySelector('#announcementDate');
            const currentAnnouncementDate = announcementDateElement.textContent.split(': ')[1];

            const isDateChanged = currentAnnouncementDate !== lastAnnouncementDate;

            if (!hideAnnouncements || isDateChanged) {
                document.body.insertBefore(announcementContainer, document.body.firstChild);
                localStorage.setItem('lastAnnouncementDate', currentAnnouncementDate);
                localStorage.setItem('hideAnnouncements', 'false');

                const closeButton = announcementContainer.querySelector('#close');
                closeButton.addEventListener('click', () => {
                    announcementContainer.style.display = 'none';
                    localStorage.setItem('hideAnnouncements', 'true');
                });

                updateClock();
                setInterval(updateClock, 1000);
            } else {
                // Don't show the announcement if it's hidden and the date hasn't changed
                announcementContainer.style.display = 'none';
            }
        })
        .catch(error => console.error('Error fetching announcement:', error));
}

function updateClock() {
    if (announcementContainer) {
        const now = new Date();
        const timeElement = announcementContainer.querySelector('#time');
        const dateElement = announcementContainer.querySelector('#date');
        const dayElement = announcementContainer.querySelector('#day');

        if (timeElement && dateElement && dayElement) {
            timeElement.textContent = now.toLocaleTimeString();
            dateElement.textContent = now.toDateString();
            dayElement.textContent = now.toLocaleString('default', { weekday: 'long' });
        }
    }
}

// Call loadAnnouncement when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadAnnouncement);
