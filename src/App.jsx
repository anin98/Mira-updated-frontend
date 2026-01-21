import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import LoadingAnimation from './components/LoadingAnimation'

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const Features = lazy(() => import('./pages/Features'))
const Pricing = lazy(() => import('./pages/Pricing'))
const Auth = lazy(() => import('./pages/Auth'))
const CustomerAuth = lazy(() => import('./pages/CustomerAuth'))
const CompanyAuth = lazy(() => import('./pages/CompanyAuth'))
const Chat = lazy(() => import('./pages/Chat'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'))
const Payment = lazy(() => import('./pages/Payment'))
const Profile = lazy(() => import('./pages/Profile'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingAnimation size="large" text="Loading..." />
    </div>
  )
}

// Layout with header and footer
function MainLayout({ children, showFooter = true }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      {showFooter && <Footer />}
    </>
  )
}

// Layout without header/footer (for dashboard, chat)
function MinimalLayout({ children }) {
  return <main className="min-h-screen">{children}</main>
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Main pages with header/footer */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/features"
          element={
            <MainLayout>
              <Features />
            </MainLayout>
          }
        />
        <Route
          path="/pricing"
          element={
            <MainLayout>
              <Pricing />
            </MainLayout>
          }
        />
        <Route
          path="/auth"
          element={
            <MainLayout showFooter={false}>
              <Auth />
            </MainLayout>
          }
        />
        <Route
          path="/customer-auth"
          element={
            <MainLayout showFooter={false}>
              <CustomerAuth />
            </MainLayout>
          }
        />
        <Route
          path="/company-auth"
          element={
            <MainLayout showFooter={false}>
              <CompanyAuth />
            </MainLayout>
          }
        />
        <Route
          path="/payment"
          element={
            <MainLayout>
              <Payment />
            </MainLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <MainLayout>
              <Profile />
            </MainLayout>
          }
        />
        <Route
          path="/customer-dashboard"
          element={
            <MainLayout>
              <CustomerDashboard />
            </MainLayout>
          }
        />

        {/* Minimal layout pages */}
        <Route
          path="/chat"
          element={
            <MinimalLayout>
              <Chat />
            </MinimalLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <MinimalLayout>
              <Dashboard />
            </MinimalLayout>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <MainLayout>
              <NotFound />
            </MainLayout>
          }
        />
      </Routes>
    </Suspense>
  )
}
