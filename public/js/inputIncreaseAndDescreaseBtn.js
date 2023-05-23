const numberInput = document.getElementById("number-input");
const decreaseBtn = document.getElementById("decrease-btn");
const increaseBtn = document.getElementById("increase-btn");

// Add event listeners to the buttons
decreaseBtn.addEventListener("click", () => {
  //   numberInput.value = parseInt(numberInput.value) - 1;

  //   if (numberInput.value > 0) {
  //     numberInput.value = 0;
  //   }

  const currentValue = parseInt(numberInput.value);
  if (currentValue > 0) {
    numberInput.value = currentValue - 1;
  }
});

increaseBtn.addEventListener("click", () => {
  numberInput.value = parseInt(numberInput.value) + 1;
});
