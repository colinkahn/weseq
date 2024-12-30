import type { Meta, StoryFn } from '@storybook/react';
import React, { useState } from 'react';
import Knob from './Knob';

type KnobStoryMeta = Meta<typeof Knob>;

/** A rotary knob control component for adjusting numeric values */
const meta: KnobStoryMeta = {
  title: 'Components/Knob',
  component: Knob,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Current value of the knob',
    },
    min: {
      control: 'number',
      description: 'Minimum value the knob can represent',
    },
    max: {
      control: 'number',
      description: 'Maximum value the knob can represent',
    },
    size: {
      control: 'number',
      description: 'Size of the knob in pixels',
    },
    debounceMs: {
      control: 'number',
      description: 'Debounce delay for onChange events in milliseconds',
    },
    onChange: {
      description: 'Callback function when the value changes',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
    },
  },
};

export default meta;

// Template that maintains state for the knob
const Template: StoryFn<typeof Knob> = (args) => {
  const [value, setValue] = useState(args.value);
  return <Knob {...args} value={value} onChange={setValue} />;
};

/** Default knob with standard settings */
export const Default = Template.bind({});
Default.args = {
  value: 0,
  min: 0,
  max: 100,
  size: 64,
  debounceMs: 100,
};

/** Small-sized knob for compact layouts */
export const Small = Template.bind({});
Small.args = {
  ...Default.args,
  size: 32,
};

/** Large-sized knob for prominent controls */
export const Large = Template.bind({});
Large.args = {
  ...Default.args,
  size: 96,
};

/** Custom range knob for fine-grained control */
export const CustomRange = Template.bind({});
CustomRange.args = {
  ...Default.args,
  value: 0,
  min: -50,
  max: 50,
};

/** Custom styling example */
export const CustomStyling = Template.bind({});
CustomStyling.args = {
  ...Default.args,
  className: 'custom-knob',
};
CustomStyling.parameters = {
  docs: {
    description: {
      story: 'Example of using a custom CSS class to modify the knob appearance.',
    },
  },
};
