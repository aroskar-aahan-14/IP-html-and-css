const table = document.getElementById("studentTable");
const message = document.getElementById("message");
const registration = document.getElementById("registration");
let studentId = 101;
const registeredEmails = new Set();
function showMessage(text, color)
{
    message.textContent = text;
    message.style.color = color;
}
registration.addEventListener("submit", function (e)
{
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const course = document.getElementById("course").value;
    if (name === "" || email === "" || course === "")
    {
        showMessage("Please fill all fields", "red");
        return;
    }
    if (registeredEmails.has(email.toLowerCase()))
    {
        showMessage("This email is already registered", "red");
        return;
    }
    const row = document.createElement("tr");
    [studentId, name, email, course].forEach(function (value)
    {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
    });
    table.appendChild(row);
    registeredEmails.add(email.toLowerCase());
    studentId++;
    showMessage("Student registered successfully!", "green");
    registration.reset();
});