import { createContext, useState } from "react";
import { PRODUCTS } from "../v-mirror.constants";
import { IProduct, ProductContextType } from "../v-mirror.interfaces";

export const ProductContext = createContext<ProductContextType>({
  products: [],
  setProducts: () => {},
  isShirtSelected: true,
  setIsShirtSelected: () => {},
  isPantSelected: true,
  setIsPantSelected: () => {},
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
});

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const allProducts: IProduct[] = PRODUCTS;

  const shirts: IProduct[] = PRODUCTS.filter((product) => product.type === 0);
  const pants: IProduct[] = PRODUCTS.filter((product) => product.type === 1);
  const specs: IProduct[] = PRODUCTS.filter((product) => product.type === 2);

  const [products, setProducts] = useState<IProduct[]>(PRODUCTS);
  const [selectedShirt, setSelectedShirt] = useState<IProduct>(shirts[0]);
  const [selectedPant, setSelectedPant] = useState<IProduct>(pants[0]);
  const [selectedSpec, setSelectedSpec] = useState<IProduct>(specs[0]);
  const [isShirtSelected, setIsShirtSelected] = useState(true);
  const [isPantSelected, setIsPantSelected] = useState(true);

  const selectShirt = (shirt: IProduct) => setSelectedShirt(shirt);
  const selectPant = (pant: IProduct) => setSelectedPant(pant);
  const selectSpec = (spec: IProduct) => setSelectedSpec(spec);

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
        setIsPantSelected
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
