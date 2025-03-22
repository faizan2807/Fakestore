import { useEffect, useState } from "react";
import axios from "axios";

export function FakestoreAPI() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [showCart, setShowCart] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        LoadCategories();
        LoadProducts('https://fakestoreapi.com/products');
    }, []);

    function LoadCategories() {
        axios.get('https://fakestoreapi.com/products/categories')
            .then(response => {
                response.data.unshift('all');
                setCategories(response.data);
            });
    }

    function LoadProducts(url) {
        axios.get(url)
            .then(response => {
                setProducts(response.data);
                setFilteredProducts(response.data); // Initially, show all products
            });
    }

    function handleCategoryChange(e) {
        const category = e.target.value;
        const url = category === "all" ? 'https://fakestoreapi.com/products' : `https://fakestoreapi.com/products/category/${category}`;
        LoadProducts(url);
    }

    function addToCart(product) {
        setCart(prevCart => [...prevCart, product]);
        setCartCount(prevCount => prevCount + 1);
        alert("Product added successfully!");
    }

    function handleShowCart() {
        setShowCart(!showCart);
    }

    function getTotalPrice() {
        return cart.reduce((total, product) => total + product.price, 0).toFixed(2);
    }

    function handleSearch() {
        const searchLower = searchTerm.toLowerCase();
        const filtered = products.filter(product =>
            product.title.toLowerCase().includes(searchLower)
        );
        setFilteredProducts(filtered);
    }

    return (
        <div className="container-fluid">
            <header className="d-flex text-white justify-content-between p-2 bg-dark">
                <div>
                    <span className="h3 fw-bold mx-5">Fakestore</span>
                    <button className="bi bi-cart4 btn btn-warning position-relative me-5" onClick={handleShowCart}>
                        Your Cart
                        <span className="badge rounded position-absolute rounded-circle bg-danger">{cartCount}</span>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="input-group" style={{ maxWidth: '500px' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search for a product..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-warning" onClick={handleSearch}>Search</button>
                </div>
            </header>

            <section className="mt-4 row">
                <nav className="col-2">
                    <label className="form-label fw-bold">Select Category</label>
                    <select className="form-select" onChange={handleCategoryChange}>
                        {categories.map(category => (
                            <option key={category} value={category}>{category.toUpperCase()}</option>
                        ))}
                    </select>
                </nav>

                <main className="col-10 d-flex flex-wrap overflow-auto" style={{ height: '500px' }}>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <div key={product.id} className="card p-2 m-2" style={{ width: '200px' }}>
                                <img src={product.image} className="card-img-top" style={{ height: '120px' }} />
                                <div className="card-header" style={{ height: '150px' }}>{product.title}</div>
                                <div className="card-body">
                                    <dl>
                                        <dt>Price</dt>
                                        <dd>${product.price.toFixed(2)}</dd>
                                    </dl>
                                </div>
                                <div className="card-footer">
                                    <button onClick={() => addToCart(product)} className="btn btn-warning w-100">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center w-100 mt-5">No products found.</p>
                    )}
                </main>
            </section>

            <footer className="bg-dark text-white mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <h5 className="fw-bold">Login</h5>
                            <p>Access your account to track orders and manage preferences.</p>
                            <span><input type="Email" className="form-control" placeholder="Enter Email" /></span>
                            <button className="btn btn-light mt-2">Login</button>
                        </div>

                        <div className="col-md-4">
                            <h5 className="fw-bold">Contact Us</h5>
                            <p>Email: support@fakestore.com</p>
                            <p>Phone: +1 (555) 123-4567</p>
                            <p>Address: 1234 Fake Street, Faketown, USA</p>
                        </div>


                        <div className="col-md-4">
                            <h5 className="fw-bold">Follow Us</h5>
                            <div className="d-flex gap-2">
                                <a href="https://facebook.com" className="btn btn-outline-light btn-sm" target="_blank" rel="noopener noreferrer">
                                    <i className="bi bi-facebook"></i>
                                </a>
                                <a href="https://twitter.com" className="btn btn-outline-light btn-sm" target="_blank" rel="noopener noreferrer">
                                    <i className="bi bi-twitter"></i>
                                </a>
                                <a href="https://instagram.com" className="btn btn-outline-light btn-sm" target="_blank" rel="noopener noreferrer">
                                    <i className="bi bi-instagram"></i>
                                </a>
                                <a href="https://linkedin.com" className="btn btn-outline-light btn-sm" target="_blank" rel="noopener noreferrer">
                                    <i className="bi bi-linkedin"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <p className="mb-0">&copy; {new Date().getFullYear()} Fakestore. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Cart Dashboard */}
{showCart && (
    <div className="position-fixed bg-light p-4 shadow rounded"
        style={{
            width: '350px',
            height: 'auto',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1050, // Ensures it's above other elements
            transition: 'opacity 0.3s ease-in-out',
            opacity: showCart ? '1' : '0',
        }}>
        <h5 className="fw-bold text-center">Your Cart</h5>
        <button className="btn btn-danger w-100 mb-3" onClick={handleShowCart}>Close Cart</button>

        {cart.length === 0 ? (
            <p className="text-center">Your cart is empty.</p>
        ) : (
            <div>
                {cart.map((item, index) => (
                    <div key={index} className="d-flex align-items-center mb-3">
                        <img src={item.image} alt={item.title} width="50" height="50" className="me-2" />
                        <div>
                            <p className="mb-0">{item.title}</p>
                            <p className="text-success fw-bold">${item.price.toFixed(2)}</p>
                        </div>
                    </div>
                ))}
                <hr />
                <h6 className="fw-bold">Total: ${getTotalPrice()}</h6>
            </div>
        )}
    </div>
)}


       </div>
    );
}
