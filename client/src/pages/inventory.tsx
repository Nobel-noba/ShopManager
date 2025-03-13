import { useState } from 'react';
import { ProductTable } from '@/components/product-table';
import { AddCategoryModal } from '@/components/add-category-modal';
import { Button } from '@/components/ui/button';
import { FolderPlus, ListPlus } from 'lucide-react';

export default function Inventory() {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  return (
    <div className="flex-1 p-4 md:p-6 overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <div className="flex flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex items-center gap-2"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Add Category</span>
            </Button>
          </div>
        </div>
        
        <ProductTable />
        
        <AddCategoryModal 
          isOpen={isCategoryModalOpen} 
          onClose={() => setIsCategoryModalOpen(false)} 
        />
      </div>
    </div>
  );
}
