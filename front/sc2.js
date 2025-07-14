
const home_page = document.getElementById("home-page");
const DP = document.getElementById("DP");
const username = document.getElementById("name");
const menu = document.getElementById("hamburger");
const close_side = document.getElementById("close1");
const posts = document.getElementById("posts-content");
const profile_page = document.getElementById("profile-page");


let user_ID = 2;

window.addEventListener("DOMContentLoaded", async () => {
    // Set video playback rate to 0.75x
    const video = document.querySelector('.video-background');
    if (video) {
        video.playbackRate = 0.75;
    }

    // Extract user ID from URL path - handle both encoded and non-encoded usernames
    const pathSegments = window.location.pathname.split("/");
    user_ID = pathSegments[pathSegments.length - 1]; // Get the last segment
    
    // Decode the user ID if it's URL encoded
    try {
        user_ID = decodeURIComponent(user_ID);
    } catch (e) {
        console.warn("Could not decode user ID, using as-is:", user_ID);
    }
    
    console.log("User ID:", user_ID);
    console.log("Full URL path:", window.location.pathname);
    console.log("Path segments:", pathSegments);
    
    if (!user_ID || user_ID === "profile.html" || user_ID === "person-profile") {
        console.error("There is no valid user_ID in the URL");
        return;
    }
    
    try {
        console.log("Fetching profile for user ID:", user_ID);
        const response = await fetch(`${window.location.origin}/get-profile/${user_ID}`);
        console.log("Response status:", response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log("Profile data received:", data);
            
            DP.src = data.image;
            username.innerHTML = data.name;

            //showing the posts of that particular user 
            console.log("Fetching posts for user:", data.name);
            const dudu = await fetch(`${window.location.origin}/profile-data/${data.name}`);
            const rapu = await dudu.json();
            console.log("Posts data received:", rapu);
            
            rapu.writes.forEach(p=>{
                write_profile_post(p.data,p.likes,p.chats);
            })
            rapu.images.forEach(i=>{
                image_profile_post(i.image,i.like,i.chat);
            })
            rapu.videos.forEach((v)=>{
                Video_profile_post(v.url,v.like,v.chat)
            })
        }
        else {
            console.error("Failed to load the profile pic and the username. Status:", response.status);
            const errorText = await response.text();
            console.error("Error response:", errorText);
        }
    }
    catch (er) {
        console.error("Can't precieve the data from the server", er);
    }

})


function switchTab(element, tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Add active class to clicked tab
    element.classList.add('active');

    // You can add logic here to show different content based on tab
    console.log(`Switched to ${tabName} tab`);
}

home_page.addEventListener("click", () => {
    window.location.href = `${window.location.origin}/home-X?userID=${user_ID}`;
})

// function openPost(postId) {
//     console.log(`Opening post ${postId}`);
//     // Here you would typically open a modal or navigate to post detail
//     alert(`Opening post ${postId} - In a real app, this would open the post in a modal!`);
// }

// Function to disable touch events on posts area
function disablePostsTouch() {
    const postsContainer = document.getElementById("posts-content");
    if (postsContainer) {
        postsContainer.classList.add("posts-touch-disabled");
        postsContainer.classList.remove("posts-touch-enabled");
    }
}

// Function to enable touch events on posts area
function enablePostsTouch() {
    const postsContainer = document.getElementById("posts-content");
    if (postsContainer) {
        postsContainer.classList.remove("posts-touch-disabled");
        postsContainer.classList.add("posts-touch-enabled");
    }
}

// Mobile vibration function
function vibrateOnClick() {
    if ('vibrate' in navigator) {
        navigator.vibrate(50); // 50ms vibration
    }
}

menu.addEventListener("click",()=>{
    vibrateOnClick(); // Add vibration feedback
    document.querySelector(".bar").style.left = 0;
    document.body.classList.add("sidebar-open");
    disablePostsTouch(); // Disable touch on posts when sidebar opens
})

close_side.addEventListener("click",()=>{
    vibrateOnClick(); // Add vibration feedback
    document.querySelector(".bar").style.left = "-200px";
    document.body.classList.remove("sidebar-open");
    enablePostsTouch(); // Re-enable touch on posts when sidebar closes
})


function image_profile_post(data,like,chat)
{
    let html = 
    `<div class="post" onclick="openPost(1)">
                    <img src=${data}
                        alt="Post 1">
                    <div class="post-overlay">
                        <div class="post-stats">
                            <div class="post-stat">
                                <span>❤️</span> <span>${like}k</span>
                            </div>
                            <div class="post-stat">
                                <span>💬</span> <span>${chat}</span>
                            </div>
                        </div>
                    </div>
                </div>`

    posts.insertAdjacentHTML("beforeend",html);
}


function write_profile_post(data,like,chat)
{
    let html = `<div class="post" onclick="openPost(1)">
        <p>${data}</p>
        <div class="post-overlay">
            <div class="post-stats">
                <div class="post-stat">
                    <span>❤️</span> <span>${like}k</span>
                </div>
                <div class="post-stat">
                    <span>💬</span> <span>${chat}k</span>
                </div>
            </div>
        </div>
    </div>`

    posts.insertAdjacentHTML("beforeend",html);
}

function Video_profile_post(data,like,chat)
{
    let html = `<div class="post" onclick="openPost(1)">
                <video src=${data}></video>
        <div class="post-overlay">
            <div class="post-stats">
                <div class="post-stat">
                    <span>❤️</span> <span>${like}k</span>
                </div>
                <div class="post-stat">
                    <span>💬</span> <span>${chat}k</span>
                </div>
            </div>
        </div>
    </div>`

    posts.insertAdjacentHTML("beforeend",html);
}


profile_page.addEventListener("click",()=>{
    // const userID = new URLSearchParams(window.location.search).get("userID");
    window.location.href = `${window.location.origin}/person-profile/${user_ID}`;
})


function serve_default(){
    try{
        window.location.href =`${window.location.origin}/default`;
    }
    catch(er)
    {
        console.error("Can't fetch the default page");
    }
}

function showNotification() {
    const toast = document.getElementById("notification-toast");
    const sound = document.getElementById("notification-sound");

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
