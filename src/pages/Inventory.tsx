import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  AlertCircle, 
  Edit, 
  Trash, 
  Download,
  BarChart3,
  ArrowUpDown
} from 'lucide-react';
import { exportToCSV} from '../utils/export';
import { InventoryItem } from '../types';
import { Link } from 'react-router-dom';

// Mock inventory data
const mockInventory: InventoryItem[] = Array.from({ length: 20 }, (_, i) => {
  const id = `item-${i + 1}`;
  
  // Different item types based on index ranges
  let category: InventoryItem['category'] = 'medicine';
  let name = '';
  let unit = '';
  
  if (i < 10) {
    category = 'medicine';
    
    // Mock medicines
    const medicines = [
      'Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Lisinopril', 
      'Metformin', 'Atorvastatin', 'Salbutamol', 'Omeprazole', 
      'Fluoxetine', 'Doxycycline'
    ];
    
    name = medicines[i % medicines.length];
    unit = 'tablet';
  } else if (i < 15) {
    category = 'equipment';
    
    // Mock equipment
    const equipment = [
      'Blood Pressure Monitor', 'Pulse Oximeter', 'Stethoscope', 
      'Thermometer', 'Defibrillator'
    ];
    
    name = equipment[i % equipment.length];
    unit = 'unit';
  } else {
    category = 'supplies';
    
    // Mock supplies
    const supplies = [
      'Surgical Gloves', 'Face Masks', 'Syringes', 
      'Bandages', 'IV Solutions'
    ];
    
    name = supplies[i % supplies.length];
    unit = i % supplies.length < 3 ? 'box' : 'pack';
  }
  
  // Random quantity between 10 and 200
  const quantity = Math.floor(Math.random() * 190) + 10;
  
  // Random reorder level between 20 and 50
  const reorderLevel = Math.floor(Math.random() * 30) + 20;
  
  // Random cost between $1 and $100
  const cost = parseFloat((Math.random() * 99 + 1).toFixed(2));
  
  // Random supplier
  const suppliers = ['MediSupply Inc.', 'HealthTech Solutions', 'Global Pharma', 'MedEquip Co.', 'Healthcare Goods'];
  const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
  
  // Random expiry date for medicines (1-3 years from now)
  let expiryDate: string | undefined;
  if (category === 'medicine') {
    const date = new Date();
    date.setFullYear(date.getFullYear() + Math.floor(Math.random() * 3) + 1);
    expiryDate = date.toISOString().split('T')[0];
  }
  
  // Random storage location
  const locations = ['Main Storage', 'Pharmacy', 'ER Stock', 'OR Storage', 'Ward Supply'];
  const location = locations[Math.floor(Math.random() * locations.length)];
  
  // Random dates for created/updated
  const createdAt = new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString();
  const updatedAt = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString();
  
  return {
    id,
    name,
    category,
    description: `Standard ${name.toLowerCase()} for ${category === 'medicine' ? 'patient treatment' : category === 'equipment' ? 'medical procedures' : 'medical use'}`,
    unit,
    quantity,
    reorderLevel,
    cost,
    supplier,
    expiryDate,
    location,
    createdAt,
    updatedAt
  };
});

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showLowStock, setShowLowStock] = useState(false);

  useEffect(() => {
    // Simulate API call
    const fetchInventory = async () => {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInventory(mockInventory);
      setIsLoading(false);
    };

    fetchInventory();
  }, []);

  // Filter inventory based on search term and filters
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesLowStock = showLowStock ? item.quantity <= item.reorderLevel : true;
    
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  // Sort inventory
  const sortedInventory = [...filteredInventory].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'quantity') {
      comparison = a.quantity - b.quantity;
    } else if (sortField === 'cost') {
      comparison = a.cost - b.cost;
    } else if (sortField === 'expiryDate') {
      const dateA = a.expiryDate ? new Date(a.expiryDate).getTime() : 0;
      const dateB = b.expiryDate ? new Date(b.expiryDate).getTime() : 0;
      comparison = dateA - dateB;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };


  // Get statistics
  const totalItems = inventory.length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0);
  const lowStockItems = inventory.filter(item => item.quantity <= item.reorderLevel).length;
  
  // Count by category
  const medicineCount = inventory.filter(item => item.category === 'medicine').length;
  const equipmentCount = inventory.filter(item => item.category === 'equipment').length;
  const suppliesCount = inventory.filter(item => item.category === 'supplies').length;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-full"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Inventory Management</h1>
          <p className="text-neutral-500">Manage hospital supplies, equipment, and medications</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 py-2 w-full"
            />
          </div>
          <Link to={'/inventory/new'}><button className="btn btn-primary whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </button></Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <motion.div variants={itemVariants} className="card bg-white flex items-start justify-between">
          <div>
            <h3 className="text-neutral-500 text-sm">Total Inventory Items</h3>
            <p className="text-3xl font-semibold mt-1">{totalItems}</p>
          </div>
          <div className="bg-primary-100 p-3 rounded-md">
            <Package className="h-6 w-6 text-primary-500" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card bg-white flex items-start justify-between">
          <div>
            <h3 className="text-neutral-500 text-sm">Total Inventory Value</h3>
            <p className="text-3xl font-semibold mt-1">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-success-100 p-3 rounded-md">
            <BarChart3 className="h-6 w-6 text-success-500" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card bg-white flex items-start justify-between">
          <div>
            <h3 className="text-neutral-500 text-sm">Low Stock Items</h3>
            <p className="text-3xl font-semibold mt-1 text-warning-500">{lowStockItems}</p>
          </div>
          <div className="bg-warning-100 p-3 rounded-md">
            <AlertCircle className="h-6 w-6 text-warning-500" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card bg-white flex items-start justify-between">
          <div>
            <h3 className="text-neutral-500 text-sm">By Category</h3>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-700">
                Medicines: {medicineCount}
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-accent-100 text-accent-700">
                Equipment: {equipmentCount}
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-neutral-100 text-neutral-700">
                Supplies: {suppliesCount}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div 
        variants={itemVariants}
        className="card mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
      >
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-2 text-neutral-500" />
          <span className="text-neutral-700 font-medium">Filters:</span>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="categoryFilter" className="block text-sm text-neutral-500 mb-1">
              Category
            </label>
            <select
              id="categoryFilter"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="form-input py-1 text-sm"
            >
              <option value="all">All Categories</option>
              <option value="medicine">Medicines</option>
              <option value="equipment">Equipment</option>
              <option value="supplies">Supplies</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <div className="flex items-center h-[38px]">
              <input
                type="checkbox"
                id="lowStockFilter"
                checked={showLowStock}
                onChange={(e) => setShowLowStock(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
              />
              <label htmlFor="lowStockFilter" className="ml-2 text-sm text-neutral-700">
                Show only low stock items
              </label>
            </div>
          </div>
          
          <div className="flex items-end ml-auto">
            <button className="btn btn-outline py-1 text-sm flex items-center"
            type="button" // <-- important!
            onClick={() => exportToCSV(filteredInventory, 'Inventory')}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </motion.div>

      {/* Inventory Table */}
      <motion.div variants={itemVariants} className="card overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Inventory Items</h3>
          <p className="text-sm text-neutral-500">
            Showing {sortedInventory.length} of {inventory.length} items
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Item Name
                    <ArrowUpDown className="h-3 w-3 ml-1" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Category
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('quantity')}
                >
                  <div className="flex items-center">
                    Quantity
                    <ArrowUpDown className="h-3 w-3 ml-1" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Unit
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Reorder Level
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('cost')}
                >
                  <div className="flex items-center">
                    Cost
                    <ArrowUpDown className="h-3 w-3 ml-1" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('expiryDate')}
                >
                  <div className="flex items-center">
                    Expiry Date
                    <ArrowUpDown className="h-3 w-3 ml-1" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {sortedInventory.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-neutral-900">{item.name}</div>
                    <div className="text-xs text-neutral-500">{item.supplier}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.category === 'medicine' ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-700 capitalize">
                        {item.category}
                      </span>
                    ) : item.category === 'equipment' ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-accent-100 text-accent-700 capitalize">
                        {item.category}
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-neutral-100 text-neutral-700 capitalize">
                        {item.category}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 capitalize">
                    {item.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                    {item.reorderLevel}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                    ${item.cost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.quantity <= item.reorderLevel ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-error-100 text-error-700">
                        Low Stock
                      </span>
                    ) : item.quantity <= item.reorderLevel * 1.5 ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-warning-100 text-warning-700">
                        Need Reorder
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-success-100 text-success-700">
                        In Stock
                      </span>
                    )}
                  </td>
                  {/* <Link 
                          to={`/patients/${patient.id}`}
                          className="text-primary-500 hover:text-primary-700"
                          title="View Details"
                        >
                          <FileText className="h-5 w-5" />
                        </Link> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    <div className="flex space-x-2">
                      <button className="text-warning-500 hover:text-warning-700">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button className="text-error-500 hover:text-error-700">
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-4 py-3 sm:px-6 mt-4">
          <div className="flex flex-1 justify-between sm:hidden">
            <button className="btn btn-outline py-1">Previous</button>
            <button className="btn btn-outline py-1">Next</button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-neutral-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">20</span> of{' '}
                <span className="font-medium">{inventory.length}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-neutral-400 ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50">
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-primary-500 ring-1 ring-inset ring-neutral-300">
                  1
                </button>
                <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-neutral-400 ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50">
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Inventory;