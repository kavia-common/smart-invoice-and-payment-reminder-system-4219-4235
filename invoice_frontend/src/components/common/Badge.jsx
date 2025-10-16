export default function Badge({ color = 'primary', children }) {
  return <span className={`badge badge-${color}`}>{children}</span>;
}
