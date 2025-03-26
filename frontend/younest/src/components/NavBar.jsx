import { Link } from "react-router-dom";
import "../css/Navbar.css";
import { FaBars } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import NotificationBell from "./NotificationBell";

function NavBar({ toggleSidebar, setIsSidebarOpen }) {
  const { user } = useAuth();

  return (
    <nav className="nav-bar">
      <div className="nav-bar-brand">
        <FaBars className="toggle-btn" onClick={toggleSidebar} />
        <Link onClick={() => setIsSidebarOpen(false)} style={{ textDecoration: "none" }} className="" to="/">
          SokoApp
        </Link>
      </div>
      <div className="nav-bar-links">
        {user ? (
          <div style={{ display: "flex" }}>
            <NotificationBell />
            <div>
              <Link onClick={() => setIsSidebarOpen(false)} to="/profile">
                <img className="rounded-circle" style={{ width: "30px", height: "30px" }} src={user.profile_image} alt={user.username} />
              </Link>
            </div>
          </div>
        ) : (
          <>
            <Link onClick={() => setIsSidebarOpen(false)} to="/login" className="nav-link">Login</Link>
            <Link onClick={() => setIsSidebarOpen(false)} to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
