import React, { useEffect, useState } from 'react';
import { range } from 'lodash';
import { createOutgoingMessage, useMessageQueue } from 'hooks/useMessageQueue';
import {
 DesktopContentType,
 Page,
 PageProps,
 PanelContentType,
 PanelGridItem,
 PanelProps
} from 'components';
import { useCallbackArray } from 'hooks/useCallbackArray';
import useClock from 'hooks/useClock';
import useSteps from 'hooks/useSteps';

type PanelState = {
  values: Record<number, number>,
};

type PageState = Record<number, PanelState>;

const useSequencerPanelProps = ({
  state,
  clockTick,
  onChange,
}: {
  state: PanelState,
  clockTick: number,
  onChange: (index: number, value: number) => void,
}): PanelProps => {
  const { currentStep } = useSteps(clockTick, 16);
  const onKnobChangeCallbacks = useCallbackArray(16, onChange);
  const gridItems: PanelGridItem[] = range(16).map((index) => {
    return {
      id: `control-${index}`,
      KnobProps: {
       value: state.values[index] || 0,
       onChange: onKnobChangeCallbacks[index],
     },
      LedProps: { isOn: currentStep === index },
    };
  });
  return {
    contentType: PanelContentType.Grid,
    columns: 4,
    rows: 4,
    width: 368,
    height: 368,
    gridItems,
  };
};

const useSlidersPanelProps = ({
  state,
  onChange,
}: {
  state: PanelState,
  onChange: (index: number, value: number) => void,
}): PanelProps => {

  const onSliderChangeCallbacks = useCallbackArray(4, onChange);
  return {
    contentType: PanelContentType.Row,
    width: 368,
    rowItems: [
      {
        id: 'control-0',
        SliderProps: {
         value: state.values[0] || 0,
         onChange: onSliderChangeCallbacks[0],
        },
      },
      {
        id: 'control-1',
        SliderProps: {
         value: state.values[1] || 0,
         onChange: onSliderChangeCallbacks[1],
        },
      },
      {
        id: 'control-2',
        SliderProps: {
         value: state.values[2] || 0,
         onChange: onSliderChangeCallbacks[2],
        },
      },
      {
        id: 'control-3',
        SliderProps: {
         value: state.values[3] || 0,
         onChange: onSliderChangeCallbacks[3],
        },
      },
    ],
}
}

export const usePageProps = (): PageProps => {
  const { queue, clearQueue, sendMessage } = useMessageQueue<PageState>('ws://localhost:8080/ws');

  const { counter: clockTick } = useClock();

  const [states, setStates] = useState<PageState>({
    0: {
      values: {},
    },
    1: {
      values: {},
    }
  });

  useEffect(() => {
    const lastMessage = queue.messages[queue.messages.length - 1];
    if (lastMessage) {
      setStates(lastMessage.content);
      clearQueue();
    }
  }, [queue, clearQueue]);

  const panelOnChange = (panelIndex: number) => (index: number, value: number) => {
    setStates(prevStates => {
      const nextStates = {
        ...prevStates,
        [panelIndex]: {
          ...prevStates[panelIndex],
          values: {
            ...prevStates[panelIndex].values,
            [index]: value,
          },
        }
      };

      const message = createOutgoingMessage(nextStates);
      sendMessage(message);

      return nextStates;
    });
  };

  const panelProps1 = useSequencerPanelProps({
    state: states[0],
    clockTick,
    onChange: panelOnChange(0),
  });

  const panelProps2 = useSlidersPanelProps({
    state: states[1],
    onChange: panelOnChange(1),
  });

  return {
    DesktopProps: {
      contentType: DesktopContentType.Grid,
      width: '90vw',
      height: '90vh',
      columns: 1,
      rows: 1,
      gap: 20,
      gridItems: [
        {
          id: 'gridItems-0',
          PanelProps: panelProps1,
        },
        {
          id: 'gridItems-1',
          PanelProps: panelProps2,
        },
      ],
    },
  }
};

const ControllerPage: React.FC = () => {
  const props = usePageProps();
  return <Page {...props} />;
}

export default ControllerPage;
