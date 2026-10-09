-- Day 6 Assignment: A School Database

PRAGMA foreign_keys = ON;

-- Remove existing tables so the script can be run again.
DROP TABLE IF EXISTS enrolments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;

-- Table 1: Students
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- Table 2: Courses
CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL
);

-- Table 3: Enrolments
CREATE TABLE enrolments (
    enrolment_id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    UNIQUE (student_id, course_id)
);

-- Index to speed up searches for enrolments by student.
CREATE INDEX idx_enrolments_student_id
ON enrolments(student_id);

-- Sample students
INSERT INTO students (student_id, name, email) VALUES
(1, 'Chlesea', 'chlesea@example.com'),
(2, 'Green', 'green@example.com'),
(3, 'Miles', 'miles@example.com'),
(4, 'Jordan', 'jordan@example.com');

-- Sample courses
INSERT INTO courses (course_id, course_name) VALUES
(1, 'Web Development'),
(2, 'Data Analysis'),
(3, 'Database Management');

-- Sample enrolments
INSERT INTO enrolments (enrolment_id, student_id, course_id, grade) VALUES
(1, 1, 1, 'A'),
(2, 1, 2, 'B'),
(3, 2, 1, 'B'),
(4, 2, 3, 'A'),
(5, 3, 2, 'A');

-- Query 1: All courses for one student, searched by name
SELECT
    students.name AS student_name,
    courses.course_name,
    enrolments.grade
FROM enrolments
JOIN students ON enrolments.student_id = students.student_id
JOIN courses ON enrolments.course_id = courses.course_id
WHERE students.name = 'Chlesea';

-- Query 2: All students enrolled on one course
SELECT
    courses.course_name,
    students.name AS student_name,
    enrolments.grade
FROM enrolments
JOIN students ON enrolments.student_id = students.student_id
JOIN courses ON enrolments.course_id = courses.course_id
WHERE courses.course_name = 'Web Development';

-- Query 3: Number of students enrolled on each course
SELECT
    courses.course_name,
    COUNT(enrolments.student_id) AS number_of_students
FROM courses
LEFT JOIN enrolments ON courses.course_id = enrolments.course_id
GROUP BY courses.course_id, courses.course_name;

-- Query 4: Students who have no enrolments
SELECT
    students.student_id,
    students.name
FROM students
LEFT JOIN enrolments ON students.student_id = enrolments.student_id
WHERE enrolments.student_id IS NULL;

-- Query 5: Update one enrolment's grade
UPDATE enrolments
SET grade = 'A'
WHERE enrolment_id = 2;

-- Verify the updated grade
SELECT
    enrolment_id,
    student_id,
    course_id,
    grade
FROM enrolments
WHERE enrolment_id = 2;
