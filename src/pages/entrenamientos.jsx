import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import ReactModal from "react-modal"
import Headers from "../components/Headers"
import { setearPrioridad } from "../funciones/setearPrioridad"
import estilos from "../components/Modal.module.css"

export default function Entrenamientos() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [prioridad, setPrioridad] = useState("")
  const [entrenamiento, setEntrenamiento] = useState()
  const [data, setData] = useState()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [nuevaPrioridad, setNuevaPrioridad] = useState(false)
  const MENSAJE_DE_ERROR =
    "Algo no ha ido bien y no hemos podido recuperar los entrenamientos... Por favor, contacta con un administrador"

  //FUNCIONES ---->

  // setea al estado "Prioridad" su valor al cambiar en el input
  const onChangePrioridad = (e) => {
    setPrioridad(e.target.value)
  }

  //Abre el modal al hacer click en el botón de editar y le pasa el entrenamiento para guardar su ID y poder actualizarlo
  const abrirModal = (e) => {
    setIsModalOpen(true)
    setEntrenamiento(e)
  }

  // Comprueba si el entrenamiento está en la lista. Si está, le pone el fondo rojo
  const calcularClassName = (prioridad) => {
    if (prioridad == "Alta") {
      return "bg-red-500 "
    }
    if (prioridad == "Media") {
      return "bg-yellow-500"
    }
    if (prioridad == "Baja") {
      return "bg-green-500"
    }
  }

  // Llama al metodo PUT y guarda la nueva prioridad del ejercicio
  const cambiarLaPrioridad = (e, prioridad) => {
    setearPrioridad(e, prioridad)
    setNuevaPrioridad(true)
  }

  // Llama a fetch GET para obtener los entrenamientos
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      fetch("http://fitlaif-back-production.up.railway.app/entrenamientos")
        .then((response) => response.json())
        .then(setData)
        .catch(setError)
        .finally(() => setLoading(false))
    }
    fetchData()
    setNuevaPrioridad(false)
    setIsModalOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nuevaPrioridad])


  //RENDERIZADOS ----->

  if (loading) {
    return (
      <>
        <Headers
          title={"Entrenamientos | FitLaif"}
          description={"Guarda, selecciona, borra, o edita tus entrenamientos"}
        ></Headers>
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
      </>
    )
  }

  if (error) {
    return (
      <>
        <Headers
          title={"Entrenamientos | FitLaif"}
          description={"Guarda, selecciona, borra, o edita tus entrenamientos"}
        ></Headers>
        {MENSAJE_DE_ERROR}
      </>
    )
  }

  return (
    <div className="container mx-auto">
      <Headers
        title="Entrenamientos | Fitlaif"
        description="Guarda, selecciona, borra, o edita tus entrenamientos"
      ></Headers>
      <h1 className="text-center">¿Qué vamos a entrenar hoy?</h1>
      <h3 className="text-center">
        En esta sección podrás elegir uno de los siguientes músculo y nosotros
        te haremos una rutina compuesta de 4 ejercicios, o tú mismo elegirás los
        ejercicios y registrarás tus PR!🏋🏻‍♀️
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 justify-items-center">
        {data?.map((e, index) => (
          <div
            className="max-w-md mx-auto rounded overflow-hidden shadow-lg hover:shadow-xl transition duration-500 !bg-gray-900"
            key={e.entrenamientoId}
            suppressHydrationWarning={true}
          >
            <div className="relative h-auto">
              <Link
                href={`/entrenamientos/${e.entrenamientoId}`}
                key={e.entrenamientoId}
              >
                <div>
                  <Image
                    className="w-full h-auto"
                    width={400}
                    height={400}
                    src={e.img}
                    alt="Entrenamiento"
                    priority={index}
                  />
                </div>
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2 text-center">
                    {e.musculo}
                  </div>
                  <p className="text-white text-center">{e.descripcion}</p>
                </div>
              </Link>
            </div>
            <div className="text-white text-center">
              Prioridad / Frecuencia
              <div className=" relative px-6 pt-4 pb-2">
                <span
                  className={
                    "inline-block rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 text-white " +
                    calcularClassName(e.prioridad)
                  }
                >
                  <b>{e.prioridad}</b>
                </span>
                <Image
                  onClick={() => abrirModal(e)}
                  className="float-right mt-2"
                  src={"/iconos/editar.png"}
                  width={25}
                  height={25}
                  alt="Editar frecuencia"
                />
              </div>
            </div>
            <ReactModal
              ariaHideApp={false}
              className={estilos.customModal}
              isOpen={isModalOpen}
              style={{
                overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
                content: {
                  width: "350px",
                  height: "300px",
                  margin: "auto",
                },
              }}
            >
              <h3 className={`${estilos.entreno} text-center`}>
                ¿Que prioridad tiene este músculo para ti?
              </h3>
              <div className="grid grid-cols-1 justify-items-center  space-x-6 gap-10 content-center">
                <div className="flex space-x-8 text-gray-700">
                  <input
                    onChange={onChangePrioridad}
                    type="radio"
                    value="Alta"
                    name="prioridad"
                  />
                  <b>Alta</b>
                  <input
                    onChange={onChangePrioridad}
                    type="radio"
                    value="Media"
                    name="prioridad"
                  />
                  <b>Media</b>
                  <input
                    onChange={onChangePrioridad}
                    type="radio"
                    value="Baja"
                    name="prioridad"
                  />
                  <b>Baja</b>
                </div>
                <div className="flex">
                  <button
                    type="button"
                    className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    onClick={() => cambiarLaPrioridad(entrenamiento, prioridad)}
                  >
                    Establecer
                  </button>
                  <button
                    type="button"
                    className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </ReactModal>
          </div>
        ))}
      </div>
      <div></div>
    </div>
  )
}
