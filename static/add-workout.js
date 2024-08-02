function getWorkoutIdFromUrl() {
    console.log("Current URL:", window.location.href);  // Log the full URL
    console.log("Pathname:", window.location.pathname);  // Log the pathname part of the URL

    const urlParts = window.location.pathname.split('/');
    console.log("URL Parts:", urlParts);  // Log the split URL parts

    // Try to extract the workout ID based on the URL structure
    const workoutId = urlParts[urlParts.length - 1] === '' ? urlParts[urlParts.length - 2] : urlParts[urlParts.length - 1];
    console.log("Extracted Workout ID:", workoutId);

    return workoutId.match(/^\d+$/) ? workoutId : null;
}

document.addEventListener('DOMContentLoaded', function() {
    const workoutId = getWorkoutIdFromUrl();
    console.log("Workout ID extracted:", workoutId);  // Log the extracted workout ID

    // Event listener for the "Select Exercise" button
    const selectExerciseButton = document.getElementById('select-exercise-button');
    if (selectExerciseButton) {
        selectExerciseButton.addEventListener('click', function() {
            if (workoutId) {
                window.location.href = `/select-exercise/${workoutId}`;
            } else {
                alert("Workout ID is missing from the URL.");
            }
        });
    }
});

function openSelectExercisePage(workoutId) {
    if (workoutId) {
        window.location.href = `/select-exercise/${workoutId}`;
    } else {
        alert("Workout ID is missing.");
    }
}

function initializePage(workoutId) {
    if (workoutId) {
        setupEventListeners(workoutId);
        fetchExercisesForWorkout(workoutId);
    } else {
        generateWorkoutId().then(newId => {
            updateUrlWithWorkoutId(newId);
            setupEventListeners(newId);
        });
    }
}



function setupEventListeners(workoutId) {
    const form = document.getElementById('workout-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        submitWorkoutForm(workoutId);
    });
}

function fetchExercisesForWorkout(workoutId) {
    fetch(`/api/exercises-in-workouts/${workoutId}`)
    .then(response => response.json())
    .then(exercises => {
        if (exercises.length) {
            displayExercises(exercises);
        } else {
            console.log('No exercises found for this workout.');
        }
    })
    .catch(error => console.error('Error fetching exercises:', error));
}

function displayExercises(exercises) {
    const container = document.getElementById('exercises-container');
    container.innerHTML = '';  // Clear previous content
    const ul = document.createElement('ul');
    exercises.forEach(exercise => {
        const li = document.createElement('li');
        li.textContent = `Name: ${exercise.name}, Intensity: ${exercise.intensity}, Muscle Group: ${exercise.muscle_group}, Description: ${exercise.description}`;
        ul.appendChild(li);
    });
    container.appendChild(ul);
}

function submitWorkoutForm(workoutId) {
    const form = document.getElementById('workout-form');
    const formData = new FormData(form);
    let jsonObject = {};
    formData.forEach((value, key) => { jsonObject[key] = value; });

    fetch(`/api/workouts/${workoutId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonObject)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update workout');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log('Workout updated successfully');
            window.location.href = '/workout-list'; // Navigate to workout list on success
        } else {
            console.error('Failed to update workout:', data.error);
        }
    })
    .catch(error => console.error('Error updating workout:', error));
}

function getWorkoutIdFromUrl() {
    const urlParts = window.location.pathname.split('/');
    const lastSegment = urlParts.pop() || urlParts.pop();  // handle potential trailing slash
    return lastSegment.match(/\d+/) ? lastSegment : null;
}

function generateWorkoutId() {
    return fetch('/api/generate-workout-id')
        .then(response => response.json())
        .then(data => data.workout_id);
}

function updateUrlWithWorkoutId(workoutId) {
    const newUrl = `/add-or-edit-workout/${workoutId}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
}
