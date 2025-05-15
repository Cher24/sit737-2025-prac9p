const form = document.getElementById("calcForm");
const resultP = document.getElementById("calcResult");
const resultsList = document.getElementById("resultsList");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const operation = document.getElementById("operation").value;
  const a = document.getElementById("a").value;
  const b = document.getElementById("b").value;

  try {
    const res = await fetch(`/${operation}?a=${a}&b=${b}`);
    const data = await res.json();
    resultP.innerText = `Result: ${data.result}`;
    fetchResults(); // refresh list
  } catch (err) {
    resultP.innerText = "Error occurred.";
  }
});

async function fetchResults() {
  try {
    const res = await fetch("/results");
    const data = await res.json();

    resultsList.innerHTML = "";
    data.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.operation} (${item.a}, ${item.b}) = ${item.result}
        <button onclick="deleteResult('${item._id}')">❌ Delete</button>
      `;
      resultsList.appendChild(li);
    });
  } catch (err) {
    resultsList.innerHTML = "<li>Error fetching data</li>";
  }
}

async function deleteResult(id) {
  if (!confirm("Delete this result?")) return;
  try {
    await fetch(`/deleteResult/${id}`, { method: "DELETE" });
    fetchResults();
  } catch (err) {
    alert("Error deleting");
  }
}
