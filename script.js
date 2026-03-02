// Pax Tech Official CSV Link
const csvURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSAF9rSVYWeMUZXAZqag2EerWjpgQ_RfGtlhRFhBRkFeDqNPllZ7cn7wDQn7KFBVuJquSq7balxUd-c/pub?output=csv';

let allProducts = [];

// 1. መረጃውን ከGoogle Sheet የማምጣት ስራ
async function init() {
    try {
        const response = await fetch(csvURL);
        const data = await response.text();
        
        // መረጃውን በመስመር መከፋፈል
        const rows = data.split(/\r?\n/).slice(1); 

        allProducts = rows.map(row => {
            // ስሙ መሃል ኮማ ቢኖር እንኳ እንዳይሳሳት የሚያደርግ Regex ዘዴ
            const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            
            if (cols.length >= 5) {
                return {
                    name: cols[0].replace(/"/g, '').trim(),     // Column A: Full Name
                    category: cols[1].replace(/"/g, '').trim(), // Column B: Category
                    price: cols[2].replace(/"/g, '').trim(),    // Column C: Price
                    desc: cols[3].replace(/"/g, '').trim(),     // Column D: Description
                    img: cols[4].replace(/"/g, '').trim(),      // Column E: Image URL
                    status: cols[5] ? cols[5].replace(/"/g, '').trim() : ''
                };
            }
        }).filter(p => p && p.name);

        displayItems(allProducts);
    } catch (error) {
        console.error("Failed to load products:", error);
        document.getElementById('product-list').innerHTML = "<h3>Error loading products. Please try again later.</h3>";
    }
}

// 2. ዕቃዎቹን በዌብሳይቱ ላይ የማሳየት ስራ
function displayItems(items) {
    const list = document.getElementById('product-list');
    list.innerHTML = items.length ? '' : '<h3>No items found in this category.</h3>';
    
    items.forEach(p => {
        // ምስሉ ከጠፋ የ "Placeholder" ምስል እንዲያሳይ
        const imageUrl = p.img ? p.img : 'https://via.placeholder.com/200?text=No+Image';
        
        list.innerHTML += `
            <div class="card">
                <img src="${imageUrl}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/200?text=Image+Error'">
                <h3>${p.name}</h3>
                <p style="font-size: 0.9rem; color: #666; height: 40px; overflow: hidden;">${p.desc}</p>
                <div class="price">${p.price} ETB</div>
                <button class="btn-main" style="border: 1px solid #0044cc; font-size: 0.9rem;" 
                    onclick="window.open('https://t.me/selam_446')">Order Now</button>
            </div>
        `;
    });
}

// 3. በካቴጎሪ የመለየት (Filtering) ስራ
function filterItems(cat) {
    if (cat === 'All') {
        displayItems(allProducts);
    } else {
        const filtered = allProducts.filter(p => 
            p.category && p.category.toLowerCase() === cat.toLowerCase()
        );
        displayItems(filtered);
    }
}

// 4. ዕቃዎችን የመፈለጊያ (Search) ስራ
function searchProducts() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.category.toLowerCase().includes(term)
    );
    displayItems(filtered);
}

// ሲስተሙን ማስጀመር
init();