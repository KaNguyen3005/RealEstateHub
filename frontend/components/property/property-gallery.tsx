interface PropertyGalleryProps {
  title: string;
  images: string[];
}

const fallbackImage = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80";

export function PropertyGallery({ title, images }: PropertyGalleryProps) {
  const normalizedImages = images.length > 0 ? images.slice(0, 10) : [fallbackImage];
  const [heroImage, ...thumbImages] = normalizedImages;

  return (
    <div className="space-y-3">
      <div className="aspect-[16/10] overflow-hidden rounded-lg border border-border/70 bg-muted">
        <img src={heroImage} alt={title} className="h-full w-full object-cover" />
      </div>
      {thumbImages.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {thumbImages.slice(0, 6).map((image, index) => (
            <div key={`${image}-${index}`} className="aspect-[4/3] overflow-hidden rounded-md border border-border/70 bg-muted">
              <img src={image} alt={`${title} image ${index + 2}`} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
