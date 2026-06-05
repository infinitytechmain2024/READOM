/** Stand-in for Scriptorium areas not yet built in this first slice. */
const Placeholder = ({ title }: { title: string }) => (
  <div className="card placeholder">
    <div className="pt">{title}</div>
    <p>This area is part of the Scriptorium prototype scope. The shell, navigation, and design system are ready — it can be built out next.</p>
  </div>
);

export default Placeholder;
