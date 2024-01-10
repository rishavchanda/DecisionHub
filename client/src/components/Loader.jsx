import { Skeleton } from "@mui/material";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(272px, 1fr));
  grid-gap: 16px 16px;
  margin-bottom: 20px;
`;

const Loader = () => {
  return (
    <Container>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((item) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <Skeleton variant="rounded" height={100} />
          <Skeleton variant="rounded" width="60%" />
        </div>
      ))}
    </Container>
  );
};

export default Loader;
