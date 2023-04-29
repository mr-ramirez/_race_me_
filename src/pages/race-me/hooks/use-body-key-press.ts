import { useEffect } from 'react';

type UseBodyKeyPressProps = {
    callback: (char: string) => void;
    currBodyRaceChar?: string;
};

const useBodyKeyPress = ({ callback, currBodyRaceChar }: UseBodyKeyPressProps): void => {
    // Component for body key will just set the context
    useEffect(() => {
        if (!currBodyRaceChar) return;

        callback && callback(currBodyRaceChar);
    }, [callback, currBodyRaceChar]);
};

export default useBodyKeyPress;
