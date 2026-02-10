document.addEventListener('DOMContentLoaded', async function() {
    const loadingElement = document.querySelector('.loading');
    const gridElement = document.querySelector('.libraries-grid');
    
    try {
        const response = await fetch('libs.json');
        const libraries = await response.json();
        
        // Sort libraries by ID (ascending order)
        libraries.sort((a, b) => parseInt(a.ID) - parseInt(b.ID));
        
        // Generate library cards in ID order
        gridElement.innerHTML = '';
        libraries.forEach(library => {
            const card = document.createElement('div');
            card.className = 'library-card';
            
            // Build tags HTML if they exist
            let tagsHTML = '';
            if (library.tags && library.tags.length > 0) {
                tagsHTML = `
                <div class="lib-tags">
                    ${library.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                `;
            }
            
            // Build features HTML if they exist
            let featuresHTML = '';
            if (library.features && library.features.length > 0) {
                featuresHTML = `
                <div class="lib-features">
                    ${library.features.map(feature => `<div class="feature">✓ ${feature}</div>`).join('')}
                </div>
                `;
            }
            
            // Build documentation button if link exists
            let docButtonHTML = '';
            if (library.documentation) {
                docButtonHTML = `
                <a href="${library.documentation}" 
                   class="btn doc-btn">
                    Documentation
                </a>
                `;
            }
            
            // Create the card HTML
            card.innerHTML = `
                <div class="lib-header">
                    <h3 class="lib-name">${library.name}</h3>
                    <span class="lib-id">ID: ${library.ID}</span>
                </div>
                
                <p class="lib-desc">${library.description}</p>
                
                ${tagsHTML}
                
                <div class="lib-info">
                    <span>v${library.version}</span>
                    <span>${library.size}</span>
                    <span>${library.javaVersion}</span>
                </div>
                
                ${featuresHTML}
                
                <!-- TWO BUTTONS: Download & Documentation -->
                <div class="button-row">
                    <a href="${library.download}" 
                       class="btn download-btn" 
                       download="${library.filename}">
                        Download
                    </a>
                    
                    ${docButtonHTML}
                </div>
            `;
            
            gridElement.appendChild(card);
        });
        
        loadingElement.style.display = 'none';
        
    } catch (error) {
        console.error('Error loading libraries:', error);
        loadingElement.innerHTML = `
            <div style="color: #ff6b6b; padding: 20px; text-align: center;">
                <h3>Error loading libraries</h3>
                <p>${error.message}</p>
                <p>Please check if libs.json exists and has valid JSON format.</p>
            </div>
        `;
    }
});
