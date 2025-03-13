import { ProductTable } from '@/components/product-table';

export default function Inventory() {
  return (
    <div className="flex-1 p-4 md:p-6 overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <ProductTable />
      </div>
    </div>
  );
}
