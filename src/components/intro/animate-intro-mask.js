// To avoid importing a library to do this, I created a simple function to animate custom properties in CSS.
export function animateIntroMask(element, targetX, targetY) {
  /*
   * Mutating the DOM directly is not recommended, but in this case
   * it's the easiest way, and it's a one off use for an optional effect.
   */
  if ("animationFrameId" in element && element.animationFrameId) {
    cancelAnimationFrame(element.animationFrameId);
  }

  /*
   * I use Css custom properties to animate the mask.
   * the later being a none animatable property itself
   */
  const x = getComputedStyle(element).getPropertyValue("--__x");
  const y = getComputedStyle(element).getPropertyValue("--__y");
  const width = getComputedStyle(element).width;
  const height = getComputedStyle(element).height;
  const startX =
    parseInt(x.includes("%") ? (parseInt(width) / 2).toString() : x, 10) || 0;
  const startY =
    parseInt(y.includes("%") ? (parseInt(height) / 2).toString() : y, 10) || 0;

  const deltaX = targetX - startX;
  const deltaY = targetY - startY;

  function animate() {
    const newX = startX + 0.07 * deltaX;
    const newY = startY + 0.07 * deltaY;
    element.style.setProperty("--__x", `${newX}px`);
    element.style.setProperty("--__y", `${newY}px`);

    const animationFrameId = requestAnimationFrame(animate);
    Object.assign(element, { animationFrameId });
  }

  requestAnimationFrame(animate);
}
