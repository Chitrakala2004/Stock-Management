import { useState } from 'react';
import { StockProvider } from './context/StockContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';

// Pages
import Dashboard from './pages/Dashboard';
import StockManagement from './pages/StockManagement';
import CustomerAccounts from './pages/CustomerAccounts';
import AdvancePayments from './pages/AdvancePayments';
import PurchaseEntry from './pages/PurchaseEntry';
import PurchaseHistory from './pages/PurchaseHistory';
import Companies from './pages/Companies';

const pages = {
  Dashboard: Dashboard,
  'Stock Management': StockManagement,
  Products: StockManagement,
  'Customer Accounts': CustomerAccounts,
  Customers: CustomerAccounts,
  'Advance Payments': AdvancePayments,
  'Purchase Entry': PurchaseEntry,
  'Purchase History': PurchaseHistory,
  Transactions: PurchaseHistory,
  Companies: Companies,
};

function App() {
  const [activePage, setActivePage] = useState('Dashboard');

  const ActiveComponent = pages[activePage] || Dashboard;

  return (
    <StockProvider>
      <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar title={activePage} />
          <main className="flex-1 overflow-y-auto p-6">
            <ActiveComponent setActivePage={setActivePage} />
          </main>
        </div>
      </div>
    </StockProvider>
  );
}

export default App;
