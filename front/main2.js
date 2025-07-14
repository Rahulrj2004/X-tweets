// Splash screen logic for Aut.html
window.addEventListener("load", () => {
    setTimeout(() => {
        const splash = document.getElementById("splash-screen");
        if (splash) {
            splash.style.transition = "opacity 0.5s ease";
            splash.style.opacity = 0;
            setTimeout(() => splash.remove(), 500);
        }
    }, 2000); // Reduced to 2 seconds
});

// Profile page functionality
const close1 = document.getElementById("close1");
const hamburger = document.getElementById("hamburger");
const first = document.getElementById("first");
const profile_page = document.getElementById("profile-page");
const home_page = document.getElementById("home-page");

let user_Id;

window.addEventListener("DOMContentLoaded", async (event) => {
    const userID = new URLSearchParams(window.location.search).get("userID");
    if (!userID) {
        console.error("No userID found in URL");
        return;
    }
    user_Id = userID;
    
    try {
        const response = await fetch(`${window.location.origin}/get-profile/${userID}`);
        const data = await response.json();
        if (response.ok) {
            document.getElementById("profile_pic").src = data.image;
            document.getElementById("name").textContent = data.name;
        }
        else {
            console.error("Failed to load profile pic")
        }
    }
    catch (er) {
        console.error("Error fetching the profile pic", er);
    }
});

// Mobile vibration function
function vibrateOnClick() {
    if ('vibrate' in navigator) {
        navigator.vibrate(50); // 50ms vibration
    }
}

// Close button functionality
if (close1) {
    close1.addEventListener("click", () => {
        vibrateOnClick(); // Add vibration feedback
        first.classList.replace("max-sm:translate-x-[100px]", "max-sm:translate-x-[-80px]");
    });
}

// Hamburger menu functionality
if (hamburger) {
    hamburger.addEventListener("click", () => {
        vibrateOnClick(); // Add vibration feedback
        first.classList.replace("max-sm:translate-x-[-80px]", "max-sm:translate-x-[100px]");
    });
}

// Navigation functions
if (profile_page) {
    profile_page.addEventListener("click", () => {
        vibrateOnClick(); // Add vibration feedback
        window.location.href = `${window.location.origin}/person-profile/${user_Id}`;
    });
}

if (home_page) {
    home_page.addEventListener("click", () => {
        vibrateOnClick(); // Add vibration feedback
        window.location.href = `${window.location.origin}/home-X?userID=${user_Id}`;
    });
}

function serve_default() {
    vibrateOnClick(); // Add vibration feedback
    try {
        window.location.href = `${window.location.origin}/default`;
    }
    catch (er) {
        console.error("Can't fetch the default page");
    }
}

function showNotification() {
    vibrateOnClick(); // Add vibration feedback when notification is clicked
    
    const toast = document.getElementById("notification-toast");
    const sound = document.getElementById("notification-sound");

    if (toast && sound) {
        // Show with pulse animation
        toast.classList.remove("opacity-0", "pointer-events-none", "-translate-y-10");
        toast.classList.add("opacity-100", "translate-y-0", "animate-pulse");

        // Play sound
        sound.pause();
        sound.currentTime = 0;
        sound.play().catch((e) => {
            console.warn("Autoplay blocked or sound error:", e);
        });

        // Hide after 2.5s
        setTimeout(() => {
            toast.classList.remove("opacity-100", "translate-y-0", "animate-pulse");
            toast.classList.add("opacity-0", "pointer-events-none", "-translate-y-10");
        }, 2500);
    }
}

// Authentication functionality for Aut.html
function getImage(input) {
    const file = input.files[0]; // Get the first selected file
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("profile").src = e.target.result; // Update image preview
        };
        reader.readAsDataURL(file); // Convert file to a data URL
    }
}

const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

if (registerBtn) {
    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });
}

if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });
}

const log_in = document.getElementById("log_in");
const sign_up = document.getElementById("sign_up");

const l_email = document.getElementById("l_email");
const l_password = document.getElementById("l_password");

const s_username = document.getElementById("s_username");
const s_email = document.getElementById("s_email");
const s_password = document.getElementById("s_password");
const profile_pic = document.getElementById("profile_input");

if (log_in) {
    log_in.addEventListener("click", async (event) => {
        event.preventDefault();
        if (!l_email.value || !l_password.value) {
            alert("Fill the values");
        }
        else {
            try {
                const email = l_email.value;
                const password = l_password.value;
                const response = await fetch(`${window.location.origin}/log_in`, {
                    method: "Post",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });
                const data = await response.json();
                console.log(data.message);

                if (response.ok) {
                    const userID = data.userID;

                    const profileResponse = await fetch(`${window.location.origin}/get-profile/${userID}`);
                    const profileData = await profileResponse.json();

                    if (profileResponse.ok) {
                        profile_pic.src = profileData.image;
                        window.location.href = `${window.location.origin}/home-X?userID=${userID}`;
                    }
                    else {
                        console.error("Failed to load profile picture");
                    }
                } else {
                    alert(data.message);
                }
            }
            catch (e) {
                console.error("Login error : ", e);
            }
        }
    });
}

if (sign_up) {
    sign_up.addEventListener("click", async (event) => {
        event.preventDefault();
        if (!profile_pic.files.length) {
            alert("upload you pic first");
        }
        if (!s_username.value || !s_email.value || !s_password.value) {
            alert("please !! fill all the fields");
        }
        else {
            try {
                const username = s_username.value;
                const password = s_password.value;
                const email = s_email.value;
                const pic = profile_pic.files[0];

                const formdata = new FormData();
                formdata.append("username", username);
                formdata.append("password", password);
                formdata.append("email", email);
                formdata.append("pic", pic);

                const dada = await fetch(`${window.location.origin}/Sign-in`, {
                    method: "Post",
                    body: formdata
                });
                const repo = await dada.json();
                alert(repo.message);

                if (dada.ok) {
                    window.location.href = `${window.location.origin}/home-X?userID=${repo.user_id}`;
                }
            }
            catch (er) {
                console.error("Error getting the data", er);
            }
        }
    });
}