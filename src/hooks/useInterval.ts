import { useEffect, useRef } from "react";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

export function useInterval(callback: () => void, delay: number) {
    const savedCallback = useRef(callback);

    useIsomorphicLayoutEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const timer = setInterval(() => savedCallback.current(), delay);
        return () => clearInterval(timer);
    }, [delay]);
}
