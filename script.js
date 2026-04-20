gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", (event) => {
  let mm = gsap.matchMedia();

  // Desktop Animations
  mm.add("(min-width: 769px)", () => {
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#page2",
        start: "0% 95%",
        end: "50% 50%",
        scrub: 1,
      },
    });

    tl.to("#fanta", { top: "120%", left: "20%", ease: "power1.out" }, "anim");
    tl.to("#half-orange", { top: "160%", left: "22%", ease: "power1.out" }, "anim+=0.1");
    tl.to("#oranges", { width: "22%", bottom: "-100%", right: "5%", ease: "power1.out" }, "anim");
    tl.to("#leaf", { rotate: "310deg", top: "110%", left: "80%", ease: "power1.out" }, "anim");
    tl.to("#leaf2", { rotate: "-270deg", bottom: "-30%", right: "85%", ease: "power1.out" }, "anim+=0.1");

    var tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: "#page3",
        start: "0% 95%",
        end: "20% 50%",
        scrub: 1,
      },
    });

    tl2.to("#fanta", { width: "31%", top: "215%", left: "50%", ease: "power1.out" }, "anim2");
    tl2.to("#half-orange", { top: "204%", left: "42%", ease: "power1.out" }, "anim2+=0.1");
  });

  // Mobile Animations
  mm.add("(max-width: 768px)", () => {
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#page2",
        start: "0% 95%",
        end: "50% 50%",
        scrub: 1,
      },
    });

    // On mobile, page2 follows page1 vertically. 
    // Fanta bottle should move towards the bottle in about section which is now centered.
    tl.to("#fanta", { 
        top: "105%", 
        left: "50%", 
        width: "60%",
        ease: "power1.out" 
    }, "anim");
    
    tl.to("#half-orange", { top: "115%", left: "10%", width: "20%", ease: "power1.out" }, "anim+=0.1");
    tl.to("#oranges", { width: "20%", bottom: "-10%", right: "10%", ease: "power1.out" }, "anim");
    tl.to("#leaf", { rotate: "310deg", top: "105%", left: "70%", ease: "power1.out" }, "anim");
    tl.to("#leaf2", { rotate: "-270deg", bottom: "5%", right: "75%", ease: "power1.out" }, "anim+=0.1");

    var tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: "#page3",
        start: "0% 95%",
        end: "5% 50%",
        scrub: 1,
      },
    });

    // Move to the middle card on page 3 (Fanta card)
    tl2.to("#fanta", { width: "50%", top: "245%", left: "50%", ease: "power1.out" }, "anim2");
    tl2.to("#half-orange", { top: "240%", left: "35%", width: "25%", ease: "power1.out" }, "anim2+=0.1");
  });

  // Shared Animations (Cards entry on page 3)
  mm.add("all", () => {
    var tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: "#page3",
        start: "0% 95%",
        end: "20% 50%",
        scrub: 1,
      },
    });

    tl2.from("#main #page3 .card .main-img1", { rotate: -90, top: "0%", left: "-100%", ease: "power1.out" }, "anim2");
    tl2.from("#main #page3 .card .bg-img1", { rotate: -90, top: "-20%", left: "-100%", ease: "power1.out" }, "anim2+=0.1");
    tl2.from("#main #page3 .card .main-img3", { rotate: 90, top: "-2%", left: "100%", ease: "power1.out" }, "anim2");
    tl2.from("#main #page3 .card .bg-img3", { rotate: 90, top: "-28%", left: "100%", ease: "power1.out" }, "anim2+=0.1");
  });

  // Initialize smooth scrolling (Lenis) - Lenis works well on mobile by default
  const lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
});

