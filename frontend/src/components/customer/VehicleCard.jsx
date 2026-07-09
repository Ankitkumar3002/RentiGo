import { Link } from "react-router-dom";

const VehicleCard = ({ vehicle }) => {
  const { _id, brand, model, type, fuelType, year, pricing, status, photos } = vehicle;

  const statusLabel = status === "available" ? "Available" : "Limited";

  return (
    <Link to={`/vehicles/${_id}`} className="vehicle-card">
      <div className="vehicle-card-img">
        {photos?.[0]
          ? <img src={photos[0]} alt={`${brand} ${model}`} />
          : <span className="vehicle-card-placeholder">{type === "2-wheeler" ? "🏍️" : "🚗"}</span>}
      </div>
      <div className="vehicle-card-body">
        <h3>{brand} {model}</h3>
        <p className="vehicle-card-meta">{type} · {fuelType} · {year}</p>
        <div className="vehicle-card-footer">
          <span className="vehicle-card-price">
            ₹{pricing?.daily ?? "—"} <small>/day</small>
          </span>
          <span className={`badge badge-${status}`}>{statusLabel}</span>
        </div>
      </div>
    </Link>
  );
};

export default VehicleCard;
