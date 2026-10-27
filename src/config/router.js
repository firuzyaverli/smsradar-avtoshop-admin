import { AdminLayout } from '@/components/layout'
import { CategoriesPage } from '@/pages/categories/CategoriesPage'
// import { CompatibilitiesPage } from '@/pages/compatibilities/CompatibilitiesPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { DeliveriesPage } from '@/pages/deliveries/DeliveriesPage'
import { DeliveryDetailPage } from '@/pages/deliveries/DeliveryDetailPage'
import { NotFoundPage } from '@/pages/notFound/NotFoundPage'
import { OrderDetailPage } from '@/pages/orders/OrderDetailPage'
import { OrdersPage } from '@/pages/orders/OrdersPage'
import { ProductFormPage } from '@/pages/products/ProductFormPage'
import { ProductsPage } from '@/pages/products/ProductsPage'
import { createBrowserRouter } from 'react-router'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/new', element: <ProductFormPage /> },
      { path: 'products/:id', element: <ProductFormPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'orders/:id', element: <OrderDetailPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      // { path: 'compatibilities', element: <CompatibilitiesPage /> },
      { path: 'deliveries', element: <DeliveriesPage /> },
      { path: 'deliveries/:id', element: <DeliveryDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
