import React from "react";
import Slider from "react-slick";

const testimonialsData = [
  {
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "John Doe",
    role: "Customer",
  },
  {
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Lia Frank",
    role: "Customer",
  },
  {
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    name: "Stephen Hawking",
    role: "Customer",
  },
];

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 2000,
    slidesToShow: 3,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <Slider {...settings}>
      {testimonialsData.map((item, index) => (
        <div className="testimonials py-4 px-3" key={index}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Phasellus tempus massa vitae elit consectetur.
          </p>

          <div className="d-flex align-items-center gap-4 mt-3">
            <img src={item.image} className="w-25 h-25 rounded-2" alt={item.name} />
            <div>
              <h6 className="mb-0 mt-3">{item.name}</h6>
              <p>{item.role}</p>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default Testimonials;