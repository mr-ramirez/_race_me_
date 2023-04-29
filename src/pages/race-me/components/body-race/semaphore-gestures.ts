import { NormalizedLandmark } from '@mediapipe/pose';

type Coordinates = {
    x: number;
    y: number;
};

type SemaphoreType = {
    a: string;
    n?: string;
};

const DEFAULT_CALLBACK = () => {};

class SemaphoreGestures {
    private _currentSemaphore: string = '';
    private _lastSemaphore: string = '';
    public callback: (newSemaphore: string) => void = DEFAULT_CALLBACK;

    public get currentSemaphore(): string {
        return this._currentSemaphore;
    }

    public set currentSemaphore(value: string) {
        this._currentSemaphore = value;
    }

    public get lastSemaphore(): string {
        return this._lastSemaphore;
    }

    public set lastSemaphore(value: string) {
        this._lastSemaphore = value;
    }

    public constructor(callback: (newSemaphore: string) => void) {
        this._currentSemaphore = '';
        this._lastSemaphore = '';
        this.callback = callback;
    }

    public output(semaphore: string) {
        this.callback(semaphore);
        this._lastSemaphore = semaphore;
    }

    public get_angle(a: Coordinates, b: Coordinates, c: Coordinates) {
        const ang: number =
            (Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x)) * (180 / Math.PI);

        return ang < 0 ? ang + 360 : ang;
    }

    public getLimbDirection(arm: NormalizedLandmark[], closestDegrees = 45) {
        // Should also use Math.atan2 but I don't want to do more math
        const dy: number = arm[2]['y'] - arm[0]['y']; // wrist -> shoulder
        const dx: number = arm[2]['x'] - arm[0]['x'];

        let angle: number = (Math.atan(dy / dx) * 180) / Math.PI;

        if (dx < 0) {
            angle += 180;
        } // Collapse to nearest closestDegrees; 45 for semaphore

        const modClose: number = angle % closestDegrees;
        angle -= modClose;

        if (modClose > closestDegrees / 2) {
            angle += closestDegrees;
        }

        angle = parseInt(String(angle), 10);

        if (angle === 270) {
            angle = -90;
        }

        return angle;
    }

    public typeSemaphore(armL_angle: number, armR_angle: number) {
        // You can define your semaphore dictionary here (based on Python code)
        const SEMAPHORES: {[key: string]: SemaphoreType} = {
            '45,90': { a: 'a', n: '1' },
            '0,90': { a: 'b', n: '2' },
            '-45,90': { a: 'c', n: '3' },
            '-90,90': { a: 'd', n: '4' },
            '90,225': { a: 'e', n: '5' },
            '90,180': { a: 'f', n: '6' },
            '90,135': { a: 'g', n: '7' },
            '0,45': { a: 'h', n: '8' },
            '-45,45': { a: 'i', n: '9' },
            '-90,180': { a: 'j', n: 'capslock' },
            '45,-90': { a: 'k', n: '0' },
            '45,225': { a: 'l', n: '\\' },
            '45,180': { a: 'm', n: '[' },
            '45,135': { a: 'n', n: ']' },
            '0,-45': { a: 'o', n: ',' },
            '0,-90': { a: 'p', n: ';' },
            '0,225': { a: 'q', n: '=' },
            '0,180': { a: 'r', n: '-' },
            '0,135': { a: 's', n: '.' },
            '-45,-90': { a: 't', n: '`' },
            '-45,225': { a: 'u', n: '/' },
            '-90,135': { a: 'v', n: '"' },
            '225,180': { a: 'w' },
            '225,135': { a: 'x' }, // Clear last signal - Set a custom value or keep it empty in JavaScript
            '-45,180': { a: 'y' },
            '135,180': { a: 'z' },
            '90,90': { a: 'space', n: 'enter' },
            '135,90': { a: 'tab' }, // Custom "numerals" replacement
            '225,45': { a: 'escape' }, // Custom "cancel" replacement
        };
        const key: string = `${armL_angle},${armR_angle}`;

        const arm_match: SemaphoreType = SEMAPHORES[key];

        if (arm_match) {
            return arm_match; // modify this assignment if necessary depending on your semaphore dictionary structure
        }
    }
}

export default SemaphoreGestures;
