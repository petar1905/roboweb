export default function RobotCard() {
  return (
    <div className="card" style={{width: "18rem"}}>
      <img src="/misty.avif" className="card-img-top" alt="..."></img>
      <div className="card-body text-center">
        <h5 className="card-title">Card title</h5>
        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        <a href="#" className="btn btn-primary">Go somewhere</a>
      </div>
    </div>
  )
}