

-- Create Exercise_Detail table with adjusted columns
CREATE TABLE Exercise_Detail (
    exercise_detail_id INTEGER PRIMARY KEY,
    description TEXT,
    equipment_needed TEXT,
    weight INTEGER,
    intensity TEXT CHECK (intensity IN ('Light', 'Moderate', 'Vigorous')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 10),
    sets INTEGER,
    reps INTEGER
);

-- Create Exercise table with specific constraints and columns adjusted
CREATE TABLE Exercise (
    exercise_id INTEGER PRIMARY KEY,
    name TEXT,
    exercise_detail_id INTEGER,
    rating INTEGER CHECK (rating >= 1 AND rating <= 10),
    intensity TEXT CHECK (intensity IN ('Light', 'Moderate', 'Vigorous')),
    muscle_group TEXT CHECK (muscle_group IN ('Chest', 'Back', 'Shoulders', 'Arms', 'Abdominals', 'Lower Back', 'Hips', 'Thighs', 'Legs', 'Adductors and Abductors')),
    description TEXT,
    FOREIGN KEY (exercise_detail_id) REFERENCES Exercise_Detail(exercise_detail_id)
);

-- Create Workout table with focus constrained to specific values
CREATE TABLE Workout (
    workout_id INTEGER PRIMARY KEY,
    name TEXT,
    description TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 10),
    focus TEXT CHECK (focus IN ('Strength Training', 'Cardiovascular Health', 'Weight Loss', 'Flexibility', 'Balance and Coordination', 'Endurance Training', 'High-Intensity Interval Training (HIIT)', 'Muscle Toning', 'Core Strengthening', 'Functional Fitness', 'Rehabilitation and Recovery', 'Sports Specific Training', 'Bodybuilding', 'Circuit Training', 'Mind-Body Wellness')),
    intensity TEXT CHECK (intensity IN ('Light', 'Moderate', 'Vigorous'))
);

-- Create Day table with DATE type for the date column
CREATE TABLE Day (
    day_id INTEGER PRIMARY KEY,
    date DATE,
    note TEXT
);

-- Create Exercise_With_Detail table
CREATE TABLE Exercise_With_Detail (
    exercise_with_detail_id INTEGER PRIMARY KEY,
    exercise_id INTEGER,
    detail_id INTEGER,
    FOREIGN KEY (exercise_id) REFERENCES Exercise(exercise_id),
    FOREIGN KEY (detail_id) REFERENCES Exercise_Detail(exercise_detail_id)
);

CREATE TABLE Exercise_In_Workout (
    exercise_id INTEGER,
    workout_id INTEGER,
    PRIMARY KEY (exercise_id, workout_id),
    FOREIGN KEY (exercise_id) REFERENCES Exercise(exercise_id),
    FOREIGN KEY (workout_id) REFERENCES Workout(workout_id)
);


-- Create Workout_On_Day table
CREATE TABLE Workout_On_Day (
    workout_on_day_id INTEGER PRIMARY KEY,
    workout_id INTEGER,
    day_id INTEGER,
    FOREIGN KEY (workout_id) REFERENCES Workout(workout_id),
    FOREIGN KEY (day_id) REFERENCES Day(day_id)
);

-- Inserting additional data into Exercise_Detail
INSERT INTO Exercise_Detail (exercise_detail_id, description, equipment_needed, weight, intensity, rating, sets, reps)
VALUES 
(3, 'Squats, lower body strength', 'Barbell', 20, 'Vigorous', 8, 5, 12),
(4, 'Bench Press, chest and triceps builder', 'Bench and barbell', 40, 'Moderate', 9, 4, 8),
(5, 'Deadlift, overall body strength', 'Barbell', 50, 'Vigorous', 9, 3, 5),
(6, 'Bicep curls, biceps isolation', 'Dumbbells', 10, 'Moderate', 7, 3, 10),
(7, 'Tricep dips, tricep isolation', 'Parallel bars', NULL, 'Moderate', 8, 4, 10),
(8, 'Shoulder press, shoulder strength', 'Dumbbells', 15, 'Vigorous', 8, 4, 8),
(9, 'Lunges, leg toning and strength', 'None', NULL, 'Light', 6, 5, 12),
(10, 'Plank, core strengthening', 'None', NULL, 'Light', 8, 4, 60),
(11, 'Leg press, quadriceps focus', 'Leg press machine', 70, 'Vigorous', 9, 4, 10),
(12, 'Lat pulldowns, back width and strength', 'Cable machine', 35, 'Moderate', 8, 4, 10);

-- Inserting additional data into Exercise
INSERT INTO Exercise (exercise_id, name, exercise_detail_id, rating, intensity, muscle_group, description)
VALUES 
(3, 'Squats', 3, 8, 'Vigorous', 'Thighs', 'Barbell squats targeting thighs and glutes'),
(4, 'Bench Press', 4, 9, 'Moderate', 'Chest', 'Flat bench press for chest mass'),
(5, 'Deadlift', 5, 9, 'Vigorous', 'Back', 'Deadlifts engage the entire posterior chain'),
(6, 'Bicep Curls', 6, 7, 'Moderate', 'Arms', 'Curls with dumbbells for bicep growth'),
(7, 'Tricep Dips', 7, 8, 'Moderate', 'Arms', 'Dips on parallel bars to strengthen triceps'),
(8, 'Shoulder Press', 8, 8, 'Vigorous', 'Shoulders', 'Press overhead for shoulder development'),
(9, 'Lunges', 9, 6, 'Light', 'Thighs', 'Lunges for leg endurance and strength'),
(10, 'Plank', 10, 8, 'Light', 'Abdominals', 'Static plank for core stability'),
(11, 'Leg Press', 11, 9, 'Vigorous', 'Thighs', 'Leg press machine for quad growth'),
(12, 'Lat Pulldowns', 12, 8, 'Moderate', 'Back', 'Wide-grip lat pulldowns for upper back');



-- Inserting additional data into Workout
INSERT INTO Workout (workout_id, name, description, rating, focus, intensity)
VALUES 
(3, 'Leg Killer', 'Intense leg workout', 9, 'Strength Training', 'Vigorous'),
(4, 'Arm Day', 'Biceps and triceps workout', 7, 'Muscle Toning', 'Moderate'),
(5, 'Core Blast', 'Core strengthening routines', 8, 'Core Strengthening', 'Moderate');

-- Inserting additional data into Day
INSERT INTO Day (day_id, date, note)
VALUES 
(3, '2024-05-07', 'Core workout day'),
(4, '2024-05-08', 'Free day, no workouts');

-- Inserting additional data into Exercise_With_Detail
INSERT INTO Exercise_With_Detail (exercise_with_detail_id, exercise_id, detail_id)
VALUES 
(3, 3, 3),
(4, 4, 4),
(5, 5, 5),
(6, 6, 6),
(7, 7, 7),
(8, 8, 8),
(9, 9, 9),
(10, 10, 10),
(11, 11, 11),
(12, 12, 12);

-- Inserting additional data into Exercise_In_Workout
INSERT INTO Exercise_In_Workout (exercise_id, workout_id)
VALUES 
(3, 3),
(4, 4),
(5, 3),
(6, 4),
(7, 4),
(8, 3),
(9, 5),
(10, 5),
(11, 3),
(12, 4);

-- Inserting additional data into Workout_On_Day
INSERT INTO Workout_On_Day (workout_on_day_id, workout_id, day_id)
VALUES 
(3, 3, 3),
(4, 4, 3),
(5, 5, 3);
