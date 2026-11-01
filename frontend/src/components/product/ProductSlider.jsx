import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import 'swiper/css';
import ProductCard from './ProductCard.jsx';
import { ChevronLeftIcon, ChevronRightIcon } from '../ui/Icons.jsx';

export default function ProductSlider({ products }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  if (!products || products.length === 0) return null;

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, A11y]}
        spaceBetween={20}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 2.4 },
          1024: { slidesPerView: 3.4 },
          1280: { slidesPerView: 4.2 },
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        className="!overflow-visible"
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <ProductCard product={product} onQuickView={() => {}} />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        ref={prevRef}
        type="button"
        aria-label="Previous"
        className="absolute -left-4 top-[38%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-mist shadow-soft transition-transform hover:scale-105 md:flex"
      >
        <ChevronLeftIcon size={18} />
      </button>
      <button
        ref={nextRef}
        type="button"
        aria-label="Next"
        className="absolute -right-4 top-[38%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-mist shadow-soft transition-transform hover:scale-105 md:flex"
      >
        <ChevronRightIcon size={18} />
      </button>
    </div>
  );
}
