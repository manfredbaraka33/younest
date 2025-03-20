import { Link } from "react-router-dom";
import "../css/Navbar.css"
import { FaBars, FaBell } from "react-icons/fa";

import { useAuth } from "../contexts/AuthContext";
import NotificationBell from "./NotificationBell";
function NavBar({toggleSidebar,setIsSidebarOpen}) {

    const { user, logout } = useAuth(); // Get user data and logout function from context
    console.log(user);

    const markAsRead = () => { 
        axios.post('/api/notifications/mark-as-read/'); 
        }; 

    return <nav  className="nav-bar text-dark bg-light">
        <div className="nav-bar-brand">
        <FaBars className="toggle-btn text-dark" onClick={toggleSidebar} />
            <Link onClick={()=>setIsSidebarOpen(false)} style={{textDecoration:"none"}} className="text-dark" to="/">sokoApp</Link>
        </div>
        <div className="nav-bar-links"> 
            {user ? (<div style={{display:"flex"}}>
                {/* <div className="mx-3"><FaBell style={{fontSize:"1.5rem"}}/></div> */}
                <NotificationBell onClick={markAsRead}/>
                <div><Link onClick={()=>setIsSidebarOpen(false)} to="/profile">
                <img className="rounded-circle" style={{width:"30px",height:"30px"}} src={user.profile_image} alt={user.username}/>
               </Link></div>
                </div>):(
                   <><Link onClick={()=>setIsSidebarOpen(false)} to="/login" className="nav-link">Login</Link>
            <Link onClick={()=>setIsSidebarOpen(false)} to="/register" className="nav-link">Register</Link></>
                )}
        </div>
    </nav>
}

export default NavBar