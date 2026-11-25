import { ZoomIn } from 'lucide-react';
import type { HelpImage } from '../help-center.types';

interface HelpTopicImageProps {
  image: HelpImage;
}

export function HelpTopicImage({ image }: Readonly<HelpTopicImageProps>) {
  return (
    <figure className="space-y-2">
      <a
        href={image.src}
        target="_blank"
        rel="noopener noreferrer"
        title="Abrir imagem em tamanho real"
        className="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs"
      >
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          className="h-auto w-full transition-opacity group-hover:opacity-90"
        />
      </a>
      <figcaption className="flex items-center gap-1.5 text-xs text-slate-500">
        <ZoomIn aria-hidden="true" className="size-3.5" />
        Clique ou toque na imagem para ver em tamanho real
      </figcaption>
    </figure>
  );
}