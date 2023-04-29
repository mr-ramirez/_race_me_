import React, { FunctionComponent, KeyboardEventHandler, useCallback, useMemo } from 'react';

type Props = {
    isBodyRace: boolean;
    setIsBodyRace: (newValue: boolean) => void;
    resetState: () => void;
    wpm: number;
    seconds: number;
};

const Metrics: FunctionComponent<Props> = ({ isBodyRace, setIsBodyRace, resetState, wpm, seconds }) => {
    const clickHandler = useCallback(
        () => {
            resetState();
            setIsBodyRace(!isBodyRace);
        },
        [resetState, setIsBodyRace, isBodyRace],
    );

    const keyDownHandler = useCallback(
    // @ts-ignore
        (event: KeyboardEvent<HTMLHeadingElement>) => {
            if (event.key === " ") {
                event.preventDefault();
            }
        },
        [],
    );


    const raceMeClassName = useMemo<string>(() => !isBodyRace ? "bg-[#FF990080]" : "", [isBodyRace]);
    const bodyRaceClassName = useMemo<string>(() => isBodyRace ? "bg-[#FF990080]" : "", [isBodyRace]);

    return (
      <>
        <div className="w-full flex justify-between">
          <h3
              className={`${raceMeClassName} text-center sm:text-left sm:w-max cursor-pointer`}
              onClick={clickHandler}
              onKeyDown={keyDownHandler}
          >
            Race me
          </h3>
          <h3
              className={`${bodyRaceClassName} text-center sm:text-left sm:w-max cursor-pointer`}
              onClick={clickHandler}
              onKeyDown={keyDownHandler}
          >
            Body race
          </h3>
        </div>

        <h3 className="text-center sm:text-left">WPM: {wpm}</h3>

        <h3 className="text-center sm:text-left">Time: {seconds}</h3>
      </>
  );
};

export default Metrics;
