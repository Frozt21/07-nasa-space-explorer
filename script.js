// =====================================
// NASA SPACE EXPLORER
// FUTURE MISSION CONTROL SYSTEM
// =====================================


// NASA API KEY

const API_KEY = "ViY4CYjnsCHrkflfpap9GcU1p2936qimzfuTXBML";


const APOD_URL =
"https://api.nasa.gov/planetary/apod";





// =====================================
// DOM ELEMENTS
// =====================================


const startDateInput =
document.getElementById("startDate");


const endDateInput =
document.getElementById("endDate");


const searchBtn =
document.getElementById("searchBtn");


const gallery =
document.getElementById("gallery");


const loading =
document.getElementById("loading");



// Modal

const modal =
document.getElementById("modal");


const closeModal =
document.getElementById("closeModal");


const modalImage =
document.getElementById("modalImage");


const modalVideo =
document.getElementById("modalVideo");


const modalTitle =
document.getElementById("modalTitle");


const modalDate =
document.getElementById("modalDate");


const modalExplanation =
document.getElementById("modalExplanation");


const hdLink =
document.getElementById("hdLink");





// =====================================
// SPACE FACT DATABASE
// =====================================


const spaceFacts = [

"NASA's Voyager spacecraft have traveled beyond our solar system.",

"A black hole's gravity is strong enough to bend light.",

"The Sun produces enough energy every second to power Earth for thousands of years.",

"Saturn's rings are mostly made of billions of pieces of ice.",

"The Milky Way galaxy contains hundreds of billions of stars.",

"One million Earths could fit inside the Sun.",

"Jupiter has the fastest rotation of any planet in our solar system.",

"Space is completely silent because sound needs a medium to travel."

];





function displayRandomFact(){


const fact =
spaceFacts[
Math.floor(
Math.random() *
spaceFacts.length
)
];


document.getElementById(
"spaceFact"
)
.textContent =
fact;


}



displayRandomFact();





// =====================================
// DATE SYSTEM START
// =====================================


setupDateInputs(
startDateInput,
endDateInput
);







// =====================================
// SEARCH BUTTON
// =====================================


searchBtn.addEventListener(
"click",
fetchAPOD
);







// =====================================
// NASA API REQUEST
// =====================================


async function fetchAPOD(){



const start =
startDateInput.value;



const end =
endDateInput.value;



if(!start || !end){


alert(
"MISSION ERROR: Select valid dates."
);


return;


}




gallery.innerHTML = "";



loading.style.display =
"block";



try{


const response =
await fetch(

`${APOD_URL}?api_key=${API_KEY}&start_date=${start}&end_date=${end}`

);




if(!response.ok){


throw new Error(
"NASA database connection failed."
);


}




const data =
await response.json();



loading.style.display =
"none";





// NASA sends oldest first

data.reverse();




createGallery(data);




}



catch(error){


loading.style.display =
"none";



gallery.innerHTML = `


<div class="card">

<div class="cardContent">

<h3>

SYSTEM FAILURE

</h3>


<p>

${error.message}

</p>


</div>


</div>


`;



console.error(error);



}



}









// =====================================
// CREATE IMAGE DATABASE
// =====================================


function createGallery(items){



gallery.innerHTML = "";





items.forEach(item => {



const card =
document.createElement("div");



card.className =
"card";





let media = "";





if(item.media_type === "image"){


media = `

<img

src="${item.url}"

alt="${item.title}"

>

`;


}




else if(item.media_type === "video"){


media = `


<div class="videoPlaceholder">

▶

</div>


`;


}






card.innerHTML = `


${media}


<div class="cardContent">


<h3>

${item.title}

</h3>



<p>

DATE:
${item.date}

</p>



<p>

SOURCE:
${item.copyright || "NASA"}

</p>


</div>


`;






card.addEventListener(
"click",
function(){

openModal(item);

}

);





gallery.appendChild(card);



});



}









// =====================================
// MODAL SYSTEM
// =====================================


function openModal(item){



modal.style.display =
"flex";



modalTitle.textContent =
item.title;



modalDate.textContent =
item.date;



modalExplanation.textContent =
item.explanation;






modalImage.style.display =
"none";


modalVideo.style.display =
"none";


hdLink.style.display =
"none";







if(item.media_type === "image"){



modalImage.src =
item.hdurl ||
item.url;



modalImage.style.display =
"block";



hdLink.href =
item.hdurl ||
item.url;



hdLink.style.display =
"inline-block";



}






else if(item.media_type === "video"){



modalVideo.src =
convertYoutube(item.url);



modalVideo.style.display =
"block";



}



}









// =====================================
// YOUTUBE SUPPORT
// =====================================


function convertYoutube(url){



if(
url.includes(
"youtube.com/embed"
)

){


return url;


}





let videoID =
url.split("v=")[1];





if(videoID){


videoID =
videoID.split("&")[0];


}





return `https://www.youtube.com/embed/${videoID}`;



}









// =====================================
// CLOSE MODAL
// =====================================


closeModal.addEventListener(
"click",
closeModalWindow
);





modal.addEventListener(
"click",
function(event){



if(event.target === modal){


closeModalWindow();


}



}

);







function closeModalWindow(){


modal.style.display =
"none";


modalVideo.src =
"";


}








document.addEventListener(
"keydown",
function(event){



if(event.key === "Escape"){


closeModalWindow();


}



}

);









// =====================================
// AUTO START MISSION
// =====================================


window.addEventListener(
"load",
function(){


fetchAPOD();


});


// =====================================
// STARFIELD PARTICLE SYSTEM
// =====================================

const canvas =
document.getElementById("starfield");

const ctx =
canvas.getContext("2d");

let stars = [];

const STAR_COUNT = 250;

function resizeCanvas(){

    canvas.width =
    window.innerWidth;

    canvas.height =
    window.innerHeight;

}

window.addEventListener(
"resize",
resizeCanvas
);

resizeCanvas();

function createStars(){

    stars = [];

    for(let i=0;i<STAR_COUNT;i++){

        stars.push({

            x:Math.random()*canvas.width,

            y:Math.random()*canvas.height,

            radius:Math.random()*2 + 0.5,

            speed:Math.random()*0.6 + 0.2,

            alpha:Math.random(),

            twinkle:Math.random()*0.02

        });

    }

}

createStars();

function animateStars(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    for(const star of stars){

        star.y += star.speed;

        star.alpha += star.twinkle;

        if(star.alpha > 1){

            star.twinkle *= -1;

        }

        if(star.alpha < 0.2){

            star.twinkle *= -1;

        }

        if(star.y > canvas.height){

            star.y = 0;

            star.x =
            Math.random()*canvas.width;

        }

        ctx.beginPath();

        ctx.arc(
            star.x,
            star.y,
            star.radius,
            0,
            Math.PI*2
        );

        ctx.fillStyle =
        "rgba(255,255,255," +
        star.alpha +
        ")";

        ctx.fill();

    }

    requestAnimationFrame(
        animateStars
    );

}

animateStars();