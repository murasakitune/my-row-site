// script.js

// ヘッダーの読み込み
document.addEventListener("DOMContentLoaded", function() {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading header:', error));
});

// 農業クリッカーゲームの機能（game.htmlでのみ実行）
if (document.getElementById("pageB")) {
    // 初期データ
    let seeds = 0;
    let crops = 0;
    let gold = 100;
    let farm = Array(15).fill(null); // 畑パネル（15マス）
    let upgradeCost1 = 50;
    let upgradeCost2 = 100;
    let cropValue = 20;
    let growthBonus = 0;

    // DOM要素取得
    const seedsSpan = document.getElementById("seeds");
    const cropsSpan = document.getElementById("crops");
    const goldSpan = document.getElementById("gold");
    const farmGrid = document.querySelector(".farm-grid");
    const upgradeBtns = document.querySelectorAll(".upgrade-btn");

    // 畑の初期化
    farm.forEach((_, i) => {
        const cell = document.createElement("div");
        cell.textContent = "";
        cell.addEventListener("click", () => plantSeed(i));
        farmGrid.appendChild(cell);
    });

    // 購入ボタン
    document.getElementById("buySeed").addEventListener("click", () => {
        if (gold >= 10) {
            gold -= 10;
            seeds++;
            updateStats();
        }
    });

    // 成長ボタン
    document.getElementById("grow").addEventListener("click", () => {
        farm.forEach((state, i) => {
            if (state !== null) {
                // 成長確率を計算
                let probability = 0.6 + growthBonus;
                let growth = Math.random() < probability ? 1 : 0;
                farm[i] = Math.min(state + growth, 3);

                // 成長が最終段階に達したら作物を収穫
                if (farm[i] === 3) {
                    crops++;
                    farm[i] = null;
                }
            }
        });
        updateFarm();
        updateStats();
    });

    // 売却ボタン
    document.getElementById("sellCrops").addEventListener("click", () => {
        if (crops > 0) {
            gold += crops * cropValue;
            crops = 0;
            updateStats();
        }
    });

    // 種を植える
    function plantSeed(index) {
        if (seeds > 0 && farm[index] === null) {
            seeds--;
            farm[index] = 0;
            updateFarm();
            updateStats();
        }
    }

    // アップグレード
    upgradeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const upgrade = btn.dataset.upgrade;
            if (upgrade === "1" && gold >= upgradeCost1) {
                gold -= upgradeCost1;
                cropValue += 5;
                upgradeCost1 *= 2;
                document.getElementById("upgradeCost1").textContent = upgradeCost1;
            } else if (upgrade === "2" && gold >= upgradeCost2) {
                gold -= upgradeCost2;
                growthBonus += 0.1;
                upgradeCost2 *= 2;
                document.getElementById("upgradeCost2").textContent = upgradeCost2;
            }
            updateStats();
        });
    });

    // 更新関数
    function updateStats() {
        seedsSpan.textContent = seeds;
        cropsSpan.textContent = crops;
        goldSpan.textContent = gold;
    }

    function updateFarm() {
        farm.forEach((state, i) => {
            farmGrid.children[i].textContent = state === null ? "" : "🌱".repeat(state + 1);
        });
    }

    // 初期表示
    updateStats();
    updateFarm();

    // ページを離れるとゲームをリセット
    window.addEventListener("beforeunload", () => {
        seeds = 0;
        crops = 0;
        gold = 100;
        farm = Array(15).fill(null);
    });
}
