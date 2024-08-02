document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('exercises-list-container');
    const workoutId = getWorkoutIdFromUrl();

    // Ensure the workout ID is properly retrieved.
    if (!workoutId) {
        container.textContent = 'Workout ID is missing from the URL.';
        return;
    }

    // Fetch exercises linked to the specific workout ID from the backend.
    fetch(`/api/exercises-in-workouts/${workoutId}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                container.textContent = 'No exercises available to display.';
                return;
            }

            // Create elements for each exercise and append to the container.
            data.forEach(exercise => {
                const exerciseDiv = document.createElement('div');
                exerciseDiv.className = 'exercise-item';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'exercise-checkbox';
                checkbox.id = `exercise-${exercise.exercise_id}`;
                checkbox.value = exercise.exercise_id;
                checkbox.checked = exercise.is_selected;  // Assumes is_selected is provided by the API.

                const label = document.createElement('label');
                label.setAttribute('for', `exercise-${exercise.exercise_id}`);
                label.textContent = `${exercise.exercise_name} - Intensity: ${exercise.intensity}, Muscle Group: ${exercise.muscle_group}`;

                label.prepend(checkbox);  // Place the checkbox before the label text.
                exerciseDiv.appendChild(label);
                container.appendChild(exerciseDiv);

                // Add an event listener to handle changes in checkbox state.
                checkbox.addEventListener('change', () => {
                    const method = checkbox.checked ? 'POST' : 'DELETE';
                    const url = `/api/exercise-to-workout/add/${workoutId}/${exercise.exercise_id}`;

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
                            checkbox.checked = !checkbox.checked;  // Revert checkbox on failure.
                        }
                    })
                    .catch(error => {
                        console.error('API error:', error);
                        alert('Failed to update exercise status.');
                        checkbox.checked = !checkbox.checked;  // Revert checkbox on failure.
                    });
                });
            });
        })
        .catch(error => {
            console.error('Error loading the exercises:', error);
            container.textContent = 'Failed to load exercises.';
        });

        const doneButton = document.createElement('button');
        doneButton.textContent = 'Done';
        doneButton.addEventListener('click', () => {
            const workoutId = getWorkoutIdFromUrl();
            if (workoutId) {
                window.location.href = `/edit-workout/${workoutId}`;
            } else {
                console.error('Workout ID not found in URL.');
            }
        });
        container.appendChild(doneButton);
        

    function getWorkoutIdFromUrl() {
        // Extract the Workout ID from the URL path.
        const urlSegments = window.location.pathname.split('/');
        const workoutId = urlSegments[urlSegments.length - 1];
        console.log('Workout ID from URL:', workoutId);
        return workoutId;
    }
});
