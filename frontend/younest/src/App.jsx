import "./css/App.css";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Sidebar from "./components/sidebar/Sidebar";
import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { AuthProvider } from "./contexts/AuthContext";
import Profile from "./pages/Profile";
import PoSDetails from "./pages/PoSDetails";
import ShopDetails from "./pages/ShopDetails";
import ShopsList from "./pages/ShopsList";
import AddShop from "./pages/AddShop";
import ForSale from "./pages/ForSale";
import MyShops from "./pages/MyShops";
import AddProduct from "./pages/AddProduct";
import ForSaleDetail from "./pages/ForSaleDetail";
import Feedback from "./pages/Feedback";
import SavedPoS from "./pages/SavedPoS";
import Profile2 from "./pages/Profile2";

function App() {

    // State to manage whether the sidebar is open or closed
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // Toggle the sidebar state
   const toggleSidebar = () => {
     setIsSidebarOpen(prevState => !prevState);
   };

  return (
    <AuthProvider>
      <NavBar setIsSidebarOpen={setIsSidebarOpen} toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Sidebar setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen}/>
      <main className="main-content" onClick={()=>setIsSidebarOpen(false)}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/pos/:posId" element={<PoSDetails/>}/>
          <Route path="/shop/:shopId" element={<ShopDetails/>}/>
          <Route path="/shops" element={<ShopsList/>}/>
          <Route path="/addshop" element={<AddShop/>}/>
          <Route path="/forsale" element={<ForSale/>}/>
          <Route path="/myshops" element={<MyShops/>}/>
          <Route path="/addproduct" element={<AddProduct/>}/>
          <Route path="/product/:productId" element={<ForSaleDetail/>}/>
          <Route path="/feedback" element={<Feedback />}/>
          <Route path="/saved" element={<SavedPoS />}/>
          <Route path="/profile2/:user_id" element={<Profile2 />}/>
        </Routes>
      </main>
    </AuthProvider>
  );
}

export default App;