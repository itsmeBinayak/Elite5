
class Percentage {
    constructor(element, percentage) {
      this.element = element;
      this.percentage = percentage;
      this.update(this.percentage);
    }
  
    update(newValue) {
      this.percentage = newValue;
      this.element.style.width = `${(this.percentage)/2}%`;
      this.element.style.backgroundColor = "yellow";
    }
  }
  
  document.querySelectorAll(".skill_level").forEach(element => {
    const percentageValue = element.getAttribute("data-percentage");
    const percentage = new Percentage(element, percentageValue);
  });
  