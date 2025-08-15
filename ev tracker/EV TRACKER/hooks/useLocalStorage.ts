// Ce hook n'est plus utilisé. Les données sont désormais persistées dans Firestore
// pour permettre la synchronisation entre les appareils et une meilleure persistance.
// Le fichier est conservé pour éviter de casser le processus de build lors de la transition.

const useLocalStorage = () => {
  // La logique a été migrée vers AppContext et AuthContext avec Firebase.
};

export default useLocalStorage;