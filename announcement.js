let announcementContainer;
let lastAnnouncementDate;

function loadAnnouncement() {
    fetch('announcement.html')
        .then(response => response.text())
        .then(data => {
            announcementContainer = document.createElement('div');
            announcementContainer.innerHTML = data;

            const announcementDate = announcementContainer.querySelector('p:nth-of-type(1)').textContent.split(': ')[1];
            const hideAnnouncements = localStorage.getItem('hideAnnouncements') === 'true';
            const lastShownDate = localStorage.getItem('lastAnnouncementDate');

            if (!hideAnnouncements || announcementDate !== lastShownDate) {
                document.body.insertBefore(announcementContainer, document.body.firstChild);
                localStorage.setItem('lastAnnouncementDate', announcementDate);

                const closeButton = announcementContainer.querySelector('#close');
                closeButton.addEventListener('click', () => {
                    announcementContainer.style.display = 'none';
                });

                const hideCheckbox = announcementContainer.querySelector('#hideAnnouncements');
                hideCheckbox.checked = hideAnnouncements;
                hideCheckbox.addEventListener('change', (e) => {
                    localStorage.setItem('hideAnnouncements', e.target.checked);
                });

                updateClock();
                setInterval(updateClock, 1000);
            }
        })
        .catch(error => console.error('Error fetching announcement:', error));
}

function updateClock() {
    const now = new Date();
    const timeElement = announcementContainer.querySelector('#time');
    const dateElement = announcementContainer.querySelector('#date');
    const dayElement = announcementContainer.querySelector('#day');

    timeElement.textContent = now.toLocaleTimeString();
    dateElement.textContent = now.toDateString();
    dayElement.textContent = now.toLocaleString('default', { weekday: 'long' });
}

loadAnnouncement();