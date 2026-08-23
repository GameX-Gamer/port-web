const navbarToggle = document.querySelector('.navbar-toggle');
const navbarMenu = document.querySelector('.navbar-menu')

navbarToggle.addEventListener('click', () => {
    navbarToggle.classList.toggle('active');
    navbarMenu.classList.toggle('active');
});

const aboutSection = document.querySelector(".revel-sec")
const observer = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                aboutSection.classList.add("animate");
                observer.unobserve(aboutSection);
            }
        });
    },
    {
        threshold: 0.2
    }
);

observer.observe(aboutSection)
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
const frameCount =368;
const frames = [];
let currentFrame =0;

// frame loader

for (let i = 0; i < frameCount; i++){
    const img =new Image();
    const frameNumber = String(i + 1).padStart(5, "0");
    img.src = `./assets/frames/toWEBP/img_${frameNumber}.webp`;
    frames.push(img);
}

// canvas size

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height =window.innerHeight;
    drawFrame(currentFrame);
}
window.addEventListener("resize", resizeCanvas);

// frame displayer

function drawFrame(index){
    const img = frames[index];
    if(!img || !img.complete || !img.naturalWidth ){
        return;
    }
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
    const scale = Math.max(
        canvas.width / img.width,
        canvas.height / img.height
    );
    const width = img.width * scale;
    const height = img.height * scale;
    const x = (canvas.width - width) / 2;
    const y = (canvas.height - height) / 2;
    
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage( img, x, y, width, height);
}

// preloader

function preloadFrames() {
    return Promise.all(
        frames.map(img => {
            return new Promise(resolve => {

                if (img.complete && img.naturalWidth) {
                    resolve();
                    return;
                }
                img.onload =resolve;
                img.onerror = () => {
                    console.warn("Failed to load:", img.src);
                    resolve();
                };
            });
        })
    );
}
// scroll animation

function createScrollAnimation() {
    gsap.registerPlugin(ScrollTrigger);
    const scrollObject = {
        frame: 135
    };

    gsap.to(scrollObject, {
        frame:frameCount - 1,
        ease: "none",

        scrollTrigger: {
            id:"flowerScroll",

            // main-sec starter
            trigger:".main-sec",
            start:"top top",

            // revel-sec end
            endTrigger:".revel-sec",
            end:"top top",
            scrub: true,

            onUpdate: () => {
                const frame = Math.round(scrollObject.frame);
                if (frame !== currentFrame) {
                    currentFrame = frame;
                    drawFrame(currentFrame);
                }
            },
            // If we scroll back upward bring the flower back
            onEnterBack: () => {
                canvas.style.opacity ="1";
            },
            onLeaveBack: () => {
                canvas.style.opacity ="1";
            }
        }
    });
    ScrollTrigger.refresh();
}
resizeCanvas();

preloadFrames().then(() => {
    console.log("Flower frames loaded");
    createScrollAnimation();
});


document.addEventListener("DOMContentLoaded", () => {
    const path = document.getElementById("stroke-path");
    const pathLenght = path.getTotalLength();

    path.style.strokeDasharray = pathLenght;
    path.style.strokeDashoffset = pathLenght;

    gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
            trigger: ".spotlight",
            start: "top top",
            end: "bottom bottom",
            scrub: true
        },
    });
});