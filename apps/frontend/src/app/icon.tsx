import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #070B19 0%, #0B132B 50%, #050814 100%)',
          borderRadius: '8px',
          border: '1.5px solid #00F5FF',
          color: '#00F5FF',
          fontSize: '20px',
          fontWeight: 900,
          fontFamily: 'sans-serif',
          boxShadow: '0 0 10px rgba(0, 245, 255, 0.5)',
        }}
      >
        T
      </div>
    ),
    {
      ...size,
    }
  );
}
