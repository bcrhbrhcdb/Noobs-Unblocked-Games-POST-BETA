let announcementContainer;
let lastAnnouncementDate;
let lastAnnouncementContent;

function loadAnnouncement() {
    const hideAnnouncements = localStorage.getItem('hideAnnouncements') === 'true';
    const lastShownDate = localStorage.getItem('lastAnnouncementDate');
    lastAnnouncementContent = localStorage.getItem('lastAnnouncementContent');

    fetch('announcement.html')
        .then(response => response.text())
        .then(data => {
            announcementContainer = document.createElement('div');
            announcementContainer.innerHTML = data;

            const announcementDate = announcementContainer.querySelector('p:nth-of-type(1)').textContent.split(': ')[1];
            const currentAnnouncementContent = announcementContainer.querySelectorAll('p:not(:first-child)');
            const currentContentString = Array.from(currentAnnouncementContent).map(p => p.textContent).join('');

            const isNewAnnouncement = announcementDate !== lastShownDate;

            if (!hideAnnouncements || isNewAnnouncement) {
                document.body.insertBefore(announcementContainer, document.body.firstChild);
                localStorage.setItem('lastAnnouncementDate', announcementDate);
                localStorage.setItem('lastAnnouncementContent', currentContentString);

                const closeButton = announcementContainer.querySelector('#close');
                closeButton.addEventListener('click', () => {
                    announcementContainer.style.display = 'none';
                    localStorage.setItem('hideAnnouncements', 'true');
                });

                const hideCheckbox = announcementContainer.querySelector('#hideAnnouncements');
                if (hideCheckbox) {
                    hideCheckbox.checked = hideAnnouncements;
                    hideCheckbox.addEventListener('change', (e) => {
                        localStorage.setItem('hideAnnouncements', e.target.checked);
                    });
                }

                updateClock();
                setInterval(updateClock, 1000);
            } else {
                // Don't show the announcement if it's hidden and not new
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
