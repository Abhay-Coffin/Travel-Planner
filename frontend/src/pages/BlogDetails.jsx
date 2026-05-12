import React, { useContext, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Button,
} from "reactstrap";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Newsletter from "../Shared/Newsletter";
import Loader from "../Components/Loader/Loader";
import BackButton from "../Components/common/BackButton";

import useFetch from "../hooks/useFetch";
import { BASE_URL } from "../utils/config";
import { AuthContext } from "../context/AuthContext";

import "../styles/Blogdetails.css";

const BlogDetails = () => {
  const { id } = useParams();

  const reviewMsgRef = useRef("");
  const { user } = useContext(AuthContext);

  const {
    data: blog,
    loading,
    error,
  } = useFetch(`${BASE_URL}/blogs/${id}`);

  const {
    data: comments,
    loading: loadingComments,
    error: errorComments,
  } = useFetch(`${BASE_URL}/comment/${id}`);

  const submitHandler = async (e) => {
    e.preventDefault();

    const reviewText = reviewMsgRef.current.value;

    if (!user) {
      toast.error("Please login first");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/comment/${id}`, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: user?.username,
          reviewText,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        return toast.error(result.message);
      }

      toast.success("Comment submitted successfully");

      reviewMsgRef.current.value = "";

      window.location.reload();
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  if (loading || loadingComments) return <Loader />;

  if (error || errorComments || !blog || !blog._id) {
    return (
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <div className="blog__error-box">
                <h3>Error loading blog details.</h3>

                <Button
                  className="primary__btn mt-3"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }

  const {
    title = "",
    author = "",
    createdAt = new Date(),
    photo = "",
    content = "",
  } = blog;

  return (
    <>
      <section>
        <Container>
          <BackButton />

          <Row>
            <Col lg="8">
              <div className="blog__content">
                <img
                  src={photo}
                  alt={title}
                  className="blog__featured-img"
                />

                <div className="blog__info">
                  <h2>{title}</h2>

                  <div className="blog__meta">
                    <span>
                      <i className="ri-user-line"></i> {author}
                    </span>

                    <span>
                      <i className="ri-calendar-line"></i>{" "}
                      {new Date(createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p>{content}</p>
                </div>

                {/* COMMENT SECTION */}

                <div className="blog__comment-section">
                  <h4>Leave a Comment</h4>

                  <Form onSubmit={submitHandler}>
                    <FormGroup>
                      <textarea
                        rows="4"
                        placeholder="Write your comment..."
                        ref={reviewMsgRef}
                        required
                      ></textarea>
                    </FormGroup>

                    <Button className="btn primary__btn" type="submit">
                      Submit
                    </Button>
                  </Form>

                  {/* COMMENTS */}

                  <div className="blog__comments mt-5">
                    <h4>
                      Comments ({comments?.data?.length || 0})
                    </h4>

                    {(comments?.data?.length || 0) === 0 ? (
                      <p className="mt-3">
                        No comments yet. Be the first to comment!
                      </p>
                    ) : (
                      comments.data.map((item, index) => (
                        <div
                          className="comment__item"
                          key={item._id || index}
                        >
                          <div className="comment__top">
                            <div>
                              <h6>{item.username}</h6>

                              <p>
                                {new Date(
                                  item.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <p className="comment__text">
                            {item.reviewText}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </Col>

            {/* SIDEBAR */}

            <Col lg="4">
              <div className="blog__sidebar">
                <div className="blog__author-box">
                  <h5>About Author</h5>

                  <p>
                    {author || "Travel Explorer"}
                  </p>
                </div>

                <div className="blog__tips-box mt-4">
                  <h5>Travel Tips</h5>

                  <ul>
                    <li>Plan your budget early</li>
                    <li>Carry essential documents</li>
                    <li>Try local food experiences</li>
                    <li>Book hotels in advance</li>
                    <li>Keep emergency contacts ready</li>
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Newsletter />
    </>
  );
};

export default BlogDetails;