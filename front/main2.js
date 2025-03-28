

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

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});


const log_in = document.getElementById("log_in");
const sign_up = document.getElementById("sign_up");

const l_email = document.getElementById("l_email");
const l_password = document.getElementById("l_password");

const s_username = document.getElementById("s_username");
const s_email = document.getElementById("s_email");
const s_password = document.getElementById("s_password");
const profile_pic = document.getElementById("profile_input");

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

                const profileResponse  = await fetch(`${window.location.origin}/get-profile/${userID}`);
                const profileData  = await profileResponse.json();

                if(profileResponse.ok)
                {
                    profile_pic.src = profileData.image;
                    window.location.href = `${window.location.origin}/home-X?userID=${userID}`;
                }
                else{
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
})

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
            
            if(dada.ok)
            {
                window.location.href = `${window.location.origin}/home-X?userID=${repo.user_id}`;
            }
        }
        catch(er)
        {
            console.error("Error getting the data",er);
        }
    }
})