import { useEffect, useRef } from 'react'
import type { Product } from '../../models/Restaurant'

type Props = {
  product: Product
  onClose: () => void
  onAddToCart: (product: Product) => void
}

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function ProductModal({ product, onClose, onAddToCart }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    closeBtnRef.current?.focus()
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [onClose])

  return (
    <div className="modal-overlay is-open" aria-hidden="false"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <button ref={closeBtnRef} className="modal-close" onClick={onClose} aria-label="Fechar">
          ×
        </button>

        <div className="modal-content">
          <img className="modal-img" src={product.foto} alt={product.nome} />
          <div className="modal-info">
            <h3 id="modalTitle">{product.nome}</h3>
            <p className="muted">{product.descricao}</p>
            <p><strong>Porção:</strong> {product.porcao}</p>

            <button
              className="btn"
              onClick={() => {
                onAddToCart(product)
                onClose()
              }}
            >
              Adicionar ao carrinho – {formatBRL(product.preco)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
