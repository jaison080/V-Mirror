import { Grid, GridItem, Heading, Image } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import WithSubnavigation from "../../components/Navbar/Navbar";
import { UserContext } from "../../contexts/UserContext";

const ProfilePage = () => {
  const { getScreenshots, screenshots } = useContext(UserContext);

  useEffect(() => {
    getScreenshots();
  });

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
        <Heading fontSize={"4xl"} textAlign={"center"}>
          Try-On Gallery
        </Heading>
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          {screenshots.map((screenshot) => {
            return (
              <GridItem>
                <Image
                  borderRadius={10}
                  key={screenshot.filename}
                  objectFit="cover"
                  src={screenshot.publicUrl}
                  alt={screenshot.filename}
                />
              </GridItem>
            );
          })}
        </Grid>
      </div>
    </>
  );
};

export default ProfilePage;
