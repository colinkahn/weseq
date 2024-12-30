import React from 'react';
import Panel, { PanelProps } from './Panel';
import './Desktop.css';

export enum DesktopContentType {
  Grid = 'grid',
}

export type DesktopGridItem = {
  id: string;
  PanelProps?: PanelProps;
};

interface BaseDesktopProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

interface GridDesktopProps extends BaseDesktopProps {
  contentType: DesktopContentType.Grid;
  gridItems: DesktopGridItem[];
  columns: number;
  rows: number;
  gap?: number;
  padding?: number;
}

export type DesktopProps = GridDesktopProps;

const GridItemRenderer: React.FC<{ item: DesktopGridItem }> = ({ item }) => {
  return (
    <div className="Desktop-gridCell">
      {item.PanelProps && <Panel {...item.PanelProps} />}
    </div>
  );
};

export const Desktop: React.FC<DesktopProps> = ({
  width = '100%',
  height = '100%',
  className = '',
  contentType,
  gridItems,
  columns,
  rows,
  gap = 20,
  padding = 0,
}) => {
  const desktopRef = React.useRef<HTMLDivElement>(null);

  // Update CSS variables
  React.useEffect(() => {
    if (desktopRef.current) {
      desktopRef.current.style.setProperty('--desktop-width', typeof width === 'number' ? `${width}px` : width);
      desktopRef.current.style.setProperty('--desktop-height', typeof height === 'number' ? `${height}px` : height);
      desktopRef.current.style.setProperty('--desktop-grid-columns', columns.toString());
      desktopRef.current.style.setProperty('--desktop-grid-rows', rows.toString());
      desktopRef.current.style.setProperty('--desktop-grid-gap', `${gap}px`);
      desktopRef.current.style.setProperty('--desktop-grid-padding', `${padding}px`);
    }
  }, [width, height, columns, rows, gap, padding]);

  const renderContent = () => {
    switch (contentType) {
      case DesktopContentType.Grid:
        return (
          <div className="Desktop-gridContainer">
            <div className="Desktop-grid">
              {gridItems.map((item) => (
                <GridItemRenderer key={item.id} item={item} />
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={desktopRef}
      className={`Desktop-root ${className}`}
    >
      {renderContent()}
    </div>
  );
};

export default Desktop;
