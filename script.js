
const eventBlock = document.getElementById("events-stored");
const searchInput = document.getElementById("search");
const bodyMessage = document.getElementById("body-message");
const filterButton = document.querySelectorAll(".filter-buttons button");
const resetButton = document.getElementById("reset-button");
const sortInput = document.getElementById("sorter");
const favCards = document.getElementById("favourite-cards");
const noFavMessage = document.getElementById("no-favourite-message");

// all global variables

let eventObjects = [];
let currentSearch = "";
let currentFilter = "all";
let optionSelected = "";
let favouriteEvents = "";

// event card array

import { events } from './schedule.js';
eventObjects = events.map(eachEvent => {
  const eventCard = document.createElement("div");
  eventCard.classList.add("event-cards");

  eventCard.innerHTML = `
    <h2>${eachEvent.name}</h2>
    <p>Category: ${eachEvent.category}</p>
    <p>Oasis Day: ${eachEvent.day}</p>
    <p>Venue: ${eachEvent.venue}</p>
    <p>Time: ${eachEvent.time}</p>
    <p>Registrations: ${eachEvent.registrations}</p>
    <button class="save-button">Save</button>
  `;


  eventBlock.append(eventCard);

  return {
    name: eachEvent.name,
    day: eachEvent.day,
    venue: eachEvent.venue,
    category: eachEvent.category,
    registrations: eachEvent.registrations, 
    element: eventCard
  };
});

let originalOrder = [...eventObjects]; // copy of original initialized event cards
let originalEvents = [...events]; // copy of original events array

// all event listener stuff

searchInput.addEventListener("input", obj => {
    currentSearch = obj.target.value.toLowerCase();
    updateEvents();
});


filterButton.forEach(filterObject => filterObject.addEventListener("click", filterObj => {
    currentFilter = filterObj.target.dataset.name.toLowerCase();
    const currentActive = document.querySelector(".active-button");
    if (currentActive) {
        currentActive.classList.remove("active-button");
    }
    filterObj.target.classList.add("active-button");
    updateEvents();
}));


sortInput.addEventListener("change", sortObj => {
    optionSelected = sortObj.target.value;
    sorting(optionSelected);

    eventBlock.innerHTML = "";

    eventObjects.forEach(eventObj => {
       eventBlock.append(eventObj.element);

       updateEvents();
    });
     
});


eventBlock.addEventListener("click", saveObj => {
    if (saveObj.target.classList.contains("save-button"))
    {
        const savedCard = saveObj.target.closest(".event-cards");
        savedCard.classList.toggle("saved");

        if (savedCard.classList.contains("saved")) {
            saveObj.target.textContent = "Saved";
        } else {
            saveObj.target.textContent = "Save";
    }

        favouriteEvents = eventObjects.filter(favObj =>
        favObj.element.classList.contains("saved"))

        favouritesSection(favouriteEvents);
    }
    
});

resetButton.addEventListener("click", () => {
    const currentActive = document.querySelector(".active-button");
    if (currentActive) {
        currentActive.classList.remove("active-button");
    }
    for (let eventObj of eventObjects)
    {
        eventObj.element.classList.remove("hide");
    }
    searchInput.value = "";
    sortInput.value = "default";
    sorting("default");
    eventBlock.innerHTML = "";

    eventObjects.forEach(eventObj => {
      eventBlock.append(eventObj.element);
    });
});

// all functions

function updateEvents() {

  let countOfVisibleObjects = 0;

  for (let eventObj of eventObjects) {
    const matchesSearch = eventObj.name.toLowerCase().includes(currentSearch) || eventObj.category.toLowerCase().includes(currentSearch) || eventObj.venue.toLowerCase().includes(currentSearch);
    const matchesFilter = currentFilter === "all" || eventObj.category.toLowerCase().includes(currentFilter);
    const isVisible = matchesSearch && matchesFilter;
    eventObj.element.classList.toggle("hide", !isVisible);

    if (isVisible) countOfVisibleObjects++;
  }
  if (countOfVisibleObjects===0) 
            bodyMessage.textContent="Sorry, no events to display :(";
    else
            bodyMessage.textContent="";
}

function sorting(option) {
    if(option.toLowerCase()==="day")
    {
      for (let i=0; i<eventObjects.length; i++)
        for (let j=0; j<(eventObjects.length-i-1); j++) {
            if (eventObjects[j].day>eventObjects[j+1].day)
            {
                let temp = eventObjects[j];
                eventObjects[j]=eventObjects[j+1];
                eventObjects[j+1]=temp;
            }
        }
    }

    if(option.toLowerCase()==="registrations")
    {
      for (let i=0; i<eventObjects.length; i++)
        for (let j=0; j<(eventObjects.length-i-1); j++) {
            if (eventObjects[j].registrations<eventObjects[j+1].registrations)
            {
                let temp = eventObjects[j];
                eventObjects[j]=eventObjects[j+1];
                eventObjects[j+1]=temp;
            }
        }
    }

    if(option.toLowerCase()==="default")
    {
        eventObjects=[...originalOrder];
    }
}

function favouritesSection(favArray)
{
    favCards.innerHTML = "";
    if (favArray.length === 0) {
    noFavMessage.classList.remove("hide");
    } else {
    noFavMessage.classList.add("hide");
    }
    favArray.forEach(fav => {
        const clonedCard = fav.element.cloneNode(true);
        const remButton = clonedCard.querySelector(".save-button");
        if(remButton) {
            remButton.remove();
        }
        favCards.append(clonedCard);

})

}

function statsDashboard()
{
    const totalEvents = events.length;
    document.getElementById("total-events").textContent = totalEvents;
    for (let i=0; i<originalEvents.length; i++)
        for (let j=0; j<(originalEvents.length-i-1); j++) {
            if (originalEvents[j].registrations<originalEvents[j+1].registrations)
            {
                let temp = originalEvents[j];
                originalEvents[j]=originalEvents[j+1];
                originalEvents[j+1]=temp;
            }
        }
    document.getElementById("popular-event").textContent =
    `${originalEvents[0].name} (${originalEvents[0].registrations} regs)`;

}

statsDashboard();
