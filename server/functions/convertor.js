const { libheif } = require("libheif-js");
const decoder = new libheif.HeifDecoder();

const { createCanvas } = require("canvas");

function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 * give it a heic base64 string and it returns a JPEG data URL
 * @return {Promise<string>}
 */
async function heicToJpegDataUrl(dataUrl) {
    if (!dataUrl.startsWith("data:image/heic;base64,")) {
        throw new Error("expected heic base64 string");
    }

    const inputBuffer = base64ToArrayBuffer(
        dataUrl.substring("data:image/heic;base64,".length)
    );
    const data = decoder.decode(inputBuffer);

    const image = data[0];
    const width = image.get_width();
    const height = image.get_height();

    const outputBuffer = await new Promise((resolve, reject) => {
        image.display(
            { data: new Uint8ClampedArray(width * height * 4), width, height },
            (displayData) => {
                if (!displayData) {
                    return reject(new Error("HEIF processing error"));
                }
                resolve(displayData.data.buffer);
            }
        );
    });

    const canvas = createCanvas(width, height);
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    const imgData = context.createImageData(width, height);

    const ubuf = new Uint8Array(outputBuffer);
    for (let i = 0; i < ubuf.length; i += 4) {
        imgData.data[i] = ubuf[i]; //red
        imgData.data[i + 1] = ubuf[i + 1]; //green
        imgData.data[i + 2] = ubuf[i + 2]; //blue
        imgData.data[i + 3] = ubuf[i + 3]; //alpha
    }
    context.putImageData(imgData, 0, 0);
    return canvas.toDataURL("image/jpeg");
}

async function CustomFunction(array) {
    const response_data = [];

    for (let i = 0; i < array.length; i++) {
        const { name, type, size, base64, file } = array[i];
        const base64jpeg = await heicToJpegDataUrl(base64);

        const new_name = name.replace(/.heic/i, ".jpeg");
        const new_type = type.replace(/.heic/i, ".jpeg");

        response_data.push({
            name: new_name,
            type: new_type,
            size,
            base64: base64jpeg,
            file,
        });
    }
    return response_data;
}
module.exports = CustomFunction;
