import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { API_ENDPOINTS } from "../../config/api";
import logo from "../../images/logo.svg";
import styles from "./Auth.module.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    about: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
        console.log("Starting registration process...");
        console.log("API endpoint:", API_ENDPOINTS.AUTH.REGISTER);

        const { confirmPassword, ...registrationData } = formData;
        console.log("Request data:", {
          ...registrationData,
          password: "[REDACTED]",
        });

        const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registrationData),
        });

        console.log("Response status:", response.status);
        console.log(
          "Response headers:",
          Object.fromEntries(response.headers.entries())
        );

        const data = await response.json();
        console.log("Response data:", data);

        if (!response.ok) {
          throw new Error(data.error || "Registration failed");
        }

        localStorage.setItem("token", data.token);
        alert("Registration successful! Please log in.");
        navigate("/login");
      } catch (error) {
        console.error("Registration error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });
        setErrors((prev) => ({
          ...prev,
          submit: error.message || "Registration failed. Please try again.",
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
          <p>Already have an account?</p>
          <Link to="/login" className={styles.link}>
            Login
          </Link>
        </div>
      </header>
      <div className={styles.formSection}>
        <h1 className={styles.formHeader}>Get Started Now</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.nameFields}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName" className={styles.label}>
                Name*
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Name"
                className={errors.firstName ? styles.errorInput : ""}
              />
              {errors.firstName && (
                <span className={styles.errorText}>{errors.firstName}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName" className={styles.label}>
                Last Name*
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className={errors.lastName ? styles.errorInput : ""}
              />
              {errors.lastName && (
                <span className={styles.errorText}>{errors.lastName}</span>
              )}
            </div>
          </div>

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
            <label htmlFor="phone" className={styles.label}>
              Phone*
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone number"
              className={errors.phone ? styles.errorInput : ""}
            />
            {errors.phone && (
              <span className={styles.errorText}>{errors.phone}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password*
            </label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={errors.password ? styles.errorInput : ""}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className={styles.errorText}>{errors.password}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password*
            </label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={errors.confirmPassword ? styles.errorInput : ""}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className={styles.errorText}>{errors.confirmPassword}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="about" className={styles.label}>
              About
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              placeholder="Tell something about yourself"
              rows="4"
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Register Me"}
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

export default Register;
