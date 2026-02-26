import React from 'react';

interface ProductionErrorBoundaryProps {
  children: React.ReactNode;
}

declare const ProductionErrorBoundary: React.ComponentClass<ProductionErrorBoundaryProps>;

export default ProductionErrorBoundary;

