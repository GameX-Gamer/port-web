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

gsap.registerPlugin(ScrollTrigger);
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
const frameCount = 368;
const frames = [];
let currentFrame = 0;
const frameObj = {frame:0};

for(let i=0; i <frameCount; i++) {
    const img = new Image();
    const frameNumber = String(i+1).padStart(5,"0");
    img.src = `./assets/frames/toWEBP/img_${frameNumber}.webp`
    frames.push(img);
}
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFrame(currentFrame);
}
window.addEventListener("resize",resizeCanvas);
resizeCanvas();

function drawFrame(index) {
    const img= frames[index];
    if(!img || !img.complete) {
        return;
    }
    ctx.clearRect(0,0, canvas.width, canvas.height);
    const scale = Math.max(
        canvas.width / img.width,
        canvas.height / img.height,
    );
    const width = img.width * scale;
    const height = img.height * scale;
    const x = (canvas.width - width) / 2;
    const y = (canvas.height - height) / 2;
    ctx.drawImage(img, x, y, width, height);
}
function preloadFrames() {
    return Promise.all(
        frames.map((img) => {
            return new Promise((resolve) => {
                if (img.complete && img.naturalWidth) {
                    resolve();
                    return;
                }
                img.onload = () => {
                    img.decode()
                    .catch(() => {})
                    .finally(resolve);
                };
                img.onerror = () => {
                    console.warn("Failed to load:", img.src);
                    resolve();
                };
            });
        })
    );
}

preloadFrames().then(() => {
    console.log("all 368 frames loaded")
    resizeCanvas();
    currentFrame = 0;
    drawFrame(0);
    
    gsap.to(frameObj, {
        frame: 119,
        duration: 4,
        ease: "none",
        onUpdate: () => {
            const frame = Math.round(
                frameObj.frame
            );
            if(frame !== currentFrame) {
                currentFrame = frame;
                drawFrame(currentFrame);
            }
        },
        onComplete:() => {
            console.log(
                "intro complete of 120frames"
            );
            createScrollAnimation();
        }
    });
});
function createScrollAnimation() {
    gsap.to(frameObj, {
        frame: frameCount -1,
        ease: "none",
        scrollTrigger: {
            trigger: ".main-sec",
            start: "top top",
            end: "+=4000",
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1
        },
        onUpdate: () => {
            const frame = Math.round(
                frameObj.frame
            );
            if(frame !== currentFrame) {
                currentFrame = frame;
                drawFrame(currentFrame);
            }
        }
    });
    ScrollTrigger.refresh();
}