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

const results = document.querySelector(".results");
const balance = document.querySelector(".balance");
const stakeValue = document.getElementById("stake-value");
const minusbtn = document.querySelector('[data-action="decrement"]');
const plusbtn = document.querySelector('[data-action="increment"]');

let initialBalance = parseInt(balance.textContent);
let counterBalance = initialBalance;
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
  counterBalance -= 1;
  console.log(counterBalance);
  balance.textContent = counterBalance;
  const slots = document.querySelectorAll(".slot span");

  // Запускаємо анімацію для кожного слоту
  slots.forEach((slot, index) => {
    slot.style.top = "100px"; // Зміщуємо вгору
    results.style.backgroundColor = "#ffffff";
    results.textContent = "";
    slot.parentNode.style.backgroundColor = "";

    // Після завершення анімації оновлюємо символи
    setTimeout(() => {
      // Оновлюємо символ з попередньо згенерованого reels
      const reelIndex = Math.floor(index / 3); // Номер барабана (0, 1, 2)
      const positionIndex = index % 3; // Номер позиції на барабані (0, 1, 2)
      slot.textContent = reels[reelIndex][positionIndex]; // Оновлюємо символ у слоті

      setTimeout(() => {
        slot.style.top = "25%"; // Анімуємо повернення до початкової позиції
      }, 50);
    }, 500); // Час анімації
  });

  // Після анімації перевіряємо виграш
  setTimeout(() => {
    const winningIndices = checkWinningCombinations(reels);
    if (winningIndices.length > 0) {
      results.style.backgroundColor = "#ffff00";
      results.textContent = "WIN";
      highlightWinningLines(winningIndices); // Додаємо підсвічування виграшних ліній
    } else {
      results.style.backgroundColor = "#ff0000";
      results.textContent = "LOSS";
    }
  }, 1000);
});

function spinReel(symbols, forceSymbol = null) {
  let reel = [];
  for (let i = 0; i < 3; i++) {
    if (forceSymbol && Math.random() > 0.55) {
      // 50% ймовірність отримати однаковий символ
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
  const forcedSymbol = symbols[Math.floor(Math.random() * symbols.length)]; // Обираємо випадковий символ для збільшення ймовірності виграшу
  for (let i = 0; i < 3; i++) {
    reels.push(spinReel(symbols, forcedSymbol)); // Примусово встановлюємо символ для більшої частоти виграшу
  }
  return reels;
}

function checkWinningCombinations(reels) {
  const winningLines = [
    [reels[0][0], reels[1][0], reels[2][0]], // верхня лінія
    [reels[0][1], reels[1][1], reels[2][1]], // середня лінія
    [reels[0][2], reels[1][2], reels[2][2]], // нижня лінія
    [reels[0][0], reels[1][1], reels[2][2]], // діагональ зліва направо
    [reels[0][2], reels[1][1], reels[2][0]], // діагональ справа наліво
  ];

  const winningIndices = []; // масив для зберігання виграшних індексів

  // Перевіряємо кожну лінію на виграш
  for (let i = 0; i < winningLines.length; i++) {
    if (winningLines[i].every((symbol) => symbol === winningLines[i][0])) {
      winningIndices.push(i); // Додаємо індекс виграшної лінії
    }
  }
  return winningIndices; // Повертаємо масив виграшних індексів
}
function highlightWinningLines(winningIndices) {
  const slotElements = document.querySelectorAll(".slot span");

  // Масив слотів для кожної виграшної лінії
  const lineMappings = [
    [0, 3, 6], // верхня лінія
    [1, 4, 7], // середня лінія
    [2, 5, 8], // нижня лінія
    [0, 4, 8], // діагональ зліва направо
    [2, 4, 6], // діагональ справа наліво
  ];

  winningIndices.forEach((lineIndex) => {
    lineMappings[lineIndex].forEach((index) => {
      slotElements[index].parentNode.style.backgroundColor = "#ffff00"; // Жовтий фон
    });
  });
}
