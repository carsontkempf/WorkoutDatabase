document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('workouts-container');
    if (container) {
        fetchWorkouts(container);
    }
});

function fetchWorkouts(container) {
    fetch('/api/workouts')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Workouts fetched:", data);  // Log fetched data for debugging
            displayWorkouts(data, container);
        })
        .catch(error => {
            console.error('Error loading the workouts:', error);
            container.textContent = 'Failed to load workouts.';
        });
}

function displayWorkouts(data, container) {
    container.innerHTML = ''; // Clear previous contents
    if (!data || data.length === 0) {
        container.textContent = 'No workouts available.';
        return;
    }

    data.forEach(workout => {
        const workoutDiv = createWorkoutDiv(workout);
        container.appendChild(workoutDiv);
    });
}

function createWorkoutDiv(workout) {
    const workoutDiv = document.createElement('div');
    workoutDiv.id = `workout-${workout.workout_id}`;
    workoutDiv.className = 'workout';
    workoutDiv.appendChild(createWorkoutHeader(workout));
    workoutDiv.appendChild(createWorkoutDetails(workout));

    if (workout.exercises && workout.exercises.length) {
        workoutDiv.appendChild(createExercisesList(workout.exercises));
    }

    appendActionButtons(workout, workoutDiv);
    return workoutDiv;
}

function createWorkoutHeader(workout) {
    const header = document.createElement('h2');
    header.textContent = workout.name;
    return header;
}

function createWorkoutDetails(workout) {
    const details = document.createElement('p');
    details.textContent = `Description: ${workout.description}, Intensity: ${workout.intensity}, Focus: ${workout.focus}`;
    return details;
}

function createExercisesList(exercises) {
    const header = document.createElement('h3');
    header.textContent = 'Selected Exercises:';
    const list = document.createElement('ul');
    exercises.forEach(exercise => {
        list.appendChild(createExerciseItem(exercise));
    });
    const container = document.createElement('div');
    container.appendChild(header);
    container.appendChild(list);
    return container;
}

function createExerciseItem(exercise) {
    const item = document.createElement('li');
    item.textContent = `${exercise.name} - Intensity: ${exercise.intensity}, Muscle Group: ${exercise.muscle_group}, Description: ${exercise.description}`;
    return item;
}

function appendActionButtons(workout, workoutDiv) {
    const editButton = createButton('Edit', 'edit-btn', () => editWorkout(workout.workout_id));
    const deleteButton = createButton('Delete', 'delete-btn', () => deleteWorkout(workout.workout_id, workoutDiv));
    workoutDiv.appendChild(editButton);
    workoutDiv.appendChild(deleteButton);
}

function createButton(text, className, onClick) {
    const button = document.createElement('button');
    button.className = className;
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
}

function deleteWorkout(workoutId, workoutDiv) {
    fetch(`/api/workouts/${workoutId}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) throw new Error('Failed to delete workout.');
            workoutDiv.remove();
            console.log('Workout deleted successfully');
        })
        .catch(error => {
            console.error('Error deleting workout:', error);
            alert('Failed to delete workout.');
        });
}

function editWorkout(workoutId) {
    window.location.href = `/edit-workout/${workoutId}`;
}
