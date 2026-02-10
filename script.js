document.addEventListener('DOMContentLoaded', async function() {
    const loadingElement = document.querySelector('.loading');
    const gridElement = document.querySelector('.libraries-grid');
    
    try {
        // Load the libraries JSON file
        const response = await fetch('libs.json');
        
        if (!response.ok) {
            throw new Error(`Failed to load libs.json: ${response.status} ${response.statusText}`);
        }
        
        const libraries = await response.json();
        
        // Validate JSON structure
        if (!Array.isArray(libraries)) {
            throw new Error('libs.json should contain an array of libraries');
        }
        
        // Sort libraries by ID (ascending order)
        libraries.sort((a, b) => {
            const idA = parseInt(a.ID || 0);
            const idB = parseInt(b.ID || 0);
            return idA - idB;
        });
        
        // Clear loading message
        loadingElement.style.display = 'none';
        
        // Generate library cards in ID order
        gridElement.innerHTML = '';
        
        libraries.forEach(library => {
            // Validate required fields
            if (!library.name || !library.download || !library.filename) {
                console.warn('Library missing required fields:', library);
                return;
            }
            
            // Build tags HTML if they exist
            let tagsHTML = '';
            if (library.tags && Array.isArray(library.tags) && library.tags.length > 0) {
                tagsHTML = `
                <div class="lib-tags">
                    ${library.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                `;
            }
            
            // Build features HTML if they exist
            let featuresHTML = '';
            if (library.features && Array.isArray(library.features) && library.features.length > 0) {
                featuresHTML = `
                <div class="lib-features">
                    ${library.features.map(feature => `<div class="feature">${feature}</div>`).join('')}
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
            const card = document.createElement('div');
            card.className = 'library-card';
            card.innerHTML = `
                <div class="lib-header">
                    <h3 class="lib-name">${library.name}</h3>
                    <span class="lib-id">ID: ${library.ID || 'N/A'}</span>
                </div>
                
                <p class="lib-desc">${library.description || 'No description available.'}</p>
                
                ${tagsHTML}
                
                <div class="lib-info">
                    <span>v${library.version || '1.0'}</span>
                    <span>${library.size || 'Unknown size'}</span>
                    <span>${library.javaVersion || 'Java 8+'}</span>
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
        
        // If no libraries were added (empty or invalid JSON)
        if (gridElement.children.length === 0) {
            gridElement.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: #b0b0d0;">
                    <h3>No libraries found</h3>
                    <p>Check your libs.json file format.</p>
                </div>
            `;
        }
        
    } catch (error) {
        console.error('Error loading libraries:', error);
        loadingElement.innerHTML = `
            <div style="color: #ff6b6b; padding: 20px; text-align: center;">
                <h3>Error loading libraries</h3>
                <p>${error.message}</p>
                <p>Please check if libs.json exists and has valid JSON format.</p>
                <pre style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; margin-top: 10px;">
Example format:
[
  {
    "ID": "0",
    "name": "Library Name",
    "filename": "library.jar",
    "download": "./Libs/library.jar",
    "documentation": "./docs/library.html",
    "description": "Description here",
    "tags": ["tag1", "tag2"]
  }
]
                </pre>
            </div>
        `;
    }
});
