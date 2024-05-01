import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import WithSubnavigation from "../../components/Navbar/Navbar";
import { UserContext } from "../../contexts/UserContext";

export default function SimpleCard() {
  const { handleLogin, handleToast } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const checkValidations = (): boolean => {
    if (email === "" || !email.includes("@") || password === "") return false;
    return true;
  };
  return (
    <>
      <WithSubnavigation />
      <Flex
        minH={"90vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Sign in to your account
            </Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              to enjoy all of our cool features ✌️
            </Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Stack spacing={10}>
                {/* <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Checkbox>Remember me</Checkbox>
                  <Text color={"blue.400"}>Forgot password?</Text>
                </Stack> */}
                <Button
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  onClick={() =>
                    checkValidations()
                      ? handleLogin({ email, password, name: "" })
                      : handleToast({
                          title: "Enter Valid Details",
                          isError: true,
                        })
                  }
                >
                  Sign in
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Not a user?{" "}
                  <Link color={"blue.400"} href="/signup">
                    Sign Up
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}
