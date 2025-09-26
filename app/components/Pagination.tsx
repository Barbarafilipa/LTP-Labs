import { Link, useLocation } from "@remix-run/react";

function Pagination({ page, total, pageSize }: { page: number; total: number; pageSize: number }) {
  const location = useLocation();
  const totalPages = Math.ceil(total / pageSize);

  // Gera um array de páginas a mostrar
  const getPageNumbers = () => {
    let start = Math.max(page - 2, 1);
    let end = Math.min(start + 4, totalPages);
    if (end - start < 4) start = Math.max(end - 4, 1);
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  // Mantém os outros parâmetros
  const createLink = (pageNum: number) => {
    const params = new URLSearchParams(location.search);
    params.set("page", pageNum.toString());
    return `?${params.toString()}`;
  };

  return (
    <div className="flex items-center space-x-1">
      {page > 1 && (
        <Link to={createLink(Math.max(page - 1, 1))} className="px-3 py-1 rounded hover:bg-midnight/60">&lt;</Link>
      )}

      {getPageNumbers().map((p) => (
        <Link
          key={p}
          to={createLink(p)}
          className={`px-3 py-1 rounded ${p === page ? "bg-midnight text-white" : "hover:bg-midnight/60"}`}
        >
          {p}
        </Link>
      ))}

      <Link to={createLink(Math.min(page + 1, totalPages))} className="px-3 py-1 rounded hover:bg-midnight/60">&gt;</Link>
    </div>
  );
}

export default Pagination;
