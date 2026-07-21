export default function PermissionDenied() {
  return (
    <div role="alert" className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="text-5xl mb-4" aria-hidden="true" style={{ color: '#C9A22744' }}>◇</div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: '#F8F4EC' }}>Access Restricted</h3>
      <p className="text-sm max-w-sm" style={{ color: '#D8A7B1' }}>
        You do not have permission to view this page. Contact your administrator if you believe this is an error.
      </p>
    </div>
  );
}
