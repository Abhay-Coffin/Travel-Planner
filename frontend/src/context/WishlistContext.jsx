import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const isWishlisted = (id) => {
    return wishlist.some((tour) => tour._id === id);
  };

  const toggleWishlist = (tour) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item._id === tour._id);

      if (exists) {
        toast.info("Removed from wishlist!");

        return prev.filter((item) => item._id !== tour._id);
      }

      toast.success("Added to wishlist!");

      return [...prev, tour];
    });
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isWishlisted,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};