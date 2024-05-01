import { Checkbox, Heading } from "@chakra-ui/react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import WithSubnavigation from "../../components/Navbar/Navbar";
import Product from "../../components/Product/Product";
import { ProductContext } from "../../contexts/ProductContext";
import { IProduct, ProductContextType } from "../../v-mirror.interfaces";
import "./ProductsPage.css";

const ProductsPage = () => {
  const navigate = useNavigate();
  const {
    shirts,
    pants,
    // specs,
    selectShirt,
    selectPant,
    isShirtSelected,
    setIsShirtSelected,
    isPantSelected,
    setIsPantSelected,
  }: // selectSpec,
  ProductContextType = useContext(ProductContext);

  return (
    <>
      <WithSubnavigation />
      <div
        style={{
          padding: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            className="try_on_button"
            onClick={() => navigate("/stream")}
            style={{
              alignSelf: "flex-end",
            }}
          >
            Try-On
          </button>
        </div>

        <div
          style={{
            paddingTop: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "2rem",
                alignItems: "center",
              }}
            >
              <Heading fontSize={"4xl"} textAlign={"center"}>
                Shirts
              </Heading>
              <Checkbox
                size="lg"
                colorScheme="blue"
                isChecked={isShirtSelected}
                onChange={(e) => setIsShirtSelected(!isShirtSelected)}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                opacity: !isShirtSelected ? 0.5 : 1,
                pointerEvents: !isShirtSelected? "none" : "auto"
              }}
            >
              {shirts.map((shirt: IProduct) => {
                return (
                  <Product
                    product={shirt}
                    onSelect={selectShirt}
                    key={shirt.id}
                  />
                );
              })}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "2rem",
                alignItems: "center",
              }}
            >
              <Heading fontSize={"4xl"} textAlign={"center"}>
                Pants
              </Heading>
              <Checkbox
                size="lg"
                colorScheme="blue"
                isChecked={isPantSelected}
                onChange={(e) => setIsPantSelected(!isPantSelected)}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                opacity: !isPantSelected ? 0.5 : 1,
                pointerEvents: !isPantSelected? "none" : "auto"
              }}
            >
              {pants.map((pant: IProduct) => {
                return (
                  <Product product={pant} onSelect={selectPant} key={pant.id} />
                );
              })}
            </div>
          </div>
          {/* <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "25px",
              fontWeight: "800",
            }}
          >
            Specs
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {specs.map((spec: IProduct) => {
              return <Product product={spec} onSelect={selectSpec} />;
            })}
          </div>
        </div> */}
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
