document.addEventListener('DOMContentLoaded', function() {
    var taskBtn = document.getElementById('task-btn');
    if (taskBtn) {
        taskBtn.addEventListener('click', function() {
            alert('Exercise Added');
            window.location.href = exerciseListUrl;  // Use the URL defined in the HTML
        });
    }
});
