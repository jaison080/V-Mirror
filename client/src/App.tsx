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
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/stream" element={<StreamPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </ProductProvider>
        </UserProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
