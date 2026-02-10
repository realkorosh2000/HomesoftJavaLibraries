document.addEventListener('DOMContentLoaded', async function() {
    const loadingElement = document.querySelector('.loading');
    const gridElement = document.querySelector('.libraries-grid');
    
    try {
        const response = await fetch('libs.json');
        const libraries = await response.json();
        
        // Generate library cards
        gridElement.innerHTML = '';
        libraries.forEach(library => {
            const card = document.createElement('div');
            card.className = 'library-card';
            
            card.innerHTML = `
                <div class="lib-header">
                    <h3 class="lib-name">${library.name}</h3>
                    <span class="lib-id">ID: ${library.ID}</span>
                </div>
                
                <p class="lib-desc">${library.desc || library.description}</p>
                
                ${library.tags ? `
                <div class="lib-tags">
                    ${library.tags.map(tag => 
                        `<span class="tag">${tag}</span>`
                    ).join('')}
                </div>
                ` : ''}
                
                <div class="lib-info">
                    <span>v${library.version}</span>
                    <span>${library.size}</span>
                    <span>${library.javaVersion}</span>
                </div>
                
                <!-- TWO BUTTONS: Download & Documentation -->
                <div class="button-row">
                    <a href="${library.download}" 
                       class="btn download-btn" 
                       download="${library.filename}">
                        Download
                    </a>
                    
                    ${library.documentation ? `
                    <a href="${library.documentation}" 
                       class="btn doc-btn">
                        Documentation
                    </a>
                    ` : ''}
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
                <p>Please check if libs.json exists.</p>
            </div>
        `;
    }
});
