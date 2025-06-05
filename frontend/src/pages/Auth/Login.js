import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../images/logo.svg";
import styles from "./Auth.module.css";

const Login = () => {
  const history = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Login failed");
        }

        // Store the token in localStorage
        localStorage.setItem("token", data.token);
        // Store user data if needed
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect to home page
        history("/home");
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          submit: error.message || "Invalid email or password",
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className={styles.authContainer}>
      <header className={styles.authHeader}>
        <div className={styles.authLogo}>
          <Link to="/" className={styles.logo}>
            <img src={logo} alt="StudyFlow Logo" className={styles.logoImg} />
            <span className={styles.logoName}>StudyFlow</span>
          </Link>
        </div>
        <div className={styles.authLinks}>
          <p>Don't have an account?</p>
          <Link to="/register" className={styles.link}>
            Register Me
          </Link>
        </div>
      </header>
      <div className={styles.formSection}>
        <h1 className={styles.formHeader}>Welcome Back</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email*
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              className={errors.email ? styles.errorInput : ""}
            />
            {errors.email && (
              <span className={styles.errorText}>{errors.email}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password*
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={errors.password ? styles.errorInput : ""}
            />
            {errors.password && (
              <span className={styles.errorText}>{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>

          {errors.submit && (
            <div className={styles.submitError}>{errors.submit}</div>
          )}
        </form>
      </div>

      {/* <div className={styles.infoSection}>
        <div className={styles.logo}>StudyFlow</div>
        <h2>your reliable assistant for distance learning!</h2>
        <p>
          Want to study efficiently without wasting time searching for
          materials, deadlines, or meeting links? StudyFlow is a modern web
          application designed specifically for students, teachers, and tutors.
          Everything you need for convenient online learning is in one place:
        </p>
        <ul>
          <li>class schedule and interactive calendar</li>
          <li>Kanban board to easily track assignment progress</li>
          <li>quick access to learning materials and video meetings</li>
          <li>personalized classes and intuitive navigation</li>
          <li>clean and user-friendly interface</li>
        </ul>
        <p>Join now and enjoy learning — anytime, anywhere!</p>
      </div> */}
    </div>
  );
};

export default Login;
