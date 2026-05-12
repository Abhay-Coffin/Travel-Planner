import tourImg01 from "../images/tour-img01.jpg";
import tourImg02 from "../images/tour-img02.jpg";
import tourImg03 from "../images/tour-img03.jpg";
import tourImg04 from "../images/tour-img04.jpg";
import tourImg05 from "../images/tour-img05.jpg";
import tourImg06 from "../images/tour-img06.jpg";
import tourImg07 from "../images/tour-img07.jpg";

const blogs = [
  {
    id: "01",
    title: "Westminster Bridge - A Must-See Landmark in London",
    content: `Discover the beauty of Westminster Bridge in London...`,
    author: "TravelEnthusiast",
    date: "2023-07-29",
    photo: tourImg01,

    comments: [
      {
        username: "John Doe",
        comment: "Nice Information",
      },
      {
        username: "Jane Smith",
        comment: "Great blog post!",
      },
    ],

    featured: false,
  },

  {
    id: "02",
    title: "Bali, Indonesia - A Tropical Paradise",
    content: `Immerse yourself in the serene beauty of Bali...`,
    author: "WanderlustJourney",
    date: "2023-07-28",
    photo: tourImg02,
    comments: [],
    featured: false,
  },

  {
    id: "03",
    title: "Snowy Mountains, Thailand - A Winter Wonderland",
    content: `Experience the magic of the Snowy Mountains in Thailand...`,
    author: "SnowSeeker",
    date: "2023-07-27",
    photo: tourImg03,

    comments: [
      {
        username: "Alice Johnson",
        comment: "I loved skiing there!",
      },
    ],

    featured: false,
  },

  {
    id: "04",
    title: "Beautiful Sunrise, Thailand - A Magical Morning Experience",
    content: `Witness the captivating beauty of a sunrise in Thailand...`,
    author: "SunriseAdventurer",
    date: "2023-07-26",
    photo: tourImg04,
    comments: [],
    featured: false,
  },

  {
    id: "05",
    title: "Nusa Penida Bali, Indonesia - Hidden Gem of the Archipelago",
    content: `Embark on an unforgettable journey to Nusa Penida...`,
    author: "IslandExplorer",
    date: "2023-07-25",
    photo: tourImg05,

    comments: [
      {
        username: "Robert Smith",
        comment: "The beaches are stunning!",
      },
    ],

    featured: true,
  },

  {
    id: "06",
    title: "Cherry Blossoms Spring - A Delightful Experience in Japan",
    content: `Embark on a journey to Japan during the enchanting cherry blossom season...`,
    author: "SakuraLover",
    date: "2023-07-24",
    photo: tourImg06,

    comments: [
      {
        username: "Michael Johnson",
        comment: "I wish to visit Japan during Hanami!",
      },
    ],

    featured: true,
  },

  {
    id: "07",
    title: "Holmen Lofoten, Norway - A Picturesque Coastal Retreat",
    content: `Escape to the picturesque Holmen Lofoten in Norway...`,
    author: "CoastalDreamer",
    date: "2023-07-23",
    photo: tourImg07,
    comments: [],
    featured: true,
  },
];

export default blogs;