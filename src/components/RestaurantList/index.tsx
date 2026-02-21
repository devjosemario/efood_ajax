import type { Restaurant } from '../../models/Restaurant'

type Props = {
  restaurants: Restaurant[]
  selectedRestaurantId: number | null
  onSelectRestaurant: (id: number) => void
}

export default function RestaurantList({ restaurants, selectedRestaurantId, onSelectRestaurant }: Props) {
  return (
    <div className="grid">
      {restaurants.map((r) => (
        <article className="card" key={r.id}>
          <img className="card-img" src={r.capa} alt={`Capa do restaurante ${r.titulo}`} />
          <div className="card-body">
            <div className="card-top">
              <h3>{r.titulo}</h3>
              <span className="badge">{r.avaliacao}</span>
            </div>

            <p className="muted" style={{ marginTop: 8 }}>
              <span className="badge secondary" style={{ marginRight: 8 }}>{r.tipo}</span>
              {r.destacado ? <span className="badge">Destaque</span> : null}
            </p>

            <p className="muted">{r.descricao}</p>

            <button
              className="btn"
              onClick={() => onSelectRestaurant(r.id)}
              aria-pressed={selectedRestaurantId === r.id}
            >
              Ver cardápio
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
