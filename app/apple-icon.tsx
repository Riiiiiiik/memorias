import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
    width: 180,
    height: 180,
};
export const contentType = 'image/png';

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: '#000000',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 100,
                    fontWeight: 'bold',
                    // Apple adds its own rounded corners
                }}
            >
                M
            </div>
        ),
        {
            ...size,
        }
    );
}
