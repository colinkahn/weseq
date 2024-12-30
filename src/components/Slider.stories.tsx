import type { Meta, StoryFn } from '@storybook/react';
import React, { useState } from 'react';
import Slider from './Slider';
import './Slider.css';

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Current value of the slider',
    },
    min: {
      control: 'number',
      description: 'Minimum value',
    },
    max: {
      control: 'number',
      description: 'Maximum value',
    },
    width: {
      control: 'number',
      description: 'Width of the slider in pixels',
    },
    height: {
      control: 'number',
      description: 'Height of the slider in pixels',
    },
    handleWidth: {
      control: 'number',
      description: 'Width of the slider handle in pixels',
    },
    handleHeight: {
      control: 'number',
      description: 'Height of the slider handle in pixels',
    },
    trackWidth: {
      control: 'number',
      description: 'Width of the slider track in pixels',
    },
  },
};

export default meta;

// Template that maintains internal state
const Template: StoryFn<typeof Slider> = (args) => {
  const [value, setValue] = useState(args.value);
  return (
    <Slider 
      {...args} 
      value={value} 
      onChange={setValue}
    />
  );
};

/** Default vertical slider */
export const Default = Template.bind({});
Default.args = {
  value: 50,
  min: 0,
  max: 100,
  width: 40,
  height: 200,
  handleWidth: 32,
  handleHeight: 16,
  trackWidth: 4,
};
