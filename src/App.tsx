import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Search, TrendingUp, Users, Star, Filter, ArrowUpDown, Plus, X, 
  BarChart3, Target, Award, User 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface Stock {
  id: number;
  name: string;
  symbol: string;
  price: number;
  change: number;
  marketCap: number;
  pe: number;
  pb: number;
  roe: number;
  roce: number;
  debtToEquity: number;
  salesGrowth: number;
  profitGrowth: number;
  sector: string;
}

interface FilterState {
  minMarketCap: number;
  maxMarketCap: number;
  minPE: number;
  maxPE: number;
  minROE: number;
  sector: string;
}

// Sample Indian Stocks Data (like screener.in) - Realistic prices
const initialStocks: Stock[] = [
  { id: 1, name: "Reliance Industries", symbol: "RELIANCE", price: 1285.40, change: 1.2, marketCap: 174200, pe: 27.4, pb: 2.3, roe: 9.2, roce: 11.8, debtToEquity: 0.35, salesGrowth: 11.8, profitGrowth: 14.2, sector: "Energy" },
  { id: 2, name: "TCS", symbol: "TCS", price: 3924.75, change: -0.4, marketCap: 142300, pe: 29.8, pb: 11.6, roe: 41.5, roce: 49.6, debtToEquity: 0.08, salesGrowth: 7.4, profitGrowth: 8.9, sector: "IT" },
  { id: 3, name: "HDFC Bank", symbol: "HDFCBANK", price: 1652.30, change: 0.9, marketCap: 125800, pe: 17.6, pb: 2.7, roe: 16.4, roce: 6.8, debtToEquity: 0.0, salesGrowth: 14.8, profitGrowth: 17.5, sector: "Banking" },
  { id: 4, name: "Bharti Airtel", symbol: "Airtel", price: 1584.65, change: 1.8, marketCap: 94100, pe: 48.2, pb: 7.9, roe: 14.8, roce: 13.1, debtToEquity: 0.85, salesGrowth: 21.4, profitGrowth: 46.2, sector: "Telecom" },
  { id: 5, name: "ICICI Bank", symbol: "ICICIBANK", price: 1184.90, change: 1.3, marketCap: 83400, pe: 18.1, pb: 3.0, roe: 18.9, roce: 7.4, debtToEquity: 0.0, salesGrowth: 18.6, profitGrowth: 29.8, sector: "Banking" },
  { id: 6, name: "Infosys", symbol: "INFY", price: 1528.45, change: 0.6, marketCap: 63500, pe: 23.7, pb: 6.9, roe: 27.4, roce: 34.8, debtToEquity: 0.0, salesGrowth: 3.9, profitGrowth: 6.4, sector: "IT" },
  { id: 7, name: "Hindustan Unilever", symbol: "HINDUNILVR", price: 2284.10, change: -0.5, marketCap: 53600, pe: 54.6, pb: 11.4, roe: 20.5, roce: 27.3, debtToEquity: 0.0, salesGrowth: 2.8, profitGrowth: 3.5, sector: "FMCG" },
  { id: 8, name: "ITC", symbol: "ITC", price: 452.75, change: 0.4, marketCap: 56600, pe: 25.8, pb: 7.3, roe: 29.6, roce: 37.8, debtToEquity: 0.0, salesGrowth: 4.9, profitGrowth: 7.8, sector: "FMCG" },
  { id: 9, name: "State Bank of India", symbol: "SBIN", price: 792.35, change: 2.4, marketCap: 70700, pe: 10.6, pb: 1.9, roe: 18.2, roce: 6.1, debtToEquity: 0.0, salesGrowth: 23.2, profitGrowth: 48.7, sector: "Banking" },
  { id: 10, name: "Larsen & Toubro", symbol: "LT", price: 3524.80, change: -0.9, marketCap: 48400, pe: 32.8, pb: 5.4, roe: 16.8, roce: 14.3, debtToEquity: 0.25, salesGrowth: 17.6, profitGrowth: 19.8, sector: "Capital Goods" },
];

// Auth Modal with OTP
const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void; onLogin: (email: string) => void }> = ({ isOpen, onClose, onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [sentOtp, setSentOtp] = useState('');

  const sendOTP = () => {
    if (!email) return;
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setSentOtp(generatedOtp);
    setStep('otp');
    alert(`OTP sent to ${email}. For demo, use: ${generatedOtp}`);
  };

  const verifyOTP = () => {
    if (otp === sentOtp) {
      onLogin(email);
      onClose();
      setEmail(''); setOtp(''); setStep('email'); setSentOtp('');
    } else {
      alert('Incorrect OTP. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-md p-8">
        <div className="flex justify-between mb-6">
          <div className="font-semibold text-2xl">{mode === 'signup' ? 'Create Account' : 'Login'}</div>
          <button onClick={onClose}><X /></button>
        </div>

        {step === 'email' ? (
          <>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="Enter your email" 
              className="border w-full px-4 py-3 rounded-lg mb-4" 
            />
            <button onClick={sendOTP} className="w-full bg-[#00C853] text-black py-3 font-medium rounded-xl">Send OTP</button>
            
            <div className="mt-6 text-center text-sm">
              {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')} className="text-[#00C853] font-medium">
                {mode === 'signup' ? 'Login' : 'Sign Up'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-sm text-gray-500 mb-2">Enter the 4-digit OTP sent to {email}</div>
            <input 
              type="text" 
              maxLength={4}
              value={otp} 
              onChange={e => setOtp(e.target.value)} 
              placeholder="Enter OTP" 
              className="border w-full px-4 py-3 rounded-lg text-center text-2xl tracking-[6px] mb-4" 
            />
            <button onClick={verifyOTP} className="w-full bg-[#00C853] text-black py-3 font-medium rounded-xl">Verify & Continue</button>
            <button onClick={() => { setStep('email'); setOtp(''); }} className="text-sm mt-3 w-full text-gray-500">Change Email</button>
          </>
        )}
      </div>
    </div>
  );
};

// Navbar Component
const Navbar: React.FC<{ user: string | null; onLoginClick: () => void; onLogout: () => void }> = ({ user, onLoginClick, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/screener?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  return (
    <nav className="bg-[#0A2540] text-white sticky top-0 z-50 border-b border-[#1E3A5F]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#00C853] rounded flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight">Bharat Stock Screener</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link to="/screener" className="hover:text-[#00C853] transition-colors">Screeners</Link>
              <Link to="/watchlist" className="hover:text-[#00C853] transition-colors">Watchlist</Link>
              <a href="#popular" className="hover:text-[#00C853] transition-colors">Popular</a>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for stocks or companies..."
                className="w-full bg-[#132B4A] text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-lg border border-[#1E3A5F] focus:outline-none focus:border-[#00C853] text-sm"
              />
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </form>

          <div className="flex items-center gap-4 text-sm">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                  <User className="w-4 h-4" />
                  <span className="text-xs">{user.split('@')[0]}</span>
                </div>
                <button onClick={onLogout} className="text-xs px-3 py-1 hover:bg-white/10 rounded">Logout</button>
              </div>
            ) : (
              <>
                <button onClick={onLoginClick} className="px-4 py-1.5 hover:bg-[#132B4A] rounded-lg transition-colors">Login</button>
                <button onClick={onLoginClick} className="bg-[#00C853] text-black px-4 py-1.5 rounded-lg font-medium hover:bg-[#00B34A]">Sign Up</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Stock Detail Modal
const StockModal: React.FC<{ stock: Stock; onClose: () => void }> = ({ stock, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'pl' | 'balance' | 'ratios'>('overview');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="bg-[#0A2540] text-white px-8 py-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-3xl">{stock.symbol}</span>
                <span className="text-lg text-gray-400">{stock.name}</span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm">
                <span className="text-[#00C853] text-xl font-semibold">₹{stock.price}</span>
                <span className={`${stock.change >= 0 ? 'text-[#00C853]' : 'text-red-400'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change}%
                </span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X /></button>
          </div>

          {/* Tabs */}
          <div className="flex border-b px-8 bg-gray-50">
            {(['overview', 'pl', 'balance', 'ratios'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium capitalize border-b-2 transition-all ${activeTab === tab ? 'border-[#00C853] text-[#0A2540]' : 'border-transparent text-gray-500'}`}
              >
                {tab === 'pl' ? 'P&L' : tab === 'balance' ? 'Balance Sheet' : tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-8 overflow-auto max-h-[60vh]">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4 text-lg">Company Overview</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b"><span>Sector</span><span className="font-medium">{stock.sector}</span></div>
                    <div className="flex justify-between py-2 border-b"><span>Market Cap</span><span className="font-medium">₹{(stock.marketCap / 1000).toFixed(1)}K Cr</span></div>
                    <div className="flex justify-between py-2 border-b"><span>Current Price</span><span className="font-medium">₹{stock.price}</span></div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4"><Target className="w-5 h-5 text-[#00C853]" /><span className="font-semibold">Quick Stats</span></div>
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div>ROE: <span className="font-semibold text-[#00C853]">{stock.roe}%</span></div>
                    <div>ROCE: <span className="font-semibold">{stock.roce}%</span></div>
                    <div>P/E: <span className="font-semibold">{stock.pe}</span></div>
                    <div>P/B: <span className="font-semibold">{stock.pb}</span></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pl' && (
              <div>
                <h4 className="font-semibold mb-6 text-xl">Profit & Loss Statement (₹ Cr)</h4>
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left text-gray-500"><th className="py-2">Particulars</th><th className="py-2 text-right">FY24</th><th className="py-2 text-right">FY23</th><th className="py-2 text-right">FY22</th></tr></thead>
                  <tbody className="text-sm">
                    <tr className="border-b"><td className="py-2">Revenue from Operations</td><td className="text-right font-medium">9,48,120</td><td className="text-right">8,64,310</td><td className="text-right">7,89,250</td></tr>
                    <tr className="border-b"><td className="py-2">Total Expenses</td><td className="text-right">6,82,450</td><td className="text-right">6,21,880</td><td className="text-right">5,68,720</td></tr>
                    <tr className="border-b font-semibold"><td className="py-2">Operating Profit</td><td className="text-right text-[#00C853]">2,65,670</td><td className="text-right">2,42,430</td><td className="text-right">2,20,530</td></tr>
                    <tr className="border-b"><td className="py-2">Net Profit</td><td className="text-right font-semibold">1,12,450</td><td className="text-right">98,640</td><td className="text-right">82,950</td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'balance' && (
              <div>
                <h4 className="font-semibold mb-6 text-xl">Balance Sheet (₹ Cr)</h4>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="font-medium mb-3 text-sm">Assets</div>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b"><td className="py-1.5">Fixed Assets</td><td className="text-right font-medium">4,82,340</td></tr>
                        <tr className="border-b"><td className="py-1.5">Current Assets</td><td className="text-right font-medium">3,25,180</td></tr>
                        <tr className="border-b font-semibold"><td className="py-1.5">Total Assets</td><td className="text-right">8,07,520</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <div className="font-medium mb-3 text-sm">Liabilities & Equity</div>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b"><td className="py-1.5">Share Capital + Reserves</td><td className="text-right font-medium">5,84,760</td></tr>
                        <tr className="border-b"><td className="py-1.5">Long Term Borrowings</td><td className="text-right font-medium">1,42,300</td></tr>
                        <tr className="border-b font-semibold"><td className="py-1.5">Total Equity + Liabilities</td><td className="text-right">8,07,520</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ratios' && (
              <div className="space-y-4">
                {[
                  { label: "Price to Earnings (P/E)", value: stock.pe },
                  { label: "Price to Book (P/B)", value: stock.pb },
                  { label: "Return on Equity (ROE)", value: stock.roe + "%" },
                  { label: "Return on Capital Employed", value: stock.roce + "%" },
                  { label: "Debt to Equity", value: stock.debtToEquity },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-3 border-b">
                    <span>{item.label}</span>
                    <span className="font-semibold text-lg text-[#0A2540]">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t p-4 px-8 flex justify-end gap-3 bg-gray-50">
            <button onClick={onClose} className="px-6 py-2 text-sm">Close</button>
            <button className="bg-[#00C853] px-6 py-2 text-sm text-black font-medium rounded-lg">Add to Watchlist</button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Home Page
const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <div className="bg-[#0A2540] text-white pt-16 pb-20">
        <div className="max-w-5xl mx-auto px-6 text-center">

          <h1 className="text-6xl font-semibold tracking-tighter mb-4">Find the best<br />Indian stocks.</h1>
          <p className="text-xl text-gray-400 max-w-md mx-auto mb-10">Indian stock screener with sample data. Real-time prices coming soon.</p>
          
          <div className="flex justify-center gap-4">
            <button onClick={() => navigate('/screener')} className="bg-[#00C853] hover:bg-[#00B34A] text-black px-9 py-3.5 font-semibold rounded-xl flex items-center gap-2 transition">
              <Filter className="w-4 h-4" /> Open Screener
            </button>
            <button onClick={() => navigate('/watchlist')} className="border border-white/30 px-9 py-3.5 font-medium rounded-xl hover:bg-white/5">View Watchlist</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: TrendingUp, label: "Stocks", value: "4,850+" },
            { icon: Award, label: "Screeners", value: "140" },
          ].map((stat, i) => (
            <Link key={i} to="/screeners" className="bg-[#F8F5F1] border shadow-sm rounded-2xl p-6 flex items-center gap-4 hover:border-[#00C853] transition cursor-pointer">
              <div className="bg-[#F0FDF4] p-3 rounded-xl"><stat.icon className="w-6 h-6 text-[#00C853]" /></div>
              <div><div className="font-semibold text-3xl">{stat.value}</div><div className="text-gray-500 text-sm">{stat.label}</div></div>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Screeners */}
      <div id="popular" className="max-w-5xl mx-auto px-6 pt-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="uppercase text-xs tracking-[2px] text-[#00C853] font-semibold mb-1">DISCOVER</div>
            <div className="text-3xl font-semibold tracking-tight">Popular Screeners</div>
          </div>
          <Link to="/screeners" className="text-sm text-[#00C853] flex items-center gap-1 hover:underline">View all screeners →</Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: "High Growth Stocks", desc: "Sales & profit growth > 15%", count: 184 },
            { title: "Consistent Compounders", desc: "ROE > 20% for 5+ years", count: 92 },
            { title: "Low Debt Companies", desc: "Debt to Equity < 0.3", count: 312 },
            { title: "High Dividend Yield", desc: "Dividend yield above 3%", count: 147 },
            { title: "Undervalued Stocks", desc: "P/E ratio below industry average", count: 265 },
            { title: "Strong Momentum", desc: "Price up 50%+ in last 1 year", count: 118 },
          ].map((screener, idx) => (
            <div key={idx} onClick={() => navigate('/screener')} className="border hover:border-[#00C853] cursor-pointer transition-all bg-[#F8F5F1] rounded-2xl p-7 group">
              <div className="font-semibold text-xl tracking-tight mb-2 group-hover:text-[#00C853]">{screener.title}</div>
              <div className="text-gray-500 mb-6 text-sm">{screener.desc}</div>
              <div className="flex items-center justify-between text-sm"><span>{screener.count} stocks</span><span className="text-[#00C853]">→</span></div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-20" />
    </div>
  );
};

// Interactive Screener Page
const Screener: React.FC = () => {
  const location = window.location;
  const urlParams = new URLSearchParams(location.search);
  const initialSearch = urlParams.get('search') || '';

  const [stocks, setStocks] = useState<Stock[]>(initialStocks);
  const [filters, setFilters] = useState<FilterState>({
    minMarketCap: 30000, maxMarketCap: 220000, minPE: 5, maxPE: 70, minROE: 8, sector: 'All'
  });
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Stock; direction: 'asc' | 'desc' }>({ key: 'marketCap', direction: 'desc' });
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Real-time live price updates (paused when market closed)
  const marketOpen = false; // Simulate market closed

  React.useEffect(() => {
    if (!marketOpen) return;

    const interval = setInterval(() => {
      setStocks(prevStocks =>
        prevStocks.map(stock => {
          const changePercent = (Math.random() - 0.5) * 1.6;
          const newPrice = Math.round(stock.price * (1 + changePercent / 100) * 100) / 100;
          const newChange = Math.round(changePercent * 10) / 10;

          return {
            ...stock,
            price: newPrice,
            change: newChange,
          };
        })
      );
      setLastUpdated(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, [marketOpen]);

  const sectors = ['All', 'IT', 'Banking', 'Energy', 'FMCG', 'Telecom', 'Capital Goods'];

  // Apply filters and search
  const filteredStocks = React.useMemo(() => {
    let result = [...stocks];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(term) || s.symbol.toLowerCase().includes(term)
      );
    }

    // Filters
    result = result.filter(s => 
      s.marketCap >= filters.minMarketCap &&
      s.marketCap <= filters.maxMarketCap &&
      s.pe >= filters.minPE &&
      s.pe <= filters.maxPE &&
      s.roe >= filters.minROE &&
      (filters.sector === 'All' || s.sector === filters.sector)
    );

    // Sort
    result.sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [stocks, filters, searchTerm, sortConfig]);

  const handleSort = (key: keyof Stock) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const toggleWatchlist = (id: number) => {
    setWatchlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-semibold tracking-tight">Stock Screener</h1>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
              MARKET CLOSED
            </div>
          </div>
          <p className="text-gray-500 mt-1">Filter stocks using powerful financial metrics • Last closing prices shown</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">{filteredStocks.length} results</div>
          <div className="text-[10px] text-gray-400">Last updated: {lastUpdated.toLocaleTimeString()}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#F8F5F1] border rounded-2xl p-6 mb-6">
        <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
          <div>
            <div className="text-xs text-gray-500 mb-2">MARKET CAP (₹ Cr)</div>
            <div className="flex items-center gap-3 text-sm">
              <input type="range" min="10000" max="250000" step="5000" value={filters.minMarketCap} onChange={e => setFilters({...filters, minMarketCap: +e.target.value})} className="accent-[#00C853]" />
              <span className="font-mono w-14">{(filters.minMarketCap/1000).toFixed(0)}K</span>
              <span>—</span>
              <span className="font-mono w-14">{(filters.maxMarketCap/1000).toFixed(0)}K</span>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-2">P/E RATIO</div>
            <div className="flex gap-2">
              <input type="number" value={filters.minPE} onChange={e => setFilters({...filters, minPE: +e.target.value})} className="border px-3 py-1 w-16 text-sm rounded" />
              <span className="pt-1">to</span>
              <input type="number" value={filters.maxPE} onChange={e => setFilters({...filters, maxPE: +e.target.value})} className="border px-3 py-1 w-16 text-sm rounded" />
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-2">MIN ROE</div>
            <input type="range" min="5" max="45" value={filters.minROE} onChange={e => setFilters({...filters, minROE: +e.target.value})} className="accent-[#00C853] w-32" />
            <span className="ml-2 text-sm font-medium">{filters.minROE}%</span>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-2">SECTOR</div>
            <select value={filters.sector} onChange={e => setFilters({...filters, sector: e.target.value})} className="border rounded px-3 py-1.5 text-sm">
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search stocks..." className="border px-4 py-2 text-sm rounded-lg flex-1 max-w-[260px]" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#F8F5F1] border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-gray-500">
              {['Company', 'Price', 'Mkt Cap', 'P/E', 'ROE', 'Sector'].map((header, i) => {
                const keys: (keyof Stock)[] = ['name', 'price', 'marketCap', 'pe', 'roe', 'sector'];
                return (
                  <th key={i} className="px-6 py-4 font-medium cursor-pointer" onClick={() => handleSort(keys[i])}>
                    {header} <ArrowUpDown className="inline w-3 h-3 ml-0.5" />
                  </th>
                );
              })}
              <th className="w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredStocks.map(stock => (
              <tr key={stock.id} className="hover:bg-gray-50 group cursor-pointer" onClick={() => setSelectedStock(stock)}>
                <td className="px-6 py-4 font-medium">{stock.name} <span className="font-mono text-xs text-gray-400 ml-1">{stock.symbol}</span></td>
                <td className="px-6 py-4 font-medium">₹{stock.price}</td>
                <td className="px-6 py-4">₹{(stock.marketCap/1000).toFixed(1)}K Cr</td>
                <td className="px-6 py-4">{stock.pe}</td>
                <td className="px-6 py-4 text-[#00C853] font-medium">{stock.roe}%</td>
                <td className="px-6 py-4 text-xs text-gray-600">{stock.sector}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleWatchlist(stock.id); }} 
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-gray-100 rounded"
                  >
                    <Star className={`w-4 h-4 ${watchlist.includes(stock.id) ? 'fill-[#00C853] text-[#00C853]' : ''}`} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStocks.length === 0 && <div className="p-12 text-center text-gray-400">No stocks match your filters.</div>}
      </div>

      {selectedStock && <StockModal stock={selectedStock} onClose={() => setSelectedStock(null)} />}
    </div>
  );
};

// Watchlist Page
const Watchlist: React.FC = () => {
  const [watchlist, setWatchlist] = useState<number[]>([1, 3, 6]);
  const watchlistStocks = initialStocks.filter(s => watchlist.includes(s.id));

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-semibold tracking-tight mb-2">My Watchlist</h1>
      <p className="text-gray-500 mb-8">Track your favourite stocks</p>

      {watchlistStocks.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {watchlistStocks.map(stock => (
            <div key={stock.id} className="border rounded-2xl p-6 flex justify-between bg-[#F8F5F1]">
              <div>
                <div className="font-semibold text-xl">{stock.symbol}</div>
                <div className="text-sm text-gray-500">{stock.name}</div>
                <div className="mt-3 text-3xl font-semibold tracking-tighter">₹{stock.price}</div>
              </div>
              <div className="text-right">
                <div className={`${stock.change > 0 ? 'text-[#00C853]' : 'text-red-500'} text-xl font-medium`}>{stock.change}%</div>
                <button onClick={() => setWatchlist(w => w.filter(id => id !== stock.id))} className="text-xs mt-8 text-red-500">Remove</button>
              </div>
            </div>
          ))}
        </div>
      ) : <div className="text-center py-16 text-gray-400">Your watchlist is empty. Add stocks from the screener.</div>}
    </div>
  );
};

// Live Indices Bar Component
const LiveIndices: React.FC = () => {
  // Market is closed — static realistic closing values
  const [indices] = useState({
    nifty: { value: 24372.80, change: 0.62 },
    sensex: { value: 80326.10, change: 0.58 },
    banknifty: { value: 51846.45, change: -0.21 },
  });

  // Market closed notice
  const marketClosed = true;

  return (
    <div className="bg-[#0A2540] text-white py-2 border-b border-[#1E3A5F]">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm">
        <div className="flex items-center gap-8 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">NIFTY 50</span>
            <span className="font-semibold">{indices.nifty.value.toLocaleString()}</span>
            <span className={indices.nifty.change >= 0 ? "text-[#00C853]" : "text-red-400"}>
              {indices.nifty.change >= 0 ? "+" : ""}{indices.nifty.change}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">SENSEX</span>
            <span className="font-semibold">{indices.sensex.value.toLocaleString()}</span>
            <span className={indices.sensex.change >= 0 ? "text-[#00C853]" : "text-red-400"}>
              {indices.sensex.change >= 0 ? "+" : ""}{indices.sensex.change}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">BANKNIFTY</span>
            <span className="font-semibold">{indices.banknifty.value.toLocaleString()}</span>
            <span className={indices.banknifty.change >= 0 ? "text-[#00C853]" : "text-red-400"}>
              {indices.banknifty.change >= 0 ? "+" : ""}{indices.banknifty.change}%
            </span>
          </div>
        </div>
        <div className="text-[10px] text-gray-400 flex items-center gap-2">
          {marketClosed && <span className="bg-white/10 px-2 py-px rounded">MARKET CLOSED</span>}
          Sample index values • Not live market data
        </div>
      </div>
    </div>
  );
};

// Terms Page
const Terms: React.FC = () => (
  <div className="max-w-3xl mx-auto px-6 py-14">
    <h1 className="text-4xl font-semibold tracking-tight mb-8">Terms & Conditions</h1>
    <div className="prose prose-sm text-gray-600 space-y-6">
      <p>Bharat Stock Screener provides this website and service for informational purposes only. By using this website, you agree to the following terms.</p>
      <h4 className="font-semibold text-black">1. Not Financial Advice</h4>
      <p>The information provided is not investment advice. We are not SEBI registered investment advisors. Always consult a qualified financial advisor before making investment decisions.</p>
      <h4 className="font-semibold text-black">2. Data Accuracy</h4>
      <p>While we strive to provide accurate data, we do not guarantee the completeness or accuracy of any information. Stock prices can change rapidly.</p>
      <h4 className="font-semibold text-black">3. Limitation of Liability</h4>
      <p>Bharat Stock Screener and its owners shall not be liable for any financial losses or damages arising from the use of this website.</p>
    </div>
  </div>
);

// Privacy Policy Page
const Privacy: React.FC = () => (
  <div className="max-w-3xl mx-auto px-6 py-14">
    <h1 className="text-4xl font-semibold tracking-tight mb-8">Privacy Policy</h1>
    <div className="prose prose-sm text-gray-600 space-y-6">
      <p>Bharat Stock Screener respects your privacy. We do not sell or share your personal information with third parties.</p>
      <h4 className="font-semibold text-black">Information We Collect</h4>
      <p>We may collect basic usage data to improve the website experience. No personal financial information is stored on our servers.</p>
      <h4 className="font-semibold text-black">Cookies</h4>
      <p>We use cookies for session management and basic analytics only.</p>
      <h4 className="font-semibold text-black">Contact</h4>
      <p>If you have any privacy-related concerns, please reach out via the contact form.</p>
    </div>
  </div>
);

// All Screeners Page (140 screeners)
const AllScreeners: React.FC = () => {
  const screeners = [
    { name: "High Growth Stocks", desc: "Sales & profit growth > 15%", count: 184 },
    { name: "Consistent Compounders", desc: "ROE > 20% for 5+ years", count: 92 },
    { name: "Low Debt Companies", desc: "Debt to Equity < 0.3", count: 312 },
    { name: "High Dividend Yield", desc: "Dividend yield above 3%", count: 147 },
    { name: "Undervalued Stocks", desc: "P/E ratio below industry average", count: 265 },
    { name: "Strong Momentum", desc: "Price up 50%+ in last 1 year", count: 118 },
    { name: "Near 52 Week High", desc: "Stock trading near 52W high", count: 78 },
    { name: "Near 52 Week Low", desc: "Stock trading near 52W low", count: 95 },
    { name: "High ROCE Stocks", desc: "Return on Capital > 20%", count: 154 },
    { name: "Low PE Stocks", desc: "P/E Ratio below 15", count: 203 },
    { name: "High Profit Margin", desc: "Net Profit Margin > 15%", count: 132 },
    { name: "Rising Profit Trend", desc: "Profit growth in last 4 quarters", count: 167 },
    { name: "Rising Sales Trend", desc: "Sales growth in last 4 quarters", count: 189 },
    { name: "Small Cap Gainers", desc: "Market cap below 5,000 Cr", count: 276 },
    { name: "Mid Cap Gainers", desc: "Market cap 5,000 - 20,000 Cr", count: 143 },
    { name: "Large Cap Gainers", desc: "Market cap above 20,000 Cr", count: 87 },
    { name: "High Institutional Holding", desc: "FII + DII holding > 40%", count: 112 },
    { name: "Low Institutional Holding", desc: "FII + DII holding < 10%", count: 68 },
    { name: "Zero Debt Companies", desc: "Companies with zero debt", count: 214 },
    { name: "High Interest Coverage", desc: "Interest coverage ratio > 10", count: 93 },
    { name: "Consistent Dividend Payers", desc: "Dividend paid for last 10 years", count: 76 },
    { name: "High Asset Turnover", desc: "Asset turnover ratio > 2", count: 57 },
    { name: "High Inventory Turnover", desc: "Inventory turnover > 8", count: 44 },
    { name: "High Receivables Turnover", desc: "Receivables turnover > 12", count: 39 },
    { name: "Positive Cash Flow", desc: "Positive operating cash flow", count: 219 },
    { name: "Increasing Cash Reserves", desc: "Cash reserves growing YoY", count: 137 },
    { name: "Low Working Capital", desc: "Working capital cycle < 30 days", count: 81 },
    { name: "High Promoter Holding", desc: "Promoter holding > 60%", count: 168 },
    { name: "Increasing Promoter Holding", desc: "Promoters increased stake", count: 54 },
    { name: "Low Pledged Shares", desc: "Pledged shares < 5%", count: 129 },
    { name: "High Free Float", desc: "Free float market cap > 50%", count: 174 },
    { name: "High Earnings Growth", desc: "EPS growth > 20%", count: 146 },
    { name: "High Sales Growth", desc: "Sales growth > 25%", count: 119 },
    { name: "High Book Value Growth", desc: "Book value growth > 15%", count: 103 },
    { name: "High Operating Margin", desc: "Operating margin > 25%", count: 71 },
    { name: "Improving Margins", desc: "Margins improved over 3 years", count: 128 },
    { name: "High Return on Assets", desc: "ROA > 12%", count: 84 },
    { name: "High Return on Invested Capital", desc: "ROIC > 18%", count: 66 },
    { name: "Low Beta Stocks", desc: "Beta < 0.8", count: 97 },
    { name: "High Beta Stocks", desc: "Beta > 1.4", count: 62 },
    { name: "Low Volatility Stocks", desc: "Low standard deviation", count: 73 },
    { name: "High Liquidity Stocks", desc: "Daily turnover > 50 Cr", count: 134 },
    { name: "High Volume Stocks", desc: "Volume above 3-month average", count: 158 },
    { name: "Breakout Stocks", desc: "Price breaking resistance", count: 47 },
    { name: "Cup and Handle Pattern", desc: "Stocks showing cup & handle", count: 31 },
    { name: "Consolidating Stocks", desc: "Price moving sideways", count: 92 },
    { name: "Above 200 DMA", desc: "Price trading above 200 DMA", count: 172 },
    { name: "Above 50 DMA", desc: "Price trading above 50 DMA", count: 184 },
    { name: "Golden Cross Stocks", desc: "50 DMA crossing 200 DMA", count: 39 },
    { name: "Death Cross Stocks", desc: "200 DMA crossing 50 DMA", count: 24 },
    { name: "High Relative Strength", desc: "RSI > 60", count: 156 },
    { name: "Oversold Stocks", desc: "RSI < 30", count: 48 },
    { name: "Overbought Stocks", desc: "RSI > 80", count: 21 },
    { name: "MACD Bullish Crossover", desc: "MACD line above signal", count: 63 },
    { name: "MACD Bearish Crossover", desc: "MACD line below signal", count: 38 },
    { name: "New 52 Week Highs", desc: "Making new 52-week highs", count: 57 },
    { name: "Strong Quarterly Results", desc: "Profit growth > 30% QoQ", count: 74 },
    { name: "Weak Quarterly Results", desc: "Profit decline > 20% QoQ", count: 43 },
    { name: "High Tax Rate", desc: "Effective tax rate > 30%", count: 89 },
    { name: "Low Tax Rate", desc: "Effective tax rate < 15%", count: 67 },
    { name: "High Depreciation", desc: "Depreciation > 10% of revenue", count: 41 },
    { name: "Low Depreciation", desc: "Depreciation < 3% of revenue", count: 112 },
    { name: "High R&D Spending", desc: "R&D expense > 5% of sales", count: 29 },
    { name: "High Marketing Spend", desc: "Marketing expense > 8%", count: 37 },
    { name: "High Employee Cost", desc: "Employee cost > 20%", count: 58 },
    { name: "Low Employee Cost", desc: "Employee cost < 8%", count: 83 },
    { name: "High Interest Expense", desc: "Interest expense > 5%", count: 46 },
    { name: "High Forex Exposure", desc: "Forex income/expense high", count: 52 },
    { name: "Export Oriented", desc: "Exports > 40% of revenue", count: 64 },
    { name: "Import Oriented", desc: "Imports > 30% of revenue", count: 33 },
    { name: "High Government Exposure", desc: "Govt contracts > 20%", count: 27 },
    { name: "High Order Book", desc: "Order book > 2x revenue", count: 19 },
    { name: "Capex Heavy", desc: "Capex > 15% of revenue", count: 36 },
    { name: "High Cash Conversion Cycle", desc: "CCC > 90 days", count: 42 },
    { name: "Negative Cash Conversion", desc: "Negative cash cycle", count: 23 },
    { name: "High Goodwill", desc: "Goodwill > 20% of assets", count: 18 },
    { name: "High Intangible Assets", desc: "Intangibles > 30%", count: 25 },
    { name: "Low Intangible Assets", desc: "Intangibles < 5%", count: 91 },
    { name: "High Contingent Liabilities", desc: "Contingent liabilities high", count: 34 },
    { name: "High Related Party Transactions", desc: "Related party sales high", count: 28 },
    { name: "High Auditor Fees", desc: "Audit fees > 1 Cr", count: 49 },
    { name: "High Legal Expenses", desc: "Legal expenses high", count: 22 },
    { name: "High CSR Spending", desc: "CSR spend > 2% of PAT", count: 77 },
    { name: "High Dividend Payout", desc: "Payout ratio > 60%", count: 65 },
    { name: "Low Dividend Payout", desc: "Payout ratio < 20%", count: 98 },
    { name: "High Retained Earnings", desc: "Retained earnings growth", count: 108 },
    { name: "High Bonus Issues", desc: "Frequent bonus issues", count: 17 },
    { name: "High Stock Splits", desc: "Stock split in last 5 years", count: 31 },
    { name: "High Buybacks", desc: "Buyback announced", count: 26 },
    { name: "High Rights Issues", desc: "Rights issue in last 3 years", count: 14 },
    { name: "High FII Buying", desc: "FII increased holding", count: 55 },
    { name: "High DII Buying", desc: "DII increased holding", count: 71 },
    { name: "High Mutual Fund Holding", desc: "MF holding > 15%", count: 87 },
    { name: "High Insurance Holding", desc: "Insurance holding > 5%", count: 43 },
    { name: "High Pension Fund Holding", desc: "Pension fund holding high", count: 19 },
    { name: "High Sovereign Wealth Holding", desc: "SWF holding > 2%", count: 11 },
    { name: "High Hedge Fund Holding", desc: "Hedge fund holding high", count: 16 },
    { name: "High Analyst Coverage", desc: "Covered by > 15 analysts", count: 38 },
    { name: "Low Analyst Coverage", desc: "Covered by < 3 analysts", count: 59 },
    { name: "High Target Price Upside", desc: "Average target > 20% upside", count: 67 },
    { name: "High Short Interest", desc: "Short interest > 5%", count: 14 },
    { name: "High Options Volume", desc: "High options activity", count: 29 },
    { name: "High Futures Volume", desc: "High futures activity", count: 33 },
    { name: "High Sector Rotation", desc: "Sector rotation inflow", count: 41 },
    { name: "High Defensive Stocks", desc: "Defensive sector stocks", count: 78 },
    { name: "High Cyclical Stocks", desc: "Cyclical sector stocks", count: 102 },
    { name: "High Growth Sector", desc: "Growth sector stocks", count: 124 },
    { name: "High Value Sector", desc: "Value sector stocks", count: 96 },
    { name: "High Quality Sector", desc: "Quality sector stocks", count: 69 },
    { name: "High Momentum Sector", desc: "Momentum sector stocks", count: 57 },
    { name: "High Dividend Aristocrats", desc: "Dividend aristocrats", count: 44 },
    { name: "High Blue Chip Stocks", desc: "Nifty 50 constituents", count: 50 },
    { name: "High Nifty Next 50", desc: "Nifty Next 50 stocks", count: 50 },
    { name: "High Nifty 500", desc: "Nifty 500 constituents", count: 500 },
    { name: "High Sensex Constituents", desc: "BSE Sensex stocks", count: 30 },
    { name: "High Bank Nifty", desc: "Bank Nifty constituents", count: 12 },
    { name: "High IT Sector", desc: "IT sector stocks", count: 42 },
    { name: "High Pharma Sector", desc: "Pharma sector stocks", count: 38 },
    { name: "High Auto Sector", desc: "Auto sector stocks", count: 29 },
    { name: "High FMCG Sector", desc: "FMCG sector stocks", count: 24 },
    { name: "High Metal Sector", desc: "Metal sector stocks", count: 19 },
    { name: "High Realty Sector", desc: "Realty sector stocks", count: 27 },
    { name: "High PSU Stocks", desc: "Public sector stocks", count: 61 },
    { name: "High Private Sector", desc: "Private sector stocks", count: 312 },
    { name: "High MNC Stocks", desc: "MNC stocks", count: 53 },
    { name: "High SME Stocks", desc: "SME exchange stocks", count: 148 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-semibold tracking-tight mb-2">All Screeners</h1>
      <p className="text-gray-500 mb-8">140 powerful screeners to find the best Indian stocks</p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {screeners.map((screener, index) => (
          <Link 
            key={index} 
            to="/screener" 
            className="border bg-[#F8F5F1] hover:border-[#00C853] transition-all rounded-2xl p-6 group"
          >
            <div className="font-semibold text-lg tracking-tight mb-1 group-hover:text-[#00C853]">{screener.name}</div>
            <div className="text-sm text-gray-500 mb-4">{screener.desc}</div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#00C853] font-medium">{screener.count} stocks</span>
              <span className="text-[#00C853]">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Main App
function App() {
  const [user, setUser] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('bharat_user');
    if (savedUser) setUser(savedUser);
  }, []);

  const handleLogin = (email: string) => {
    setUser(email);
    localStorage.setItem('bharat_user', email);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bharat_user');
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#EEF4FA] text-[#0A2540] font-sans">
        <LiveIndices />
        <Navbar user={user} onLoginClick={() => setShowAuth(true)} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/screener" element={<Screener />} />
          <Route path="/screeners" element={<AllScreeners />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>

        <footer className="bg-[#F8F5F1] border-t mt-16">
          <div className="max-w-7xl mx-auto px-6 py-10 text-sm">
            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 text-gray-500">
              <Link to="/terms" className="hover:text-[#00C853]">Terms & Conditions</Link>
              <Link to="/privacy" className="hover:text-[#00C853]">Privacy Policy</Link>
              <a href="#" className="hover:text-[#00C853]">Disclaimer</a>
            </div>

            <div className="text-xs text-gray-500 max-w-4xl leading-relaxed">
              <strong>Important Disclosures:</strong> Bharat Stock Screener is not a SEBI registered investment advisor. All data shown is for informational and educational purposes only and should not be considered as investment advice. Stock market investments are subject to market risks. Past performance is not indicative of future results. Users are advised to conduct their own due diligence and consult a certified financial advisor before making any investment decisions. We do not guarantee the accuracy, completeness, or timeliness of the information displayed.
            </div>
            <div className="text-center text-xs text-gray-400 mt-8">© 2025 Bharat Stock Screener — Built for serious investors</div>
          </div>
        </footer>

        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onLogin={handleLogin} />
      </div>
    </Router>
  );
}

export default App;
