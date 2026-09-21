import { useState } from 'react';
import { StockProvider } from './context/StockContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';

// Pages
import Customers from './pages/Customers';
import Companies from './pages/Companies';
import Products from './pages/Products';
import PurchaseEntry from './pages/PurchaseEntry';
import PurchaseHistory from './pages/PurchaseHistory';
import Dashboard from './pages/Dashboard';
import StockManagement from './pages/StockManagement';
import CustomerAccounts from './pages/CustomerAccounts';
import AdvancePayments from './pages/AdvancePayments';

const pagesMap = {
  Customers: Customers,
  'Customer Accounts': Customers,
  Company: Companies,
  Companies: Companies,
  Product: Products,
  Products: Products,
  'Stock Management': Products,
  Performo: PurchaseEntry,
  'Purchase Entry': PurchaseEntry,
  'All Performo': PurchaseHistory,
  'Purchase History': PurchaseHistory,
  Transactions: PurchaseHistory,
  Dashboard: Dashboard,
  'Advance Payments': AdvancePayments,
};

function App() {
  const [activePage, setActivePage] = useState(() => {
    try {
      return localStorage.getItem('stock_active_page') || 'Customers';
    } catch {
      return 'Customers';
    }
  });

  const handleSetActivePage = (page) => {
    try {
      localStorage.setItem('stock_active_page', page);
    } catch {}
    setActivePage(page);
  };

  const ActiveComponent = pagesMap[activePage] || Customers;

  return (
    <StockProvider>
      <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar activePage={activePage} setActivePage={handleSetActivePage} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopBar title={activePage} />
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <ActiveComponent setActivePage={handleSetActivePage} />
          </main>
        </div>
      </div>
    </StockProvider>
  );
}

export default App;
