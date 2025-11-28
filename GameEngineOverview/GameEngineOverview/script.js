// Načtení JSON dat
fetch("../data/enginedata.json")
    .then(r => r.json())
    .then(data => {
        renderEngines(data.engines);
        renderTable(data.engines);
    })
    .catch(err => console.error("Chyba při načítání JSON:", err));


// Vykreslení karet enginů
function renderEngines(engines) {
    const container = document.getElementById("engine-container");

    engines.forEach(engine => {
        const card = document.createElement("div");
        card.classList.add("engine-card");

        card.innerHTML = `
            <img src="${engine.logo}" alt="${engine.name}">
            <h3>${engine.name}</h3>
            <p>${engine.description}</p>

            <h4>Výhody</h4>
            <ul>${engine.advantages.map(a => `<li>${a}</li>`).join("")}</ul>

            <h4>Nevýhody</h4>
            <ul>${engine.disadvantages.map(a => `<li>${a}</li>`).join("")}</ul>
        `;

        // Kliknutí přidá doporučení
        card.addEventListener("click", () => {
            document.getElementById("recommendation-text").innerText =
                `Doporučení: ${engine.name} je ideální pro: ${engine.idealFor}.`;
        });

        container.appendChild(card);
    });
}


// Vykreslení porovnávací tabulky
function renderTable(engines) {
    const tableBody = document.getElementById("tableBody");

    tableBody.innerHTML = engines.map(e => `
        <tr>
            <td>${e.name}</td>
            <td>${e.language}</td>
            <td>${e.price}</td>
            <td>${e.platforms}</td>
        </tr>
    `).join("");
}


// Filtrování tabulky
document.getElementById("filterInput").addEventListener("keyup", function () {
    let value = this.value.toLowerCase();
    let rows = document.querySelectorAll("#tableBody tr");

    rows.forEach(row => {
        let engine = row.cells[0].textContent.toLowerCase();
        row.style.display = engine.includes(value) ? "" : "none";
    });
});
