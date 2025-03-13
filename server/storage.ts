import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  sales, type Sale, type InsertSale
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;
  
  // Product operations
  getProduct(id: number): Promise<Product | undefined>;
  getProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Sales operations
  getSale(id: number): Promise<Sale | undefined>;
  getSales(): Promise<Sale[]>;
  createSale(sale: InsertSale): Promise<Sale>;
  
  // Reports operations
  getTotalSales(): Promise<number>;
  getTotalProfit(): Promise<number>;
  getLowStockProducts(threshold: number): Promise<Product[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private sales: Map<number, Sale>;
  
  private userId: number;
  private productId: number;
  private saleId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.sales = new Map();
    
    this.userId = 1;
    this.productId = 1;
    this.saleId = 1;
    
    // Create default admin user
    const adminUser: User = {
      id: this.userId++,
      username: "admin",
      password: "admin",
      name: "Admin User",
      role: "admin"
    };
    
    this.users.set(adminUser.id, adminUser);
    
    // Add some sample products
    const sampleProducts: InsertProduct[] = [
      {
        name: "Cotton T-Shirt",
        sku: "TS-001",
        category: "Clothing",
        price: "19.99",
        cost: "10.00",
        stock: 42,
        description: "Comfortable cotton t-shirt"
      },
      {
        name: "Denim Jacket",
        sku: "DJ-002",
        category: "Clothing",
        price: "89.99",
        cost: "50.00",
        stock: 12,
        description: "Stylish denim jacket"
      },
      {
        name: "Running Shoes",
        sku: "RS-003",
        category: "Footwear",
        price: "129.95",
        cost: "80.00",
        stock: 3,
        description: "Performance running shoes"
      },
      {
        name: "Sunglasses",
        sku: "SG-004",
        category: "Accessories",
        price: "29.95",
        cost: "15.00",
        stock: 0,
        description: "Classic sunglasses"
      }
    ];
    
    sampleProducts.forEach(product => {
      const newProduct: Product = {
        ...product,
        id: this.productId++,
        createdAt: new Date()
      };
      this.products.set(newProduct.id, newProduct);
    });
    
    // Add some sample sales
    const sampleSales: InsertSale[] = [
      {
        productId: 1,
        quantity: 2,
        price: "19.99",
        total: "39.98"
      },
      {
        productId: 2,
        quantity: 1,
        price: "89.99",
        total: "89.99"
      },
      {
        productId: 3,
        quantity: 1,
        price: "129.95",
        total: "129.95"
      }
    ];
    
    sampleSales.forEach(sale => {
      const newSale: Sale = {
        ...sale,
        id: this.saleId++,
        createdAt: new Date()
      };
      this.sales.set(newSale.id, newSale);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const newProduct: Product = { 
      ...product, 
      id,
      createdAt: new Date()
    };
    this.products.set(id, newProduct);
    return newProduct;
  }
  
  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) return undefined;
    
    const updatedProduct: Product = { 
      ...existingProduct, 
      ...product 
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
  
  // Sales operations
  async getSale(id: number): Promise<Sale | undefined> {
    return this.sales.get(id);
  }
  
  async getSales(): Promise<Sale[]> {
    return Array.from(this.sales.values());
  }
  
  async createSale(sale: InsertSale): Promise<Sale> {
    const id = this.saleId++;
    const newSale: Sale = { 
      ...sale, 
      id,
      createdAt: new Date()
    };
    this.sales.set(id, newSale);
    
    // Update product stock
    const product = this.products.get(sale.productId);
    if (product) {
      product.stock -= sale.quantity;
      this.products.set(product.id, product);
    }
    
    return newSale;
  }
  
  // Reports operations
  async getTotalSales(): Promise<number> {
    return Array.from(this.sales.values())
      .reduce((total, sale) => total + Number(sale.total), 0);
  }
  
  async getTotalProfit(): Promise<number> {
    let profit = 0;
    for (const sale of this.sales.values()) {
      const product = this.products.get(sale.productId);
      if (product) {
        const saleProfit = Number(sale.total) - (Number(product.cost) * sale.quantity);
        profit += saleProfit;
      }
    }
    return profit;
  }
  
  async getLowStockProducts(threshold: number): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(product => product.stock <= threshold);
  }
}

export const storage = new MemStorage();
