document.addEventListener("DOMContentLoaded", () => {

    // Načtení JSON dat přes AJAX
    fetch("/data/enginedata.json")
        .then(response => {
            if (!response.ok) throw new Error("Chyba při načítání JSON");
            return response.json();
        })
        .then(data => {
            loadEngines(data.engines);
            loadTable(data.engines);
        })
        .catch(err => console.error(err));

    // Vykreslení karet enginů
    function loadEngines(engines) {
        const container = document.getElementById("engine-container");
        if (!container) return;

        engines.forEach(engine => {
            const card = document.createElement("div");
            card.classList.add("engine-card");

            // Obsah karty s modal detailem
            card.innerHTML = `
                <img src="${engine.logo}" alt="${engine.name}">
                <h3>${engine.name}</h3>
                <p>${engine.description}</p>
                <h4>🟢 Výhody</h4>
                <ul>${engine.advantages.map(a => `<li>${a}</li>`).join("")}</ul>
                <h4>🔴 Nevýhody</h4>
                <ul>${engine.disadvantages.map(d => `<li>${d}</li>`).join("")}</ul>
            `;

            // Kliknutí pro zobrazení detailního okna
            card.addEventListener("click", () => {
                showEngineDetails(engine);
            });

            container.appendChild(card);
        });
    }

    // Funkce pro otevření detailního okna
    function showEngineDetails(engine) {
        // Vytvoření overlay
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.background = "rgba(0,0,0,0.85)";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.zIndex = 1000;

        // Obsah detailního okna
        const detailBox = document.createElement("div");
        detailBox.style.background = "#111";
        detailBox.style.color = "#eee";
        detailBox.style.padding = "30px";
        detailBox.style.borderRadius = "12px";
        detailBox.style.maxWidth = "700px";
        detailBox.style.width = "90%";
        detailBox.style.maxHeight = "80%";
        detailBox.style.overflowY = "auto";
        detailBox.style.position = "relative";

        detailBox.innerHTML = `
            <h2>${engine.name}</h2>
            <img src="${engine.logo}" alt="${engine.name}" style="width:100px; display:block; margin-bottom:15px;">
            <p>${engine.details}</p>
            <p><strong>Oficiální web:</strong><br>
               <a href="${engine.officialSite}" target="_blank" style="color:#0af;">${engine.officialSite}</a>
            </p>
            <button id="closeDetail" style="
                position:absolute; top:15px; right:15px; background:#0af; color:#111; border:none; padding:8px 12px; border-radius:6px; cursor:pointer;">
                Zavřít
            </button>
        `;

        overlay.appendChild(detailBox);
        document.body.appendChild(overlay);

        // Zavření okna
        document.getElementById("closeDetail").addEventListener("click", () => {
            document.body.removeChild(overlay);
        });
    }

    // Vykreslení porovnávací tabulky
    function loadTable(engines) {
        const tableBody = document.getElementById("tableBody");
        if (!tableBody) return;

        tableBody.innerHTML = engines.map(e => `
            <tr>
                <td>${e.name}</td>
                <td>${e.language}</td>
                <td>${e.price}</td>
                <td>${e.platforms}</td>
            </tr>
        `).join("");

        // Filtrování
        const filterInput = document.getElementById("filterInput");
        if (filterInput) {
            filterInput.addEventListener("keyup", function() {
                const value = this.value.toLowerCase();
                const rows = tableBody.querySelectorAll("tr");

                rows.forEach(row => {
                    const engineName = row.cells[0].textContent.toLowerCase();
                    row.style.display = engineName.includes(value) ? "" : "none";
                });
            });
        }
    }

    // Doporučení podle kliknuté karty
    const engineContainer = document.getElementById("engine-container");
    if (engineContainer) {
        engineContainer.addEventListener("click", e => {
            const card = e.target.closest(".engine-card");
            if (!card) return;
            const engineName = card.querySelector("h3").textContent;
            const engine = engines.find(en => en.name === engineName);
            if (engine) {
                document.getElementById("recommendation-text").innerText =
                    `Doporučení: ${engine.name} je ideální pro: ${engine.idealFor}.`;
            }
        });
    }

});
