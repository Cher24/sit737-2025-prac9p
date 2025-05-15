// Get references to DOM elements: the form, result paragraph, and results list
const form = document.getElementById("calcForm");
const resultP = document.getElementById("calcResult");
const resultsList = document.getElementById("resultsList");

// Add event listener to handle form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent page reload on form submit

  // Get values from input fields
  const operation = document.getElementById("operation").value;
  const a = document.getElementById("a").value;
  const b = document.getElementById("b").value;

  try {
    // Send a request to the server with the selected operation and input values
    const res = await fetch(`/${operation}?a=${a}&b=${b}`);
    const data = await res.json();

    // Display the result returned from the server
    resultP.innerText = `Result: ${data.result}`;

    // Refresh the list of stored results
    fetchResults();
  } catch (err) {
    // Show error if the request fails
    resultP.innerText = "Error occurred.";
  }
});

// Function to fetch and display all stored calculation results
async function fetchResults() {
  try {
    // Get all results from the server
    const res = await fetch("/results");
    const data = await res.json();

    // Clear the current list
    resultsList.innerHTML = "";

    // Loop through each result and display it in the list
    data.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.operation} (${item.a}, ${item.b}) = ${item.result}
        <button onclick="deleteResult('${item._id}')">❌ Delete</button>
      `;
      resultsList.appendChild(li); // Add result item to the DOM
    });
  } catch (err) {
    // Show error message if fetching fails
    resultsList.innerHTML = "<li>Error fetching data</li>";
  }
}

// Function to delete a result by ID
async function deleteResult(id) {
  if (!confirm("Delete this result?")) return; // Ask for confirmation before deletion
  try {
    // Send DELETE request to the server
    await fetch(`/deleteResult/${id}`, { method: "DELETE" });

    // Refresh the list after deletion
    fetchResults();
  } catch (err) {
    // Show error if deletion fails
    alert("Error deleting");
  }
}
