import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import POSTerminal from "./components/POSTerminal";
import ProductManagement from "./components/ProductManagement";
import Reports from "./components/Reports";
import BakongSettingsPanel from "./components/BakongSettings";
import BakongSimulator from "./components/BakongSimulator";
import { Product, Order, Customer, BakongSettings } from "./types";
import { DEFAULT_PRODUCTS, DEFAULT_CUSTOMERS, DEFAULT_BAKONG_SETTINGS } from "./data";

export default function App() {
  // 1. Initial local states (with localStorage hooks)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("lte_pos_products");
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("lte_pos_orders");
    if (saved) {
      return JSON.parse(saved);
    } else {
      // Setup some default realistic historical orders to pre-fill the AdminLTE graphs beautifully!
      const mockOrders: Order[] = [
        {
          id: "order-sys-1",
          invoiceNumber: "INV-551020-432",
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
          customer: DEFAULT_CUSTOMERS[1],
          items: [
            { productId: "prod-001", productName: "Classic Fish Amok (ត្រីអាម៉ុក)", sku: "FO-AMOK-01", quantity: 2, sellPrice: 5.50, discountPercent: 0 },
            { productId: "prod-003", productName: "Angkor Beer Can (ស្រាបៀរអង្គរ)", sku: "BE-ANGKOR-01", quantity: 4, sellPrice: 1.25, discountPercent: 0 }
          ],
          subtotal: 16.00,
          discountPercent: 0,
          discountAmount: 0,
          taxPercent: 10,
          taxAmount: 1.60,
          total: 17.60,
          totalKHR: 17.60 * 4100,
          paymentMethod: "Bakong_KHQR",
          amountPaid: 17.60,
          changeAmount: 0,
          bakongTxId: "BKNG-BLOCK-773091",
          status: "Completed"
        },
        {
          id: "order-sys-2",
          invoiceNumber: "INV-992081-120",
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          customer: DEFAULT_CUSTOMERS[2],
          items: [
            { productId: "prod-002", productName: "Beef Lok Lak (ឡុកឡាក់សាច់គោ)", sku: "FO-LOKLAK-02", quantity: 1, sellPrice: 6.00, discountPercent: 10 },
            { productId: "prod-004", productName: "Iced Coconut Latte (កាហ្វេដូង)", sku: "BE-COCOCOF-02", quantity: 1, sellPrice: 2.20, discountPercent: 0 }
          ],
          subtotal: 7.60,
          discountPercent: 5,
          discountAmount: 0.38,
          taxPercent: 10,
          taxAmount: 0.72,
          total: 7.94,
          totalKHR: 7.94 * 4100,
          paymentMethod: "Cash",
          amountPaid: 10.00,
          changeAmount: 2.06,
          status: "Completed"
        },
        {
          id: "order-sys-3",
          invoiceNumber: "INV-112028-552",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          customer: DEFAULT_CUSTOMERS[0],
          items: [
            { productId: "prod-005", productName: "Cambodian Jasmine Rice 5kg", sku: "GR-JASRICE-01", quantity: 1, sellPrice: 5.80, discountPercent: 0 },
            { productId: "prod-006", productName: "Battambang Oranges 1kg (ក្រូចពោធិ៍សាត់)", sku: "GR-BTBORG-02", quantity: 2, sellPrice: 2.50, discountPercent: 0 }
          ],
          subtotal: 10.85,
          discountPercent: 0,
          discountAmount: 0,
          taxPercent: 10,
          taxAmount: 1.08,
          total: 11.93,
          totalKHR: 11.93 * 4100,
          paymentMethod: "Bakong_KHQR",
          amountPaid: 11.93,
          changeAmount: 0,
          bakongTxId: "BKNG-BLOCK-120934",
          status: "Completed"
        },
        {
          id: "order-sys-4",
          invoiceNumber: "INV-663891-901",
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          customer: DEFAULT_CUSTOMERS[3],
          items: [
            { productId: "prod-001", productName: "Classic Fish Amok (ត្រីអាម៉ុក)", sku: "FO-AMOK-01", quantity: 3, sellPrice: 5.50, discountPercent: 0 },
            { productId: "prod-007", productName: "Fried Spring Rolls (ចៃយ៉រ)", sku: "FO-SPRING-03", quantity: 2, sellPrice: 2.50, discountPercent: 0 },
            { productId: "prod-008", productName: "Kambuja Lemongrass Tea", sku: "BE-LMTEA-03", quantity: 3, sellPrice: 1.50, discountPercent: 0 }
          ],
          subtotal: 26.00,
          discountPercent: 10,
          discountAmount: 2.60,
          taxPercent: 10,
          taxAmount: 2.34,
          total: 25.74,
          totalKHR: 25.74 * 4100,
          paymentMethod: "Bakong_KHQR",
          amountPaid: 25.74,
          changeAmount: 0,
          bakongTxId: "BKNG-BLOCK-502123",
          status: "Completed"
        }
      ];
      return mockOrders;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem("lte_pos_customers");
    return saved ? JSON.parse(saved) : DEFAULT_CUSTOMERS;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem("lte_pos_categories");
    return saved ? JSON.parse(saved) : ["Main Dishes", "Beverages", "Groceries", "Snacks"];
  });

  const [settings, setSettings] = useState<BakongSettings>(() => {
    const saved = localStorage.getItem("lte_pos_settings");
    return saved ? JSON.parse(saved) : DEFAULT_BAKONG_SETTINGS;
  });

  // Navigation and side drawer states
  const [currentView, setView] = useState<string>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [openSimulator, setOpenSimulator] = useState<boolean>(true); // Load opened so user notices scan capabilities immediately

  // Scanned checkout dynamic transaction pointer representing what we show in phone wallet scan
  const [activeCheckoutKHQR, setActiveCheckoutKHQR] = useState<{
    invoiceNo: string;
    amount: number;
    currency: "USD" | "KHR";
    qrStr: string;
  } | null>(null);

  // 2. Local persistence in background
  useEffect(() => {
    localStorage.setItem("lte_pos_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("lte_pos_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("lte_pos_customers", JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem("lte_pos_categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("lte_pos_settings", JSON.stringify(settings));
  }, [settings]);

  // 3. Callback handlers
  const handleAddNewOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleUpdateProductStock = (id: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
  };

  // Reset database callback
  const handleResetDatabase = () => {
    localStorage.removeItem("lte_pos_products");
    localStorage.removeItem("lte_pos_orders");
    localStorage.removeItem("lte_pos_customers");
    localStorage.removeItem("lte_pos_settings");
    localStorage.removeItem("lte_pos_categories");
    
    setProducts(DEFAULT_PRODUCTS);
    setCustomers(DEFAULT_CUSTOMERS);
    setSettings(DEFAULT_BAKONG_SETTINGS);
    setCategories(["Main Dishes", "Beverages", "Groceries", "Snacks"]);
    setOrders([]);
    setView("dashboard");
    setActiveCheckoutKHQR(null);
    setOpenSimulator(true);
    alert("Local database reset to standard Cambodia food catalog & sample order logs!");
  };

  // Callback simulation completed triggered from Customer Wallet Slide Confirmation
  const handleSimulateCheckoutSuccess = (method: "Cash" | "Bakong_KHQR", extTxId: string) => {
    // We search the invoice checkout from parent and perform submit order log
    // This connects the BakongSimulator to the active checkout panel inside POSTerminal!
    // Since we handle completion details cleanly. Let's emit an event that POSTerminal intercepts.
    // Create an elegant custom browser event so we don't have to duplicate logic!
    const successEvent = new CustomEvent("SIMULATE_BAKONG_PAID", {
      detail: { method, extTxId }
    });
    window.dispatchEvent(successEvent);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 select-none">
      
      {/* Sidebar navigation wrapper */}
      <Sidebar 
        currentView={currentView} 
        setView={setView} 
        collapsed={sidebarCollapsed} 
      />

      {/* Main Container Frame */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Navbar */}
        <Header 
          sidebarCollapsed={sidebarCollapsed} 
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
          settings={settings}
          setOpenSimulator={setOpenSimulator}
          onResetDatabase={handleResetDatabase}
        />

        {/* Dynamic content wrapper (AdminLTE theme layout style) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f4f6f9]">
          
          {currentView === "dashboard" && (
            <Dashboard 
              orders={orders} 
              products={products} 
              settings={settings} 
              setView={setView}
            />
          )}

          {currentView === "pos" && (
            <POSTerminal 
              products={products}
              customers={customers}
              setCustomers={setCustomers}
              settings={settings}
              addOrder={handleAddNewOrder}
              updateProductStock={handleUpdateProductStock}
              activeCheckoutKHQR={activeCheckoutKHQR}
              setActiveCheckoutKHQR={setActiveCheckoutKHQR}
              onSimulateCheckoutSuccess={() => {}}
              categories={categories}
            />
          )}

          {currentView === "inventory" && (
            <ProductManagement 
              products={products} 
              setProducts={setProducts} 
              categories={categories}
              setCategories={setCategories}
            />
          )}

          {currentView === "reports" && (
            <Reports 
              orders={orders} 
              setOrders={setOrders} 
              products={products} 
              setProducts={setProducts} 
              settings={settings}
            />
          )}

          {currentView === "settings" && (
            <BakongSettingsPanel 
              settings={settings} 
              setSettings={setSettings} 
              products={products}
              setProducts={setProducts}
              customers={customers}
              setCustomers={setCustomers}
              categories={categories}
              setCategories={setCategories}
              onResetDatabase={handleResetDatabase}
            />
          )}

        </main>

      </div>

      {/* FLOATING INTERACTIVE BAKONG APP PHONE SCANNER SIMULATOR */}
      <BakongSimulator 
        settings={settings}
        activeCheckoutKHQR={activeCheckoutKHQR}
        onConfirmPayment={handleSimulateCheckoutSuccess}
        isOpen={openSimulator}
        setIsOpen={setOpenSimulator}
      />

    </div>
  );
}
