const fileUploader = document.getElementById('file-input');
const canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let image = new Image();
const reader = new FileReader();

// buttons
const brightness = document.getElementById("brightness");
const contrast = document.getElementById("contrast");
const transparent = document.getElementById("transparent");
const save = document.getElementById("save-button");

save.addEventListener("click", () => download());

brightness.addEventListener('change', adjust);
contrast.addEventListener('change', adjust);
transparent.addEventListener('change', adjust);

fileUploader.addEventListener('change', (event) => {
    const files = event.target.files;
    reader.readAsDataURL(files[0]);

    reader.onloadend = function (e) {
        image.src = e.target.result;
        image.onload = function (ev) {
            canvas.width = image.width;
            canvas.height = image.height;
            canvas.style.background = '#fff';
            ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0);
        };
    };
});


function adjust() {
    const brightnessValue = parseInt(brightness.value);
    const contrastValue = parseInt(contrast.value);
    const transparentValue = parseFloat(transparent.value);


    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    let factor = 259 * (255 + contrastValue) / (255 * (259 - contrastValue));

    for (let i = 0; i <= pixels.length - 4; i += 4) {
        pixels[i] = truncate(brightnessValue + factor * (pixels[i] - 128) + 128); // red
        pixels[i + 1] = truncate(brightnessValue + factor * (pixels[i + 1] - 128) + 128); // green
        pixels[i + 2] = truncate(brightnessValue + factor * (pixels[i + 2] - 128) + 128); // blue
        pixels[i + 3] = pixels[i + 3] * transparentValue;
    }
    ctx.putImageData(imageData, 0, 0);
}

function download() {
    let imgUrl = canvas.toDataURL();
    let tempLink = document.createElement('a');
    tempLink.download = 'result.png';
    tempLink.href = imgUrl;

    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
}

function truncate(value) {
    return value > 255 ? 255 : value < 0 ? 0 : value;
}