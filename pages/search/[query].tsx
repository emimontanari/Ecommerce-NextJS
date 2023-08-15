import type { NextPage, GetServerSideProps } from "next";
import { ShopLayout } from "../../components/layouts";
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { ProductList } from "../../components/products";
import { dbProducts } from "../../database";
import { IProduct } from "../../interfaces";

interface Props {
  products: IProduct[];
  founfProducts: boolean;
  query: string;
}

const SearchPage: NextPage<Props> = ({ products, founfProducts, query }) => {
  return (
    <ShopLayout
      title={"Telso-Shop - Search"}
      pageDescription={"Telso-Shop - Search"}
    >
      <Typography variant="h1" component="h1">
        Buscar productos
      </Typography>
      {founfProducts ? (
        <Typography variant="h2" sx={{ mb: 1 }} textTransform="capitalize">
          {query}
        </Typography>
      ) : (
        <Box sx={{ display: "flex" }}>
          <Typography variant="h2" sx={{ mb: 1 }}>
            No se encontraron productos para la busqueda:
          </Typography>
          <Typography variant="h2" sx={{ ml: 1 }} color="secondary" textTransform="capitalize">
            {query}
          </Typography>
        </Box>
      )}
      <ProductList products={products} />
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = "" } = params as { query: string };

  if (query.length === 0) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  let products = await dbProducts.getProductsByTerm(query);
  const founfProducts = products.length > 0;

  if (!founfProducts) {
    products = await dbProducts.getAllProducts();
  }

  return {
    props: {
      products,
      founfProducts,
      query,
    },
  };
};

export default SearchPage;
