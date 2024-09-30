/*
1.Створюємо розмітку нашого слоту 
2.Створюємо функцію яка буде перемальовувати наші символи під час спіну
3.Після спіну потрібно перевірити отримані комбінації на виграш або програш
---3.1 Після перевірки виводимо в поле виграш спробуйте ще якщо нічого не співпало і якщо співпало вітаємо ви виграли 
4.Підсвічуємо виграшну лінію 
---- 4.1 Отримуємо індекс виграшних ліній додаємо їх до масиву
-----4.2 Проходимось по масиву та змінюємо власитивість кольору фону 
5.Додаємо сумму балансу.
----- 5.1 Створюємо лічильник сума ставки по кліку 
6. Створюємо мисав виграшних ліній та винагородження за них відповідно до симоволів 
*/
const symbols = ["🍒", "🍋", "🍉", "🍇", "🔔", "⭐", "7️⃣", "🍀"];
const symbolMultipliers = {
  "🍒": 0.5,
  "🍋": 1,
  "🍉": 1.5,
  "🍇": 2,
  "🔔": 3,
  "⭐": 4,
  "7️⃣": 5,
  "🍀": 8,
};

const results = document.querySelector(".results");
const balance = document.querySelector(".balance");
const stakeValue = document.getElementById("stake-value");
const minusbtn = document.querySelector('[data-action="decrement"]');
const plusbtn = document.querySelector('[data-action="increment"]');

let initialBalance = parseInt(balance.textContent); // Використовуємо одну змінну для балансу
let startValueStake = 1;
const minStake = 1;

function updtStartvalue() {
  stakeValue.textContent = startValueStake;
}

minusbtn.addEventListener("click", function () {
  if (startValueStake > minStake) {
    startValueStake -= 1;
    updtStartvalue();
  }
  if (startValueStake <= minStake) {
    minusbtn.disabled = true;
  }
});

plusbtn.addEventListener("click", function () {
  startValueStake += 1;
  updtStartvalue();
  minusbtn.disabled = false;
});

document.getElementById("spin-button").addEventListener("click", () => {
  // Спочатку генеруємо результат спіна
  const reels = spinAllReels(symbols);
  console.log("Reels:", reels);
  initialBalance -= startValueStake; // Використовуємо одну змінну
  balance.textContent = initialBalance;
  const slots = document.querySelectorAll(".slot span");

  // Запускаємо анімацію для кожного слоту
  slots.forEach((slot, index) => {
    slot.style.top = "100px"; // Зміщуємо вгору
    results.style.backgroundColor = "#ffffff";
    results.textContent = "";
    slot.parentNode.style.backgroundColor = "";

    setTimeout(() => {
      const reelIndex = Math.floor(index / 3);
      const positionIndex = index % 3;
      slot.textContent = reels[reelIndex][positionIndex];

      setTimeout(() => {
        slot.style.top = "25%";
      }, 50);
    }, 500);
  });

  setTimeout(() => {
    const winningIndices = checkWinningCombinations(reels);
    let totalWin = 0;
    if (winningIndices.length > 0) {
      winningIndices.forEach((lineIndex) => {
        const winningLine = getWinningLine(reels, lineIndex);
        const firstSymbol = winningLine[0];

        if (winningLine.every((symbol) => symbol === firstSymbol)) {
          const multiplier = symbolMultipliers[firstSymbol] || 1;
          totalWin += startValueStake * multiplier;
        }
      });

      initialBalance += totalWin;
      results.textContent = `WIN: ${totalWin} credits!`;
      results.style.backgroundColor = "#ffff00";
      highlightWinningLines(winningIndices);
    } else {
      results.style.backgroundColor = "#ff0000";
      results.textContent = "LOSS";
    }
    balance.textContent = initialBalance;
  }, 1000);
});

function spinReel(symbols, forceSymbol = null) {
  let reel = [];
  for (let i = 0; i < 3; i++) {
    if (forceSymbol && Math.random() > 0.55) {
      // 55% ймовірність отримати однаковий символ
      reel.push(forceSymbol);
    } else {
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      reel.push(randomSymbol);
    }
  }
  return reel;
}

function spinAllReels(symbols) {
  const reels = [];
  const forcedSymbol = symbols[Math.floor(Math.random() * symbols.length)];
  for (let i = 0; i < 3; i++) {
    reels.push(spinReel(symbols, forcedSymbol));
  }
  return reels;
}

function checkWinningCombinations(reels) {
  const winningLines = [
    [reels[0][0], reels[1][0], reels[2][0]],
    [reels[0][1], reels[1][1], reels[2][1]],
    [reels[0][2], reels[1][2], reels[2][2]],
    [reels[0][0], reels[1][1], reels[2][2]],
    [reels[0][2], reels[1][1], reels[2][0]],
  ];

  const winningIndices = [];

  for (let i = 0; i < winningLines.length; i++) {
    if (winningLines[i].every((symbol) => symbol === winningLines[i][0])) {
      winningIndices.push(i);
    }
  }
  return winningIndices;
}

// Додаємо функцію getWinningLine
function getWinningLine(reels, lineIndex) {
  const lineMappings = [
    [0, 3, 6], // Верхня лінія
    [1, 4, 7], // Середня лінія
    [2, 5, 8], // Нижня лінія
    [0, 4, 8], // Діагональ зліва направо
    [2, 4, 6], // Діагональ справа наліво
  ];

  return lineMappings[lineIndex].map(
    (index) => reels[Math.floor(index / 3)][index % 3]
  );
}

function highlightWinningLines(winningIndices) {
  const slotElements = document.querySelectorAll(".slot span");
  const lineMappings = [
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  winningIndices.forEach((lineIndex) => {
    lineMappings[lineIndex].forEach((index) => {
      slotElements[index].parentNode.style.backgroundColor = "#ffff00";
    });
  });
}
