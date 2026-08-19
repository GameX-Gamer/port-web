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
const video = document.getElementById("bg-video");
video.addEventListener("loadedmetadata", () => {
    gsap.to(video, {
        currentTime: video.duration,
        ease: "none",
        scrollTrigger: {
            trigger: ".scroll-spacing",
            start: "top top",
            end: "bottom bottom",
            scrub: true
        }
    });
});
