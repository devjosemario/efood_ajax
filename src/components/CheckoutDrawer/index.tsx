import { useEffect, useMemo, useState } from 'react'
import type { CartItem } from '../../models/Restaurant'

type Step = 'cart' | 'delivery' | 'payment' | 'confirm'

type DeliveryForm = {
  receiver: string
  address: string
  city: string
  cep: string
  number: string
  complement: string
}

type PaymentForm = {
  cardName: string
  cardNumber: string
  cvv: string
  expMonth: string
  expYear: string
}

type Props = {
  isOpen: boolean
  step: Step
  cart: CartItem[]
  onClose: () => void
  onRemoveItem: (productId: number) => void
  onSetStep: (step: Step) => void
  onClearCart: () => void
}

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

function calcTotal(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + item.product.preco * item.quantity, 0)
}

export default function CheckoutDrawer({
  isOpen,
  step,
  cart,
  onClose,
  onRemoveItem,
  onSetStep,
  onClearCart
}: Props) {
  const total = useMemo(() => calcTotal(cart), [cart])
  const [orderId, setOrderId] = useState<string>('')

  const [delivery, setDelivery] = useState<DeliveryForm>({
    receiver: '',
    address: '',
    city: '',
    cep: '',
    number: '',
    complement: ''
  })

  const [payment, setPayment] = useState<PaymentForm>({
    cardName: '',
    cardNumber: '',
    cvv: '',
    expMonth: '',
    expYear: ''
  })

  useEffect(() => {
    if (!isOpen) return

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [isOpen, onClose])

  useEffect(() => {
    if (step === 'confirm' && !orderId) {
      const id = Math.random().toString(16).slice(2, 10).toUpperCase()
      setOrderId(id)
    }
  }, [step, orderId])

  if (!isOpen) return null

  return (
    <>
      <div className="drawer-overlay is-open" onClick={onClose} />
      <aside className="drawer" aria-label="Checkout">
        <div className="drawer-header">
          {step === 'cart' && 'Carrinho'}
          {step === 'delivery' && 'Entrega'}
          {step === 'payment' && `Pagamento - Valor a pagar ${formatBRL(total)}`}
          {step === 'confirm' && `Pedido realizado - ${orderId}`}
        </div>

        <div className="drawer-body">
          {step === 'cart' && (
            <>
              {cart.length === 0 ? (
                <p className="help">Seu carrinho está vazio. Adicione itens pelo botão "Comprar o produto".</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div className="cart-item" key={item.product.id}>
                      <img src={item.product.foto} alt={item.product.nome} />
                      <div>
                        <h4>{item.product.nome}</h4>
                        <small>{formatBRL(item.product.preco)}</small>
                      </div>
                      <div className="cart-item-actions">
                        <button
                          className="trash"
                          aria-label="Remover item"
                          onClick={() => onRemoveItem(item.product.id)}
                          title="Remover"
                        >
                          🗑️
                        </button>
                        <small>Qtd: {item.quantity}</small>
                      </div>
                    </div>
                  ))}

                  <div className="total-row">
                    <span>Valor total</span>
                    <span>{formatBRL(total)}</span>
                  </div>
                </>
              )}
            </>
          )}

          {step === 'delivery' && (
            <>
              <div className="field">
                <label className="label">Quem irá receber</label>
                <input className="input" value={delivery.receiver} onChange={(e) => setDelivery({ ...delivery, receiver: e.target.value })} />
              </div>

              <div className="field">
                <label className="label">Endereço</label>
                <input className="input" value={delivery.address} onChange={(e) => setDelivery({ ...delivery, address: e.target.value })} />
              </div>

              <div className="field">
                <label className="label">Cidade</label>
                <input className="input" value={delivery.city} onChange={(e) => setDelivery({ ...delivery, city: e.target.value })} />
              </div>

              <div className="row">
                <div className="field">
                  <label className="label">CEP</label>
                  <input className="input" value={delivery.cep} onChange={(e) => setDelivery({ ...delivery, cep: e.target.value })} />
                </div>
                <div className="field">
                  <label className="label">Número</label>
                  <input className="input" value={delivery.number} onChange={(e) => setDelivery({ ...delivery, number: e.target.value })} />
                </div>
              </div>

              <div className="field">
                <label className="label">Complemento (opcional)</label>
                <input className="input" value={delivery.complement} onChange={(e) => setDelivery({ ...delivery, complement: e.target.value })} />
              </div>
            </>
          )}

          {step === 'payment' && (
            <>
              <div className="field">
                <label className="label">Nome no cartão</label>
                <input className="input" value={payment.cardName} onChange={(e) => setPayment({ ...payment, cardName: e.target.value })} />
              </div>

              <div className="row">
                <div className="field">
                  <label className="label">Número do cartão</label>
                  <input className="input" value={payment.cardNumber} onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })} />
                </div>
                <div className="field">
                  <label className="label">CVV</label>
                  <input className="input" value={payment.cvv} onChange={(e) => setPayment({ ...payment, cvv: e.target.value })} />
                </div>
              </div>

              <div className="row">
                <div className="field">
                  <label className="label">Mês de vencimento</label>
                  <input className="input" value={payment.expMonth} onChange={(e) => setPayment({ ...payment, expMonth: e.target.value })} />
                </div>
                <div className="field">
                  <label className="label">Ano de vencimento</label>
                  <input className="input" value={payment.expYear} onChange={(e) => setPayment({ ...payment, expYear: e.target.value })} />
                </div>
              </div>
            </>
          )}

          {step === 'confirm' && (
            <>
              <p className="help">
                Estamos felizes em informar que seu pedido já está em processo de preparação e, em breve, será entregue no endereço fornecido.
                <br /><br />
                Nossos entregadores não estão autorizados a realizar cobranças extras.
                <br /><br />
                Lembre-se de higienizar as mãos após o recebimento do pedido. Bom apetite!
              </p>
            </>
          )}
        </div>

        <div className="drawer-footer">
          {step === 'cart' && (
            <div className="actions">
              <button
                className="btn light"
                disabled={cart.length === 0}
                onClick={() => onSetStep('delivery')}
              >
                Continuar com a entrega
              </button>
              <button className="btn" onClick={onClose}>
                Fechar
              </button>
            </div>
          )}

          {step === 'delivery' && (
            <div className="actions">
              <button
                className="btn light"
                onClick={() => onSetStep('payment')}
              >
                Continuar com o pagamento
              </button>
              <button className="btn" onClick={() => onSetStep('cart')}>
                Voltar para o carrinho
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="actions">
              <button
                className="btn light"
                onClick={() => {
                  // Simula finalização
                  onClearCart()
                  onSetStep('confirm')
                }}
              >
                Finalizar pagamento
              </button>
              <button className="btn" onClick={() => onSetStep('delivery')}>
                Voltar para a edição de endereço
              </button>
            </div>
          )}

          {step === 'confirm' && (
            <div className="actions">
              <button
                className="btn light"
                onClick={() => {
                  onClose()
                  onSetStep('cart')
                  setOrderId('')
                }}
              >
                Concluir
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
