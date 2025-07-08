import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useState } from "react";
import "./App.css";

function Home({ user }) {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const success = query.get("success");
  const canceled = query.get("canceled");

  return (
    <div className="page-container">
      <h2>Home Page</h2>
      {success && <div style={{ color: '#16a34a', fontWeight: 600, marginBottom: 16, fontSize: '1.1rem' }}>Payment successful! Thank you for your purchase.</div>}
      {canceled && <div style={{ color: '#dc2626', fontWeight: 600, marginBottom: 16, fontSize: '1.1rem' }}>Payment canceled.</div>}
      {user ? (
        <p className="welcome-message">Welcome <b>{user}</b>!</p>
      ) : (
        <p className="info-message">Please login to see your welcome message.</p>
      )}
    </div>
  );
}

function SignUp({ onSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onSignUp(email);
      navigate("/");
    }
  };

  return (
    <div className="page-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email);
      navigate("/");
    }
  };

  return (
    <div className="page-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

function Contact() {
  return (
    <div className="page-container">
      <h2>Contact Page</h2>
    </div>
  );
}
function Ecommerce() {
  const navigate = useNavigate();
  const products = [
    { id: 1, name: "Headphones", price: 59.99, image: "/products/headphone.jpeg" },
    { id: 2, name: "Smart Watch", price: 99.99, image: "/products/smartwatch.jpeg" },
    { id: 3, name: "Bluetooth Speaker", price: 39.99, image: "/products/speaker.webp" },
    { id: 4, name: "Fitness Tracker", price: 29.99, image: "/products/band.jpeg" },
    { id: 5, name: "Mouse", price: 19.99, image: "/products/mouse.jpeg" },
  ];

  const handleBuyNow = (product) => {
    navigate(`/checkout/${product.id}`);
  };

  return (
    <div className="page-container">
      <h2>E-commerce Page</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "center", marginTop: "2rem" }}>
        {products.map(product => (
          <div key={product.id} style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(99,102,241,0.08)", padding: 20, width: 220, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img src={product.image} alt={product.name} style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8, marginBottom: 16 }} onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/120?text=No+Image'; }} />
            <div style={{ fontWeight: 700, fontSize: "1.25rem", marginBottom: 8, color: "#22223b", textAlign: "center", minHeight: 32 }}>
              {product.name}
            </div>
            <div style={{ color: "#6366f1", fontWeight: 700, marginBottom: 12 }}>${product.price.toFixed(2)}</div>
            <button onClick={() => handleBuyNow(product)} style={{ padding: "0.6rem 1.2rem", borderRadius: 7, background: "#16a34a", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer", fontSize: "1rem" }}>Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Checkout() {
  const { productId } = useParams();
  const products = [
    { id: 1, name: "Headphones", price: 59.99, image: "/products/headphone.jpeg" },
    { id: 2, name: "Smart Watch", price: 99.99, image: "/products/smartwatch.jpeg" },
    { id: 3, name: "Bluetooth Speaker", price: 39.99, image: "/products/speaker.webp" },
    { id: 4, name: "Fitness Tracker", price: 29.99, image: "/products/band.jpeg" },
    { id: 5, name: "Mouse", price: 19.99, image: "/products/mouse.jpeg" },
  ];
  const product = products.find(p => p.id === Number(productId));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!product) {
    return <div className="page-container"><h2>Product Not Found</h2></div>;
  }

  const handleStripeCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: product.name, price: product.price })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Failed to create Stripe session.");
      }
    } catch (err) {
      setError("Error connecting to payment server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>Checkout</h2>
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(99,102,241,0.08)", padding: 30, width: 320, margin: "2rem auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img src={product.image} alt={product.name} style={{ width: 140, height: 140, objectFit: "cover", borderRadius: 8, marginBottom: 18 }} onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/140?text=No+Image'; }} />
        <div style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: 8, color: "#22223b", textAlign: "center" }}>{product.name}</div>
        <div style={{ color: "#6366f1", fontWeight: 700, marginBottom: 18, fontSize: "1.1rem" }}>${product.price.toFixed(2)}</div>
        <button onClick={handleStripeCheckout} disabled={loading} style={{ padding: "0.8rem 1.5rem", borderRadius: 7, background: loading ? "#a5b4fc" : "#635bff", color: "#fff", border: "none", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontSize: "1.1rem", marginBottom: 10 }}>
          {loading ? "Redirecting..." : "Pay with Stripe"}
        </button>
        {error && <div style={{ color: "#dc2626", marginTop: 8 }}>{error}</div>}
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState("");

  const handleSignUp = (email) => {
    setUser(email);
  };
  const handleLogin = (email) => {
    setUser(email);
  };

  return (
    <Router>
      <nav style={{ display: "flex", gap: "1rem", padding: "1rem", background: "#f0f0f0" }}>
        <Link to="/">Home</Link>
        <Link to="/signup">Sign Up</Link>
        <Link to="/login">Login</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/ecommerce">E-commerce</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/signup" element={<SignUp onSignUp={handleSignUp} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/ecommerce" element={<Ecommerce />} />
        <Route path="/checkout/:productId" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App;
