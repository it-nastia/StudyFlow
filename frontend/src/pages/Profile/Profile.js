import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'saved', 'error'
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    about: "",
  });
  const [saveTimeout, setSaveTimeout] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();
      setUser(userData);
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        about: userData.about || "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveChanges = async (data) => {
    try {
      setSaveStatus("saving");
      const token = localStorage.getItem("token");
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: data.email,
          phone: data.phone,
          about: data.about,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to update profile");
      }

      setUser(responseData);
      setSaveStatus("saved");
      setError(null);

      // Скрываем статус "saved" через 2 секунды
      setTimeout(() => {
        setSaveStatus(null);
      }, 2000);
    } catch (err) {
      setSaveStatus("error");
      setError(err.message);

      // Скрываем статус ошибки через 5 секунд
      setTimeout(() => {
        setSaveStatus(null);
        setError(null);
      }, 5000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(newFormData);

    // Очищаем предыдущий таймаут
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    // Устанавливаем новый таймаут для сохранения
    const timeout = setTimeout(() => {
      saveChanges(newFormData);
    }, 1000); // Задержка 1 секунда

    setSaveTimeout(timeout);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return <div className={styles.profilePage}>Loading...</div>;
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileContainer}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarSection}>
            <img
              src={
                user?.avatar ||
                "https://i.pinimg.com/736x/de/c6/f8/dec6f8725b7669004655f3bbe7178d41.jpg"
              }
              alt="Profile"
              className={styles.avatar}
            />
          </div>
          <div className={styles.nameDisplay}>
            <h2 className={styles.fullName}>
              {formData.firstName} {formData.lastName}
            </h2>
          </div>
        </div>

        <div className={styles.profileContent}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          {saveStatus === "saving" && (
            <div className={styles.statusMessage}>Saving changes...</div>
          )}
          {saveStatus === "saved" && (
            <div className={styles.successMessage}>
              Changes saved successfully!
            </div>
          )}

          <form>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>About</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                className={styles.textarea}
              />
            </div>
          </form>
        </div>

        <div className={styles.authActions}>
          <button
            className={`${styles.button} ${styles.recoverPasswordButton}`}
            onClick={() => navigate("/recover-password")}
          >
            Recover Password
          </button>
          <button
            className={`${styles.button} ${styles.signOutButton}`}
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
