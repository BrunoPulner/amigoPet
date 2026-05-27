export async function resizeImage(
  file: File,
  maxWidth: number,
  quality = 0.82
): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Não foi possível criar o canvas."));
        return;
      }

      const scale = maxWidth / image.width;

      const width = maxWidth;
      const height = image.height * scale;

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(image, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Erro ao gerar imagem redimensionada."));
            return;
          }

          const resizedFile = new File(
            [blob],
            file.name.replace(/\.[^/.]+$/, "") + ".webp",
            {
              type: "image/webp",
            }
          );

          resolve(resizedFile);
        },
        "image/webp",
        quality
      );
    };

    image.onerror = reject;
    image.src = URL.createObjectURL(file);
  });
}