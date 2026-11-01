import { Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/MainLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import AccountLayout from './pages/account/AccountLayout.jsx';

import ProtectedRoute from './routes/ProtectedRoute.jsx';
import AdminRoute from './routes/AdminRoute.jsx';

import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import Categories from './pages/Categories.jsx';
import CollectionDetail from './pages/CollectionDetail.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import SearchResults from './pages/SearchResults.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import Contact from './pages/Contact.jsx';
import About from './pages/About.jsx';
import FAQ from './pages/FAQ.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import Terms from './pages/Terms.jsx';
import NotFound from './pages/NotFound.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';

import Dashboard from './pages/account/Dashboard.jsx';
import Profile from './pages/account/Profile.jsx';
import Addresses from './pages/account/Addresses.jsx';
import OrderHistory from './pages/account/OrderHistory.jsx';

import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminCategories from './pages/admin/AdminCategories.jsx';
import AdminCollections from './pages/admin/AdminCollections.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminReviews from './pages/admin/AdminReviews.jsx';
import AdminCoupons from './pages/admin/AdminCoupons.jsx';
import AdminBanners from './pages/admin/AdminBanners.jsx';
import AdminTestimonials from './pages/admin/AdminTestimonials.jsx';
import AdminNotifications from './pages/admin/AdminNotifications.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="categories" element={<Categories />} />
        <Route path="collections/:slug" element={<CollectionDetail />} />
        <Route path="product/:slug" element={<ProductDetails />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="cart" element={<Cart />} />
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="order-success/:id"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />
        <Route path="contact" element={<Contact />} />
        <Route path="about" element={<About />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="verify-email/:token" element={<VerifyEmail />} />

        <Route
          path="account"
          element={
            <ProtectedRoute>
              <AccountLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="orders" element={<OrderHistory />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
      </Route>

      <Route
        path="admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="collections" element={<AdminCollections />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
      </Route>
    </Routes>
  );
}
