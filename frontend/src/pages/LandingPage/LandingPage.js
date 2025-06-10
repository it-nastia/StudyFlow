import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Columns,
  BookOpen,
  Video,
  Users,
  GraduationCap,
  Building2,
  Plus,
  Clock,
  BarChart,
} from "lucide-react";
import banner from "../../images/banner.png";
import logo from "../../images/logo.svg";
import styles from "./LandingPage.module.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const isAuthenticated = localStorage.getItem("token");

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
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
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  const features = [
    {
      icon: <Calendar size={32} />,
      title: "Class Schedule",
      description: "View timetable and deadlines",
    },
    {
      icon: <Columns size={32} />,
      title: "Kanban Board",
      description: "Track assignment status (To-Do / In Progress / Done)",
    },
    {
      icon: <BookOpen size={32} />,
      title: "Materials & Assignments",
      description: "Centralized access to learning resources",
    },
    {
      icon: <Video size={32} />,
      title: "Video Conferences",
      description: "Quick access to online classes",
    },
  ];

  const audiences = [
    {
      icon: <Users size={32} />,
      title: "Students",
      description: "Track progress, submit assignments",
    },
    {
      icon: <GraduationCap size={32} />,
      title: "Teachers",
      description: "Manage materials, grade work",
    },
    {
      icon: <Building2 size={32} />,
      title: "Educational Institutions",
      description: "Organize distance learning courses",
    },
  ];

  const workflow = [
    {
      icon: <Plus size={32} />,
      title: "Create a Class",
      description: "Add participants and materials",
    },
    {
      icon: <Clock size={32} />,
      title: "Assign Tasks",
      description: "Set deadlines and status",
    },
    {
      icon: <BarChart size={32} />,
      title: "Track Progress",
      description: "Use reports and Kanban board",
    },
  ];

  const handleStartWork = () => {
    navigate("/home");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className={styles.landingPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <Link to="/" className={styles.logoLink}>
              <img src={logo} alt="StudyFlow Logo" className={styles.logoImg} />
              <span className={styles.logoName}>StudyFlow</span>
            </Link>
          </div>
          <nav className={styles.nav}>
            <a href="#features">Features</a>
            <a href="#audiences">Audiences</a>
            <a href="#workflow">Workflow</a>
          </nav>
          {/* {isAuthenticated ? (
            <div className={styles.userSection}>
              <button
                className={styles.startWorkButton}
                onClick={handleStartWork}
              >
                Start Work
              </button>
              <div className={styles.userInfo}>
                <img
                  src={
                    user?.avatar ||
                    "https://i.pinimg.com/736x/cb/87/1e/cb871e4708cba30bbdc95b300abb9fab.jpg"
                  }
                  alt="Profile"
                  className={styles.avatar}
                />
                <span className={styles.userName}>
                  {user?.firstName} {user?.lastName}
                </span>
                <button className={styles.logoutButton} onClick={handleLogout}>
                  Log Out
                </button>
              </div>
            </div>
          ) :
           ()} */}
          <div className={styles.authButtons}>
            <Link to="/login" className={styles.loginButton}>
              Log In
            </Link>
            <Link to="/register" className={styles.signupButton}>
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Organize Your Learning Process in One Place</h1>
          <p>
            Web application for student-teacher interaction in distance learning
          </p>
          {isAuthenticated ? (
            <button className={styles.ctaButton} onClick={handleStartWork}>
              Start Work
            </button>
          ) : (
            <Link to="/register" className={styles.ctaButton}>
              Get Started Free
            </Link>
          )}
        </div>
        <div className={styles.heroImage}>
          {/* You'll need to add your app interface image here */}
          <img src={banner} alt="StudyFlow Interface" />
        </div>
      </section>
      <section className={styles.features} id="features">
        <h2>Key Features</h2>
        <div className={styles.featureGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Audience Section */}
      <section className={styles.audience} id="audiences">
        <h2>Your Learning Tool</h2>
        <div className={styles.audienceGrid}>
          {audiences.map((audience, index) => (
            <div key={index} className={styles.audienceCard}>
              <div className={styles.audienceIcon}>{audience.icon}</div>
              <h3>{audience.title}</h3>
              <p>{audience.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow Section */}
      <section className={styles.workflow} id="workflow">
        <h2>How It Works</h2>
        <div className={styles.workflowGrid}>
          {workflow.map((step, index) => (
            <div key={index} className={styles.workflowStep}>
              <div className={styles.stepNumber}>{index + 1}</div>
              <div className={styles.stepIcon}>{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <h2>Ready to Optimize Your Learning Process?</h2>
        <p>Register in 1 minute and get full access</p>
        <Link to="/register" className={styles.ctaButton}>
          Create Account
        </Link>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <Link to="/" className={styles.logo}>
            <img src={logo} alt="StudyFlow Logo" className={styles.logoImg} />
            <span className={styles.logoName}>StudyFlow</span>
          </Link>
          <p className={styles.copyright}>Created by Anastasia Lysenko</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
