document.addEventListener('DOMContentLoaded', function() {
    // Get workout ID from the URL on page load
    const workoutId = getWorkoutIdFromUrl();

    // Fetch and display exercises for this workout
    fetchExercises(workoutId);

    // Setup listener for the "done" button to redirect to the edit workout page
    const doneButton = document.getElementById('done-button');
    doneButton.addEventListener('click', function() {
        window.location.href = `/add-or-edit-workout/${workoutId}`;
    });
});

// Extract the workout ID from the current page URL
function getWorkoutIdFromUrl() {
    const urlParts = window.location.pathname.split('/');
    return urlParts[urlParts.length - 1];
}

async function fetchExercises() {
    try {
        const response = await fetch('/api/exercises');
        if (!response.ok) {
            throw new Error('Failed to fetch exercises');
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
            throw new Error('Invalid data format');
        }
        displayExercises(data);
    } catch (error) {
        console.error('Failed to fetch exercises:', error);
    }
}

function displayExercises(exercises) {
    const container = document.getElementById('exercises-container');
    container.innerHTML = ''; // Clear any existing content

    exercises.forEach(exercise => {
        const exerciseContainer = document.createElement('div');
        exerciseContainer.classList.add('exercise-container');

        const form = document.createElement('form');
        form.addEventListener('submit', (event) => handleFormSubmit(event, exercise.exercise_id));

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = exercise.is_selected;
        checkbox.addEventListener('change', () => handleCheckboxChange(getWorkoutIdFromUrl(), exercise.exercise_id, checkbox.checked));

        const label = document.createElement('label');
        label.textContent = `${exercise.exercise_name} - ${exercise.intensity} - ${exercise.muscle_group}`;

        const descriptionInput = document.createElement('input');
        descriptionInput.type = 'text';
        descriptionInput.name = 'description';
        descriptionInput.placeholder = 'Exercise Description';

        const addButton = document.createElement('button');
        addButton.type = 'button';
        addButton.textContent = 'Add Detail';
        addButton.addEventListener('click', () => showExerciseDetail(exercise.exercise_id));

        const detailDiv = document.createElement('div');
        detailDiv.classList.add('exercise-detail');
        detailDiv.style.display = 'none';

        const equipmentLabel = document.createElement('label');
        equipmentLabel.textContent = 'Equipment Needed:';
        const equipmentInput = document.createElement('input');
        equipmentInput.type = 'text';
        equipmentInput.name = 'equipment-needed';

        const weightLabel = document.createElement('label');
        weightLabel.textContent = 'Weight (in kg):';
        const weightInput = document.createElement('input');
        weightInput.type = 'number';
        weightInput.name = 'weight';
        weightInput.min = '0';

        const intensityLabel = document.createElement('label');
        intensityLabel.textContent = 'Intensity:';
        const intensityInput = document.createElement('select');
        intensityInput.name = 'intensity';
        const intensityOptions = ['Light', 'Moderate', 'Vigorous'];
        intensityOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            intensityInput.appendChild(optionElement);
        });

        const ratingLabel = document.createElement('label');
        ratingLabel.textContent = 'Rating (1-10):';
        const ratingInput = document.createElement('input');
        ratingInput.type = 'number';
        ratingInput.name = 'rating';
        ratingInput.min = '1';
        ratingInput.max = '10';

        const setsLabel = document.createElement('label');
        setsLabel.textContent = 'Sets:';
        const setsInput = document.createElement('input');
        setsInput.type = 'number';
        setsInput.name = 'sets';
        setsInput.min = '0';

        const repsLabel = document.createElement('label');
        repsLabel.textContent = 'Reps:';
        const repsInput = document.createElement('input');
        repsInput.type = 'number';
        repsInput.name = 'reps';
        repsInput.min = '0';

        const addDetailButton = document.createElement('button');
        addDetailButton.type = 'submit';
        addDetailButton.textContent = 'Add Exercise';
        addDetailButton.style.display = 'none';

        detailDiv.appendChild(equipmentLabel);
        detailDiv.appendChild(equipmentInput);
        detailDiv.appendChild(weightLabel);
        detailDiv.appendChild(weightInput);
        detailDiv.appendChild(intensityLabel);
        detailDiv.appendChild(intensityInput);
        detailDiv.appendChild(ratingLabel);
        detailDiv.appendChild(ratingInput);
        detailDiv.appendChild(setsLabel);
        detailDiv.appendChild(setsInput);
        detailDiv.appendChild(repsLabel);
        detailDiv.appendChild(repsInput);
        detailDiv.appendChild(addDetailButton);

        form.appendChild(checkbox);
        form.appendChild(label);
        form.appendChild(descriptionInput);
        form.appendChild(addButton);
        form.appendChild(detailDiv);

        exerciseContainer.appendChild(form);
        container.appendChild(exerciseContainer);
    });
}

// Fetch exercises associated with the workout ID and display them
async function fetchAndDisplayExercises(workoutId) {
    try {
        const response = await fetch(`/api/exercises-in-workouts/${workoutId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch exercises');
        }
        const exercises = await response.json();
        displayExercises(exercises);
    } catch (error) {
        console.error('Failed to fetch exercises:', error);
    }
}

async function handleFormSubmit(event, exerciseId) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const description = formData.get('description').trim();

    if (!description) {
        alert('Please provide a description for the exercise detail.');
        return;
    }

    const workoutId = getWorkoutIdFromUrl();

    const url = `/api/add-exercise-detail/${workoutId}/${exerciseId}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description })
        });
        const data = await response.json();
        console.log(data.message);
    } catch (error) {
        console.error('Error processing request:', error);
    }
}

function handleCheckboxChange(workoutId, exerciseId, isChecked) {
    // If checkbox is checked, add exercise to workout, otherwise remove it
    if (isChecked) {
        addExerciseToWorkout(workoutId, exerciseId);
    } else {
        removeExerciseFromWorkout(workoutId, exerciseId);
    }
}

async function addExerciseToWorkout(workoutId, exerciseId) {
    const url = `/api/exercise-to-workout/add/${workoutId}/${exerciseId}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        console.log(data.message);
        // After adding, fetch and display exercises again
        fetchExercises(workoutId);
    } catch (error) {
        console.error('Error adding exercise to workout:', error);
    }
}

async function removeExerciseFromWorkout(workoutId, exerciseId) {
    const url = `/api/exercise-to-workout/remove/${workoutId}/${exerciseId}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        console.log(data.message);
        // After removing, fetch and display exercises again
        fetchExercises(workoutId);
    } catch (error) {
        console.error('Error removing exercise from workout:', error);
    }
}

function showExerciseDetail(exerciseId) {
    const detailDiv = document.querySelector(`.exercise-container[data-exercise-id="${exerciseId}"] .exercise-detail`);
    const addButton = document.querySelector(`.exercise-container[data-exercise-id="${exerciseId}"] .show-detail-button`);
    const addDetailButton = document.querySelector(`.exercise-container[data-exercise-id="${exerciseId}"] .add-detail-button`);
    
    detailDiv.style.display = 'block';
    addButton.style.display = 'none';
    addDetailButton.style.display = 'inline-block';
}