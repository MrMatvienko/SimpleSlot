/*
1.Створюємо розмітку нашого слоту 
2.Створюємо функцію яка буде перемальовувати наші символи під час спіну
3.Після спіну потрібно перевірити отримані комбінації на виграш або програш
---3.1 Після перевірки виводимо в поле виграш спробуйте ще якщо нічого не співпало і якщо співпало вітаємо ви виграли 

*/
const symbols = ["🍒", "🍋", "🍉", "🍇", "🔔", "⭐", "7️⃣", "🍀"];

const results = document.querySelector(".results");

document.getElementById("spin-button").addEventListener("click", () => {
  // Спочатку генеруємо результат спіна
  const reels = spinAllReels(symbols);
  console.log("Reels:", reels);

  const slots = document.querySelectorAll(".slot span");

  // Запускаємо анімацію для кожного слоту
  slots.forEach((slot, index) => {
    slot.style.top = "100px"; // Зміщуємо вгору
    results.style.backgroundColor = "#ffffff";
    results.textContent = "";

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
    const isWin = checkWinningCombinations(reels);
    if (isWin) {
      results.style.backgroundColor = "#ffff00";
      results.textContent = "WIN";
    } else {
      results.style.backgroundColor = "#ff0000";
      results.textContent = "LOSS";
    }
  }, 1000);
});

function spinReel(symbols) {
  let reel = [];
  for (let i = 0; i < 3; i++) {
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    reel.push(randomSymbol);
  }
  return reel;
}

function spinAllReels(symbols) {
  const reels = [];
  for (let i = 0; i < 3; i++) {
    reels.push(spinReel(symbols));
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

  for (let line of winningLines) {
    if (line.every((symbol) => symbol === line[0])) {
      return true;
    }
  }
  return false;
}
