document.addEventListener('DOMContentLoaded', function() {
    const selectExercisesBtn = document.getElementById('select-exercises-btn');
    if (selectExercisesBtn) {
        selectExercisesBtn.addEventListener('click', function() {
            const workoutId = document.getElementById('workout-id').value;
            window.location.href = `/edit-select-exercise/${workoutId}`;
        });
    }

    const editWorkoutForm = document.getElementById('edit-workout-form');
    if (editWorkoutForm) {
        editWorkoutForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission behavior

            const form = event.target;
            const formData = new FormData(form);

            fetch(`/edit-workout/${formData.get('workout_id')}`, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    console.log('Workout updated successfully');
                    window.location.href = '/workout-list'; // Redirect to the workout list page
                } else {
                    console.error('Failed to update workout');
                }
            })
            .catch(error => console.error('Error updating workout:', error));
        });
    }
});
