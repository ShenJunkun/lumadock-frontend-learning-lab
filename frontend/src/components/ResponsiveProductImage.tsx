import type { ImgHTMLAttributes } from "react";

type ResponsiveProductImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
};

const lumadockHeroSources = [
  { src: "/assets/lumadock-hero-640.webp", width: 640 },
  { src: "/assets/lumadock-hero-960.webp", width: 960 },
  { src: "/assets/lumadock-hero-1280.webp", width: 1280 },
];

function buildSrcSet() {
  return lumadockHeroSources.map((source) => `${source.src} ${source.width}w`).join(", ");
}

export function ResponsiveProductImage({
  alt,
  decoding = "async",
  loading = "lazy",
  sizes = "(max-width: 700px) 100vw, 50vw",
  src,
  ...imageProps
}: ResponsiveProductImageProps) {
  if (src !== "/assets/lumadock-hero.png") {
    return <img alt={alt} decoding={decoding} loading={loading} src={src} {...imageProps} />;
  }

  return (
    <picture>
      <source srcSet={buildSrcSet()} sizes={sizes} type="image/webp" />
      <img alt={alt} decoding={decoding} loading={loading} src={src} {...imageProps} />
    </picture>
  );
}
