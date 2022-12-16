const registerServiceWorker = () =>{
    navigator.serviceWorker
  .register("https://kodeweb21.github.io/punch-history/sw.js")
  .then((register) => {
    console.log('Service Worker Registrado');
  })
  .catch((err) => {
    console.error("No se pudo registrar el Service Worker");
  });
}

export default registerServiceWorker;