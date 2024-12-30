import type { Meta, StoryFn } from '@storybook/react';
import Page from './Page';
import { DesktopContentType as DesktopContentType } from './Desktop';
import { PanelContentType as PanelContentType } from './Panel';
import './Page.css';

const meta: Meta<typeof Page> = {
  title: 'Components/Page',
  component: Page,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;

const Template: StoryFn<typeof Page> = (args) => <Page {...args} />;

/** Page with Desktop grid */
export const WithDesktop = Template.bind({});
WithDesktop.args = {
  DesktopProps: {
    contentType: DesktopContentType.Grid,
    width: '90vw',  // Leave some margin
    height: '90vh', // Leave some margin
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
          ],
        },
      },
    ],
  },
};

/** Empty page */
export const Empty = Template.bind({});
Empty.args = {};
