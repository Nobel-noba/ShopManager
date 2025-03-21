import { useState } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [lowStockThreshold, setLowStockThreshold] = useState("5");
  const [receiptPrefix, setReceiptPrefix] = useState("INV-");
  const [showProfitInReports, setShowProfitInReports] = useState(true);
  const [defaultCategory, setDefaultCategory] = useState("Clothing");
  const [currencyFormat, setCurrencyFormat] = useState("USD");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [exportType, setExportType] = useState("inventory");
  const [dateRange, setDateRange] = useState("all");
  
  const handleSaveGeneralSettings = () => {
    // In a real app, this would save to a database
    toast({
      title: "Settings saved",
      description: "Your general settings have been updated",
    });
  };
  
  const handleSaveDisplaySettings = () => {
    // In a real app, this would save to a database
    toast({
      title: "Settings saved",
      description: "Your display settings have been updated",
    });
  };

  const handleExportData = () => {
    // In a real app, this would call an API to generate and download the spreadsheet
    toast({
      title: "Export Started",
      description: `Exporting ${exportType} data${exportType === 'sales' ? ` for ${dateRange}` : ''}`
    });
  };
  
  return (
    <div className="flex-1 p-4 md:p-6 overflow-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">System Settings</h2>
        
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General Settings</TabsTrigger>
            <TabsTrigger value="display">Display Settings</TabsTrigger>
            <TabsTrigger value="backup">Backup & Data</TabsTrigger>
          </TabsList>
          
          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Manage basic shop configuration and business preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shopName">Shop Name</Label>
                      <Input id="shopName" defaultValue="My Awesome Shop" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input id="contactEmail" type="email" defaultValue="contact@myshop.com" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                      <Input 
                        id="lowStockThreshold" 
                        type="number" 
                        value={lowStockThreshold}
                        onChange={(e) => setLowStockThreshold(e.target.value)}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">Items with stock below this value will be marked as low stock</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="receiptPrefix">Receipt Prefix</Label>
                      <Input 
                        id="receiptPrefix" 
                        value={receiptPrefix}
                        onChange={(e) => setReceiptPrefix(e.target.value)}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">Prefix for invoice numbers (e.g. INV-001)</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showProfit">Show Profit in Reports</Label>
                      <Switch 
                        id="showProfit" 
                        checked={showProfitInReports}
                        onCheckedChange={setShowProfitInReports}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Display profit information in financial reports</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium">Default Values</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="defaultCategory">Default Category</Label>
                      <Select 
                        value={defaultCategory} 
                        onValueChange={setDefaultCategory}
                      >
                        <SelectTrigger id="defaultCategory">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Clothing">Clothing</SelectItem>
                          <SelectItem value="Footwear">Footwear</SelectItem>
                          <SelectItem value="Accessories">Accessories</SelectItem>
                          <SelectItem value="Electronics">Electronics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="defaultTax">Default Tax Rate (%)</Label>
                      <Input id="defaultTax" type="number" step="0.01" defaultValue="7.5" />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveGeneralSettings}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Display Settings */}
          <TabsContent value="display">
            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
                <CardDescription>
                  Customize how information is displayed in the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currencyFormat">Currency Format</Label>
                      <Select 
                        value={currencyFormat} 
                        onValueChange={setCurrencyFormat}
                      >
                        <SelectTrigger id="currencyFormat">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="JPY">JPY (¥)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select 
                        value={dateFormat} 
                        onValueChange={setDateFormat}
                      >
                        <SelectTrigger id="dateFormat">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="darkMode">Dark Mode</Label>
                      <Switch id="darkMode" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Use dark theme for the application</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="compactMode">Compact Mode</Label>
                      <Switch id="compactMode" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Reduce spacing and show more content per screen</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium">Table Display</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="itemsPerPage">Items Per Page</Label>
                      <Select defaultValue="10">
                        <SelectTrigger id="itemsPerPage">
                          <SelectValue placeholder="Select number" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 items</SelectItem>
                          <SelectItem value="10">10 items</SelectItem>
                          <SelectItem value="20">20 items</SelectItem>
                          <SelectItem value="50">50 items</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveDisplaySettings}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Backup & Data */}
          <TabsContent value="backup">
            <Card>
              <CardHeader>
                <CardTitle>Backup & Data Management</CardTitle>
                <CardDescription>
                  Manage your shop data and backups
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium mb-2">Current Data</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Products</p>
                        <p className="font-medium">4 items</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Sales Records</p>
                        <p className="font-medium">3 records</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Users</p>
                        <p className="font-medium">1 user</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Last Backup</p>
                        <p className="font-medium">Never</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Create Backup</h3>
                    <p className="text-sm text-gray-500">Create a backup of all your shop data</p>
                    <Button className="mt-2" onClick={handleExportData}>
                      Export Data Backup
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Import Data</h3>
                    <p className="text-sm text-gray-500">Import data from a backup file</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Input id="importFile" type="file" />
                      <Button variant="outline">Import</Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-red-600">Danger Zone</h3>
                    <p className="text-sm text-gray-500">These actions are destructive and cannot be reversed</p>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                        Reset All Data
                      </Button>
                      <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                        Delete All Sales Records
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
