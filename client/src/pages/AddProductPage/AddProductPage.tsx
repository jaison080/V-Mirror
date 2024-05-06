import { UploadOutlined } from "@ant-design/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Progress,
  Select,
  Switch,
} from "@chakra-ui/react";
import {
  Button as AntdButton,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from "antd";
import { useContext, useState } from "react";
import WithSubnavigation from "../../components/Navbar/Navbar";
import { ProductContext } from "../../contexts/ProductContext";
import { IAddProductForm, IFormProps } from "../../v-mirror.interfaces";

const Form1 = ({ formData, setFormData }: IFormProps) => {
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevState: Partial<IAddProductForm>) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFormData((prevState: Partial<IAddProductForm>) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  return (
    <>
      <Heading fontSize={"3xl"} textAlign={"center"} mb="2%">
        Product Details
      </Heading>
      <FormControl isRequired>
        <FormLabel htmlFor="name" fontWeight={"normal"}>
          Name
        </FormLabel>
        <Input
          id="name"
          name="name"
          placeholder="Name"
          defaultValue={formData?.name}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl mt="2%" isRequired>
        <FormLabel htmlFor="originalPrice" fontWeight={"normal"}>
          Price
        </FormLabel>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            color="gray.300"
            fontSize="1.2em"
          >
            ₹
          </InputLeftElement>
          <Input
            id="originalPrice"
            name="originalPrice"
            type="number"
            placeholder="Original Price"
            defaultValue={formData?.originalPrice}
            onChange={handleChange}
          />
        </InputGroup>
      </FormControl>
      <FormControl as={GridItem} colSpan={[6, 3]} mt="2%" isRequired>
        <FormLabel htmlFor="type" fontWeight="normal">
          Product Type
        </FormLabel>
        <Select
          id="type"
          name="type"
          autoComplete="type"
          placeholder="Select Type"
          shadow="sm"
          w="full"
          rounded="md"
          defaultValue={formData?.type}
          onChange={handleChange}
        >
          <option value={1}>Shirt</option>
          <option value={2}>Pant</option>
          <option value={3}>Glasses</option>
        </Select>
      </FormControl>
      <FormControl isRequired mt="2%">
        <FormLabel
          htmlFor="isNewProduct"
          fontWeight={"normal"}
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          New Product
          <Switch
            name="isNewProduct"
            size="lg"
            colorScheme="blue"
            isChecked={formData?.isNewProduct}
            onChange={handleRadioChange}
          />
        </FormLabel>
      </FormControl>
    </>
  );
};

const Form2 = ({ formData, setFormData }: IFormProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState: Partial<IAddProductForm>) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange: UploadProps["onChange"] = (info) => {
    let fileList = [...info.fileList];

    fileList = fileList.slice(-1);

    fileList = fileList.filter((file) => {
      if (file.type?.includes("image")) {
        return true;
      } else {
        message.error(`${file.name} is not a valid image file.`);
        return false;
      }
    });
    if (fileList.length) {
      setFormData((prevState: Partial<IAddProductForm>) => ({
        ...prevState,
        image: fileList[0].originFileObj,
      }));
    } else {
      setFormData((prevState: Partial<IAddProductForm>) => ({
        ...prevState,
        image: undefined,
      }));
    }
    setFileList(fileList);
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      if (file.originFileObj) {
        file.preview = URL.createObjectURL(file.originFileObj);
      } else {
        file.preview = "";
      }
    }
    window.open(file.preview, "_blank");
  };

  return (
    <>
      <Heading fontSize={"3xl"} textAlign={"center"} mb="2%">
        Other Details
      </Heading>

      <FormControl mt="2%" isRequired>
        <FormLabel htmlFor="offerPrice" fontWeight={"normal"}>
          Offer Price
        </FormLabel>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            color="gray.300"
            fontSize="1.2em"
          >
            ₹
          </InputLeftElement>
          <Input
            id="offerPrice"
            name="offerPrice"
            type="number"
            placeholder="Offer Price"
            defaultValue={formData?.offerPrice}
            onChange={handleChange}
          />
        </InputGroup>
      </FormControl>

      <FormControl mt="2%" isRequired>
        <FormLabel htmlFor="offerPrice" fontWeight={"normal"}>
          Product Image
        </FormLabel>
        <Upload
          fileList={fileList}
          onChange={handleImageChange}
          onPreview={handlePreview}
          beforeUpload={() => false} // Prevent upload before preview
          listType="picture-card"
        >
          {fileList.length === 0 && (
            <AntdButton icon={<UploadOutlined />}>Upload Image</AntdButton>
          )}
        </Upload>
      </FormControl>
    </>
  );
};

const AddProductPage = () => {
  const { addProduct } = useContext(ProductContext);
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(50);
  const [formData, setFormData] = useState<Partial<IAddProductForm>>({
    name: "",
    originalPrice: "0",
    type: 1,
    isNewProduct: false,
    offerPrice: "0",
  });

  const handleSubmit = (formData: Partial<IAddProductForm>) => {
    const successResponse = addProduct(formData);
    if (!successResponse) {
      return;
    }
    setFormData({
      name: "",
      originalPrice: "0",
      type: 1,
      isNewProduct: false,
      offerPrice: "0",
    });
    setStep(1);
  };

  return (
    <>
      <WithSubnavigation />
      <div
        style={{
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        <Box
          borderWidth="1px"
          rounded="lg"
          shadow="1px 1px 3px rgba(0,0,0,0.3)"
          width={800}
          p={6}
          m="10px auto"
          as="form"
        >
          <Progress
            hasStripe
            value={progress}
            mb="5%"
            mx="5%"
            isAnimated
          ></Progress>
          {step === 1 ? (
            <Form1 formData={formData} setFormData={setFormData} />
          ) : (
            <Form2 formData={formData} setFormData={setFormData} />
          )}
          <ButtonGroup mt="5%" w="100%">
            <Flex w="100%" justifyContent="space-between">
              <Flex>
                <Button
                  onClick={() => {
                    setStep(step - 1);
                    setProgress(progress - 50);
                  }}
                  isDisabled={step === 1}
                  colorScheme="blue"
                  variant="solid"
                  w="7rem"
                  mr="5%"
                >
                  Back
                </Button>
                <Button
                  w="7rem"
                  isDisabled={step === 2}
                  onClick={() => {
                    setStep(step + 1);
                    if (step === 2) {
                      setProgress(100);
                    } else {
                      setProgress(progress + 50);
                    }
                  }}
                  colorScheme="blue"
                  variant="outline"
                >
                  Next
                </Button>
              </Flex>
              {step === 2 ? (
                <Button
                  w="7rem"
                  colorScheme="red"
                  variant="solid"
                  onClick={() => {
                    handleSubmit(formData);
                  }}
                >
                  Submit
                </Button>
              ) : null}
            </Flex>
          </ButtonGroup>
        </Box>
      </div>
    </>
  );
};

export default AddProductPage;
