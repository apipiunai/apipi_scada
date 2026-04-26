import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Center } from '@react-three/drei';

function Model({ url }) {
  // Nota: asegúrate de que los archivos .glb existan en /public o la ruta sea correcta
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function ModelViewer({ model }) {
  if (!model) return <div>No model specified</div>;

  return (
    <div style={{ width: '100%', height: '70vh', background: '#111', borderRadius: '12px', overflow: 'hidden' }}>
      <Canvas shadows camera={{ position: [0, 0, 300], fov: 50 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={1}>
            <Center>
              <Model url={model} />
            </Center>
          </Stage>
          <OrbitControls makeDefault autoRotate />
        </Suspense>
      </Canvas>
      <div style={{ padding: '10px', color: '#fff', fontSize: '10px', textAlign: 'center' }}>
        Rendering: {model} (LMB to Rotate, RMB to Pan, Scroll to Zoom)
      </div>
    </div>
  );
}