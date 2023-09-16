export const guardarEjercicioPersonalizado = (
  ejercicio,
  series,
  repeticiones,
  peso,
  usuario,
  pr
) => {
  const data = {
    ejercicio,
    series,
    repeticiones,
    peso,
    usuario,
    pr,
  }

  fetch("http://localhost:8080/ejerciciosPersonalizados/actualizar", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
}