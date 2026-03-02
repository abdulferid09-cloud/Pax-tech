const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSAF9rSVYWeMUZXAZqag2EerWjpgQ_RfGtlhRFhBRkFeDqNPllZ7cn7wDQn7KFBVuJquSq7balxUd-c/pub?output=csv';

async function initPage(targetCategory = 'all') {
    try {
        const response = await fetch(SHEET_CSV_URL);
        const csvData = await response.text();
        const rows = csvData.split(/\r?\n/);
        
        let products = rows.slice(1).map(row => {
            const parts = parseCSVLine(row);
            return {
                name: parts[0]?.trim() || "",
                category: parts[1]?.trim() || "", // Column B
                price: parts[2]?.trim() || "",
                description: parts[3]?.trim() || "",
                image: parts[4]?.trim() || "",
                status: parts[5]?.trim() || "In Stock",
                info: parts[6]?.trim() || ""
            };
        }).filter(item => item.name.length > 0);

        if (targetCategory !== 'all') {
            products = products.filter(p => p.category.toLowerCase().includes(targetCategory.toLowerCase()));
        }

        renderGrid(products);
    } catch (err) {
        console.error("Data error:", err);
    }
}

function parseCSVLine(text) {
    const result = [];
    let cur = "", inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        if (char === '"') inQuotes = !inQuotes;
        else if (char === ',' && !inQuotes) { result.push(cur); cur = ""; }
        else cur += char;
    }
    result.push(cur);
    return result;
}

function renderGrid(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = products.length ? '' : '<p style="text-align:center; grid-column: 1/-1;">No items found in this category.</p>';
    products.forEach(item => {
        const statusClass = item.status.toLowerCase().includes('out') ? 'out-of-stock' : 'in-stock';
        const infoClass = item.info.toLowerCase().includes('new') ? 'info-badge is-new' : 'info-badge';
        container.innerHTML += `
            <div class="card">
                <div class="badge-container">
                    <div class="status-badge ${statusClass}">${item.status}</div>
                    ${item.info ? `<div class="${infoClass}">${item.info}</div>` : ''}
                </div>
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/150'">
                <h3>${item.name}</h3>
                <p class="description">${item.description}</p>
                <p class="price">${item.price} ETB</p>
                <a href="https://t.me/selam_446" class="btn-main">Order on Telegram</a>
            </div>`;
    });
}
