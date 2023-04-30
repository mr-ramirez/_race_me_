import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';
import React from 'react';

export default function Document() {
    return (
        <Html>
            <Head>
                <Script
                    src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
                    crossOrigin="anonymous"
                />
                <Script
                    src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js"
                    crossOrigin="anonymous"
                />
                <Script
                    src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils_3d/control_utils_3d.js"
                    crossOrigin="anonymous"
                />
                <Script
                    src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"
                    crossOrigin="anonymous"
                />
                <Script
                    src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js"
                    crossOrigin="anonymous"
                />
                <Script src="https://cdn.plot.ly/plotly-2.20.0.min.js" />
            </Head>
            
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
