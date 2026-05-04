import Link from 'next/link'

export default function VoidNotFound() {
  return (
    <section className="letter-card letter-empty-card">
      <p className="letter-card-title">这封信没有找到</p>
      <p className="letter-soft-copy">也许它被放进了别的信箱。</p>
      <Link className="letter-primary-button" href="/void">回到首页</Link>
    </section>
  )
}
