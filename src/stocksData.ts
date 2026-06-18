export interface Stock {
  id: number;
  name: string;
  symbol: string;
  sector: string;
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
  dividendYield: number;
}

export const stocksData: Stock[] = [
  {
    id: 1,
    name: "Reliance Industries",
    symbol: "RELIANCE",
    sector: "Energy",
    price: 1285.4,
    change: 0,
    marketCap: 174200,
    pe: 27.4,
    pb: 2.3,
    roe: 9.2,
    roce: 11.8,
    debtToEquity: 0.35,
    salesGrowth: 11.8,
    profitGrowth: 14.2,
    dividendYield: 0.4,
  },
  {
    id: 2,
    name: "Tata Consultancy Services",
    symbol: "TCS",
    sector: "IT",
    price: 3924.75,
    change: 0,
    marketCap: 142300,
    pe: 29.8,
    pb: 11.6,
    roe: 41.5,
    roce: 49.6,
    debtToEquity: 0.08,
    salesGrowth: 7.4,
    profitGrowth: 8.9,
    dividendYield: 1.3,
  },
  {
    id: 3,
    name: "HDFC Bank",
    symbol: "HDFCBANK",
    sector: "Banking",
    price: 1652.3,
    change: 0,
    marketCap: 125800,
    pe: 17.6,
    pb: 2.7,
    roe: 16.4,
    roce: 6.8,
    debtToEquity: 0,
    salesGrowth: 14.8,
    profitGrowth: 17.5,
    dividendYield: 1.1,
  }
];