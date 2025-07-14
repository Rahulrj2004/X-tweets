
const close1 = document.getElementById("close");
const img_post = document.getElementById("img-post");
const img_post1 = document.getElementById("img-post1");
const write1 = document.getElementById("write_post");
const popup = document.getElementById("popup");
const uploadInput = document.getElementById("upload");
const profile_pic = document.getElementById("profile_pic");
const close2 = document.getElementById("close1");
const first = document.getElementById("first");
const hamburger = document.getElementById("hamburger");
const profile_page = document.getElementById("profile-page");
const home_page = document.getElementById("home-page");  

let digger = "baba";
let chigger = "chichi";
let user_Id;  //user id of the person 

// Pagination variables
let currentPage = 1;
let isLoading = false;
let hasMorePosts = true;
const postsPerPage = 10;
let loadedPostIds = new Set(); // Track loaded posts to prevent duplicates
let observer = null; // Intersection observer for infinite scroll

window.addEventListener("DOMContentLoaded", async (event) => {
    // if (performance.getEntriesByType("navigation")[0]?.type === "reload") {
    //     window.location.href = `${window.location.origin}/`;
    // }
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
            profile_pic.src = data.image;
            chigger = data.image;
            digger = data.name;
        }
        else {
            console.error("Failed to load profile pic")
        }
    }
    catch (er) {
        console.error("Error fetching the profile pic", er);
    }
    loader();
});

async function written_post(data, chats, repost, likes, views, profileId, username) {
    const response1 = await fetch(`${window.location.origin}/profile/${profileId}`);
    const data1 = await response1.json();

    if (!data1 || !data1.profile) {
        console.error("profile not found for post id", profileId);
        return;
    }

    const profile = `data:${data1.contentType};base64,${data1.profile}`;

    let html = ` <div class="written_post flex border border-x-0 border-gray-600 fade-in opacity-0 transform translate-y-4">
                    <div class="account my-2 max-sm:w-11">
                        <img src="${profile}" class="rounded-full w-10 h-10 mx-5 max-sm:min-w-8 max-sm:min-h-8 max-sm:mx-3" alt="">
                    </div>
                    <div class="mx-5"> 
                        <div class=" mx-1">
                            <span class="font-bold hover:underline my-2 text-sm">${username}
                            </span>
                            <div class="text-sm">poet</div>
                        </div>
                        <div class="thought my-3 mx-1 flex justify-start mr-2">
                            ${data}
                        </div>
                        <div class="icons flex gap-8 text-sm m-3">
                            <div class="comment-btn flex items-center cursor-pointer gap-1 hover:text-blue-400"
                                onclick="toggleIcon(this, 'comment')">
                                <span class="icon-symbol comment-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"/></svg></span>
                                <span>${chats}</span>
                            </div>

                            <div class="repost-btn flex items-center cursor-pointer gap-1 hover:text-green-500"
                                onclick="toggleIcon(this, 'repost')">
                                <span class="icon-symbol repost-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46L18.5 16.45V8c0-1.1-.896-2-2-2z"/></svg></span>
                                <span>${repost}</span>
                            </div>

                            <div class="like-btn flex items-center cursor-pointer gap-1 hover:text-red-500"
                                onclick="toggleIcon(this, 'like')">
                                <span class="icon-symbol like-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></svg></span>
                                <span>${likes}k</span>
                            </div>

                            <div class="view-btn flex items-center cursor-pointer gap-1 hover:text-blue-500"
                                onclick="toggleIcon(this, 'view')">
                                <span class="icon-symbol view-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"/></svg></span>
                                <span>${views}k</span>
                            </div>
                        </div>
                    </div>
                </div>`

    document.getElementById("posts").insertAdjacentHTML("beforeend", html);
    
    // Animate the post in
    const newPost = document.querySelector('.written_post:last-child');
    if (newPost) {
        setTimeout(() => {
            newPost.classList.remove('opacity-0', 'translate-y-4');
            newPost.classList.add('opacity-100', 'translate-y-0');
        }, 10);
    }
}

async function video_post(chats, repost, likes, views, profileId, username) {
    const response3 = await fetch(`${window.location.origin}/Vprofile/${profileId}`);
    const data3 = await response3.json();

    if (!data3 || !data3.profile || !data3.filename) {
        console.error("profile not found for post id", profileId);
        return;
    }

    const vresponse = await fetch(`${window.location.origin}/video/${data3.filename}`);
    if (!vresponse.ok) {
        console.error("❌ Video not found on server:", data3.filename);
        return;
    }
    const videoblob = await vresponse.blob()
    const videourl = URL.createObjectURL(videoblob);


    const profile = `data:${data3.contentType};base64,${data3.profile}`;

    let html = `<div class="video-post flex border border-x-0 border-gray-600 fade-in opacity-0 transform translate-y-4">
    <div class="account my-2 max-sm:w-11">
        <img src="${profile}" class="rounded-full w-10 h-10 mx-5 max-sm:min-w-8 max-sm:min-h-8 max-sm:mx-3" alt="">
    </div>
    <div class="mx-5">
        <div>
            <span class="font-bold hover:underline my-2 text-sm">${username}
            </span>
            <div class="text-sm">poet</div>
        </div>
        <div class="postimg my-2 flex justify-evenly">
            <video autoplay muted controls class="rounded-md object-center max-h-96 max-sm:h-auto w-auto mr-2"
                src="${videourl}" type="video/mp4">Your browser doesn't support video tag.</video>
        </div>
        <div class="icons flex gap-8 text-sm m-3">
            <div class="comment-btn flex items-center cursor-pointer gap-1 hover:text-blue-400"
                onclick="toggleIcon(this, 'comment')">
                <span class="icon-symbol comment-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"/></svg></span>
                <span>${chats}</span>
            </div>

            <div class="repost-btn flex items-center cursor-pointer gap-1 hover:text-green-500"
                onclick="toggleIcon(this, 'repost')">
                <span class="icon-symbol repost-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46L18.5 16.45V8c0-1.1-.896-2-2-2z"/></svg></span>
                <span>${repost}</span>
            </div>

            <div class="like-btn flex items-center cursor-pointer gap-1 hover:text-red-500"
                onclick="toggleIcon(this, 'like')">
                <span class="icon-symbol like-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></svg></span>
                <span>${likes}k</span>
            </div>

            <div class="view-btn flex items-center cursor-pointer gap-1 hover:text-blue-500"
                onclick="toggleIcon(this, 'view')">
                <span class="icon-symbol view-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"/></svg></span>
                <span>${views}k</span>
            </div>
        </div>
    </div>
</div>`

    document.getElementById("posts").insertAdjacentHTML("beforeend", html);
    
    // Animate the post in
    const newPost = document.querySelector('.video-post:last-child');
    if (newPost) {
        setTimeout(() => {
            newPost.classList.remove('opacity-0', 'translate-y-4');
            newPost.classList.add('opacity-100', 'translate-y-0');
        }, 10);
    }
}


// async function image_post(postId, chats, repost, likes, views, username) {
//     const response = await fetch(`${window.location.origin}/image/${postId}`);
//     const data = await response.json();


//     if (!data || !data.img || !data.profile) {
//         console.error("Image not found for post:", postId);
//         return;
//     }

//     const imgURL = `data:${data.contentType};base64,${data.img}`;
//     const profile1 = `data:${data.contentType1};base64,${data.profile}`;

//     let html = `<div class="post flex border border-x-0 border-gray-600 max-sm:ml-1 fade-in">
//     <div class="account my-2 max-sm:w-12">
//         <img src="${profile1}" class="rounded-full w-10 h-10 max-sm:min-w-8 max-sm:min-h-8 max-sm:mx-3 mx-5" alt="">
//     </div>
//     <div class="mx-5 ">
//         <div>
//             <span class="font-bold hover:underline my-2 text-sm cursor-pointer">${username}
//             </span>
//             <div class="text-sm">legend</div>
//         </div>
//         <div class="postimg my-2 flex justify-evenly">
//             <img class="rounded-md object-center max-h-96 max-sm:h-auto w-auto mx-2 mr-2" src="${imgURL}" alt="">
//         </div>
//         <div class="icons flex gap-8 text-sm m-3">
//             <div class="comment-btn flex items-center cursor-pointer gap-1 hover:text-blue-400"
//                 onclick="toggleIcon(this, 'comment')">
//                 <span class="icon-symbol comment-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"/></svg></span>
//                 <span>${chats}</span>
//             </div>

//             <div class="repost-btn flex items-center cursor-pointer gap-1 hover:text-green-500"
//                 onclick="toggleIcon(this, 'repost')">
//                 <span class="icon-symbol repost-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46L18.5 16.45V8c0-1.1-.896-2-2-2z"/></svg></span>
//                 <span>${repost}</span>
//             </div>

//             <div class="like-btn flex items-center cursor-pointer gap-1 hover:text-red-500"
//                 onclick="toggleIcon(this, 'like')">
//                 <span class="icon-symbol like-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></svg></span>
//                 <span>${likes}k</span>
//             </div>

//             <div class="view-btn flex items-center cursor-pointer gap-1 hover:text-blue-500"
//                 onclick="toggleIcon(this, 'view')">
//                 <span class="icon-symbol view-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"/></svg></span>
//                 <span>${views}k</span>
//             </div>
//         </div>
//     </div>
// </div>`


//     document.getElementById("posts").insertAdjacentHTML("afterend", html);
// }

async function image_post(postId, chats, repost, likes, views, username) {
    let html = `
    <div class="image-post flex border border-x-0 border-gray-600 max-sm:ml-1 fade-in opacity-0 transform translate-y-4" id="post-${postId}">
        <div class="account my-2 max-sm:w-11">
            <div class="DP rounded-full w-10 h-10 max-sm:min-w-8 max-sm:min-h-8 max-sm:mx-3 mx-5"></div>
        </div>
        <div class="mx-5">
            <div>
                <span class="font-bold hover:underline my-2 text-sm">${username}</span>
                <div class="text-sm">legend</div>
            </div>
            <div class="postimg my-2 flex justify-evenly">
                <div class="Photu rounded-md max-h-96 max-sm:h-auto max-w-full mr-2"></div>
            </div>
            <div class="icons flex gap-8 text-sm m-3">
                <div class="comment-btn flex items-center cursor-pointer gap-1 hover:text-blue-400"
                    onclick="toggleIcon(this, 'comment')">
                    <span class="icon-symbol comment-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"/></svg></span>
                    <span>${chats}</span>
                </div>

                <div class="repost-btn flex items-center cursor-pointer gap-1 hover:text-green-500"
                    onclick="toggleIcon(this, 'repost')">
                    <span class="icon-symbol repost-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46L18.5 16.45V8c0-1.1-.896-2-2-2z"/></svg></span>
                    <span>${repost}</span>
                </div>

                <div class="like-btn flex items-center cursor-pointer gap-1 hover:text-red-500"
                    onclick="toggleIcon(this, 'like')">
                    <span class="icon-symbol like-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></svg></span>
                    <span>${likes}k</span>
                </div>

                <div class="view-btn flex items-center cursor-pointer gap-1 hover:text-blue-500"
                    onclick="toggleIcon(this, 'view')">
                    <span class="icon-symbol view-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"/></svg></span>
                    <span>${views}k</span>
                </div>
            </div>
        </div>
    </div>`;
    
    document.getElementById("posts").insertAdjacentHTML("beforeend", html);
    
    // Animate the post in
    const newPost = document.getElementById(`post-${postId}`);
    if (newPost) {
        setTimeout(() => {
            newPost.classList.remove('opacity-0', 'translate-y-4');
            newPost.classList.add('opacity-100', 'translate-y-0');
        }, 10);
    }
    
    // Load the actual content
    setTimeout(async () => {
        try {
            const response = await fetch(`${window.location.origin}/image/${postId}`);
            const data = await response.json();

            if (!data || !data.img || !data.profile) {
                console.error("Image not found for post:", postId);
                return;
            }

            const imgURL = `data:${data.contentType};base64,${data.img}`;
            const profile1 = `data:${data.contentType1};base64,${data.profile}`;
            
            const postElement = document.getElementById(`post-${postId}`);
            if (postElement) {
                postElement.querySelector('.DP').outerHTML = `<img src="${profile1}" class="rounded-full w-10 h-10 max-sm:min-w-8 max-sm:min-h-8 max-sm:mx-3 mx-5" alt="">`;
                
                postElement.querySelector('.Photu').outerHTML = `<img class="rounded-md object-center max-h-96 max-sm:h-auto max-w-full mr-2" src="${imgURL}" alt="" loading="lazy">`;
            }
        } 
        catch (error) {
            console.error("Error loading image post:", error);
        }
    }, 100);
}



// async function loader() {
//     try {
//         const [postsResponse, seesResponse, Vidresponse] = await Promise.all([
//             fetch(`${window.location.origin}/get-posts`),
//             fetch(`${window.location.origin}/get-sees`),
//             fetch(`${window.location.origin}/get-vids`)
//         ]);

//         const posts = await postsResponse.json();
//         const posts1 = await seesResponse.json();
//         const posts2 = await Vidresponse.json();

//         let combinedPosts = [];
//         let maxLength = Math.max(posts.length, posts1.length, posts2.length);

//         for (let i = 0; i < maxLength; i++) {
//             if (i < posts.length) combinedPosts.push({ type: "written", data: posts[i] });
//             if (i < posts1.length) combinedPosts.push({ type: "image", data: posts1[i] });
//             if (i < posts2.length) combinedPosts.push({ type: "video", data: posts2[i] });
//         }

//         for (let post of combinedPosts) {
//             if (post.type === "written") {
//                 await written_post(post.data.data, post.data.chats, post.data.repost, post.data.likes, post.data.views, post.data._id, post.data.Username);
//             }
//             else if (post.type === "image") {
//                 await image_post(post.data._id, post.data.chats, post.data.repost, post.data.likes, post.data.views, post.data.Username);
//             }
//             else {
//                 await video_post(post.data.chats, post.data.repost, post.data.likes, post.data.views, post.data._id, post.data.Username);
//             }
//         }

//         console.log("Posts retrieved successfully.");
//     } catch (error) {
//         console.error("There was an error fetching the posts:", error);
//     }
// }


// loader();

// function getTimestampFromObjectId(objectId) {
//     return parseInt(objectId.toString().substring(0, 8), 16) * 1000;
// }


// let currentBatch = 0;
// const batchSize = 10;
// let combinedPosts = []; // to be filled once

// async function loader() {
//     try {
//         const [postsResponse, seesResponse, Vidresponse] = await Promise.all([
//             fetch(`${window.location.origin}/get-posts`),
//             fetch(`${window.location.origin}/get-sees`),
//             fetch(`${window.location.origin}/get-vids`)
//         ]);

//         const posts = await postsResponse.json();
//         const posts1 = await seesResponse.json();
//         const posts2 = await Vidresponse.json();

//         let maxLength = Math.max(posts.length, posts1.length, posts2.length);
//         combinedPosts = []; // reset before filling

//         for (let i = 0; i < maxLength; i++) {
//             if (i < posts.length) combinedPosts.push({ type: "written", data: posts[i] });
//             if (i < posts1.length) combinedPosts.push({ type: "image", data: posts1[i] });
//             if (i < posts2.length) combinedPosts.push({ type: "video", data: posts2[i] });
//         }

//         // Sort combinedPosts newest first by MongoDB ObjectId timestamp
//         combinedPosts.sort((a, b) => {
//             return getTimestampFromObjectId(b.data._id) - getTimestampFromObjectId(a.data._id);
//         });

//         renderNextBatch(); // Load the first batch

//     } catch (error) {
//         console.error("Error fetching posts:", error);
//     }
// }

// function renderNextBatch() {
//     const end = Math.min(currentBatch + batchSize, combinedPosts.length);
//     const batch = combinedPosts.slice(currentBatch, end);

//     batch.forEach(async post => {
//         if (post.type === "written") {
//             await written_post(post.data.data, post.data.chats, post.data.repost, post.data.likes, post.data.views, post.data._id, post.data.Username);
//         } else if (post.type === "image") {
//             await image_post(post.data._id, post.data.chats, post.data.repost, post.data.likes, post.data.views, post.data.Username);
//         } else if (post.type === "video") {
//             await video_post(post.data.chats, post.data.repost, post.data.likes, post.data.views, post.data._id, post.data.Username);
//         }
//     });

//     currentBatch = end;
// }

// document.getElementById("scroll-container").addEventListener("scroll", function () {
//     const { scrollTop, scrollHeight, clientHeight } = this;
//     if (scrollTop + clientHeight >= scrollHeight - 50) {
//         if (currentBatch < combinedPosts.length) {
//             renderNextBatch();
//         }
//     }
// });


// main.js
// Old variables removed - now using pagination variables defined above

async function loader() {
    try {
        // Show skeleton screens while loading
        showSkeletons(postsPerPage);
        
        // Load initial batch
        await loadNextBatch();
        
        // Set up intersection observer for infinite scroll
        setupObserver();
        
    } catch (error) {
        console.error("There was an error fetching the posts:", error);
        removeSkeletons();
    }
}

async function loadNextBatch() {
    if (isLoading || !hasMorePosts) return;
    
    isLoading = true;
    
    // Clear any error messages
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    
    // Show loading indicator for subsequent loads
    if (currentPage > 1) {
        showLoadingIndicator();
    }
    
    try {
        const response = await fetch(`${window.location.origin}/get-all-posts?page=${currentPage}&limit=${postsPerPage}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        
        const { textPosts, imagePosts, videoPosts, pagination } = data;
        
        // Combine and sort all posts by creation time (newest first)
        let allPosts = [];
        
        // Helper function to extract timestamp from ObjectId
        function getTimestampFromObjectId(objectId) {
            // Extract timestamp from ObjectId (first 4 bytes)
            const timestamp = parseInt(objectId.substring(0, 8), 16) * 1000;
            return new Date(timestamp);
        }
        
        // Add text posts
        textPosts.forEach(post => {
            if (!loadedPostIds.has(post._id)) {
                allPosts.push({ 
                    type: "written", 
                    data: post, 
                    timestamp: getTimestampFromObjectId(post._id) 
                });
                loadedPostIds.add(post._id);
            }
        });
        
        // Add image posts
        imagePosts.forEach(post => {
            if (!loadedPostIds.has(post._id)) {
                allPosts.push({ 
                    type: "image", 
                    data: post, 
                    timestamp: getTimestampFromObjectId(post._id) 
                });
                loadedPostIds.add(post._id);
            }
        });
        
        // Add video posts
        videoPosts.forEach(post => {
            if (!loadedPostIds.has(post._id)) {
                allPosts.push({ 
                    type: "video", 
                    data: post, 
                    timestamp: getTimestampFromObjectId(post._id) 
                });
                loadedPostIds.add(post._id);
            }
        });
        
        // Sort by timestamp (newest first)
        allPosts.sort((a, b) => b.timestamp - a.timestamp);
        
        // Remove skeletons and loading indicator
        removeSkeletons();
        removeLoadingIndicator();
        
        // Render posts immediately without delays
        for (let i = 0; i < allPosts.length; i++) {
            const post = allPosts[i];
            
            if (post.type === "written") {
                await written_post(post.data.data, post.data.chats, post.data.repost, post.data.likes, post.data.views, post.data._id, post.data.Username);
            }
            else if (post.type === "image") {
                await image_post(post.data._id, post.data.chats, post.data.repost, post.data.likes, post.data.views, post.data.Username);
            }
            else {
                await video_post(post.data.chats, post.data.repost, post.data.likes, post.data.views, post.data._id, post.data.Username);
            }
        }
        
        // Update pagination state
        hasMorePosts = pagination.hasNextPage;
        currentPage++;
        
        // Show "no more posts" message if no more posts
        if (!hasMorePosts) {
            showNoMorePostsMessage();
        }
        
        // Update observer to watch the new last element
        updateObserver();
        
    } catch (error) {
        console.error("Error loading posts:", error);
        removeSkeletons();
        removeLoadingIndicator();
        showErrorMessage("Failed to load posts. Please try again.");
    } finally {
        isLoading = false;
    }
}

function setupObserver() {
    const options = {
        root: null,
        rootMargin: '100px', // Start loading 100px before reaching the end
        threshold: 0.1
    };
    
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isLoading && hasMorePosts) {
                loadNextBatch();
            }
        });
    }, options);
    
    updateObserver();
}

function updateObserver() {
    const posts = document.querySelectorAll('.post, .written_post, .image-post, .video-post');
    if (posts.length > 0) {
        // Observe the new last element
        const lastPost = posts[posts.length - 1];
        if (lastPost && observer) {
            observer.observe(lastPost);
        }
    }
}

// Skeleton screen functions
function showSkeletons(count) {
    const postsContainer = document.getElementById("posts");
    for (let i = 0; i < count; i++) {
        const skeletonHtml = `
            <div class="post flex border border-x-0 border-gray-600 max-sm:ml-1 skeleton">
                <div class="account my-2 max-sm:w-11">
                    <div class="DP rounded-full w-10 h-10 max-sm:min-w-8 max-sm:min-h-8 max-sm:mx-3 mx-5 bg-gray-300 animate-pulse"></div>
                </div>
                <div class="mx-5 flex-1">
                    <div class="mb-4">
                        <div class="h-4 bg-gray-300 rounded w-1/4 mb-2 animate-pulse"></div>
                        <div class="h-3 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                    </div>
                    <div class="postimg my-2">
                        <div class="bg-gray-300 rounded-md h-64 w-full animate-pulse"></div>
                    </div>
                    <div class="icons flex gap-8 text-sm m-3">
                        <div class="h-3 bg-gray-300 rounded w-8 animate-pulse"></div>
                        <div class="h-3 bg-gray-300 rounded w-8 animate-pulse"></div>
                        <div class="h-3 bg-gray-300 rounded w-8 animate-pulse"></div>
                        <div class="h-3 bg-gray-300 rounded w-8 animate-pulse"></div>
                    </div>
                </div>
            </div>
        `;
        postsContainer.insertAdjacentHTML("beforeend", skeletonHtml);
    }
}

function removeSkeletons() {
    document.querySelectorAll('.skeleton').forEach(el => el.remove());
}

function showLoadingIndicator() {
    const postsContainer = document.getElementById("posts");
    const loadingHtml = `
        <div class="loading-indicator flex justify-center items-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span class="ml-2 text-gray-400">Loading more posts...</span>
        </div>
    `;
    postsContainer.insertAdjacentHTML("beforeend", loadingHtml);
}

function removeLoadingIndicator() {
    document.querySelectorAll('.loading-indicator').forEach(el => el.remove());
}

function showNoMorePostsMessage() {
    const postsContainer = document.getElementById("posts");
    const noMorePostsHtml = `
        <div class="no-more-posts flex justify-center items-center py-8 text-gray-500">
            <span class="text-center">
                <div class="text-2xl mb-2">📭</div>
                <div class="text-sm">No more posts to load</div>
                <div class="text-xs mt-1">You've reached the end of the feed</div>
            </span>
        </div>
    `;
    postsContainer.insertAdjacentHTML("beforeend", noMorePostsHtml);
}

function showErrorMessage(message) {
    const postsContainer = document.getElementById("posts");
    const errorHtml = `
        <div class="error-message flex justify-center items-center py-4 text-red-500">
            <span class="text-center">
                <div class="text-sm">❌ ${message}</div>
                <button onclick="loadNextBatch()" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                    Retry
                </button>
            </span>
        </div>
    `;
    postsContainer.insertAdjacentHTML("beforeend", errorHtml);
}

loader();

write1.addEventListener("keydown", async function (event) {
    if (event.key === "Enter") {
        vibrateOnClick(); // Add vibration feedback
        
        let data = write1.value.trim();
        if (data === "") return;

        let likes = Math.floor(Math.random() * 100);
        let chats = Math.floor(Math.random() * 70);
        let repost = Math.floor(Math.random() * 40);
        let views = Math.floor(Math.random() * 100);



        // written_post(data, chats, repost, likes, views,chigger,digger);
        write1.value = "";

        const postData = {
            profile: chigger,  // This is a Base64 image
            username: digger,
            data: data,
            chats: chats,
            likes: likes,
            repost: repost,
            views: views
        };


        try {
            await fetch(`${window.location.origin}/write-post`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(postData)
            });
            location.reload();
        }
        catch (er) {
            console.error("There was an error saving the post", er);
        }
    }
})

close1.addEventListener("click", () => {
    vibrateOnClick(); // Add vibration feedback
    popup.classList.add("hidden");
    enablePostsTouch(); // Re-enable touch on posts when popup closes
})

img_post.addEventListener("click", () => {
    vibrateOnClick(); // Add vibration feedback
    popup.classList.remove("hidden");
    disablePostsTouch(); // Disable touch on posts when popup opens
})

function getImage(input) {
    const file = input.files[0]; // Get the first selected file
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("ponga").src = e.target.result; // Update image preview
        };
        reader.readAsDataURL(file); // Convert file to a data URL
    }
}

uploadInput.addEventListener("change", function () {
    getImage(this);
});


img_post1.addEventListener("click", async function () {

    if (!uploadInput.files.length) {
        alert("please !! upload an file first..");
        return;
    }

    let repost = Math.floor(Math.random() * 40);
    let chats = Math.floor(Math.random() * 70);
    let views = Math.floor(Math.random() * 100);
    let likes = Math.floor(Math.random() * 100);

    const file = uploadInput.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("chats", chats);
    formData.append("likes", likes);
    formData.append("views", views);
    formData.append("repost", repost);
    formData.append("profile", chigger);            //base64 image
    formData.append("username", digger);


    // image_post(postId,chats, repost, likes, views);
    img_post1.disabled = true;
    img_post1.innerText = "Uploading...";

    try {
        const response = await fetch(`${window.location.origin}/upload`, {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        alert(data.message);
        location.reload();
    }
    catch (e) {
        console.error("There was an error uploading the image", e);
    }
    finally {
        img_post1.disabled = false;
        img_post1.innerText = "Upload";
    }

    popup.classList.add("hidden");
    enablePostsTouch(); // Re-enable touch on posts when popup closes
})

close2.addEventListener("click", () => {
    vibrateOnClick(); // Add vibration feedback
    first.classList.replace("max-sm:translate-x-[100px]", "max-sm:translate-x-[-80px]");
    enablePostsTouch(); // Re-enable touch on posts when sidebar closes
})

// Add close button functionality for close1
close1.addEventListener("click", () => {
    vibrateOnClick(); // Add vibration feedback
    first.classList.replace("max-sm:translate-x-[100px]", "max-sm:translate-x-[-80px]");
    enablePostsTouch(); // Re-enable touch on posts when sidebar closes
})

hamburger.addEventListener("click", () => {
    vibrateOnClick(); // Add vibration feedback
    first.classList.replace("max-sm:translate-x-[-80px]", "max-sm:translate-x-[100px]");
    disablePostsTouch(); // Disable touch on posts when sidebar opens
})


const text = "Share your thoughts !!";
let index = 0;

function typeLoop() {
    write1.placeholder = text.substring(0, index);
    index++;
    if (index > text.length) {
        setTimeout(() => {
            index = 0;
            typeLoop();
        }, 1500);
    } else {
        setTimeout(typeLoop, 140); 
    }
}

typeLoop();

const iconConfig = {
    comment: {
        inactive: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"/></svg>',
        activeIcon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01z"/></svg>'
    },
    repost: {
        inactive: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46L18.5 16.45V8c0-1.1-.896-2-2-2z"/></svg>',
        activeIcon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13v2.25H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09 4.75 3.79zM20.25 7.5l-4.603 4.3 1.706 1.82L18 12.12v7.37c0 .97-.784 1.75-1.75 1.75H11v2.25h5.25c2.347 0 4.25-1.9 4.25-4.25v-7.37l1.647 1.53 1.706-1.82L20.25 7.5z"/></svg>'
    },
    like: {
        inactive: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></svg>',
        activeIcon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></svg>'
    },
    view: {
        inactive: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"/></svg>',
        activeIcon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z" opacity="0.8"/></svg>'
    }
};

// Mobile vibration function
function vibrateOnClick() {
    if ('vibrate' in navigator) {
        navigator.vibrate(50); // 50ms vibration
    }
}

// Enhanced toggle function with vibration
function toggleIcon(element, iconType) {
    vibrateOnClick(); // Add vibration feedback
    
    const iconElement = element.querySelector('.icon-symbol');
    const countElement = element.querySelector('span:last-child');
    
    // Toggle active class for clicked element
    element.classList.toggle('active');
    
    // Update the icon SVG based on state
    if (element.classList.contains('active')) {
        iconElement.innerHTML = iconConfig[iconType].activeIcon;
        // Add color classes
        if (iconType === 'comment') element.classList.add('text-blue-400');
        if (iconType === 'repost') element.classList.add('text-green-500');
        if (iconType === 'like') element.classList.add('text-red-500');
        if (iconType === 'view') element.classList.add('text-blue-500');
    } else {
        iconElement.innerHTML = iconConfig[iconType].inactive;
        // Remove color classes
        element.classList.remove('text-blue-400', 'text-green-500', 'text-red-500', 'text-blue-500');
    }
    
    // Update count based on icon type
    let currentCount = parseInt(countElement.textContent.replace(/[^\d]/g, ''));
    
    if (element.classList.contains('active')) {
        // Increment count
        if (iconType === 'like') {
            countElement.textContent = `${currentCount + 1}k`;
        } else if (iconType === 'comment') {
            countElement.textContent = currentCount + 1;
        } else if (iconType === 'repost') {
            countElement.textContent = currentCount + 1;
        } else if (iconType === 'view') {
            countElement.textContent = `${currentCount + 1}k`;
        }
    } else {
        // Decrement count
        if (iconType === 'like') {
            countElement.textContent = `${Math.max(0, currentCount - 1)}k`;
        } else if (iconType === 'comment') {
            countElement.textContent = Math.max(0, currentCount - 1);
        } else if (iconType === 'repost') {
            countElement.textContent = Math.max(0, currentCount - 1);
        } else if (iconType === 'view') {
            countElement.textContent = `${Math.max(0, currentCount - 1)}k`;
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.comment-icon').forEach(icon => {
        icon.innerHTML = iconConfig.comment.inactive;
    });

    document.querySelectorAll('.repost-icon').forEach(icon => {
        icon.innerHTML = iconConfig.repost.inactive;
    });

    document.querySelectorAll('.like-icon').forEach(icon => {
        icon.innerHTML = iconConfig.like.inactive;
    });

    document.querySelectorAll('.view-icon').forEach(icon => {
        icon.innerHTML = iconConfig.view.inactive;
    });
});

profile_page.addEventListener("click",()=>{
    vibrateOnClick(); // Add vibration feedback
    // const userID = new URLSearchParams(window.location.search).get("userID");
    window.location.href = `${window.location.origin}/person-profile/${user_Id}`;
})

home_page.addEventListener("click",()=>{
    vibrateOnClick(); // Add vibration feedback
    window.location.href = `${window.location.origin}/home-X?userID=${user_Id}`;
})


function serve_default(){
    vibrateOnClick(); // Add vibration feedback
    try{
        window.location.href =`${window.location.origin}/default`;
    }
    catch(er)
    {
        console.error("Can't fetch the default page");
    }
}
function showNotification() {
    vibrateOnClick(); // Add vibration feedback when notification is clicked
    
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

// Function to disable touch events on posts area
function disablePostsTouch() {
    const postsContainer = document.getElementById("posts");
    const scrollContainer = document.getElementById("scroll-container");
    
    if (postsContainer) {
        postsContainer.classList.add("posts-touch-disabled");
        postsContainer.classList.remove("posts-touch-enabled");
    }
    if (scrollContainer) {
        scrollContainer.classList.add("posts-touch-disabled");
        scrollContainer.classList.remove("posts-touch-enabled");
    }
    
    // Prevent body scrolling
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
}
 
// Function to enable touch events on posts area
function enablePostsTouch() {
    const postsContainer = document.getElementById("posts");
    const scrollContainer = document.getElementById("scroll-container");
    
    if (postsContainer) {
        postsContainer.classList.remove("posts-touch-disabled");
        postsContainer.classList.add("posts-touch-enabled");
    }
    if (scrollContainer) {
        scrollContainer.classList.remove("posts-touch-disabled");
        scrollContainer.classList.add("posts-touch-enabled");
    }
    
    // Re-enable body scrolling
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
}

// Add click event listener to popup background to close popup when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById("popup");
    if (popup) {
        popup.addEventListener("click", function(e) {
            // Close popup if clicking on the background (not the popup content)
            if (e.target === popup) {
                vibrateOnClick(); // Add vibration feedback
                popup.classList.add("hidden");
                enablePostsTouch(); // Re-enable touch on posts when popup closes
            }
        });
    }
});
