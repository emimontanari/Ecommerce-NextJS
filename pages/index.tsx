import type { NextPage } from 'next'
import { ShopLayout } from '../components/layouts'
import { Card, CardActionArea, CardMedia, Grid, Typography } from '@mui/material'
import { initialData } from '../database/products'
import { ProductList } from '../components/products'

const Home: NextPage = () => {
  return (
   <ShopLayout title={'Telso-Shop - Home'} pageDescription={'Telso-Shop - Home'}>
      <Typography variant="h1" component="h1">
        Tienda
      </Typography>

      <Typography variant="h2" sx={{mb: 1}}>
        Todos los productos
      </Typography>


      <ProductList
        products={initialData.products as any}       
      />
   </ShopLayout>
  )
}

export default Home
