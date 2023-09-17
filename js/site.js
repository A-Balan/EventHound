const events = [
    {
        event: "ComicCon",
        city: "New York",
        state: "New York",
        attendance: 240000,
        date: "06/01/2017",
    },
    {
        event: "ComicCon",
        city: "New York",
        state: "New York",
        attendance: 250000,
        date: "06/01/2018",
    },
    {
        event: "ComicCon",
        city: "New York",
        state: "New York",
        attendance: 257000,
        date: "06/01/2019",
    },
    {
        event: "ComicCon",
        city: "San Diego",
        state: "California",
        attendance: 130000,
        date: "06/01/2017",
    },
    {
        event: "ComicCon",
        city: "San Diego",
        state: "California",
        attendance: 140000,
        date: "06/01/2018",
    },
    {
        event: "ComicCon",
        city: "San Diego",
        state: "California",
        attendance: 150000,
        date: "06/01/2019",
    },
    {
        event: "HeroesCon",
        city: "Charlotte",
        state: "North Carolina",
        attendance: 40000,
        date: "06/01/2017",
    },
    {
        event: "HeroesCon",
        city: "Charlotte",
        state: "North Carolina",
        attendance: 45000,
        date: "06/01/2018",
    },
    {
        event: "HeroesCon",
        city: "Charlotte",
        state: "North Carolina",
        attendance: 50000,
        date: "06/01/2019",
    },
];

// accessed the global const events
function getEvents() {
    // try to get whatever's there, but 1st time you visit pg, there will be nothing there, so use []
    let storedString = localStorage.getItem('ab-events') || '[]';

    // you put stored string into a normal format from JSON
    let storedEvents = JSON.parse(storedString);

    // if you got empty array you reassign it to the constatnt array of events
    if (storedEvents.length == 0) {
        storedEvents = events;
        localStorage.setItem('ab-events', JSON.stringify(events));
    }
    return storedEvents;
}

function buildDropDown() {
    // get the current events
    let currentEvents = getEvents();
    // get a list of unique cities
    let eventCities = currentEvents.map(event => event.city);
    let distinctCities = new Set(eventCities);
    // turned the set into an array
    let dropdownChoices = ['All', ...distinctCities];

    const dropdownDiv = document.getElementById('city-dropdown');
    const dropdownItemTemplate = document.getElementById('dropdown-template');

    // clear it out so the drop bar doesnt duplicate
    dropdownDiv.innerHTML = '';

    // with each unique city
    dropdownChoices.forEach(choice => {
        //  copy the dropdown template;
        let dropdownItemCopy = dropdownItemTemplate.content.cloneNode(true);
        // -chage the copy's text
        let aTag = dropdownItemCopy.querySelector('a');
        aTag.innerText = choice;
        // put it in the dropdown
        dropdownDiv.appendChild(dropdownItemCopy);
    });
    // get return and display it from the controller function

    document.getElementById('stats-location').textContent = 'All';
    displayEvents(currentEvents);
    displayStats(currentEvents);
}

function displayEvents(events) {
    // find the table on the page
    const eventsTable = document.getElementById('events-table');
    // find the table row template
    const eventTemplate = document.getElementById('table-row-template');
    // clear out the table
    eventsTable.innerHTML = '';

    // for each event:
    for (let index = 0; index < events.length; index++) {
        // get one event
        let event = events[index];
        // clone the template
        let tableRow = eventTemplate.content.cloneNode(true);
        // get each property of an event
        // insert each property into the cloned template
        let eventNameCell = tableRow.querySelector('[data-id="event"]');
        eventNameCell.innerText = event.event;
        // can write it like above or shorten like below-if don't want to name
        tableRow.querySelector('[data-id=city]').innerText = event.city;
        tableRow.querySelector('[data-id=state]').innerText = event.state;
        tableRow.querySelector('[data-id=attendance]').innerText = event.attendance.toLocaleString();
        tableRow.querySelector('[data-id=date]').innerText = new Date(event.date).toLocaleDateString();
        // insert the event data into the table
        eventsTable.appendChild(tableRow);
    }
    /*
    event: "comicon",
    city: "New York",
    state: "New York",
    attendance: "240000",
    date:05/05/23
    */
}

function displayStats(events) {
    let total = 0;
    let max = 0;
    let min = events[0].attendance;

    for (let index = 0; index < events.length; index++) {
        let event = events[index];

        total = total + event.attendance;

        if (event.attendance > max) {
            max = event.attendance;
        }

        if (event.attendance < min) {
            min = event.attendance;
        }
    }

    let average = total / events.length;

    document.getElementById('total-attendance').innerHTML = total.toLocaleString();
    document.getElementById('avg-attendance').innerHTML = Math.round(average).toLocaleString();
    document.getElementById('max-attended').innerHTML = max.toLocaleString();
    document.getElementById('min-attended').innerHTML = min.toLocaleString();
}

function filterEvents(dropdownItemClicked) {
    let cityName = dropdownItemClicked.innerText;
    document.getElementById('stats-location').textContent = cityName;

    let allEvents = getEvents();
    let filteredEvents = [];

    if (cityName == 'All') {

        filteredEvents = allEvents;

    } else {

        for (let i = 0; i < allEvents.length; i++) {
            let event = allEvents[i];

            if (event.city == cityName) {
                filteredEvents.push(event);
            }
        }
    }

    displayStats(filteredEvents);
    displayEvents(filteredEvents);
}

function saveEvent() {
    let eventName = document.getElementById('eventName').value;
    let city = document.getElementById('city').value;

    let stateSelect = document.getElementById('newEventState');
    let selectedIndex = stateSelect.selectedIndex;
    let selectedOption = stateSelect.options[selectedIndex];
    let state = selectedOption.text;

    let attendance = parseInt(document.getElementById('attendance').value);
    let dateString = document.getElementById('eventDate').value;
    dateString = `${dateString} 00:00`;
    let eventDate = new Date(dateString).toLocaleDateString();

    let newEvent = {
        event: eventName,
        city: city,
        state: state,
        attendance: attendance,
        date: eventDate,
    };

    let allEvents = getEvents();
    allEvents.push(newEvent);

    localStorage.setItem('ab-events', JSON.stringify(allEvents));

    document.getElementById('newEventForm').reset();

    buildDropDown();

    let modal = bootstrap.Modal.getInstance(document.getElementById('modalForm'));
    modal.hide();

}
function copyToClipboard() {
    // Copy the text inside the text field
    navigator.clipboard.writeText("abalan0326@gmail.com");
}

function showClipboardMessage() {
    // Swal.fire({
    //     text: "abalan0326@gmail.com",
    //     confirmButtonText: "Copy"
    // }).then(function (result) {
    //     copyToClipboard();
    // });

    Swal.fire({
        html: '<br />abalan0326@gmail.com ',
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: '<i class="bi bi-clipboard"></i> Copy',
    }).then(function (result) {
        copyToClipboard();

        if (result.value === true) {
            Swal.fire({
                html: "<br />Copied to Clipboard!"
            })
        }
    })
}
