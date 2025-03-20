import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { Spinner } from "react-bootstrap"; // Bootstrap spinner

const Login = () => {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // Start loading
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", { username, password });
      const { access, refresh } = response.data;

      const userDetailsResponse = await axios.get("http://127.0.0.1:8000/api/user/details/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      const { profile_image, email, id,bio } = userDetailsResponse.data;
      const userData = { id, username, access, refresh, profile_image, email,bio };

      login(userData);
      localStorage.setItem("auth", JSON.stringify(userData));

      navigate("/");
    } catch (err) {
      setError("Invalid username or password. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4 animated-card" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-4">Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Login'}
          </button>
        </form>
        <div className="mt-3 text-center">
          <p>
            Don't have an account? <a href="/register" className="text-decoration-none">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;


