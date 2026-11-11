
import { useEffect, useState } from "react";
import {
  createOrganization,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getDashboardSummary,
} from "./services/api";
import {
  LayoutDashboard,
  Package,
  Plus,
  Search,
  Trash2,
  Pencil,
  Boxes,
  AlertTriangle,
  TrendingUp,
  LogOut,
  X,
} from "lucide-react";
import "./index.css";

const emptyProduct = {
  name: "",
  sku: "",
  description: "",
  quantity: 0,
  costPrice: "",
  sellingPrice: "",
  lowStockThreshold: 5,
};

function App() {
  const [organizationId, setOrganizationId] = useState(
      localStorage.getItem("organizationId")
  );
  const [organizationName, setOrganizationName] = useState(
      localStorage.getItem("organizationName") || ""
  );
  const [setupName, setSetupName] = useState("");
  const [page, setPage] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalQuantity: 0,
    lowStockProducts: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyProduct);

  const loadData = async () => {
    if (!organizationId) return;

    try {
      setLoading(true);
      setError("");

      const [productData, dashboardData] = await Promise.all([
        getProducts(organizationId),
        getDashboardSummary(organizationId),
      ]);

      setProducts(productData);
      setSummary(dashboardData);
    } catch (err) {
      setError(
          err.response?.data?.error ||
          "Unable to load data. Check whether the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [organizationId]);

  const handleOrganizationSetup = async (e) => {
    e.preventDefault();

    if (!setupName.trim()) return;

    try {
      setLoading(true);
      setError("");

      const organization = await createOrganization(setupName.trim());

      localStorage.setItem("organizationId", organization.id);
      localStorage.setItem("organizationName", organization.name);

      setOrganizationId(String(organization.id));
      setOrganizationName(organization.name);
    } catch (err) {
      setError(
          err.response?.data?.error || "Could not create organization."
      );
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setForm(emptyProduct);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      sku: product.sku,
      description: product.description || "",
      quantity: product.quantity,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      lowStockThreshold: product.lowStockThreshold,
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      quantity: Number(form.quantity),
      costPrice: Number(form.costPrice),
      sellingPrice: Number(form.sellingPrice),
      lowStockThreshold: Number(form.lowStockThreshold),
    };

    try {
      setError("");

      if (editingProduct) {
        await updateProduct(
            organizationId,
            editingProduct.id,
            payload
        );
      } else {
        await createProduct(organizationId, payload);
      }

      setShowForm(false);
      setEditingProduct(null);
      setForm(emptyProduct);
      await loadData();
    } catch (err) {
      setError(
          err.response?.data?.error || "Unable to save product."
      );
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await deleteProduct(organizationId, productId);
      await loadData();
    } catch (err) {
      setError(
          err.response?.data?.error || "Unable to delete product."
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("organizationId");
    localStorage.removeItem("organizationName");
    setOrganizationId(null);
    setOrganizationName("");
    setProducts([]);
  };

  const filteredProducts = products.filter((product) =>
      `${product.name} ${product.sku}`
          .toLowerCase()
          .includes(search.toLowerCase())
  );

  if (!organizationId) {
    return (
        <div className="setup-page">
          <form className="setup-card" onSubmit={handleOrganizationSetup}>
            <div className="brand-icon">
              <Boxes size={30} />
            </div>
            <h1>Welcome to StockFlow</h1>
            <p>Create your organization to start managing inventory.</p>

            <label>Organization name</label>
            <input
                value={setupName}
                onChange={(e) => setSetupName(e.target.value)}
                placeholder="e.g. My Business"
                required
            />

            {error && <p className="error-message">{error}</p>}

            <button className="primary-button full-button" disabled={loading}>
              {loading ? "Creating..." : "Create organization"}
            </button>
          </form>
        </div>
    );
  }

  return (
      <div className="app-layout">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-icon">
              <Boxes size={24} />
            </div>
            <span>StockFlow</span>
          </div>

          <div className="nav-label">WORKSPACE</div>

          <button
              className={`nav-item ${page === "dashboard" ? "active" : ""}`}
              onClick={() => setPage("dashboard")}
          >
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          <button
              className={`nav-item ${page === "products" ? "active" : ""}`}
              onClick={() => setPage("products")}
          >
            <Package size={19} />
            Products
          </button>

          <div className="sidebar-bottom">
            <div className="organization-info">
              <div className="organization-avatar">
                {organizationName.charAt(0).toUpperCase()}
              </div>
              <div className="organization-text">
                <strong>{organizationName}</strong>
                <small>Organization</small>
              </div>
            </div>

            <button className="logout-button" onClick={handleLogout}>
              <LogOut size={17} /> Reset organization
            </button>
          </div>
        </aside>

        <main className="main-content">
          <header className="topbar">
            <div>
              <h2>{page === "dashboard" ? "Dashboard" : "Products"}</h2>
              <p>Welcome back to {organizationName}</p>
            </div>
            <button className="primary-button" onClick={openAddForm}>
              <Plus size={18} /> Add product
            </button>
          </header>

          {error && <div className="error-banner">{error}</div>}

          {page === "dashboard" ? (
              <>
                <section className="welcome-section">
                  <div>
                    <span className="eyebrow">INVENTORY OVERVIEW</span>
                    <h1>Manage your stock with confidence.</h1>
                    <p>Here's what's happening with your inventory today.</p>
                  </div>
                  <div className="welcome-art">
                    <Boxes size={70} strokeWidth={1.2} />
                  </div>
                </section>

                <section className="stats-grid">
                  <StatCard
                      icon={<Package />}
                      label="Total products"
                      value={summary.totalProducts}
                      description="Products in your inventory"
                  />
                  <StatCard
                      icon={<Boxes />}
                      label="Total quantity"
                      value={summary.totalQuantity}
                      description="Units currently in stock"
                  />
                  <StatCard
                      icon={<AlertTriangle />}
                      label="Low stock items"
                      value={summary.lowStockProducts}
                      description="Products at or below threshold"
                      warning
                  />
                </section>

                <section className="content-card">
                  <div className="section-heading">
                    <div>
                      <h3>Recent products</h3>
                      <p>Your latest inventory items</p>
                    </div>
                    <button
                        className="text-button"
                        onClick={() => setPage("products")}
                    >
                      View all
                    </button>
                  </div>

                  <ProductTable
                      products={products.slice(0, 5)}
                      onEdit={openEditForm}
                      onDelete={handleDelete}
                      loading={loading}
                  />
                </section>
              </>
          ) : (
              <section className="content-card products-card">
                <div className="section-heading">
                  <div>
                    <h3>All products</h3>
                    <p>Manage your inventory items and stock levels.</p>
                  </div>
                  <div className="search-box">
                    <Search size={17} />
                    <input
                        placeholder="Search name or SKU..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                <ProductTable
                    products={filteredProducts}
                    onEdit={openEditForm}
                    onDelete={handleDelete}
                    loading={loading}
                />
              </section>
          )}
        </main>

        {showForm && (
            <div className="modal-overlay">
              <form className="product-modal" onSubmit={handleFormSubmit}>
                <div className="modal-heading">
                  <div>
                    <h2>{editingProduct ? "Edit product" : "Add product"}</h2>
                    <p>Enter the product information below.</p>
                  </div>
                  <button
                      type="button"
                      className="icon-button"
                      onClick={() => setShowForm(false)}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="form-grid">
                  <div className="form-field">
                    <label>Product name *</label>
                    <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />
                  </div>

                  <div className="form-field">
                    <label>SKU *</label>
                    <input
                        value={form.sku}
                        onChange={(e) => setForm({ ...form, sku: e.target.value })}
                        required
                    />
                  </div>

                  <div className="form-field full-field">
                    <label>Description</label>
                    <textarea
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                    />
                  </div>

                  <div className="form-field">
                    <label>Quantity *</label>
                    <input
                        type="number"
                        min="0"
                        value={form.quantity}
                        onChange={(e) =>
                            setForm({ ...form, quantity: e.target.value })
                        }
                        required
                    />
                  </div>

                  <div className="form-field">
                    <label>Low stock threshold *</label>
                    <input
                        type="number"
                        min="0"
                        value={form.lowStockThreshold}
                        onChange={(e) =>
                            setForm({ ...form, lowStockThreshold: e.target.value })
                        }
                        required
                    />
                  </div>

                  <div className="form-field">
                    <label>Cost price *</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.costPrice}
                        onChange={(e) =>
                            setForm({ ...form, costPrice: e.target.value })
                        }
                        required
                    />
                  </div>

                  <div className="form-field">
                    <label>Selling price *</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.sellingPrice}
                        onChange={(e) =>
                            setForm({ ...form, sellingPrice: e.target.value })
                        }
                        required
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                      type="button"
                      className="secondary-button"
                      onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button className="primary-button">
                    {editingProduct ? "Save changes" : "Create product"}
                  </button>
                </div>
              </form>
            </div>
        )}
      </div>
  );
}

function StatCard({ icon, label, value, description, warning }) {
  return (
      <div className="stat-card">
        <div className={`stat-icon ${warning ? "warning" : ""}`}>{icon}</div>
        <p>{label}</p>
        <h2>{value ?? 0}</h2>
        <small>{description}</small>
      </div>
  );
}

function ProductTable({ products, onEdit, onDelete, loading }) {
  if (loading) return <p className="empty-state">Loading products...</p>;

  if (products.length === 0) {
    return (
        <div className="empty-state">
          <Package size={35} />
          <h3>No products found</h3>
          <p>Add your first product to get started.</p>
        </div>
    );
  }

  return (
      <div className="table-wrapper">
        <table>
          <thead>
          <tr>
            <th>PRODUCT</th>
            <th>SKU</th>
            <th>QUANTITY</th>
            <th>SELLING PRICE</th>
            <th>STOCK STATUS</th>
            <th>ACTIONS</th>
          </tr>
          </thead>
          <tbody>
          {products.map((product) => {
            const lowStock =
                product.quantity <= product.lowStockThreshold;

            return (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong>
                    <small className="product-description">
                      {product.description || "No description"}
                    </small>
                  </td>
                  <td>{product.sku}</td>
                  <td>{product.quantity}</td>
                  <td>₹{Number(product.sellingPrice).toFixed(2)}</td>
                  <td>
                  <span className={`status ${lowStock ? "low" : "in-stock"}`}>
                    {lowStock ? "Low stock" : "In stock"}
                  </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                          className="icon-button"
                          title="Edit"
                          onClick={() => onEdit(product)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                          className="icon-button delete-button"
                          title="Delete"
                          onClick={() => onDelete(product.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
            );
          })}
          </tbody>
        </table>
      </div>
  );
}

export default App;
