let objs = [];
let colors = ['#f71735', '#f7d002', '#1A53C0', '#232323'];
let cnv; // 全域 canvas 參考

function setup() {
    // 整個頁面黑底並移除預設邊距
    document.body.style.backgroundColor = '#000';
    document.body.style.margin = '0';

    // 建立左側隱藏選單（初始隱藏）
    const menu = document.createElement('nav');
    menu.id = 'sideMenu';
    menu.style.cssText = [
        'position:fixed',
        'left:0',
        'top:0',
        'height:100%',
        'width:260px',
        'transform:translateX(-220px)', // 初始隱藏
        'transition:transform 450ms ease',
        'z-index:9999',
        'background:rgba(18,18,18,0.98)',
        'display:flex',
        'flex-direction:column',
        'align-items:flex-start',
        'padding:40px 24px',
        'color:#fff',
        'font-size:32px',
        'box-shadow:2px 0 12px rgba(0,0,0,0.6)',
        'font-family: sans-serif'
    ].join(';');
    menu.innerHTML = `
        <div class="menuItem">第一單元作品</div>
        <div class="menuItem">第一單元講義</div>
        <div class="menuItem">測驗系統</div>
        <div class="menuItem">測驗卷筆記</div>
        <div class="menuItem">回到首頁</div>
        <div id="tkuMenuItemContainer" class="menuItem">
            淡江大學
            <div id="tkuSubMenu" style="display: none; padding-left: 20px; padding-top: 10px; font-size: 26px;">
                <div id="etSubMenuItem" style="padding: 8px 0; cursor: pointer;">教育科技學系</div>
            </div>
        </div>
    `;
    document.body.appendChild(menu);

    // menu item style 與行為（含第一項點擊開啟 iframe）
    const menuItems = document.querySelectorAll('#sideMenu .menuItem');
    menuItems.forEach((mi, idx) => {
        // 排除容器項目，避免觸發不必要的點擊事件
        if (mi.id === 'tkuMenuItemContainer') return;

        mi.style.cssText = 'padding:12px 0; width:100%; cursor:pointer; user-select:none;';
        mi.addEventListener('click', () => {
            const txt = mi.textContent.trim();
            if (txt === '第一單元作品') {
                // 改為開啟指定的 HackMD 頁面（符合要求：iframe 寬 70%、高 85%）
                openIframeOverlay('https://xingruli444-web.github.io/2025-1020/');
            } else if (txt === '第一單元講義') {
                // 保留或改成其他連結
                openIframeOverlay('https://hackmd.io/@4MzeMeSxRKm57NoctRPOiQ/S17Hwm0sex');
            } else if (txt === '測驗系統') {
                openIframeOverlay('https://xingruli444-web.github.io/20251103/');
            } else if (txt === '測驗卷筆記') {
                openIframeOverlay('https://hackmd.io/@4MzeMeSxRKm57NoctRPOiQ/rylFpZ_eZl');
            } else {
                // 可在此加入其他項目的行為
                console.log('clicked', txt);
            }
        });
    });

    // --- 淡江大學子選單專屬邏輯 ---
    const tkuMenuContainer = document.getElementById('tkuMenuItemContainer');
    const tkuSubMenu = document.getElementById('tkuSubMenu');
    const etSubMenuItem = document.getElementById('etSubMenuItem');

    // 滑鼠移入顯示子選單
    tkuMenuContainer.addEventListener('mouseenter', () => {
        tkuSubMenu.style.display = 'block';
    });

    // 滑鼠移出隱藏子選單
    tkuMenuContainer.addEventListener('mouseleave', () => {
        tkuSubMenu.style.display = 'none';
    });

    // 子選單點擊事件
    etSubMenuItem.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止事件冒泡觸發父層的點擊
        window.open('https://www.et.tku.edu.tw/', '_blank');
    });

    // 開啟 iframe 的 overlay（全域單一實例）
    function openIframeOverlay(url) {
        // 若已存在則不重複建立
        if (document.getElementById('iframeOverlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'iframeOverlay';
        overlay.style.cssText = [
            'position:fixed',
            'left:0',
            'top:0',
            'width:100vw',
            'height:100vh',
            'display:flex',
            'align-items:center',
            'justify-content:center',
            'background:rgba(0,0,0,0.6)',
            'z-index:10000'
        ].join(';');

        // 內層容器（實際 iframe 放在這）
        const box = document.createElement('div');
        box.style.cssText = [
            'position:relative',
            'width:70vw',      // 寬為視窗的 70%
            'height:85vh',     // 高為視窗的 85%
            'background:#000',
            'border-radius:6px',
            'overflow:hidden',
            'box-shadow:0 8px 24px rgba(0,0,0,0.7)'
        ].join(';');

        const btnClose = document.createElement('button');
        btnClose.innerText = '✕';
        btnClose.style.cssText = [
            'position:absolute',
            'right:8px',
            'top:8px',
            'z-index:10001',
            'background:transparent',
            'color:#fff',
            'border:0',
            'font-size:28px',
            'cursor:pointer',
            'padding:4px'
        ].join(';');

        const frame = document.createElement('iframe');
        frame.src = url;
        frame.style.cssText = 'width:100%;height:100%;border:0;background:#000;';

        // 點按關閉或 ESC 關閉
        function closeOverlay() {
            window.removeEventListener('keydown', onKey);
            overlay.remove();
        }
        function onKey(e) { if (e.key === 'Escape') closeOverlay(); }

        btnClose.addEventListener('click', closeOverlay);
        overlay.addEventListener('click', (ev) => {
            // 點擊 overlay 背景（非 box）關閉
            if (ev.target === overlay) closeOverlay();
        });
        window.addEventListener('keydown', onKey);

        box.appendChild(btnClose);
        box.appendChild(frame);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    // 顯示 / 隱藏 控制（滑鼠移到視窗最左側 100px）
    let menuOpen = false;
    let hideTimer = null;
    function showMenu() {
        if (!menuOpen) {
            menu.style.transform = 'translateX(0)';
            menuOpen = true;
        }
        if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    }
    function hideMenu() {
        if (menuOpen) {
            menu.style.transform = 'translateX(-220px)';
            menuOpen = false;
        }
    }

    // 滑鼠移動偵測（整個視窗）
    window.addEventListener('mousemove', (e) => {
        if (e.clientX <= 100) {
            showMenu();
        } else {
            // 延遲隱藏以防止閃爍
            if (hideTimer) clearTimeout(hideTimer);
            hideTimer = setTimeout(() => {
                // 若滑鼠不在 menu 範圍內才隱藏
                if (lastMouseX > 260) hideMenu();
            }, 600);
        }
        lastMouseX = e.clientX;
    });

    // 紀錄最後滑鼠位置（供延遲隱藏判斷）
    let lastMouseX = window.innerWidth + 1;

    // 當滑鼠進入 menu 時取消延遲隱藏；離開時延遲隱藏
    menu.addEventListener('mouseenter', () => {
        if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
        showMenu();
    });
    menu.addEventListener('mouseleave', () => {
        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(hideMenu, 600);
    });

    // 建立固定 800x600 畫布並置中
    cnv = createCanvas(800, 600);
    cnv.style('position', 'absolute');
    cnv.position((windowWidth - width) / 2, (windowHeight - height) / 2);

    rectMode(CENTER);
    objs.push(new DynamicShape());
}

function windowResized() {
    // 視窗改變時重新置中畫布
    if (cnv) {
        cnv.position((windowWidth - width) / 2, (windowHeight - height) / 2);
    }
}

function draw() {
    // 畫布內背景也設定為黑色
    background(0);
    for (let i of objs) {
        i.run();
    }

    if (frameCount % int(random([15, 30])) == 0) {
        let addNum = int(random(1, 30));
        for (let i = 0; i < addNum; i++) {
            objs.push(new DynamicShape());
        }
    }
    for (let i = 0; i < objs.length; i++) {
        if (objs[i].isDead) {
            objs.splice(i, 1);
        }
    }

    // 在畫布中央顯示文字
    fill(255); // 設定文字顏色為白色
    noStroke(); // 不要邊框
    textSize(48); // 設定文字大小
    textAlign(CENTER, CENTER); // 設定文字對齊方式為中央
    text("414730365 李幸茹", width / 2, height / 2); // 繪製文字
}

function easeInOutExpo(x) {
    return x === 0 ? 0 :
        x === 1 ?
        1 :
        x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 :
        (2 - Math.pow(2, -20 * x + 10)) / 2;
}

class DynamicShape {
    constructor() {
        this.x = random(0.3, 0.7) * width;
        this.y = random(0.3, 0.7) * height;
        this.reductionRatio = 1;
        this.shapeType = int(random(4));
        this.animationType = 0;
        this.maxActionPoints = int(random(2, 5));
        this.actionPoints = this.maxActionPoints;
        this.elapsedT = 0;
        this.size = 0;
        this.sizeMax = width * random(0.01, 0.05);
        this.fromSize = 0;
        this.init();
        this.isDead = false;
        this.clr = random(colors);
        this.changeShape = true;
        this.ang = int(random(2)) * PI * 0.25;
        this.lineSW = 0;
    }

    show() {
        push();
        translate(this.x, this.y);
        if (this.animationType == 1) scale(1, this.reductionRatio);
        if (this.animationType == 2) scale(this.reductionRatio, 1);
        fill(this.clr);
        stroke(this.clr);
        strokeWeight(this.size * 0.05);
        if (this.shapeType == 0) {
            noStroke();
            circle(0, 0, this.size);
        } else if (this.shapeType == 1) {
            noFill();
            circle(0, 0, this.size);
        } else if (this.shapeType == 2) {
            noStroke();
            rect(0, 0, this.size, this.size);
        } else if (this.shapeType == 3) {
            noFill();
            rect(0, 0, this.size * 0.9, this.size * 0.9);
        } else if (this.shapeType == 4) {
            line(0, -this.size * 0.45, 0, this.size * 0.45);
            line(-this.size * 0.45, 0, this.size * 0.45, 0);
        }
        pop();
        strokeWeight(this.lineSW);
        stroke(this.clr);
        line(this.x, this.y, this.fromX, this.fromY);
    }

    move() {
        let n = easeInOutExpo(norm(this.elapsedT, 0, this.duration));
        if (0 < this.elapsedT && this.elapsedT < this.duration) {
            if (this.actionPoints == this.maxActionPoints) {
                this.size = lerp(0, this.sizeMax, n);
            } else if (this.actionPoints > 0) {
                if (this.animationType == 0) {
                    this.size = lerp(this.fromSize, this.toSize, n);
                } else if (this.animationType == 1) {
                    this.x = lerp(this.fromX, this.toX, n);
                    this.lineSW = lerp(0, this.size / 5, sin(n * PI));
                } else if (this.animationType == 2) {
                    this.y = lerp(this.fromY, this.toY, n);
                    this.lineSW = lerp(0, this.size / 5, sin(n * PI));
                } else if (this.animationType == 3) {
                    if (this.changeShape == true) {
                        this.shapeType = int(random(5));
                        this.changeShape = false;
                    }
                }
                this.reductionRatio = lerp(1, 0.3, sin(n * PI));
            } else {
                this.size = lerp(this.fromSize, 0, n);
            }
        }

        this.elapsedT++;
        if (this.elapsedT > this.duration) {
            this.actionPoints--;
            this.init();
        }
        if (this.actionPoints < 0) {
            this.isDead = true;
        }
    }

    run() {
        this.show();
        this.move();
    }

    init() {
        this.elapsedT = 0;
        this.fromSize = this.size;
        this.toSize = this.sizeMax * random(0.5, 1.5);
        this.fromX = this.x;
        this.toX = this.fromX + (width / 10) * random([-1, 1]) * int(random(1, 4));
        this.fromY = this.y;
        this.toY = this.fromY + (height / 10) * random([-1, 1]) * int(random(1, 4));
        this.animationType = int(random(3));
        this.duration = random(20, 50);
    }
}