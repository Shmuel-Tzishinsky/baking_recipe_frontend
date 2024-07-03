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
      <BrowserRouter>
        <AuthProvider>
          <UserProvider>
            <Routes>
              <Route path="/baking_recipe_frontend/login" element={<Login />} />
              <Route path="/baking_recipe_frontend/register" element={<Register />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/baking_recipe_frontend/" element={<Home />} />
                <Route path="/baking_recipe_frontend/recipe/:id" element={<RecipeData />} />
                <Route path="/baking_recipe_frontend/favorite" element={<Favorite />} />
                <Route path="/baking_recipe_frontend/addnew" element={<AddNew />} />

                <Route path="/baking_recipe_frontend/statistics" element={<Statistics />} />
              </Route>

              <Route element={<ProtectedRoute adminRoute={true} />}>
                <Route path="/baking_recipe_frontend/users" element={<Users />} />
              </Route>

              <Route path="*" element={<Code404 />} />
            </Routes>
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </Suspense>
  );
}
