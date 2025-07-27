import { ShoppingBag } from 'lucide-react';

const MarketplacePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
      <ShoppingBag className="h-16 w-16 text-gray-400" />
      <h2 className="mt-4 text-xl font-medium text-gray-700">Marketplace</h2>
      <p className="mt-2 text-gray-500 text-center max-w-md">
        Esta función estará disponible pronto. Aquí podrás explorar e instalar aplicaciones para tu
        negocio.
      </p>
    </div>
  );
};

export default MarketplacePage;
