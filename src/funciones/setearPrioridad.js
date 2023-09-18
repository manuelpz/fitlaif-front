export const setearPrioridad = (entrenamiento, nuevaPrioridad) => {
  let entrenamientoId = entrenamiento.entrenamientoId
  let musculo = entrenamiento.musculo
  let img = entrenamiento.img
  let descripcion = entrenamiento.descripcion
  let prioridad = nuevaPrioridad

  const data = {
    entrenamientoId,
    musculo,
    img,
    descripcion,
    prioridad,
  }

  fetch("fitlaif-back-production.up.railway.app/entrenamientos/actualizar", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
}
