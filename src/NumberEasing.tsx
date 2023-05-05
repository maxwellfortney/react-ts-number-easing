"use client";

import { ReactNode, useEffect, useState } from "react";
import { Ease, Milliseconds } from "./types";
import { useInterval } from "usehooks-ts";
import EASES from "eases";

export interface NumberEasingOptions {
    value: number;
    speed?: Milliseconds;
    decimals?: number;
    ease?: Ease;
    render?: (value: number, decimals: number) => ReactNode;
}

const CLOCK_TICK_MS = 16;

export function NumberEasing({
    value,
    speed = 500,
    decimals = 0,
    ease = "quintInOut",
    render,
}: NumberEasingOptions): ReactNode {
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

        if (absoluteProgress > 0) {
            setRenderValue(value);
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
