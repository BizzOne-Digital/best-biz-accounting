import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";

export default function NotFound() {
  return (
    <section className="bg-brand-cream py-24">
      <Container className="max-w-xl text-center">
        <p className="font-serif text-6xl font-bold text-brand-orange">404</p>
        <h1 className="mt-4 font-serif text-3xl font-bold text-brand-dark">Page not found</h1>
        <p className="mt-3 text-brand-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/">Back to Home</ButtonLink>
          <ButtonLink href="/contact" variant="outline">
            Contact Us
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
