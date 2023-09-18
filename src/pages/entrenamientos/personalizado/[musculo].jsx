import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import Headers from "../../../components/Headers"
import Image from "next/image"
import CartaMusculoPersonalizado from "../../../components/CartaMusculoPersonalizado"

export default function Rutina() {
  const [ejercicio, setEjercicio] = useState([])
  const router = useRouter()
  const [misEjercicios, setMisEjercicios] = useState([])
  const [enable, setEnable] = useState(false)
  const { musculo } = router.query

  //FUNCIONES
  const reload = () => {
    window.location.reload()
  }

  const seleccionarEjercicio = (ejercicioSeleccionado) => {
    if (!misEjercicios.includes(ejercicioSeleccionado)) {
      setMisEjercicios([...misEjercicios, ejercicioSeleccionado])
    } else {
      setMisEjercicios(
        misEjercicios.filter((ejercicio) => ejercicio !== ejercicioSeleccionado)
      )
    }
  }

  const estaSeleccionado = (ejercicio) => {
    if (misEjercicios.includes(ejercicio)) {
      return "!bg-red-500"
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://13.38.93.125:8080/ejercicios")
      const data = await response.json()
      setEjercicio(
        data.filter((e) => e.musculo.toLowerCase() === musculo.toLowerCase())
      )
    }
    if (musculo) {
      fetchData()
    }
  }, [musculo])

  //PÁGINA QUE MUESTRO MIENTRAS CARGA LOS EJERCICIOS
  if (ejercicio.length === 0) {
    return (
      <div>
        <Headers title="Entreamiento | FitLaif" />
        <h1>Cargando ejercicios...</h1>
      </div>
    )
  }

  //RENDERIZADO NORMAL ELIGIENDO EJERCICIOS
  if (enable === false) {
    return (
      <div className="container mx-auto">
        <Headers
          title={"Entreamiento | FitLaif"}
          description={"Entrenamiento personalizado | FitLaif"}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
          {ejercicio.map((e) => (
            <div
              onClick={() => seleccionarEjercicio(e)}
              key={e.ejercicioId}
              className={`max-w-md w-full rounded overflow-hidden shadow-lg bg-gray-900 text-white ${estaSeleccionado(
                e
              )}`}
            >
              <div className="p-4">
                <div className="font-bold text-center">
                  {e.ejercicio.toUpperCase()}
                </div>
                {e.img ? (
                  <div className="mt-4">
                    <Image
                      className="w-full h-auto"
                      src={e.img}
                      width={300}
                      height={300}
                      alt="Imagen explicativa del ejercicio"
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          ))}
        </div>
        <br />
        <button type="button" onClick={() => setEnable(true)}>
          Comenzar
        </button>
      </div>
    )
  }

  //RENDERIZADO NORMAL CON LOS EJERCICIOS YA ELEGIDOS
  if (misEjercicios.length > 0 && enable === true) {
    return (
      <div className="container mx-auto">
        <Headers
          title={"Entrenamiento | FitLaif"}
          description={"Entrenamiento personalizado | FitLaif"}
        />
        <div className="flex flex-col items-center">
          <CartaMusculoPersonalizado ejerciciosElegidos={misEjercicios} />
        </div>
      </div>
    )
  }

  //SE PULSA EL BOTON SIN AÑADIR EJERCICIOS
  if (misEjercicios.length === 0 && enable === true) {
    return (
      <div>
        <h1>Añade ejercicios tio</h1>
        <button type="button" onClick={reload}>
          Volver
        </button>
      </div>
    )
  }
}
