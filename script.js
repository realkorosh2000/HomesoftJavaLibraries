// Simple script to load libraries from libs.json
document.addEventListener('DOMContentLoaded', async function() {
    const loadingElement = document.querySelector('.loading');
    const gridElement = document.querySelector('.libraries-grid');
    const totalLibsElement = document.querySelector('#totalLibs');
    const totalSizeElement = document.querySelector('#totalSize');
    
    try {
        const response = await fetch('libs.json');
        const libraries = await response.json();
        
        // Update stats
        totalLibsElement.textContent = libraries.length;
        
        // Calculate total size (you'd need to fetch this from server or hardcode)
        let totalSize = 0;
        libraries.forEach(lib => {
            // Extract numeric size from "45 KB" etc
            const sizeText = lib.size || '0 KB';
            const match = sizeText.match(/(\d+\.?\d*)\s*(KB|MB)/);
            if (match) {
                const size = parseFloat(match[1]);
                const unit = match[2];
                totalSize += unit === 'MB' ? size * 1024 : size;
            }
        });
        totalSizeElement.textContent = totalSize < 1024 ? 
            `${totalSize.toFixed(0)} KB` : 
            `${(totalSize / 1024).toFixed(1)} MB`;
        
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
                
                <p class="lib-desc">${library.desc}</p>
                
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
                
                <a href="${library.Download}" class="download-btn" download="${library.name}.jar">
                    Download ${library.name}.jar
                </a>
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
                <p>Please check if libs.json exists and is valid JSON.</p>
            </div>
        `;
    }
});
