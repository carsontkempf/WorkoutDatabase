document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('workouts-container');
    const dayId = getDayIdFromUrl();

    // Check if the Day ID is properly retrieved and handle the error if not.
    if (!dayId) {
        container.textContent = 'Day ID is missing from the URL.';
        return;
    }

    // Fetch all workouts from the backend and handle API response.
    fetch('/api/workouts')
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                container.textContent = 'No workouts available to display.';
                return;
            }

            // Dynamically create and append workout details to the container with checkboxes for each workout.
            data.forEach(workout => {
                const workoutDiv = document.createElement('div');
                workoutDiv.className = 'workout-item';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'workout-checkbox';
                checkbox.id = `workout-${workout.workout_id}`;
                checkbox.value = workout.workout_id;
                checkbox.checked = workout.is_selected;  // Assuming is_selected is provided by the API.

                const label = document.createElement('label');
                label.setAttribute('for', `workout-${workout.workout_id}`);
                label.textContent = `Name: ${workout.name}, Focus: ${workout.focus}, Intensity: ${workout.intensity}`;

                label.prepend(checkbox);
                workoutDiv.appendChild(label);
                container.appendChild(workoutDiv);

                // Setup event listener to handle checkbox changes for scheduling or unscheduling workouts.
                checkbox.addEventListener('change', () => handleCheckboxChange(checkbox, dayId, workout.workout_id));
            });
        })
        .catch(error => {
            console.error('Error loading workouts:', error);
            container.textContent = 'Failed to load workouts.';
        });
});

// Function to handle checkbox state changes
function handleCheckboxChange(checkbox, dayId, workoutId) {
    const method = checkbox.checked ? 'POST' : 'DELETE';
    const url = `/api/workout-to-day/${dayId}/${workoutId}`;

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(result => {
        console.log(result.message);
        if (!result.success) {
            alert(result.message);
            checkbox.checked = !checkbox.checked;  // Revert checkbox if update fails.
        }
    })
    .catch(error => {
        console.error('API error:', error);
        alert('Failed to update workout status.');
        checkbox.checked = !checkbox.checked;  // Revert checkbox if API call fails.
    });
}

// Extract the Day ID from the URL path
function getDayIdFromUrl() {
    const urlSegments = window.location.pathname.split('/');
    return urlSegments[urlSegments.length - 1];
}
