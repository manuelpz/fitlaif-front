import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import Headers from "../../../components/Headers"
import CartaMusculo from "../../../components/CartaMusculo"
export default function Rutina() {
  const [ejercicio, setEjercicio] = useState([])
  const router = useRouter()
  let contador = 0
  let ejerciciosElegidos = []
  const { musculo } = router.query

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://13.38.93.125:8080/ejercicios")
      const data = await response.json()
      setEjercicio(
        data.filter(
          (e) => e.musculo.toLowerCase() === musculo.toLocaleLowerCase()
        )
      )
    }
    if (musculo) {
      fetchData()
    }
  }, [musculo])

  //FUNCION PARA OBTENER NUMEROS ALEATORIOS
  const obtenerEntrenamientosAleatorios = (entrenamientos) => {
    return Math.floor(Math.random() * entrenamientos)
  }

  //PÁGINA QUE MUESTRO MIENTRAS CARGA LOS EJERCICIOS
  if (ejercicio.length === 0) {
    return (
      <div>
        <Headers title="Rutina" />
        <div className="spinnerContainer">
          <div className="spinner"></div>
          <div className="loader">
            <p>Cargando</p>
            <div className="words">
              <span className="word">entrenamientos</span>
              <span className="word">pilas</span>
              <span className="word">energia</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  //ELIGE 4 EJERCICIOS ALEATORIOS
  if (ejercicio.length > 0) {
    while (contador != 4) {
      let elegido = ejercicio[obtenerEntrenamientosAleatorios(ejercicio.length)]
      if (!ejerciciosElegidos.includes(elegido)) {
        ejerciciosElegidos.push(elegido)
        contador++
      }
    }
  }

  //RENDERIZADO NORMAL
  return (
    <div>
      <Headers title={"Rutina"} description={"Rutina preparada por FitLaif"} />
      <CartaMusculo
        ejerciciosElegidos={ejerciciosElegidos ? ejerciciosElegidos : []}
      />
    </div>
  )
}
