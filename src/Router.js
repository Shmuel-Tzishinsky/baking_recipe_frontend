import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

/**
 * i call the this file here because in netlify server i have
 * bug that makes me sure i call the this file in the first
 * father to make sure this file call only one time
 * 👇👇👇👇
 * */
import "./Components/common/warningMsg/warningMsg.css";
import { AuthProvider } from "./context/auth/AuthContext";
import { UserProvider } from "./context/users/usersContext";

const Home = lazy(() => import("./Components/home/Home"));
const Login = lazy(() => import("./Components/login/Login"));
const Register = lazy(() => import("./Components/register/Register"));
const Code404 = lazy(() => import("./Components/code404/Code404"));
const Statistics = lazy(() => import("./Components/statistics/Statistics"));
const Favorite = lazy(() => import("./Components/Favorite/Favorite"));
const AddNew = lazy(() => import("./Components/AddNew/AddNew"));
const Users = lazy(() => import("./Components/users/Users"));
const RecipeData = lazy(() => import("./Components/RecipeData/RecipeData"));

export default function Router() {
  return (
    <Suspense fallback={<h1 style={{ direction: "rtl" }}>טוען עמוד..</h1>}>
      <BrowserRouter basename="/baking_recipe_frontend/">
        <AuthProvider>
          <UserProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/recipe/:id" element={<RecipeData />} />
                <Route path="/favorite" element={<Favorite />} />
                <Route path="/addnew" element={<AddNew />} />

                <Route path="/statistics" element={<Statistics />} />
              </Route>

              <Route element={<ProtectedRoute adminRoute={true} />}>
                <Route path="/users" element={<Users />} />
              </Route>

              <Route path="*" element={<Code404 />} />
            </Routes>
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </Suspense>
  );
}
