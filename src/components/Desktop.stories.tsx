import type { Meta, StoryFn } from '@storybook/react';
import Desktop, { DesktopContentType } from './Desktop';
import { PanelContentType } from './Panel';
import './Desktop.css';

const meta: Meta<typeof Desktop> = {
  title: 'Components/Desktop',
  component: Desktop,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: 'text',
      description: 'Width of the desktop',
    },
    height: {
      control: 'text',
      description: 'Height of the desktop',
    },
    columns: {
      control: { type: 'number', min: 1, max: 4 },
      description: 'Number of grid columns',
    },
    rows: {
      control: { type: 'number', min: 1, max: 4 },
      description: 'Number of grid rows',
    },
    gap: {
      control: { type: 'number', min: 0, max: 64 },
      description: 'Gap between grid items in pixels',
    },
    padding: {
      control: { type: 'number', min: 0, max: 64 },
      description: 'Padding around the grid in pixels',
    },
  },
};

export default meta;

const Template: StoryFn<typeof Desktop> = (args) => <Desktop {...args} />;

/** Grid layout with panels */
export const GridDesktop = Template.bind({});
GridDesktop.args = {
  contentType: DesktopContentType.Grid,
  width: '100%',
  height: '100vh',
  columns: 2,
  rows: 2,
  gap: 20,
  padding: 20,
  gridItems: [
    {
      id: '1',
      PanelProps: {
        contentType: PanelContentType.Grid,
        columns: 2,
        rows: 2,
        gridItems: [
          {
            id: 'control-1',
            KnobProps: { value: 50, onChange: console.log },
            LedProps: { isOn: true },
          },
          {
            id: 'control-2',
            KnobProps: { value: 75, onChange: console.log },
            LedProps: { isOn: false },
          },
          {
            id: 'control-3',
            KnobProps: { value: 25, onChange: console.log },
            LedProps: { isOn: true },
          },
          {
            id: 'control-4',
            KnobProps: { value: 100, onChange: console.log },
            LedProps: { isOn: false },
          },
        ],
      },
    },
    {
      id: '2',
      PanelProps: {
        contentType: PanelContentType.Row,
        rowItems: [
          {
            id: 'slider-1',
            SliderProps: { value: 50, onChange: console.log },
          },
          {
            id: 'slider-2',
            SliderProps: { value: 75, onChange: console.log },
          },
        ],
      },
    },
    {
      id: '3',
      PanelProps: {
        contentType: PanelContentType.Grid,
        columns: 1,
        rows: 2,
        gridItems: [
          {
            id: 'control-5',
            KnobProps: { value: 50, onChange: console.log },
            LedProps: { isOn: true },
          },
          {
            id: 'control-6',
            KnobProps: { value: 75, onChange: console.log },
            LedProps: { isOn: false },
          },
        ],
      },
    },
    {
      id: '4',
      PanelProps: {
        contentType: PanelContentType.Row,
        rowItems: [
          {
            id: 'knob-1',
            SliderProps: { value: 50, onChange: console.log },
          },
          {
            id: 'slider-3',
            SliderProps: { value: 75, onChange: console.log },
          },
          {
            id: 'knob-2',
            SliderProps: { value: 25, onChange: console.log },
          },
        ],
      },
    },
  ],
};
