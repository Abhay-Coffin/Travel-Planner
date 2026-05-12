import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Container,
  Row,
  Col,
  Form,
  ListGroup,
  Alert,
} from "reactstrap";

import { useParams } from "react-router-dom";

import axios from "axios";

import avtar from "../assets/images/avatar.jpg";

import "../styles/Blogdetails.css";

import useFetch from "../hooks/useFetch";

import FeaturedBlogsList from "../Components/FeaturedBlogs/FeaturedBlogsList";

import Subtitle from "../Shared/Subtitle";
import Newsletter from "../Shared/Newsletter";

import { BASE_URL } from "../utils/config";
import { AuthContext } from "../context/AuthContext";

const BlogDetails = () => {
  const { id } = useParams();

  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [comments, setComments] = useState([]);

  const [commentStatus, setCommentStatus] = useState(null);

  const [isLoginAlertVisible, setIsLoginAlertVisible] =
    useState(false);

  const commentMsgRef = useRef("");

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/blogs/${id}`
        );

        setBlog(response.data?.data || response.data);

        setLoading(false);
      } catch (error) {
        console.error(error);

        setError("Error loading blog details.");

        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const {
    data: fetchedComments,
    loading: loadingComments,
    error: errorComments,
  } = useFetch(`comment/${id}`);

  useEffect(() => {
    if (Array.isArray(fetchedComments)) {
      setComments(fetchedComments);
    } else if (fetchedComments?.data) {
      setComments(fetchedComments.data);
    }
  }, [fetchedComments]);

  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!user) {
      setIsLoginAlertVisible(true);
      return;
    }

    const commentMsg = commentMsgRef.current.value;

    if (!commentMsg.trim()) return;

    const commentData = {
      comment: commentMsg,
      username: user.username,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/comment/${id}`,
        commentData
      );

      const newComment =
        response.data?.data || response.data;

      setComments((prev) => [...prev, newComment]);

      commentMsgRef.current.value = "";

      setCommentStatus("success");
    } catch (error) {
      console.error(error);

      setCommentStatus("error");
    }
  };

  if (loading || loadingComments) {
    return (
      <div className="loader-container">
        <div className="loader" />

        <div className="loading-text">
          Loading...
        </div>
      </div>
    );
  }

  if (error || errorComments || !blog) {
    return (
      <div className="error__msg">
        Error loading blog details.
        Check your network.
      </div>
    );
  }

  const {
    title,
    author,
    createdAt,
    photo,
    content,
  } = blog;

  return (
    <>
      <section>
        <Container>
          <Row>
            <Col lg="8">
              <div className="blog__content">
                <div className="blog__info">
                  <h2 className="blog__title">
                    {title}
                  </h2>

                  <div className="d-flex align-items-center gap-5">
                    <span className="blog__rating d-flex align-items-center gap-1">
                      <i className="ri-user-line"></i>

                      {author}
                    </span>
                  </div>

                  <div className="blog__extra-details">
                    <span>
                      <i className="ri-calendar-line"></i>

                      {new Date(
                        createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        options
                      )}
                    </span>

                    <span>
                      <i className="ri-chat-3-line"></i>

                      {comments?.length || 0}{" "}
                      {comments?.length === 1
                        ? "Comment"
                        : "Comments"}
                    </span>
                  </div>

                  <h5>Blog Content</h5>

                  <p>{content}</p>

                  <img
                    src={photo}
                    alt={title}
                  />
                </div>

                <div className="blog__reviews mt-4">
                  <h4>Comments</h4>

                  {commentStatus === "success" && (
                    <Alert
                      color="success"
                      toggle={() =>
                        setCommentStatus(null)
                      }
                    >
                      Comment added successfully.
                    </Alert>
                  )}

                  {commentStatus === "error" && (
                    <Alert
                      color="danger"
                      toggle={() =>
                        setCommentStatus(null)
                      }
                    >
                      Failed to add comment.
                      Please try again.
                    </Alert>
                  )}

                  {isLoginAlertVisible && (
                    <Alert
                      color="warning"
                      toggle={() =>
                        setIsLoginAlertVisible(
                          false
                        )
                      }
                    >
                      Please login to add a
                      comment.
                    </Alert>
                  )}

                  <Form onSubmit={submitHandler}>
                    <div className="review__input">
                      <input
                        type="text"
                        placeholder="Share your thoughts"
                        required
                        ref={commentMsgRef}
                      />

                      <button
                        className="primary__btn text-white"
                        type="submit"
                      >
                        Submit
                      </button>
                    </div>
                  </Form>

                  <ListGroup className="user__reviews">
                    {comments?.map(
                      (comment, index) => (
                        <div
                          className="review__item"
                          key={index}
                        >
                          <img
                            src={avtar}
                            alt="User Avatar"
                          />

                          <div className="w-100">
                            <div className="d-flex align-items-center justify-content-between">
                              <div>
                                <h5>
                                  {
                                    comment.username
                                  }
                                </h5>

                                <p>
                                  {new Date(
                                    comment.createdAt
                                  ).toLocaleDateString(
                                    "en-IN",
                                    options
                                  )}
                                </p>
                              </div>
                            </div>

                            <h6>
                              {comment.comment}
                            </h6>
                          </div>
                        </div>
                      )
                    )}
                  </ListGroup>
                </div>
              </div>
            </Col>

            <Col lg="4">
              <div className="featured__blogs">
                <div className="blog__title">
                  <Subtitle
                    subtitle={"Featured Blogs"}
                  />
                </div>

                <div className="mx-auto md:text-center">
                  <FeaturedBlogsList
                    lg={11}
                    md={10}
                    sm={11}
                  />
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