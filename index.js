const DESICION_THRESHOLD = 150;
let isAnimate = false;
let pullDeltaX = 0;
let startX;
let actualCard;

function startDrag(event) {
  if (isAnimate) return;

  actualCard = event.target.closest("article");

  if (!actualCard) return;

  startX = event.pageX ?? event.touches[0].pageX;

  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onEnd);

  document.addEventListener("touchmove", onMove, { passive: true });
  document.addEventListener("touchend", onEnd, { passive: true });
}

let onMove = (event) => {
  const currentX = event.pageX ?? event.touches[0].pageX;

  pullDeltaX = currentX - startX;

  if (pullDeltaX === 0) return;

  isAnimate = true;

  const deg = pullDeltaX / 14;

  actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;
  actualCard.style.cursor = "grabbing";

  const opacity = Math.abs(pullDeltaX) / 100;
  const isRight = pullDeltaX > 0;

  const choiceEl = isRight
    ? actualCard.querySelector(".choice.like")
    : actualCard.querySelector(".choice.nope");

  choiceEl.style.opacity = opacity;
};

let onEnd = () => {
  document.removeEventListener("mousemove", onMove);
  document.removeEventListener("mouseup", onEnd);

  document.removeEventListener("touchmove", onMove, { passive: true });
  document.removeEventListener("touchend", onEnd, { passive: true });

  const desicionMade = Math.abs(pullDeltaX) >= DESICION_THRESHOLD;

  if (desicionMade) {
    const goRight = pullDeltaX > 0;

    actualCard.classList.add(goRight ? "go-right" : "go-left");
    actualCard.addEventListener("trasitionend", () => actualCard.remove());
  } else {
    actualCard.classList.add("reset");
    actualCard.classList.remove("go-left", "go-right");

    actualCard
      .querySelectorAll(".choice")
      .forEach((element) => (element.style.opacity = 0));
  }

  actualCard.addEventListener("transitionend", () => {
    actualCard.removeAttribute("style");
    actualCard.classList.remove("reset");

    isAnimate = false;

    pullDeltaX = 0;
  });
};

document.addEventListener("mousedown", startDrag);
document.addEventListener("touchstart", startDrag, { passive: true });
