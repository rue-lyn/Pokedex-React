import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    async function getPokemon() {
      try {
        // Get all Pokémon from PokéAPI
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=1351"
        );

        const data = await response.json();

        // Get the details of every Pokémon
        const pokemonData = await Promise.all(
          data.results.map(async (item) => {
            const response = await fetch(item.url);
            return response.json();
          })
        );

        setPokemon(pokemonData);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    getPokemon();
  }, []);

  // Search Pokémon
  const filteredPokemon = pokemon.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>

      {/* HEADER */}

      <div className="header">
        <h1>Pokédex</h1>
        <p>Explore the world of Pokémon</p>
      </div>


      {/* SEARCH */}

      <div className="search-container">

        <input
          type="text"
          placeholder="Search Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>


      {/* LOADING */}

      {loading && (
        <h2 className="loading">
          Loading Pokémon...
        </h2>
      )}


      {/* POKÉMON CONTAINER */}

      {!loading && (
        <div className="pokemon-container">

          {filteredPokemon.map((item) => (

            <div
              className="pokemon-card"
              key={item.id}
              onClick={() => setSelectedPokemon(item)}
            >

              {/* IMAGE */}

              <img
                src={
                  item.sprites.other[
                    "official-artwork"
                  ].front_default
                }
                alt={item.name}
              />


              {/* NAME */}

              <h2>{item.name}</h2>


              {/* NUMBER */}

              <p className="number">
                #{String(item.id).padStart(3, "0")}
              </p>


              {/* TYPES */}

              <div className="types">

                {item.types.map((type) => (

                  <span
                    className={"type " + type.type.name}
                    key={type.type.name}
                  >
                    {type.type.name}
                  </span>

                ))}

              </div>


              {/* BASIC INFORMATION */}

              <div className="info">

                <p>
                  Height: {item.height / 10} m
                </p>

                <p>
                  Weight: {item.weight / 10} kg
                </p>

              </div>

            </div>

          ))}

        </div>
      )}


      {/* NOT FOUND */}

      {!loading && filteredPokemon.length === 0 && (
        <h2 className="not-found">
          Pokémon not found.
        </h2>
      )}


      {/* POKÉMON DETAILS */}

      {selectedPokemon && (

        <div
          className="details-container"
          onClick={() => setSelectedPokemon(null)}
        >

          <div
            className="details-card"
            onClick={(e) => e.stopPropagation()}
          >

            {/* CLOSE BUTTON */}

            <button
              className="close-button"
              onClick={() => setSelectedPokemon(null)}
            >
              ×
            </button>


            {/* IMAGE */}

            <img
              src={
                selectedPokemon.sprites.other[
                  "official-artwork"
                ].front_default
              }
              alt={selectedPokemon.name}
            />


            {/* NAME */}

            <h2>{selectedPokemon.name}</h2>


            {/* NUMBER */}

            <p className="number">
              #{String(selectedPokemon.id).padStart(3, "0")}
            </p>


            {/* TYPES */}

            <div className="types">

              {selectedPokemon.types.map((type) => (

                <span
                  className={"type " + type.type.name}
                  key={type.type.name}
                >
                  {type.type.name}
                </span>

              ))}

            </div>


            {/* INFORMATION */}

            <div className="details-info">

              <p>
                <strong>Height:</strong>{" "}
                {selectedPokemon.height / 10} m
              </p>

              <p>
                <strong>Weight:</strong>{" "}
                {selectedPokemon.weight / 10} kg
              </p>

              <p>
                <strong>Abilities:</strong>{" "}
                {selectedPokemon.abilities
                  .map(
                    (ability) =>
                      ability.ability.name
                  )
                  .join(", ")}
              </p>

            </div>


            {/* BASE STATS */}

            <div className="stats">

              <h3>Base Stats</h3>

              {selectedPokemon.stats.map((stat) => (

                <div
                  className="stat"
                  key={stat.stat.name}
                >

                  <span>
                    {stat.stat.name}
                  </span>

                  <span>
                    {stat.base_stat}
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;