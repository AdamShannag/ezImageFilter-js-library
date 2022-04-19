/**
 * ezImageFilter Library
 * Library for applying filters on images
 *
 * @version 1.0.0
 * @author Adam Shannag
 * @license MIT
 */

class ezImageFilter {
    constructor() {
        //  create a canvas
        this._canvas = document.createElement("canvas");
        // set the context (2d)
        this._ctx = this._canvas.getContext("2d");
        this._setCanvas = (image) => {
            // create the canvas
            this._canvas.width = image.width;
            this._canvas.height = image.height;
            // draw the image on the canvas
            this._ctx.drawImage(image, 0, 0);
            // get image pixels
            this._pixels = this._ctx.getImageData(
                0,
                0,
                this._canvas.width,
                this._canvas.height
            );
            this._px = this._pixels.data;
        };
        this._saveImageData = () => {
            this._ctx.putImageData(
                this._pixels,
                0,
                0,
                0,
                0,
                this._pixels.width,
                this._pixels.height
            );
        };
    }

    // Apply a grayscale filter to an image
    toGrayscale(image) {
        this._setCanvas(image);
        // set pixels to grayscale value
        for (let i = 0, len = this._px.length; i < len; i += 4) {
            if (i % 4 === 3) continue; // skip alpha channel
            // using the formula : grayscale = 0.299R + 0.587G + 0.114B
            let grayscale =
                this._px[i] * 0.229 + this._px[i + 1] * 0.587 + this._px[i + 2] * 0.114;
            // Set the current pixel rgb values to the grayscale value
            this._px[i] = grayscale;
            this._px[i + 1] = grayscale;
            this._px[i + 2] = grayscale;
        }
        this._saveImageData();
        return this._canvas.toDataURL(); // set as the img src attriburte value
    }

    // Apply a Black and White filter to an image
    toBlackAndWhite(image, threshold = 120) {
        this._setCanvas(image);
        // set pixels to grayscale value
        for (let i = 0, len = this._px.length; i < len; i += 4) {
            if (i % 4 === 3) continue;
            // using the formula : grayscale = 0.299R + 0.587G + 0.114B
            let grayscale =
                this._px[i] * 0.229 + this._px[i + 1] * 0.587 + this._px[i + 2] * 0.114;
            // Compare grayscale with threshold value
            if (grayscale > threshold) {
                // set the pixel color to white
                this._px[i] = 255;
                this._px[i + 1] = 255;
                this._px[i + 2] = 255;
            } else {
                // set the pixel color to Black
                this._px[i] = 0;
                this._px[i + 1] = 0;
                this._px[i + 2] = 0;
            }
        }
        this._saveImageData();
        return this._canvas.toDataURL();
    }

    // Filter out a single color based on rgb values
    filterColor(image, red, green, blue) {
        this._setCanvas(image);
        // filter out the color
        for (let i = 0, len = this._px.length; i < len; i += 4) {
            // Compare the rgb values if no match set color to transparent
            if (!(
                    this._px[i] === red &&
                    this._px[i + 1] === green &&
                    this._px[i + 2] === blue
                )) {
                this._px[i + 3] = 0;
            }
        }
        this._saveImageData();
        return this._canvas.toDataURL();
    }

    // Use the red channel only
    toRed(image) {
        this._setCanvas(image);
        // set the Green and Blue cahnnels to 0
        // if white pixel, make transparent
        for (let i = 0, len = this._px.length; i < len; i += 4) {
            if (this._px[i] !== 255 && this._px[i] !== 255 && this._px[i] !== 255) {
                this._px[i + 1] = 0;
                this._px[i + 2] = 0;
            } else this._px[i + 3] = 0;
        }
        this._saveImageData();
        return this._canvas.toDataURL();
    }

    // Use the green channel only
    toGreen(image) {
        this._setCanvas(image);
        // set the Red and Blue cahnnels to 0
        // if white pixel, make transparent
        for (let i = 0, len = this._px.length; i < len; i += 4) {
            if (this._px[i] !== 255 && this._px[i] !== 255 && this._px[i] !== 255) {
                this._px[i] = 0;
                this._px[i + 2] = 0;
            } else this._px[i + 3] = 0;
        }
        this._saveImageData();
        return this._canvas.toDataURL();
    }

    // Use the blue channel only
    toBlue(image) {
        this._setCanvas(image);
        // set the Red and Green cahnnels to 0
        // if white pixel, make transparent
        for (let i = 0, len = this._px.length; i < len; i += 4) {
            if (this._px[i] !== 255 && this._px[i] !== 255 && this._px[i] !== 255) {
                this._px[i] = 0;
                this._px[i + 1] = 0;
            } else this._px[i + 3] = 0;
        }
        this._saveImageData();
        return this._canvas.toDataURL();
    }

    // invert image colors
    invertColors(image) {
            this._setCanvas(image);
            // set the pixel alpha channel to 255 - pixel alpha channel
            for (let i = 0, len = this._px.length; i < len; i += 4) {
                this._px[i] = 255 - this._px[i];
                this._px[i + 1] = 255 - this._px[i + 1];
                this._px[i + 2] = 255 - this._px[i + 2];
            }
            this._saveImageData();
            return this._canvas.toDataURL();
        }
        // Apply a box blur filter to the image
    boxBlur(image, lv = 1) {
        this._setCanvas(image);
        // lv adjusts the kernel size used to apply the blur
        // we average every pixel in the kernel (in each color channel)
        // and set it to the current pixel
        for (let i = 0, len = this._px.length; i < len; i++) {
            if (i % 4 === 3) continue;
            this._px[i] =
                (this._px[i] +
                    (this._px[i - lv * 4] || this._px[i]) +
                    (this._px[i + lv * 4] || this._px[i]) +
                    (this._px[i - lv * 4 * this._pixels.width] || this._px[i]) +
                    (this._px[i + lv * 4 * this._pixels.width] || this._px[i]) +
                    (this._px[i - lv * 4 * this._pixels.width - lv * 4] || this._px[i]) +
                    (this._px[i + lv * 4 * this._pixels.width + lv * 4] || this._px[i]) +
                    (this._px[i - lv * 4 * this._pixels.width + lv * 4] || this._px[i]) +
                    (this._px[i + lv * 4 * this._pixels.width - lv * 4] || this._px[i])) /
                9;
        }
        this._saveImageData();
        return this._canvas.toDataURL();
    }

    // Draw edges
    edges(image, color = false, threshold = 1) {
        this._setCanvas(image);
        // go through each pixel
        for (let y = 0; y < this._pixels.height; y++)
            for (let x = 0; x < this._pixels.width; x++) {
                // current pixel
                let original = y * 4 * this._pixels.width + x * 4;
                // left of current pixel
                let left = y * 4 * this._pixels.width + (x - 1) * 4;
                // below current pixel
                let bottom = (y + 1) * 4 * this._pixels.width + x * 4;
                // the original pixel rgb cahnnels average values
                let originalAve =
                    (this._pixels.data[original] +
                        this._pixels.data[original + 1] +
                        this._pixels.data[original + 2]) /
                    3;
                // the left pixel rgb cahnnels average values
                let leftAve =
                    (this._pixels.data[left] +
                        this._pixels.data[left + 1] +
                        this._pixels.data[left + 2]) /
                    3;
                // the right pixel rgb cahnnels average values
                let bottomAve =
                    (this._pixels.data[bottom] +
                        this._pixels.data[bottom + 1] +
                        this._pixels.data[bottom + 2]) /
                    3;
                // compare the the average with the threshold value
                // set the color to white if below the threshold
                // else set to black or original color
                if (
                    Math.abs(originalAve - leftAve) <= threshold ||
                    Math.abs(originalAve - bottomAve) <= threshold
                ) {
                    this._pixels.data[original] = 255;
                    this._pixels.data[original + 1] = 255;
                    this._pixels.data[original + 2] = 255;
                } else {
                    if (color === false) {
                        this._pixels.data[original] = 0;
                        this._pixels.data[original + 1] = 0;
                        this._pixels.data[original + 2] = 0;
                    }
                }
            }
        this._saveImageData();
        return this._canvas.toDataURL();
    }
}