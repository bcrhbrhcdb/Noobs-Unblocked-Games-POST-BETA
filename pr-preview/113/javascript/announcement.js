let announcementContainer;
let lastAnnouncementDate;

function loadAnnouncement() {
    lastAnnouncementDate = localStorage.getItem('lastAnnouncementDate');
    const isAnnouncementClosed = localStorage.getItem('isAnnouncementClosed') === 'true';

    fetch('announcement.html')
        .then(response => response.text())
        .then(data => {
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = data;

            const announcementDateElement = tempContainer.querySelector('#announcementDate');
            const currentAnnouncementDate = announcementDateElement.textContent.split('\n')[0]; // Get the date part

            const isDateChanged = currentAnnouncementDate !== lastAnnouncementDate;

            if (isDateChanged || !isAnnouncementClosed) {
                announcementContainer = document.createElement('div');
                announcementContainer.className = 'announcement-box';
                announcementContainer.innerHTML = data;

                document.body.insertBefore(announcementContainer, document.body.firstChild);
                localStorage.setItem('lastAnnouncementDate', currentAnnouncementDate);
                localStorage.setItem('isAnnouncementClosed', 'false');

                const closeButton = announcementContainer.querySelector('#close');
                closeButton.addEventListener('click', () => {
                    announcementContainer.remove();
                    localStorage.setItem('isAnnouncementClosed', 'true');
                });

                updateClock();
                setInterval(updateClock, 1000);
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
            dateElement.textContent = now.toLocaleDateString();
            dayElement.textContent = now.toLocaleString('default', { weekday: 'long' });
        }
    }
}

// Call loadAnnouncement when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadAnnouncement);
