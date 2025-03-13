import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertProductSchema, 
  insertSaleSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // User routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });
  
  app.post("/api/users", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const user = await storage.createUser(data);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid user data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating user" });
      }
    }
  });
  
  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products" });
    }
  });
  
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error fetching product" });
    }
  });
  
  app.post("/api/products", async (req, res) => {
    try {
      const data = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(data);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid product data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating product" });
      }
    }
  });
  
  app.patch("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      
      // Partial validation
      Object.keys(data).forEach(key => {
        if (!Object.keys(insertProductSchema.shape).includes(key)) {
          delete data[key];
        }
      });
      
      const updatedProduct = await storage.updateProduct(id, data);
      
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: "Error updating product" });
    }
  });
  
  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting product" });
    }
  });
  
  // Sales routes
  app.get("/api/sales", async (req, res) => {
    try {
      const sales = await storage.getSales();
      res.json(sales);
    } catch (error) {
      res.status(500).json({ message: "Error fetching sales" });
    }
  });
  
  app.post("/api/sales", async (req, res) => {
    try {
      const data = insertSaleSchema.parse(req.body);
      
      // Check if product exists and has enough stock
      const product = await storage.getProduct(data.productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      if (product.stock < data.quantity) {
        return res.status(400).json({ message: "Not enough stock" });
      }
      
      const sale = await storage.createSale(data);
      res.status(201).json(sale);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid sale data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating sale" });
      }
    }
  });
  
  // Reports routes
  app.get("/api/reports/low-stock", async (req, res) => {
    try {
      const threshold = parseInt(req.query.threshold as string) || 5;
      const products = await storage.getLowStockProducts(threshold);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching low stock products" });
    }
  });
  
  app.get("/api/reports/sales", async (req, res) => {
    try {
      const totalSales = await storage.getTotalSales();
      res.json({ totalSales });
    } catch (error) {
      res.status(500).json({ message: "Error calculating total sales" });
    }
  });
  
  app.get("/api/reports/profit", async (req, res) => {
    try {
      const totalProfit = await storage.getTotalProfit();
      res.json({ totalProfit });
    } catch (error) {
      res.status(500).json({ message: "Error calculating total profit" });
    }
  });
  
  app.get("/api/reports/dashboard", async (req, res) => {
    try {
      const [products, sales, totalSales, totalProfit, lowStockProducts] = await Promise.all([
        storage.getProducts(),
        storage.getSales(),
        storage.getTotalSales(),
        storage.getTotalProfit(),
        storage.getLowStockProducts(5)
      ]);
      
      // Calculate inventory value
      const inventoryValue = products.reduce((sum, product) => {
        return sum + (Number(product.cost) * product.stock);
      }, 0);
      
      res.json({
        totalSales,
        inventoryValue,
        totalProfit,
        lowStockCount: lowStockProducts.length,
        recentSales: sales.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 5),
        lowStockProducts: lowStockProducts
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching dashboard data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
