import { createContext, useContext, useState } from "react";
import { PRODUCTS } from "../v-mirror.constants";
import {
  IAddProductForm,
  IProduct,
  ProductContextType,
} from "../v-mirror.interfaces";
import { UserContext } from "./UserContext";

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
    type: 0,
    image: "",
    isNewProduct: false,
    originalPrice: 0,
    offerPrice: 0,
  },
  selectedPant: {
    id: 0,
    name: "",
    type: 0,
    image: "",
    isNewProduct: false,
    originalPrice: 0,
    offerPrice: 0,
  },
  selectedSpec: {
    id: 0,
    name: "",
    type: 0,
    image: "",
    isNewProduct: false,
    originalPrice: 0,
    offerPrice: 0,
  },
  selectShirt: () => {},
  selectPant: () => {},
  selectSpec: () => {},
  addProduct: () => false,
});

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const allProducts: IProduct[] = PRODUCTS;
  const { handleToast } = useContext(UserContext);

  const shirts: IProduct[] = PRODUCTS.filter((product) => product.type === 0);
  const pants: IProduct[] = PRODUCTS.filter((product) => product.type === 1);
  const specs: IProduct[] = PRODUCTS.filter((product) => product.type === 2);

  const [products, setProducts] = useState<IProduct[]>(PRODUCTS);
  const [selectedShirt, setSelectedShirt] = useState<IProduct>(shirts[0]);
  const [selectedPant, setSelectedPant] = useState<IProduct>(pants[0]);
  const [selectedSpec, setSelectedSpec] = useState<IProduct>(specs[0]);
  const [isShirtSelected, setIsShirtSelected] = useState(true);
  const [isPantSelected, setIsPantSelected] = useState(true);
  const [isSpecSelected, setIsSpecSelected] = useState(true);

  const selectShirt = (shirt: IProduct) => setSelectedShirt(shirt);
  const selectPant = (pant: IProduct) => setSelectedPant(pant);
  const selectSpec = (spec: IProduct) => setSelectedSpec(spec);

  const addProduct = (productData: Partial<IAddProductForm>) => {
    console.log(productData);
    handleToast({
      title: "Product Added Successfully",
      isError: false,
    });
    return true;
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
