import fs from "fs";

const stocks = [
  {
    symbol: "RELIANCE",
    companyName: "Reliance Industries",
    price: 1285.4,
    marketCap: 174200,
    pe: 27.4,
    pb: 2.1,
    roe: 9.2,
    roce: 8.5,
    debtToEquity: 0.4,
    salesGrowth: 12.8,
    profitGrowth: 10.5,
    dividendYield: 0.4,
    sector: "Energy"
  },
  {
    symbol: "TCS",
    companyName: "Tata Consultancy Services",
    price: 3924.75,
    marketCap: 142300,
    pe: 29.8,
    pb: 12.3,
    roe: 41.5,
    roce: 52.2,
    debtToEquity: 0,
    salesGrowth: 15.4,
    profitGrowth: 17.2,
    dividendYield: 1.5,
    sector: "IT"
  }
];

const output =
`export const initialStocks = ${JSON.stringify(stocks, null, 2)};`;

fs.writeFileSync("./src/stocksData.ts", output);

console.log("Stocks updated successfully");