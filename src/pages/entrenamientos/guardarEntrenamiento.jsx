import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Link from "next/link"
import { useRouter } from "next/router"
import Headers from "../../components/Headers"

export default function GuardarEntrenamiento() {
  const router = useRouter()
  const [entrenamientoId, setEntrenamientoId] = useState("")
  const [musculo, setMusculo] = useState("")
  const [img, setImg] = useState("")
  const [prioridad, setprioridad] = useState("")
  const [ultimoId, setUltimoId] = useState("")

  const handleOptionChange = (event) => {
    setprioridad(event.target.value)
  }

  const fetchData = async () => {
    const response = await fetch("fitlaif-back-production.up.railway.app/entrenamientos")
    const data = await response.json()
    setUltimoId(data.length + 1)
  }

  useEffect(() => {
    fetchData()
    setEntrenamientoId(ultimoId)
  }, [entrenamientoId, ultimoId])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = {
      entrenamientoId,
      musculo,
      img,
      prioridad,
    }

    try {
      if (musculo != null && musculo.trim().length) {
        if (prioridad != null && prioridad.trim().length) {
          const response = await fetch(
            "fitlaif-back-production.up.railway.app/entrenamientos/guardar",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          )
          setMusculo("")
          setImg("")
          setprioridad([])

          if (response.ok) {
            toast.success("¡WOOOOOW! Tenemos otro músculo más, ¡a mutar!")
            router.push("/entrenamientos")
          } else {
            toast.error("Parece que ya estamos trabajando ese músculo...")
          }
        } else {
          toast.error("¿Que prioridad tiene este músculo en tus rutinas?")
        }
      } else {
        toast.error("Debes añadir al menos un músculo, ¿no crees?")
      }
    } catch (error) {
      toast.error(
        "Error en el servidor, ponte en contacto con un administrador"
      )
    }
  }
  return (
    <div>
      <Headers
        title={"Nuevo músculo"}
        description={"Guarda tu nuevo musculo para luego entrenarlo"}
      ></Headers>
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              MUSCULO
            </label>
            <input
              value={musculo}
              onChange={(e) => setMusculo(e.target.value)}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="grid-first-name"
              type="text"
              placeholder="Femoral"
            />
            <p className="text-red-500 text-xs italic">Campo obligatorio</p>
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-last-name"
            >
              prioridad
            </label>
            <label>
              <input
                type="radio"
                value="Alta"
                checked={prioridad === "Alta"}
                onChange={handleOptionChange}
              />
              Alta
            </label>
            <br />
            <label>
              <input
                type="radio"
                value="Media"
                checked={prioridad === "Media"}
                onChange={handleOptionChange}
              />
              Media
            </label>
            <br />
            <label>
              <input
                type="radio"
                value="Baja"
                checked={prioridad === "Baja"}
                onChange={handleOptionChange}
              />
              Baja
            </label>
          </div>
        </div>
        <button type="submit">Enviar</button>
        <Link href={"/entrenamientos"}>
          <button>Volver</button>
        </Link>
      </form>
    </div>
  )
}
