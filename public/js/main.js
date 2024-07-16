const boton = document.querySelector("#btn-borar");

function borrar() {
  //console.log("borrar");
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Post eliminado",
    showConfirmButton: false,
    timer: 1500,
  });
}

// boton.addEventListener("click", borrar);
