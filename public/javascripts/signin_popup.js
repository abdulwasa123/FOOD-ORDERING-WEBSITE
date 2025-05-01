

function openPopup(){
    document.getElementById("sign-up-container").style.display = "flex";
}

function closePopup(){
    document.getElementById("sign-up-container").style.display = "none";
    document.getElementById("log-in-container").style.display = "none";
    window.history.pushState({}, '', '/'); // resets the url when i close the popup
}

function showLoginPage(){
    document.getElementById("sign-up-container").style.display = "none";
    document.getElementById("log-in-container").style.display = "flex";
    document.getElementById("login-btn").style.backgroundColor = "rgb(253, 75, 10)";
    document.getElementById("login-btn").style.color = "white";
}

function showSignUpPage(){
    document.getElementById("sign-up-container").style.display = "flex";
    document.getElementById("log-in-container").style.display = "none";
}