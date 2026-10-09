# School Database Design

## 1. Tables

### Students
The students table stores each student's ID, name and email address. The student ID is the primary key, and each email address must be unique. The name and email fields cannot be empty.

### Courses
The courses table stores each course's ID and name. The course ID is the primary key, and the course name is required.

### Enrolments
The enrolments table records which student has enrolled in which course and the student's grade. It has its own primary key and foreign keys referencing the students and courses tables. The combination of student ID and course ID must be unique to prevent the same student from enrolling in the same course twice.

## 2. Relationships

There is a one-to-many relationship between students and enrolments because one student can have several enrolments, while each enrolment belongs to one student. There is also a one-to-many relationship between courses and enrolments because one course can have several enrolments, while each enrolment refers to one course.

Students and courses have a many-to-many relationship: a student can take several courses, and each course can have several students. The enrolments table acts as a join table between them. It is needed to connect the two tables and store additional information about each enrolment, such as the grade.

## 3. Index

I added an index named `idx_enrolments_student_id` on the `student_id` column in the enrolments table. This can speed up searches for a student's enrolments, such as finding all courses taken by a particular student.

## 4. SQL or NoSQL?

I would choose a relational SQL database for this school system because the information is structured and the tables are connected through clear relationships. SQL supports primary keys, foreign keys and unique constraints to maintain data accuracy and prevent invalid or duplicate enrolments. It also supports JOINs and GROUP BY queries, which are useful for retrieving course information and counting enrolments.
