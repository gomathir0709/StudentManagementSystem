const API_URL = "http://127.0.0.1:8000/api/students/";

const form = document.getElementById("studentForm");
const table = document.getElementById("studentTable");
const search = document.getElementById("search");

let students = [];

// READ students
async function loadStudents() {
    const response = await fetch(API_URL);
    students = await response.json();
    displayStudents(students);
}

// Display students
function displayStudents(data) {
    table.innerHTML = "";

    data.forEach(student => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.department}</td>
            <td>${student.year}</td>
            <td>
                <button onclick="editStudent(${student.id})">Edit</button>
                <button onclick="deleteStudent(${student.id})">Delete</button>
            </td>
        `;

        table.appendChild(row);
    });
}

// CREATE student
form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const student = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        department: document.getElementById("department").value,
        year: Number(document.getElementById("year").value)
    };

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(student)
    });

    if (response.ok) {
        alert("Student added successfully!");
        form.reset();
        loadStudents();
    } else {
        alert("Error adding student.");
    }
});

// DELETE student
async function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete this student?")) {
        return;
    }

    const response = await fetch(API_URL + id + "/", {
        method: "DELETE"
    });

    if (response.ok) {
        alert("Student deleted successfully!");
        loadStudents();
    }
}

// UPDATE student
async function editStudent(id) {
    const student = students.find(s => s.id === id);

    const name = prompt("Enter student name:", student.name);
    const email = prompt("Enter email:", student.email);
    const department = prompt("Enter department:", student.department);
    const year = prompt("Enter year:", student.year);

    if (name && email && department && year) {

        const updatedStudent = {
            name: name,
            email: email,
            department: department,
            year: Number(year)
        };

        const response = await fetch(API_URL + id + "/", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedStudent)
        });

        if (response.ok) {
            alert("Student updated successfully!");
            loadStudents();
        } else {
            alert("Error updating student.");
        }
    }
}

// SEARCH student
search.addEventListener("input", function() {
    const text = search.value.toLowerCase();

    const filtered = students.filter(student =>
        student.name.toLowerCase().includes(text) ||
        student.email.toLowerCase().includes(text) ||
        student.department.toLowerCase().includes(text)
    );

    displayStudents(filtered);
});

// Load students when page opens
loadStudents();