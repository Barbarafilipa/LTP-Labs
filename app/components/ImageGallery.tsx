import { useKeenSlider } from "keen-slider/react";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "keen-slider/keen-slider.min.css";

export default function ImageGallery({ product }: { product: any }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel)
    },
  })

  const totalSlides = product.images?.length || 0

  return (
    <div className="flex-[2] relative">
      {/* Imagem principal com o slider */}
      <div
        ref={sliderRef}
        className="keen-slider aspect-[4/3] max-h-[650px] bg-gray-100 rounded border border-gray-300 overflow-hidden"
      >
        {product.images && product.images.length > 0 ? (
          product.images.map((img: string, index: number) => (
            <div
              key={index}
              className="keen-slider__slide flex items-center justify-center"
            >
              <img
                src={img}
                alt={`${product.title} ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          ))
        ) : (
          <div className="keen-slider__slide w-full h-full flex items-center justify-center bg-gray-200">
            No Image
          </div>
        )}
      </div>

      {/* Botão Prev: aparece apenas se não for o primeiro slide */}
      {currentSlide > 0 && (
        <button
          onClick={() => instanceRef.current?.prev()}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full shadow p-2"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Botão Next: aparece apenas se não for o último slide */}
      {currentSlide < totalSlides - 1 && (
        <button
          onClick={() => instanceRef.current?.next()}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full shadow p-2"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Miniaturas */}
      <div className="mt-4 flex space-x-2 overflow-x-auto">
        {product.images &&
          product.images.map((img: string, index: number) => (
            <img
              key={index}
              src={img}
              alt={`Thumbnail ${index + 1}`}
              onClick={() => instanceRef.current?.moveToIdx(index)}
              className={`w-20 h-20 object-contain border rounded cursor-pointer ${
                currentSlide === index ? "border-midnight" : "border-gray-300"
              }`}
            />
          ))}
      </div>
    </div>
  )
}
