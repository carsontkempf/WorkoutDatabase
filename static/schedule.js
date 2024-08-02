document.addEventListener("DOMContentLoaded", function() {
    const tbody = document.querySelector("#scheduleTable tbody");

    // Retrieve or generate day IDs
    let dayIds = JSON.parse(localStorage.getItem("dayIds"));
    if (!dayIds) {
        dayIds = generateDayIds();
        localStorage.setItem("dayIds", JSON.stringify(dayIds));
    }

    // Function to generate a table row for a week
    function generateWeekRow() {
        const row = document.createElement("tr");
        for (let i = 0; i < 7; i++) {
            const cell = document.createElement("td");
            row.appendChild(cell);
        }
        return row;
    }

    // Click event handler for day cells
    function handleDayClick() {
        const dayId = this.dataset.dayId;
        console.log("Clicked on day with ID:", dayId);
        const scheduleContainer = document.getElementById("scheduleContainer");
        scheduleContainer.innerHTML = "";  // Clear existing content

        // Popup container for displaying day info and workouts
        const popupContainer = document.createElement("div");
        popupContainer.className = "popup-container";

        // Always visible elements
        const dayIdElement = createDayIdElement(dayId);
        const scheduleButton = createScheduleButton(dayId);
        popupContainer.appendChild(dayIdElement);
        popupContainer.appendChild(scheduleButton);

        // Container for workouts that might be empty
        const workoutsContainer = document.createElement("div");
        workoutsContainer.className = "workouts-container";
        popupContainer.appendChild(workoutsContainer);

        // Fetch and display workouts for the day
        fetchWorkoutsForDay(dayId, workoutsContainer);

        scheduleContainer.appendChild(popupContainer);
        scheduleContainer.style.display = "block";  // Make container visible
    }

    // Generate all day IDs for the current month
    function generateDayIds() {
        const dayIds = [];
        const currentDate = new Date();
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        for (let i = 0; i < daysInMonth; i++) {
            dayIds.push(Math.floor(Math.random() * 1000000));  // Generate a random ID
        }
        return dayIds;
    }

    // Generate the schedule table
    function generateScheduleTable() {
        const currentDate = new Date();
        const startDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        let dayCounter = 0;  // Track days to assign IDs correctly

        for (let i = 0; i < 6; i++) {  // Up to 6 weeks in a month
            const row = generateWeekRow();
            tbody.appendChild(row);
            row.childNodes.forEach((cell, index) => {
                if (i === 0 && index < startDayOfWeek || dayCounter >= daysInMonth) {
                    cell.textContent = "";
                } else {
                    dayCounter++;
                    cell.textContent = dayCounter;
                    const dayId = dayIds[dayCounter - 1];
                    cell.dataset.dayId = dayId;
                    cell.addEventListener("click", handleDayClick);
                }
            });
        }
    }

    // Helper function to create Day ID display element
    function createDayIdElement(dayId) {
        const dayIdElement = document.createElement("p");
        dayIdElement.textContent = "Day ID: " + dayId;
        return dayIdElement;
    }

    // Helper function to fetch and display workouts for a specific day
    function fetchWorkoutsForDay(dayId, container) {
        fetch(`/api/workouts-by-day/${dayId}`)
            .then(response => response.json())
            .then(workouts => {
                if (workouts.length === 0) {
                    container.textContent = 'No workouts scheduled for this day.';
                } else {
                    workouts.forEach(workout => {
                        const workoutElement = document.createElement("p");
                        workoutElement.textContent = `Workout: ${workout.name}, Focus: ${workout.focus}`;
                        container.appendChild(workoutElement);
                    });
                }
            })
            .catch(error => console.error('Error fetching workouts for the day:', error));
    }

    // Helper function to create a schedule workout button
    function createScheduleButton(dayId) {
        const button = document.createElement("button");
        button.textContent = "Schedule Workout";
        button.addEventListener("click", () => {
            const url = `/select-workout/${dayId}`;
            console.log("Navigating to URL:", url); // Debug statement to check URL
            window.location.href = url;
        });
        return button;
    }

    generateScheduleTable();  // Initiate the schedule table generation
});
