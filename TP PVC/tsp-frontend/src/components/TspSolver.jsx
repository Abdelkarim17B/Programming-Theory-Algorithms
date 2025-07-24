import React, { useState } from "react";
import '../index.css';

function TspSolver() {
  const [input, setInput] = useState(""); // Pour saisir les distances sous forme JSON
  const [result, setResult] = useState(null); // Résultats du backend
  const [error, setError] = useState(null); // Pour afficher les erreurs éventuelles

  const solveTsp = async () => {
    setError(null); // Réinitialiser les erreurs
    try {
      // Vérifier si le JSON est valide
      const distances = JSON.parse(input);
      console.log("Payload envoyé :", { distances, start_city: 0 });

      // Envoyer une requête POST au backend
      const response = await fetch("http://localhost:3000/solve-tsp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          distances: distances,
          start_city: 0,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur du backend :", errorText);
        setError(`Erreur du backend : ${response.status} - ${errorText}`);
        return;
      }

      // Lire la réponse JSON
      const data = await response.json();
      console.log("Réponse du backend :", data);
      setResult(data); // Mettre à jour les résultats
    } catch (err) {
      console.error("Erreur lors de la résolution du TSP :", err);
      setError("Une erreur s'est produite. Vérifiez vos données.");
    }
  };

  return (
    <div className="tsp-container">
  <h1>Problème du Voyageur de Commerce</h1>

  {/* Zone de saisie */}
  <textarea
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Entrez la matrice des distances (JSON)"
  />
  <button onClick={solveTsp}>Résoudre</button>

  {/* Affichage des erreurs */}
  {error && <p className="error">{error}</p>}

  {/* Résultats */}
  {result && (
    <div>
      <h2>Résultats</h2>

      <div>
        <h3>Méthode exacte</h3>
        <p>
          Cycle : <span>{result.exact.cycle.join(" → ")}</span>
        </p>
        <p>Coût : {result.exact.cost}</p>
        <p>Temps : {result.exact.elapsed}</p>
      </div>

      <div>
        <h3>Méthode heuristique</h3>
        <p>
          Cycle : <span>{result.heuristic.cycle.join(" → ")}</span>
        </p>
        <p>Coût : {result.heuristic.cost}</p>
        <p>Temps : {result.heuristic.elapsed}</p>
      </div>
    </div>
  )}
</div>

  );
}

export default TspSolver;
