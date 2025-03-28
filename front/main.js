
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

let digger = "baba";
let chigger = "chichi";

window.addEventListener("DOMContentLoaded", async (event) => {
    // if (performance.getEntriesByType("navigation")[0]?.type === "reload") {
    //     window.location.href = `${window.location.origin}/`;
    // }
    const userID = new URLSearchParams(window.location.search).get("userID");
    if (!userID) {
        console.error("No userID found in URL");
        return;
    }
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
});

async function written_post(data, chats, repost, likes, views, profileId, username) {
    const response1 = await fetch(`${window.location.origin}/profile/${profileId}`);
    const data1 = await response1.json();

    if (!data1 || !data1.profile) {
        console.error("profile not found for post id", profileId);
        return;
    }

    const profile = `data:${data1.contentType};base64,${data1.profile}`;

    let html = ` <div class="written_post flex border border-x-0 border-gray-600 ">
                    <div class="account my-2 max-sm:w-11">
                        <img src="${profile}" class="rounded-full w-10 h-10 mx-5 max-sm:min-w-8 max-sm:min-h-8 max-sm:mx-3" alt="">
                    </div>
                    <div class="mx-5">
                        <div class=" mx-1">
                            <span class="font-bold hover:underline my-2 text-sm cursor-pointer">${username}
                            </span>
                            <div class="text-sm">poet</div>
                        </div>
                        <div class="thought my-3 mx-1 flex justify-start">
                            ${data}
                        </div>
                        <div class="icons flex gap-8 text-sm m-3">
                            <div class="comment flex items-center cursor-pointer gap-1 hover:text-blue-400">
                                <span class="material-symbols-outlined text-[18px]">
                                    chat_bubble
                                </span>
                                <span>${chats}k</span>
                            </div>
                            <div class="repost flex items-center cursor-pointer gap-1 hover:text-green-500">
                                <span class="material-symbols-outlined text-[18px]">
                                    repeat
                                </span>
                                <span>${repost}</span>
                            </div>
                            <div class="like flex items-center cursor-pointer gap-1 hover:text-red-500">
                                <span class="material-symbols-outlined text-[18px]">
                                    favorite
                                </span>
                                <span>${likes}k</span>
                            </div>
                            <div class="view flex items-center cursor-pointer gap-1 hover:text-blue-500">
                                <span class="material-symbols-outlined text-[18px]">
                                    equalizer
                                </span>
                                <span>${views}k</span>
                            </div>
                        </div>
                    </div>
                </div>`

    document.getElementById("posts").innerHTML = html + document.getElementById("posts").innerHTML;
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

    let html = ` <div class=" flex border border-x-0 border-gray-600 ">
                    <div class="account my-2 max-sm:w-11">
                        <img src="${profile}" class="rounded-full w-10 h-10 mx-5 max-sm:min-w-8 max-sm:min-h-8 max-sm:mx-3" alt="">
                    </div>
                    <div class="mx-5">
                        <div>
                            <span class="font-bold hover:underline my-2 text-sm cursor-pointer">${username}
                            </span>
                            <div class="text-sm">poet</div>
                        </div>
                        <div class="postimg my-2 flex justify-evenly">
                            <video  autoplay muted controls class="rounded-md object-center h-64 max-sm:h-48 w-auto" src="${videourl}" type="video/mp4">Your browser doesn't support video tag.</video>
                        </div>
                        <div class="icons flex gap-8 text-sm m-3">
                            <div class="comment flex items-center cursor-pointer gap-1 hover:text-blue-400">
                                <span class="material-symbols-outlined text-[18px]">
                                    chat_bubble
                                </span>
                                <span>${chats}k</span>
                            </div>
                            <div class="repost flex items-center cursor-pointer gap-1 hover:text-green-500">
                                <span class="material-symbols-outlined text-[18px]">
                                    repeat
                                </span>
                                <span>${repost}</span>
                            </div>
                            <div class="like flex items-center cursor-pointer gap-1 hover:text-red-500">
                                <span class="material-symbols-outlined text-[18px]">
                                    favorite
                                </span>
                                <span>${likes}k</span>
                            </div>
                            <div class="view flex items-center cursor-pointer gap-1 hover:text-blue-500">
                                <span class="material-symbols-outlined text-[18px]">
                                    equalizer
                                </span>
                                <span>${views}k</span>
                            </div>
                        </div>
                    </div>
                </div>`

    document.getElementById("posts").innerHTML = html + document.getElementById("posts").innerHTML;
}


async function image_post(postId, chats, repost, likes, views, username) {
    const response = await fetch(`${window.location.origin}/image/${postId}`);
    const data = await response.json();


    if (!data || !data.img || !data.profile) {
        console.error("Image not found for post:", postId);
        return;
    }

    const imgURL = `data:${data.contentType};base64,${data.img}`;
    const profile1 = `data:${data.contentType1};base64,${data.profile}`;

    let html = `<div class="post flex border border-x-0 border-gray-600 max-sm:ml-1">
    <div class="account my-2 max-sm:w-12">
        <img src="${profile1}"
            class="rounded-full w-10 h-10 max-sm:min-w-8 max-sm:min-h-8 max-sm:mx-3 mx-5" alt="">
    </div>
    <div class="mx-5 ">
        <div>
            <span class="font-bold hover:underline my-2 text-sm cursor-pointer">${username}
            </span>
            <div class="text-sm">legend</div>
        </div>
        <div class="postimg my-2 flex justify-evenly">
            <img class="rounded-md object-center h-64 max-sm:h-48 w-auto mx-2" src="${imgURL}" alt="">
        </div>
        <div class="icons flex gap-8 text-sm m-3">
            <div class="comment flex items-center cursor-pointer gap-1 hover:text-blue-400">
                <span class="material-symbols-outlined text-[18px]">
                    chat_bubble
                </span>
                <span>${chats}k</span>
            </div>
            <div class="repost flex items-center cursor-pointer gap-1 hover:text-green-500">
                <span class="material-symbols-outlined text-[18px]">
                    repeat
                </span>
                <span>${repost}</span>
            </div>
            <div class="like flex items-center cursor-pointer gap-1 hover:text-red-500">
                <span class="material-symbols-outlined text-[18px]">
                    favorite
                </span>
                <span>${likes}k</span>
            </div>
            <div class="view flex items-center cursor-pointer gap-1 hover:text-blue-500">
                <span class="material-symbols-outlined text-[18px]">
                    equalizer
                </span>
                <span>${views}k</span>
            </div>
        </div>
    </div>
</div>`


    document.getElementById("posts").innerHTML = html + document.getElementById("posts").innerHTML;
}


async function loader() {
    try {
        const [postsResponse, seesResponse,Vidresponse] = await Promise.all([
            fetch(`${window.location.origin}/get-posts`),
            fetch(`${window.location.origin}/get-sees`),
            fetch(`${window.location.origin}/get-vids`)
        ]);

        const posts = await postsResponse.json();
        const posts1 = await seesResponse.json();
        const posts2 = await Vidresponse.json();

        let combinedPosts = [];
        let maxLength = Math.max(posts.length, posts1.length,posts2.length);

        for (let i = 0; i < maxLength; i++) {
            if (i < posts.length) combinedPosts.push({ type: "written", data: posts[i] });
            if (i < posts1.length) combinedPosts.push({ type: "image", data: posts1[i] });
            if (i < posts2.length) combinedPosts.push({type: "video", data: posts2[i]});
        }

        for (let post of combinedPosts) {
            if (post.type === "written") {
                await written_post(post.data.data, post.data.chats, post.data.repost, post.data.likes, post.data.views, post.data._id, post.data.Username);
            } 
            else if(post.type === "image") {
                await image_post(post.data._id, post.data.chats, post.data.repost, post.data.likes, post.data.views, post.data.Username);
            }
            else{
                await video_post(post.data.chats, post.data.repost, post.data.likes, post.data.views,post.data._id, post.data.Username);
            }
        }

        console.log("Posts retrieved successfully.");
    } catch (error) {
        console.error("There was an error fetching the posts:", error);
    }
}


loader();

write1.addEventListener("keydown", async function (event) {
    if (event.key === "Enter") {
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
    popup.classList.add("hidden");
})

img_post.addEventListener("click", () => {
    popup.classList.remove("hidden");
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
    formData.append("profile",chigger);            //base64 image
    formData.append("username",digger);


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
})

close2.addEventListener("click", () => {
    first.classList.replace("max-sm:translate-x-[100px]", "max-sm:translate-x-[-80px]");
})

hamburger.addEventListener("click", () => {
    first.classList.replace("max-sm:translate-x-[-80px]", "max-sm:translate-x-[100px]");
})



