import React from 'react';
import Knob, { KnobProps } from './Knob';
import Led, { LedProps } from './Led';
import Slider, { SliderProps } from './Slider';
import './Panel.css';

export enum PanelContentType {
  Grid = 'grid',
  Row = 'row',
}

// Base types for different items
export type PanelGridItem = {
  id: string;
  KnobProps?: KnobProps;
  LedProps?: LedProps;
};

export type RowItem = {
  id: string;
  SliderProps: SliderProps;
};

// Base panel props
interface BasePanelProps {
  width?: number | string;
  height?: number | string;
  color?: string;
  className?: string;
  padding?: number;
}

// Grid-specific panel props
interface GridPanelProps extends BasePanelProps {
  contentType: PanelContentType.Grid;
  gridItems: PanelGridItem[];
  columns: number;
  rows: number;
  gap?: number;
}

// Row-specific panel props
interface RowPanelProps extends BasePanelProps {
  contentType: PanelContentType.Row;
  rowItems: RowItem[];
  gap?: number;
}

export type PanelProps = GridPanelProps | RowPanelProps;

export function getPanelProps<T extends PanelContentType>(
  panel: PanelProps | null | undefined,
  expectedType: T
): T extends PanelContentType.Grid ? GridPanelProps : RowPanelProps {
  if (!panel || panel.contentType !== expectedType) {
    throw new Error(`Expected panel type ${expectedType} but got ${panel?.contentType}`);
  }

  return panel as (T extends PanelContentType.Grid ? GridPanelProps : RowPanelProps);
}

const GridItemRenderer: React.FC<{ item: PanelGridItem }> = ({ item }) => {
  return (
    <div className="Panel-gridCell">
      {item.KnobProps && <Knob {...item.KnobProps} />}
      {item.LedProps && <Led {...item.LedProps} />}
    </div>
  );
};

const GridItemRendererMemo = React.memo(GridItemRenderer);

const RowItemRenderer: React.FC<{ item: RowItem }> = ({ item }) => {
  return (
    <div className="Panel-rowCell">
      {item.SliderProps && <Slider {...(item.SliderProps)} />}
    </div>
  );
};

const Panel: React.FC<PanelProps> = ({
  width = 'auto',
  height = 'auto',
  color = '#1a1a1a',
  className = '',
  contentType,
  padding = 20,
  gap = 40,
  ...contentProps
}) => {
  const panelRef = React.useRef<HTMLDivElement>(null);

  // Update CSS variables
  React.useEffect(() => {
    if (panelRef.current) {
      // Panel variables
      panelRef.current.style.setProperty('--panel-width', typeof width === 'number' ? `${width}px` : width);
      panelRef.current.style.setProperty('--panel-height', typeof height === 'number' ? `${height}px` : height);
      panelRef.current.style.setProperty('--panel-color', color);
      panelRef.current.style.setProperty('--panel-padding', `${padding}px`);
      panelRef.current.style.setProperty('--panel-gap', `${gap}px`);

      // Content-specific variables
      if (contentType === PanelContentType.Grid) {
        const { columns, rows } = contentProps as GridPanelProps;
        panelRef.current.style.setProperty('--panel-grid-columns', columns.toString());
        panelRef.current.style.setProperty('--panel-grid-rows', rows.toString());
      }
    }
  }, [width, height, color, padding, gap, contentType, contentProps]);

  const renderContent = () => {
    switch (contentType) {
      case PanelContentType.Grid: {
        const { gridItems } = contentProps as GridPanelProps;
        return (
          <div className="Panel-gridContainer">
            <div className="Panel-grid">
              {gridItems.map((item) => (
                <GridItemRendererMemo key={item.id} item={item} />
              ))}
            </div>
          </div>
        );
      }
      case PanelContentType.Row: {
        const { rowItems } = contentProps as RowPanelProps;
        return (
          <div className="Panel-rowContainer">
            {rowItems.map((item) => (
              <RowItemRenderer key={item.id} item={item} />
            ))}
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div
      ref={panelRef}
      className={`Panel-root ${className}`}
    >
      {renderContent()}
    </div>
  );
};

export default React.memo(Panel);
