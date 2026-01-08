export function initLoader() {
    const canvas = document.getElementById('loader-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let isActive = true;
    let width, height;
    let animId;
    
    const cellSize = 30;
    let snake = []; 
    let foods = []; 
    let cycle = 0;
    let tick = 0;
    let speedInterval = 4; // Lower is faster
    
    function reset() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        
        cycle = 0;
        startLevel();
    }
    
    function startLevel() {
        snake = [];
        // Center vertically on a grid line
        const startY = Math.floor(height / 2 / cellSize) * cellSize;
        const length = 3 + cycle * 2;
        
        // Start off screen left
        // Head is at index 0
        for(let i=0; i<length; i++) {
            snake.push({ x: -(i+1)*cellSize, y: startY });
        }
        
        // Spawn foods
        foods = [];
        const numFoods = 3;
        // Distribute across screen width
        const spacing = width / (numFoods + 1);
        for(let i=1; i<=numFoods; i++) {
            foods.push({
                x: Math.floor((i * spacing)/cellSize)*cellSize,
                y: startY
            });
        }
    }
    
    function update() {
        if (!isActive) return;
        
        tick++;
        if (tick % speedInterval === 0) {
            // 1. Move Head
            const head = { ...snake[0] };
            head.x += cellSize;
            
            snake.unshift(head);
            
            // 2. Check Food
            let ate = false;
            for(let i=0; i<foods.length; i++) {
                // Approx collision
                if (Math.abs(head.x - foods[i].x) < cellSize/2) {
                    foods.splice(i, 1);
                    ate = true;
                    break;
                }
            }
            
            // 3. Update Tail
            if (!ate) {
                snake.pop();
            }
            
            // 4. Check Bounds
            const tail = snake[snake.length-1];
            if (tail.x > width) {
                cycle++;
                startLevel();
            }
        }
        
        // Render
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
        
        // Loading Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('LOADING...', width/2, height/2 + cellSize * 2.5);
        
        // Draw Foods
        ctx.fillStyle = '#ffaa00';
        for(const f of foods) {
            ctx.beginPath();
            ctx.arc(f.x + cellSize/2, f.y + cellSize/2, cellSize/3, 0, Math.PI*2);
            ctx.fill();
        }
        
        // Draw Snake
        for(let i=0; i<snake.length; i++) {
            const s = snake[i];
            // Head is slightly brighter
            ctx.fillStyle = i === 0 ? '#44ff44' : '#00cc00';
            ctx.fillRect(s.x + 2, s.y + 2, cellSize - 4, cellSize - 4);
            
            // Eyes for head
            if (i === 0) {
                ctx.fillStyle = '#000';
                ctx.fillRect(s.x + cellSize - 8, s.y + 6, 4, 4); // Eye
            }
        }
        
        animId = requestAnimationFrame(update);
    }
    
    window.addEventListener('resize', reset);
    reset();
    update();
}

export function hideLoader() {
    const el = document.getElementById('loading-screen');
    if (el) {
        el.classList.add('hidden');
        setTimeout(() => {
            el.remove();
        }, 600);
    }
}