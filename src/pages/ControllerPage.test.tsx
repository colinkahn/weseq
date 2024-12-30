import { renderHook, act } from '@testing-library/react';
import { usePageProps } from './ControllerPage';
import { useMessageQueue } from 'hooks/useMessageQueue';
import useClock from 'hooks/useClock';
import useSteps from 'hooks/useSteps';
import { PanelContentType, getPanelProps, PageProps } from 'components';
import { mockReturnObjectValue } from 'test/utils';

// Mock external hooks
jest.mock('hooks/useMessageQueue', () => ({
  ...jest.requireActual('hooks/useMessageQueue'),
  useMessageQueue: jest.fn()
}));

jest.mock('hooks/useClock', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('hooks/useSteps', () => ({
  __esModule: true,
  default: jest.fn()
}));

function getSequencerPanel(PageProps: PageProps) {
  return getPanelProps(PageProps.DesktopProps?.gridItems[0].PanelProps, PanelContentType.Grid);
}

function getSlidersPanel(PageProps: PageProps) {
  return getPanelProps(PageProps.DesktopProps?.gridItems[1].PanelProps, PanelContentType.Row);
}

describe('usePageProps', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock implementations
    mockReturnObjectValue(useMessageQueue, {
      queue: { messages: [] },
      clearQueue: jest.fn(),
      sendMessage: jest.fn()
    });

    mockReturnObjectValue(useClock, {
      counter: 0,
      reset: jest.fn()
    });

    mockReturnObjectValue(useSteps, {
      currentStep: 0,
      reset: jest.fn()
    });
  });

  describe('sequencer panel', () => {
    it('should initialize with correct dimensions', () => {
      const { result } = renderHook(() => usePageProps());
      const panel = getSequencerPanel(result.current);

      expect(panel?.columns).toBe(4);
      expect(panel?.rows).toBe(4);
      expect(panel?.contentType).toBe(PanelContentType.Grid);
    });

    test.each([0, 5, 15])('should initialize knob %i with zero value', (index) => {
      const { result } = renderHook(() => usePageProps());
      const knob = getSequencerPanel(result.current).gridItems[index].KnobProps;
      expect(knob?.value).toBe(0);
    });

    describe('LED states', () => {
      test.each([
        [0, 0, true],
        [0, 1, false],
        [5, 5, true],
        [5, 0, false]
      ])('when step is %i, LED %i should be %s', (currentStep, ledIndex, expectedState) => {
        mockReturnObjectValue(useSteps, { currentStep });
        const { result } = renderHook(() => usePageProps());

        const led = getSequencerPanel(result.current).gridItems[ledIndex].LedProps;
        expect(led?.isOn).toBe(expectedState);
      });
    });
  });

  describe('sliders panel', () => {
    it('should initialize with correct dimensions', () => {
      const { result } = renderHook(() => usePageProps());
      const panel = getSlidersPanel(result.current);

      expect(panel.width).toBe(368);
      expect(panel.contentType).toBe(PanelContentType.Row);
    });

    test.each([0, 1, 2, 3])('should initialize slider %i with zero value', (index) => {
      const { result } = renderHook(() => usePageProps());
      const slider = getSlidersPanel(result.current).rowItems[index].SliderProps;
      expect(slider.value).toBe(0);
    });
  });

  describe('message handling', () => {
    const mockSendMessage = jest.fn();
    const mockClearQueue = jest.fn();
    const mockMessageStates = {
      0: { values: { 1: 50 } },
      1: { values: { 2: 75 } }
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should update states when receiving a message', async () => {
      const { result, rerender } = renderHook(() => usePageProps());

      mockReturnObjectValue(useMessageQueue, {
        queue: {
          messages: [
            {
              type: 'sync',
              content: mockMessageStates,
            },
          ],
        },
        clearQueue: mockClearQueue,
        sendMessage: mockSendMessage,
      });

      rerender();

      // Check specific updates
      const knobValue = getSequencerPanel(result.current).gridItems[1].KnobProps?.value;
      const sliderValue = getSlidersPanel(result.current).rowItems[2].SliderProps.value;

      expect(knobValue).toBe(50);
      expect(sliderValue).toBe(75);
      expect(mockClearQueue).toHaveBeenCalled();
    });

    describe('control value changes', () => {
      test.each([
        ['knob', 0, 50, { 0: { values: { 0: 50 } }, 1: { values: {} } }],
        ['slider', 1, 75, { 0: { values: {} }, 1: { values: { 0: 75 } } }]
      ])('should handle %s %i change to %i', (type, panelIndex, value, expectedContent) => {
        mockReturnObjectValue(useMessageQueue, {
          queue: {
            messages: [],
          },
          clearQueue: mockClearQueue,
          sendMessage: mockSendMessage,
        });

        const { result } = renderHook(() => usePageProps());

        act(() => {
          const panel = result.current.DesktopProps?.gridItems[panelIndex].PanelProps;
          const control = type === 'knob'
            ? getPanelProps(panel, PanelContentType.Grid)?.gridItems[0].KnobProps
            : getPanelProps(panel,PanelContentType.Row )?.rowItems[0].SliderProps;
          control?.onChange?.(value);
        });

        expect(mockSendMessage).toHaveBeenCalledWith({
          type: 'update',
          content: expectedContent
        });
      });
    });
  });
});
