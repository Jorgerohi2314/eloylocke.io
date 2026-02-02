// Style loaded in index.html

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId.startsWith('#') && targetId !== '#') {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Reveal animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.querySelectorAll('.step-card, .glass-panel, .hero-content, .hero-image, .gallery-item').forEach(el => {
    el.classList.add('fade-in-section');
    observer.observe(el);
});

// User Selection Logic
const userLinks = {
    jorge: "[ENLACE_ROM_JORGE]",
    manu: "[ENLACE_ROM_MANU]",
    montes: "[ENLACE_ROM_MONTES]",
    mario: "[ENLACE_ROM_MARIO]",
    fran: "[ENLACE_ROM_FRAN]",
    pablo: "[ENLACE_ROM_PABLO]"
};

// Log Parser for Pokemon Game Information
class GameLogParser {
    constructor() {
        this.cachedData = null;
        this.pokemonCache = new Map();
    }

    async parseLogFile(filePath) {
        if (this.cachedData) return this.cachedData;
        
        try {
            // For now, we'll use the sample file path
            const response = await fetch(filePath);
            const text = await response.text();
            const lines = text.split('\n');
            
            const result = {
                evolutions: this.parseEvolutions(lines),
                shops: this.parseShops(lines),
                movements: this.parseMovements(lines)
            };
            
            this.cachedData = result;
            return result;
        } catch (error) {
            console.error('Error parsing log file:', error);
            return { evolutions: [], shops: [], movements: [] };
        }
    }

    parseEvolutions(lines) {
        const evolutions = [];
        let currentSection = null;
        
        for (let line of lines) {
            const cleanLine = line.replace(/^\d+\|\s*/, '').trim();
            
            if (cleanLine.includes('--Removing Impossible Evolutions--')) {
                currentSection = 'removing';
                continue;
            } else if (cleanLine.includes('--Making Evolutions Easier-')) {
                currentSection = 'easier';
                continue;
            } else if (cleanLine.includes('--Shops--') || cleanLine.includes('--Learnsets--') || cleanLine.includes('--New Base Stats--')) {
                currentSection = null;
                continue;
            }
            
            if (currentSection && cleanLine.includes('->')) {
                const match = cleanLine.match(/(\d+)\s+(.+?)\s*->\s*(.+)/);
                if (match) {
                    const pokemonId = match[1];
                    const fromPokemon = match[2].trim();
                    const toPokemon = match[3].replace(/\(no evolution\)/, 'Sin evolución').trim();
                    
                    evolutions.push({
                        id: pokemonId,
                        from: fromPokemon,
                        to: toPokemon,
                        type: currentSection
                    });
                }
            }
        }
        
        return evolutions;
    }

    parseShops(lines) {
        const shops = [];
        let currentShop = null;
        
        for (let line of lines) {
            const cleanLine = line.replace(/^\d+\|\s*/, '').trim();
            
            if (cleanLine.includes('--Shops--')) {
                currentShop = null;
                continue;
            } else if (cleanLine.includes('--Pickup Items--') || cleanLine.includes('--ROM Diagnostics--')) {
                if (currentShop && currentShop.items.length > 0) {
                    shops.push(currentShop);
                }
                currentShop = null;
                continue;
            }
            
            // Parse shop names (lines without - or numbers but ending with nothing)
            if (cleanLine && 
                !cleanLine.startsWith('--') && 
                !cleanLine.startsWith('-') && 
                !cleanLine.match(/^\d/) &&
                !cleanLine.includes(':') &&
                !cleanLine.includes('%') &&
                !cleanLine.includes('->') &&
                !cleanLine.includes('Lv') &&
                !cleanLine.includes('Incenses') && !cleanLine.includes('Vitamins') && 
                !cleanLine.includes('Secondary') && !cleanLine.includes('Dept.') &&
                !cleanLine.includes('Herbs') && 
                currentShop === null) {
                // This is a shop name
                currentShop = { name: cleanLine, items: [] };
                continue;
            }
            
            if (currentShop && cleanLine && cleanLine.startsWith('-')) {
                // Parse shop items
                const itemName = cleanLine.substring(1).trim();
                if (itemName && !itemName.includes('Incenses') && !itemName.includes('Vitamins')) {
                    currentShop.items.push({
                        name: itemName,
                        price: null // Prices aren't shown in this format
                    });
                }
            }
        }
        
        // Add last shop if exists
        if (currentShop && currentShop.items.length > 0) {
            shops.push(currentShop);
        }
        
        return shops;
    }

    parseMovements(lines) {
        const movements = [];
        let currentPokemon = null;
        
        for (let line of lines) {
            const cleanLine = line.replace(/^\d+\|\s*/, '').trim();
            
            if (cleanLine.includes('--Learnsets--')) {
                continue;
            } else if (cleanLine.match(/^\d+\s+.+?\s*->\s*.+/)) {
                // This looks like a pokemon entry, extract current pokemon
                const match = cleanLine.match(/^\d+\s+(.+?)\s*->\s*(.+)/);
                if (match) {
                    currentPokemon = match[1].trim();
                }
                continue;
            }
            
            if (currentPokemon && cleanLine.includes(':')) {
                // Parse movement changes
                const moveMatch = cleanLine.match(/Level\s+(\d+)\s*:\s*(.+)/);
                if (moveMatch) {
                    movements.push({
                        pokemon: currentPokemon,
                        level: parseInt(moveMatch[1]),
                        move: moveMatch[2].trim()
                    });
                }
            }
        }
        
        return movements;
    }

    async getPokemonInfo(pokemonName) {
        if (this.pokemonCache.has(pokemonName)) {
            return this.pokemonCache.get(pokemonName);
        }
        
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
            if (!response.ok) return null;
            
            const data = await response.json();
            const pokemonInfo = {
                name: data.name,
                id: data.id,
                types: data.types.map(t => t.type.name),
                abilities: data.abilities.map(a => a.ability.name),
                sprite: data.sprites.front_default
            };
            
            this.pokemonCache.set(pokemonName, pokemonInfo);
            return pokemonInfo;
        } catch (error) {
            console.error(`Error fetching info for ${pokemonName}:`, error);
            return null;
        }
    }
}

// Initialize log parser
const logParser = new GameLogParser();

const userButtons = document.querySelectorAll('.user-btn');
const downloadContainer = document.getElementById('download-container');
const selectedUserName = document.getElementById('selected-user-name');
const dynamicDownloadLink = document.getElementById('dynamic-download-link');
const romDownloadContainer = document.getElementById('rom-download-container');
const romDownloadLink = document.getElementById('rom-download-link');

userButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        userButtons.forEach(b => b.classList.remove('active'));

        // Add active class to clicked
        btn.classList.add('active');

        const user = btn.dataset.user;
        const link = userLinks[user];

        // Update content
        if (selectedUserName) {
            selectedUserName.textContent = user;
        }
        if (dynamicDownloadLink) {
            dynamicDownloadLink.href = link;
        }

        // Update ROM download area
        if (romDownloadLink) {
            romDownloadLink.href = link;
        }

        // Update ROM filename display
        const userNamePlaceholder = document.querySelector('.user-name-placeholder');
        if (userNamePlaceholder) {
            userNamePlaceholder.textContent = user.charAt(0).toUpperCase() + user.slice(1);
        }

        // Show download areas with animation
        if (downloadContainer) {
            downloadContainer.classList.remove('hidden');
        }
        if (romDownloadContainer) {
            romDownloadContainer.classList.remove('hidden');
        }
    });
});

// Game Information Display Logic
class GameInfoDisplay {
    constructor() {
        this.currentTab = 'evolutions';
        this.currentUser = 'montes';
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.setupUserSelection();
        this.setupRefreshButton();
        this.loadGameData();
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                
                // Update active states
                tabButtons.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(`${tabName}-tab`).classList.add('active');
                
                this.currentTab = tabName;
                this.displayCurrentTab();
            });
        });
    }

    setupUserSelection() {
        const userSelect = document.getElementById('user-select');
        if (userSelect) {
            userSelect.addEventListener('change', (e) => {
                this.currentUser = e.target.value;
                this.loadGameData();
            });
        }
    }

    setupRefreshButton() {
        const refreshBtn = document.getElementById('refresh-data');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadGameData();
            });
        }
    }

    async loadGameData() {
        const logPath = `./logs/locke${this.currentUser.charAt(0).toUpperCase() + this.currentUser.slice(1)}.cxi.log`;
        
        // Show loading states
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.innerHTML = '<div class="loading-spinner">Cargando datos...</div>';
        });

        try {
            const gameData = await logParser.parseLogFile(logPath);
            this.gameData = gameData;
            this.displayCurrentTab();
        } catch (error) {
            console.error('Error loading game data:', error);
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.innerHTML = '<div class="error-message">Error al cargar los datos del juego</div>';
            });
        }
    }

    displayCurrentTab() {
        if (!this.gameData) return;

        const currentPane = document.getElementById(`${this.currentTab}-tab`);
        if (!currentPane) return;

        switch (this.currentTab) {
            case 'evolutions':
                this.displayEvolutions(currentPane);
                break;
            case 'shops':
                this.displayShops(currentPane);
                break;
            default:
                console.warn(`Unknown tab: ${this.currentTab}`);
        }
    }

    async displayEvolutions(container) {
        const evolutions = this.gameData.evolutions || [];
        
        if (evolutions.length === 0) {
            container.innerHTML = '<div class="no-data">No hay información de evoluciones disponible</div>';
            return;
        }

        container.innerHTML = '<div class="loading-spinner">Cargando información de Pokémon...</div>';
        
        // Fetch Pokemon info for enhanced display
        const enhancedEvolutions = await Promise.all(
            evolutions.slice(0, 20).map(async (evo) => { // Limit to 20 for performance
                const fromInfo = await this.getPokemonInfo(evo.from.split(' ')[0]);
                const toInfo = await this.getPokemonInfo(evo.to.split(' ')[0]);
                
                return {
                    ...evo,
                    fromInfo,
                    toInfo
                };
            })
        );

        const html = `
            <div class="evolutions-grid">
                ${enhancedEvolutions.map(evo => `
                    <div class="evolution-card ${evo.type}">
                        <div class="evolution-id">#${evo.id}</div>
                        <div class="evolution-content">
                            <div class="pokemon-evolution">
                                <div class="pokemon-sprite">
                                    ${evo.fromInfo ? `<img src="${evo.fromInfo.sprite}" alt="${evo.fromInfo.name}" onerror="this.style.display='none'">` : ''}
                                    <div class="pokemon-details">
                                        <div class="pokemon-name">${evo.from}</div>
                                        ${evo.fromInfo ? `
                                            <div class="pokemon-types">
                                                ${evo.fromInfo.types.map(type => 
                                                    `<span class="type-badge ${type}">${type.toUpperCase()}</span>`
                                                ).join('')}
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                                <div class="evolution-arrow">→</div>
                                <div class="pokemon-sprite">
                                    ${evo.toInfo ? `<img src="${evo.toInfo.sprite}" alt="${evo.toInfo.name}" onerror="this.style.display='none'">` : ''}
                                    <div class="pokemon-details">
                                        <div class="pokemon-name">${evo.to}</div>
                                        ${evo.toInfo ? `
                                            <div class="pokemon-types">
                                                ${evo.toInfo.types.map(type => 
                                                    `<span class="type-badge ${type}">${type.toUpperCase()}</span>`
                                                ).join('')}
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="evolution-type">${evo.type === 'removing' ? 'Imposible' : 'Más Fácil'}</div>
                    </div>
                `).join('')}
            </div>
        `;
        
        container.innerHTML = html;
    }

    async getPokemonInfo(pokemonName) {
        // Extract the actual Pokemon name (remove numbers and extra spaces)
        const cleanName = pokemonName.replace(/^\d+\s*/, '').trim();
        return await logParser.getPokemonInfo(cleanName);
    }



    displayShops(container) {
        const shops = this.gameData.shops || [];
        
        if (shops.length === 0) {
            container.innerHTML = '<div class="no-data">No hay información de tiendas disponible</div>';
            return;
        }

        const html = `
            <div class="shops-container">
                ${shops.map(shop => `
                    <div class="shop-card">
                        <h4 class="shop-name">${shop.name}</h4>
                        <div class="shop-items">
                            ${shop.items.map(item => `
                                <div class="shop-item">
                                    <span class="item-name">${item.name}</span>
                                    ${item.price ? `<span class="item-price">¢${item.price}</span>` : '<span class="item-available">Disponible</span>'}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        container.innerHTML = html;
    }
}

// Initialize game info display
const gameInfoDisplay = new GameInfoDisplay();
