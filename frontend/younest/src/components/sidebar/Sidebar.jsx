import { useContext } from "react";
import {
  RssFeed,
  Chat,
  PlayCircleFilledOutlined,
  Group,
  Bookmark,
  HelpOutline,
  WorkOutline,
  Event,
  School,
} from "@mui/icons-material"; // Change to @mui/icons-material
import { FaAmazonPay, FaHeart, FaHome,FaSave,FaSellcast,FaShoppingBasket } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./sidebar.css";
import { ThemeContext } from "../../contexts/ThemeContext";


export default function Sidebar({isSidebarOpen,setIsSidebarOpen}) {

  const {user,logout} = useAuth();
  const { theme, setTheme } = useContext(ThemeContext); 

  return (
    <div className={`sidebar py-3 ${isSidebarOpen ? 'open' : 'closed'}`}>
      <div className="sidebarWrapper mt-3" onClick={()=>setIsSidebarOpen(false)}>
        <ul className="sidebarList">
          <li className="sidebarListItem">
          <Link  style={{textDecoration:"none"}} to="/">
            <FaHome className="sidebarIcon"/>
            <span className="sidebarListItemText">Home</span>
            </Link>
          </li>
          <li className="sidebarListItem">
          <Link  style={{textDecoration:"none"}} to="/shops">
            <FaShoppingBasket className="sidebarIcon" /> 
            <span className="sidebarListItemText">Shops</span>
            </Link>
          </li>
          <li className="sidebarListItem">
          <Link style={{textDecoration:"none"}} to="/forsale">
            <FaSellcast className="sidebarIcon"/>
            <span className="sidebarListItemText">For Sale</span>
          </Link>
          </li>
          {user? (
            <li className="sidebarListItem">
            <Link style={{textDecoration:"none"}} to="/saved">
              <FaHeart className="sidebarIcon"/>
              <span className="sidebarListItemText">Favorites</span>
            </Link>
            </li>
          ):(<></>)}
        </ul>
       
        <hr className="sidebarHr" />
        <div className="side-user">
           {user? (
            <>
            <p>
            <Link to="/profile" style={{textDecoration:"none"}}> <img className="rounded-circle" width="45px" height="45px" src={user.profile_image} alt={user.username} />
              <span className="mx-2">{user.username}</span>
             </Link>
             </p>
              <Link className="btn btn-sm btn-danger" onClick={logout}>Log out</Link>
            </>
           ):(
            <>
            <Link to="/login"><button className="btnLogin">Log in</button></Link>
            </>
           )

           }
        </div>
        <Link to="/feedback" className="btn btn-warning my-4">
          Feedback
        </Link>


        <div>
        <button className="theme-button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}> 
          {theme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"} 
        </button>
        </div>

      </div>
    </div>
  );
}
