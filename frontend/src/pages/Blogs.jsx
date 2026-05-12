import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { motion } from "framer-motion";
import axios from "axios";

import CommonSection from "../Shared/CommonSection";
import Newsletter from "../Shared/Newsletter";
import BlogCard from "../Shared/BlogCard";
import Loader from "../Components/Loader/Loader";
import BackButton from "../Components/Common/BackButton";

import { BASE_URL } from "../utils/config";

import "../styles/Tour.css";

const blogCategories = [
  "All",
  "Travel Tips",
  "Destinations",
  "Guides",
  "Experiences",
  "Food",
  "Adventure",
  "Photography",
];

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/blogs`);

        let blogData = [];

        if (Array.isArray(response.data)) blogData = response.data;
        else if (Array.isArray(response.data.data)) blogData = response.data.data;
        else if (Array.isArray(response.data.blogs)) blogData = response.data.blogs;

        setBlogs(blogData);
      } catch (err) {
        console.error(err);
        setError("Failed to load blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((blog) =>
    blog.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;

  if (error) {
    return <h4 className="text-center pt-5">{error}</h4>;
  }

  return (
    <>
      <CommonSection
        title="All Blogs"
        subtitle="Travel stories, guides and tips to inspire your next journey."
        type="blogs"
      >
        <div className="premium__blog-search">
          <input
            type="text"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select>
            <option>Category</option>
            <option>Travel Tips</option>
            <option>Guides</option>
            <option>Adventure</option>
          </select>

          <button>
            <i className="ri-filter-3-line"></i> Filter
          </button>
        </div>
      </CommonSection>

      <section className="premium__page-section">
        <Container>
          <BackButton />

          <div className="page__toolbar">
            <div className="category__tabs">
              {blogCategories.map((cat) => (
                <button
                  key={cat}
                  className={activeCategory === cat ? "active" : ""}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <select className="sort__select">
              <option>Sort by: Latest</option>
              <option>Oldest</option>
              <option>Most Popular</option>
            </select>
          </div>

          <Row>
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog, index) => (
                <Col lg="4" md="6" sm="6" className="mb-4" key={blog._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                  >
                    <BlogCard blog={blog} />
                  </motion.div>
                </Col>
              ))
            ) : (
              <Col lg="12">
                <h4 className="text-center">No blogs found.</h4>
              </Col>
            )}
          </Row>
        </Container>
      </section>

      <Newsletter />
    </>
  );
};

export default Blogs;