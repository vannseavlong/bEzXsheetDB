import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  layout('routes/dashboard-layout.tsx', [
    route('order', 'routes/order/order.tsx'),
    route('banner', 'routes/banner/banner.tsx'),
    route('banner/new-banner', 'routes/banner/new-banner.tsx'),
    route('category', 'routes/category/category.tsx'),
    route('category/:id', 'routes/category/new-category.tsx'),
    route('category-addon', 'routes/category-addon/category-addon.tsx'),
    route('category-addon/:id', 'routes/category-addon/new-category-addon.tsx'),
    route('product', 'routes/product/product.tsx'),
    route('product/:id', 'routes/product/new-product.tsx'),
    route('product-option', 'routes/product-option/product-option.tsx'),
    route('product-option/:id', 'routes/product-option/new-product-option.tsx')
  ])
] satisfies RouteConfig;
