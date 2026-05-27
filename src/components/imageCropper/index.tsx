import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { FiCheck, FiX } from "react-icons/fi";

type ImageCropperProps = {
  imageUrl: string;
  fileName: string;
  onCancel: () => void;
  onCropComplete: (file: File) => void;
};

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);

    image.crossOrigin = "anonymous";
    image.src = url;
  });
}

async function getCroppedImage(
  imageSrc: string,
  pixelCrop: Area,
  fileName: string
): Promise<File> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Não foi possível processar a imagem.");
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Erro ao gerar imagem recortada."));
          return;
        }

        const croppedFile = new File([blob], fileName, {
          type: "image/webp",
        });

        resolve(croppedFile);
      },
      "image/webp",
      0.92
    );
  });
}

export function ImageCropper({
  imageUrl,
  fileName,
  onCancel,
  onCropComplete,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  async function handleConfirmCrop() {
    if (!croppedAreaPixels) return;

    try {
      setLoading(true);

      const croppedFile = await getCroppedImage(
        imageUrl,
        croppedAreaPixels,
        fileName.replace(/\.[^/.]+$/, "") + ".webp"
      );

      onCropComplete(croppedFile);
    } catch (error) {
      console.log(error);
      alert("Erro ao recortar a imagem.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 px-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-200 p-5">
          <div>
            <h2 className="text-xl font-black text-emerald-950">
              Ajustar foto do pet
            </h2>
            <p className="text-sm font-semibold text-zinc-500">
              Enquadre a imagem para manter o padrão dos cards.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 transition hover:bg-zinc-200"
          >
            <FiX />
          </button>
        </div>

        <div className="relative h-[420px] bg-zinc-950">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        <div className="space-y-5 p-5">
          <label className="block">
            <span className="mb-2 block text-sm font-black text-zinc-700">
              Zoom
            </span>

            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-zinc-100 px-6 font-black text-zinc-700 transition hover:bg-zinc-200"
            >
              <FiX />
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleConfirmCrop}
              disabled={loading}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 font-black text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <FiCheck />
              {loading ? "Recortando..." : "Confirmar recorte"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}