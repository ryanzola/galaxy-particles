import * as THREE from 'three'

import Experience from './Experience'

import vertex from './shaders/canvas/vertex.glsl'
import fragment from './shaders/canvas/fragment.glsl'

function lerp(a, b, t) {
  return a * (1 - t) + b * t
}

export default class Canvas
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.config = this.experience.config
        this.resources = this.experience.resources
        this.time = this.experience.time

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.point = new THREE.Vector3()

        this.materials = []
        this.geos = []

        this.options = [
          {
            min_radius: 0.5,
            max_radius: 1.5,
            rotation_speed: 1,
            color: '#f7b37b',
            size: 1,
            count: 5000,
            amp: 1
          },
          {
            min_radius: 0.5,
            max_radius: 1.5,
            rotation_speed: 1,
            color: '#88b3ce',
            size: 0.5,
            count: 10000,
            amp: 3
          },
          {
            min_radius: 0.5,
            max_radius: 1.5,
            rotation_speed: 1,
            color: '#0077aa',
            size: 0.5,
            count: 5000,
            amp: 0
          },
          {
            min_radius: 0.5,
            max_radius: 1.5,
            rotation_speed: 0.75,
            color: '#66aaff',
            size: 2,
            count: 50,
            amp: 0
          },
          {
            min_radius: 0.5,
            max_radius: 1.5,
            rotation_speed: 1,
            color: '#aa0000',
            size: 2,
            count: 5,
            amp: 0
          },
        ]

        this.options.forEach((opt, i) => {
          this.addObjects(opt)
          this.setMaterial(opt)
          this.setMesh(this.geos[i], this.materials[i])
        })

        this.raycasterEvent()
    }

    raycasterEvent(e) {
      let mesh = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(10, 10, 10, 10).rotateX(-Math.PI/2),
        new THREE.MeshBasicMaterial({ color: 0x88b3ce, wireframe: true })
      )

      let test = new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.1, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x0000ff })
      )
      // this.scene.add(test)
      window.addEventListener('pointermove', e => {
        // calculate mouse position in normalized device coordinates
        // -1 to +1 for both axes
        const x = (e.clientX / window.innerWidth) * 2 - 1
        const y = - (e.clientY / window.innerHeight) * 2 + 1
        this.mouse.set(x, y)

        // update the picking ray with the camera and pointer position
        this.raycaster.setFromCamera( this.mouse, this.camera.instance );

        // calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects([mesh]);

        if(intersects[0]) {
          test.position.copy(intersects[0].point)
          this.point.copy(intersects[0].point)
        }
      })
    }

    addObjects(opts) {
      const particleGeometry = new THREE.PlaneBufferGeometry(1, 1)
      const geo = new THREE.InstancedBufferGeometry()
      geo.instanceCount = opts.count
      geo.setAttribute('position', particleGeometry.getAttribute('position'))
      geo.index = particleGeometry.index

      let pos = new Float32Array(opts.count * 3)

      for (let i = 0; i < opts.count; i++) {
        let theta = Math.random() * 2 * Math.PI
        let r = lerp(opts.min_radius, opts.max_radius, Math.random())

        let x = r * Math.sin(theta)
        let y = (Math.random() - 0.5) * 0.1
        let z = r * Math.cos(theta)

        pos.set([ x, y, z ], i * 3)
        geo.setAttribute('pos', new THREE.InstancedBufferAttribute(pos, 3, false))
      }

      this.geos.push(geo)
    }

    setMaterial(opts) {
      const material = new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthTest: false,
        uniforms: {
          uAmp: { value: opts.amp },
          uColor: { value: new THREE.Color(opts.color) },
          uMouse: { value: new THREE.Vector3() },
          uRotAmp: { value: opts.rotation_speed },
          uSize: { value: opts.size },
          uTexture: { value: this.resources.items.particle4 },
          uTime: { value: 0.0 }
        }
      })

      this.materials.push(material)
    }

    setMesh(geo, mat) {
      const points = new THREE.Mesh(geo, mat)
      this.scene.add(points)
    }

    update() {
      this.materials.forEach(material => {
        material.uniforms.uTime.value = this.time.elapsed * 0.002
        material.uniforms.uMouse.value = this.point
      })
    }
}