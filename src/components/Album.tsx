import { Suspense, useEffect } from 'react';

import { Canvas } from '@react-three/fiber';
import { Float, Loader, OrbitControls } from '@react-three/drei';

import { Book } from './Book';
import { useAppSelector } from '../store';

const Album = () => {
  const page = useAppSelector((state) => state.book.page);

  useEffect(() => {
    const audio = new Audio('/audios/page-flip-01a.mp3');
    audio.play();
  }, [page]);

  return (
    <>
      <Loader />
      <Canvas
        camera={{
          position: [1, 0, window.innerWidth > 800 ? 4 : 9],
          fov: 40,
        }}
      >
        <Suspense fallback={null}>
          <Float
            rotation-x={-Math.PI / 8}
            rotation-z={window.innerWidth < 800 ? Math.PI / 2 : 0}
            floatIntensity={1}
            speed={0.1}
            rotationIntensity={0}
          >
            <Book />
          </Float>
          <OrbitControls />

          <ambientLight intensity={1.5} />
          <directionalLight position={[0, 10, 5]} intensity={2} />
        </Suspense>
      </Canvas>
    </>
  );
};

export default Album;
