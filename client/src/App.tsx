import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProductProvider } from "./contexts/ProductContext";
import { UserProvider } from "./contexts/UserContext";
import HomePage from "./pages/HomePage/HomePage";
import SimpleCard from "./pages/LoginPage/LoginPage";
import ProductsPage from "./pages/ProductsPage/ProductsPage";
import SignupCard from "./pages/SignupPage/SignupPage";
import StreamPage from "./pages/StreamPage/StreamPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ProtectedRoute from "./utils/ProtectedRoute";
import AddProductPage from "./pages/AddProductPage/AddProductPage";

const App = () => {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <UserProvider>
          <ProductProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<SimpleCard />} />
              <Route path="/signup" element={<SignupCard />} />
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <ProductsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/add"
                element={
                  <ProtectedRoute>
                    <AddProductPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stream"
                element={
                  <ProtectedRoute>
                    <StreamPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </ProductProvider>
        </UserProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
