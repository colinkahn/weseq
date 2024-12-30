import React from 'react';
import Desktop, { DesktopProps } from './Desktop';
import './Page.css';

export interface PageProps {
  DesktopProps?: DesktopProps;
  className?: string;
}

const Page: React.FC<PageProps> = ({
  DesktopProps,
  className = '',
}) => {
  return (
    <div className={`Page-root ${className}`}>
      <div className="Page-content">
        {DesktopProps && <Desktop {...DesktopProps} />}
      </div>
    </div>
  );
};

export default Page;
