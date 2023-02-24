const image = document.getElementById('image');
const cropper = new Cropper(image, {
    aspectRatio: 1,
    viewMode: 0
});

document.getElementById('cropImageBtn').addEventListener('click', function() {
    const croppedImage = cropper.getCroppedCanvas().toDataURL('image/jpeg', 0.8);
    document.getElementById('output').src = croppedImage;
    const imageInput = document.getElementById('imageInput');
    imageInput.value = croppedImage;
});