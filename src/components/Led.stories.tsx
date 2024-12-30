import type { Meta, StoryFn } from '@storybook/react';
import Led from './Led';

const meta = {
  title: 'Components/Led',
  component: Led,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOn: {
      control: 'boolean',
      description: 'Whether the LED is lit or not',
    },
    size: {
      control: { type: 'number', min: 4, max: 48, step: 1 },
      description: 'Size of the LED in pixels',
    },
    onColor: {
      control: 'color',
      description: 'Color of the LED when lit',
    },
    offColor: {
      control: 'color',
      description: 'Color of the LED when not lit',
    },
    intensity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Brightness intensity of the LED (0-1)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
    },
  },
} satisfies Meta<typeof Led>;

export default meta;

const Template: StoryFn<typeof Led> = (args) => <Led {...args} />;

/** LED in its active state */
export const On = Template.bind({});
On.args = {
  isOn: true,
  size: 12,
  onColor: '#ff0000',
  offColor: '#3a0000',
  intensity: 1,
};

/** LED in its inactive state */
export const Off = Template.bind({});
Off.args = {
  isOn: false,
  size: 12,
  onColor: '#ff0000',
  offColor: '#3a0000',
  intensity: 1,
};
