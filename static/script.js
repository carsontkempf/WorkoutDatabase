document.addEventListener('DOMContentLoaded', function() {
    const filterDropdown = document.getElementById('filterDropdown');

    // Event listener for filter dropdown
    filterDropdown.addEventListener('change', function() {
        const selectedFilter = this.value;

        // Fetch exercises with filter option
        fetch(`/api/exercises?filter=${selectedFilter}`)
            .then(response => response.json())
            .then(data => {
                renderExercises(data);
            })
            .catch(error => console.error('Error loading the exercises:', error));
    });

    // Initial fetch to load exercises without filtering
    fetchExercises();
});

function fetchExercises() {
    fetch('/api/exercises')
        .then(response => response.json())
        .then(data => {
            renderExercises(data);
        })
        .catch(error => console.error('Error loading the exercises:', error));
}

function renderExercises(data) {
    const container = document.getElementById('exercises-container');
    container.innerHTML = ''; // Clear previous content

    // Setup container for grid display
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(3, 1fr)'; // 3 columns
    container.style.gap = '20px'; // Spacing between grid items

    data.forEach(item => {
        const exerciseDiv = document.createElement('div');
        exerciseDiv.className = 'exercise';

        const nameHeader = document.createElement('h2');
        nameHeader.textContent = item.name;
        exerciseDiv.appendChild(nameHeader);

        const detailsList = document.createElement('ul');
        detailsList.style.padding = '0'; // Remove default padding
        detailsList.style.listStyle = 'none'; // Remove list styling

        Object.entries(item).forEach(([key, value]) => {
            if (!['exercise_id', 'exercise_detail_id', 'name'].includes(key)) {
                const detail = document.createElement('li');
                detail.textContent = `${mapColumnToTitle(key)}: ${value}`;
                detail.style.fontSize = '0.8em'; // Smaller font size for details
                detailsList.appendChild(detail);
            }
        });
        exerciseDiv.appendChild(detailsList);

        const editButton = createButton('Edit', 'edit-btn');
        editButton.onclick = () => editExercise(item.exercise_id);
        const deleteButton = createButton('Delete', 'delete-btn');
        deleteButton.onclick = () => deleteExercise(item.exercise_id, exerciseDiv);

        exerciseDiv.append(editButton, deleteButton);

        container.appendChild(exerciseDiv);
    });
}

function mapColumnToTitle(columnName) {
    const titles = {
        'description': 'Description',
        'exercise_type': 'Type',
        'intensity': 'Intensity',
        'muscle_group': 'Muscle Group',
        'rating': 'Rating',
        'sets': 'Sets',
        'reps': 'Reps'
    };
    return titles[columnName] || columnName;
}

function createButton(text, className) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = className;
    button.style.padding = '5px 10px';
    button.style.marginTop = '10px';
    return button;
}

function deleteExercise(exerciseId, exerciseDiv) {
    fetch(`/api/exercises/${exerciseId}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                console.log('Exercise deleted successfully');
                exerciseDiv.remove(); // Directly remove the element from DOM
            } else {
                console.error('Failed to delete the exercise');
            }
        })
        .catch(error => console.error('Error deleting exercise:', error));
}

function editExercise(exerciseId) {
    window.location.href = `/edit-exercise/${exerciseId}`;
}
