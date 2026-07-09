
async function getCroppedImg(src, cropPixels) {
  const image = await new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
  const canvas = document.createElement("canvas")
  canvas.width = 1600;
  canvas.height = 1200;
  const ctx = canvas.getContext("2d")
  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    canvas.width,
    canvas.height,
  )
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => { 
        resolve({ 
                   url: URL.createObjectURL(blob), 
                   blob,
                   file: new File(
                      [blob],
                      `venue-${Date.now()}.jpg`,
                      {
                        type: "image/jpeg"
                      }
                   ),
                  });
                },
                  "image/jpeg",
                    0.9,
    
              )
            })
         }

    export default getCroppedImg;     