  const accountBtn = document.getElementById("account-btn");
  const dropdown = document.getElementById("dropdown-menu");

  accountBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });

  // Close dropdown if clicked outside
  document.addEventListener("click", () => {
    dropdown.style.display = "none";
  });