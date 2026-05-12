import React from "react";
import { Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import "./Blogcard.css";

const fallbackBlogImg =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80";

const BlogCard = ({ blog }) => {
  const { _id, title, author, createdAt, photo, comments = [] } = blog;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No Date";

  return (
    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
      <div className="blog__card premium__blog-card">
        <Card>
          <Link to={`/blogs/${_id}`}>
            <div className="blog__img">
              <img src={photo || fallbackBlogImg} alt={title} />
              <span>Travel Guide</span>
            </div>
          </Link>

          <CardBody>
            <div className="card__top d-flex align-items-center justify-content-between">
              <span className="blog__location d-flex align-items-center gap-1">
                <i className="ri-user-line"></i>
                {author || "Admin"}
              </span>

              <span className="blog__rating">{formattedDate}</span>
            </div>

            <h5 className="blog__title">
              <Link to={`/blogs/${_id}`}>{title}</Link>
            </h5>

            <p className="blog__excerpt">
              Discover useful travel insights, tips and destination inspiration
              for your next journey.
            </p>

            <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
              <h5>
                {comments.length}{" "}
                <span>{comments.length === 1 ? "Comment" : "Comments"}</span>
              </h5>

              <Link to={`/blogs/${_id}`} className="read__more-link">
                Read More <i className="ri-arrow-right-line"></i>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </motion.div>
  );
};

export default BlogCard;