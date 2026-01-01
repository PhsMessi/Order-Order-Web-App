export function timedate() {
  const timedateElement = document.querySelector(".timedate");

  // Function to update time
  function updateTime() {
    const now = moment().format("MMMM DD, YYYY - hh:mm:ss A");
    timedateElement.textContent = now;
  }

  updateTime();

  setInterval(updateTime, 1000);
}
