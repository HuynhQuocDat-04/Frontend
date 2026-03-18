import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundpage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUp from "../pages/SignUp/SignUp";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import AdminPage from "../pages/AdminPage/AdminPage";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import OrderSuccess from "../pages/OrderSuccess/OrderSuccess";
import MyOrderPage from "../pages/MyOrderPage/MyOrderPage";
// Import thêm trang DetailsOrderPage
import DetailsOrderPage from "../pages/DetailsOrderPage/DetailsOrderPage";

export const routes = [
    { path: '/', page: HomePage, isShowHeader: true, isAdmin: false },
    { path: '/products', page: ProductsPage, isShowHeader: true, isAdmin: false },
    { path: '/product/:type', page: TypeProductPage, isShowHeader: true, isAdmin: false },
    { path: '/signin', page: SignInPage, isShowHeader: false, isAdmin: false },
    { path: '/signup', page: SignUp, isShowHeader: false, isAdmin: false },
    { path: '/product-details/:id', page: ProductDetailPage, isShowHeader: true, isAdmin: false },
    { path: '/products-details/:id', page: ProductDetailPage, isShowHeader: true, isAdmin: false },
    { path: '/profile-user', page: ProfilePage, isShowHeader: true, isAdmin: false },
    { path: '/orders', page: OrderPage, isShowHeader: true, isAdmin: false },
    { path: '/payment', page: PaymentPage, isShowHeader: true, isAdmin: false },
    { path: '/orderSuccess', page: OrderSuccess, isShowHeader: true, isAdmin: false },
    { path: '/my-order', page: MyOrderPage, isShowHeader: true, isAdmin: false },
    {
        // Khai báo Route cho trang Chi tiết đơn hàng
        path: '/details-order/:id',
        page: DetailsOrderPage,
        isShowHeader: true,
        isAdmin: false
    },
    { path: '/system/admin', page: AdminPage, isShowHeader: false, isAdmin: true },
    { path: '*', page: NotFoundPage, isAdmin: false }
];