export default function WidgetCard({ title, children, footer }) {
  /** Simple card wrapper for dashboard/widgets */
  return (
    <div className="card widget">
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}
