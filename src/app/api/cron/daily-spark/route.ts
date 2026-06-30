export async function GET() {
  return Response.json({
    ok: true,
    name: '汉堡',
    message: 'Burger archive heartbeat.',
  })
}
