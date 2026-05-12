import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Button,
} from "reactstrap";

import { toast } from "react-toastify";
import axios from "axios";

import BackButton from "../Components/common/BackButton";
import { BASE_URL } from "../utils/config";

import "../styles/AdminDashboard.css";

const AdminBlogs = () => {
  const [blogData, setBlogData] = useState({
    title: "",
    author: "",
    photo: "",
    content: "",
    featured: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    setBlogData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  // Upload image from storage/gallery
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setBlogData((prev) => ({
        ...prev,
        photo: reader.result,
      }));

      toast.success("Image uploaded!");
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/blogs`,
        blogData
      );

      if (res.data.success) {
        toast.success("Blog created successfully!");

        setBlogData({
          title: "",
          author: "",
          photo: "",
          content: "",
          featured: false,
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create blog"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin__dashboard">
      <Container>
        <BackButton />

        <div className="admin__header">
          <h1>Create Blog</h1>

          <p>
            Add new travel blogs and articles from admin panel.
          </p>
        </div>

        <Row className="justify-content-center">
          <Col lg="8">
            <div className="admin__form-card">
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <label>Blog Title</label>

                  <input
                    type="text"
                    id="title"
                    placeholder="Enter blog title"
                    value={blogData.title}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label>Author Name</label>

                  <input
                    type="text"
                    id="author"
                    placeholder="Enter author name"
                    value={blogData.author}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                {/* Upload Image */}
                <FormGroup>
                  <label>Upload Blog Image</label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="form-control"
                  />
                </FormGroup>

                {/* OR URL */}
                <FormGroup>
                  <label>Or Paste Image URL</label>

                  <input
                    type="text"
                    id="photo"
                    placeholder="Paste image URL"
                    value={
                      blogData.photo.startsWith("data:")
                        ? ""
                        : blogData.photo
                    }
                    onChange={handleChange}
                  />
                </FormGroup>

                {/* Preview */}
                {blogData.photo && (
                  <div className="blog__preview">
                    <img
                      src={blogData.photo}
                      alt="preview"
                    />
                  </div>
                )}

                <FormGroup>
                  <label>Blog Content</label>

                  <textarea
                    id="content"
                    rows="8"
                    placeholder="Write blog content..."
                    value={blogData.content}
                    onChange={handleChange}
                    required
                  ></textarea>
                </FormGroup>

                <FormGroup className="featured__checkbox">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={blogData.featured}
                    onChange={handleChange}
                  />

                  <label htmlFor="featured">
                    Mark as Featured Blog
                  </label>
                </FormGroup>

                <Button
                  className="admin__submit-btn"
                  disabled={loading}
                >
                  {loading
                    ? "Publishing..."
                    : "Publish Blog"}
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AdminBlogs;