import type { NextPage } from "next";
import { ShopLayout } from "../../components/layouts";
import {
  Card,
  CardActionArea,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { ProductList } from "../../components/products";
import { useProducts } from "../../hooks";
import { FullScreenLoading } from "../../components/ui";

const KidPage: NextPage = () => {
  const { products, isLoading } = useProducts("/products?gender=kid");

  return (
    <ShopLayout
      title={"Telso-Shop - Kids"}
      pageDescription={"Telso-Shop - Kids"}
    >
      <Typography variant="h1" component="h1">
        Niños
      </Typography>

      <Typography variant="h2" sx={{ mb: 1 }}>
        Todos los productos para niños
      </Typography>
      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default KidPage;
