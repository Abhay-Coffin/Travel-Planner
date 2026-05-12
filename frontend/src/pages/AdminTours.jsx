import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
} from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { BASE_URL } from "../utils/config";
import "../styles/AdminDashboard.css";
import BackButton from "../Components/Common/BackButton";

const emptyForm = {
  title: "",
  city: "",
  address: "",
  distance: "",
  photo: "",
  desc: "",
  price: "",
  maxGroupSize: "",
  featured: false,
};

const AdminTours = () => {
  const navigate = useNavigate();

  const [tours, setTours] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchTours = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/tours`);
      setTours(res.data?.data || res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const openAddModal = () => {
    setEditingTour(null);
    setFormData(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (tour) => {
    setEditingTour(tour);
    setFormData({
      title: tour.title || "",
      city: tour.city || "",
      address: tour.address || "",
      distance: tour.distance || "",
      photo: tour.photo || "",
      desc: tour.desc || "",
      price: tour.price || "",
      maxGroupSize: tour.maxGroupSize || "",
      featured: tour.featured || false,
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        photo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const saveTour = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      distance: Number(formData.distance),
      price: Number(formData.price),
      maxGroupSize: Number(formData.maxGroupSize),
    };

    try {
      if (editingTour) {
        await axios.put(`${BASE_URL}/tours/${editingTour._id}`, payload, {
          withCredentials: true,
        });
      } else {
        await axios.post(`${BASE_URL}/tours`, payload, {
          withCredentials: true,
        });
      }

      setModalOpen(false);
      fetchTours();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const deleteTour = async (id) => {
    if (!window.confirm("Delete this tour?")) return;

    try {
      await axios.delete(`${BASE_URL}/tours/${id}`, {
        withCredentials: true,
      });

      fetchTours();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete tour");
    }
  };

  return (
    <section className="admin__dashboard">
      <Container>
        <BackButton />
        

        <div className="admin__header admin__header-row">
          <div>
            <h1>Manage Tours</h1>
            <p>Add, edit and delete tour packages.</p>
          </div>

          <Button color="success" onClick={openAddModal}>
            Add Tour
          </Button>
        </div>

        <Table bordered responsive hover>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Title</th>
              <th>City</th>
              <th>Price</th>
              <th>Featured</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {tours.map((tour) => (
              <tr key={tour._id}>
                <td>
                  <img
                    src={tour.photo}
                    alt={tour.title}
                    className="admin__tour-img"
                  />
                </td>

                <td>{tour.title}</td>
                <td>{tour.city}</td>
                <td>₹{tour.price}</td>
                <td>{tour.featured ? "Yes" : "No"}</td>

                <td>
                  <Button
                    color="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => openEditModal(tour)}
                  >
                    Edit
                  </Button>

                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => deleteTour(tour._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="lg">
          <ModalHeader toggle={() => setModalOpen(false)}>
            {editingTour ? "Edit Tour" : "Add Tour"}
          </ModalHeader>

          <ModalBody>
            <Form onSubmit={saveTour} className="admin__form">
              <FormGroup>
                <label>Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>City</label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Address</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Distance</label>
                <input
                  type="number"
                  name="distance"
                  value={formData.distance}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Photo URL</label>
                <input
                  name="photo"
                  value={formData.photo}
                  onChange={handleChange}
                  placeholder="Paste image URL or upload image below"
                />
              </FormGroup>

              <FormGroup>
                <label>Upload Photo From Device</label>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} />
              </FormGroup>

              {formData.photo && (
                <div className="admin__photo-preview">
                  <img src={formData.photo} alt="preview" />
                </div>
              )}

              <FormGroup>
                <label>Description</label>
                <textarea
                  name="desc"
                  value={formData.desc}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Max Group Size</label>
                <input
                  type="number"
                  name="maxGroupSize"
                  value={formData.maxGroupSize}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup check>
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                />{" "}
                <label>Featured Tour</label>
              </FormGroup>

              <Button color="success" className="mt-3">
                {editingTour ? "Update Tour" : "Create Tour"}
              </Button>
            </Form>
          </ModalBody>
        </Modal>
      </Container>
    </section>
  );
};

export default AdminTours;