import "./App.css";
import Layout from "./Components/Layout/Layout";

import { ToastContainer } from "react-toastify";


function App() {
  return (
    <>
      <Layout />

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
}

export default App;