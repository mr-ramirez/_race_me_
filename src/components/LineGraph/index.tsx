// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/line
import { ResponsiveLine, Serie } from '@nivo/line';
import { FunctionComponent } from 'react';
import ChartTooltip from '@/components/LineGraph/chart-tooltip';

type Props = {
    data: Serie[];
    axisLeftName: string;
    axisBottomName: string;
    theme: string | undefined;
};

const MyResponsiveLine: FunctionComponent<Props> = ({
    data,
    axisLeftName,
    axisBottomName,
    theme,
}) => {
    return (
        <ResponsiveLine
            data={data}
            margin={{ top: 40, right: 60, left: 60, bottom: 50 }}
            xScale={{ type: 'point' }}
            yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: false,
                reverse: false,
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: axisBottomName,
                legendOffset: 36,
                legendPosition: 'middle',
            }}
            axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: axisLeftName,
                legendOffset: -40,
                legendPosition: 'middle',
            }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            theme={{
                background: theme === 'dark' ? '#121212' : '#fff',
                textColor: theme === 'dark' ? '#fff' : '#000',
                fontSize: 11,
            }}
            tooltip={({ point }) => {
                return <ChartTooltip point={point} theme={theme} />;
            }}
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, .03)',
                                itemOpacity: 1,
                            },
                        },
                    ],
                },
            ]}
        />
    );
};

export default MyResponsiveLine;
