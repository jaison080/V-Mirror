import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import StreamPage from "./pages/StreamPage";
import ProductsPage from "./pages/ProductsPage/ProductsPage";
import SimpleCard from "./pages/LoginPage/LoginPage";
import SignupCard from "./pages/SignupPage/SignupPage";

const App = () => {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<SimpleCard />} />
          <Route path="/signup" element={<SignupCard />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/stream" element={<StreamPage />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
