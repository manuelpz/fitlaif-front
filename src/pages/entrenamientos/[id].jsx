import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Headers from "../../components/Headers"

export default function EntrenamientoFuncion() {
  const router = useRouter()
  const { id } = router.query
  const [entrenamientos, setEntrenamientos] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchEntrenamientos = async () => {
      try {
        const response = await fetch(
          `https://13.38.93.125:8080/entrenamientos/${id}`
        )
        const data = await response.json()
        setEntrenamientos(data)
        setIsLoading(false)
      } catch (error) {
        setError(true)
        setIsLoading(false)
      }
    }
    if (id) {
      fetchEntrenamientos()
    }
  }, [id])

  if (isLoading) {
    return (
      <div>
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

  if (error) {
    return (
      <div>
        Estamos teniendo problemas para acceder a este entrenamiento, lo
        arreglaremos lo antes posible, disculpa las molestias
      </div>
    )
  }
  return (
    <div className="container mx-auto">
      <Headers
        title="Entrenamiento"
        description="Entrenamiento personalizado"
      />
      {entrenamientos?.musculo ? (
        <div>
          <h1 className="text-center">
            ¿Listo para tu entrenamiento de{" "}
            {entrenamientos.musculo.toLowerCase()}?
          </h1>
          <br />
          <h2 className="text-center">¡A reventarlo!</h2>
        </div>
      ) : (
        entrenamientos?.message
      )}
      <div className="grid grid-cols-2 gap-2 justify-center">
        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 justify-self-center text-center">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            ¡DAME UNA RUTINA!
          </h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            Deja que nosotros te armemos hoy la rutina que vas a seguir,
            compuesta por 4 ejercicios, y preocupate tan solo de darlo todo
          </p>
          <Link
            href={`/entrenamientos/generar/${entrenamientos?.musculo}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Muestrame esa rutina
            <svg
              aria-hidden="true"
              className="w-4 h-4 ml-2 -mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Link>
        </div>

        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 text-center justify-self-center">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            YO ME ENCARGO
          </h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            Elige tus ejercicios, arma tu propia rutina, y registra tus avances
            y records personales (PR)
          </p>
          <Link
            href={`/entrenamientos/personalizado/${entrenamientos?.musculo}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Elegir mis ejercicios
            <svg
              aria-hidden="true"
              className="w-4 h-4 ml-2 -mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
