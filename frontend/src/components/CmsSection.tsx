import React from 'react';
import { AdminLayout } from './admin/AdminLayout';

interface CmsSectionProps {
  onBackToPortal: () => void;
}

export const CmsSection: React.FC<CmsSectionProps> = ({ onBackToPortal }) => {
  return <AdminLayout onBackToPortal={onBackToPortal} />;
};
