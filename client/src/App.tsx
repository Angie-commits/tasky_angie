import Footer from "./component/Footer";
import Header from "./component/Header";
import AllTasks from "./pages/AllTasks";
import CompletedTask from "./pages/CompletedTask";
import CreatePage from "./pages/CreatePage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Delete from "./pages/Delete";

import { Routes, Route } from "react-router-dom";
import EditTask from "./pages/EditTask";
import ProtectedRoutes from "./component/ProtectedRoutes";
import Account from "./pages/Account";
const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/tasks"
          element={
            <ProtectedRoutes>
              <AllTasks />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/completed"
          element={
            <ProtectedRoutes>
              <CompletedTask />s
            </ProtectedRoutes>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoutes>
              <CreatePage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/trash"
          element={
            <ProtectedRoutes>
              <Delete />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoutes>
              <EditTask />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoutes>
              <Account />
            </ProtectedRoutes>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
