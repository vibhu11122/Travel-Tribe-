// ============================================================
// Payment Abstraction Layer
// MVP: Mock payment flow
// Future: Drop in Razorpay or Stripe
// ============================================================

export interface PaymentInitRequest {
  bookingId: string
  amount: number // in INR paise (amount * 100)
  currency?: string
  description: string
  customerName: string
  customerEmail: string
  customerPhone: string
}

export interface PaymentInitResponse {
  success: boolean
  paymentId?: string
  orderId?: string
  redirectUrl?: string
  error?: string
  isMock?: boolean
}

export interface PaymentVerifyRequest {
  paymentId: string
  orderId?: string
  signature?: string
  bookingId: string
}

export interface PaymentVerifyResponse {
  success: boolean
  verified: boolean
  error?: string
}

// ============================================================
// MOCK IMPLEMENTATION (MVP)
// ============================================================

export async function initiatePayment(
  request: PaymentInitRequest
): Promise<PaymentInitResponse> {
  // Simulate payment gateway delay
  await new Promise((r) => setTimeout(r, 800))

  // Mock: Always succeeds
  const mockPaymentId = `mock_pay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
  const mockOrderId = `mock_order_${request.bookingId}`

  return {
    success: true,
    paymentId: mockPaymentId,
    orderId: mockOrderId,
    redirectUrl: `/book/confirmation?bookingId=${request.bookingId}&paymentId=${mockPaymentId}`,
    isMock: true,
  }
}

export async function verifyPayment(
  request: PaymentVerifyRequest
): Promise<PaymentVerifyResponse> {
  // Mock: Always verifies
  await new Promise((r) => setTimeout(r, 500))

  return {
    success: true,
    verified: true,
  }
}

// ============================================================
// FUTURE: Razorpay Integration
// ============================================================
// import Razorpay from 'razorpay'
// 
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID!,
//   key_secret: process.env.RAZORPAY_KEY_SECRET!,
// })
// 
// export async function initiatePaymentRazorpay(request: PaymentInitRequest) {
//   const order = await razorpay.orders.create({
//     amount: request.amount,
//     currency: request.currency || 'INR',
//     receipt: request.bookingId,
//     notes: { description: request.description },
//   })
//   return { success: true, orderId: order.id, isMock: false }
// }
// 
// export async function verifyPaymentRazorpay(request: PaymentVerifyRequest) {
//   const body = `${request.orderId}|${request.paymentId}`
//   const crypto = await import('crypto')
//   const expectedSig = crypto
//     .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
//     .update(body)
//     .digest('hex')
//   return { success: true, verified: expectedSig === request.signature }
// }
