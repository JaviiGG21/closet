document.addEventListener('DOMContentLoaded', () => {
    const clothingItemsContainer = document.getElementById('clothing-items');
    const weeklyPlannerContainer = document.getElementById('weekly-planner');
    const favoriteOutfitsContainer = document.getElementById('favorite-outfits');
    const favoritesPlaceholder = document.getElementById('favorites-placeholder');
    // Suggestion Elements
    const occasionSelect = document.getElementById('occasion');
    const weatherSelect = document.getElementById('weather');
    const suggestBtn = document.getElementById('suggest-btn');
    const suggestedOutfitContainer = document.getElementById('suggested-outfit');
    const suggestionPlaceholder = document.getElementById('suggestion-placeholder');
    const addSuggestionControls = document.getElementById('add-suggestion-controls');
    const suggestionDaySelect = document.getElementById('suggestion-day');
    const addSuggestionBtn = document.getElementById('add-suggestion-btn');
    // Navigation Elements
    const mainNav = document.querySelector('.main-nav');
    const navButtons = mainNav.querySelectorAll('button'); 
    const contentSections = document.querySelectorAll('.main-content-area .content-section'); 

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.dataset.section;
    
            // Quitar clase activa de todos los botones
            navButtons.forEach(btn => btn.classList.remove('active-tab'));
    
            // Ocultar todas las secciones
            contentSections.forEach(section => section.classList.remove('active-section'));
    
            // Activar el botón clicado
            button.classList.add('active-tab');
    
            // Mostrar la sección correspondiente
            const sectionToShow = document.getElementById(`${targetSection}-section`);
            if (sectionToShow) {
                sectionToShow.classList.add('active-section');
            }
        });
    });
    

    let currentSuggestion = []; 

    // --- SVG Generators ---
    function createTshirtSVG(color) {
        return `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path class="clothing-shape" fill="${color}" d="M85,20 L75,10 L65,20 L60,15 V30 H40 V15 L35,20 L25,10 L15,20 V50 H30 V85 H70 V50 H85 V20 Z" />
        </svg>`;
    }

    function createPantsSVG(color) {
        return `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path class="clothing-shape" fill="${color}" d="M30,10 H70 V20 H80 V90 H60 V40 H40 V90 H20 V20 H30 V10 Z" />
        </svg>`;
    }

    function createShoesSVG(color, border) {
        const stroke = border ? `stroke="${border}"` : '';
        return `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path class="clothing-shape" fill="${color}" ${stroke} d="M20,65 C10,70 10,85 25,90 H75 C90,85 90,70 80,65 L70,60 H30 L20,65 Z M30,60 L25,50 H75 L70,60 Z" />
        </svg>`;
    }

    function createJacketSVG(color) {
        return `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path class="clothing-shape" fill="${color}" d="M80,25 L70,15 L60,25 V40 H75 V85 H25 V40 H40 V25 L30,15 L20,25 V80 H10 V30 L30,10 H70 L90,30 V80 H80 V25 Z M45,40 H55 V80 H45 V40 Z" />
        </svg>`;
    }

    function createSkirtSVG(color) {
        return `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path class="clothing-shape" fill="${color}" d="M20,10 H80 V20 L90,90 H10 L20,20 V10 Z" />
        </svg>`;
    }

    function createDressSVG(color) {
        return `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path class="clothing-shape" fill="${color}" d="M75,10 L65,20 L60,15 V30 H40 V15 L35,20 L25,10 V30 H15 L5,90 H95 L85,30 H75 V10 Z" />
        </svg>`;
    }

     function createHatSVG(color, accentColor = '#555') {
        return `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path class="clothing-shape" fill="${color}" d="M10,70 Q50,60 90,70 Q50,85 10,70 Z M25,68 Q50,50 75,68 A30,30 0 0,1 25,68 Z" />
          <path fill="${accentColor}" d="M15,65 H85 V70 H15 Z" opacity="0.5"/>
        </svg>`;
    }

    function createAccessorySVG(color) { 
        return `
         <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
           <path class="clothing-shape" fill="${color}" d="M20,10 C40,0 60,0 80,10 V90 C60,100 40,100 20,90 V10 Z M25,15 V85 C40,93 60,93 75,85 V15 C60,7 40,7 25,15 Z" />
           <line x1="25" y1="30" x2="75" y2="30" stroke="#fff" stroke-width="3" opacity="0.5"/>
           <line x1="25" y1="50" x2="75" y2="50" stroke="#fff" stroke-width="3" opacity="0.5"/>
           <line x1="25" y1="70" x2="75" y2="70" stroke="#fff" stroke-width="3" opacity="0.5"/>
         </svg>`;
    }


    // --- Sample Data (Expanded) ---
    const sampleClothes = [
        // Tops
        { id: 't1', type: 'T-Shirt', color: '#ff6b6b', name: 'Camiseta Roja', svgFunc: createTshirtSVG, weather: ['warm', 'cool'], occasion: ['casual', 'sport'] },
        { id: 't2', type: 'T-Shirt', color: '#4ecdc4', name: 'Camiseta Aqua', svgFunc: createTshirtSVG, weather: ['warm', 'cool'], occasion: ['casual', 'sport'] },
        { id: 't3', type: 'T-Shirt', color: '#ffe66d', name: 'Camiseta Amarilla', svgFunc: createTshirtSVG, weather: ['warm'], occasion: ['casual'] },
        { id: 't4', type: 'T-Shirt', color: '#5d6d7e', name: 'Camiseta Gris', svgFunc: createTshirtSVG, weather: ['warm', 'cool'], occasion: ['casual', 'sport'] },
        { id: 't5', type: 'T-Shirt', color: '#ffffff', name: 'Camiseta Blanca', svgFunc: createTshirtSVG, weather: ['warm', 'cool'], occasion: ['casual', 'formal', 'sport'], border:'#eee' }, 
        // Bottoms
        { id: 'p1', type: 'Pants', color: '#45aaf2', name: 'Jeans Azules', svgFunc: createPantsSVG, weather: ['warm', 'cool', 'cold'], occasion: ['casual'] },
        { id: 'p2', type: 'Pants', color: '#3d3d3d', name: 'Pantalón Negro', svgFunc: createPantsSVG, weather: ['cool', 'cold'], occasion: ['casual', 'formal'] },
        { id: 'p3', type: 'Pants', color: '#778ca3', name: 'Pantalón Gris', svgFunc: createPantsSVG, weather: ['cool', 'cold'], occasion: ['casual', 'formal'] },
        { id: 'p4', type: 'Pants', color: '#f39c12', name: 'Pantalón Caqui', svgFunc: createPantsSVG, weather: ['warm', 'cool'], occasion: ['casual'] },
        { id: 'k1', type: 'Skirt', color: '#f1948a', name: 'Falda Rosa', svgFunc: createSkirtSVG, weather: ['warm'], occasion: ['casual', 'formal'] },
        { id: 'k2', type: 'Skirt', color: '#8e44ad', name: 'Falda Morada', svgFunc: createSkirtSVG, weather: ['warm', 'cool'], occasion: ['casual'] },
        // Shoes
        { id: 's1', type: 'Shoes', color: '#fd9644', name: 'Zapatos Naranjas', svgFunc: createShoesSVG, weather: ['warm', 'cool'], occasion: ['casual', 'sport'] },
        { id: 's2', type: 'Shoes', color: '#ffffff', border: '#cccccc', name: 'Zapatos Blancos', svgFunc: createShoesSVG, weather: ['warm', 'cool'], occasion: ['casual', 'sport'] },
        { id: 's3', type: 'Shoes', color: '#34495e', name: 'Zapatos Negros', svgFunc: createShoesSVG, weather: ['cool', 'cold'], occasion: ['casual', 'formal'] },
        // Jackets/Outerwear
        { id: 'j1', type: 'Jacket', color: '#a55eea', name: 'Chaqueta Morada', svgFunc: createJacketSVG, weather: ['cool', 'cold'], occasion: ['casual'] },
        { id: 'j2', type: 'Jacket', color: '#2bcbba', name: 'Chaqueta Verde', svgFunc: createJacketSVG, weather: ['cool', 'cold'], occasion: ['casual', 'sport'] },
        { id: 'j3', type: 'Jacket', color: '#e74c3c', name: 'Chaqueta Roja', svgFunc: createJacketSVG, weather: ['cool', 'cold'], occasion: ['casual', 'sport'] },
        // Dresses
        { id: 'd1', type: 'Dress', color: '#3498db', name: 'Vestido Azul', svgFunc: createDressSVG, weather: ['warm', 'cool'], occasion: ['casual', 'formal'] },
        { id: 'd2', type: 'Dress', color: '#f7dc6f', name: 'Vestido Amarillo', svgFunc: createDressSVG, weather: ['warm'], occasion: ['casual'] },
        // Accessories
        { id: 'a1', type: 'Accessory', color: '#e67e22', name: 'Bufanda Naranja', svgFunc: createAccessorySVG, weather: ['cold'], occasion: ['casual', 'formal'] },
        { id: 'h1', type: 'Accessory', color: '#95a5a6', name: 'Sombrero Gris', svgFunc: createHatSVG, weather: ['warm', 'cool'], occasion: ['casual'] },
    ];


    // Load state from localStorage or initialize
    let weeklyOutfits = JSON.parse(localStorage.getItem('weeklyOutfits')) || {
        Lunes: [], Martes: [], Miércoles: [], Jueves: [], Viernes: [], Sábado: [], Domingo: []
    };
    let favoriteOutfits = JSON.parse(localStorage.getItem('favoriteOutfits')) || {}; 

    // --- State Saving ---
    function saveState() {
        localStorage.setItem('weeklyOutfits', JSON.stringify(weeklyOutfits));
        localStorage.setItem('favoriteOutfits', JSON.stringify(favoriteOutfits));
    }

    // --- Rendering Functions ---
    function renderClothingItems() {
        clothingItemsContainer.innerHTML = ''; 
        sampleClothes.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('clothing-item');
            div.setAttribute('draggable', true);
            div.setAttribute('data-item-id', item.id);
            const svgHtml = item.svgFunc(item.color, item.border || item.accentColor); 
            div.innerHTML = `
                ${svgHtml}
                <span>${item.name}</span>
            `;
            div.addEventListener('dragstart', dragStart);
            div.addEventListener('dragend', dragEnd); 
            clothingItemsContainer.appendChild(div);
        });
    }

    function renderWeeklyPlanner() {
        document.querySelectorAll('.day-column').forEach(dayColumn => {
            const slot = dayColumn.querySelector('.outfit-slot');
            const day = dayColumn.dataset.day;
            slot.innerHTML = ''; 

            weeklyOutfits[day].forEach(itemId => {
                const item = sampleClothes.find(c => c.id === itemId);
                if (item) {
                    const div = document.createElement('div');
                    div.classList.add('clothing-item');
                    div.setAttribute('data-item-id', item.id); 
                    const svgHtml = item.svgFunc(item.color, item.border || item.accentColor);
                    div.innerHTML = `
                       ${svgHtml}
                       <span>${item.name}</span>
                    `;
                    const removeBtn = document.createElement('button');
                    removeBtn.innerHTML = '×';
                    removeBtn.classList.add('remove-item-btn');
                    removeBtn.title = 'Quitar prenda';
                    removeBtn.onclick = () => removeItemFromDay(day, itemId);
                    div.appendChild(removeBtn);

                    slot.appendChild(div);
                }
            });

            const favButton = document.createElement('button');
            const isFav = favoriteOutfits[day];
            favButton.innerHTML = isFav ? '❤️' : '🤍'; 
            favButton.classList.add('fav-button');
            if (isFav) {
                favButton.classList.add('active');
            }
            favButton.title = isFav ? 'Quitar de favoritos' : 'Marcar como favorito';
            favButton.onclick = () => toggleFavorite(day);
            slot.appendChild(favButton); 
        });
        renderFavoriteOutfits(); 
    }

    function renderFavoriteOutfits() {
        favoriteOutfitsContainer.innerHTML = ''; 
        let hasFavorites = false;

        Object.keys(favoriteOutfits).forEach(day => {
            if (favoriteOutfits[day] && weeklyOutfits[day]?.length > 0) {
                hasFavorites = true;
                const outfitDiv = document.createElement('div');
                outfitDiv.classList.add('favorite-outfit-item', 'item-grid'); 
                outfitDiv.style.gridTemplateColumns = 'repeat(auto-fill, minmax(50px, 1fr))'; 
                outfitDiv.innerHTML = `<h4>${day}</h4>`; 

                weeklyOutfits[day].forEach(itemId => {
                    const item = sampleClothes.find(c => c.id === itemId);
                    if (item) {
                        const itemDiv = document.createElement('div');
                        itemDiv.classList.add('clothing-item'); 
                        itemDiv.style.cursor = 'default';
                        itemDiv.style.minHeight = 'auto';
                        itemDiv.style.padding = '0.2rem';
                        const svgHtml = item.svgFunc(item.color, item.border || item.accentColor);
                        itemDiv.innerHTML = `
                             ${svgHtml}
                             <span style="font-size: 0.8em;">${item.name}</span>
                         `;
                        itemDiv.querySelector('svg').style.width = '30px';
                        itemDiv.querySelector('svg').style.height = '30px';

                        outfitDiv.appendChild(itemDiv);
                    }
                });
                favoriteOutfitsContainer.appendChild(outfitDiv);
            }
        });

        const currentPlaceholder = document.getElementById('favorites-placeholder');
        if (hasFavorites && currentPlaceholder) {
            currentPlaceholder.remove();
        } else if (!hasFavorites && !currentPlaceholder) {
             const p = document.createElement('p');
             p.id = 'favorites-placeholder';
             p.textContent = 'Aún no tienes favoritos.';
             favoriteOutfitsContainer.appendChild(p);
        }
    }

    // --- Drag and Drop Handlers ---
    function dragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.dataset.itemId);
        event.dataTransfer.effectAllowed = 'copy';
        setTimeout(() => event.target.classList.add('dragging'), 0);
    }

    function dragEnd(event) {
        const draggedElement = document.querySelector('.dragging');
        if(draggedElement) {
            draggedElement.classList.remove('dragging');
        }
    }

    window.allowDrop = function(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        const slot = event.target.closest('.outfit-slot');
        if (slot) {
            document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
            slot.classList.add('drag-over'); 
        }
    }

    window.drop = function(event, day) {
        event.preventDefault();
        const itemId = event.dataTransfer.getData('text/plain');
        const slot = event.target.closest('.outfit-slot');
        slot?.classList.remove('drag-over'); 

        if (itemId && slot) {
            const MAX_ITEMS_PER_DAY = 5;
            if (weeklyOutfits[day].length < MAX_ITEMS_PER_DAY) {
                if (!weeklyOutfits[day].includes(itemId)) {
                    weeklyOutfits[day].push(itemId);
                    saveState(); 
                    renderWeeklyPlanner(); 
                }
            } else {
                alert(`Puedes agregar un máximo de ${MAX_ITEMS_PER_DAY} prendas por día.`);
            }
        }
        const originalItem = clothingItemsContainer.querySelector(`[data-item-id="${itemId}"]`);
        if (originalItem) originalItem.classList.remove('dragging');
    }

    document.querySelectorAll('#weekly-planner .outfit-slot').forEach(slot => {
        slot.addEventListener('dragleave', (event) => {
            const relatedTarget = event.relatedTarget;
            if (!slot.contains(relatedTarget)) {
                slot.classList.remove('drag-over');
            }
        });
        slot.addEventListener('drop', (event) => {
            slot.classList.remove('drag-over');
        });
    });

    // --- Item Removal ---
    function removeItemFromDay(day, itemId) {
        weeklyOutfits[day] = weeklyOutfits[day].filter(id => id !== itemId);
        if (weeklyOutfits[day].length === 0) {
            favoriteOutfits[day] = false;
        }
        saveState();
        renderWeeklyPlanner(); 
    }

    // --- Favorite Functionality ---
    function toggleFavorite(day) {
        if (weeklyOutfits[day]?.length > 0) { 
            favoriteOutfits[day] = !favoriteOutfits[day]; 
            saveState();
            renderWeeklyPlanner(); 
        } else {
            alert('Añade prendas a este día para marcarlo como favorito.');
        }
    }

    // --- Suggestion Logic ---
    suggestBtn.addEventListener('click', () => {
        const selectedOccasion = occasionSelect.value;
        const selectedWeather = weatherSelect.value;
        suggestionPlaceholder.style.display = 'none'; 
        suggestedOutfitContainer.innerHTML = ''; 
        currentSuggestion = []; 

        const suitableClothes = sampleClothes.filter(item =>
            item.occasion.includes(selectedOccasion) &&
            item.weather.includes(selectedWeather)
        );

        const categories = ['T-Shirt', 'Pants', 'Skirt', 'Dress', 'Shoes', 'Jacket', 'Accessory'];
        let outfit = [];
        let hasTop = false;
        let hasBottom = false;

        const dress = suitableClothes.find(item => item.type === 'Dress');
        if (dress) {
            outfit.push(dress);
            hasTop = true;
            hasBottom = true;
        }

        if (!hasTop) {
            const top = suitableClothes.find(item => item.type === 'T-Shirt'); 
            if (top) {
                outfit.push(top);
                hasTop = true;
            }
        }

        if (!hasBottom) {
            const bottom = suitableClothes.find(item => item.type === 'Pants');
            if (bottom) {
                outfit.push(bottom);
                hasBottom = true;
            }
        }

        const shoes = suitableClothes.find(item => item.type === 'Shoes');
        if (shoes) {
            outfit.push(shoes);
        }

        const jacket = suitableClothes.find(item => item.type === 'Jacket');
        if (jacket) {
            outfit.push(jacket);
        }

        const accessory = suitableClothes.find(item => item.type === 'Accessory');
        if (accessory) {
            outfit.push(accessory);
        }

        outfit.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('clothing-item');
            const svgHtml = item.svgFunc(item.color, item.border || item.accentColor);
            itemDiv.innerHTML = `
                ${svgHtml}
                <span>${item.name}</span>
            `;
            suggestedOutfitContainer.appendChild(itemDiv);
        });
    });

    // --- Initial Load ---
    renderClothingItems();
    renderWeeklyPlanner(); 
    renderFavoriteOutfits(); 

    // --- Add CSS directly in JS for dynamic/utility styles ---
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
.dragging {
    opacity: 0.4;
    transform: scale(0.95);
}
.drag-over {
    background-color: #e8f0fe !important; 
    border-color: #6e8efb !important;
    border-style: solid !important;
}
.remove-item-btn {
    position: absolute;
    top: 0px;
    right: 0px;
    background: rgba(200, 50, 50, 0.7);
    color: white;
    border: none;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    font-size: 10px;
    line-height: 14px;
    text-align: center;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
}
.outfit-slot .clothing-item:hover .remove-item-btn {
    opacity: 1;
}
.outfit-slot .clothing-item {
    position: relative; 
}

.favorite-outfit-item {
    border: 1px solid #eee;
    border-radius: 6px;
    padding: 0.5rem;
    background-color: #fdfdfd;
    position: relative; 
}
.favorite-outfit-item h4 {
    font-size: 0.85em;
    margin: 0 0 0.5rem 0;
    text-align: center;
    color: #666;
    font-weight: 600;
    background-color: #f0f2f5;
    padding: 2px 0;
    border-radius: 3px;
}
.favorite-outfit-item .clothing-item {
    border: none;
    background: none;
    padding: 2px;
}

/* Specific style adjustments for favorite item grid */
#favorite-outfits.item-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); 
    align-items: start; 
}
`;
document.head.appendChild(styleSheet);
});