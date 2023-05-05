import { useEffect, useState } from "react";
import { Ease, Milliseconds } from "./types";
import EASES from "eases";
import { useInterval } from "./hooks";

export interface NumberEasingOptions {
    value: number;
    speed?: Milliseconds;
    decimals?: number;
    ease?: Ease;
    render?: (value: number, decimals: number) => JSX.Element;
}

const CLOCK_TICK_MS = 16;

export function NumberEasing({
    value,
    speed = 500,
    decimals = 0,
    ease = "quintInOut",
    render,
}: NumberEasingOptions): JSX.Element {
    const [renderValue, setRenderValue] = useState(value);
    const [lastTarget, lastTargetSet] = useState(value);

    const [lastUpdateTime, lastUpdateTimeSet] = useState<Milliseconds>(new Date().getTime());

    useEffect(() => {
        lastUpdateTimeSet(new Date().getTime() - CLOCK_TICK_MS);
        lastTargetSet(renderValue);
    }, [value]);

    useInterval(() => {
        const currentTime = new Date().getTime();
        const absoluteProgress = (currentTime - lastUpdateTime) / speed;

        if (absoluteProgress >= 1) {
            if (renderValue !== value) {
                setRenderValue(value);
            }
        } else {
            const easedProgress = EASES[ease](absoluteProgress);
            setRenderValue(lastTarget + (value - lastTarget) * easedProgress);
        }
    }, CLOCK_TICK_MS);

    if (render) {
        return render(renderValue, decimals);
    }

    return <>{renderValue.toFixed(decimals)}</>;
}
