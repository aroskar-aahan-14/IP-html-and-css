const guestForm = document.getElementById("guestForm");
const guestTableBody = document.getElementById("guestTableBody");
const submitBtn = document.getElementById("submitBtn");
const formTitle = document.getElementById("formTitle");
const editId = document.getElementById("editId");
const searchInput = document.getElementById("searchInput");
const recordCount = document.getElementById("recordCount");
let guests = [];
try
{
    guests = JSON.parse(localStorage.getItem("hotelGuests")) || [];
}
catch (error)
{
    guests = [];
}
function saveGuests()
{
    localStorage.setItem("hotelGuests", JSON.stringify(guests));
}
function escapeHTML(value)
{
    const map =
    {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    };
    return String(value).replace(/[&<>"']/g, function (char)
    {
        return map[char];
    });
}
function getTodayLocal()
{
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
}
function displayGuests(filter = "")
{
    guestTableBody.innerHTML = "";
    const searchTerm = filter.trim().toLowerCase();
    const filteredGuests = guests.filter(guest =>
    [
        guest.id,
        guest.name,
        guest.mobile,
        guest.dob,
        guest.city,
        guest.state,
        guest.country,
        guest.room,
        guest.guests
    ].some(value => String(value).toLowerCase().includes(searchTerm))
    );
    filteredGuests.forEach(guest =>
    {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${escapeHTML(guest.id)}</td>
            <td>${escapeHTML(guest.name)}</td>
            <td>${escapeHTML(guest.mobile)}</td>
            <td>${escapeHTML(guest.dob)}</td>
            <td>${escapeHTML(guest.city)}</td>
            <td>${escapeHTML(guest.state)}</td>
            <td>${escapeHTML(guest.country)}</td>
            <td>${escapeHTML(guest.room)}</td>
            <td>${escapeHTML(guest.guests)}</td>
            <td>
                <button type="button" class="edit-btn" data-action="edit" data-id="${escapeHTML(guest.id)}">Edit</button>
                <button type="button" class="delete-btn" data-action="delete" data-id="${escapeHTML(guest.id)}">Delete</button>
            </td>
        `;
        guestTableBody.appendChild(row);
    });
    recordCount.textContent = `Showing ${filteredGuests.length} of ${guests.length} records`;
}
function resetGuestForm()
{
    guestForm.reset();
    editId.value = "";
    submitBtn.textContent = "Add Guest";
    formTitle.textContent = "Register a Guest";
}
guestForm.addEventListener("submit", function (event)
{
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const dob = document.getElementById("dob").value;
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();
    const country = document.getElementById("country").value.trim();
    const room = document.getElementById("room").value;
    const totalGuests = document.getElementById("guests").value;
    if(!name || !mobile || !dob || !city || !state || !country || !room || !totalGuests)
    {
        alert("Please fill in all the fields.");
        return;
    }
    if (!/^[0-9]{10}$/.test(mobile))
    {
        alert("Enter a valid 10-digit mobile number.");
        return;
    }
    if (dob > getTodayLocal())
    {
        alert("Date of birth cannot be in the future.");
        return;
    }
    if(!Number.isSafeInteger(Number(room)) || Number(room) < 1 || !Number.isSafeInteger(Number(totalGuests)) || Number(totalGuests) < 1)
    {
        alert("Room number and total guests must be positive integers.");
        return;
    }
    const guestData =
    {
        name,
        mobile,
        dob,
        city,
        state,
        country,
        room: Number(room),
        guests: Number(totalGuests)
    };
    if (editId.value)
    {
        const index = guests.findIndex
        (guest => guest.id === Number(editId.value));
        if (index !== -1)
        {
            guests[index] =
            {
                ...guests[index],
                ...guestData
            };
            alert("Guest details updated successfully!");
        }
    }
    else
    {
        const nextId = guests.reduce
        ((max, guest) => Math.max(max, Number(guest.id) || 0),0) + 1;
        guests.push({
        id: nextId,
        ...guestData
        });
        alert("Guest added successfully!");
    }
    saveGuests();
    displayGuests(searchInput.value);
    resetGuestForm();
});
guestTableBody.addEventListener("click", function (event)
{
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const id = Number(button.dataset.id);
    const guest = guests.find(item => item.id === id);
    if (!guest) return;
    if (button.dataset.action === "edit")
    {
        editId.value = guest.id;
        document.getElementById("name").value = guest.name;
        document.getElementById("mobile").value = guest.mobile;
        document.getElementById("dob").value = guest.dob;
        document.getElementById("city").value = guest.city;
        document.getElementById("state").value = guest.state;
        document.getElementById("country").value = guest.country;
        document.getElementById("room").value = guest.room;
        document.getElementById("guests").value = guest.guests;
        formTitle.textContent = "Update Guest Details";
        submitBtn.textContent = "Update Guest";
        window.scrollTo(
        {
            top: 0,
            behavior: "smooth"
        });
    }
    if (button.dataset.action === "delete")
    {
        const confirmed = confirm(`Are you sure you want to delete ${guest.name}'s record?`);
        if (confirmed)
        {
            guests = guests.filter(item => item.id !== id);
            saveGuests();
            displayGuests(searchInput.value);
            if (Number(editId.value) === id)
            {
                resetGuestForm();
            }
            alert("Guest record deleted successfully!");
        }
    }
});
searchInput.addEventListener("input", function ()
{
    displayGuests(searchInput.value);
});
document.getElementById("clearBtn").addEventListener("click", function ()
{
    resetGuestForm();
});
displayGuests();