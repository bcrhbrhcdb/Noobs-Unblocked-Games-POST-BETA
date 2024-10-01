let announcementContainer;
let lastAnnouncementDate;

function loadAnnouncement() {
    const hideAnnouncements = localStorage.getItem('hideAnnouncements') === 'true';
    const lastShownDate = localStorage.getItem('lastAnnouncementDate');
    const lastAnnouncementContent = localStorage.getItem('lastAnnouncementContent');

    fetch('announcement.html')
        .then(response => response.text())
        .then(data => {
            announcementContainer = document.createElement('div');
            announcementContainer.innerHTML = data;

            const announcementDate = announcementContainer.querySelector('p:nth-of-type(1)').textContent.split(': ')[1];
            const currentAnnouncementContent = announcementContainer.innerHTML;

            if (!hideAnnouncements || announcementDate !== lastShownDate || currentAnnouncementContent !== lastAnnouncementContent) {
                document.body.insertBefore(announcementContainer, document.body.firstChild);
                localStorage.setItem('lastAnnouncementDate', announcementDate);
                localStorage.setItem('lastAnnouncementContent', currentAnnouncementContent);
                localStorage.setItem('hideAnnouncements', 'false');

                const closeButton = announcementContainer.querySelector('#close');
                closeButton.addEventListener('click', () => {
                    announcementContainer.style.display = 'none';
                });

                const hideCheckbox = announcementContainer.querySelector('#hideAnnouncements');
                if (hideCheckbox) {
                    hideCheckbox.checked = false;
                    hideCheckbox.addEventListener('change', (e) => {
                        localStorage.setItem('hideAnnouncements', e.target.checked);
                        if (e.target.checked) {
                            announcementContainer.style.display = 'none';
                        }
                    });
                }

                updateClock();
                setInterval(updateClock, 1000);
            } else {
                // Don't show the announcement if it's hidden and not new
                announcementContainer = null;
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

loadAnnouncement();
