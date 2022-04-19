// Initialize the ezImageFilter object
const filter = new ezImageFilter();

// Get all images
const graysacle = document.querySelector("#grayscale");
const bNw = document.querySelector("#bNw");
const red = document.querySelector("#red");
const green = document.querySelector("#green");
const blue = document.querySelector("#blue");
const color = document.querySelector("#color");
const invert = document.querySelector("#invert");
const boxBlur = document.querySelector("#boxBlur");
const edges = document.querySelector("#edges");
const edgesC = document.querySelector("#edgesC");

document.addEventListener("DOMContentLoaded", () => {
    // Apply grayscale filter
    graysacle.src = filter.toGrayscale(graysacle);

    // Apply Black and White filter
    bNw.src = filter.toBlackAndWhite(bNw, 120); // 120 is the default

    // Use the image red color channel only
    red.src = filter.toRed(red);

    // Use the image green color channel only
    green.src = filter.toGreen(green);

    // Use the image blue color channel only
    blue.src = filter.toBlue(blue);

    // Filter out a color using r, g, b values
    color.src = filter.filterColor(color, 108, 99, 255); // r g b

    // invert image colors
    invert.src = filter.invertColors(invert);

    // Apply box blur filter
    boxBlur.src = filter.boxBlur(boxBlur, 1); // 1 is the default blur level

    // Apply edges filter (no color)
    edges.src = filter.edges(edges); // color:false and threshold:1 (default)

    // Apply edges filter (with color)
    edgesC.src = filter.edges(edgesC, true, 1);
});