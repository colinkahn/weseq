import type { Meta, StoryFn } from '@storybook/react';
import Panel, { PanelContentType } from './Panel';
import './Panel.css';

const meta: Meta<typeof Panel> = {
  title: 'Components/Panel',
  component: Panel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: 'text',
      description: 'Width of the panel (number for pixels, string for other units)',
    },
    height: {
      control: 'text',
      description: 'Height of the panel (number for pixels, string for other units)',
    },
    color: {
      control: 'color',
      description: 'Background color of the panel',
    },
    gap: {
      control: { type: 'number', min: 0, max: 64 },
      description: 'Gap between items in pixels',
    },
    padding: {
      control: { type: 'number', min: 0, max: 64 },
      description: 'Padding around content in pixels',
    },
  },
};

export default meta;

const Template: StoryFn<typeof Panel> = (args) => {
  return <Panel {...args} />;
};

/** Grid panel with knobs and LEDs */
export const GridPanel = Template.bind({});

GridPanel.args = {
  contentType: PanelContentType.Grid,
  color: '#1a1a1a',
  columns: 2,
  rows: 2,
  gap: 40,
  padding: 20,
  gridItems: [
    {
      id: '1',
      KnobProps: { value: 50, onChange: console.log },
      LedProps: { isOn: true },
    },
    {
      id: '2',
      KnobProps: { value: 25, onChange: console.log },
      LedProps: { isOn: false },
    },
    {
      id: '3',
      KnobProps: { value: 75, onChange: console.log },
      LedProps: { isOn: true },
    },
    {
      id: '4',
      KnobProps: { value: 100, onChange: console.log },
      LedProps: { isOn: false },
    },
  ],
};

/** Row panel with alternating knobs and sliders */
export const RowPanel = Template.bind({});
RowPanel.args = {
  contentType: PanelContentType.Row,
  color: '#1a1a1a',
  gap: 40,
  padding: 20,
  rowItems: [
    {
      id: '1',
      SliderProps: { value: 50, onChange: console.log },
    },
    {
      id: '2',
      SliderProps: { value: 75, onChange: console.log },
    },
    {
      id: '3',
      SliderProps: { value: 25, onChange: console.log },
    },
    {
      id: '4',
      SliderProps: { value: 60, onChange: console.log },
    },
  ],
};
