import React from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { motion } from "framer-motion";

import "react-photo-view/dist/react-photo-view.css";

const galleryImages = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
];

const MasonryImagesGallery = () => {
  return (
    <PhotoProvider>
      <ResponsiveMasonry
        columnsCountBreakPoints={{
          350: 1,
          576: 2,
          768: 3,
          992: 4,
        }}
      >
        <Masonry gutter="1rem">
          {galleryImages.map((item, index) => (
            <PhotoView src={item} key={index}>
              <motion.img
                src={item}
                alt={`gallery-${index + 1}`}
                className="masonry__img"
                loading="lazy"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                style={{
                  width: "100%",
                  display: "block",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
              />
            </PhotoView>
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </PhotoProvider>
  );
};

export default MasonryImagesGallery;