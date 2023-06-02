import {} from "antd";
import "./App.css";
import AppHeader from "./Components/Header";
import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Login from "./Components/Login/Login";
import Products from "./Components/Products";
import DeliveryStatus from "./Components/DeliveryStatus/DeliveryStatus";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />}></Route>
        <Route
          path="/buy"
          element={
            <>
              <AppHeader />
              <Products />
            </>
          }
        ></Route>
        <Route
          path="/checkStatus"
          element={
            <>
              <AppHeader />
              <DeliveryStatus />
            </>
          }
        ></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </div>
  );
}
export default App;
