const image = document.getElementById("image");

image.addEventListener("click", function() {
  image.classList.add("wiebelen");
  setTimeout(() => {
    image.classList.remove('wiebelen');
  }, 7000);
});