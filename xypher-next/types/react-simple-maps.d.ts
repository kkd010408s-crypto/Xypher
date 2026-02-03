declare module 'react-simple-maps' {
    import { ComponentType, ReactNode } from 'react';

    export interface ComposableMapProps {
        projection?: string;
        projectionConfig?: {
            scale?: number;
            center?: [number, number];
            rotate?: [number, number, number];
        };
        width?: number;
        height?: number;
        style?: React.CSSProperties;
        children?: ReactNode;
    }

    export interface ZoomableGroupProps {
        zoom?: number;
        center?: [number, number];
        onMoveStart?: (position: { coordinates: [number, number]; zoom: number }) => void;
        onMove?: (position: { coordinates: [number, number]; zoom: number }) => void;
        onMoveEnd?: (position: { coordinates: [number, number]; zoom: number }) => void;
        children?: ReactNode;
    }

    export interface GeographiesProps {
        geography: string | object;
        children: (props: { geographies: Geography[] }) => ReactNode;
    }

    export interface Geography {
        rsmKey: string;
        properties: Record<string, unknown>;
        geometry: {
            type: string;
            coordinates: number[][][] | number[][][][];
        };
    }

    export interface GeographyProps {
        geography: Geography;
        fill?: string;
        stroke?: string;
        strokeWidth?: number;
        style?: {
            default?: React.CSSProperties & { outline?: string; cursor?: string };
            hover?: React.CSSProperties & { outline?: string; cursor?: string };
            pressed?: React.CSSProperties & { outline?: string; cursor?: string };
        };
        onMouseEnter?: (event: React.MouseEvent<SVGPathElement>) => void;
        onMouseLeave?: (event: React.MouseEvent<SVGPathElement>) => void;
        onClick?: (event: React.MouseEvent<SVGPathElement>) => void;
    }

    export const ComposableMap: ComponentType<ComposableMapProps>;
    export const ZoomableGroup: ComponentType<ZoomableGroupProps>;
    export const Geographies: ComponentType<GeographiesProps>;
    export const Geography: ComponentType<GeographyProps>;
}
