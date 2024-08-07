import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber'
import { useFBO, useGLTF, useScroll, Text, Image, Scroll, Preload, ScrollControls, MeshTransmissionMaterial, Html } from '@react-three/drei'
import { easing } from 'maath'
import Sections from './Sections.jsx'

export default function App() {
  return (
    <>
      <Canvas camera={{ position: [0, 0, 20], fov: 20 }}>
        <ScrollControls damping={0.2} pages={5} distance={0.5}>
          <Lens>
            <Scroll>
              <Typography text="Carlos Rojas" position={[0, 0, 10]} />
              <Images />

              <Html className="htmlSaludo" position={[-0.5, -0.3, 11]}>
                Profesional con 18 años de experiencia en fotografía y en transición hacia TI. Estudiante de quinto cuatrimestre
                TSU/Ingeniería TI en entornos virtuales y negocios digitales, con habilidades en modelado 3D (Blender) y desarrollo en Unity
                y Godot.
                <br />
                <br /> Experiencia en programación web (HTML, JavaScript, CSS) y en aplicaciones con React y React Native.
              </Html>

              <Typography text="Estudios" position={[0, -3, 10]} />
              <Html className="htmlSaludo" position={[-0.5, -3.3, 11]}>
                TSU/Ingeniería TI en Entornos Virtuales y Negocios Digitales. Universidad Tecnológica de la Riviera Maya. 2022 - Actualidad
                (Quinto cuatrimestre).
                <br />
                <br />
                Programa Oracle NEXT Education. 2023 Bachillerato en artes y humanidades CEDART Ignacio Mariano de las Casas.
              </Html>
              <Typography text="Proyectos" position={[0, -6, 10]} />
              <Html className="htmlSaludo" position={[-0.5, -6.3, 11]}>
                SAVY (web; html, css, Javascript) Calculadora de precios para supermercado.
                https://j-carlosrojas.github.io/calculadora_Para_Supermercado La Oferta (web; React) Juego online
                https://la-oferta.vercel.app/
              </Html>
            </Scroll>
            <Preload />
          </Lens>
        </ScrollControls>
      </Canvas>
    </>
  )
}

function Lens({ children, damping = 0.25, ...props }) {
  const ref = useRef()
  const { nodes } = useGLTF('/lens-transformed.glb')
  const buffer = useFBO()
  const viewport = useThree((state) => state.viewport)
  const [scene] = useState(() => new THREE.Scene())
  useFrame((state, delta) => {
    // Tie lens to the pointer
    // getCurrentViewport gives us the width & height that would fill the screen in threejs units
    // By giving it a target coordinate we can offset these bounds, for instance width/height for a plane that
    // sits 15 units from 0/0/0 towards the camera (which is where the lens is)
    const viewport = state.viewport.getCurrentViewport(state.camera, [0, 0, 15])
    easing.damp3(
      ref.current.position,
      [(state.pointer.x * viewport.width) / 2, (state.pointer.y * viewport.height) / 2, 15],
      damping,
      delta
    )
    // This is entirely optional but spares us one extra render of the scene
    // The createPortal below will mount the children of <Lens> into the new THREE.Scene above
    // The following code will render that scene into a buffer, whose texture will then be fed into
    // a plane spanning the full screen and the lens transmission material
    state.gl.setRenderTarget(buffer)
    state.gl.setClearColor('#d8d7d7')
    state.gl.render(scene, state.camera)
    state.gl.setRenderTarget(null)
  })
  return (
    <>
      {createPortal(children, scene)}
      <mesh scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} />
      </mesh>
      <mesh scale={0.25} ref={ref} rotation-x={Math.PI / 2} geometry={nodes.Cylinder.geometry} {...props}>
        <MeshTransmissionMaterial buffer={buffer.texture} ior={1.2} thickness={2.5} anisotropy={0.3} chromaticAberration={0.05} />
      </mesh>
    </>
  )
}

function Images() {
  const group = useRef()
  const data = useScroll()
  const { width, height } = useThree((state) => state.viewport)
  useFrame(() => {
    group.current.children[0].material.zoom = 1 + data.range(0, 1 / 3) / 3
  })
  return (
    <group ref={group}>
      <Image position={[-2, 0, 0]} scale={[4, height, 1]} url="/img1.jpg" />
    </group>
  )
}

function Typography({ text, position }) {
  const state = useThree()
  const { width, height } = state.viewport.getCurrentViewport(state.cameta, [0, 0, 12])
  const shared = { font: '/Inter-Regular.woff', letterSpacing: -0.1, color: 'grey' }
  return (
    <>
      <Text children={text} anchorX="center" position={position} {...shared} />
    </>
  )
}
