import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingCart from './components/cart/FloatingCart';
import Home from './pages/Home';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import About from './pages/About';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';

function App() {
  const basename = import.meta.env.PROD ? '/eventos-react-vite-rest-graphql' : '/';
  
  return (
    <Router basename={basename}>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/eventos" element={<EventList />} />
              <Route path="/eventos/:id" element={<EventDetail />} />
              <Route path="/crear-evento" element={<CreateEvent />} />
              <Route path="/acerca" element={<About />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
            </Routes>
          </main>
          <Footer />
          <FloatingCart />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
