import React from "react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./Layout.module.css";
import { getCurrentUser } from "../../utils/auth";

const Layout = ({ children }) => {
  const user = getCurrentUser();

  return (
    <div className={styles.layout}>
      <Header user={user} />
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
