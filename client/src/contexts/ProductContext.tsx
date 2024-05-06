import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { PRODUCTS } from "../v-mirror.constants";
import {
  IAddProductForm,
  IProduct,
  ProductContextType,
} from "../v-mirror.interfaces";
import { UserContext } from "./UserContext";

const BASE_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:4000";

export const ProductContext = createContext<ProductContextType>({
  products: [],
  setProducts: () => {},
  isShirtSelected: true,
  setIsShirtSelected: () => {},
  isPantSelected: true,
  setIsPantSelected: () => {},
  isSpecSelected: true,
  setIsSpecSelected: () => {},
  shirts: [],
  pants: [],
  specs: [],
  allProducts: [],
  selectedShirt: {
    id: 0,
    name: "",
    type: 1,
    publicUrl: "",
    isNewProduct: false,
    originalPrice: 0,
    offerPrice: 0,
  },
  selectedPant: {
    id: 0,
    name: "",
    type: 2,
    publicUrl: "",
    isNewProduct: false,
    originalPrice: 0,
    offerPrice: 0,
  },
  selectedSpec: {
    id: 0,
    name: "",
    type: 3,
    publicUrl: "",
    isNewProduct: false,
    originalPrice: 0,
    offerPrice: 0,
  },
  selectShirt: () => {},
  selectPant: () => {},
  selectSpec: () => {},
  addProduct: async () => false,
});

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
  const { handleToast } = useContext(UserContext);

  const [shirts, setShirts] = useState<IProduct[]>([]);
  const [pants, setPants] = useState<IProduct[]>([]);
  const [specs, setSpecs] = useState<IProduct[]>(
    PRODUCTS.filter((product: IProduct) => product.type === 3)
  );

  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedShirt, setSelectedShirt] = useState<IProduct | undefined>();
  const [selectedPant, setSelectedPant] = useState<IProduct | undefined>();
  const [selectedSpec, setSelectedSpec] = useState<IProduct | undefined>(
    PRODUCTS.filter((product: IProduct) => product.type === 3)[0]
  );
  const [isShirtSelected, setIsShirtSelected] = useState(true);
  const [isPantSelected, setIsPantSelected] = useState(true);
  const [isSpecSelected, setIsSpecSelected] = useState(true);

  const selectShirt = (shirt: IProduct) => setSelectedShirt(shirt as IProduct);
  const selectPant = (pant: IProduct) => setSelectedPant(pant as IProduct);
  const selectSpec = (spec: IProduct) => setSelectedSpec(spec as IProduct);

  const getProducts = async () => {
    const res = await axios.get(`${BASE_URL}/products`);
    if (res.status === 200 && res.data?.success === true) {
      setAllProducts(res.data.products);
      setShirts(
        res.data.products.filter((product: IProduct) => product.type === 1)
      );
      setPants(
        res.data.products.filter((product: IProduct) => product.type === 2)
      );
      // setSpecs(
      //   res.data.products.filter((product: IProduct) => product.type === 3)
      // );
      setSelectedShirt(
        res.data.products.filter((product: IProduct) => product.type === 1)[0]
      );
      setSelectedPant(
        res.data.products.filter((product: IProduct) => product.type === 2)[0]
      );
      // setSelectedSpec(
      //   res.data.products.filter((product: IProduct) => product.type === 3)[0]
      // );
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const fileToBlob = async (file: File) =>
    new Blob([new Uint8Array(await file?.arrayBuffer())], { type: file.type });

  const addProduct = async (productData: Partial<IAddProductForm>) => {
    console.log(productData);
    const accessToken = getAdminAccessToken();
    const formData = new FormData();
    const blob = await fileToBlob(productData.image as File);
    formData.append("product", blob, productData.name);
    formData.append(
      "productData",
      JSON.stringify({
        name: productData.name,
        originalPrice: parseInt(productData.originalPrice as string),
        type: productData.type,
        isNewProduct: productData.isNewProduct,
        offerPrice: parseInt(productData.offerPrice as string),
      })
    );
    const res = await axios.post(`${BASE_URL}/products`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Basic ${accessToken}`,
      },
    });
    if (res.status === 200 && res.data?.success === true) {
      getProducts();
      handleToast({
        title: "Product Added Successfully",
        isError: false,
      });
      return true;
    }
    return false;
  };

  const getAdminAccessToken = (): string => {
    const email = "admin@admin.com";
    const password = "admin";
    return btoa(`${email}:${password}`);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        shirts,
        pants,
        specs,
        allProducts,
        selectedShirt,
        selectedPant,
        selectedSpec,
        selectShirt,
        selectPant,
        selectSpec,
        isShirtSelected,
        setIsShirtSelected,
        isPantSelected,
        setIsPantSelected,
        isSpecSelected,
        setIsSpecSelected,
        addProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
